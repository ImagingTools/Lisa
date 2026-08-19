project(LisaServerConfigurator LANGUAGES CXX)

set(ARXC_CONFIG "${PROJECT_SOURCE_DIR}/../../../Config/Lisa.awc")
set(ARXC_FILES "${PROJECT_SOURCE_DIR}/../${PROJECT_NAME}.acc")
set(ARXC_OUTDIR "${AUX_INCLUDE_DIR}")

if(WIN32)
	set(CMAKE_WIN32_EXECUTABLE "on")
	set(ACF_CONVERT_FILES "${PROJECT_SOURCE_DIR}/../VC/LisaServerConfigurator.rc.xtracf")
	set(ACF_CONVERT_REGISTRY "${PROJECT_SOURCE_DIR}/../VC/FileSubstitCopyApp.acc")
	set(ACF_CONVERT_CONFIG "${PROJECT_SOURCE_DIR}/../../../Config/BaseOnly.awc")
	set(RC_FILE "${AUX_INCLUDE_DIR}/${PROJECT_NAME}/LisaServerConfigurator.rc")
endif()

if(APPLE)
	set(CMAKE_MACOSX_BUNDLE "on")
endif()

include(${ACFDIR}/Config/CMake/CustomBuild.cmake)

include(${ACFDIR}/Config/CMake/ApplicationConfig.cmake)
include(${IMTCOREDIR}/Config/CMake/OpenSSL.cmake)
include(${IMTCOREDIR}/Config/CMake/Quazip.cmake)
include(${ACFDIR}/Config/CMake/WindeployQt.cmake)


if(WEB_COMPILE)
	add_compile_definitions(WEB_COMPILE)
endif()

if(USE_NEW_WEB)
	add_compile_definitions(USE_NEW_WEB)
endif()


target_link_libraries(${PROJECT_NAME} ${ACF_APPLICATION_LINK_SCOPE}
	lisaqml
	LisaLoc
	ImtCore::ImtCoreLoc
	ImtCore::imtauthdb
	ImtCore::imtdeskdb
	ImtCore::imtchatdb
	ImtCore::imt2dsdl
	ImtCore::imtcontrolsqml
	ImtCore::imtstylecontrolsqml
	ImtCore::imtguiqml
	ImtCore::imtguigqlqml
	ImtCore::imtauthguiqml
	ImtCore::imtcolguiqml
	ImtCore::imtdocguiqml
	ImtCore::imtlicguiqml
)


