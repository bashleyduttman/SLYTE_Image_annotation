import { _defineProperty } from "@slyte/core/src/lyte-utils";
import { LyteAddon }  from "../../@slyte/core/index.js";
import {LyteUiComponentComponentRegistry} from "./components/component.js"
import { lyteUiGetValue, lyteUiReturnValueBy, lyteUiConcat, lyteUiI18n, lyteUiImageFile, lyteUiCapitalizeName, lyteUiFileSize, lyteUiOptGroupCheck, lyteUiIsObject, lyteUiReturnOnlyKey, lyteUiReturnOnlyValue } from "./components/helpers/exportable-helpers.js";
import "./components/helpers/helpers-dev.js";
import "./components/helpers/utilityFn.js";
import "./components/helpers/eventListeners.js";
import "./components/helpers/tableNavigation.js";
import "./components/helpers/lyte-copy2clip.js";

class LyteUiComponentAddon extends LyteAddon {
    lookups(){
        return [ {component : LyteUiComponentComponentRegistry} ];
    }

    static addHelpersToRegistry( registry ) {
        registry.registerHelper( 'lyteUiGetValue', lyteUiGetValue );
        registry.registerHelper( 'lyteUiReturnValueBy', lyteUiReturnValueBy );
        registry.registerHelper( 'lyteUiConcat', lyteUiConcat );
        registry.registerHelper( 'lyteUiI18n', lyteUiI18n );
        registry.registerHelper( 'lyteUiImageFile', lyteUiImageFile);
        registry.registerHelper( 'lyteUiCapitalizeName', lyteUiCapitalizeName);
        registry.registerHelper( 'lyteUiFileSize', lyteUiFileSize);
        registry.registerHelper( 'lyteUiOptGroupCheck', lyteUiOptGroupCheck);
        registry.registerHelper( 'lyteUiIsObject', lyteUiIsObject);
        registry.registerHelper( 'lyteUiReturnOnlyKey', lyteUiReturnOnlyKey);
        registry.registerHelper( 'lyteUiReturnOnlyValue', lyteUiReturnOnlyValue);
    }

    _() {
        _;
    }
}

LyteUiComponentAddon.singleTon = true;
export {LyteUiComponentAddon};

LyteUiComponentAddon.register({
    hash: "@zoho/lyte-ui-component_3"
});
