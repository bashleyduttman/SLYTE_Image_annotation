import { _defineProperty } from "@slyte/core/src/lyte-utils";
import { RESTSerializer } from "../../node_modules/@slyte/data/index.js";

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

    _() {
        _;
    }
}

export {AnnotationSerializer}
