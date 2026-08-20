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
# Lisa uses keyword target_link_libraries() signatures (PUBLIC/PRIVATE/INTERFACE)
# consistently via ACF_LIBRARY_LINK_SCOPE. For static libraries the dependency
# still propagates transitively to consumers.
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
# libraries, or ImtCore::/Acf::/AcfSln::/IAcf:: targets that are not available).
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
