import QtQuick 2.0
import Acf 1.0
import imtlicgui 1.0
import imtgui 1.0
import imtqml 1.0

Item {
    id: window;

    anchors.fill: parent;

    property alias localSettings: settingsProviderLocal.localModel;

    property alias settingsProvider: settingsProviderLocal;

    signal settingsUpdate();

    signal localSettingsUpdated();

    onSettingsUpdate: {
        console.log("window onSettingsUpdate");
    }

    onLocalSettingsUpdated: {
        updateAllModels();
    }

    function updateModels(){
        console.log("window updateModels");
        thumbnailDecorator.userManagementProvider.updateModel();
    }

    function updateAllModels(){
        console.log("settingsProviderLocal.updateModel");
        settingsProviderLocal.updateModel();

        console.log("thumbnailDecorator.updateModels");
        thumbnailDecorator.updateModels();

        featuresProvider.updateModel();
        featuresDependenciesProvider.updateModel();
    }

    FeaturesProvider {
        id: featuresProvider;
    }

    FeaturesDependenciesProvider {
        id: featuresDependenciesProvider;
    }

    SettingsProvider {
        id: settingsProviderLocal;

        root: window;

        onServerModelChanged: {
            settingsObserver.registerModel(settingsProviderLocal.serverModel);
            designSchemaProvider.applyDesignSchema();
        }

        onLocalModelChanged: {
            localSettingsModelObserver.registerModel(settingsProviderLocal.localModel);
            designSchemaProvider.applyDesignSchema();
        }
    }

    ServerSettingsModelObserver {
        id: settingsObserver;

        designProvider: designSchemaProvider;

        root: window;
    }

    LocalSettingsModelObserver {
        id: localSettingsModelObserver;

        designProvider: designSchemaProvider;
        languageProvider: langProvider;
    }

    DesignSchemaProvider {
        id: designSchemaProvider;

        settingsProvider: settingsProviderLocal;
    }

    InstanceMaskProvider {
        id: instanceMaskProvider;

        model: settingsProviderLocal.serverModel;
    }

    LanguageProvider {
        id: langProvider;

        settingsProvider: settingsProviderLocal;
    }

    ThumbnailDecorator {
        id: thumbnailDecorator;
        anchors.fill: parent;
        root: window;
        settingsProvider: settingsProviderLocal;
    }

//    Item {
//        anchors.fill: parent;

//        Component.onCompleted: {
//            DialogManager.parent = this;
//        }
//    }
}
