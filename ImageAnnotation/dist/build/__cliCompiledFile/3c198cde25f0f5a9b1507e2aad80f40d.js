import { _defineProperty } from "@slyte/core/src/lyte-utils";
import { ComponentRegistry } from "../node_modules/@slyte/component/index.js";
import { ImageAnnotationDb } from "../data-store/db";
import { ImageAnnotationRouter } from "../router/router";

class ImageAnnotationComponentRegistry extends ComponentRegistry{
    constructor(){
        super();
    }
    lookups(){
        return [{db:ImageAnnotationDb},{router:ImageAnnotationRouter}]
    }
    // addRegistries() {

    // }

    addRegistries() {
        return [this.$app.$lyteUiComponentAddon.$component];
    }

    _() {
        _;
    }
}

ImageAnnotationComponentRegistry.register({
    hash: "C_ImageAnnotation_app_0",
    refHash: "app_1",
    app: true
});

export {ImageAnnotationComponentRegistry}; 

