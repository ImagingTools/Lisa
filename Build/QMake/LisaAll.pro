# Root of Lisa project
include ($(ACFDIR)/Config/QMake/Solution.pri)

# Libraries
SUBDIRS += LisaLoc
LisaLoc.file = ../../Impl/LisaLoc/QMake/LisaLoc.pro

# Application
SUBDIRS += Lisa
Lisa.file = ../../Impl/LisaExe/QMake/Lisa.pro
Lisa.depends = LisaLoc

