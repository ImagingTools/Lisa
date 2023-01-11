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

        onLocalModelChanged: {
//            let design = designProvider.getDesignSchema();
//            designProvider.applyDesignSchema(design);

            timer.start(100);
        }

        onServerModelChanged: {
            designProvider.applyDesignSchema();
        }

        onServerSettingsSaved: {
            designProvider.applyDesignSchema();
        }

        onLocalSettingsSaved: {
            designProvider.applyDesignSchema();
        }
    }

    Timer {
        id: timer;

        onTriggered: {
            designProvider.applyDesignSchema();
        }
    }

    DesignSchemaProvider {
        id: designProvider;

        settingsProvider: settingsProviderLocal;
    }

    InstanceMaskProvider {
        id: instanceMaskProvider;

        model: settingsProviderLocal.serverModel;
    }

    ThumbnailDecorator {
        id: thumbnailDecorator;
        anchors.fill: parent;
        root: window;
        settingsProvider: settingsProviderLocal;
    }
}
