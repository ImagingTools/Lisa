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
#include <imtbase/Init.h>

// Lisa includes
#include <GeneratedFiles/LisaClient/CLisaClient.h>
#include <GeneratedFiles/imtlicsdl/SDL/1.0/CPP/Features.h>


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


