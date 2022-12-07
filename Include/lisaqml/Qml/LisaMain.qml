import QtQuick 2.0
import Acf 1.0
import imtlicgui 1.0
import imtgui 1.0
import imtqml 1.0

Item {
    id: window;

    anchors.fill: parent;

    property alias localSettings: settingsProviderLacal.localModel;

    property alias settingsProvider: settingsProviderLacal;

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
        id: settingsProviderLacal;

        root: window;
    }

    ThumbnailDecorator {
        id: thumbnailDecorator;
        root: window;

        anchors.fill: parent;
    }
}
