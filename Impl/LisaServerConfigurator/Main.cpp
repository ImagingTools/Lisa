// ImtCore includes
#include <imtbase/Init.h>

// Lisa includes
#include <GeneratedFiles/LisaServerConfigurator/CLisaServerConfigurator.h>


int main(int argc, char *argv[])
{
	Q_INIT_RESOURCE(LisaServerConfigurator);
	Q_INIT_RESOURCE(lisaqml);

	return Run<CLisaServerConfigurator, DefaultImtCoreQmlInitializer>(argc, argv);
}


