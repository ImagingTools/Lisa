cmake_minimum_required(VERSION 3.1.0)
#cmake_minimum_required(VERSION 3.13.0)

project(LisaAll)

set(QT_DEFAULT_MAJOR_VERSION 5)

if(NOT DEFINED IMTCOREDIR)
	set(IMTCOREDIR "$ENV{IMTCOREDIR}")
endif()

include(${IMTCOREDIR}/Config/CMake/ImtCoreEnv.cmake)

set(INCLUDE_DIR "${CMAKE_CURRENT_LIST_DIR}/../../Include")
set(IMPL_DIR "${CMAKE_CURRENT_LIST_DIR}/../../Impl")

message("IMTCORE_AUXINCLUDE ${CMAKE_CURRENT_LIST_DIR}/../../../ImtCore/AuxInclude/Qt${QT_DEFAULT_MAJOR_VERSION}_${TARGETNAME}")

#subdirlist(INCLUDE_DIRS ${INCLUDE_DIR})
#subdirlist(IMPL_DIRS ${IMPL_DIR})

#set(LIB_DIR "${CMAKE_CURRENT_LIST_DIR}/../../Lib/Qt${QT_DEFAULT_MAJOR_VERSION}_${TARGETNAME}")

set(AUX_INCLUDE_DIR "${CMAKE_CURRENT_LIST_DIR}/../../AuxInclude/Qt${QT_DEFAULT_MAJOR_VERSION}_${TARGETNAME}/GeneratedFiles")

include_directories("${AUX_INCLUDE_DIR}/../")

message("${AUX_INCLUDE_DIR}")


# Include

#add_subdirectory("${INCLUDE_DIR}/iservice/CMake" "${AUX_INCLUDE_DIR}/iservice")


# Impl

add_subdirectory("${IMPL_DIR}/LisaLoc/CMake" "${AUX_INCLUDE_DIR}/LisaLoc")
add_subdirectory("${IMPL_DIR}/LisaExe/CMake" "${AUX_INCLUDE_DIR}/Lisa")
