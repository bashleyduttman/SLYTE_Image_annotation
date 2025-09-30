import { Route } from "@slyte/router";
import { HomeComp } from "/components/javascript/home-comp";
import { ImagesSchema } from "../../data-store/schemas/Images";
import { LoadingComp } from "/components/javascript/loading-comp";
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

	static actions(){
		return{
			
		}
	}
}

export {Index};

