# Root of Lisa project
TEMPLATE = subdirs

# Libraries
SUBDIRS += lisaqml
lisaqml.file = ../../Include/lisaqml/QMake/lisaqml.pro

SUBDIRS += LisaLoc
LisaLoc.file = ../../Impl/LisaLoc/QMake/LisaLoc.pro

# Application
SUBDIRS += LisaClient
LisaClient.file = ../../Impl/LisaClient/QMake/LisaClient.pro
LisaClient.depends = LisaLoc

SUBDIRS += LisaServer
LisaServer.file = ../../Impl/LisaServer/QMake/LisaServer.pro
LisaServer.depends = LisaLoc

SUBDIRS += LisaServerConfigurator
LisaServerConfigurator.file = ../../Impl/LisaServerConfigurator/QMake/LisaServerConfigurator.pro
LisaServerConfigurator.depends = LisaLoc LisaServer

SUBDIRS += LisaQmlExe
LisaQmlExe.file = ../../Impl/LisaQmlExe/QMake/LisaQmlExe.pro
LisaQmlExe.depends = LisaLoc

