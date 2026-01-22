# Lisa - License and Product Management System

Lisa is a comprehensive license and product management system built with C++ and Qt, providing server/client infrastructure for managing software licenses, product features, permissions, and localization across desktop and web platforms.

## Overview

Lisa provides a complete solution for software license management, including:
- Server-based license validation and management
- Desktop and web-based client applications
- SDK for integrating license control into your applications
- GraphQL API for modern web integrations
- Multi-platform support (Windows, Linux, macOS)

## Main Components

### Core Libraries (`Include/`)
- **lisadb** - Database component for license and product data management
- **lisaqml** - QML (Qt/JavaScript) user interface components for web and desktop applications
- **lisa** - Core library with version information

### Applications (`Impl/`)
- **LisaServer** - Core server application handling license and product operations
- **LisaClient** - Qt-based desktop client for end users
- **LisaServerConfigurator** - Configuration tool for the server
- **LisaQmlExe** - QML-based executable for web UI rendering
- **LisaSdk** - C++ SDK for integrating license control into applications
- **LisaConverter** - Data conversion utilities
- **LisaDbPck** - Database packing/serialization
- **LisaLoc** - Localization/internationalization handling

### Plugins
- **LisaSettingsPlugin** - Settings management plugin

## Features

### License Management
- **License Validation** - Verify software licenses using public key cryptography
- **Feature Control** - Manage product features and permissions
- **Expiration Handling** - Time-limited licenses with expiration dates
- **License Import/Export** - Import and manage license files

### Multi-Platform Support
- Windows (Visual Studio 2015/2017/2019 compilers)
- Linux
- macOS
- Web browsers (via QML/WebAssembly)

### Modern Architecture
- **GraphQL API** - Modern API for querying license and product data
- **WebSockets** - Real-time communication support
- **QML/Qt Quick** - Cross-platform UI framework
- **SQL Database** - Robust data storage

### Developer SDK
The Lisa SDK (`LisaSdk`) provides a simple C++ API for integrating license checking:

```cpp
#include <LisaSdk.h>

// Initialize with license file and public key
LisaSdk::CLicenseController controller("path/to/license.lic", publicKey);

// Get available features
auto features = controller.GetFeatureList();

// Check for specific features
for (const auto& feature : features) {
    qDebug() << "Feature:" << feature.name 
             << "Expires:" << feature.expiration;
}
```

## Architecture

### Domain Model (`Partitura/`)
Lisa uses `.arp` (Partitura) files for domain modeling:
- **LisaVoce.arp** - Core domain model (Products, Licenses, Features, Repositories, Permissions)
- **LisaQmlVoce.arp** - UI logic (Server/Client pages, handlers, application settings)
- **LisaGraphQlVoce.arp** - GraphQL API engine for querying license/product data

### Server-Client Architecture
1. **Server** manages all license data, validates requests, and enforces permissions
2. **Clients** (Desktop/Web) query the server for feature availability
3. **SDK** allows applications to check licenses locally using encrypted license files

## Build Requirements

### Dependencies
- **Qt 5 or Qt 6** - Core framework
  - Components: Core, Widgets, QuickWidgets, Gui, Xml, Network, Svg, Sql, WebSockets, Qml, Concurrent, QuickControls2
  - Qt 6 additionally requires Core5Compat
- **ImtCore** - ImagingTools Core framework
- **PUMA** - Required library
- **CMake 3.26+** - Build system

### Environment Variables
Set the following environment variables:
- `IMTCOREDIR` - Path to ImtCore installation
- `PUMADIR` - Path to PUMA installation
- `LISADIR` - Path to Lisa installation (optional)
- `QTDIR` - Path to Qt installation

### Build Tools
- **Windows**: Visual Studio 2015, 2017, or 2019
- **Linux/macOS**: GCC or Clang with C++11 support
- **Doxygen** - For documentation generation (optional)
- **Inno Setup** - For creating installers (Windows, optional)

## Building

### Using CMake

```bash
# Set environment variables
export IMTCOREDIR=/path/to/ImtCore
export PUMADIR=/path/to/PUMA
export QTDIR=/path/to/Qt

# Create build directory
cd Build/CMake
mkdir build && cd build

# Configure and build
cmake ..
cmake --build .
```

### Build Options
- `WEB_COMPILE` - Build with web compatibility (default: ON)
- `QT_VERSION_MAJOR` - Specify Qt version (5 or 6)

## Directory Structure

```
Lisa/
├── Build/          # Build configurations and scripts
│   ├── CMake/      # CMake build files
│   ├── Git/        # Git hooks and version management
│   ├── QMake/      # QMake build files (legacy)
│   └── VC*/        # Visual Studio project files
├── Config/         # Configuration files
├── Docs/           # Documentation
├── Impl/           # Implementation modules
│   ├── LisaServer/           # Server application
│   ├── LisaClient/           # Desktop client
│   ├── LisaSdk/              # C++ SDK
│   ├── LisaServerConfigurator/ # Server configuration tool
│   └── Plugins/              # Plugin modules
├── Include/        # Public header files
│   ├── lisa/       # Core library headers
│   ├── lisadb/     # Database headers
│   └── lisaqml/    # QML component headers
├── Install/        # Installation scripts and packages
└── Partitura/      # Domain model files (.arp)
```

## Version Management

Lisa uses Git hooks to automatically manage version information. See [Build/Git/README.md](Build/Git/README.md) for details on:
- Installing Git hooks
- Automatic version updates on merge
- Manual version updates

## License

Lisa is available under multiple licensing options:
- **Enterprise/Commercial License** - For commercial use
- **LGPL** - For open-source projects compatible with LGPL
- **Open Source** - Source code distribution

See the `Install/` directory for license details.

## Getting Started

### For Application Developers (Using the SDK)

1. Install Lisa SDK
2. Include the SDK header in your application
3. Link against the Lisa SDK library
4. Initialize `CLicenseController` with your license file and public key
5. Query available features and enforce license restrictions

### For License Administrators

1. Install and configure LisaServer
2. Use LisaServerConfigurator to set up your license database
3. Generate and distribute license files to clients
4. Monitor license usage through the server interface

### For End Users

1. Install the LisaClient application or access the web interface
2. Import your license file
3. View available features and expiration dates

## Documentation

- API documentation can be generated using Doxygen (see `Install/Doxyfile`)
- Git hook documentation: [Build/Git/README.md](Build/Git/README.md)

## Support

For more information about ImagingTools products and licensing, please visit the ImagingTools GmbH website.
