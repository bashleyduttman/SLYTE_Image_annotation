import { _defineProperty } from "@slyte/core/src/lyte-utils";
import {Route} from "../../node_modules/@slyte/router/index.js";
let ImageComp, AnnotationSchema;

class Image extends Route {
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

    _() {
        _;
    }

    getRequirements() {
        arguments[1].push(import(/* webpackChunkName: "components/javascript/image-comp" */
        "/Users/deepak-nts0101/Documents/LyteImageAnnotation/ImageAnnotation/components/javascript/image-comp.js").then(function(res) {
            ImageComp = res.ImageComp;
        }));

        arguments[2].push(import(/* webpackChunkName: "data-store/schemas/Annotation" */
        "/Users/deepak-nts0101/Documents/LyteImageAnnotation/ImageAnnotation/data-store/schemas/Annotation.js").then(function(res) {
            AnnotationSchema = res.AnnotationSchema;
        }));

        "____dynamicImportsCode____";
    }
}

export {Image}
