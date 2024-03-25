// ACF includes
#include <icomp/export.h>

// ImtCore includes
#include <imtbase/PluginInterface.h>
#include <imtservice/TConnectionCollectionPluginComponentImpl.h>
#include <imtservice/TObjectCollectionPluginComponentImpl.h>

// Local includes
#include <GeneratedFiles/LisaSettingsPlugin/CLisaSettingsPlugin.h>


IMT_REGISTER_PLUGIN(
			imtservice::IConnectionCollectionPlugin,
			imtservice::TConnectionCollectionPluginComponentImpl<CLisaSettingsPlugin>,
			ServiceSettings,
			LisaSettings);

IMT_REGISTER_PLUGIN(
			imtservice::IObjectCollectionPlugin,
			imtservice::TObjectCollectionPluginComponentImpl<CLisaSettingsPlugin>,
			ServiceLog,
			LisaSettings);

