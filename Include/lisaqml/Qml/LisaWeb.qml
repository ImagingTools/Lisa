import QtQuick 2.0
import Acf 1.0

Item {
    id: window;

    anchors.fill: parent;

    LisaMain {
        anchors.fill: parent;

        Component.onCompleted: {
            designSchemaProviderAlias.applyDesignSchema("Light");
            updateModels();
        }
    }
}
