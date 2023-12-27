// Qt includes
#include <QtWidgets/QApplication>
#include <QtWidgets/QStyleFactory>
// #include <QtWebView>
#include <QSGRendererInterface>
#include <QQuickWindow>

// ACF includes
#include <ibase/IApplication.h>

// ImtCore includes
#include <imtstyle/CImtStyle.h>
#include <imtbase/CTreeItemModel.h>
#include <imtqml/CGqlModel.h>
#include <imtqml/CRemoteFileController.h>
#include <imtqml/CQuickApplicationComp.h>

#include <GeneratedFiles/LisaQmlExe/CLisaQmlExe.h>
#include <QtSql/QSqlQuery>



int main(int argc, char *argv[])
{
#ifdef WEB_COMPILE
	Q_INIT_RESOURCE(lisaqmlWeb);
#endif

	Q_INIT_RESOURCE(imtauthguiqml);
	Q_INIT_RESOURCE(imtguigqlqml);
	Q_INIT_RESOURCE(imtcolguiqml);
	Q_INIT_RESOURCE(imtqml);
	Q_INIT_RESOURCE(imtstyle);
	Q_INIT_RESOURCE(imtstyleqml);
	Q_INIT_RESOURCE(imtgui);
	Q_INIT_RESOURCE(imtguiqml);
	Q_INIT_RESOURCE(imtdocguiqml);
	Q_INIT_RESOURCE(lisaqml);
	Q_INIT_RESOURCE(ImtCoreLoc);
	Q_INIT_RESOURCE(LisaLoc);

	Q_INIT_RESOURCE(imtresthtml);
	Q_INIT_RESOURCE(imtlicguiqml);

	Q_INIT_RESOURCE(imtauthguiTheme);
	Q_INIT_RESOURCE(imtguiTheme);
	Q_INIT_RESOURCE(imtlicguiTheme);

	QApplication::setAttribute(Qt::AA_EnableHighDpiScaling);

	imtstyle::CImtStyle* imtStylePtr = imtstyle::CImtStyle::GetInstance();
	Q_ASSERT(imtStylePtr != nullptr);
	
	CLisaQmlExe instance;

	qmlRegisterType<imtbase::CTreeItemModel>("Acf", 1, 0, "TreeItemModel");
	qmlRegisterType<imtqml::CGqlModel>("Acf", 1, 0, "GqlModel");
	qmlRegisterType<imtqml::CRemoteFileController>("Acf", 1, 0, "RemoteFileController");

#if QT_VERSION >= QT_VERSION_CHECK(6, 0, 0)
	qmlRegisterModule("QtGraphicalEffects", 1, 12);
	qmlRegisterModule("QtGraphicalEffects", 1, 0);
	qmlRegisterModule("QtQuick.Dialogs", 1, 3);
#else
	qmlRegisterModule("QtQuick.Dialogs", 6, 2);
	qmlRegisterModule("Qt5Compat.GraphicalEffects", 6, 0);
#endif

	// QtWebView::initialize();
	// QCoreApplication::setAttribute(Qt::AA_ShareOpenGLContexts);
	// QQuickWindow::setGraphicsApi(QSGRendererInterface::OpenGLRhi);
	// QtWebView::initialize()
	ibase::IApplication *applicationPtr = instance.GetInterface<ibase::IApplication>();
	if (applicationPtr != nullptr){
		return applicationPtr->Execute(argc, argv);
	}


	return -1;
}


