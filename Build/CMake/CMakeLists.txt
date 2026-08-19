cmake_minimum_required(VERSION 3.26)

project(LisaAll)

if(NOT DEFINED QT_VERSION_MAJOR)
	find_package(QT NAMES Qt6 Qt5 COMPONENTS Core)
	find_package("Qt${QT_VERSION_MAJOR}" COMPONENTS Core Widgets QuickWidgets Core Gui Xml Network Svg Sql WebSockets Qml Concurrent QuickControls2 REQUIRED)
	if(QT_VERSION_MAJOR EQUAL 6)
		find_package("Qt${QT_VERSION_MAJOR}" COMPONENTS Core5Compat REQUIRED)
	endif()
endif()

if(NOT DEFINED WEB_COMPILE)
	set(WEB_COMPILE ON CACHE BOOL "Build whith web compatibility")
endif()

if(NOT DEFINED BUILDDIR)
	set(BUILDDIR "${CMAKE_CURRENT_LIST_DIR}/../../..")
endif()

if(NOT DEFINED IMTCOREDIR)
	set(IMTCOREDIR "$ENV{IMTCOREDIR}")
endif()

if(NOT DEFINED IMTCOREDIR_BUILD)
	set(IMTCOREDIR_BUILD "$ENV{IMTCOREDIR_BUILD}")
endif()
if(IMTCOREDIR_BUILD STREQUAL "")
	set(IMTCOREDIR_BUILD ${IMTCOREDIR})
endif()

if(NOT DEFINED PUMADIR)
	set(PUMADIR "$ENV{PUMADIR}")
endif()

# Enable modern target-based architecture: find_package(ImtCore) provides ImtCore::
# imported targets (and, transitively, Acf::/AcfSln::/IAcf::) with transitive include
# dirs and link deps. Legacy global include_directories()/link_directories() are skipped.
set(ACF_MODERN_CMAKE ON)

# Collect Lisa libraries in their own export set. Read by acf_register_library() (from Acf).
set(ACF_PACKAGE_NAME "Lisa")

include(${IMTCOREDIR}/Config/CMake/ImtCoreEnv.cmake)
include(${IMTCOREDIR}/Config/CMake/PartituraUpgrade.cmake)
imt_core_upgrade_partitura("${CMAKE_CURRENT_LIST_DIR}/../..")

# Discover the ImtCore package published by its build tree (pulls in Acf/AcfSln/IAcf).
if(ACF_MODERN_CMAKE AND NOT TARGET ImtCore::imtbase)
	set(ImtCore_DIR "${IMTCOREDIR_BUILD}/Lib/${CMAKE_BUILD_TYPE}_${TARGETNAME}/cmake" CACHE PATH "Path to the ImtCore build-tree CMake package")
	find_package(ImtCore REQUIRED GLOBAL)
endif()

if(NOT DEFINED LISADIR)
	set(LISADIR "$ENV{LISADIR}")
endif()


set(INCLUDE_DIR "${CMAKE_CURRENT_LIST_DIR}/../../Include")
set(IMPL_DIR "${CMAKE_CURRENT_LIST_DIR}/../../Impl")

set(AUX_INCLUDE_DIR "${BUILDDIR}/Lisa/AuxInclude/${TARGETNAME}/GeneratedFiles")

include_directories("${AUX_INCLUDE_DIR}/../")
include_directories("${AUX_INCLUDE_DIR}/")

# Link scopes for the modern keyword target_link_libraries() signature. Inter-library
# dependencies are declared centrally in LisaLibraryDependencies.cmake.
acf_define_link_scope_var(ACF_QT_MODULE_LINK_SCOPE  "PRIVATE" "Link scope used for Qt module dependencies")
acf_define_link_scope_var(ACF_LIBRARY_LINK_SCOPE     "PUBLIC"  "Link scope used by Lisa inter-library dependencies")
acf_define_link_scope_var(ACF_PACKAGE_LINK_SCOPE     "PRIVATE" "Link scope used by package (Pck) libraries linking their dependencies")
acf_define_link_scope_var(ACF_APPLICATION_LINK_SCOPE "PRIVATE" "Link scope used by executables linking their dependencies")

function(lisa_create_legacy_short_target_aliases)
	get_property(_all_targets GLOBAL PROPERTY TARGETS)
	foreach(_t IN LISTS _all_targets)
		if(_t MATCHES "^(Acf|AcfSln|IAcf|ImtCore)::(.+)$")
			set(_alias "${CMAKE_MATCH_2}")
			if(NOT TARGET ${_alias})
				get_target_property(_type ${_t} TYPE)
				if(_type STREQUAL "STATIC_LIBRARY" OR _type STREQUAL "SHARED_LIBRARY" OR _type STREQUAL "INTERFACE_LIBRARY")
					add_library(${_alias} ALIAS ${_t})
				endif()
			endif()
		endif()
	endforeach()
endfunction()

# Legacy ACF compatibility: if helper CMake files still use plain
# target_link_libraries() signatures, force plain mode in this repository too.
set(LISA_FORCE_PLAIN_TLL "AUTO" CACHE STRING "Force plain target_link_libraries signatures: AUTO|ON|OFF")
set_property(CACHE LISA_FORCE_PLAIN_TLL PROPERTY STRINGS "AUTO" "ON" "OFF")

set(_lisa_force_plain_tll OFF)
if(LISA_FORCE_PLAIN_TLL STREQUAL "ON")
	set(_lisa_force_plain_tll ON)
elseif(LISA_FORCE_PLAIN_TLL STREQUAL "AUTO")
	set(_acf_qt_cmake "${ACFDIR}/Config/CMake/AcfQt.cmake")
	if(EXISTS "${_acf_qt_cmake}")
		file(READ "${_acf_qt_cmake}" _acf_qt_cmake_text)
		string(FIND "${_acf_qt_cmake_text}" "ACF_LIBRARY_LINK_SCOPE" _acf_qt_uses_scope)
		if(_acf_qt_uses_scope EQUAL -1)
			set(_lisa_force_plain_tll ON)
		endif()
	endif()
endif()

if(_lisa_force_plain_tll)
	set(ACF_QT_MODULE_LINK_SCOPE "" CACHE STRING "Link scope used for Qt module dependencies" FORCE)
	set(ACF_LIBRARY_LINK_SCOPE "" CACHE STRING "Link scope used by Lisa inter-library dependencies" FORCE)
	set(ACF_PACKAGE_LINK_SCOPE "" CACHE STRING "Link scope used by package (Pck) libraries linking their dependencies" FORCE)
	set(ACF_APPLICATION_LINK_SCOPE "" CACHE STRING "Link scope used by executables linking their dependencies" FORCE)

	# In ACF_MODERN_CMAKE mode global link_directories() are disabled, but
	# legacy Acf*.cmake modules still add plain names like "iqtdoc".
	if(DEFINED ACFDIR_BUILD AND NOT ACFDIR_BUILD STREQUAL "")
		link_directories("${ACFDIR_BUILD}/Lib/${CMAKE_BUILD_TYPE}_${TARGETNAME}")
	endif()
	if(DEFINED ACFDIR AND NOT ACFDIR STREQUAL "")
		link_directories("${ACFDIR}/Lib/${CMAKE_BUILD_TYPE}_${TARGETNAME}")
	endif()
	if(DEFINED ACFSLNDIR_BUILD AND NOT ACFSLNDIR_BUILD STREQUAL "")
		link_directories("${ACFSLNDIR_BUILD}/Lib/${CMAKE_BUILD_TYPE}_${TARGETNAME}")
	endif()
	if(DEFINED ACFSLNDIR AND NOT ACFSLNDIR STREQUAL "")
		link_directories("${ACFSLNDIR}/Lib/${CMAKE_BUILD_TYPE}_${TARGETNAME}")
	endif()
	if(DEFINED IACFDIR_BUILD AND NOT IACFDIR_BUILD STREQUAL "")
		link_directories("${IACFDIR_BUILD}/Lib/${CMAKE_BUILD_TYPE}_${TARGETNAME}")
	endif()
	if(DEFINED IACFDIR AND NOT IACFDIR STREQUAL "")
		link_directories("${IACFDIR}/Lib/${CMAKE_BUILD_TYPE}_${TARGETNAME}")
	endif()
	if(DEFINED IMTCOREDIR_BUILD AND NOT IMTCOREDIR_BUILD STREQUAL "")
		link_directories("${IMTCOREDIR_BUILD}/Lib/${CMAKE_BUILD_TYPE}_${TARGETNAME}")
	endif()
	if(DEFINED IMTCOREDIR AND NOT IMTCOREDIR STREQUAL "")
		link_directories("${IMTCOREDIR}/Lib/${CMAKE_BUILD_TYPE}_${TARGETNAME}")
	endif()

	# Legacy Acf*.cmake modules use short names; create aliases so CMake can
	# resolve them to known imported targets when available.
	lisa_create_legacy_short_target_aliases()
endif()

# Include

add_subdirectory("${INCLUDE_DIR}/lisadb/CMake" "${AUX_INCLUDE_DIR}/lisadb")
add_subdirectory("${INCLUDE_DIR}/lisaqml/CMake" "${AUX_INCLUDE_DIR}/lisaqml")

# Plug-ins
add_subdirectory("${IMPL_DIR}/Plugins/LisaSettingsPlugin/CMake" "${AUX_INCLUDE_DIR}/LisaSettingsPlugin")

# Impl
add_subdirectory("${IMPL_DIR}/LisaDbPck/CMake" "${AUX_INCLUDE_DIR}/LisaDbPck")
add_subdirectory("${IMPL_DIR}/LisaLoc/CMake" "${AUX_INCLUDE_DIR}/LisaLoc")
add_subdirectory("${IMPL_DIR}/LisaClient/CMake" "${AUX_INCLUDE_DIR}/LisaClient")
add_subdirectory("${IMPL_DIR}/LisaServer/CMake" "${AUX_INCLUDE_DIR}/LisaServer")
add_subdirectory("${IMPL_DIR}/LisaServerTest/CMake" "${AUX_INCLUDE_DIR}/LisaServerTest")
add_subdirectory("${IMPL_DIR}/LisaServerConfigurator/CMake" "${AUX_INCLUDE_DIR}/LisaServerConfigurator")

# Declare target-based deps so include paths/link order propagate transitively across Lisa
# libraries and onto the underlying ImtCore::/Acf::/AcfSln::/IAcf:: libraries.
include("${CMAKE_CURRENT_LIST_DIR}/../../Config/CMake/LisaLibraryDependencies.cmake")

