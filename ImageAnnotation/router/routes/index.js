import { Route } from "@slyte/router";
import { HomeComp } from "/components/javascript/home-comp";
import { ImagesSchema } from "../../data-store/schemas/Images";
import { LoadingComp } from "/components/javascript/loading-comp";
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
	actions(){
		return{
			didNavigate : function(paramsObject) {
        		
      		}

			
			
		}
	}
}

export {Index};

