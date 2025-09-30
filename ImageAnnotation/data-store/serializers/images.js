import { RESTSerializer } from "@slyte/data";

class ImagesSerializer extends RESTSerializer {
 normalizePayload({schemaName, type, payLoad, key, status, headers, queryParams, customData, opts }){
    console.log("hellooooo")
    console.log(payLoad)
    return {[schemaName]:payLoad};
}
}
export {ImagesSerializer}
