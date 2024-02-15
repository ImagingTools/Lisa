import QtQuick 2.0
import Acf 1.0
import imtlicgui 1.0
import imtgui 1.0
import imtcontrols 1.0

ApplicationMain{
    id: window;

    useWebSocketSubscription: true;
    loadPageByClick: false;
    canRecoveryPassword: false;

//    systemStatus: "UNKNOWN";

    Component.onCompleted: {
        context.application = "Lisa";
    }

    ModalDialogManager {
        id: modalDialogManager;

        z: 30;

        anchors.fill: parent;
    }

    function updateAllModels(){
        console.log("settingsProviderLocal.updateModel", Style.textColor);
        thumbnailDecoratorGui.updateModels();

        FeaturesProvider.updateModel();

        applicationInfoProvider.updateModel();
    }

    function loginSuccesful(){
        CachedFeatureCollection.updateModel();
        CachedProductCollection.updateModel()
        CachedLicenseCollection.updateModel()
    }
}

