import { _defineProperty } from "@slyte/core/src/lyte-utils";
import { RESTSerializer } from "../../node_modules/@slyte/data/index.js";

class AnnotationSerializer extends RESTSerializer {
    normalizePayload({schemaName, type, payLoad, key, status, headers, queryParams, customData, opts }){
        console.log("hellooooo")
        console.log(payLoad)
        console.log(schemaName)
        return {[schemaName]:payLoad};
    }

    _() {
        _;
    }
}

export {AnnotationSerializer}
