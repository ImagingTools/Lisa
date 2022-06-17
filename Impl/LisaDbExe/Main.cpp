// Qt includes
#include <QtCore/QDir>
#include <QtCore/QCoreApplication>
#include <QtWidgets/QApplication>
#include <QtWidgets/QStyleFactory>

// ACF includes
#include <ibase/IApplication.h>
#include <GeneratedFiles/LisaDbExe/CLisaDbExe.h>

// ImtCore includes
#include <imtstyle/CImtStyle.h>

#include <imtqml/CQuickApplicationComp.h>
#include <imtqml/CApplicationDataEnumProviderComp.h>
#include <imtqml/CPageDataEnumProviderComp.h>
#include <imtqml/CCommandDataEnumProviderComp.h>
#include <imtbase/CTreeItemModel.h>
#include <imtrest/CRemoteFileController.h>
#include <imtgql/CGqlModel.h>



int main(int argc, char *argv[])
{
	Q_INIT_RESOURCE(imtstyle);
//	Q_INIT_RESOURCE(AcfLoc);
//	Q_INIT_RESOURCE(IacfLoc);
//	Q_INIT_RESOURCE(AcfSlnLoc);
	Q_INIT_RESOURCE(ImtCoreLoc);
	Q_INIT_RESOURCE(LisaLoc);
	Q_INIT_RESOURCE(LisaDbExe);
	Q_INIT_RESOURCE(imtresthtml);

	Q_INIT_RESOURCE(imtlicgui);
	Q_INIT_RESOURCE(imtstyle);
	Q_INIT_RESOURCE(imtgui);
	Q_INIT_RESOURCE(imtqml);
	Q_INIT_RESOURCE(lisaqml);
	Q_INIT_RESOURCE(lisadb);
	Q_INIT_RESOURCE(imtauthgui);


	imtstyle::CImtStyle* imtStylePtr = imtstyle::CImtStyle::GetInstance();
	Q_ASSERT(imtStylePtr != nullptr);
	
	imtStylePtr->setBaseStyle(QStyleFactory::create("fusion"));
	QApplication::setStyle(imtStylePtr);
	QApplication::setAttribute(Qt::AA_EnableHighDpiScaling);

	CLisaDbExe instance;

	imtqml::CApplicationDataEnumProviderComp appEnum;
	qmlRegisterSingletonInstance<imtqml::CApplicationDataEnumProviderComp>("Acf", 1, 0, "AppEnum", &appEnum);
	imtqml::CPageDataEnumProviderComp pageEnum;
	qmlRegisterSingletonInstance<imtqml::CPageDataEnumProviderComp>("Acf", 1, 0, "PageEnum", &pageEnum);
	imtqml::CCommandDataEnumProviderComp commandEnum;
	qmlRegisterSingletonInstance<imtqml::CCommandDataEnumProviderComp>("Acf", 1, 0, "CommandEnum", &commandEnum);
	qmlRegisterType<imtbase::CTreeItemModel>("Acf", 1, 0, "TreeItemModel");
	qmlRegisterType<imtgql::CGqlModel>("Acf", 1, 0, "GqlModel");
	qmlRegisterType<imtrest::CRemoteFileController>("Acf", 1, 0, "RemoteFileController");


	ibase::IApplication* applicationPtr = instance.GetInterface<ibase::IApplication>();
	if (applicationPtr != nullptr){
		return applicationPtr->Execute(argc, argv);
	}

	return -1;
}


