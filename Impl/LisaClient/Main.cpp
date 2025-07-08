// Qt includes
#include <QtQml/QQmlEngine>
#include <QtCore/QMetaEnum>
#include <qtmetamacros.h>

// ImtCore includes
#include <imtbase/Init.h>
#include <imtqml/CBaseType.h>

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







// #define QT_QML_LIB

int main(int argc, char *argv[])
{
	Q_INIT_RESOURCE(lisaqml);

	Q_INIT_RESOURCE(imtlicguiqml);
	Q_INIT_RESOURCE(imtlicguiTheme);

	Q_INIT_RESOURCE(imtlicFeaturesSdl);
	Q_INIT_RESOURCE(imtlicProductsSdl);
	Q_INIT_RESOURCE(imtlicLicensesSdl);


	qmlRegisterType<imtqml::CBaseStringType>("imtcontrols", 1, 0, "BaseStringType");
	qmlRegisterType<imtqml::CStringType>("imtcontrols", 1, 0, "StringType");
	qmlRegisterType<imtqml::CIntType>("imtcontrols", 1, 0, "IntType");
	qmlRegisterType<imtqml::CDoubleType>("imtcontrols", 1, 0, "DoubleType");
	qmlRegisterType<imtqml::CBoolType>("imtcontrols", 1, 0, "BoolType");
	qmlRegisterType<imtqml::CFieldFilterQml>("imtcontrols", 1, 0, "FieldFilter2");
	// qmlRegisterType<imtqml::EnumValueType>("imtcontrols", 1, 0, "EnumValueType");

	qmlRegisterSingletonType<imtqml::EnumValueType>("imtcontrols", 1, 0, "EnumValueType", [](QQmlEngine *engine, QJSEngine *scriptEngine) -> QObject * {
		Q_UNUSED(engine)
		Q_UNUSED(scriptEngine)

		imtqml::EnumValueType *enumType = new imtqml::EnumValueType();
		return enumType;
	});

	// QScopedPointer<imtqml::EnumValueType> enumValueType(new imtqml::EnumValueType);
	// QQmlEngine engine;

	// Third, register the singleton type provider with QML by calling this
	// function in an initialization function.
	// qmlRegisterSingletonInstance("imtcontrols", 1, 0, "EnumValueType", enumValueType.get());
	// qmlRegisterSingletonType()
	// qt_getEnumMetaObject()
	// qmlRegisterUncreatableMetaObject(sdl::imtbase::ComplexCollectionFilter::staticMetaObject,"imtcontrols", 1, 0, "ComplexCollectionFilter2", "Error: only enums" );
	// qmlRegisterType<sdl::imtbase::ComplexCollectionFilter::CFieldFilterObject>("imtcontrols", 1, 0, "FieldFilter2");
	qmlRegisterType<imtqml::CTimeFilterObject2>("imtcontrols", 1, 0, "TimeFilter2");
	qmlRegisterType<imtqml::CFieldFilterQml>("imtcontrols", 1, 0, "FieldFilter2");
	// sdl::imtbase::ComplexCollectionFilter::RegisterQmlTypes();

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



	// Q_INIT_RESOURCE(imtbaseSearchSdl);
	// Q_INIT_RESOURCE(imtbaseCommandsSdl);
	// Q_INIT_RESOURCE(imtbaseSettingsSdl);
	// Q_INIT_RESOURCE(imtbaseImtBaseTypesSdl);
	// Q_INIT_RESOURCE(imtbaseImtCollectionSdl);
	// Q_INIT_RESOURCE(imtbaseDocumentCollectionFilterSdl);
	// Q_INIT_RESOURCE(imtbaseComplexCollectionFilterSdl);
	// Q_INIT_RESOURCE(imtbaseDocumentRevisionSdl);
	// Q_INIT_RESOURCE(imtauthGroupsSdl);
	// Q_INIT_RESOURCE(imtauthRolesSdl);
	// Q_INIT_RESOURCE(imtauthUsersSdl);
	// Q_INIT_RESOURCE(imtauthProfileSdl);
	// Q_INIT_RESOURCE(imtauthSessionsSdl);
	// Q_INIT_RESOURCE(imtauthAuthorizationOptionsSdl);
	// Q_INIT_RESOURCE(imtauthAuthorizationSdl);
	// Q_INIT_RESOURCE(imtappApplicationSdl);
	// Q_INIT_RESOURCE(imtcolorLabSdl);
	// Q_INIT_RESOURCE(imtcolorRgbColorHexSdl);

	// qmlRegisterType<sdl::imtbase::ComplexCollectionFilter::CTimeFilterObject>("imtbaseComplexCollectionFilterSdl", 1, 0, "TimeFilter");
	// qmlRegisterType<sdl::imtbase::ComplexCollectionFilter::CFieldSortingInfoObject>("imtbaseComplexCollectionFilterSdl", 1, 0, "FieldSortingInfo");
	// qmlRegisterType<sdl::imtbase::ComplexCollectionFilter::CFieldFilterObject>("imtbaseComplexCollectionFilterSdl", 1, 0, "FieldFilter");
	// qmlRegisterType<sdl::imtbase::ComplexCollectionFilter::CGroupFilterObject>("imtbaseComplexCollectionFilterSdl", 1, 0, "GroupFilter");
	// qmlRegisterType<sdl::imtbase::ComplexCollectionFilter::CComplexCollectionFilterObject>("imtbaseComplexCollectionFilterSdl", 1, 0, "ComplexCollectionFilter");
	// qmlRegisterSingletonType<sdl::imtbase::ComplexCollectionFilter::EnumValueType>("imtbaseComplexCollectionFilterSdl", 1, 0, "ValueType", [](QQmlEngine *engine, QJSEngine *scriptEngine) -> QObject * {
	// 	Q_UNUSED(engine)
	// 	Q_UNUSED(scriptEngine)

	// 	sdl::imtbase::ComplexCollectionFilter::EnumValueType *enumType = new sdl::imtbase::ComplexCollectionFilter::EnumValueType();
	// 	return enumType;
	// });
	// qmlRegisterSingletonType<sdl::imtbase::ComplexCollectionFilter::EnumFilterOperation>("imtbaseComplexCollectionFilterSdl", 1, 0, "FilterOperation", [](QQmlEngine *engine, QJSEngine *scriptEngine) -> QObject * {
	// 	Q_UNUSED(engine)
	// 	Q_UNUSED(scriptEngine)

	// 	sdl::imtbase::ComplexCollectionFilter::EnumFilterOperation *enumType = new sdl::imtbase::ComplexCollectionFilter::EnumFilterOperation();
	// 	return enumType;
	// });
	// qmlRegisterSingletonType<sdl::imtbase::ComplexCollectionFilter::EnumLogicalOperation>("imtbaseComplexCollectionFilterSdl", 1, 0, "LogicalOperation", [](QQmlEngine *engine, QJSEngine *scriptEngine) -> QObject * {
	// 	Q_UNUSED(engine)
	// 	Q_UNUSED(scriptEngine)

	// 	sdl::imtbase::ComplexCollectionFilter::EnumLogicalOperation *enumType = new sdl::imtbase::ComplexCollectionFilter::EnumLogicalOperation();
	// 	return enumType;
	// });



	return Run<CLisaClient, DefaultImtCoreQmlInitializer>(argc, argv);
}


