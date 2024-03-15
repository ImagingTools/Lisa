TARGET = LisaSdk

include($(ACFDIR)/Config/QMake/SharedLibraryConfig.pri)
include($(LISADIR)/Config/QMake/Lisa.pri)


DESTDIR = $$OUT_PWD/../../../Bin/$$COMPILER_DIR
OBJECTS_DIR = ../$$AUXINCLUDEPATH/GeneratedFiles/$$CONFIGURATION_NAME/"$$TARGET"

LIBS += -L../../../Lib/$$COMPILER_DIR -liproc

LIBS += -limtbase -limtlic -limtcrypt

# Set configuration of custom builds:
# ARX Compiler:
ARXC_FILES += $$PWD/../LisaSdk.acc
ARXC_CONFIG = $$PWD/../../../Config/Lisa.awc
ARXC_OUTDIR = $$OUT_PWD/$$AUXINCLUDEPATH/GeneratedFiles/$$TARGET

include($(ACFDIR)/Config/QMake/AcfQt.pri)
include($(ACFDIR)/Config/QMake/AcfStd.pri)
include($(ACFDIR)/Config/QMake/CustomBuild.pri)

