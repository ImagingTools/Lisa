import QtQuick 2.0
import QtWebSockets 1.15
import Acf 1.0
import imtgui 1.0



Rectangle {
    id: window;

    width: 300;
    height: 500;

    anchors.fill: parent;

    Style {
        id: Style;
    }

    ThumbnailDecorator {
        id: thumbnailDecorator;
        anchors.fill: parent;

        Component.onCompleted: {
            console.log("ThumbnailDecorator onCompleted", MeterEnum.ID);
            thumbnailDecorator.updateModels();
        }
    }
}


