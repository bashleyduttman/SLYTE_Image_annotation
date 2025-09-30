import { Dberror } from "./dberror";
class ConnectorError extends Dberror {
    constructor(msg, xhr){
        super();
        this.message = msg;
        this.xhr = xhr;
    }
}
ConnectorError.register();
export { ConnectorError };