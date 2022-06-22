# Root of Lisa project
TEMPLATE = subdirs

# Libraries
SUBDIRS += lisaqml
lisaqml.file = ../../Include/lisaqml/QMake/lisaqml.pro

SUBDIRS += LisaLoc
LisaLoc.file = ../../Impl/LisaLoc/QMake/LisaLoc.pro

# Application
SUBDIRS += Lisa
Lisa.file = ../../Impl/LisaExe/QMake/Lisa.pro
Lisa.depends = LisaLoc

SUBDIRS += LisaDbExe
LisaDbExe.file = ../../Impl/LisaDbExe/QMake/LisaDbExe.pro
LisaDbExe.depends = LisaLoc

