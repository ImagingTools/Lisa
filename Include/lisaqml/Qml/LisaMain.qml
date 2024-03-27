import QtQuick 2.0
import Acf 1.0
import imtlicgui 1.0
import imtgui 1.0
import imtguigql 1.0
import imtcontrols 1.0

ApplicationMain{
    id: window;

    useWebSocketSubscription: true;
    loadPageByClick: false;
    canRecoveryPassword: false;
    authorizationServerConnected: pumaConnected;

    Component.onCompleted: {
        context.appName = 'Lisa';
        Events.subscribeEvent("Login", loginSuccesful);
    }

    Component.onDestruction: {
         Events.unSubscribeEvent("Login", loginSuccesful);
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

    property bool pumaConnected: false;
    SubscriptionClient {
        id: pumaSub;

        property bool ok: window.subscriptionManager.status === 1;
        onOkChanged: {
            let subscriptionRequestId = "PumaWsConnection"
            var query = Gql.GqlRequest("subscription", subscriptionRequestId);
            var queryFields = Gql.GqlObject("notification");
            queryFields.InsertField("Id");
            query.AddField(queryFields);

            window.subscriptionManager.registerSubscription(query, pumaSub)
        }

        onStateChanged: {
            console.log("PumaWsConnection onStateChanged", state);

            if (state === "Ready"){
                if (pumaSub.ContainsKey("data")){
                    let localModel = pumaSub.GetData("data")

                    if (localModel.ContainsKey("PumaWsConnection")){
                        localModel = localModel.GetData("PumaWsConnection")

                        if (localModel.ContainsKey("status")){
                            let status = localModel.GetData("status")
                            if (status === "Disconnected"){
                                window.pumaConnected = false;

                            }
                            else if (status === "Connected"){
                                window.pumaConnected = true;
                            }
                        }
                    }
                }
            }
        }
    }
}

