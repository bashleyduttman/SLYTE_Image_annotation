import { _defineProperty } from "@slyte/core/src/lyte-utils";
import { Route } from "../../node_modules/@slyte/router/index.js";
let ImagesSchema, LoadingComp, HomeComp;

class Index extends Route {
    renderLoadingTemplate(paramsObject) {
       return {outlet:"#outlet",component:LoadingComp}
 }
    fetch(){
		console.log("fetched")
		this.$db.getAll({schema:ImagesSchema}).then(function(data){
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

    static actions(arg1) {
		return Object.assign(super.actions({
			
		}), arg1);
	}

    _() {
        _;
    }

    getRequirements() {
        arguments[2].push(import(/* webpackChunkName: "data-store/schemas/Images" */
        "/Users/deepak-nts0101/Documents/LyteImageAnnotation/ImageAnnotation/data-store/schemas/Images.js").then(function(res) {
            ImagesSchema = res.ImagesSchema;
        }));

        arguments[1].push(import(/* webpackChunkName: "components/javascript/loading-comp" */
        "/Users/deepak-nts0101/Documents/LyteImageAnnotation/ImageAnnotation/components/javascript/loading-comp.js").then(function(res) {
            LoadingComp = res.LoadingComp;
        }));

        arguments[1].push(import(/* webpackChunkName: "components/javascript/home-comp" */
        "/Users/deepak-nts0101/Documents/LyteImageAnnotation/ImageAnnotation/components/javascript/home-comp.js").then(function(res) {
            HomeComp = res.HomeComp;
        }));

        "____dynamicImportsCode____";
    }
}

export {Index};

