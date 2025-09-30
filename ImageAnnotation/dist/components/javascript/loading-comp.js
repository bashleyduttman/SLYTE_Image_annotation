"use strict";
(self["webpackChunkImageannotation"] = self["webpackChunkImageannotation"] || []).push([["components/javascript/loading-comp"],{

/***/ 42251014:
/*!***********************************************!*\
  !*** ./components/javascript/loading-comp.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LoadingComp": () => (/* binding */ LoadingComp)
/* harmony export */ });
/* harmony import */ var _node_modules_slyte_component_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/@slyte/component/index.js */ 26633);



class LoadingComp extends _node_modules_slyte_component_index_js__WEBPACK_IMPORTED_MODULE_0__.Component {
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

LoadingComp.register("loading-comp", {
    hash: "LoadingComp_4",
    refHash: "C_ImageAnnotation_app_0"
}); 


/***/ })

}]);
//# sourceMappingURL=loading-comp.js.map