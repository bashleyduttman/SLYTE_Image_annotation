import { _defineProperty } from "@slyte/core/src/lyte-utils";
import {ViewConnector} from "../connectors/view.js"
import { prop, one } from "../../../../@slyte/core/index.js";
import { Schema } from "../db.js";

class ViewSchema extends Schema {
    static observers() {
        return {
            invokeSave : function(){
                this.$.save();
            }.observes("sortBy","sortOrder","selectedFields")
        };
    }

    props() {
        return {
            id : prop("string"),
            name : prop("string"),
            fields : prop("array"),
            selectedFields :prop("array"),
            sortBy : prop("string"),
            navigation : one("navigation"),
            sortOrder : prop("string",{pattern:/desc|asc/}),

        };
    }

    _() {
        _;
    }
}

ViewSchema.Connector = ViewConnector;

export { ViewSchema };
ViewSchema.register({
    hash: "ViewSchema_5",
    refHash: "db_lyte-ui-component_@zoho/lyte-ui-component_2"
});