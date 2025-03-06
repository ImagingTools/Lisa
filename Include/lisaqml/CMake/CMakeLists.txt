project(lisaqml LANGUAGES CXX)

include(${IMTCOREDIR}/Config/CMake/WebCompiler.cmake)
include(${ACFDIR}/Config/CMake/StaticConfig.cmake)

if(QT_VERSION_MAJOR EQUAL 6)
	target_link_libraries(${PROJECT_NAME} Qt${QT_VERSION_MAJOR}::Core5Compat)
endif()

set(buildwebdir ${BUILDDIR}/Lisa/Bin/web)

# copy lisa qml from to
list(APPEND webdirs ${LISADIR}/Include/lisaqml/Qml)
list(APPEND webdirs ${buildwebdir}/src)

list(APPEND webdirs ${LISADIR}/Include/lisaqml/Resources/html)
list(APPEND webdirs ${buildwebdir}/Resources)

# copy base qml sources from to
list(APPEND webdirs ${PROJECT_SOURCE_DIR}/../../../Impl/LisaLoc/Translations)
list(APPEND webdirs ${buildwebdir}/Resources/Translations)

getImtCoreQmlWebDirs(webdirs "${buildwebdir}")

if(DEFINED WEB_COMPILE AND WEB_COMPILE)
	add_compile_definitions(WEB_COMPILE)
	set(resname "lisa")
	set(inputjs "${LISADIR}/Include/lisaqml/lisa.json")
	jqml_compile_web2("${webdirs}" "${buildwebdir}" "${resname}")
	# jq_compile_web("${webdirs}", "${buildwebdir}", "${resname}", "${inputjs}")
endif()

