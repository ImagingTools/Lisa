// Qt includes
#include <QtCore/QDir>
#include <QtCore/QCoreApplication>
#include <QtWidgets/QApplication>
#include <QtWidgets/QStyleFactory>

// ACF includes
#include <ibase/IApplication.h>
#include <GeneratedFiles/Lisa/CLisa.h>

// ImtCore includes
#include <imtstyle/CImtStyle.h>


int main(int argc, char *argv[])
{
	Q_INIT_RESOURCE(imtstyle);
	Q_INIT_RESOURCE(imtauthgui);
	Q_INIT_RESOURCE(imtqml);
	Q_INIT_RESOURCE(AcfLoc);
//	Q_INIT_RESOURCE(IacfLoc);
	Q_INIT_RESOURCE(AcfSlnLoc);
	Q_INIT_RESOURCE(ImtCoreLoc);
//	Q_INIT_RESOURCE(LisaLoc);
	Q_INIT_RESOURCE(Lisa);
	Q_INIT_RESOURCE(imtresthtml);

	imtstyle::CImtStyle* imtStylePtr = imtstyle::CImtStyle::GetInstance();
	Q_ASSERT(imtStylePtr != nullptr);
	
	imtStylePtr->setBaseStyle(QStyleFactory::create("fusion"));
	QApplication::setStyle(imtStylePtr);
	QApplication::setAttribute(Qt::AA_DisableHighDpiScaling);

	CLisa instance;

	ibase::IApplication* applicationPtr = instance.GetInterface<ibase::IApplication>();
	if (applicationPtr != nullptr){
		return applicationPtr->Execute(argc, argv);
	}

	return -1;
}


