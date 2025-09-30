import { _defineProperty } from "@slyte/core/src/lyte-utils";
import { Db,RESTConnector,RESTSerializer } from "../node_modules/@slyte/data/index.js";

class ImageAnnotationDb extends Db{
    _() {
        _;
    }
}

ImageAnnotationDb.Connector = RESTConnector;ImageAnnotationDb.Serializer = RESTSerializer;

ImageAnnotationDb.register({
    hash: "db_ImageAnnotation_app_0"
});

let Schema = ImageAnnotationDb.Schema;
export {ImageAnnotationDb,Schema};
