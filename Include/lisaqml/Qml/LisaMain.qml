import QtQuick 2.0
import imtlicgui 1.0
import imtgui 1.0

ApplicationMain{
    id: window;

    FeaturesProvider {
        id: featuresProvider;
    }

    FeaturesDependenciesProvider {
        id: featuresDependenciesProvider;
    }

    function updateAllModels(){
        console.log("settingsProviderLocal.updateModel");
        thumbnailDecoratorGui.updateModels();

        featuresProvider.updateModel();
        featuresDependenciesProvider.updateModel();

        applicationInfoProvider.updateModel();
    }
}

