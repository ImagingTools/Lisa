// ACF includes
#include <icomp/export.h>

// ImtCore includes
#include <imtbase/PluginInterface.h>
#include <imtbase/TParamsSetPluginComponentImpl.h>

// Local includes
#include <GeneratedFiles/LisaSettingsPlugin/CLisaSettingsPlugin.h>


IMT_REGISTER_PLUGIN(
			imtbase::IParamsSetPlugin,
			imtbase::TParamsSetPluginComponentImpl<CLisaSettingsPlugin>,
			ParamsSet,
			LisaSettings);


