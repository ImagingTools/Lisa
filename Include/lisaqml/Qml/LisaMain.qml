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

    signal settingsUpdate(string pageId);

    onSettingsUpdate: {
        console.log("window onSettingsUpdate");
    }

    function updateModels(){
        console.log("window updateModels");
        thumbnailDecorator.userManagementProvider.updateModel();
    }

    function updateAllModels(){
        settingsProvider.updateModel();
        thumbnailDecorator.updateModels();
//        featuresProvider.updateModel();
//        featuresDependenciesProvider.updateModel();
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
