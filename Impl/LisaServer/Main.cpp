// SPDX-License-Identifier: LicenseRef-Commercial
// Copyright (C) 2017-2020 ImagingTools GmbH
// All rights reserved.
//
// This file is part of the ImagingTools SDK.
//
// This file may be used under the terms of the ImagingTools License Agreement
// appearing in the file License.txt included in the packaging of this file.
// If you are unsure which license is appropriate for your use, please
// contact us at info@imagingtools.de.

// ImtCore includes
#include <imtcore/CApplicationRunner.h>
#include <imtcore/CImtCoreAuthorizableServerInitializer.h>
#include <imtcore/CImtCoreDeskInitializer.h>
#include <imtcore/CImtCoreLicInitializer.h>
#include <imtlic/IProductInfo.h>

// Lisa includes
#include <GeneratedFiles/LisaServer/CLisaServer.h>
#include "LisaFeatures.h"


static void InitializeLisaServerResources()
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

	Q_INIT_RESOURCE(imtstylecontrolsqml);

	ImtCoreInitDeskSqlResources();
	InitializeImtCoreAuthorizableServer();
	ImtCoreInitStyleResources();
	ImtCoreInitAuthStyleResources();
	ImtCoreInitLicStyleResources();
}


int main(int argc, char* argv[])
{
	InitializeLisaServerResources();

	CLisaServer instance;
	auto* productInfoPtr = instance.GetInterface<imtlic::IProductInfo>();
	if (productInfoPtr != nullptr) {
		lisa::FillProduct(*productInfoPtr);
	}

	return imtcore::CApplicationRunner::Run(argc, argv, instance);
}
