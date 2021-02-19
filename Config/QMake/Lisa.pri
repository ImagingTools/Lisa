include($(IMTCOREDIR)/Config/QMake/ImtCore.pri)

INCLUDEPATH += $(ACULADIR)/Include
INCLUDEPATH += $(ACULADIR)/Impl
INCLUDEPATH += $(ACULADIR)/$$AUXINCLUDEDIR

LIBS += -L$$PWD/../../Lib/$$COMPILER_DIR -limtzip

