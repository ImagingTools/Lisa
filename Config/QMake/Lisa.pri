include($(IMTCOREDIR)/Config/QMake/ImtCore.pri)

INCLUDEPATH += $(LISADIR)/Include
INCLUDEPATH += $(LISADIR)/Impl
INCLUDEPATH += $(LISADIR)/$$AUXINCLUDEDIR

include($(ACFDIR)/Config/QMake/ApplicationConfig.pri)
include($(ACFDIR)/Config/QMake/QtBaseConfig.pri)
include($(IMTCOREDIR)/Config/QMake/OpenSSL.pri)
include($(IACFDIR)/Config/QMake/zlib.pri)

HEADERS =
QT += xml network sql quick qml
QT += websockets

DEFINES += WEB_COMPILE

LIBS += -L$(ACFDIR)/Lib/$$COMPILER_DIR -lAcfLoc
LIBS += -L$(ACFSLNDIR)/Lib/$$COMPILER_DIR -liauth -liservice -lAcfSlnLoc
LIBS += -L$(IMTCOREDIR)/Lib/$$COMPILER_DIR -lImtCoreLoc -limtzip -limtbase -limtmail -limtgui -limtauth -limtauthgui -limtlicdb -limtlic -limtlicgui -lImtCoreLoc -limtwidgets -limtzip -limtrest -limtcrypt -limt3dgui -limtrepo -limtstyle -limtqml -limtdb -limtfile -limtlog -limtlicgql -limtguigql -limtgql -limtauthgql -limtauthdb -limtcom -limtapp -limtclientgql -limtservice -limtstylecontrolsqml -limtlicsdl -limtappsdl -limtauthsdl -limtcol -limtbasesdl -limtservergql -limtcolorsdl
LIBS += -limtcontrolsqml -limtguiqml -limtcolguiqml -limtdocguiqml -limtguigqlqml -limtauthguiqml -limtlicguiqml
LIBS += -L../../../Lib/$$COMPILER_DIR -llisaqml -lLisaLoc


