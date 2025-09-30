import { _defineProperty } from "@slyte/core/src/lyte-utils";
import {Route} from "../../node_modules/@slyte/router/index.js"
let WildcardComp;

class Wildcard extends Route {
    render(){
        return {outlet:"#outlet",component:WildcardComp}
    }

    _() {
        _;
    }

    getRequirements() {
        arguments[1].push(import(/* webpackChunkName: "components/javascript/wildcard-comp" */
        "/Users/deepak-nts0101/Documents/LyteImageAnnotation/ImageAnnotation/components/javascript/wildcard-comp.js").then(function(res) {
            WildcardComp = res.WildcardComp;
        }));

        "____dynamicImportsCode____";
    }
}

export {Wildcard}