# Root of Lisa project
TEMPLATE = subdirs

# Libraries
SUBDIRS += LisaLoc
LisaLoc.file = ../../Impl/LisaLoc/QMake/LisaLoc.pro

# Application
SUBDIRS += Lisa
Lisa.file = ../../Impl/LisaExe/QMake/Lisa.pro
Lisa.depends = LisaLoc

