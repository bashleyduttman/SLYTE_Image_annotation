import {Route} from "@slyte/router";
import { ImageComp } from "/components/javascript/image-comp";
import { AnnotationSchema } from "../../data-store/schemas/Annotation";
class Image extends Route{
    beforeFetch(params){
       
        console.log(params);
    }
    fetch(){
        
        this.$db.getAll({schema:AnnotationSchema}).then(function(data){
            console.log("fetched successfully ",data)
        },function(){
            console.log("not fetched successfully")
        })
        return this.$db.cache.getAll({schema:AnnotationSchema});
    }
    afterFetch(data,params){
        this.currentData={"page":params.dynamicParam}
       this.currentData={"imageAnnotations":data};
    }
    render(){
        return {outlet:"#outlet",component:ImageComp}
    }
}
export {Image}
