# Git Scripts

This directory contains scripts for managing Git hooks and version information.

## Windows Scripts (.bat)

- **InstallHooks.bat**: Installs the post-merge hook for Windows
- **UpdateVersion.bat**: Updates version information from Git for Windows

## Linux Scripts (.sh)

- **InstallHooks.sh**: Installs the post-merge hook for Linux/macOS
- **UpdateVersion.sh**: Updates version information from Git for Linux/macOS

## Git Hook

- **post-merge**: Git hook that automatically runs after a merge, detects the OS, and executes the appropriate UpdateVersion script

## Usage

### Installing the Hook

**Windows:**
```batch
cd Build\Git
InstallHooks.bat
```

**Linux/macOS:**
```bash
cd Build/Git
./InstallHooks.sh
```

### Manually Updating Version

**Windows:**
```batch
cd Build\Git
UpdateVersion.bat
```

**Linux/macOS:**
```bash
cd Build/Git
./UpdateVersion.sh
```

## How It Works

The scripts read the template file `Partitura/LisaVoce.arp/VersionInfo.acc.xtrsvn` and generate `VersionInfo.acc` with:
- `$WCREV$` replaced with the Git revision count
- `$WCMODS?1:0$` replaced with 1 (dirty) or 0 (clean) based on working directory status

The post-merge hook automatically runs the appropriate version update script after each Git merge operation.
