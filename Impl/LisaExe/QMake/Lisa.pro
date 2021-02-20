TARGET = Lisa

include($(ACFDIR)/Config/QMake/ApplicationConfig.pri)
include($(ACFDIR)/Config/QMake/QtBaseConfig.pri)
include($(LISADIR)/Config/QMake/Lisa.pri)
include($(IMTROOTDIR)/Config/QMake/Quazip.pri)

INCLUDEPATH += ../../../Include
INCLUDEPATH += ../../../Impl
INCLUDEPATH +=  $$AUXINCLUDEDIR

RESOURCES += $$_PRO_FILE_PWD_/../*.qrc

LIBS += -L../../../Lib/$$COMPILER_DIR -liauth -limeas -liqtmeas -liqtinsp -liproc -liinsp -liipr -liprocgui -lisig -liqtsig -licalibgui -licalib -licam -liqtcam -lAcfSlnLoc -lAcfLoc -liedge -liedgegui -limtrepo -limtrepogui
LIBS +=  -limtbase -limtgui -limtqml -limtlog -limtloggui -limtwidgets -limtrest -limt3d -limtlic -limtlicgui -limt3dgui -limt3dview -lImtCoreLoc

LIBS += -liocv

HEADERS =

QT += xml network quick qml positioning location


greaterThan(QT_MAJOR_VERSION, 4): QT += printsupport

# Set OS-specific build options:
win32-msvc*{
	QMAKE_CXXFLAGS += /wd4264

	# copying all Qt DLLs to destination directory
#        greaterThan(QT_MAJOR_VERSION, 4): QMAKE_POST_LINK = set path=$(QTDIR)\bin;%path% && $(QTDIR)\bin\windeployqt --qmldir=$$(IMTCOREDIR)\..\Lisa\Impl\LisaExe\Resources\qml\ $$DESTDIR
		greaterThan(QT_MAJOR_VERSION, 4): QMAKE_POST_LINK = set path=$(QTDIR)\bin;%path% && $(QTDIR)\bin\windeployqt --qmldir=$$(IMTCOREDIR)\..\Lisa\Impl\LisaExe\Resources\qml\ --qmldir=$$PWD\..\Resources\qml\ $$DESTDIR
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

