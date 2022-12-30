import QtQuick 2.0
import Acf 1.0


Item {
    property TreeItemModel model: TreeItemModel {}

    function getInstanceMask(){
        console.log("getInstanceMask");
        for (let i = 0; i < model.GetItemsCount(); i++){
            let pageModel = model.GetModelFromItem(i);

            if (pageModel){
                let pageId = pageModel.GetData("Id");
                if (pageId == "Server"){
                    let elements = pageModel.GetData("Elements");

                    for (let j = 0; j < elements.GetItemsCount(); j++){
                        let elementId = elements.GetData("Id", j);
                        if (elementId == "InstanceMask"){
                            let elementValue = elements.GetData("Value", j);
                            return elementValue;
                        }
                    }
                }
            }
        }
    }
}
