project(lisaqml LANGUAGES CXX)

include(${IMTCOREDIR}/Config/CMake/WebCompiler.cmake)
include(${ACFDIR}/Config/CMake/StaticConfig.cmake)

if(QT_VERSION_MAJOR EQUAL 6)
	target_link_libraries(${PROJECT_NAME}  Qt${QT_VERSION_MAJOR}::Core5Compat)
endif()

message("PROJECT_BINARY_DIR ${IMTCOREDIR}/Bin/web")
set(buildwebdir ${BUILDDIR}/Lisa/Bin/web)
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

list(APPEND webdirs ${IMTCOREDIR}/Include/imtstylecontrolsqml/Qml/Fonts)
list(APPEND webdirs ${buildwebdir}/Resources)

list(APPEND webdirs ${IMTCOREDIR}/Include/imtstylecontrolsqml/Qml/Acf)
list(APPEND webdirs ${buildwebdir}/src/Acf)

# copy base qml sources from to
list(APPEND webdirs ${IMTCOREDIR}/Qml/web)
list(APPEND webdirs ${buildwebdir}/Resources)

list(APPEND webdirs ${IMTCOREDIR}/Qml/imtgui)
list(APPEND webdirs ${buildwebdir}/src/imtgui)

list(APPEND webdirs ${IMTCOREDIR}/Qml/imtguigql)
list(APPEND webdirs ${buildwebdir}/src/imtguigql)

list(APPEND webdirs ${IMTCOREDIR}/Qml/imtauthgui)
list(APPEND webdirs ${buildwebdir}/src/imtauthgui)

list(APPEND webdirs ${IMTCOREDIR}/Qml/imtlicgui)
list(APPEND webdirs ${buildwebdir}/src/imtlicgui)

list(APPEND webdirs ${IMTCOREDIR}/Qml/imtcolgui)
list(APPEND webdirs ${buildwebdir}/src/imtcolgui)

list(APPEND webdirs ${IMTCOREDIR}/Qml/imtdocgui)
list(APPEND webdirs ${buildwebdir}/src/imtdocgui)

list(APPEND webdirs ${IMTCOREDIR}/Qml/imtcontrols)
list(APPEND webdirs ${buildwebdir}/src/imtcontrols)

list(APPEND webdirs ${IMTCOREDIR}/AuxInclude/${TARGETNAME}/GeneratedFiles/imtauthsdl/SDL/QML/imtauthGroupsSdl)
list(APPEND webdirs ${buildwebdir}/src/imtauthGroupsSdl)

list(APPEND webdirs ${IMTCOREDIR}/AuxInclude/${TARGETNAME}/GeneratedFiles/imtauthsdl/SDL/QML/imtauthRolesSdl)
list(APPEND webdirs ${buildwebdir}/src/imtauthRolesSdl)

list(APPEND webdirs ${IMTCOREDIR}/AuxInclude/${TARGETNAME}/GeneratedFiles/imtauthsdl/SDL/QML/imtauthUsersSdl)
list(APPEND webdirs ${buildwebdir}/src/imtauthUsersSdl)

list(APPEND webdirs ${IMTCOREDIR}/AuxInclude/${TARGETNAME}/GeneratedFiles/imtlicsdl/SDL/QML/imtlicFeaturesSdl)
list(APPEND webdirs ${buildwebdir}/src/imtlicFeaturesSdl)

list(APPEND webdirs ${IMTCOREDIR}/AuxInclude/${TARGETNAME}/GeneratedFiles/imtlicsdl/SDL/QML/imtlicProductsSdl)
list(APPEND webdirs ${buildwebdir}/src/imtlicProductsSdl)

list(APPEND webdirs ${IMTCOREDIR}/AuxInclude/${TARGETNAME}/GeneratedFiles/imtlicsdl/SDL/QML/imtlicLicensesSdl)
list(APPEND webdirs ${buildwebdir}/src/imtlicLicensesSdl)

list(APPEND webdirs ${PROJECT_SOURCE_DIR}/../../../Impl/LisaLoc/Translations)
list(APPEND webdirs ${buildwebdir}/Resources/Translations)

list(APPEND webdirs ${IMTCOREDIR}/Impl/ImtCoreLoc/Translations)
list(APPEND webdirs ${buildwebdir}/Resources/Translations)

if(DEFINED WEB_COMPILE AND  WEB_COMPILE)
	add_compile_definitions(WEB_COMPILE)
	set(resname "lisa")
	jqml_compile_web2("${webdirs}", "${buildwebdir}", "${resname}")
endif()

