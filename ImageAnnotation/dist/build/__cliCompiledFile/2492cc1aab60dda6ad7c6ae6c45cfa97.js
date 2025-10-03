import { _defineProperty } from "@slyte/core/src/lyte-utils";
import { prop } from "../../node_modules/@slyte/core/index.js";
import { Schema } from "../../node_modules/@slyte/data/index.js";
import { AnnotationConnector } from "../connectors/annotation";
import { AnnotationSerializer } from "../serializers/Annotation";

class AnnotationSchema extends Schema{
    props(){
        return{
           
            image_id:prop("string"),
            Bbox:prop("object"),
            text:prop("string")
            // text:prop("string"),
            // created_time:prop("string"),
            // modified_time:prop("string"),
        }
    }

    _() {
        _;
    }
}

AnnotationSchema.Serializer = AnnotationSerializer;
AnnotationSchema.Connector = AnnotationConnector;
export {AnnotationSchema}
AnnotationSchema.register({
    hash: "AnnotationSchema_6",
    refHash: "db_ImageAnnotation_app_0"
});