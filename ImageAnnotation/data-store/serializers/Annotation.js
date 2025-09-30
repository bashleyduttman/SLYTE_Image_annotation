import { RESTSerializer } from "@slyte/data";

class AnnotationSerializer extends RESTSerializer {
normalizePayload({schemaName, type, payLoad, key, status, headers, queryParams, customData, opts }){
    console.log("hellooooo")
    console.log(payLoad)
    console.log(schemaName)
    return {[schemaName]:payLoad};
}
}
export {AnnotationSerializer}
