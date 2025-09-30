import { Router } from "@slyte/router";
import  {ImageAnnotationMap}  from "./maps/map";
import {ImageAnnotationComponentRegistry}  from "../components/component";
import { ImageAnnotationDb } from "/data-store/db";
class ImageAnnotationRouter extends Router {
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
	
    beforeRouteNavigation = function(prev,current) { 
		
	}
	
    afterRouteNavigation = function(current) {

	}
}

export {ImageAnnotationRouter} ;

