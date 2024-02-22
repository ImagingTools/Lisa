// ACF includes
#include <icomp/export.h>

// ImtCore includes
#include <imtbase/PluginInterface.h>
#include <imtbase/TParamsSetPluginComponentImpl.h>
#include <imtservice/TConnectionCollectionPluginComponentImpl.h>

// Local includes
#include <GeneratedFiles/LisaSettingsPlugin/CLisaSettingsPlugin.h>


IMT_REGISTER_PLUGIN(
			imtservice::IConnectionCollectionPlugin,
			imtservice::TConnectionCollectionPluginComponentImpl<CLisaSettingsPlugin>,
			ServiceSettings,
			LisaSettings);


