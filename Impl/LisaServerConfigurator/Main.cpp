// ImtCore includes
#include <imtbase/Init.h>
#include <imtqml/CQmlProcess.h>

// Lisa includes
#include <GeneratedFiles/LisaServerConfigurator/CLisaServerConfigurator.h>


int main(int argc, char *argv[])
{
	Q_INIT_RESOURCE(LisaServerConfigurator);
	Q_INIT_RESOURCE(lisaqml);

	qmlRegisterType<imtqml::CQmlProcess>("imtqml", 1, 0, "Process");

	return Run<CLisaServerConfigurator, DefaultImtCoreQmlInitializer>(argc, argv);
}


