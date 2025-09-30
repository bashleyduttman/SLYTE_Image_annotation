import { ComponentRegistry } from "@slyte/component";
import { ImageAnnotationDb } from "/data-store/db";
import { ImageAnnotationRouter } from "/router/router";

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
}

export {ImageAnnotationComponentRegistry}; 

