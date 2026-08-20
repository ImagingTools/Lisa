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
# Lisa uses explicit PUBLIC/PRIVATE/INTERFACE link scopes. For static libraries
# the dependency still propagates transitively to consumers.
#
# Dependencies are declared *minimally*: each library lists only its direct
# dependencies; transitive dependencies propagate automatically through the graph.
# Do not add a dependency that is already reachable through another listed target.
#
# Included once, centrally, from Build/CMake/CMakeLists.txt after all library
# targets have been created.
# ---------------------------------------------------------------------------

# --- Libraries --------------------------------------------------------------
acf_declare_target_dependencies(lisadb		LINK_SCOPE PUBLIC	ImtCore::imtlic)

# --- QML web-resource libraries ---------------------------------------------
if(QT_VERSION_MAJOR EQUAL 6)
	acf_declare_target_dependencies(lisaqml	LINK_SCOPE PUBLIC	Qt${QT_VERSION_MAJOR}::Core5Compat)
endif()

# --- Arxc-generated static libraries ----------------------------------------
acf_declare_target_dependencies(LisaLoc		LINK_SCOPE PUBLIC	Acf::icomp)
