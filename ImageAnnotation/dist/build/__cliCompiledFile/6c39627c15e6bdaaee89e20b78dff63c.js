import { _defineProperty } from "@slyte/core/src/lyte-utils";
import { Router } from "../node_modules/@slyte/router/index.js";
import  {ImageAnnotationMap}  from "./maps/map";
import {ImageAnnotationComponentRegistry}  from "../components/component";
import { ImageAnnotationDb } from "../data-store/db";

class ImageAnnotationRouter extends Router {
    constructor() {
        super(...arguments);

        this.beforeRouteNavigation = function(prev,current) { 
            
        };

        this.afterRouteNavigation = function(current) {

        };
    }

    lookups(){
		return [{component : ImageAnnotationComponentRegistry},{db:ImageAnnotationDb}]
	}

    getComponentRegistry() {
		return this.$component;
	}

    getConfig() {
		var config = {
			baseMap : ImageAnnotationMap,
			history:"html5"	,
			baseURL:'/'
		}
		return config;
	}

    _() {
        _;
    }
}

export {ImageAnnotationRouter} ;

