project(lisaqml LANGUAGES CXX)

include(${IMTCOREDIR}/Config/CMake/WebCompiler.cmake)
include(${ACFDIR}/Config/CMake/StaticConfig.cmake)

if(QT_VERSION_MAJOR EQUAL 6)
	find_package("Qt${QT_VERSION_MAJOR}" COMPONENTS Core5Compat REQUIRED)
	target_link_libraries(${PROJECT_NAME}  Qt${QT_VERSION_MAJOR}::Core5Compat)
endif()

message("PROJECT_BINARY_DIR ${IMTCOREDIR}/Bin/web")

#copy compiler from to
list(APPEND webdirs ${IMTCOREDIR}/3rdParty/WebCompiler)
list(APPEND webdirs ${IMTCOREDIR}/Bin/web)

list(APPEND webdirs ${IMTCOREDIR}/Include/imtqml/Qml/empty)
list(APPEND webdirs ${IMTCOREDIR}/Bin/web/src)

# copy base qml sources from to
list(APPEND webdirs ${IMTCOREDIR}/Include/imtgui/Qml/Acf)
list(APPEND webdirs ${IMTCOREDIR}/Bin/web/src/Acf)
list(APPEND webdirs ${IMTCOREDIR}/Include/imtgui/Qml/imtgui)
list(APPEND webdirs ${IMTCOREDIR}/Bin/web/src/imtgui)
list(APPEND webdirs ${IMTCOREDIR}/Include/imtqml/Qml/imtqml)
list(APPEND webdirs ${IMTCOREDIR}/Bin/web/src/imtqml)
list(APPEND webdirs ${IMTCOREDIR}/Include/imtauthgui/Qml/imtauthgui)
list(APPEND webdirs ${IMTCOREDIR}/Bin/web/src/imtauthgui)
list(APPEND webdirs ${IMTCOREDIR}/Include/imtlicgui/Qml/imtlicgui)
list(APPEND webdirs ${IMTCOREDIR}/Bin/web/src/imtlicgui)
# copy lisa qml from to
list(APPEND webdirs ${LISADIR}/Include/lisaqml/Resources/qml)
list(APPEND webdirs ${IMTCOREDIR}/Bin/web/src)
list(APPEND webdirs ${LISADIR}/Include/lisaqml/Resources/qml/Translations)
list(APPEND webdirs ${IMTCOREDIR}/Bin/web/src)

#list(APPEND webdirs ${PROJECT_SOURCE_DIR}/../Resources/html)
list(APPEND webdirs ${LISADIR}/Include/lisaqml/Resources/html)
list(APPEND webdirs ${IMTCOREDIR}/Bin/web/Resources)

message("LISADIR $ENV{LISADIR}")

# copy dist from to
list(APPEND webdirs ${LISADIR}/Include/lisaqml/Resources/dist)
#list(APPEND webdirs ${PROJECT_SOURCE_DIR}/../Resources/dist)
list(APPEND webdirs ${IMTCOREDIR}/Bin/web/dist)

# copy result from to
list(APPEND webdirs ${IMTCOREDIR}/Bin/web/build.web)
list(APPEND webdirs ${IMTCOREDIR}/Bin/web/Resources)

#imtcore_compile_web("${webdirs}")
