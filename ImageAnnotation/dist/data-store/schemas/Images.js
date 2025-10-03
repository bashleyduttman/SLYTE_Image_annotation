"use strict";
(self["webpackChunkImageannotation"] = self["webpackChunkImageannotation"] || []).push([["data-store/schemas/Images"],{

/***/ 40923091:
/*!*****************************************!*\
  !*** ./data-store/connectors/images.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ImagesConnector": () => (/* binding */ ImagesConnector)
/* harmony export */ });
/* harmony import */ var _node_modules_slyte_data_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/@slyte/data/index.js */ 4474264);



class ImagesConnector extends _node_modules_slyte_data_index_js__WEBPACK_IMPORTED_MODULE_0__.RESTConnector{
  constructor() {
    super(...arguments);
    this.host = "http://localhost:3001/server/image_annotation/";
    this.withCredentials = false;
  }

  requestURL({schemaName, type, queryParams, payLoad, url, actionName, customData, key}){
    console.log("query params ",queryParams)
    const page=queryParams.page;
     if(type=='getAll'){
       return url+'/'+page;
     }
     else if( type=="createEntity"){
       return url;
         
     }
     
     
     
     return url;
  }
  processRequest({ type, cachedData ,url,schemaName}) {
    console.log("url ",url)

    if (type === "createEntity") {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);

        const formData = new FormData();
        xhr.responseType="json"
        formData.append("file", cachedData.file);
        formData.append("name", cachedData.name);
        formData.append("size", cachedData.size);
        

        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) {
              console.log("success from xhr")
            resolve(JSON.parse(xhr.response)); 
          } else {
            reject(xhr.response); 
          }
        };

        xhr.onerror = function () {
          reject("Network error");
        };

        xhr.send(formData);
      });
    }
  }

  parseResponse({payLoad,type}){
     
     var filtered=payLoad.result.map((item)=>({
         id:item.id,
         name:item.name,
         size:item.size,
         data:item.data,
     }))
     
     return filtered;

  }
  parseRequest({type,xhr,customData}){
     if(type=="createEntity"){
         console.log(customData);
     }

  }

  _() {
    _;
  }
}





/***/ }),

/***/ 42050514:
/*!**************************************!*\
  !*** ./data-store/schemas/Images.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ImagesSchema": () => (/* binding */ ImagesSchema)
/* harmony export */ });
/* harmony import */ var _node_modules_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../node_modules/@slyte/core/index.js */ 56505143);
/* harmony import */ var _node_modules_slyte_data_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/@slyte/data/index.js */ 1132799);
/* harmony import */ var _connectors_images__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../connectors/images */ 40923091);
/* harmony import */ var _serializers_images__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../serializers/images */ 36899538);






class ImagesSchema extends _node_modules_slyte_data_index_js__WEBPACK_IMPORTED_MODULE_2__.Schema{
    props(){
        return {
            id:(0,_node_modules_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("string",{primaryKey:true}),
            name:(0,_node_modules_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("string"),
            size:(0,_node_modules_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("string"),
            data:(0,_node_modules_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('string'),
            file:(0,_node_modules_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("object")
        }
    }

    _() {
        _;
    }
}

ImagesSchema.Serializer = _serializers_images__WEBPACK_IMPORTED_MODULE_1__.ImagesSerializer;
ImagesSchema.Connector = _connectors_images__WEBPACK_IMPORTED_MODULE_0__.ImagesConnector;

ImagesSchema.register({
    hash: "ImagesSchema_7",
    refHash: "db_ImageAnnotation_app_0"
});

/***/ }),

/***/ 36899538:
/*!******************************************!*\
  !*** ./data-store/serializers/images.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ImagesSerializer": () => (/* binding */ ImagesSerializer)
/* harmony export */ });
/* harmony import */ var _node_modules_slyte_data_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/@slyte/data/index.js */ 67372236);



class ImagesSerializer extends _node_modules_slyte_data_index_js__WEBPACK_IMPORTED_MODULE_0__.RESTSerializer {
 normalizePayload({schemaName, type, payLoad, key, status, headers, queryParams, customData, opts }){
    console.log("hellooooo")
    console.log(payLoad)
    return {[schemaName]:payLoad};
}

 _() {
  _;
 }
}




/***/ })

}]);
//# sourceMappingURL=Images.js.map