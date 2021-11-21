# Root of Lisa project
TEMPLATE = subdirs

# Libraries
SUBDIRS += LisaLoc
LisaLoc.file = ../../Impl/LisaLoc/QMake/LisaLoc.pro

# Application
SUBDIRS += Lisa
Lisa.file = ../../Impl/LisaExe/QMake/Lisa.pro
Lisa.depends = LisaLoc

SUBDIRS += LisaDb
LisaDb.file = ../../Impl/LisaDbExe/QMake/LisaDb.pro
LisaDb.depends = LisaLoc

