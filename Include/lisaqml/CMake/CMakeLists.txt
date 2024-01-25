project(lisaqml LANGUAGES CXX)

include(${IMTCOREDIR}/Config/CMake/WebCompiler.cmake)
include(${ACFDIR}/Config/CMake/StaticConfig.cmake)

if(QT_VERSION_MAJOR EQUAL 6)
	find_package("Qt${QT_VERSION_MAJOR}" COMPONENTS Core5Compat REQUIRED)
	target_link_libraries(${PROJECT_NAME}  Qt${QT_VERSION_MAJOR}::Core5Compat)
endif()

message("PROJECT_BINARY_DIR ${IMTCOREDIR}/Bin/web")
set(buildwebdir ${CMAKE_CURRENT_LIST_DIR}/../../../Bin/web)
message("LASA binary dir ${buildwebdir}")

list(APPEND webdirs ${IMTCOREDIR}/3rdParty/JQML2/core/dist)
list(APPEND webdirs ${buildwebdir}/Resources)

# copy lisa qml from to
list(APPEND webdirs ${LISADIR}/Include/lisaqml/Qml)
list(APPEND webdirs ${buildwebdir}/src)

list(APPEND webdirs ${LISADIR}/Include/lisaqml/Resources/Translations)
list(APPEND webdirs ${buildwebdir}/src)

list(APPEND webdirs ${LISADIR}/Include/lisaqml/Resources/html)
list(APPEND webdirs ${buildwebdir}/Resources)

# copy base qml sources from to
list(APPEND webdirs ${IMTCOREDIR}/Qml/imtdocgui)
list(APPEND webdirs ${buildwebdir}/src/imtdocgui)

list(APPEND webdirs ${IMTCOREDIR}/Qml/imtguigql)
list(APPEND webdirs ${buildwebdir}/src/imtguigql)

list(APPEND webdirs ${IMTCOREDIR}/Qml/imtauthgui)
list(APPEND webdirs ${buildwebdir}/src/imtauthgui)

list(APPEND webdirs ${IMTCOREDIR}/Qml/imtlicgui)
list(APPEND webdirs ${buildwebdir}/src/imtlicgui)

message("LISADIR ${LISADIR}")

# copy dist from to
list(APPEND webdirs ${LISADIR}/Include/lisaqml/Resources/dist)
list(APPEND webdirs ${buildwebdir}/Resources)

# copy result from to
list(APPEND webdirs ${IMTCOREDIR}/Bin/web/build.web)
list(APPEND webdirs ${buildwebdir}/Resources)

if(DEFINED WEB_COMPILE AND  WEB_COMPILE)
	add_compile_definitions(WEB_COMPILE)
	set(resname "lisa")
	jqml_compile_web2("${webdirs}", "${buildwebdir}", "${resname}")
endif()

