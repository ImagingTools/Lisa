cmake_minimum_required(VERSION 3.1.0)

project(LisaAll)

if(NOT DEFINED QT_VERSION_MAJOR)
	find_package(QT NAMES Qt6 Qt5 COMPONENTS Core)
	find_package("Qt${QT_VERSION_MAJOR}" COMPONENTS Core Widgets QuickWidgets Core Gui Xml Network Svg Sql WebSockets Qml Concurrent REQUIRED)
	if(QT_VERSION_MAJOR EQUAL 6)
		find_package("Qt${QT_VERSION_MAJOR}" COMPONENTS Core5Compat REQUIRED)
	endif()
endif()

if(NOT DEFINED IMTCOREDIR)
	set(IMTCOREDIR "$ENV{IMTCOREDIR}")
endif()

if(NOT DEFINED PUMADIR)
	set(PUMADIR "$ENV{PUMADIR}")
endif()

include(${IMTCOREDIR}/Config/CMake/ImtCoreEnv.cmake)

if(NOT DEFINED LISADIR)
	set(LISADIR "$ENV{LISADIR}")
endif()

set(INCLUDE_DIR "${CMAKE_CURRENT_LIST_DIR}/../../Include")
set(IMPL_DIR "${CMAKE_CURRENT_LIST_DIR}/../../Impl")
set(AUX_INCLUDE_DIR "${CMAKE_CURRENT_LIST_DIR}/../../AuxInclude/${TARGETNAME}/GeneratedFiles")

include_directories("${AUX_INCLUDE_DIR}/../")

# Include

add_subdirectory("${INCLUDE_DIR}/lisadb/CMake" "${AUX_INCLUDE_DIR}/lisadb")
add_subdirectory("${INCLUDE_DIR}/lisaqml/CMake" "${AUX_INCLUDE_DIR}/lisaqml")

# Plug-ins
add_subdirectory("${IMPL_DIR}/Plugins/LisaSettingsPlugin/CMake" "${AUX_INCLUDE_DIR}/LisaSettingsPlugin")

# Impl
add_subdirectory("${IMPL_DIR}/LisaDbPck/CMake" "${AUX_INCLUDE_DIR}/LisaDbPck")
add_subdirectory("${IMPL_DIR}/LisaLoc/CMake" "${AUX_INCLUDE_DIR}/LisaLoc")
add_subdirectory("${IMPL_DIR}/LisaQmlExe/CMake" "${AUX_INCLUDE_DIR}/LisaQmlExe")
add_subdirectory("${IMPL_DIR}/LisaClient/CMake" "${AUX_INCLUDE_DIR}/LisaClient")
add_subdirectory("${IMPL_DIR}/LisaServer/CMake" "${AUX_INCLUDE_DIR}/LisaServer")
add_subdirectory("${IMPL_DIR}/LisaServerConfigurator/CMake" "${AUX_INCLUDE_DIR}/LisaServerConfigurator")
#add_subdirectory("${IMPL_DIR}/LisaConverter/CMake" "${AUX_INCLUDE_DIR}/LisaConverter")

