TARGET = LisaSettingsPlugin

#include(../../../../Config/QMake/AculaPlugin.pri)
#include($(IACFDIR)/Config/QMake/OpenCV_4_5_3.pri)
include($(IMTCOREDIR)/Config/QMake/Plugin.pri)
include($(IMTCOREDIR)/Config/QMake/ImtCore.pri)

#QT += sql

DESTDIR = $$OUT_PWD/../../../../Bin/$$COMPILER_DIR/Plugins
OBJECTS_DIR = ../$$AUXINCLUDEPATH/GeneratedFiles/$$CONFIGURATION_NAME/"$$TARGET"

#LIBS += -L../../../Lib/$$COMPILER_DIR -limeas -liproc -liqtmeas -liipr -liinsp -liqtinsp -liqtipr -licam -liqtcam -liqtmm -liprocgui -licalib -liocv -liedge -liedgegui -lAcfSlnLoc -lAcfLoc

#LIBS += -limtbase -limtdb
#LIBS += -laculatask -laculainsp -laculaipr -laculaprod

LIBS += -lifile -listd -lidoc
LIBS += -limtbase -limtapp -limtdb -limtfile -limtservice

target_link_libraries(${PROJECT_NAME} imtbase imtapp imtdb imtfile imtservice)
target_link_libraries(${PROJECT_NAME} ifile istd idoc)

# Set configuration of custom builds:
# ARX Compiler:
#ARXC_FILES += $$PWD/../AculaSurfaceInspectionPlugin.acc
#ARXC_CONFIG = $$PWD/../../../../Config/Acula.awc
#ARXC_OUTDIR = $$OUT_PWD/$$AUXINCLUDEPATH/GeneratedFiles/$$TARGET

#include($(ACFDIR)/Config/QMake/AcfQt.pri)
#include($(ACFDIR)/Config/QMake/AcfStd.pri)
#include($(ACFDIR)/Config/QMake/CustomBuild.pri)

