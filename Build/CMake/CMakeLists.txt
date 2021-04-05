cmake_minimum_required(VERSION 3.1.0)
#cmake_minimum_required(VERSION 3.13.0)

project(LisaAll)

set(QT_DEFAULT_MAJOR_VERSION 5)


if(NOT DEFINED ACFDIR)
	message("NOT ACFDIR " "${ACFDIR}")
	if(DEFINED ENV{ACFDIR})
		set(ACFDIR $ENV{ACFDIR})
	else()
		set(ACFDIR "${CMAKE_CURRENT_LIST_DIR}/../../../../AcfPublic/Acf")
	endif()
endif()

if(NOT DEFINED ACFSLNDIR)
	message("NOT ACFDIR " "${ACFDIR}")
	if(DEFINED ENV{ACFSLNDIR})
		set(ACFSLNDIR $ENV{ACFSLNDIR})
	else()
		set(ACFSLNDIR "${CMAKE_CURRENT_LIST_DIR}/../../../../AcfPublic/AcfSln")
	endif()
endif()
#set(ACFSLNDIR "${CMAKE_CURRENT_LIST_DIR}/../../../AcfSln")

message("ACFDIR " "${ACFDIR}")

include(${ACFDIR}/Config/CMake/Macro.cmake)

#set(MAIN_DIR "${CMAKE_CURRENT_LIST_DIR}/../../Include/")

#subdirlist(SUBDIRS ${MAIN_DIR})

get_target_name(TARGETNAME)

#set(ACF_INCLUDE_DIR "${CMAKE_CURRENT_LIST_DIR}/../../../Acf/Include")
#set(ACF_IMPL_DIR "${CMAKE_CURRENT_LIST_DIR}/../../../Acf/Impl")

#message(${ACF_INCLUDE_DIR})

include_directories("${ACFDIR}/AuxInclude/Qt${QT_DEFAULT_MAJOR_VERSION}_${TARGETNAME}")
include_directories("${ACFDIR}/Include")
include_directories("${ACFDIR}/Impl")
include_directories("${ACFSLNDIR}/AuxInclude/Qt${QT_DEFAULT_MAJOR_VERSION}_${TARGETNAME}")
include_directories("${ACFSLNDIR}/Include")
include_directories("${ACFSLNDIR}/Impl")

include_directories("${CMAKE_CURRENT_LIST_DIR}/../../../ImtCore/AuxInclude/Qt${QT_DEFAULT_MAJOR_VERSION}_${TARGETNAME}")
include_directories("${CMAKE_CURRENT_LIST_DIR}/../../../ImtCore/Include")
include_directories("${CMAKE_CURRENT_LIST_DIR}/../../../ImtCore/Impl")

link_directories("${ACFDIR}/Lib/${TARGETNAME}")
link_directories("${ACFSLNDIR}/Lib/${TARGETNAME}")
link_directories("${CMAKE_CURRENT_LIST_DIR}/../../../ImtCore/Lib/${TARGETNAME}")
link_directories(${QUAZIP}/lib/${TARGETNAME})


set(INCLUDE_DIR "${CMAKE_CURRENT_LIST_DIR}/../../Include")
set(IMPL_DIR "${CMAKE_CURRENT_LIST_DIR}/../../Impl")

message("IMTCORE_AUXINCLUDE ${CMAKE_CURRENT_LIST_DIR}/../../../ImtCore/AuxInclude/Qt${QT_DEFAULT_MAJOR_VERSION}_${TARGETNAME}")

#subdirlist(INCLUDE_DIRS ${INCLUDE_DIR})
#subdirlist(IMPL_DIRS ${IMPL_DIR})

#set(LIB_DIR "${CMAKE_CURRENT_LIST_DIR}/../../Lib/Qt${QT_DEFAULT_MAJOR_VERSION}_${TARGETNAME}")

set(AUX_INCLUDE_DIR "${CMAKE_CURRENT_LIST_DIR}/../../AuxInclude/Qt${QT_DEFAULT_MAJOR_VERSION}_${TARGETNAME}/GeneratedFiles")

include_directories("${CMAKE_CURRENT_LIST_DIR}/../../AuxInclude/Qt${QT_DEFAULT_MAJOR_VERSION}_${TARGETNAME}")
include_directories("${CMAKE_CURRENT_LIST_DIR}/../../../Acf/AuxInclude/Qt${QT_DEFAULT_MAJOR_VERSION}_${TARGETNAME}")

message("${AUX_INCLUDE_DIR}")


# Include

#add_subdirectory("${INCLUDE_DIR}/iservice/CMake" "${AUX_INCLUDE_DIR}/iservice")


# Impl

add_subdirectory("${IMPL_DIR}/LisaExe/CMake" "${AUX_INCLUDE_DIR}/Lisa")
