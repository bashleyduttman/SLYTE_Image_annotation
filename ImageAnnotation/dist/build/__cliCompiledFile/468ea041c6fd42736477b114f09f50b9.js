import { _defineProperty } from "@slyte/core/src/lyte-utils";
import { RESTSerializer } from "../../node_modules/@slyte/data/index.js";

class ImagesSerializer extends RESTSerializer {
 normalizePayload({schemaName, type, payLoad, key, status, headers, queryParams, customData, opts }){
    console.log("hellooooo")
    console.log(payLoad)
    return {[schemaName]:payLoad};
}

 _() {
  _;
 }
}

export {ImagesSerializer}
