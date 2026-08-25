// ImtCore includes
#include <imtcore/CApplicationRunner.h>
#include <imtcore/CImtCoreBaseInitializer.h>
#include <imtcore/CImtCoreLocalizationInitializer.h>
#include <imtcore/CImtCoreStyleInitializer.h>
#include <imtqml/CQmlProcess.h>

// Qt includes
#include <QtQml/qqml.h>

// Lisa includes
#include <GeneratedFiles/LisaServerConfigurator/CLisaServerConfigurator.h>


static void InitializeLisaServerConfiguratorResources()
{
	Q_INIT_RESOURCE(lisaqml);

	ImtCoreInitLocalizationResources();
	ImtCoreInitBaseResources();
	ImtCoreInitStyleResources();
	ImtCoreInitQmlApplicationCoreResources();

	InitializeImtCoreStyle();
}


int main(int argc, char* argv[])
{
	InitializeLisaServerConfiguratorResources();
	qmlRegisterType<imtqml::CQmlProcess>("imtqml", 1, 0, "Process");

	CLisaServerConfigurator instance;
	return imtcore::CApplicationRunner::Run(argc, argv, instance);
}
