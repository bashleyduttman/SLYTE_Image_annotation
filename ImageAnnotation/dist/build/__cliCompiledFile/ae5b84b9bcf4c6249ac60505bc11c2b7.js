import { _defineProperty } from "@slyte/core/src/lyte-utils";
import {Component} from "../../node_modules/@slyte/component/index.js";

class LoadingComp extends Component {
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

LoadingComp._template = "<template tag-name=\"loading-comp\"> <div class=\"spinner\"> </div> </template><style>.spinner{\n    border-radius: 50%;\n    width: 50px;\n    height: 50px;\n   \n   \n    border: rgb(246, 240, 240) solid 4px;\n    margin-top: 20px;\n    border-top: 4px solid #1a1919;\n    \n    animation: spin 1s linear infinite;\n}\n@keyframes spin {\n 0%{transform: rotate(0deg);}\n 100%{transform: rotate(360deg);}\n}</style>";;
LoadingComp._dynamicNodes = [];;
LoadingComp._observedAttributes = [];
export {LoadingComp};
LoadingComp.register("loading-comp", {
    hash: "LoadingComp_4",
    refHash: "C_ImageAnnotation_app_0"
}); 
