cmake_minimum_required(VERSION 3.1.0)
#cmake_minimum_required(VERSION 3.13.0)

project(LisaAll)

if(NOT DEFINED IMTCOREDIR)
	set(IMTCOREDIR "$ENV{IMTCOREDIR}")
endif()

include(${IMTCOREDIR}/Config/CMake/ImtCoreEnv.cmake)

set(INCLUDE_DIR "${CMAKE_CURRENT_LIST_DIR}/../../Include")
set(IMPL_DIR "${CMAKE_CURRENT_LIST_DIR}/../../Impl")

message("IMTCORE_AUXINCLUDE ${CMAKE_CURRENT_LIST_DIR}/../../../ImtCore/AuxInclude/Qt${QT_VERSION_MAJOR}_${TARGETNAME}")

#subdirlist(INCLUDE_DIRS ${INCLUDE_DIR})
#subdirlist(IMPL_DIRS ${IMPL_DIR})

#set(LIB_DIR "${CMAKE_CURRENT_LIST_DIR}/../../Lib/Qt${QT_VERSION_MAJOR}_${TARGETNAME}")

set(AUX_INCLUDE_DIR "${CMAKE_CURRENT_LIST_DIR}/../../AuxInclude/Qt${QT_VERSION_MAJOR}_${TARGETNAME}/GeneratedFiles")

include_directories("${AUX_INCLUDE_DIR}/../")

message("${AUX_INCLUDE_DIR}")

# Include

#add_subdirectory("${INCLUDE_DIR}/ilisa/CMake" "${AUX_INCLUDE_DIR}/ilisa")


# Impl

add_subdirectory("${IMPL_DIR}/LisaLoc/CMake" "${AUX_INCLUDE_DIR}/LisaLoc")
#add_subdirectory("${IMPL_DIR}/LisaExe/CMake" "${AUX_INCLUDE_DIR}/Lisa")

if(NOT UNIX)
	add_subdirectory("${IMPL_DIR}/LisaDbExe/CMake" "${AUX_INCLUDE_DIR}/LisaDb")
	add_subdirectory("${IMPL_DIR}/LisaQml/CMake" "${AUX_INCLUDE_DIR}/LisaQml")
	add_subdirectory("${IMPL_DIR}/LisaClient/CMake" "${AUX_INCLUDE_DIR}/LisaClient")
	add_subdirectory("${IMPL_DIR}/LisaServer/CMake" "${AUX_INCLUDE_DIR}/LisaServer")
endif(UNIX)
