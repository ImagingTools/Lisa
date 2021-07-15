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

    AppEnum {
        id: AppEnum
    }

    CommandEnum {
        id: CommandEnum
    }

    TreeItemModel {
        id: pagesModel
        source: "../../Models/Application/Pages"
        target: "../../Models/Application/Pages"
        onStateChanged: {
            console.log("ModelState", pagesModel.state)
            if(pagesModel.state === "Ready"){
//                thumbnailDecorator.pagesModel = 0
                thumbnailDecorator.pagesModel = pagesModel
            }
        }
    }

    TreeItemModel {
        id: commandsModel
        source: "../../Models/Application/Pages/Commands?PageId=Packages"
        target: "../../Models/Application/Pages/Commands"
        baseUrl: "../../Models/Application/Pages/Commands"
        onStateChanged: {
//            console.log("ModelState", pagesModel.state)
            if(commandsModel.state === "Ready"){
//                thumbnailDecorator.pagesModel = 0
                thumbnailDecorator.commandsModel = null
                thumbnailDecorator.commandsModel = commandsModel
            }
        }
    }


    ThumbnailDecorator {
        id: thumbnailDecorator
//        pagesModel: pagesModel.model
        onWidthChanged: console.log("width", width)

    }

}


