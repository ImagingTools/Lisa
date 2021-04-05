project(Lisa LANGUAGES CXX)

message("ACFDIR LISA " ${ACFDIR})
message("CMAKE_PROJECT_INCLUDE_BEFORE " ${CMAKE_PROJECT_INCLUDE_BEFORE})

set(ARXC_CONFIG "${PROJECT_SOURCE_DIR}/../../../Config/${PROJECT_NAME}.awc")
set(ARXC_FILES "${PROJECT_SOURCE_DIR}/../${PROJECT_NAME}.acc")
set(ARXC_OUTDIR "${AUX_INCLUDE_DIR}")

message("ARXC_CONFIG " ${ARXC_CONFIG})

if(WIN32)
#	set(CMAKE_WIN32_EXECUTABLE "on")
#	set(ACF_CONVERT_FILES "${PROJECT_SOURCE_DIR}/../VC/Lisa.rc.xtracf")
#	set(ACF_CONVERT_REGISTRY "${PROJECT_SOURCE_DIR}/../../../Partitura/AcfInfoCopyApp.acc")
#	set(ACF_CONVERT_CONFIG  "${PROJECT_SOURCE_DIR}/../../../Config/BaseOnly.awc")
#	set(RC_FILE "${AUX_INCLUDE_DIR}/${PROJECT_NAME}/Lisa.rc")
endif()

if(APPLE)
	set(CMAKE_MACOSX_BUNDLE "on")
endif()

include(${ACFDIR}/Config/CMake/CustomBuild.cmake)
#include(${ACFDIR}/Config/CMake/QtGuiBaseConfig.cmake)
include(${ACFDIR}/Config/CMake/ApplicationConfig.cmake)
include(${ACFDIR}/Config/CMake/AcfQt.cmake)
include(${ACFDIR}/Config/CMake/AcfStd.cmake)

#target_link_libraries(${PROJECT_NAME} AcfLoc icmpstr AcfSlnLoc) #AcfLoc
#add_dependencies(${PROJECT_NAME} icmpstr AcfSlnLoc)
#add_dependencies(${PROJECT_NAME} iservice icmpstr AcfSlnLoc)

target_link_libraries(${PROJECT_NAME} iauth imeas iqtmeas iqtinsp iproc iinsp iipr iprocgui isig iqtsig icalibgui icalib icam iqtcam AcfSlnLoc AcfLoc iedge iedgegui imtrepo imtrepogui)
target_link_libraries(${PROJECT_NAME} imtbase imtgui imtauth imtauthgui imtlic imtlicgui ImtCoreLoc imtwidgets imtzip z quazip)


find_package("Qt${QT_DEFAULT_MAJOR_VERSION}" COMPONENTS PrintSupport REQUIRED)
#target_link_libraries(${PROJECT_NAME} Qt5::PrintSupport)
