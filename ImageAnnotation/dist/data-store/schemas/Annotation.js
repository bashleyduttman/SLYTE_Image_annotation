"use strict";
(self["webpackChunkImageannotation"] = self["webpackChunkImageannotation"] || []).push([["data-store/schemas/Annotation"],{

/***/ 65606896:
/*!*********************************************!*\
  !*** ./data-store/connectors/annotation.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AnnotationConnector": () => (/* binding */ AnnotationConnector)
/* harmony export */ });
/* harmony import */ var _node_modules_slyte_data_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/@slyte/data/index.js */ 4474264);



class AnnotationConnector extends _node_modules_slyte_data_index_js__WEBPACK_IMPORTED_MODULE_0__.RESTConnector{
    constructor() {
        super(...arguments);
        this.host = "http://localhost:3001/server/image_annotation/";
        this.withCredentials = false;
    }

    requestURL({url,type}){
        console.log("url is")
        console.log("type=",type)
       if(type=="getAll"){
        var imageId=localStorage.getItem("imageId");
        console.log("url added",url+'/'+imageId)
        return url+'/'+imageId;
       }
       if(type=="createEntity")
       {
        return url+'/';
       }
       
        
    }
    processRequest({url,cachedData,type}){
        // if(type=="createEntity"){
        //     return new Promise((resolve,reject)=>{
        //         console.log("cached data",cachedData)
        //         var xhr=new XMLHttpRequest();
        //         xhr.open("POST", url, true);
        //         xhr.responseType="json"
        //         var formdata=new FormData();
        //         formdata.append("image_id",cachedData.image_id);
        //         formdata.append("Bbox",cachedData.Bbox);
        //         xhr.onload = function () {
        //         if (xhr.status >= 200 && xhr.status < 300) {
        //             console.log("success from xhr")
        //         resolve(JSON.parse(xhr.response)); 
        //         } else {
        //         reject(xhr.response); 
        //         }
        //     };
        //         xhr.send(formdata)

        //         })
                    
        
    // }
     if (type == "createEntity") {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cachedData)
        })
        .then(res => res.json());
    }
}


    parseResponse({ payLoad ,type}) {
        if(type!="createEntity"){
             console.log("image payload ", payLoad);

    const filtered = payLoad.result.map((item) => {
        let bboxArray;

       
        if (typeof item.Bbox === "string") {
            bboxArray = JSON.parse(item.Bbox);
        } else {
            bboxArray = item.Bbox;
        }

       
        const bboxObject = {
            x: bboxArray[0],
            y: bboxArray[1],
            width: bboxArray[2],
            height: bboxArray[3]
        };

        return {
            image_id: item.image_id,
            Bbox: bboxObject,
            id:item.ROWID,
        };
    });

    console.log("filtered ", filtered);
    return filtered;
        }
    
}

    _() {
        _;
    }
}





/***/ }),

/***/ 38834365:
/*!******************************************!*\
  !*** ./data-store/schemas/Annotation.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AnnotationSchema": () => (/* binding */ AnnotationSchema)
/* harmony export */ });
/* harmony import */ var _node_modules_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../node_modules/@slyte/core/index.js */ 56505143);
/* harmony import */ var _node_modules_slyte_data_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/@slyte/data/index.js */ 1132799);
/* harmony import */ var _connectors_annotation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../connectors/annotation */ 65606896);
/* harmony import */ var _serializers_Annotation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../serializers/Annotation */ 11805368);






class AnnotationSchema extends _node_modules_slyte_data_index_js__WEBPACK_IMPORTED_MODULE_2__.Schema{
    props(){
        return{
           
            image_id:(0,_node_modules_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("string"),
            Bbox:(0,_node_modules_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("object"),
            // text:prop("string"),
            // created_time:prop("string"),
            // modified_time:prop("string"),
        }
    }

    _() {
        _;
    }
}

AnnotationSchema.Serializer = _serializers_Annotation__WEBPACK_IMPORTED_MODULE_1__.AnnotationSerializer;
AnnotationSchema.Connector = _connectors_annotation__WEBPACK_IMPORTED_MODULE_0__.AnnotationConnector;

AnnotationSchema.register({
    hash: "AnnotationSchema_6",
    refHash: "db_ImageAnnotation_app_0"
});

/***/ }),

/***/ 11805368:
/*!**********************************************!*\
  !*** ./data-store/serializers/Annotation.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AnnotationSerializer": () => (/* binding */ AnnotationSerializer)
/* harmony export */ });
/* harmony import */ var _node_modules_slyte_data_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/@slyte/data/index.js */ 67372236);



class AnnotationSerializer extends _node_modules_slyte_data_index_js__WEBPACK_IMPORTED_MODULE_0__.RESTSerializer {
    normalizePayload({schemaName, type, payLoad, key, status, headers, queryParams, customData, opts }){
        console.log("hellooooo")
        console.log(payLoad)
        console.log(schemaName)
        return {[schemaName]:payLoad};
    }

    _() {
        _;
    }
}




/***/ })

}]);
//# sourceMappingURL=Annotation.js.map