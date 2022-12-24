cmake_minimum_required(VERSION 3.1.0)

project(LisaAll)

if(NOT DEFINED IMTCOREDIR)
	set(IMTCOREDIR "$ENV{IMTCOREDIR}")
endif()

include(${IMTCOREDIR}/Config/CMake/ImtCoreEnv.cmake)

set(INCLUDE_DIR "${CMAKE_CURRENT_LIST_DIR}/../../Include")
set(IMPL_DIR "${CMAKE_CURRENT_LIST_DIR}/../../Impl")
set(AUX_INCLUDE_DIR "${CMAKE_CURRENT_LIST_DIR}/../../AuxInclude/${TARGETNAME}/GeneratedFiles")

include_directories("${AUX_INCLUDE_DIR}/../")

# Include

add_subdirectory("${INCLUDE_DIR}/lisaqml/CMake" "${AUX_INCLUDE_DIR}/lisaqml")

# Impl
add_subdirectory("${IMPL_DIR}/LisaLoc/CMake" "${AUX_INCLUDE_DIR}/LisaLoc")
add_subdirectory("${IMPL_DIR}/LisaQmlExe/CMake" "${AUX_INCLUDE_DIR}/LisaQmlExe")
add_subdirectory("${IMPL_DIR}/LisaClient/CMake" "${AUX_INCLUDE_DIR}/LisaClient")
add_subdirectory("${IMPL_DIR}/LisaServer/CMake" "${AUX_INCLUDE_DIR}/LisaServer")

file(COPY ../Migrations DESTINATION ${AUX_INCLUDE_DIR}/../../../Bin/${CMAKE_BUILD_TYPE}_${TARGETNAME})
