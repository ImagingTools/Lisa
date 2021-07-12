import QtQuick 2.0
import QtWebSockets 1.15
//import Acf 1.0
//import "../qml"


Rectangle {
    width: 300
    height: 500

    color: "#5d5d5d"
//    color: "red"

    PageEnum {
        id: PageEnum
    }

    TreeItemModel {
        id: pagesModel
        source: "../../Models/Pages"
        target: "../../Models/Pages"
        onStateChanged: {
            console.log("ModelState", pagesModel.state)
            if(pagesModel.state === "Ready"){
//                thumbnailDecorator.pagesModel = 0
                thumbnailDecorator.pagesModel = pagesModel
            }
        }
    }

//    Connections {
//        target: pagesModel
//        onStateChanged: {
//            console.log("ModelState", pagesModel.state)
//            if(pagesModel.state === "Ready"){
//                thumbnailDecorator.pagesModel = pagesModel
//            }
//        }
//    }

    ThumbnailDecorator {
        id: thumbnailDecorator
//        pagesModel: pagesModel.model
        onWidthChanged: console.log("width", width)

    }

}


