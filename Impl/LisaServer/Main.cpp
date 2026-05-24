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


