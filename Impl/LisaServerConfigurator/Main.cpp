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
