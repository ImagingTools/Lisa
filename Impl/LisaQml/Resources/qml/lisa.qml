import QtQuick 2.0
import QtWebSockets 1.15
import Acf 1.0
//import "../qml"
//import "/Users/viktor/ImagingTools/ItDevelopment_mac/ImtCore/Include/imtqml/Resources/qml"
//import "../../../../../ImtCore/Include/imtqml/Resources/qml"
//import "../qml"
import imtgui 1.0
//@using { src.imtgui.AuxComponents.TopPanel }
//@using { src.imtgui.AuxComponents.MenuPanel }
//@using { src.imtgui.AuxComponents.TabPanel }
//@using { src.imtgui.AuxComponents.AuxTable }
//@using { src.imtgui.AuxComponents.TreeView }
//@using { src.imtgui.AuxComponents.TreeItemDelegate }
//@using { src.imtgui.ThumbnailDecorator }

//@using { src.Acf.Style }

//@using { src.imtqml.GqlModel }
//@using { src.imtqml.TreeItemModel }
//@using { src.imtqml.JSONListModel }


Rectangle {
    id: window;
    width: 300;
    height: 500;
    anchors.fill: parent;

    color: "#5d5d5d";
//    Component.onCompleted: {
//        console.log("ThumbnailDecorator onCompleted", PageEnum.ID);
//        thumbnailDecorator.updateModels();
//    }

//    IconStyle {
//        id: IconStyle;
//    }


    Style {
        id: Style;
    }


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


