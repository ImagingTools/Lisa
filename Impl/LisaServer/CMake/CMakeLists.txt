project(LisaServer LANGUAGES CXX)

set(ARXC_CONFIG "${PROJECT_SOURCE_DIR}/../../../Config/Lisa.awc")
set(ARXC_FILES "${PROJECT_SOURCE_DIR}/../${PROJECT_NAME}.acc")
set(ARXC_OUTDIR "${AUX_INCLUDE_DIR}")

if(WIN32)
#	set(CMAKE_WIN32_EXECUTABLE "on")
    set(ACF_CONVERT_FILES "${PROJECT_SOURCE_DIR}/../VC/LisaServer.rc.xtracf")
	set(ACF_CONVERT_REGISTRY "${PROJECT_SOURCE_DIR}/../VC/FileSubstitCopyApp.acc")
	set(ACF_CONVERT_CONFIG  "${PROJECT_SOURCE_DIR}/../../../Config/BaseOnly.awc")
	set(RC_FILE "${AUX_INCLUDE_DIR}/${PROJECT_NAME}/LisaServer.rc")
endif()

if(APPLE)
	set(CMAKE_MACOSX_BUNDLE "on")
endif()

include(${ACFDIR}/Config/CMake/CustomBuild.cmake)
include(${ACFDIR}/Config/CMake/ApplicationConfig.cmake)
include(${ACFDIR}/Config/CMake/AcfQt.cmake)
include(${IMTCOREDIR}/Config/CMake/OpenSSL.cmake)
include(${IMTCOREDIR}/Config/CMake/Quazip.cmake)
include(${ACFDIR}/Config/CMake/WindeployQt.cmake)

target_link_libraries(${PROJECT_NAME} iservice)
target_link_libraries(${PROJECT_NAME} imtbase imtgui imtauth imtauthgui imtlicdb imtlic imtlicgui imtrest imtrepo imtstyle imtqml imtdb imtfile imtcom)
target_link_libraries(${PROJECT_NAME} imtlicgql imtguigql imtclientgql imtgql imtauthgql imtauthdb imtapp imtservice imtlog)
target_link_libraries(${PROJECT_NAME} ImtCoreLoc LisaLoc)
target_link_libraries(${PROJECT_NAME} lisaqml imtstylecontrolsqml)
target_link_libraries(${PROJECT_NAME} Qt${QT_VERSION_MAJOR}::QuickWidgets  Qt${QT_VERSION_MAJOR}::WebSockets)
target_link_libraries(${PROJECT_NAME} Qt${QT_VERSION_MAJOR}::Sql)
target_link_libraries(${PROJECT_NAME} imtgui)

include(${ACFDIR}/Config/CMake/AcfStdGui.cmake)
include(${ACFDIR}/Config/CMake/AcfStd.cmake)

if(DEFINED WEB_COMPILE AND  WEB_COMPILE)
	add_compile_definitions(WEB_COMPILE)
endif()

# if(WIN32)
# 	# list(APPEND listOptions "--qmldir=${IMTCOREDIR}/Include/imtqml/Resources/qml")
# 	list(APPEND listOptions "--qmldir=${IMTCOREDIR}/Qml")
# 	set(files  \"${AUX_INCLUDE_DIR}/../../../Bin/${CMAKE_BUILD_TYPE}_${TARGETNAME}/${PROJECT_NAME}.exe\")

# 	windeploy(${PROJECT_NAME} "${listOptions}" "${files}")
# 	unset(listOptions)
# endif()


if(APPLE)
	file(COPY ${PROJECT_SOURCE_DIR}/../../../Build/Migrations DESTINATION ${PROJECT_SOURCE_DIR}/../../../Bin/${CMAKE_BUILD_TYPE}_${TARGETNAME}/${PROJECT_NAME}.app/Contents/MacOS)
	file(COPY ${IMTCOREDIR}/Install/Database/LogMigrations DESTINATION ${PROJECT_SOURCE_DIR}/../../../Bin/${CMAKE_BUILD_TYPE}_${TARGETNAME}/${PROJECT_NAME}.app/Contents/MacOS)
else()
	file(COPY ${PROJECT_SOURCE_DIR}/../../../Build/Migrations DESTINATION ${PROJECT_SOURCE_DIR}/../../../Bin/${CMAKE_BUILD_TYPE}_${TARGETNAME})
	file(COPY ${IMTCOREDIR}/Install/Database/LogMigrations DESTINATION ${PROJECT_SOURCE_DIR}/../../../Bin/${CMAKE_BUILD_TYPE}_${TARGETNAME})
endif()
