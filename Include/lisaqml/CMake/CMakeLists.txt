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

option(USE_NEW_WEB "Use new web compilation (jq_compile_web)" OFF)

if(DEFINED WEB_COMPILE AND WEB_COMPILE)
	add_compile_definitions(WEB_COMPILE)
	set(resname "lisa")
	if(USE_NEW_WEB)
		set(inputjs "${LISADIR}/Include/lisaqml/lisa.json")
		set(appicon "../Icons/LisaIcon.svg")
		set(dataroot "/Lisa/Views/")
		set(startqml "${LISADIR}/Include/lisaqml/Qml/LisaWeb.qml")
		jq_compile_web("${webdirs}", "${buildwebdir}", "${resname}", "${inputjs}", "${appicon}", "${dataroot}", "${startqml}")
	else()
		jqml_compile_web2("${webdirs}" "${buildwebdir}" "${resname}")
	endif()
endif()

