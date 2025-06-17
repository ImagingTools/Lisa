// ImtCore includes
#include <imtlic/Init.h>

// Lisa includes
#include <GeneratedFiles/LisaServer/CLisaServer.h>
#include "LisaFeatures.h"


int main(int argc, char *argv[])
{
#ifdef WEB_COMPILE
	Q_INIT_RESOURCE(lisaqmlWeb);
#endif
	Q_INIT_RESOURCE(lisaqml);
	Q_INIT_RESOURCE(LisaLoc);
	Q_INIT_RESOURCE(imtlicguiTheme);

	return ProductFeatureRun<CLisaServer, DefaultImtCoreQmlInitializer, lisa::FillProduct>(argc, argv);
}


