import QtQuick 2.0
import QtWebSockets 1.15
import Acf 1.0
//import "../qml"
//import "/Users/viktor/ImagingTools/ItDevelopment_mac/ImtCore/Include/imtqml/Resources/qml"
//import "../../../../../ImtCore/Include/imtqml/Resources/qml"
//import "../qml"
import imtgui 1.0


Rectangle {
    width: 300;
    height: 500;
    anchors.fill: parent;

    color: "#5d5d5d";
//    Component.onCompleted: {
//        console.log("ThumbnailDecorator onCompleted", PageEnum.ID);
//        thumbnailDecorator.updateModels();
//    }


    ThumbnailDecorator {
        id: thumbnailDecorator;
        anchors.fill: parent;

//        pagesModel: pagesModel.model
        Component.onCompleted: {
            console.log("ThumbnailDecorator onCompleted", MeterEnum.ID);
            thumbnailDecorator.updateModels();
        }

        onWidthChanged: {
            console.log("width", thumbnailDecorator.width);
        }

    }

}


