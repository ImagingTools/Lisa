include($(IMTCOREDIR)/Config/QMake/ImtCore.pri)

INCLUDEPATH += $(LISADIR)/Include
INCLUDEPATH += $(LISADIR)/Impl
INCLUDEPATH += $(LISADIR)/$$AUXINCLUDEDIR

LIBS += -L$$PWD/../../Lib/$$COMPILER_DIR -limtzip

