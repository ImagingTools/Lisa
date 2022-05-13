// Qt includes
#include <QtCore/QDir>
#include <QtCore/QCoreApplication>
#include <QtWidgets/QApplication>
#include <QtWidgets/QStyleFactory>
#include <QtQml/QQmlEngine>
#include <QQmlEngine>
#include <QtQml>

// ACF includes
#include <ibase/IApplication.h>

// ImtCore includes
#include <imtstyle/CImtStyle.h>
#include <imtbase/CTreeItemModel.h>
#include <imtgql/CGqlModel.h>
#include <imtqml/CQuickApplicationComp.h>
#include <imtqml/CApplicationDataEnumProviderComp.h>
#include <imtqml/CPageDataEnumProviderComp.h>
#include <imtqml/CCommandDataEnumProviderComp.h>
#include <imtrest/CRemoteFileController.h>

#include <GeneratedFiles/LisaClient/CLisaClient.h>


int main(int argc, char *argv[])
{
	Q_INIT_RESOURCE(imtauthgui);
	Q_INIT_RESOURCE(imtqml);
	Q_INIT_RESOURCE(imtstyle);
	Q_INIT_RESOURCE(imtgui);
	Q_INIT_RESOURCE(imtresthtml);
	Q_INIT_RESOURCE(imtlicgui);
	Q_INIT_RESOURCE(lisaqml);

	Q_INIT_RESOURCE(Webimt3dgui);
	Q_INIT_RESOURCE(Webimtauthgui);
	Q_INIT_RESOURCE(Webimtgui);
	Q_INIT_RESOURCE(Webimtlicgui);

	imtstyle::CImtStyle* imtStylePtr = imtstyle::CImtStyle::GetInstance();
	Q_ASSERT(imtStylePtr != nullptr);
	
	imtStylePtr->setBaseStyle(QStyleFactory::create("fusion"));
	QApplication::setStyle(imtStylePtr);
	QApplication::setAttribute(Qt::AA_EnableHighDpiScaling);

	CLisaClient instance;

	imtqml::CApplicationDataEnumProviderComp appEnum;
    qmlRegisterSingletonInstance<imtqml::CApplicationDataEnumProviderComp>("Acf", 1, 0, "AppEnum", &appEnum);
	imtqml::CPageDataEnumProviderComp pageEnum;
	qmlRegisterSingletonInstance<imtqml::CPageDataEnumProviderComp>("Acf", 1, 0, "PageEnum", &pageEnum);
	imtqml::CCommandDataEnumProviderComp commandEnum;
	qmlRegisterSingletonInstance<imtqml::CCommandDataEnumProviderComp>("Acf", 1, 0, "CommandEnum", &commandEnum);

	qmlRegisterType<imtbase::CTreeItemModel>("Acf", 1, 0, "TreeItemModel");
	qmlRegisterType<imtgql::CGqlModel>("Acf", 1, 0, "GqlModel");
	qmlRegisterType<imtrest::CRemoteFileController>("Acf", 1, 0, "RemoteFileController");

	imtbase::CTreeItemModel *mainModel = new imtbase::CTreeItemModel();
	mainModel->SetIsArray(true);
	for (int i = 0; i < 3; i++){
		mainModel->InsertNewItem();
		imtbase::CTreeItemModel *secondModel = new imtbase::CTreeItemModel();
		secondModel->SetIsArray(true);
		for (int j = 0; j < 4; j++){
			secondModel->InsertNewItem();
			secondModel->SetData("Id", j);
			secondModel->SetData("Value", j * 5.2,j);
		}
		mainModel->SetExternTreeModel("", secondModel,i);

	}

	ibase::IApplication* applicationPtr = instance.GetInterface<ibase::IApplication>();
	if (applicationPtr != nullptr){
		return applicationPtr->Execute(argc, argv);
	}

	return -1;
}


