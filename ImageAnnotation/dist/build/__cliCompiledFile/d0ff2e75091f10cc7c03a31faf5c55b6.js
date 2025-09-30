import { _defineProperty } from "@slyte/core/src/lyte-utils";
import {Component} from "../../node_modules/@slyte/component/index.js";

class WildcardComp extends Component {
    constructor() {
		super();
	}

    data(arg1) {
		return Object.assign(super.data({
		}), arg1);	
	}

    static methods(arg1) {
		return Object.assign(super.methods({
		}), arg1);
	}

    static actions(arg1) {
		return Object.assign(super.actions({
			
		}), arg1);
	}

    static observers(arg1) {
		return Object.assign(super.observers({
		}), arg1);
	}

    _() {
        _;
    }
}

WildcardComp._template = "<template tag-name=\"wildcard-comp\"> <h1>Error 404 page not found</h1> </template>";;
WildcardComp._dynamicNodes = [];;
WildcardComp._observedAttributes = [];
export {WildcardComp};
WildcardComp.register("wildcard-comp", {
    hash: "WildcardComp_4",
    refHash: "C_ImageAnnotation_app_0"
}); 
