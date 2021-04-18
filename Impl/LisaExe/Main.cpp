// Qt includes
#include <QtCore/QDir>
#include <QtCore/QCoreApplication>
#include <QtWidgets/QApplication>
#include <QtWidgets/QStyleFactory>

// ACF includes
#include <ibase/IApplication.h>
#include <GeneratedFiles/Lisa/CLisa.h>

// ImtCore includes
#include <imtwidgets/CImtStyle.h>


int main(int argc, char *argv[])
{
	Q_INIT_RESOURCE(imtlicgui);
	Q_INIT_RESOURCE(imtauthgui);
	Q_INIT_RESOURCE(AcfLoc);
	Q_INIT_RESOURCE(IacfLoc);
	Q_INIT_RESOURCE(AcfSlnLoc);
	Q_INIT_RESOURCE(ImtCoreLoc);
	Q_INIT_RESOURCE(LisaLoc);
	Q_INIT_RESOURCE(Lisa);

	imtwidgets::CImtStyle* imagingToolsStylePtr = new imtwidgets::CImtStyle;
	imagingToolsStylePtr->setBaseStyle(QStyleFactory::create("fusion"));

	QApplication::setStyle(imagingToolsStylePtr);
	QApplication::setAttribute(Qt::AA_DisableHighDpiScaling);

	CLisa instance;

	ibase::IApplication* applicationPtr = instance.GetInterface<ibase::IApplication>();
	if (applicationPtr != nullptr){
		return applicationPtr->Execute(argc, argv);
	}

	return -1;
}


