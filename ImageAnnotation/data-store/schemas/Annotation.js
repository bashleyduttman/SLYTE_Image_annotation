import { prop } from "@slyte/core";
import { Schema } from "@slyte/data";
import { AnnotationConnector } from "../connectors/annotation";
import { AnnotationSerializer } from "../serializers/Annotation";

class AnnotationSchema extends Schema{
    static Connector=AnnotationConnector;
    static Serializer=AnnotationSerializer
    
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
}
export {AnnotationSchema}