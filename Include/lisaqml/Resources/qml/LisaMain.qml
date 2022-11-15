import QtQuick 2.0
import Acf 1.0
import imtlicgui 1.0
import imtgui 1.0
import imtqml 1.0

Item {
    id: window;

    anchors.fill: parent;

    property alias localSettings: settingsProvider.localModel;

    signal settingsUpdate(string pageId);

    onSettingsUpdate: {
        console.log("window onSettingsUpdate");
    }

    function updateModels(){
        console.log("window updateModels");
//        let scheme = thumbnailDecorator.preferencePage.getDesignScheme(localSettings);
//        Style.getDesignScheme(scheme);

        thumbnailDecorator.userManagementProvider.updateModel();
    }

    function updateAllModels(){
        settingsProvider.updateModel();

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

    SettingsProvider {
        id: settingsProvider;

        root: window;
    }

    ThumbnailDecorator {
        id: thumbnailDecorator;

        anchors.fill: parent;
    }
}
