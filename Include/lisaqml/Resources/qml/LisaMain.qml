import QtQuick 2.0
import Acf 1.0
import imtlicgui 1.0
import imtgui 1.0
import imtqml 1.0

Item {
    id: window;

    anchors.fill: parent;

    property TreeItemModel localSettings;

    signal settingsUpdate();

    onLocalSettingsChanged: {
        thumbnailDecorator.localSettings = localSettings;
    }

    onSettingsUpdate: {
        console.log("window onSettingsUpdate");
    }

    function updateModels(){
        userModeGqlModel.getUserMode();
    }

    function updateAllModels(){
        thumbnailDecorator.updateModels();

        treeViewModel.updateModel();
        featureDependenciesModel.updateModel();
        lisensesFeaturesModel.updateModel();
    }

    TreeViewModel {
        id: treeViewModel;
    }

    LicenseFeaturesModel {
        id: lisensesFeaturesModel;
    }

    FeatureDependenciesModel {
        id: featureDependenciesModel;
    }

    ThumbnailDecorator {
        id: thumbnailDecorator;

        anchors.fill: parent;
    }

//    AuthorizationPage {
//        id: authorizationPage;

//        anchors.fill: parent;
//        anchors.topMargin: 60;

//        visible: !preferenceDialog.visible;

//        onAccepted: {
//            visible = false;

//            updateAllModels();
//        }
//    }

    GqlModel{
        id: userModeGqlModel;

        function getUserMode() {
            var query = Gql.GqlRequest("query", "GetUserMode");

            var inputParams = Gql.GqlObject("input");
            query.AddParam(inputParams);

            var queryFields = Gql.GqlObject("items");
            queryFields.InsertField("UserMode");
            query.AddField(queryFields);

            var gqlData = query.GetQuery();

            this.SetGqlQuery(gqlData);
        }

        onStateChanged: {
            console.log("State:", this.state, userModeGqlModel);
            if (this.state === "Ready"){
                var dataModelLocal;

                if (userModeGqlModel.ContainsKey("errors")){
                    return;
                }

                if (userModeGqlModel.ContainsKey("data")){
                    dataModelLocal = userModeGqlModel.GetData("data")

                    if (dataModelLocal.ContainsKey("GetUserMode")){
                        dataModelLocal = dataModelLocal.GetData("GetUserMode");

                        if (dataModelLocal.ContainsKey("items")){
                            dataModelLocal = dataModelLocal.GetData("items");

                            let value = dataModelLocal.GetData("Value");
                            let parameters = dataModelLocal.GetData("Parameters");

                            if (parameters){
                                let userMode = parameters.GetData("Id", value);

                                if (userMode == "NO_USER_MANAGEMENT"){
                                    updateAllModels();
                                }
                                else if (userMode == "OPTIONAL_USER_MANAGEMENT"){

                                }
                                else if (userMode == "STRONG_USER_MANAGEMENT"){
                                    authorizationPage.visible = true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
