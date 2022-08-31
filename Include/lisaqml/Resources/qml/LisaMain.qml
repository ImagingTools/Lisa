import QtQuick 2.0
import Acf 1.0
import imtlicgui 1.0
import imtgui 1.0

Item {
    id: window;

    anchors.fill: parent;

    property TreeItemModel localSettings;

    signal settingsUpdate();

    onLocalSettingsChanged: {
        thumbnailDecorator.localSettings = localSettings;
    }

    onSettingsUpdate: {
        console.log("window onSettingsUpdate");
    }

    function updateModels() {
        thumbnailDecorator.updateModels();
        treeViewModel.updateModel();

        featureDependenciesModel.updateModel();
        lisensesFeaturesModel.updateModel();
    }

    TreeViewModel {
        id: treeViewModel;
    }

    LicenseFeaturesModel {
        id: lisensesFeaturesModel;
    }

    FeatureDependenciesModel {
        id: featureDependenciesModel;
    }

    ThumbnailDecorator {
        id: thumbnailDecorator;

        anchors.fill: parent;
    }
}
