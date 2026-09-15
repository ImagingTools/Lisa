# SPDX-License-Identifier: LGPL-2.1-or-later OR GPL-2.0-or-later OR GPL-3.0-or-later OR LicenseRef-ImtCore-Commercial
<#
.SYNOPSIS
    Runs the Lisa GUI (Playwright) suite end to end on a CI agent.

.DESCRIPTION
    Restores both databases the suite needs from real backups, starts
    PumaServerPgTest.exe and LisaServerTest.exe, bootstraps the "su"
    superuser, runs Playwright in two phases, and tears everything down
    again.

    Why a full restore rather than letting the servers migrate an empty
    schema: the collection specs need real rows to filter, sort and
    paginate, and the editor specs need a populated feature collection to
    pick dependencies and product features from. Both databases therefore
    go through the same drop + create + pg_restore path.

    Why two phases: every test runs as the same fixture user against one
    shared database, so a test that MUTATES data changes rows that other
    tests are looking at. Phase 1 runs everything except @mutating, phase 2
    runs only @mutating. The suite passes only if both do.

.PARAMETER PlaywrightArgs
    Appended verbatim to "npx playwright test" - e.g. a spec path to scope
    the run ('tests/features.collection.test.js'), or --update-snapshots to
    (re)generate baselines.
#>
param(
    # Same rationale as ProLife's own Run-CiTests.ps1: resolved from LISADIR
    # when that points at a real checkout, then the working directory, then
    # this script's own location - so it works both from TeamCity (which sets
    # the env var) and from a developer shell.
    [string]$RepoRoot = $(
        $configRelPath = "Tests\LisaGui\playwright.config.js"
        if ($env:LISADIR -and (Test-Path (Join-Path $env:LISADIR $configRelPath))) {
            $env:LISADIR
        }
        elseif (Test-Path (Join-Path (Get-Location).Path $configRelPath)) {
            (Get-Location).Path
        }
        else {
            $sd = if ($PSScriptRoot) { $PSScriptRoot }
                  elseif ($PSCommandPath) { Split-Path -Parent $PSCommandPath }
                  elseif ($MyInvocation.MyCommand.Path) { Split-Path -Parent $MyInvocation.MyCommand.Path }
                  else { $null }
            if ($sd) {
                (Resolve-Path (Join-Path $sd "..\..")).Path
            }
            else {
                throw "Unable to determine the Lisa checkout root (LISADIR unset/stale, working directory isn't the checkout root, and this script's own path could not be determined). Pass -RepoRoot explicitly."
            }
        }
    ),
    [string]$ScriptDir = (Join-Path $RepoRoot "Tests\LisaGui"),

    # Only a Debug build of LisaServerTest.exe exists for these test servers
    # (there is no Release configuration of them), unlike ProLife's suite,
    # whose default is Release.
    [string]$BuildConfig = "Debug_Qt6_VC17_x64",

    # Puma is checked out as a sibling of Lisa - the same convention PUMADIR/
    # LISADIR already encode.
    [string]$PumaRepoRoot = $(if ($env:PUMADIR) { $env:PUMADIR } else { Join-Path (Split-Path -Parent $RepoRoot) "Puma" }),

    [string]$LisaServerExePath = "",
    [string]$PumaServerExePath = "",

    # LisaServerTest.acc's DefaultHttpPort / DefaultPumaHttpPort.
    [int]$HttpPort = 17776,
    [int]$PumaHttpPort = 17788,

    # LisaServerTest.acc's DbName, and the Puma test database it talks to.
    [string]$LisaDbName = "lisa_test",
    [string]$PumaDbName = "puma_test",
    [string]$DbHost = "localhost",
    [int]$DbPort = 5432,
    [string]$DbUser = "postgres",
    [string]$DbPassword = "root",

    # The same backups Tests\Startup\01-reset-db.* restores for the container run.
    [string]$LisaBackupPath = (Join-Path $RepoRoot "Tests\Resources\backups\lisa.backup"),
    [string]$PumaBackupPath = (Join-Path $RepoRoot "Tests\Resources\backups\puma.backup"),

    # Safety net only - puma.backup already carries a working "su" account.
    # The login is always "su" (hardcoded here and in fixtures/users.js); only
    # the password is configurable.
    [string]$SuPassword = "1",

    [string]$PsqlPath = "",
    # Everything a run writes lives under ONE directory, one subfolder per phase:
    #   test-output/phase1-readonly/{artifacts,junit.xml}
    #   test-output/phase2-mutating/{artifacts,junit.xml}
    # Per-PHASE because Playwright clears its output dir and truncates its junit file at the
    # start of every invocation, so one shared pair would let phase 2 wipe phase 1's evidence.
    [string]$OutputRoot = (Join-Path $ScriptDir "test-output"),
    [int]$StartupTimeoutSeconds = 120,

    [string[]]$PlaywrightArgs = @()
)

$ErrorActionPreference = "Stop"
$lisaProcess = $null
$pumaProcess = $null
$exitCode = 1

if ([string]::IsNullOrWhiteSpace($LisaServerExePath)) {
    $LisaServerExePath = Join-Path $RepoRoot "Bin\$BuildConfig\LisaServerTest.exe"
}
if ([string]::IsNullOrWhiteSpace($PumaServerExePath)) {
    $PumaServerExePath = Join-Path $PumaRepoRoot "Bin\$BuildConfig\PumaServerPgTest.exe"
}

function Write-Step($message) {
    Write-Host "`n=== $message ===" -ForegroundColor Cyan
}

function Resolve-PsqlPath {
    if (-not [string]::IsNullOrWhiteSpace($PsqlPath)) {
        if (-not (Test-Path $PsqlPath)) { throw "psql not found at explicit path: $PsqlPath" }
        return $PsqlPath
    }

    $onPath = Get-Command psql.exe -ErrorAction SilentlyContinue
    if ($onPath) { return $onPath.Source }

    $candidates = Get-ChildItem "$env:ProgramFiles\PostgreSQL\*\bin\psql.exe" -ErrorAction SilentlyContinue |
        Sort-Object { [int]([regex]::Match($_.Directory.Parent.Name, '\d+').Value) } -Descending
    if ($candidates) { return $candidates[0].FullName }

    throw "Could not locate psql.exe. Pass -PsqlPath explicitly or add PostgreSQL\bin to PATH on this agent."
}

function Stop-ServerProcess([string]$processName) {
    Write-Step "Stopping any running $processName.exe"
    Get-Process -Name $processName -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Host "Killing PID $($_.Id)"
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
}

function Reset-Database([string]$name) {
    Write-Step "Resetting database '$name'"
    $psql = Resolve-PsqlPath
    Write-Host "Using psql: $psql"
    $env:PGPASSWORD = $DbPassword
    # psql writes routine NOTICEs (e.g. "database does not exist, skipping") to
    # stderr, and under $ErrorActionPreference = "Stop" PowerShell 5.1 turns ANY
    # stderr line from a native command into a terminating NativeCommandError
    # regardless of its exit code - so this runs under "Continue" and is judged
    # solely by $LASTEXITCODE.
    $previousEap = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try {
        & $psql -h $DbHost -p $DbPort -U $DbUser -d postgres -v ON_ERROR_STOP=1 -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$name' AND pid <> pg_backend_pid();" 2>&1 | Write-Host
        & $psql -h $DbHost -p $DbPort -U $DbUser -d postgres -v ON_ERROR_STOP=1 -c "DROP DATABASE IF EXISTS $name;" 2>&1 | Write-Host
        if ($LASTEXITCODE -ne 0) { throw "Failed to drop database '$name' (exit $LASTEXITCODE)" }
    }
    finally {
        $ErrorActionPreference = $previousEap
        Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    }
}

function Restore-DatabaseFromBackup([string]$name, [string]$backupPath) {
    if (-not (Test-Path $backupPath)) {
        throw "Backup file not found: $backupPath"
    }

    Reset-Database $name

    Write-Step "Creating database '$name'"
    $psql = Resolve-PsqlPath
    $pgRestore = Join-Path (Split-Path -Parent $psql) "pg_restore.exe"
    if (-not (Test-Path $pgRestore)) { throw "pg_restore not found next to psql: $pgRestore" }

    # Same stderr/NativeCommandError pitfall as Reset-Database: pg_restore
    # --verbose writes its progress log to stderr even on a clean restore.
    $env:PGPASSWORD = $DbPassword
    $previousEap = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try {
        & $psql -h $DbHost -p $DbPort -U $DbUser -d postgres -v ON_ERROR_STOP=1 -c "CREATE DATABASE $name OWNER $DbUser;" 2>&1 | Write-Host
        if ($LASTEXITCODE -ne 0) { throw "Failed to create database '$name' (exit $LASTEXITCODE)" }

        Write-Step "Restoring '$name' from $backupPath"
        & $pgRestore -h $DbHost -p $DbPort -U $DbUser -d $name --verbose $backupPath 2>&1 | Write-Host
        if ($LASTEXITCODE -ne 0) { throw "pg_restore failed for '$name' (exit $LASTEXITCODE)" }
    }
    finally {
        $ErrorActionPreference = $previousEap
        Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    }
}

function Wait-ForPort([string]$serverLabel, [System.Diagnostics.Process]$process, [int]$port) {
    $deadline = (Get-Date).AddSeconds($StartupTimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        if ($process.HasExited) {
            throw "$serverLabel exited prematurely (exit code $($process.ExitCode))"
        }
        $probe = Test-NetConnection -ComputerName "localhost" -Port $port -WarningAction SilentlyContinue -InformationLevel Quiet
        if ($probe) { return }
        Start-Sleep -Milliseconds 500
    }
    throw "$serverLabel did not open port $port within $StartupTimeoutSeconds seconds"
}

function Start-PumaTestServer {
    Write-Step "Starting PumaServerPgTest.exe"
    if (-not (Test-Path $PumaServerExePath)) {
        throw "Server executable not found: $PumaServerExePath"
    }
    $workDir = Split-Path -Parent $PumaServerExePath
    $script:pumaProcess = Start-Process -FilePath $PumaServerExePath -WorkingDirectory $workDir -PassThru -WindowStyle Hidden
    Write-Host "Started PID $($script:pumaProcess.Id)"
    Wait-ForPort "PumaServerPgTest.exe" $script:pumaProcess $PumaHttpPort
    Write-Host "Puma test server is accepting connections on port $PumaHttpPort"
}

function Start-LisaTestServer {
    Write-Step "Starting LisaServerTest.exe"
    if (-not (Test-Path $LisaServerExePath)) {
        throw "Server executable not found: $LisaServerExePath"
    }
    $workDir = Split-Path -Parent $LisaServerExePath
    $script:lisaProcess = Start-Process -FilePath $LisaServerExePath -WorkingDirectory $workDir -PassThru -WindowStyle Hidden
    Write-Host "Started PID $($script:lisaProcess.Id)"
    Wait-ForPort "LisaServerTest.exe" $script:lisaProcess $HttpPort
    Write-Host "Lisa test server is accepting connections on port $HttpPort"
}

function New-SuperuserIfNeeded {
    Write-Step "Bootstrapping 'su' superuser via CreateSuperuser"
    $body = @{
        query = 'mutation CreateSuperuser { CreateSuperuser(input: { password: "' + $SuPassword + '", mail: "su@lisagui.test", name: "Super User" }) { success message } }'
    } | ConvertTo-Json -Compress

    $uri = "http://localhost:$HttpPort/Lisa/graphql"

    # Retried, because an open port is not the same as a usable server: Lisa starts accepting on
    # 17776 before its link to Puma is up, and every auth-backed call until then answers with a
    # Warning "Response is invalid" and no payload. Measured twice - once here and once by hand.
    # Anything that is a real refusal still stops the run on the first try.
    $attempts = 10
    for ($attempt = 1; $attempt -le $attempts; $attempt++) {
        $response = Invoke-RestMethod -Uri $uri -Method Post -ContentType "application/json" -Body $body

        # Warning-level entries are not refusals - the server reports them alongside a perfectly good
        # payload (seen live: a Warning "Response is invalid" on a call that had already answered
        # "Superuser already exists"). Treating every `errors` entry as fatal aborted a whole run at
        # the bootstrap step over one of those. Only a real error, or a payload that actually says it
        # failed, stops the run.
        $refusals = @($response.errors | Where-Object { $_ -and $_.extensions.type -ne "Warning" })
        if ($refusals.Count -gt 0) {
            throw "CreateSuperuser GraphQL call failed: $($refusals | ConvertTo-Json -Compress)"
        }

        $result = $response.data.CreateSuperuser
        if ($null -ne $result) {
            # "Superuser already exists" is expected and harmless - puma.backup carries one.
            if (-not $result.success -and $result.message -notmatch "already exists") {
                throw "CreateSuperuser did not succeed: $($result.message)"
            }
            Write-Host "CreateSuperuser: $($result.message)"
            return
        }

        if ($attempt -lt $attempts) {
            Write-Host "CreateSuperuser has no payload yet (attempt $attempt/$attempts) - the server is still wiring up; retrying"
            Start-Sleep -Seconds 3
        }
    }

    throw "CreateSuperuser returned no payload after $attempts attempts: $($response | ConvertTo-Json -Compress)"
}

function Install-PlaywrightIfNeeded {
    # @playwright/test is a local devDependency rather than assumed present on
    # the agent. Browser binaries are cached outside node_modules, so
    # "playwright install" is safe to call unconditionally - it no-ops when the
    # browser is already there. npm/npx write progress to stderr, the same
    # NativeCommandError pitfall as psql above.
    $previousEap = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try {
        if (-not (Test-Path (Join-Path $ScriptDir "node_modules\@playwright\test"))) {
            Write-Step "Installing Playwright (npm install in $ScriptDir)"
            Push-Location $ScriptDir
            try {
                & npm install --no-audit --no-fund 2>&1 | Out-Host
                if ($LASTEXITCODE -ne 0) { throw "npm install failed (exit $LASTEXITCODE)" }
            }
            finally {
                Pop-Location
            }
        }

        Write-Step "Ensuring Playwright's Chromium browser is installed"
        Push-Location $ScriptDir
        try {
            & npx playwright install chromium 2>&1 | Out-Host
            if ($LASTEXITCODE -ne 0) { throw "playwright install failed (exit $LASTEXITCODE)" }
        }
        finally {
            Pop-Location
        }
    }
    finally {
        $ErrorActionPreference = $previousEap
    }
}

function Sync-GuiTestKit {
    # imtcore-gui-testkit is a "file:" devDependency, which npm COPIES into
    # node_modules rather than symlinking (see .npmrc's install-links=true). An
    # edit to ImtCore/Tests/GuiTestKit/** is therefore invisible here until
    # something re-copies it, and `npm install` only re-copies when the
    # dependency line itself changes - so a kit edit without a version bump
    # would silently run against a stale copy. Mirror it before every run.
    $kitSource = Join-Path $RepoRoot "..\ImtCore\Tests\GuiTestKit"
    if (-not (Test-Path $kitSource)) {
        Write-Host "Sync-GuiTestKit: source not found at $kitSource - skipping (using node_modules copy as-is)"
        return
    }
    $kitDest = Join-Path $ScriptDir "node_modules\imtcore-gui-testkit"

    Write-Step "Syncing imtcore-gui-testkit into node_modules (file: dependency is copied, not symlinked)"
    & robocopy $kitSource $kitDest /MIR /NFL /NDL /NJH /NJS /XD node_modules | Out-Host
    # Robocopy exit codes 0-7 are all success (a bitmask: copied / removed /
    # mismatched); only >= 8 is a real failure. $LASTEXITCODE must be read
    # immediately, before any other command runs.
    $robocopyExit = $LASTEXITCODE
    if ($robocopyExit -ge 8) {
        throw "Sync-GuiTestKit: robocopy failed copying $kitSource -> $kitDest (exit code $robocopyExit)"
    }
}

function Invoke-PlaywrightSuite {
    Install-PlaywrightIfNeeded
    Sync-GuiTestKit

    & node (Join-Path $ScriptDir "node_modules\imtcore-gui-testkit\scripts\prepare-output.js") $OutputRoot | Out-Host
    if ($LASTEXITCODE -ne 0) { throw "Failed to prepare GUI test output (exit $LASTEXITCODE)" }

    Write-Step "Running Playwright suite"
    Push-Location $ScriptDir
    # Same stderr/NativeCommandError pitfall as psql and pg_restore above, and it bites here too: node
    # writes warnings to stderr for things that are not failures at all (seen live: "The 'NO_COLOR' env
    # is ignored due to the 'FORCE_COLOR' env being set"), and $ErrorActionPreference = "Stop" turns any
    # such line into a TERMINATING error - which killed the run between the two phases, after phase 1
    # had finished and written its report, so it looked like phase 2 simply never existed. Judge these
    # by $LASTEXITCODE only.
    $previousEap = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try {
        # playwright.config.js switches to the junit/html reporters (reading the
        # PLAYWRIGHT_* vars set per phase below) whenever CI is set, and turns on
        # forbidOnly - matching how this suite is meant to run unattended.
        $env:CI = "true"
        $env:LISA_BASE_URL = "http://localhost:$HttpPort"
        $env:PLAYWRIGHT_OUTPUT_ROOT = $OutputRoot
        try {
            $env:PLAYWRIGHT_OUTPUT_PHASE = "phase1-readonly"
            Write-Step "Playwright phase 1/2: read-only tests"
            & npx playwright test @PlaywrightArgs --grep-invert '@mutating' | Out-Host
            $phase1 = $LASTEXITCODE

            $env:PLAYWRIGHT_OUTPUT_PHASE = "phase2-mutating"
            Write-Step "Playwright phase 2/2: @mutating tests"
            # global-setup runs again on this second invocation (Playwright keeps
            # no memory across CLI runs); LISA_GUI_REUSE_AUTH tells it to skip
            # re-logging in a user whose storageState phase 1 produced moments ago
            # against this same running server. Phase 1 always logs in fresh, so a
            # broken login still fails loudly rather than being skipped.
            $env:LISA_GUI_REUSE_AUTH = "1"
            & npx playwright test @PlaywrightArgs --grep '@mutating' --workers=1 | Out-Host
            $phase2 = $LASTEXITCODE
            Remove-Item Env:\LISA_GUI_REUSE_AUTH -ErrorAction SilentlyContinue

            if ($phase1 -ne 0) { return $phase1 }
            return $phase2
        }
        finally {
            Remove-Item Env:\CI -ErrorAction SilentlyContinue
            Remove-Item Env:\LISA_BASE_URL -ErrorAction SilentlyContinue
            Remove-Item Env:\PLAYWRIGHT_OUTPUT_ROOT -ErrorAction SilentlyContinue
            Remove-Item Env:\PLAYWRIGHT_OUTPUT_PHASE -ErrorAction SilentlyContinue
        }
    }
    finally {
        $ErrorActionPreference = $previousEap
        Pop-Location
    }
}

Write-Step "Resolved paths"
Write-Host "RepoRoot:          $RepoRoot"
Write-Host "PumaRepoRoot:      $PumaRepoRoot"
Write-Host "ScriptDir:         $ScriptDir"
Write-Host "LisaServerExePath: $LisaServerExePath"
Write-Host "PumaServerExePath: $PumaServerExePath"
Write-Host "LisaBackupPath:    $LisaBackupPath"
Write-Host "PumaBackupPath:    $PumaBackupPath"
Write-Host "OutputRoot:        $OutputRoot"

try {
    # Stop stale processes from a previous, possibly crashed run before touching
    # any database: Lisa talks to Puma over HTTP, so a stale Puma still bound to
    # the port would make the new instance fail to start rather than be used.
    Stop-ServerProcess "LisaServerTest"
    Stop-ServerProcess "PumaServerPgTest"

    Restore-DatabaseFromBackup $PumaDbName $PumaBackupPath
    Start-PumaTestServer

    Restore-DatabaseFromBackup $LisaDbName $LisaBackupPath
    Start-LisaTestServer
    New-SuperuserIfNeeded

    $exitCode = Invoke-PlaywrightSuite
}
finally {
    # Reverse start order: Lisa depends on Puma being up, not the other way round.
    if ($lisaProcess -and -not $lisaProcess.HasExited) {
        Write-Step "Stopping LisaServerTest.exe (PID $($lisaProcess.Id))"
        Stop-Process -Id $lisaProcess.Id -Force -ErrorAction SilentlyContinue
    }
    if ($pumaProcess -and -not $pumaProcess.HasExited) {
        Write-Step "Stopping PumaServerPgTest.exe (PID $($pumaProcess.Id))"
        Stop-Process -Id $pumaProcess.Id -Force -ErrorAction SilentlyContinue
    }
}

if ($exitCode -eq 0) {
    Write-Host "`nAll tests passed." -ForegroundColor Green
} else {
    Write-Host "`nTest run failed (Playwright exit code $exitCode)." -ForegroundColor Red
}

exit $exitCode
