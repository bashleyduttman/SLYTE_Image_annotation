import { prop } from "@slyte/core";
import { Schema } from "@slyte/data";
import { ImagesConnector } from "../connectors/images";
import { ImagesSerializer } from "../serializers/images";
class ImagesSchema extends Schema{
    static Connector=ImagesConnector
    static Serializer=ImagesSerializer
    
    props(){
        return {
            id:prop("string",{primaryKey:true}),
            name:prop("string"),
            size:prop("string"),
            data:prop('string'),
            file:prop("object")
        }
    }
}
export {ImagesSchema}