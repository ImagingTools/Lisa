import QtQuick 2.0
import Acf 1.0
import imtlicgui 1.0
import imtgui 1.0
import imtqml 1.0

Item {
    id: window;

    anchors.fill: parent;

    property alias applicationInfo: applicationInfoProviderLocal.clientApplicationInfo;
    property alias localSettings: settingsProviderLocal.localModel;
    property alias settingsProvider: settingsProviderLocal;
    property alias designSchemaProviderAlias: designSchemaProvider;

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
        thumbnailDecorator.updateModels();

        featuresProvider.updateModel();
        featuresDependenciesProvider.updateModel();

        applicationInfoProviderLocal.updateModel();
    }

    function updateServerSettings(){
        settingsProviderLocal.updateModel();
    }

    FeaturesProvider {
        id: featuresProvider;
    }

    FeaturesDependenciesProvider {
        id: featuresDependenciesProvider;
    }

    ApplicationInfoProvider {
        id: applicationInfoProviderLocal;
    }

    SettingsProvider {
        id: settingsProviderLocal;

        root: window;

        onServerModelChanged: {
            settingsObserver.registerModel(settingsProviderLocal.serverModel);
            designSchemaProvider.applyDesignSchema();
        }

        onLocalModelChanged: {
            console.log("onLocalModelChanged");

            localSettingsModelObserver.registerModel(settingsProviderLocal.localModel);
            timer.start();
        }
    }

    // Timer for updating design schema when start application, without this timer request does not come
    Timer {
        id: timer;

        interval: 100;

        onTriggered: {
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

    LanguageProvider {
        id: langProvider;

        settingsProvider: settingsProviderLocal;
    }

    ThumbnailDecorator {
        id: thumbnailDecorator;
        anchors.fill: parent;
        root: window;
        settingsProvider: settingsProviderLocal;

        applicationInfoProvider: applicationInfoProviderLocal;
    }

//    Connections {
//          target: Qt.application;

//          onAboutToQuit: {
//              console.log("onAboutToQuit");
//              if (thumbnailDecorator.documentManager.dirtyDocumentsExists()){
//                    thumbnailDecorator.dialogManager.openDialog(attentionDialog, {});
//              }
//          }

//          onClosing: {
//              console.log("onClosing");
//          }
//    }

//    Component {
//        id: attentionDialog;
//        MessageDialog {
//            message: qsTr("Have dirty documents, close the app?");
//            title: qsTr("There are dirty documents");
//            onFinished: {
//                if (buttonId == "Yes"){
//                }
//            }
//        }
//    }
}
