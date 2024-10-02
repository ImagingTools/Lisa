// ImtCore includes
#include <imtbase/Init.h>

// Lisa includes
#include <GeneratedFiles/LisaClient/CLisaClient.h>


int main(int argc, char *argv[])
{
	Q_INIT_RESOURCE(lisaqml);

	Q_INIT_RESOURCE(imtlicguiqml);
	Q_INIT_RESOURCE(imtlicguiTheme);

	Q_INIT_RESOURCE(imtlicFeaturesSdl);
	Q_INIT_RESOURCE(imtlicProductsSdl);
	Q_INIT_RESOURCE(imtlicLicensesSdl);

	return Run<CLisaClient, DefaultImtCoreQmlInitializer>(argc, argv);
}


