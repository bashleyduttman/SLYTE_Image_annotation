import { _defineProperty } from "@slyte/core/src/lyte-utils";
import { prop } from "../../node_modules/@slyte/core/index.js";
import { Schema } from "../../node_modules/@slyte/data/index.js";
import { ImagesConnector } from "../connectors/images";
import { ImagesSerializer } from "../serializers/images";

class ImagesSchema extends Schema{
    props(){
        return {
            id:prop("string",{primaryKey:true}),
            name:prop("string"),
            size:prop("string"),
            data:prop('string'),
            file:prop("object")
        }
    }

    _() {
        _;
    }
}

ImagesSchema.Serializer = ImagesSerializer;
ImagesSchema.Connector = ImagesConnector;
export {ImagesSchema}
ImagesSchema.register({
    hash: "ImagesSchema_7",
    refHash: "db_ImageAnnotation_app_0"
});