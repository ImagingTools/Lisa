project(LisaSdk LANGUAGES CXX)

set(ARXC_CONFIG "${ACULADIR}/Config/Acula.awc")
set(ARXC_FILES "${PROJECT_SOURCE_DIR}/../${PROJECT_NAME}.acc")
set(ARXC_OUTDIR "${AUX_INCLUDE_DIR}")
set(ARX_ENABLE_GENERATE_DEPENDENCIES_LIST OFF)

include(${ACFDIR}/Config/CMake/CustomBuild.cmake)
include(${IMTCOREDIR}/Config/CMake/ImtCore.cmake)
include(${IMTCOREDIR}/Config/CMake/Quazip.cmake)



ADD_DEFINITIONS(-DUNICODE)
ADD_DEFINITIONS(-D_UNICODE)

target_link_libraries(${PROJECT_NAME} PUBLIC
	ImtCore::imtzip
	ImtCore::imtlic
	ImtCore::imtcrypto
)


