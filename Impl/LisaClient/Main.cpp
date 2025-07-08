// Qt includes
#include <QtQml/QQmlEngine>
#include <QtCore/QMetaEnum>
#include <qtmetamacros.h>

// ImtCore includes
#include <imtbase/Init.h>

// Lisa includes
#include <GeneratedFiles/LisaClient/CLisaClient.h>

// SDL includes
#include <GeneratedFiles/imtbasesdl/SDL/1.0/CPP/Search.h>
#include <GeneratedFiles/imtbasesdl/SDL/1.0/CPP/Settings.h>
#include <GeneratedFiles/imtbasesdl/SDL/1.0/CPP/ComplexCollectionFilter.h>
#include <GeneratedFiles/imtbasesdl/SDL/1.0/CPP/Commands.h>
#include <GeneratedFiles/imtbasesdl/SDL/1.0/CPP/ImtBaseTypes.h>
#include <GeneratedFiles/imtbasesdl/SDL/1.0/CPP/ImtCollection.h>
#include <GeneratedFiles/imtbasesdl/SDL/1.0/CPP/DocumentRevision.h>
#include <GeneratedFiles/imtauthsdl/SDL/1.0/CPP/Groups.h>
#include <GeneratedFiles/imtauthsdl/SDL/1.0/CPP/Roles.h>
#include <GeneratedFiles/imtauthsdl/SDL/1.0/CPP/Users.h>
#include <GeneratedFiles/imtauthsdl/SDL/1.0/CPP/Profile.h>
#include <GeneratedFiles/imtauthsdl/SDL/1.0/CPP/Sessions.h>
#include <GeneratedFiles/imtauthsdl/SDL/1.0/CPP/AuthorizationOptions.h>
#include <GeneratedFiles/imtauthsdl/SDL/1.0/CPP/Authorization.h>
#include <GeneratedFiles/imtappsdl/SDL/1.0/CPP/Application.h>
#include <GeneratedFiles/imtcolorsdl/SDL/1.0/CPP/Lab.h>
#include <GeneratedFiles/imtcolorsdl/SDL/1.0/CPP/RgbColorHex.h>

#include <GeneratedFiles/imtlicsdl/SDL/1.0/CPP/Features.h>


int main(int argc, char *argv[])
{
	Q_INIT_RESOURCE(lisaqml);

	Q_INIT_RESOURCE(imtlicguiqml);
	Q_INIT_RESOURCE(imtlicguiTheme);

	Q_INIT_RESOURCE(imtlicFeaturesSdl);
	Q_INIT_RESOURCE(imtlicProductsSdl);
	Q_INIT_RESOURCE(imtlicLicensesSdl);

	sdl::imtbase::Search::RegisterQmlTypes();
	sdl::imtbase::Commands::RegisterQmlTypes();
	sdl::imtbase::Settings::RegisterQmlTypes();
	sdl::imtbase::ImtBaseTypes::RegisterQmlTypes();
	sdl::imtbase::ImtCollection::RegisterQmlTypes();
	sdl::imtbase::DocumentCollectionFilter::RegisterQmlTypes();
	sdl::imtbase::ComplexCollectionFilter::RegisterQmlTypes();
	sdl::imtbase::DocumentRevision::RegisterQmlTypes();
	sdl::imtauth::Groups::RegisterQmlTypes();
	sdl::imtauth::Roles::RegisterQmlTypes();
	sdl::imtauth::Users::RegisterQmlTypes();
	sdl::imtauth::Profile::RegisterQmlTypes();
	sdl::imtauth::Sessions::RegisterQmlTypes();
	sdl::imtauth::AuthorizationOptions::RegisterQmlTypes();
	sdl::imtauth::Authorization::RegisterQmlTypes();
	sdl::imtapp::Application::RegisterQmlTypes();
	sdl::imtcolor::Lab::RegisterQmlTypes();
	sdl::imtcolor::RgbColorHex::RegisterQmlTypes();
	sdl::imtlic::Features::RegisterQmlTypes();

	return Run<CLisaClient, DefaultImtCoreQmlInitializer>(argc, argv);
}


