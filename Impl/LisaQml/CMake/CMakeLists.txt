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


#set(COMPILER_DIR ${CMAKE_BUILD_TYPE}${TARGETNAME})
#if (WIN32)
#	set(DESIGN_TOKEN_CREATOR_EXE "DesignTokenCreator.exe")
#else()
#	set(DESIGN_TOKEN_CREATOR_EXE "DesignTokenCreator")
#endif()

if(APPLE)
	set(CMAKE_MACOSX_BUNDLE "on")
endif()

find_package(Qt${QT_DEFAULT_MAJOR_VERSION} COMPONENTS WebSockets QuickWidgets)
find_package("Qt${QT_DEFAULT_MAJOR_VERSION}" COMPONENTS Quick Qml REQUIRED)

include(${IMTCOREDIR}/Config/CMake/WebCompiler.cmake)


include(${ACFDIR}/Config/CMake/CustomBuild.cmake)

include(${ACFDIR}/Config/CMake/ApplicationConfig.cmake)
include(${ACFDIR}/Config/CMake/AcfQt.cmake)
include(${ACFDIR}/Config/CMake/AcfStd.cmake)
include(${IMTCOREDIR}/Config/CMake/OpenSSL.cmake)
include(${IMTCOREDIR}/Config/CMake/Quazip.cmake)
include(${ACFDIR}/Config/CMake/WindeployQt.cmake)

message("PROJECT_BINARY_DIR ${IMTCOREDIR}/Bin/web")

#set(QRC_QRC_CURRENT_FILE ${DESIGN_TOKEN_CREATOR_COMMAND_PARAM_OUTPUT_DIR}/${LOWER_PROJECT_NAME}${CURRENT_FILE_NAME}.qrc)
#set(QRC_CPP_CURRENT_FILE ${DESIGN_TOKEN_CREATOR_COMMAND_PARAM_OUTPUT_DIR}/qrc_${LOWER_PROJECT_NAME}${CURRENT_FILE_NAME}.cpp)


#set(QRC_ICONS_FILE ${IMTCOREDIR}/AuxInclude/Qt5_VC16_64/GeneratedFiles/imtgui/imtguiunifield.qrc)
#SET(CPP_ICONS_FILE ${IMTCOREDIR}/AuxInclude/Qt5_VC16_64/GeneratedFiles/imtgui/qrc_imtguiunifield.cpp)

#set(QRC_ICONS_FILE ${IMTCOREDIR}/AuxInclude/Qt5_VC16_64/GeneratedFiles/imt3dgui/Webimt3dgui.qrc)
#SET(CPP_ICONS_FILE ${IMTCOREDIR}/AuxInclude/Qt5_VC16_64/GeneratedFiles/imt3dgui/qrc_Webimt3dgui.cpp)


#add_custom_command(
#	OUTPUT ${CPP_ICONS_FILE}
#	COMMAND
#	${Qt5Core_RCC_EXECUTABLE}
#	ARGS
#	-name ${PROJECT_NAME}Icons ${QRC_ICONS_FILE} -o ${CPP_ICONS_FILE}
#	DEPENDS
#	${QRC_ICONS_FILE}
#	COMMENT
#	"Compile QRC_ICONS_FILE"
#	)

#add_custom_target(
#	Icons${PROJECT_NAME} ALL
#	DEPENDS ${CPP_ICONS_FILE}
#	)

#C:/Sybnavigation/ITDevelopment/ImtCore/Bin/DebugVC16_64/DesignTokenCreator.exe

#target_sources(${PROJECT_NAME} PRIVATE ${CPP_ICONS_FILE})
#list(APPEND iconsdirs ${IMTCOREDIR}/Include/imt3dgui/Resources/Icons/Template)
#list(APPEND iconsdirs ${IMTCOREDIR}/Include/imtgui/Resources/Icons/Template)
#list(APPEND iconsdirs ${IMTCOREDIR}/Include/imtauthgui/Resources/Icons/Template)
#list(APPEND iconsdirs ${IMTCOREDIR}/Include/imtlicgui/Resources/Icons/Template)
#set(DESIGN_TOKEN_CREATOR_EXE_BIN ${IMTCOREDIR}/Bin/DebugVC16_64/DesignTokenCreator.exe)
#message("DESIGN_TOKEN_CREATOR_EXE_BIN " ${DESIGN_TOKEN_CREATOR_EXE_BIN})
#set(ICON_STYLE_QML_CREATOR_COMMAND_PARAMS
#	--qml
#	-I
#	    ${iconsdirs}
#	-OF
#	    ${IMTCOREDIR}/Include/imtgui/Qml/Acf/IconStyle.qml
#	-P
#	    ${PROJECT_NAME}
#	--ignore-errors
#	)

#add_custom_command(
#	OUTPUT
#	    ${IMTCOREDIR}/Include/imtgui/Qml/Acf/IconStyle.qml
#	COMMAND
#	    ${DESIGN_TOKEN_CREATOR_EXE_BIN}
#	ARGS
#	    ${ICON_STYLE_QML_CREATOR_COMMAND_PARAMS}
##	DEPENDS
##	    ${IMTCOREDIR}/AuxInclude/Qt5_VC16_64/GeneratedFiles/imt3dgui/Webimt3dgui.qrc
#	COMMENT
#	    "[DesignToken::${LOWER_PROJECT_NAME}] Creating QML ${IMTCOREDIR}/Include/imtgui/Qml/Acf/IconStyle.qml"
#	VERBATIM
#	)

#add_custom_target(
#	    DesignQmlToken${PROJECT_NAME} ALL
#		DEPENDS ${IMTCOREDIR}/Include/imtgui/Qml/Acf/IconStyle.qml
#	)

#copy compiler from to
list(APPEND webdirs ${IMTCOREDIR}/3rdParty/WebCompiler)
list(APPEND webdirs ${IMTCOREDIR}/Bin/web)

list(APPEND webdirs ${IMTCOREDIR}/Include/imtqml/Qml/empty)
list(APPEND webdirs ${IMTCOREDIR}/Bin/web/src)

# copy base qml sources from to
list(APPEND webdirs ${IMTCOREDIR}/Include/imtgui/Qml/Acf)
list(APPEND webdirs ${IMTCOREDIR}/Bin/web/src/Acf)
list(APPEND webdirs ${IMTCOREDIR}/Include/imtgui/Qml/imtgui)
list(APPEND webdirs ${IMTCOREDIR}/Bin/web/src/imtgui)
list(APPEND webdirs ${IMTCOREDIR}/Include/imtqml/Qml/imtqml)
list(APPEND webdirs ${IMTCOREDIR}/Bin/web/src/imtqml)
# copy lisa qml from to
list(APPEND webdirs ${PROJECT_SOURCE_DIR}/../Resources/qml)
list(APPEND webdirs ${IMTCOREDIR}/Bin/web/src)

list(APPEND webdirs ${PROJECT_SOURCE_DIR}/../Resources/html)
list(APPEND webdirs ${IMTCOREDIR}/Bin/web/Resources)

# copy dist from to
list(APPEND webdirs ${PROJECT_SOURCE_DIR}/../Resources/dist)
list(APPEND webdirs ${IMTCOREDIR}/Bin/web/dist)

# copy result from to
list(APPEND webdirs ${IMTCOREDIR}/Bin/web/build.web)
list(APPEND webdirs ${IMTCOREDIR}/Bin/web/Resources)
#list(APPEND webdirs ${PROJECT_SOURCE_DIR}/../Resources/html)

imtcore_compile_web("${webdirs}")

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

