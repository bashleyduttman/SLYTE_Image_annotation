import { RESTSerializer } from "@slyte/data";

class AnnotationSerializer extends RESTSerializer {
normalizePayload({schemaName, type, payLoad, key, status, headers, queryParams, customData, opts }){
    console.log("hellooooo")
    console.log(payLoad)
    console.log(schemaName)
    
    if(type=="createEntity"){
        const id=localStorage.getItem("uniqueId");
    payLoad={id:id}
    console.log("id ",payLoad)
    }
    
    return {[schemaName]:payLoad};
}
 
}
export {AnnotationSerializer}
