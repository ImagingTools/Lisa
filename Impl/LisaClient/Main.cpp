// ImtCore includes
#include <imtcore/CApplicationRunner.h>
#include <imtcore/CImtCoreAuthInitializer.h>
#include <imtcore/CImtCoreBaseInitializer.h>
#include <imtcore/CImtCoreLicInitializer.h>
#include <imtcore/CImtCoreLocalizationInitializer.h>
#include <imtcore/CImtCoreStyleInitializer.h>

// Lisa includes
#include <GeneratedFiles/LisaClient/CLisaClient.h>


static void InitializeLisaClientResources()
{
	Q_INIT_RESOURCE(lisaqml);

	ImtCoreInitLocalizationResources();
	ImtCoreInitBaseResources();

	ImtCoreInitStyleResources();
	ImtCoreInitAuthStyleResources();
	ImtCoreInitLicStyleResources();

	ImtCoreInitQmlApplicationCoreResources();
	ImtCoreInitQmlDocumentManagementResources();
	ImtCoreInitAuthQmlResources();
	ImtCoreInitLicQmlResources();

	InitializeImtCoreStyle();
}


int main(int argc, char* argv[])
{
	InitializeLisaClientResources();

	CLisaClient instance;
	return imtcore::CApplicationRunner::Run(argc, argv, instance);
}
