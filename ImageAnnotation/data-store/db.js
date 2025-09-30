import { Db,RESTConnector,RESTSerializer } from "@slyte/data";

class ImageAnnotationDb extends Db{
    static Connector = RESTConnector;
    static Serializer = RESTSerializer;
}

let Schema = ImageAnnotationDb.Schema;
export {ImageAnnotationDb,Schema};
