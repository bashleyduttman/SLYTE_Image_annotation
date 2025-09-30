import { _defineProperty } from "@slyte/core/src/lyte-utils";
import Turbo from "@slyte/component/src/directives/lyte-turbo";
import { LyteUiComponentAddon } from "./node_modules/@zoho/lyte-ui-component/addon.js";
import { Lyte } from "./node_modules/@slyte/core/index.js";
import  {ImageAnnotationDb} from "./data-store/db";
import  {ImageAnnotationComponentRegistry}  from "./components/component";
import  {ImageAnnotationRouter}  from "./router/router";

class ImageAnnotationApp extends Lyte{
    lookups(){
        return [
            LyteUiComponentAddon,
            {component : ImageAnnotationComponentRegistry},
            {router : ImageAnnotationRouter},
            {db : ImageAnnotationDb}
        ];
    }

    _() {
        _;
    }
}

export {ImageAnnotationApp};

ImageAnnotationApp.register({
    hash: "app_1",
    app: true
});

