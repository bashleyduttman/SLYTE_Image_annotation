import { _defineProperty } from "@slyte/core/src/lyte-utils";
import { Db } from "../../../@slyte/data/index.js";
import {RESTConnector} from "../../../@slyte/data/index.js"
import {RESTSerializer} from "../../../@slyte/data/index.js"

class LyteUiComponentDb extends Db{
    lookups() {
        return [  ];
    }

    _() {
        _;
    }
}

LyteUiComponentDb.Connector = RESTConnector;LyteUiComponentDb.Serializer = RESTSerializer;

LyteUiComponentDb.register({
    hash: "db_lyte-ui-component_@zoho/lyte-ui-component_2"
});

let Schema = LyteUiComponentDb.Schema;
let Connector =  LyteUiComponentDb.Connector;
let Serializer = LyteUiComponentDb.Serializer;
export {LyteUiComponentDb,Schema,Connector,Serializer}; 