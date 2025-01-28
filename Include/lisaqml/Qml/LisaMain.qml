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
    canRecoveryPassword: false;
    authorizationServerConnected: pumaConnectionChecker.status === 1;

    Connections {
        target: AuthorizationController;

        function onLoginSuccessful(){
            CachedFeatureCollection.updateModel();
            CachedProductCollection.updateModel()
            CachedLicenseCollection.updateModel()
        }

        function onLogoutSignal(){
            CachedFeatureCollection.clearModel();
            CachedProductCollection.clearModel()
            CachedLicenseCollection.clearModel()
        }
    }

	WebSocketConnectionChecker {
		id: pumaConnectionChecker;
		gqlCommandId: "PumaWsConnection";
		subscriptionManager: window.subscriptionManager;
	}
}

