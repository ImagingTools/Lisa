cmake_minimum_required(VERSION 3.26)

project(LisaAll)

if(NOT DEFINED QT_VERSION_MAJOR)
	find_package(QT NAMES Qt6 Qt5 COMPONENTS Core)
	find_package("Qt${QT_VERSION_MAJOR}" COMPONENTS Core Widgets QuickWidgets Core Gui Xml Network Svg Sql WebSockets Qml Concurrent QuickControls2 REQUIRED)
	if(QT_VERSION_MAJOR EQUAL 6)
		find_package("Qt${QT_VERSION_MAJOR}" COMPONENTS Core5Compat REQUIRED)
	endif()
endif()

if(NOT DEFINED WEB_COMPILE)
	set(WEB_COMPILE ON CACHE BOOL "Build whith web compatibility")
endif()

if(NOT DEFINED BUILDDIR)
	set(BUILDDIR "${CMAKE_CURRENT_LIST_DIR}/../../..")
endif()

if(NOT DEFINED IMTCOREDIR)
	set(IMTCOREDIR "$ENV{IMTCOREDIR}")
endif()

if(NOT DEFINED IMTCOREDIR_BUILD)
	set(IMTCOREDIR_BUILD "$ENV{IMTCOREDIR_BUILD}")
endif()

if(NOT DEFINED PUMADIR)
	set(PUMADIR "$ENV{PUMADIR}")
endif()

include(${IMTCOREDIR}/Config/CMake/ImtCoreEnv.cmake)
include(${IMTCOREDIR}/Config/CMake/PartituraUpgrade.cmake)
imt_core_upgrade_partitura("${CMAKE_CURRENT_LIST_DIR}/../..")

if(NOT DEFINED LISADIR)
	set(LISADIR "$ENV{LISADIR}")
endif()


set(INCLUDE_DIR "${CMAKE_CURRENT_LIST_DIR}/../../Include")
set(IMPL_DIR "${CMAKE_CURRENT_LIST_DIR}/../../Impl")

set(AUX_INCLUDE_DIR "${BUILDDIR}/Lisa/AuxInclude/${TARGETNAME}/GeneratedFiles")

include_directories("${AUX_INCLUDE_DIR}/../")
include_directories("${AUX_INCLUDE_DIR}/")

# Include

add_subdirectory("${INCLUDE_DIR}/lisadb/CMake" "${AUX_INCLUDE_DIR}/lisadb")
add_subdirectory("${INCLUDE_DIR}/lisaqml/CMake" "${AUX_INCLUDE_DIR}/lisaqml")

# Plug-ins
add_subdirectory("${IMPL_DIR}/Plugins/LisaSettingsPlugin/CMake" "${AUX_INCLUDE_DIR}/LisaSettingsPlugin")

# Impl
add_subdirectory("${IMPL_DIR}/LisaDbPck/CMake" "${AUX_INCLUDE_DIR}/LisaDbPck")
add_subdirectory("${IMPL_DIR}/LisaLoc/CMake" "${AUX_INCLUDE_DIR}/LisaLoc")
add_subdirectory("${IMPL_DIR}/LisaClient/CMake" "${AUX_INCLUDE_DIR}/LisaClient")
add_subdirectory("${IMPL_DIR}/LisaServer/CMake" "${AUX_INCLUDE_DIR}/LisaServer")
add_subdirectory("${IMPL_DIR}/LisaServerConfigurator/CMake" "${AUX_INCLUDE_DIR}/LisaServerConfigurator")

