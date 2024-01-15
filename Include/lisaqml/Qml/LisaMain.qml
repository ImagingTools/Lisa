import QtQuick 2.0
import Acf 1.0
import imtlicgui 1.0
import imtgui 1.0
import imtcontrols 1.0

ApplicationMain{
    id: window;

    useWebSocketSubscription: true;
    loadPageByClick: false;

    systemStatus: "UNKNOWN";

    Component.onCompleted: {
        context.application = "Lisa";
    }

    function updateAllModels(){
        console.log("settingsProviderLocal.updateModel", Style.textColor);
        thumbnailDecoratorGui.updateModels();

        FeaturesProvider.updateModel();

        applicationInfoProvider.updateModel();
    }
}

