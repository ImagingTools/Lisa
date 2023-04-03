// Qt includes
#include <QtCore/QDir>
#include <QtCore/QCoreApplication>

// ACF includes
#include <ibase/IApplication.h>

// ImtCore includes
#include <GeneratedFiles/LisaServer/CLisaServer.h>


int main(int argc, char *argv[])
{
#ifdef WEB_COMPILE
	Q_INIT_RESOURCE(lisaqmlWeb);
#endif
	Q_INIT_RESOURCE(lisaqml);
	Q_INIT_RESOURCE(ImtCoreLoc);
	Q_INIT_RESOURCE(LisaLoc);

	Q_INIT_RESOURCE(imtauthgui);
	Q_INIT_RESOURCE(imtqml);
	Q_INIT_RESOURCE(imtstyle);
	Q_INIT_RESOURCE(imtgui);
	Q_INIT_RESOURCE(imtresthtml);
	Q_INIT_RESOURCE(imtlicgui);

	Q_INIT_RESOURCE(Webimt3dgui);
	Q_INIT_RESOURCE(Webimtauthgui);
	Q_INIT_RESOURCE(Webimtgui);
	Q_INIT_RESOURCE(Webimtlicgui);

	CLisaServer instance;

	ibase::IApplication* applicationPtr = instance.GetInterface<ibase::IApplication>();
	if (applicationPtr != nullptr){
		return applicationPtr->Execute(argc, argv);
	}

	return -1;
}


