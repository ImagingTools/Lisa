project(LisaQml LANGUAGES CXX)

message("ACFDIR LISA " ${ACFDIR})
message("CMAKE_PROJECT_INCLUDE_BEFORE " ${CMAKE_PROJECT_INCLUDE_BEFORE})

set(ARXC_CONFIG "${PROJECT_SOURCE_DIR}/../../../Config/Lisa.awc")
set(ARXC_FILES "${PROJECT_SOURCE_DIR}/../${PROJECT_NAME}.acc")
set(ARXC_OUTDIR "${AUX_INCLUDE_DIR}")
#set(QML_IMPORT_PATH "${PROJECT_SOURCE_DIR}/../Resources/qml")
#set(QML_IMPORT_PATH ":/qml/Acf")

message("ARXC_CONFIG " ${ARXC_CONFIG})

if(WIN32)
	set(CMAKE_WIN32_EXECUTABLE "on")
        #set(ACF_CONVERT_FILES "${PROJECT_SOURCE_DIR}/../VC/LisaQml.rc.xtracf")
	set(ACF_CONVERT_REGISTRY "${PROJECT_SOURCE_DIR}/../VC/FileSubstitCopyApp.acc")
	set(ACF_CONVERT_CONFIG  "${PROJECT_SOURCE_DIR}/../../../Config/BaseOnly.awc")
        #set(RC_FILE "${AUX_INCLUDE_DIR}/${PROJECT_NAME}/LisaQml.rc")
endif()

if(APPLE)
	set(CMAKE_MACOSX_BUNDLE "on")
endif()

find_package(Qt${QT_DEFAULT_MAJOR_VERSION} COMPONENTS WebSockets QuickWidgets)
find_package("Qt${QT_DEFAULT_MAJOR_VERSION}" COMPONENTS Quick Qml REQUIRED)

include(${ACFDIR}/Config/CMake/CustomBuild.cmake)
include(${ACFDIR}/Config/CMake/ApplicationConfig.cmake)
include(${ACFDIR}/Config/CMake/AcfQt.cmake)
include(${ACFDIR}/Config/CMake/AcfStd.cmake)
include(${IMTCOREDIR}/Config/CMake/OpenSSL.cmake)
include(${IMTCOREDIR}/Config/CMake/Quazip.cmake)
include(${ACFDIR}/Config/CMake/WindeployQt.cmake)

target_link_libraries(${PROJECT_NAME} iauth)
target_link_libraries(${PROJECT_NAME} imtbase imtgui imtauth imtauthgui imtlic imtlicgui ImtCoreLoc imtwidgets imtzip imtrest imtcrypt imt3dgui imtrepo imtstyle imtqml imtdb)
target_link_libraries(${PROJECT_NAME} imtguigql imtgql)
target_link_libraries(${PROJECT_NAME} LisaLoc AcfSlnLoc IAcfLoc AcfLoc)
target_link_libraries(${PROJECT_NAME}  Qt${QT_DEFAULT_MAJOR_VERSION}::QuickWidgets  Qt${QT_DEFAULT_MAJOR_VERSION}::WebSockets)

if(WIN32)
	list(APPEND listOptions "--qmldir=${IMTCOREDIR}/Include/imtqml/Resources/qml")
	set(files  \"${AUX_INCLUDE_DIR}/../../../Bin/${CMAKE_BUILD_TYPE}${TARGETNAME}\")

	windeploy(${PROJECT_NAME} "${listOptions}" "${files}")
	unset(listOptions)
endif()

list(APPEND QML_IMPORT_DIRS "${IMTCOREDIR}/Include/imtqml/Qml")
list(APPEND QML_IMPORT_DIRS "${IMTCOREDIR}/Include/imtgui/Qml")
list(APPEND QML_IMPORT_DIRS "qrc:/qml")
list(APPEND QML_IMPORT_DIRS ":/qml")

# Prevent adding duplicate values at each run of CMake.
list(REMOVE_DUPLICATES QML_IMPORT_DIRS)

# The variable is cached in ${BUILD_DIR}/CMakeCache.txt. We need FORCE to
# change it there immediately. Also, add a comment to the cache file.
set(QML_IMPORT_PATH ${QML_IMPORT_DIRS}
	CACHE STRING "Qt Creator extra qml import paths"
	FORCE
)

