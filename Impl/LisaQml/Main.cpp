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
#include <imtrest/CRemoteFileController.h>
#include <imtgql/CGqlModel.h>
#include <imtqml/CQuickApplicationComp.h>
#include <imtqml/CApplicationDataEnumProviderComp.h>
#include <imtqml/CPageDataEnumProviderComp.h>
#include <imtqml/CCommandDataEnumProviderComp.h>

#include <imtgql/CGqlObject.h>
#include <imtgql/CGqlRequest.h>

#include <GeneratedFiles/LisaQml/CLisaQml.h>


int main(int argc, char *argv[])
{
	Q_INIT_RESOURCE(imtauthgui);
	Q_INIT_RESOURCE(imtqml);
	Q_INIT_RESOURCE(imtstyle);
	Q_INIT_RESOURCE(imtgui);
	Q_INIT_RESOURCE(LisaQml);
	Q_INIT_RESOURCE(LisaQmlWeb);
	Q_INIT_RESOURCE(imtresthtml);
	Q_INIT_RESOURCE(imtlicgui);

	Q_INIT_RESOURCE(Webimt3dgui);
	Q_INIT_RESOURCE(Webimtauthgui);
	Q_INIT_RESOURCE(Webimtgui);
	Q_INIT_RESOURCE(Webimtlicgui);

	imtgql::CGqlEnum gqlEnum("TEST");
	imtgql::CGqlObject gqlField("items");
	imtgql::CGqlObject gqlParam("inputs");

	gqlField.InsertField("succesed");

	QVariant var;
	var.setValue(gqlEnum);

	QByteArray id_ba = "1234";
	gqlParam.InsertField("id", QVariant(id_ba));
	gqlParam.InsertField("id2", QString(id_ba));
	gqlParam.InsertField("id3", "1234");
//	gqlParam.InsertField("id2", id_ba);
//	gqlParam.InsertField("ss", QVariant::fromValue(imtgql::CGqlEnum("TEST")));
	QString str = "TEST";
	QVariant enum_v(str);
	gqlParam.InsertField("ss", imtgql::CGqlEnum(enum_v.toByteArray()));

	imtgql::CGqlRequest request(imtgql::CGqlRequest::RT_QUERY,"GetDoc");
	request.AddParam(gqlParam);
	request.AddField(gqlField);

	QByteArray ba = request.GetQuery();

	qDebug() << ba;

	imtstyle::CImtStyle* imtStylePtr = imtstyle::CImtStyle::GetInstance();
	Q_ASSERT(imtStylePtr != nullptr);
	
	imtStylePtr->setBaseStyle(QStyleFactory::create("fusion"));
	QApplication::setStyle(imtStylePtr);
	QApplication::setAttribute(Qt::AA_EnableHighDpiScaling);

	CLisaQml instance;

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


