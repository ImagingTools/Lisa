project(LisaClient LANGUAGES CXX)

message(VERBOSE "ACFDIR LISA " ${ACFDIR})
message(VERBOSE "CMAKE_PROJECT_INCLUDE_BEFORE " ${CMAKE_PROJECT_INCLUDE_BEFORE})

set(ARXC_CONFIG "${PROJECT_SOURCE_DIR}/../../../Config/Lisa.awc")
set(ARXC_FILES "${PROJECT_SOURCE_DIR}/../${PROJECT_NAME}.acc")
set(ARXC_OUTDIR "${AUX_INCLUDE_DIR}")

message(VERBOSE "ARXC_CONFIG " ${ARXC_CONFIG})

if(WIN32)
	set(CMAKE_WIN32_EXECUTABLE "on")
	set(ACF_CONVERT_FILES "${PROJECT_SOURCE_DIR}/../VC/LisaClient.rc.xtracf")
	set(ACF_CONVERT_REGISTRY "${PROJECT_SOURCE_DIR}/../VC/FileSubstitCopyApp.acc")
	set(ACF_CONVERT_CONFIG "${PROJECT_SOURCE_DIR}/../../../Config/BaseOnly.awc")
	set(RC_FILE "${AUX_INCLUDE_DIR}/${PROJECT_NAME}/LisaClient.rc")
endif()

if(APPLE)
	set(CMAKE_MACOSX_BUNDLE "on")
endif()

include(${IMTCOREDIR}/Config/CMake/WebCompiler.cmake)

include(${ACFDIR}/Config/CMake/CustomBuild.cmake)

include(${ACFDIR}/Config/CMake/ApplicationConfig.cmake)
include(${ACFDIR}/Config/CMake/AcfQt.cmake)
include(${ACFDIR}/Config/CMake/AcfStd.cmake)
include(${ACFDIR}/Config/CMake/AcfStdGui.cmake)
include(${IMTCOREDIR}/Config/CMake/OpenSSL.cmake)
include(${ACFDIR}/Config/CMake/WindeployQt.cmake)

message(VERBOSE "PROJECT_BINARY_DIR ${IMTCOREDIR}/Bin/web")

target_link_libraries(${PROJECT_NAME} lisaqml)
target_link_libraries(${PROJECT_NAME} LisaLoc ImtCoreLoc AcfLoc AcfSlnLoc)
target_link_libraries(${PROJECT_NAME} imtgui imtauth imtauthgui imtlic imtlicgui imtrest imtstyle imtqml imtdb imtcom imtdocguiqml imtauthguiqml imtlicguiqml imtguiqml imtlicsdl imtauthsdl imtappsdl imtcolorsdl)
target_link_libraries(${PROJECT_NAME} imtlicgql imtguigql imtclientgql imtgql imtauthgql imtguigqlqml imtcolguiqml imtstylecontrolsqml imtcontrolsqml)
target_link_libraries(${PROJECT_NAME} imtbase imtbasesdl imtserverapp imtapp)
target_link_libraries(${PROJECT_NAME} iqtgui)
target_link_libraries(${PROJECT_NAME} Qt${QT_VERSION_MAJOR}::QuickWidgets Qt${QT_VERSION_MAJOR}::WebSockets)

if(WIN32)
	list(APPEND listOptions "--qmldir=${LISADIR}/Include/lisaqml/Qml")
	list(APPEND listOptions "--qmldir=${IMTCOREDIR}/Qml")
	set(files \"${AUX_INCLUDE_DIR}/../../../Bin/${CMAKE_BUILD_TYPE}_${TARGETNAME}/${PROJECT_NAME}.exe\")

	windeploy(${PROJECT_NAME} "${listOptions}" "${files}")
	unset(listOptions)
endif()

