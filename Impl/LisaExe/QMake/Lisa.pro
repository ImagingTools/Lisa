TARGET = Lisa

include($(ACFDIR)/Config/QMake/ApplicationConfig.pri)
include($(ACFDIR)/Config/QMake/QtBaseConfig.pri)
include(../../../Config/QMake/Lisa.pri)
include($(IMTROOTDIR)/Config/QMake/Quazip.pri)

RESOURCES += $$files($$_PRO_FILE_PWD_/../*.qrc, false)

LIBS += -L../../../Lib/$$COMPILER_DIR -liauth -limeas -liqtmeas -liqtinsp -liproc -liinsp -liipr -liprocgui -lisig -liqtsig -licalibgui -licalib -licam -liqtcam -lAcfSlnLoc -lAcfLoc -liedge -liedgegui -lIacfLoc
LIBS +=  -limtbase -limtgui -limtauth -limtauthgui -limtlic -limtlicgui -lImtCoreLoc -limtwidgets -limtrepo -limtrepogui -limtcrypt -lLisaLoc -limt3dgui -limtstyle -limtrest -limtqml

win32: {
		contains(QMAKE_HOST.arch, x86_64) {
		LIBS += -L../../../../3rdParty/openssl/1.1/lib/x64 -llibcrypto
	} else {
		LIBS += -L../../../../3rdParty/openssl/1.1/lib/x86 -llibcrypto
	}
}

unix: LIBS += -lcrypto

HEADERS =

QT += xml network qml quick

# Set OS-specific build options:
win32-msvc*{
	QMAKE_CXXFLAGS += /wd4264

	# copying all Qt DLLs to destination directory
	greaterThan(QT_MAJOR_VERSION, 4): QMAKE_POST_LINK = set path=$$(QTDIR)\bin;%path% && $$(QTDIR)\bin\windeployqt $$DESTDIR
}

!macx-ios*{
	mac{
	#	ICON += $$PWD/../Mac/Lisa.icns
	#	QMAKE_INFO_PLIST = $$PWD/../Mac/Info.plist
	}
}

# Set configuration of custom builds:
# ARX Compiler:
ARXC_CONFIG = $$PWD/../../../Config/Lisa.awc
ARXC_FILES += $$PWD/../Lisa.acc
ARXC_OUTDIR = $$OUT_PWD/$$AUXINCLUDEPATH/GeneratedFiles/$$TARGET

# Conversion of resource templates:
win*{
	# File transformation
	ACF_CONVERT_FILES = $$PWD/../VC/Lisa.rc.xtracf
	ACF_CONVERT_OUTDIR = $$AUXINCLUDEPATH/GeneratedFiles/$$TARGET
	ACF_CONVERT_REGISTRY =  $$PWD/../VC/FileSubstitCopyApp.acc
	ACF_CONVERT_CONFIG = $$PWD/../../../Config/BaseOnly.awc

	RC_FILE = $$OUT_PWD/$$AUXINCLUDEPATH/GeneratedFiles/$$TARGET/Lisa.rc
	RC_INCLUDEPATH = $$_PRO_FILE_PWD_
}

include($(ACFDIR)/Config/QMake/AcfQt.pri)
include($(ACFDIR)/Config/QMake/AcfStd.pri)
include($(ACFDIR)/Config/QMake/CustomBuild.pri)

