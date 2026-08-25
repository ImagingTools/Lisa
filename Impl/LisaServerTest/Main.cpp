// ImtCore includes
#include <imtcore/CApplicationRunner.h>
#include <imtcore/CImtCoreAuthorizableServerInitializer.h>
#include <imtcore/CImtCoreDeskInitializer.h>
#include <imtlic/IProductInfo.h>

// Lisa includes
#include <GeneratedFiles/LisaServerTest/CLisaServerTest.h>
#include "LisaFeatures.h"


static void InitializeLisaServerTestResources()
{
#ifdef WEB_COMPILE
	#ifdef USE_NEW_WEB
		Q_INIT_RESOURCE(lisaWeb);
	#else
		Q_INIT_RESOURCE(lisaqmlWeb);
	#endif
#endif

	Q_INIT_RESOURCE(lisaqml);
	Q_INIT_RESOURCE(LisaLoc);

	InitializeImtCoreAuthorizableServer();
	ImtCoreInitDeskSqlResources();
}


int main(int argc, char* argv[])
{
	InitializeLisaServerTestResources();

	CLisaServerTest instance;
	auto* productInfoPtr = instance.GetInterface<imtlic::IProductInfo>();
	if (productInfoPtr != nullptr) {
		lisa::FillProduct(*productInfoPtr);
	}

	return imtcore::CApplicationRunner::Run(argc, argv, instance);
}
