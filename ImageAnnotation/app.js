import { LyteUiComponentAddon } from "@zoho/lyte-ui-component/addon.js";
import { Lyte } from "@slyte/core";
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
}
export {ImageAnnotationApp};

