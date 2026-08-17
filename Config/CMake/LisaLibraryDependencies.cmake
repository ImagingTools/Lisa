# ---------------------------------------------------------------------------
# Clean, target-based inter-library dependency graph for Lisa.
#
# Instead of relying on the
# final executable/package link to resolve symbols and on a hand-tuned build
# order (the inline target_link_libraries() spread across the per-library CMake
# files), the dependencies between the Lisa libraries - and their dependencies
# onto the underlying ImtCore::, Acf::, AcfSln:: and IAcf:: libraries - are
# declared here as target usage requirements. Include paths and link order then
# propagate transitively and automatically for the in-tree build.
#
# Every ImtCore::/Acf::/AcfSln:: imported target exposes its whole source include
# tree (acf_register_library() adds INCLUDE_DIR/IMPL_DIR as PUBLIC include
# directories), so a single ImtCore:: dependency transitively provides the full
# ImtCore, Acf, AcfSln and IAcf header search paths to the consuming library.
#
# The target_link_libraries() signature is controlled by ACF_LIBRARY_LINK_SCOPE:
#  * when empty, the plain signature is used (matching the legacy Lisa CMake),
#  * when set to PUBLIC/PRIVATE/INTERFACE, the keyword signature is used.
# CMake forbids mixing the plain and keyword signatures on the same target. For
# static libraries the dependency still propagates transitively to consumers.
#
# Dependencies are declared *minimally*: each library lists only its direct
# dependencies; transitive dependencies propagate automatically through the graph.
# Do not add a dependency that is already reachable through another listed target.
#
# Included once, centrally, from Build/CMake/CMakeLists.txt after all library
# targets have been created.
# ---------------------------------------------------------------------------

# Declare the dependencies of a Lisa library, ignoring any entry whose target
# does not exist in the current configuration (for example feature-gated
# libraries, or ImtCore::/Acf::/AcfSln::/IAcf:: targets that are not available
# because the legacy shim is used instead of find_package).
function(lisa_declare_library_dependencies target)
	cmake_parse_arguments(ARG "" "LINK_SCOPE" "" ${ARGN})

	if(NOT ARG_LINK_SCOPE)
		set(ARG_LINK_SCOPE ${ACF_LIBRARY_LINK_SCOPE})
	endif()

	if(NOT TARGET ${target})
		return()
	endif()

	# target_link_libraries() is illegal on an ALIAS target (e.g. in-tree ImtCore::
	# aliases in unified builds), and augmenting the real target can inject dependency
	# cycles through the Qt autogen targets. Never target an alias.
	get_target_property(_lisa_aliased ${target} ALIASED_TARGET)
	if(_lisa_aliased)
		return()
	endif()

	foreach(dependency IN LISTS ARG_UNPARSED_ARGUMENTS)
		if(TARGET ${dependency})
			target_link_libraries(${target} ${ARG_LINK_SCOPE} ${dependency})
		endif()
	endforeach()
endfunction()


# --- Libraries --------------------------------------------------------------
lisa_declare_library_dependencies(lisadb		LINK_SCOPE PUBLIC	ImtCore::imtlic)

# --- QML web-resource libraries ---------------------------------------------
if(QT_VERSION_MAJOR EQUAL 6)
	lisa_declare_library_dependencies(lisaqml	LINK_SCOPE PUBLIC	Qt${QT_VERSION_MAJOR}::Core5Compat)
endif()

# --- Arxc-generated static libraries ----------------------------------------
lisa_declare_library_dependencies(LisaLoc		LINK_SCOPE PUBLIC	Acf::icomp)


# --- Packages ---------------------------------------------------------------
lisa_declare_library_dependencies(LisaDbPck	LINK_SCOPE PRIVATE	lisadb)

# --- Plug-ins ---------------------------------------------------------------
lisa_declare_library_dependencies(LisaSettingsPlugin	LINK_SCOPE PRIVATE
	ImtCore::imtserverapp Qt${QT_VERSION_MAJOR}::Xml)


# --- Applications -----------------------------------------------------------
# Web/desktop client.
lisa_declare_library_dependencies(LisaClient	LINK_SCOPE PRIVATE
	lisaqml LisaLoc ImtCore::ImtCoreLoc Acf::AcfLoc AcfSln::AcfSlnLoc
	ImtCore::imtserverapp ImtCore::imtauthdb ImtCore::imtdeskdb ImtCore::imtchatdb ImtCore::imtlicgql
	ImtCore::imtauthgql ImtCore::imt2dsdl
	ImtCore::imtcontrolsqml ImtCore::imtstylecontrolsqml ImtCore::imtguiqml ImtCore::imtguigqlqml
	ImtCore::imtauthguiqml ImtCore::imtcolguiqml ImtCore::imtdocguiqml ImtCore::imtlicguiqml)

# LisaServer and its LisaServerTest twin share the same closure.
foreach(_lisa_server LisaServer LisaServerTest)
	lisa_declare_library_dependencies(${_lisa_server}	LINK_SCOPE PRIVATE
		lisaqml LisaLoc ImtCore::ImtCoreLoc Acf::AcfLoc AcfSln::AcfSlnLoc AcfSln::iservice
		ImtCore::imtserverapp ImtCore::imtlicdb ImtCore::imtauthdb ImtCore::imtauthgql ImtCore::imtlicgql
		ImtCore::imtrepo ImtCore::imtlog ImtCore::imt2dsdl ImtCore::imtchatdb ImtCore::imtdeskdb
		ImtCore::imtdeskgql ImtCore::imtchatgql
		ImtCore::imtcontrolsqml ImtCore::imtstylecontrolsqml ImtCore::imtguiqml ImtCore::imtguigqlqml
		ImtCore::imtauthguiqml ImtCore::imtcolguiqml ImtCore::imtdocguiqml ImtCore::imtlicguiqml)
endforeach()

lisa_declare_library_dependencies(LisaServerConfigurator	LINK_SCOPE PRIVATE
	lisaqml LisaLoc ImtCore::ImtCoreLoc Acf::AcfLoc AcfSln::AcfSlnLoc
	ImtCore::imtserverapp ImtCore::imtauthdb ImtCore::imtdeskdb ImtCore::imtchatdb ImtCore::imt2dsdl
	ImtCore::imtcontrolsqml ImtCore::imtstylecontrolsqml ImtCore::imtguiqml ImtCore::imtguigqlqml
	ImtCore::imtauthguiqml ImtCore::imtcolguiqml ImtCore::imtdocguiqml ImtCore::imtlicguiqml)

# --- Legacy single-binary / tooling targets (not part of the default in-tree build) ----------
# QML single-binary client. imtserverapp pulls the imtbase/imtgui/imtqml/imtdb/imtrest/... core.
lisa_declare_library_dependencies(LisaQmlExe	LINK_SCOPE PRIVATE
	lisaqml LisaLoc ImtCore::ImtCoreLoc
	ImtCore::imtserverapp ImtCore::imtlicdb ImtCore::imtrepo ImtCore::imtlicgql ImtCore::imtauthgql
	ImtCore::imtauthdb ImtCore::imtlog
	ImtCore::imtcontrolsqml ImtCore::imtguiqml ImtCore::imtstylecontrolsqml ImtCore::imtdocguiqml
	ImtCore::imtguigqlqml ImtCore::imtauthguiqml ImtCore::imtlicguiqml ImtCore::imtcolguiqml)

lisa_declare_library_dependencies(LisaConverter	LINK_SCOPE PRIVATE
	lisadb
	ImtCore::imtauthgui ImtCore::imtlicdb ImtCore::imtlicgui)

lisa_declare_library_dependencies(LisaSdk	LINK_SCOPE PUBLIC
	ImtCore::imtzip ImtCore::imtlic ImtCore::imtcrypto)
