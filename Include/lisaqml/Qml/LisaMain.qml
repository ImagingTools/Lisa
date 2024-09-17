import QtQuick 2.0
import Acf 1.0
import imtlicgui 1.0
import imtgui 1.0
import imtauthgui 1.0
import imtguigql 1.0
import imtcontrols 1.0

ApplicationMain{
    id: window;

    useWebSocketSubscription: true;
    loadPageByClick: false;
    canRecoveryPassword: false;
    authorizationServerConnected: pumaConnectionChecker.status === 1;

    Component.onCompleted: {
        context.appName = 'Lisa';
        AuthorizationController.productId = context.appName;
    }

    function updateAllModels(){
        thumbnailDecoratorGui.updateModels();

        applicationInfoProvider.updateModel();
    }

    Connections {
        target: AuthorizationController;

        function onLoginSuccessful(){
            CachedFeatureCollection.updateModel();
            CachedProductCollection.updateModel()
            CachedLicenseCollection.updateModel()
            CachedGroupCollection.updateModel();
            CachedUserCollection.updateModel();

            CachedRoleCollection.productId = context.appName;
            CachedRoleCollection.updateModel();
        }

        function onLogoutSignal(){
            CachedFeatureCollection.clearModel();
            CachedProductCollection.clearModel()
            CachedLicenseCollection.clearModel()
            CachedGroupCollection.clearModel();
            CachedUserCollection.clearModel();
            CachedRoleCollection.clearModel();
        }
    }

    WebSocketConnectionChecker {
        id: pumaConnectionChecker;
        subscriptionManager: window.subscriptionManager;
        subscriptionRequestId: "PumaWsConnection";
    }
}

