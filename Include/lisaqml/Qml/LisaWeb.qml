import QtQuick 2.0
import Acf 1.0

Item {
    id: window;

    anchors.fill: parent;

    LisaMain {
        id: application;

        anchors.fill: parent;

        Component.onCompleted: {
            designProvider.applyDesignSchema("Light");
        }

        function getServerUrl(){
            return context.location;
        }
    }
}
