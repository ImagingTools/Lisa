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

#include "LisaDbPck.h"


// ACF includes
#include <icomp/export.h>


namespace LisaDbPck
{


I_EXPORT_PACKAGE(
			"LisaDbPck",
			"Database-related license component package",
			IM_PROJECT("\"ImagingTools Core Framework\"") IM_COMPANY("ImagingTools"));


I_EXPORT_COMPONENT(
			DatabaseConverter,
			"Component used for conversion of database entries to JSON objects",
			"Database Converter");


} // namespace LisaDbPck


