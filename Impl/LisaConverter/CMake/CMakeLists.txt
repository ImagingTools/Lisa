project(LisaConverter LANGUAGES CXX)

message(VERBOSE "ACFDIR PROLIFE " ${ACFDIR})
message(VERBOSE "CMAKE_PROJECT_INCLUDE_BEFORE " ${CMAKE_PROJECT_INCLUDE_BEFORE})

set(ARXC_CONFIG "${PROJECT_SOURCE_DIR}/../../../Config/Lisa.awc")
set(ARXC_FILES "${PROJECT_SOURCE_DIR}/../${PROJECT_NAME}.acc")
set(ARXC_OUTDIR "${AUX_INCLUDE_DIR}")

message(VERBOSE "ARXC_CONFIG " ${ARXC_CONFIG})

find_package(Qt${QT_VERSION_MAJOR} COMPONENTS WebSockets QuickWidgets)
find_package("Qt${QT_VERSION_MAJOR}" COMPONENTS Quick Qml REQUIRED)

#include(${IMTCOREDIR}/Config/CMake/WebCompiler.cmake)

include(${ACFDIR}/Config/CMake/CustomBuild.cmake)

include(${ACFDIR}/Config/CMake/ApplicationConfig.cmake)
include(${ACFDIR}/Config/CMake/AcfQt.cmake)
include(${IMTCOREDIR}/Config/CMake/OpenSSL.cmake)
include(${ACFDIR}/Config/CMake/DeployQt.cmake)

message(VERBOSE "PROJECT_BINARY_DIR ${IMTCOREDIR}/Bin/web")

include(${ACFDIR}/Config/CMake/AcfStdGui.cmake)
include(${ACFDIR}/Config/CMake/AcfStd.cmake)

deploy_qt(TARGET ${PROJECT_NAME})


target_link_libraries(${PROJECT_NAME} PRIVATE
	lisadb
	ImtCore::imtauthgui
	ImtCore::imtlicdb
	ImtCore::imtlicgui
)


