TARGET = LisaServerConfigurator

include($(ACFDIR)/Config/QMake/ApplicationConfig.pri)
include($(ACFDIR)/Config/QMake/QtBaseConfig.pri)
include($(IMTCOREDIR)/Config/QMake/OpenSSL.pri)
include($(LISADIR)/Config/QMake/Lisa.pri)

HEADERS =
QT += quick qml

RESOURCES += $$files($$_PRO_FILE_PWD_/../*.qrc, false)

LIBS += -limtbase -limtgui -limtstyle -limtqml -limtapp -limtcom -limtfile -limtgql -limtdb -limtauth
LIBS += -llisaqml
LIBS += -lImtCoreLoc

# Set OS-specific build options:
win32-msvc*{
	QMAKE_CXXFLAGS += /wd4264

	# copying all Qt DLLs to destination directory
	greaterThan(QT_MAJOR_VERSION, 4): QMAKE_POST_LINK = set path=$(QTDIR)\bin;%path% && $(QTDIR)\bin\windeployqt --qmldir=$(LISADIR)/Impl/LisaServerConfigurator --qmldir=$(IMTCOREDIR)/Include/imtqml/Resources/qml --qmldir=$(IMTCOREDIR)/Include/imtgui/Qml/imtgui $$DESTDIR
}

# Set configuration of custom builds:
# ARX Compiler:
ARXC_CONFIG = $$PWD/../../../Config/Lisa.awc
ARXC_FILES += $$PWD/../LisaServerConfigurator.acc
ARXC_OUTDIR = $$OUT_PWD/$$AUXINCLUDEPATH/GeneratedFiles/$$TARGET

# Conversion of resource templates:
win*{
	# File transformation
	ACF_CONVERT_FILES = $$PWD/../VC/LisaServerConfigurator.rc.xtracf
	ACF_CONVERT_OUTDIR = $$AUXINCLUDEPATH/GeneratedFiles/$$TARGET
	ACF_CONVERT_REGISTRY =  $$PWD/../VC/FileSubstitCopyApp.acc
	ACF_CONVERT_CONFIG = $$PWD/../../../Config/BaseOnly.awc

    RC_FILE = $$OUT_PWD/$$AUXINCLUDEPATH/GeneratedFiles/$$TARGET/LisaServerConfigurator.rc
	RC_INCLUDEPATH = $$_PRO_FILE_PWD_
}

include($(ACFDIR)/Config/QMake/AcfQt.pri)
include($(ACFDIR)/Config/QMake/AcfStd.pri)
include($(ACFDIR)/Config/QMake/CustomBuild.pri)
