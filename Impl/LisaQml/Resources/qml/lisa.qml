import QtQuick 2.0
import QtWebSockets 1.15
//import Acf 1.0
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
//    color: "red"

//    PageEnum {
//        id: PageEnum
//    }

//    AppEnum {
//        id: AppEnum
//    }

//    CommandEnum {
//        id: CommandEnum
//    }

//    TreeItemModel {
//        id: pagesModel
//        source: "../../Models/Application/Pages"
//        target: "../../Models/Application/Pages"
//        onStateChanged: {
//            console.log("ModelState", pagesModel.state)
//            if(pagesModel.state === "Ready"){
////                thumbnailDecorator.pagesModel = 0
//                thumbnailDecorator.pagesModel = pagesModel
//            }
//        }
//    }

//    TreeItemModel {
//        id: commandsModel
//        source: "../../Models/Application/Pages/Commands?PageId=Packages"
//        target: "../../Models/Application/Pages/Commands"
//        baseUrl: "../../Models/Application/Pages/Commands"
//        onStateChanged: {
////            console.log("ModelState", pagesModel.state)
//            if(commandsModel.state === "Ready"){
////                thumbnailDecorator.pagesModel = 0
//                thumbnailDecorator.commandsModel = null
//                thumbnailDecorator.commandsModel = commandsModel
//            }
//        }
//    }

// AuxComponents {

// }

    ThumbnailDecorator {
        id: thumbnailDecorator;
        anchors.fill: parent;

//        pagesModel: pagesModel.model
        onWidthChanged: {
            console.log("width", thumbnailDecorator.width);
        }

    }

}


