import { _defineProperty } from "@slyte/core/src/lyte-utils";
import { Route } from "../../node_modules/@slyte/router/index.js";
let HomeComp, ImagesSchema, LoadingComp;

class Index extends Route {
    renderLoadingTemplate(paramsObject) {
       
       console.log("params",paramsObject)
       this.$app.Globals.set("pageNumber", {number:paramsObject.dynamicParam});
       return {outlet:"#outlet",component:LoadingComp}
 }
    fetch(paramsObject){
		
		console.log("fetched")
		this.$db.getAll({schema:ImagesSchema,qP:{page:paramsObject.dynamicParam}}).then(function(data){
			console.log(data)
		},function(){
			console.log("Cant able to fetch")
		})
		return this.$db.cache.getAll({schema:ImagesSchema});
		
	}
    afterFetch(data){
		
		this.currentData={"data":data};
		console.log("after fetch ",data);
		var size=0;
		
		console.log(data._recMap)

	}
    render() {
		
		return {outlet : "#outlet",component : HomeComp}
	}
    refreshRoute(){
		var obj = {};
		obj.refreshTemplate = true;
		this.refresh(obj);
	}
    actions(arg1) {
		return Object.assign(super.actions({
			didNavigate : function(paramsObject) {
        		
      		}

			
			
		}), arg1);
	}

    _() {
        _;
    }

    getRequirements() {
        arguments[1].push(import(/* webpackChunkName: "components/javascript/home-comp" */
        "/Users/deepak-nts0101/Documents/LyteImageAnnotation/ImageAnnotation/components/javascript/home-comp.js").then(function(res) {
            HomeComp = res.HomeComp;
        }));

        arguments[2].push(import(/* webpackChunkName: "data-store/schemas/Images" */
        "/Users/deepak-nts0101/Documents/LyteImageAnnotation/ImageAnnotation/data-store/schemas/Images.js").then(function(res) {
            ImagesSchema = res.ImagesSchema;
        }));

        arguments[1].push(import(/* webpackChunkName: "components/javascript/loading-comp" */
        "/Users/deepak-nts0101/Documents/LyteImageAnnotation/ImageAnnotation/components/javascript/loading-comp.js").then(function(res) {
            LoadingComp = res.LoadingComp;
        }));

        "____dynamicImportsCode____";
    }
}

export {Index};

