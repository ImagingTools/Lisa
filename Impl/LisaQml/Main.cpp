// Qt includes
#include <QtCore/QDir>
#include <QtCore/QCoreApplication>
#include <QtWidgets/QApplication>
#include <QtWidgets/QStyleFactory>
#include <QtQml/QQmlEngine>

// ACF includes
#include <ibase/IApplication.h>

// ImtCore includes
#include <imtstyle/CImtStyle.h>
#include <imtbase/CTreeItemModel.h>
#include <imtqml/CQuickApplicationComp.h>
#include <imtqml/CApplicationDataEnumProviderComp.h>
#include <imtqml/CPageDataEnumProviderComp.h>
#include <imtqml/CCommandDataEnumProviderComp.h>

#include <GeneratedFiles/LisaQml/CLisaQml.h>


int main(int argc, char *argv[])
{
//	Q_INIT_RESOURCE(imtstyle);
	Q_INIT_RESOURCE(imtguilight_qml);
	Q_INIT_RESOURCE(imtauthgui);
	Q_INIT_RESOURCE(imtqml);
	Q_INIT_RESOURCE(AcfLoc);
	Q_INIT_RESOURCE(IacfLoc);
	Q_INIT_RESOURCE(AcfSlnLoc);
	Q_INIT_RESOURCE(ImtCoreLoc);
	Q_INIT_RESOURCE(LisaLoc);
	Q_INIT_RESOURCE(LisaQml);
	Q_INIT_RESOURCE(imtresthtml);


	imtstyle::CImtStyle* imtStylePtr = imtstyle::CImtStyle::GetInstance();
	Q_ASSERT(imtStylePtr != nullptr);
	
	imtStylePtr->setBaseStyle(QStyleFactory::create("fusion"));
	QApplication::setStyle(imtStylePtr);
	QApplication::setAttribute(Qt::AA_DisableHighDpiScaling);

	CLisaQml instance;

	imtqml::CApplicationDataEnumProviderComp appEnum;
	qmlRegisterSingletonInstance<imtqml::CApplicationDataEnumProviderComp>("Acf", 1, 0, "AppEnum", &appEnum);
	imtqml::CPageDataEnumProviderComp pageEnum;
	qmlRegisterSingletonInstance<imtqml::CPageDataEnumProviderComp>("Acf", 1, 0, "PageEnum", &pageEnum);
	imtqml::CCommandDataEnumProviderComp commandEnum;
	qmlRegisterSingletonInstance<imtqml::CCommandDataEnumProviderComp>("Acf", 1, 0, "CommandEnum", &commandEnum);

	qmlRegisterType<imtbase::CTreeItemModel>("Acf", 1, 0, "TreeItemModel");

//	ibase::IApplication* applicationPtr = instance.GetInterface<ibase::IApplication>();
	imtqml::CQuickApplicationComp* applicationPtr = dynamic_cast<imtqml::CQuickApplicationComp*>(instance.GetInterface<ibase::IApplication>());
	if (applicationPtr != nullptr){
		return applicationPtr->Execute(argc, argv);
	}

	return -1;
}


