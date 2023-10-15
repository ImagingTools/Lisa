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


