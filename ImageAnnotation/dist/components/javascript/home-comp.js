"use strict";
(self["webpackChunkImageannotation"] = self["webpackChunkImageannotation"] || []).push([["components/javascript/home-comp"],{

/***/ 30003561:
/*!********************************************!*\
  !*** ./components/javascript/home-comp.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HomeComp": () => (/* binding */ HomeComp)
/* harmony export */ });
/* harmony import */ var _node_modules_zoho_lyte_ui_component_components_javascript_lyte_fileupload_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/@zoho/lyte-ui-component/components/javascript/lyte-fileupload.js */ 48129282);
/* harmony import */ var _loading_comp_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./loading-comp.js */ 42251014);
/* harmony import */ var _node_modules_slyte_component_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../node_modules/@slyte/component/index.js */ 26633);
/* harmony import */ var _node_modules_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../node_modules/@slyte/core/index.js */ 56505143);
/* harmony import */ var _data_store_schemas_Images__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../data-store/schemas/Images */ 42050514);







class HomeComp extends _node_modules_slyte_component_index_js__WEBPACK_IMPORTED_MODULE_3__.Component {
    constructor() {
		super();
	}
    init(){
		this.setData("images",this.data.data)
		// const temp=this.getData("images")
		var images=this.getData("images");
		this.setData("size",images.reduce((sum,img)=>sum+parseInt(img.size),0))
		console.log("image. ",images)
		
		
		
	}
    data(arg1) {
		return Object.assign(super.data({
			images:(0,_node_modules_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("array",{watch:true}),
			selectedFile:(0,_node_modules_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("object"),
			previewUrl:(0,_node_modules_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("string",{default:"none"}),
			total:(0,_node_modules_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("number",{default:0}),
			size:(0,_node_modules_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("number",{default:0})
			
		}), arg1);	
	}

    static methods(arg1) {
		return Object.assign(super.methods({
			onRemove:function(){
				console.log("dropped");
				this.setData("previewUrl","none");
			},
			onSuccess:function(event){
				
			}
		}), arg1);
	}

    static actions(arg1) {
		return Object.assign(super.actions({
			onImageChange:function(event){
				console.log("event",event)
				var file=event.target.files[0];
				const urls=[];
				
				if(file && file.type.startsWith("image/")){
					const url=URL.createObjectURL(file);
					this.setData("previewUrl",url);
					this.setData("selectedFile",file)
					
				}

			},
			onUploadImage: function(event) {
				function convertToBase64(file) {
					return new Promise((resolve, reject) => {
						const reader = new FileReader();
						reader.onload = () => resolve(reader.result);
						reader.onerror = (error) => reject(error);
						reader.readAsDataURL(file);
					});
				}

				const file = this.data.selectedFile;
				console.log("on upload image", file);

				if (file) {
					console.log("file pushed");
					const rec = this.$db.newEntity({ schema: _data_store_schemas_Images__WEBPACK_IMPORTED_MODULE_2__.ImagesSchema });

					const size = file.size.toString();

					convertToBase64(file).then((base64) => {
						console.log("base64:", base64);

						rec.$.set("name", file.name);
						rec.$.set("size", size);
						rec.$.set("file", file);
						rec.$.set("data", base64);

						rec.$.save().then(
							function(){
								
							},
							function(){

							}
						);
						this.setData("selectedFile",null)
						var filetag=document.getElementById("image-file");
						filetag.value=""
						var images=this.getData("images");
						this.setData("size",images.reduce((sum,img)=>sum+parseInt(img.size),0))
						// this.setData("size",this.getData("size")+parseInt(size));
						this.setData("previewUrl","none");
						
						
						document.querySelector('lyte-fileupload').removeUpload();
					}).catch((err) => {
						console.error("Error converting file to Base64:", err);
					});
				}
			},
			handleEdit:function(event,data,id){
				localStorage.setItem("imageData",data)
				localStorage.setItem("imageId",id)
				// console.log("id. ",id)
				this.$router.navigateTo("index.image")
			
				
			}
		,
		

		}), arg1);
	}

    static observers(arg1) {
		return Object.assign(super.observers({
			imageObserver:function(change){
				this.setData("total",this.getData("images").length)
			}.observes('images.length')
		}), arg1);
	}

    _() {
        _;
    }
}

HomeComp._template = "<template tag-name=\"home-comp\"> <div class=\"header\"> <p>Image Annotation</p> </div> <div class=\"home-details\"> <div class=\"home-details-sec\"> <div class=\"home-details-sec-first\"> Total Images </div> <div>{{expHandlers(total,'||',0)}}</div> </div> <span class=\"border\"></span> <div class=\"home-details-sec\"> <div> Total Size(Bytes) </div> <div> {{expHandlers(size,'||',0)}} </div> </div> </div> <div class=\"home-file-uploader\"> <!-- <input id=\"image-file\" onchange=\"{{action('onImageChange',event)}}\" type=\"file\" accept=\"image/*\"/> --> <lyte-fileupload lt-prop-retry-text=\"retry\" on-success=\"{{method('onSuccess')}}\" on-remove=\"{{method('onRemove')}}\" lt-prop-message=\"drag or drop images here\" lt-prop-accept=\"image/*\" lt-prop-multiple=\"false\" id=\"image-file\" lt-prop-ajax=\"{&quot;url&quot;:&quot;/Fileupload&quot;}\" onchange=\"{{action('onImageChange',event)}}\"> </lyte-fileupload> <div class=\"home-file-image-preview\"> <img class=\"{{if(ifNotEquals(previewUrl,'none'),'home-preview-available','home-preview-notAvailable')}}\" src=\"{{previewUrl}}\"> </div> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{expHandlers(previewUrl,'!=','none')}}\" is=\"case\" lc-id=\"lc_id_0\"><div> <button onclick=\"{{action('onUploadImage',event)}}\" class=\"home-img-upload-btn\">upload</button> </div></template></template> </div> <div class=\"home-images-container\"> <template items=\"{{images}}\" item=\"img\" index=\"index\" is=\"for\" _new=\"true\"><template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{expHandlers(images.length,'>',0)}}\" is=\"case\" lc-id=\"lc_id_0\"><div class=\"home-image-edit-container\"> <img src=\"{{img.data}}\"> <div class=\"home-image-edit\" onclick=\"{{action('handleEdit',event,img.data,img.id)}}\">edit</div> </div></template></template></template> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{expHandlers(images.length,'===',0)}}\" is=\"case\" lc-id=\"lc_id_0\"><div> <loading-comp></loading-comp> </div></template></template> </div> </template><style>*{\n    margin:0px;\n    padding: 0px;\n    \n}\nbody{\n  background-color: black;\n   overflow-x: hidden; \n}\n.header{\n    display: block;\n    width: 100%;\n    text-align: center;\n    background-color: black;\n    color:white;\n    padding: 20px;\n    \n}\n.home-details{\n    display: flex;\n    flex-direction: row;\n    background-color: white;\n    width:100vw;\n    height: 100px;\n    justify-content: space-between;\n    border-bottom: solid 2px black;\n}\n.home-image-edit-container{\n    position: relative;\n}\n.home-image-edit{\n    position: absolute;\n    top: 0px;\n    right:10px;\n    background-color: transparent;\n    -webkit-backdrop-filter: blur(3px);\n    cursor: pointer;\n}\n.border{\n    border: black 2px solid;\n}\n.home-images-container{\n    padding: 50px;\n    display: flex;\n   gap:10px;\n   width: 100%;\n    flex-wrap: wrap;\n    background-color: black;\n    justify-content: center;\n   \n\n}\n.home-images-container img{\n    \n    border-radius: 10px;\n    width: 500px;   \n    height: 300px;  \n        \n    \n    object-fit: cover; \n    flex: 1 1 auto;\n    \n}\n.home-details-sec{\n    width: 100%;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    background-color: white;\n    \n   \n    justify-content: space-around;\n\n}\n.home-file-uploader{\n    display: block;\n    text-align: center;\n    border-bottom: black solid 2px;\n    padding: 20px;\n    width: 100%;\n    background-color: white;\n}\n.home-details-sec div:first-child{\n    width: 100%;\n  background-color: white;\n    text-align: center;\n    border-bottom: black dashed 2px;\n   \n}\n.home-preview-available{\n    max-width:400px;\n    max-height: 400px;\n    height: auto;\n    border: black solid 2px;\n}\n.home-img-upload-btn{\n    width: 60px;\n    height: 30px;\n    background-color: black;\n    color:white;\n    cursor:pointer;\n    border-radius: 3px;\n}\n.home-preview-notAvailable{\n display: none;\n}</style>";;
HomeComp._dynamicNodes = [{"t":"tX","p":[3,1,3,0]},{"t":"tX","p":[3,5,3,1]},{"t":"a","p":[5,3]},{"t":"cD","p":[5,3],"in":3,"sibl":[2]},{"t":"a","p":[5,5,1]},{"t":"s","p":[5,7],"c":{"lc_id_0":{"dN":[{"t":"a","p":[0,1],"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{}},"hd":true,"co":["lc_id_0"],"in":2,"sibl":[1]},{"t":"a","p":[7,1]},{"t":"f","p":[7,1],"dN":[{"t":"s","p":[0],"c":{"lc_id_0":{"dN":[{"t":"a","p":[0,1],"cn":"lc_id_0"},{"t":"a","p":[0,3],"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{}},"hd":true,"co":["lc_id_0"]}],"in":1,"sibl":[0]},{"t":"s","p":[7,3],"c":{"lc_id_0":{"dN":[{"t":"cD","p":[0,1],"in":0,"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{"dc":[0],"hc":true,"trans":true}},"hd":true,"co":["lc_id_0"],"hc":true,"trans":true,"in":0},{"type":"dc","trans":true,"hc":true,"p":[3,0]}];;
HomeComp._observedAttributes = ["images", "selectedFile", "previewUrl", "total", "size"];

HomeComp.register("home-comp", {
    hash: "HomeComp_4",
    refHash: "C_ImageAnnotation_app_0"
}); 


/***/ }),

/***/ 48129282:
/*!***************************************************************************************!*\
  !*** ./node_modules/@zoho/lyte-ui-component/components/javascript/lyte-fileupload.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LyteFileuploadComponent": () => (/* binding */ LyteFileuploadComponent)
/* harmony export */ });
/* harmony import */ var _helpers_helpers_dev_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/helpers-dev.js */ 60488310);
/* harmony import */ var _lyte_text_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lyte-text.js */ 39319760);
/* harmony import */ var _slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../@slyte/core/index.js */ 56505143);
/* harmony import */ var _component_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../component.js */ 50761997);
/* harmony import */ var _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../lyte-dom/modules/lyte-dom-utils.js */ 19978124);
/* harmony import */ var _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3__);







/**
 * Renders a fileupload
 * @component lyte-fileupload
 * @dependency lyte-text, lyte-tooltip
 * @version 2.2.9
 * @utility upload,removeUpload
 * @methods beforeRender,afterRender,onBeforeAdd,onAdd,onBeforeRemove,onRemove,onBeforeSend,onSend,onFileSuccess,onFileRemove,onRequestSuccess,onRequestFailure,onSuccess,onFailure,
 * onProgress,onRetry,onReject,onChunkSuccess,onChunkError,onBeforeOpen,onDragEnter,onDragOver,onDragLeave,onBeforeDrop,onDrop,onBeforePaste,onPaste
 */
class LyteFileuploadComponent extends _component_js__WEBPACK_IMPORTED_MODULE_2__.Component {
    constructor() {
		super();
	}

    init() {
		this.getMethods('beforeRender') && this.executeMethod('beforeRender', this.$node)
	}

    didConnect() {
		var lyteSelf = this;
		this._file = this.$node.querySelector('input.fileuploadInput');
		this.$node.upload = this.processqueue.bind(this);
		this.$node.removeUpload = function (id) {
			if (id) {
				this.removeFrmUpload(id, 'queueList');
			} else {
				this.removeFrmUpload(this.data.queueList, 'queueList', true);
			}
			this._file.value = "";
		}.bind(this)
		this.$node.predefined = function (files) {
			if (!Array.isArray(files)) {
				files = [files]
			}
			for (var index = 0; index < files.length; index++) {
				lyteSelf.$addon.arrayUtils(this.data.predefinedList, "push", files[index]);
			}
		}.bind(this);
        /**
		* @utility addFiles
		* @version 2.2.15
		*/
		this.$node.addFiles = function (files) {
			if (!Array.isArray(files)) {
				files = [files]
			}
			this.validate(files);
		}.bind(this);
		this.folderUpload();
		this.getMethods('afterRender') && this.executeMethod('afterRender', this.$node);
	}

    didDestroy() {
		this.$node.removeUpload();
		if (this._triggerId) {
			clearTimeout(this._triggerId);
			delete this._triggerId;
		}
		if (this._resetId) {
			clearTimeout(this._resetId);
			delete this._resetId;
		}
		delete this._file;
		delete this.$node.upload;
		delete this.$node.removeUpload;
		delete this.$node.predefined;
		delete this.$node.addFiles;
	}

    addAriaForButton(aria, key, dataName, defaultValue) {
		if (aria.hasOwnProperty(key)) {
			defaultValue = aria[key];
			delete aria[key];
		}
		this.setData(dataName, defaultValue);
	}

    addAriaValues(newAria) {
		var oldAria = this.data.commonAriaLabel;
		var fileUploadWrapper = this.$node.querySelector(".fileUploadWrapper");
		newAria = Object.assign({}, newAria);
		this.addAriaForButton(newAria, "close-label", "ariaCloseLabel", "remove");
		window._lyteUiUtils.setAttribute(fileUploadWrapper, newAria, oldAria);
		this.setData("commonAriaLabel", newAria);
	}

    data(arg1) {
		return Object.assign(super.data({
			// file input property
			/**
			 * @componentProperty {string} ltPropName=file
			 */
			ltPropName: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('string', { "default": "file" }),
			/**
			 * @componentProperty {boolean} ltPropMultiple=true
			 */
			ltPropMultiple: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('boolean', { "default": true }),
			/**
			 * @componentProperty {string} ltPropAccept
			 */
			ltPropAccept: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('string', { "default": '' }),
			/**
			 * @componentProperty {string} ltPropId
			*/
			ltPropId: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('string', { "default": '' }),
			/**
			 * @componentProperty {string} ltPropClass
			 */
			ltPropClass: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('string', { "default": '' }),
			/**
			 * @componentProperty {Box | Btn | Input} ltPropAppearance=Box
			 */
			ltPropAppearance: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('string', {
				"default": window._lyteUiUtils.resolveDefaultValue('lyte-fileupload', 'appearance', "Box")
			}),
			/**
			 * @componentProperty {boolean} ltPropDisabled=false
			 */
			ltPropDisabled: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('boolean', { "default": false }),
			// file uploader data
			/**
			 * @componentProperty {boolean} ltPropYield=false
			 */
			ltPropYield: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('boolean', { "default": false }),
			// ltPropMultipleUpload : Lyte.attr( 'boolean', { default : true } ),
			/**
			 * @componentProperty {number} ltPropFileLimit
			*/
			ltPropFileLimit: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('number', { "default": undefined }),
			/**
			 * @componentProperty {number} ltPropMinimumFileSize=0
			 * @version 2.2.11
			*/
			ltPropMinimumFileSize: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('number', { "default": 0 }),
			/**
			 * @componentProperty {number} ltPropTotalFilesSize
			 * @version 3.2.1
			*/
			ltPropTotalFilesSize: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('string'),
			/**
			 * @componentProperty {number} ltPropParallel=2
			*/
			ltPropParallel: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('number', { "default": 2 }),
			/**
			 * @componentProperty {boolean} ltPropAutoUpload=true
			*/
			ltPropAutoUpload: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('boolean', { "default": true }),
			/**
			 * @componentProperty {boolean} ltPropTriggerUpload=false
			*/
			ltPropTriggerUpload: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('boolean', { "default": false }),
			/**
			 * @componentProperty {string} ltPropParamName=file
			 */
			ltPropParamName: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('string', {
				"default": window._lyteUiUtils.resolveDefaultValue('lyte-fileupload', 'paramName', 'file')
			}),
			/**
			 * @componentProperty {boolean} ltPropThumb=false
			 */
			ltPropThumb: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('boolean', { "default": false }),
			/**
			 * @componentProperty {number} ltPropTabindex=0
			 */
			ltPropTabindex: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('number', { "default": 0 }),
			/**
			 * @componentProperty {number} ltPropRetry=2
			 */
			ltPropRetry: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('number', {
				"default": window._lyteUiUtils.resolveDefaultValue('lyte-fileupload', 'retry', 2)
			}),
			/**
			 * @componentProperty {Bytes | KB | MB | GB | TB | PB | EB | ZB | YB} ltPropFileUnit
			 */
			ltPropFileUnit: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('string', { "default": '' }),
			/**
			 * @componentProperty {number} ltPropDigits=1
			 */
			ltPropDigits: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('number', {
				"default": window._lyteUiUtils.resolveDefaultValue('lyte-fileupload', 'digits', 1)
			}),
			/**
			 * @componentProperty {string} ltPropMessage
			 * @default Drag file here or browse to upload
			 */
			ltPropMessage: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('string', {
				"default": window._lyteUiUtils.resolveDefaultValue('lyte-fileupload', 'message', "Drag file here or browse to upload")
			}),
			/**
			 * @componentProperty {string} ltPropFailureMessage
			 * @default Attachment failed
			 */
			ltPropFailureMessage: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('string', {
				"default": window._lyteUiUtils.resolveDefaultValue('lyte-fileupload', 'failureMessage', "Attachment failed")
			}),
			/**
			 * @componentProperty {string} ltPropRetryText=Retry
			 */
			ltPropRetryText: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('string', {
				"default": window._lyteUiUtils.resolveDefaultValue('lyte-fileupload', 'retryText', "Retry")
			}),
			ltPropFiles: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("array", { "default": [] }),
			/**
			 * @componentProperty {boolean} ltPropChunk=false
			 */
			ltPropFolder: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("boolean", { "default": false }),
			// chunking
			/**
			 * @componentProperty {boolean} ltPropChunk=false
			 */
			ltPropChunk: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('boolean', { "default": false }),
			/**
			 * @componentProperty {number} ltPropChunkSize=2000000
			 */
			ltPropChunkSize: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('number', { "default": 2000000 }),
			/**
			 * @componentProperty {boolean} ltPropParallelChunkUpload=false
			 */
			ltPropParallelChunkUpload: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('boolean', { "default": false }),
			/**
			 * @componentProperty {number} ltPropParallelChunkCount=Infinity
			 */
			ltPropParallelChunkCount: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('number', { "default": Infinity }),
			/**
			 * @componentProperty {number} ltPropChunkRetry=2
			 */
			ltPropChunkRetry: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('number', { "default": 2 }),

			// preventing multiple upload
			/**
			 * @componentProperty {boolean} ltPropUploadMultiple=false
			 */
			ltPropUploadMultiple: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('boolean', { "default": false }),
			/**
			 * @componentProperty {number} ltPropUploadMultipleCount=Infinity
			 */
			ltPropUploadMultipleCount: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('number', { "default": Infinity }),
			/**
				 * @typedef {Object} ajaxConfig
			 * @property {string} url=''
			 */
			/**
			 * @componentProperty {ajaxConfig} ltPropAjax
			 */
			ltPropAjax: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('object', { "default": { url: '' } }),
			/**
			 * @componentProperty {boolean} ltPropAllowReplace=false
			 */
			ltPropAllowReplace: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("boolean", { "default": false }),
			/**
			 * @componentProperty {number} ltPropFilesCount=Infinity
			 * @version 3.25.0
			 */
			ltPropFilesCount: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("number", { "default": Infinity }),
			/**
			* @componentProperty {object} ltPropAriaAttributes
			* @version 3.1.0
			* @default {}
			*/
			ltPropAriaAttributes: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('object', {
				default: {
					role: "button",
					'aria-roledescription': "fileupload"
				}, watch: true
			}),
			/**
			* @componentProperty {boolean} ltPropReset=false
			* @version 3.59.0
			*/
			ltPropReset: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("boolean", { default: false }),
			/**
			* @componentProperty {boolean} ltPropPreventDuplicate=false
			* @version 3.93.0
			*/
			ltPropPreventDuplicate: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("boolean", { default: false }),
			ltPropListErrorFiles : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("boolean", { default : false}),

			ltPropResetFileValue: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("boolean", { default: false }),
			ltPropAria: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("boolean", { default: false }),
			ltPropDataTabindex: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("string", { default: "" }),
			// system data
			queueList: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('array', { "default": [] }),
			predefinedList: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('array', { "default": [] }),
			currentUpload: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('array', { "default": [] }),
			chunkUpload: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('array', { "default": [] }),
			fileClass: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('string', { "default": '' }),
			chunkCount: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('number', { "default": 0 }),
			abort: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("boolean", { "default": false }),
			lxhrs: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("array", { "default": [] }),
			uploadedFiles: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("array", { "default": [] }),
			manualUpdFiles: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("array", { "default": [] }),
			uploadMultipleRetry: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('number', { "default": 0 }),
			retryFiles: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('array', { "default": [] }),
			retry: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('boolean', { "default": false }),
			manualUpload: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('boolean', { "default": false }),
			totalFilesSize: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('number'),
			curTotFilesSize: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('number', { "default": 0 }),
			ariaCloseLabel: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("string"),
			commonAriaLabel: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("object", { "default": {} }),
			ariaSelectedFiles: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("string", { "default": "0" }),
			randomAriaId: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("string")
		}), arg1);
	}

    getFileDataAsString(array) {
		var string = "";
		var sizeHelper = this.$component.registeredHelpers.lyteUiFileSize;
		var ltPropFileUnit = this.data.ltPropFileUnit;
		var ltPropDigits = this.data.ltPropDigits;
		array.forEach(function (item) {
			string += ("name " + item.name + " size " + sizeHelper(item.size, ltPropFileUnit, ltPropDigits)) + " "
		});
		return string;
	}

    constructAriaString() {
		if (this.data.ltPropAria) {
			var selectFiles = this.getFileDataAsString(this.data.predefinedList);
			selectFiles = this.getFileDataAsString(this.data.queueList);
			if (selectFiles) {
				this.setData("ariaSelectedFiles", selectFiles);
			}
			else {
				this.setData("ariaSelectedFiles", "0");
			}
		}
	}

    exceedTotalCount() {
		var fileCount =  this.data.ltPropFilesCount;
		if(fileCount !== Infinity)  {
			var predefinedList = this.data.predefinedList || [];
			var noOfFiles = predefinedList.length + this.getValidQueueListCount();
			if(noOfFiles < fileCount) {
				return false;
			}
			return true;
 		}
		return false;
	}

    folderUpload() {
		var folder = this.data.ltPropFolder
		if (folder) {
			this._file.setAttribute("webkitdirectory", true);
		}
		else {
			this._file.removeAttribute("webkitdirectory");
		}
	}

    validateAndGetType(fileName, fileType, reason) {
		var acceptRegex = new RegExp(this.data.ltPropAccept.replace(/\s+/g, "").split(",").join("|"));
		var extension = "", type, extensionWithDot;
		if (fileName) {
			extension = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
			extensionWithDot = "." + extension;
		}
		if (acceptRegex.test(fileType)) {
			type = fileType.match(/(video|image|pdf|zip)/ig);
			type = type && type[0] ? type[0] : extension;
		}
		else if (acceptRegex.test(extension) || acceptRegex.test(extensionWithDot)) {
			type = extension;
		}
		else {
			reason.type = "Invalid_Type";
		}
		return type;
	}

    validateSize(file, reason) {
		if (file.size < this.data.ltPropMinimumFileSize) {
			reason.size = "Lower_Size";
		}
		else if (file.size > this.data.ltPropFileLimit) {
			reason.size = "Higher_Size";
		}
		else if (this.checkTotalFilessize(file.size)) {
			reason.totalSize = "Exceeds";
		}
	}

    checkFileName(fileName, fileObject) {
		return fileName === fileObject.name;
	}

    findDuplicateInArray(array, fileName) {
		var index = this.findIndex(array, this.checkFileName.bind(this, fileName))
		return index > -1;
	}

    validateDuplicateFile(fileObject, reason) {
		if(this.data.ltPropPreventDuplicate) {
			var predefinedList =  this.data.predefinedList;
			var queueList =  this.data.queueList;
			var fileName = fileObject.name;
			var duplicate = this.findDuplicateInArray(predefinedList, fileName);
			duplicate = duplicate || this.findDuplicateInArray(queueList, fileName);
			if (duplicate) {
				reason.duplicate = true;
				return false;
			}
		}
		return true;
	}

    validate(files) { 
		var promises = [],clearflag=false, listErrorFiles = this.data.ltPropListErrorFiles;
		for( var j = 0; j < files.length; j++ ) {
			var reason = {}, isChunk=this.data.ltPropChunk,
			fileName=files[ j ].name,fileType=files[ j ].type,
			type;
			if(this.exceedTotalCount())  {
				reason.fileCount = "Exceeds"; 
				type = fileType ? fileType : fileName.substring(fileName.lastIndexOf('.')+1, fileName.length);
			}
			else if(this.validateDuplicateFile(files[ j ], reason)){
				type = this.validateAndGetType(fileName, fileType, reason);
				this.validateSize(files[ j ], reason);
			}
			if ( Object.keys(reason).length > 0 ){ 
				var rejectedFile =  files[ j ],
				fileObject = listErrorFiles ? this.constructFileObject(rejectedFile, isChunk, type, this.constructReasonAsStr(reason)) : void 0;
				clearflag = true;
				this.getMethods( 'onReject' ) && this.executeMethod( 'onReject', rejectedFile, reason, this.$node, fileObject);
				if(listErrorFiles) { 
					this.$addon.arrayUtils( this.data.queueList, 'push', fileObject );
				}
				else if(reason.fileCount) {
					break;
				}
			} else {
				var ret, fileObject = this.constructFileObject(files[ j ], isChunk, type);
				if( this.getMethods( 'onBeforeAdd' ) ) {
					ret = this.executeMethod( 'onBeforeAdd', files[ j ], this.$node, fileObject);
				}
				if (ret == false) {
					clearflag = true;
					if(listErrorFiles) { 
						fileObject.lyteErrorMsg = fileObject.lyteErrorMsg || "Invalid File"
						this.$addon.arrayUtils( this.data.queueList, 'push', fileObject );
					}
					continue;
				} else if (ret && ret.then) {
					promises.push(ret);
					var cur = files[j];
					Promise.resolve(ret).then(this.add.bind(this, cur, isChunk, type))
				} else {
					this.add(files[ j ], fileObject);
				}
				if (!this.data.ltPropMultiple) {
					break;
				}
			}
		}
		if (clearflag || this.data.ltPropResetFileValue) {
			this._file.value = "";
		}
		if( this.data.ltPropAutoUpload ){
			promises.length ? this.$addon.resolvePromises( promises ).then( this.processqueue.bind( this ) ) : this.processqueue();
		} 
		this.constructAriaString();
 	}

    getValidQueueListCount() {
		var queueList = this.data.queueList;
		var ltPropListErrorFiles =  this.data.ltPropListErrorFiles;
		if(ltPropListErrorFiles) {
			var array = queueList.filter(function(item){
				return !item.lyteErrorMsg;
			});
			return array.length;
		}
		return queueList.length;
	}

    constructFileObject(file, isChunk, fileType, errorMsg) {
		var fileObject = { id : 'lyte' + new Date().getTime() + parseInt( Math.random() * 10E10 ), file : file, size : file.size, name : file.name, isChunk: isChunk, retry : 0, fileType : ( fileType? fileType:'document') };
 		if( this.data.ltPropThumb && /image/i.test( file.type ) ) {
            this.$component.set( fileObject, 'src', URL.createObjectURL( file ) );
		}
		if(errorMsg) {
			fileObject.lyteErrorMsg =  errorMsg;
		}
		return fileObject;
	}

    add(file, fileObject) { //fileobject => file info,  file =>File Constructor
		this.$addon.arrayUtils( this.data.queueList, 'push', fileObject );
		this.addToTotalFilesSize(file.size);
		this.$addon.arrayUtils( this.data.uploadedFiles, 'push', fileObject );
		this.$addon.arrayUtils( this.data.ltPropFiles, 'push' , file);
		this.getMethods( 'onAdd' ) && this.executeMethod( 'onAdd', file, this.$node, fileObject );
 	}

    chkId(id, obj) {
		return obj.id == id;
	}

    SendingFile() {
		var data = this.data,
			manualUpdFiles = data.manualUpdFiles;
		for (var index = 0; index < manualUpdFiles.length;) {
			var current = manualUpdFiles[index];
			if (!current.status || (current.isChunk && current.status == "uploading")) {
				if (current.isChunk) {
					if (!current.status) {
						this.setData("manualUpload", true);
						this.uploadFile(current);
						break;
					}
					else if (current.finished + current.currentUploadingChunks < current.chunks.length) {
						this.setData("manualUpload", true);
						this.uploadFile(current);
						break;
					}
					else {
						index++;
					}
				}
				else {
					if (data.currentUpload.length < data.ltPropParallel) {
						this.setData("manualUpload", true);
						this.$addon.arrayUtils(data.currentUpload, 'push', current);
						this.uploadFile(current);
						index++;
					}
					else {
						break;
					}
				}
			}
			else {
				index++;
			}
		}
		if (index === manualUpdFiles.length) {
			this.finishcallback(manualUpdFiles);
		}
	}

    processqueue(id, check, frmRetry) {
		var data = this.data, idx = 0,
			multiple = [];
		if (id && !frmRetry) {
			if (id.constructor != Array) {
				id = [id];
			}
			for (var i = 0; i < id.length; i++) {
				var fileId = id[i].id || id[i];
				var file = data.queueList[this.findIndex(data.queueList, this.chkId.bind(this, fileId))];
				if (file) {
					this.$addon.arrayUtils(this.data.manualUpdFiles, 'push', file);
				}
			}
			if (this.data.manualUpdFiles.length) {
				this.SendingFile();
				return;
			}
		}
		if (data.manualUpload) {
			this.SendingFile();
			return;
		}
		while ((((data.currentUpload.length < data.ltPropParallel) || (data.ltPropUploadMultiple && data.currentUpload.length < data.ltPropUploadMultipleCount)) /*|| ( !data.ltPropMultipleUpload && !data.currentUpload.length ) */) || frmRetry && data.queueList.length) {
			var current = data.queueList[idx];
			if (id) {
				id = id.constructor == Object ? id.id : id;
				current = data.queueList[this.findIndex(data.queueList, this.chkId.bind(this, id))]
				if (frmRetry && current) {
					this.$addon.arrayUtils(this.data.retryFiles, 'push', current);
					this.$component.set(current, 'status', 'reloading');
					if (data.uploadedFiles.indexOf(current) < 0) {
						this.$addon.arrayUtils(this.data.uploadedFiles, 'push', current);
						this.retrySendingFile();
					}
					return;
				}
			}
			if (current) {
				if (/uploading|success/.test(current.status)) {
					if (id) {
						break;
					}
					if (/uploading/.test(current.status) && current.isChunk && current.finished + current.currentUploadingChunks < current.chunks.length) {
						this.processChunkQueue(current.chunks);
						break;
					}
					else {
						idx++;
						continue;
					}
				} else if (current.status == 'error' && (this.data.ltPropUploadMultiple || (current.retry >= (data.ltPropRetry - 1) || current.isChunk)) && !id) {
					idx++;
					continue;
				} else if (current.status == 'reloading') {
					idx++;
					continue;
				} else if (current.lyteErrorMsg) {
					idx++;
					continue;
				}
				if (!current.isChunk) {
					this.$addon.arrayUtils(data.currentUpload, 'push', current);
				}
				if (!this.data.ltPropUploadMultiple) {
					this.uploadFile(current)
					if (id || current.isChunk) {
						break;
					}
				} else {
					multiple.push(current);
				}
				idx++;
			} else {
				this.data.retryFiles.length && this.retrySendingFile();
				if (check) {
					this.finishcallback();
				}
				break;
			}
		}

		if (this.data.ltPropUploadMultiple && multiple.length) {
			this.uploadFile(multiple);
		}

	}

    retrySendingFile() {
		var data = this.data,
			retryFiles = data.retryFiles;
		for (var index = 0; index < retryFiles.length;) {
			var current = retryFiles[index];
			if (current.status == "reloading" || current.status == "uploading") {
				if (current.isChunk) {
					if (current.finished + current.currentUploadingChunks < current.chunks.length) {
						this.setData("retry", true);
						this.processChunkQueue(current.chunks);
						break;
					}
					else {
						index++;
					}
				}
				else {
					if (data.currentUpload.length < data.ltPropParallel) {
						this.setData("retry", true);
						this.$addon.arrayUtils(retryFiles, "removeAt", index);
						this.$addon.arrayUtils(data.currentUpload, 'push', current);
						this.getMethods('onRetry') && this.executeMethod('onRetry', {}, current, this.$node);
						this.uploadFile(current);
					}
					else {
						break;
					}
				}
			}
			else {
				this.$addon.arrayUtils(retryFiles, "removeAt", index);
			}
		}
		if (!retryFiles.length) {
			this.setData("retry", false);
			this.processqueue(undefined, true);
		}
	}

    findIndex(array, condition) {
		if (condition.constructor == Function) {
			for (var i = 0; i < array.length; i++) {
				var ret = condition.call(array[i], array[i]);
				if (ret) {
					return i;
				}
			}
		} else {
			return array.indexOf(condition);
		}
	}

    abortChunksFrmUpload(id) {
		var data = this.data, chunkUpload = data.chunkUpload;
		for (var index = 0; index < chunkUpload.length;) {
			var chunk = chunkUpload[index];
			if (chunk.chunkProp.origin.id === id && chunk.xhr) {
				this.setData("abort", true);
				chunk.xhr.ret.abort();
			}
			else {
				index++;
			}
		}
	}

    removeFrmUpload(idd, arrnme, prevent, check) {//need to be checked
		if (idd.constructor != Array) {
			idd = [idd];
		}
		for (var i = 0; i < idd.length; i++) {
			var id = idd[i].id || idd[i];
			var arr = this.data[arrnme], crct = this.findIndex(arr, this.chkId.bind(this, id)), flag, cur;
			if (crct === undefined || crct < 0) {
				arr = this.data.predefinedList;
				crct = this.findIndex(arr, this.chkId.bind(this, id));
				if (crct > -1) {
					arrnme = "predefinedList";
				}
			}
			if (crct >= 0) {
				if (!prevent && this.getMethods('onBeforeRemove') && this.executeMethod('onBeforeRemove', arrnme, arr[crct], this.$node) == false) {
					continue;
				}
				cur = arr[crct];
				if (arrnme === "queueList") {
					this.removeFromTotalFileSize(cur.size)
				}
				if (cur.status == 'uploading') {
					flag = true;
					if (cur.xhr) {
						this.setData("abort", true);
						cur.xhr.ret.abort();
					}
					if (cur.isChunk) {
						this.abortChunksFrmUpload(cur.id);
					}
				}
				this.$addon.arrayUtils(arr, 'removeAt', crct);
				if (arrnme === "queueList") {
					var lxhrs = this.getData("lxhrs");
					var lxhr = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3___default().search(lxhrs, "fileId", cur.id)[0], index;
					if (cur.isChunk && flag) {
						this.getMethods("onFileFailure") && this.executeMethod('onFileFailure', lxhr, cur, this.$node, true);
					}
					this.$addon.arrayUtils(this.data.ltPropFiles, 'removeAt', crct);
					var temparray = this.data.uploadedFiles, tempId = this.findIndex(temparray, this.chkId.bind(this, id))
					if (tempId >= 0) {
						this.$addon.arrayUtils(temparray, 'removeAt', tempId);
					}
					var temparray = this.data.retryFiles, tempId = this.findIndex(temparray, this.chkId.bind(this, id))
					if (tempId >= 0) {
						this.$addon.arrayUtils(temparray, 'removeAt', tempId);
					}
					index = lxhrs.indexOf(lxhr);
					index > -1 && this.$addon.arrayUtils(lxhrs, 'removeAt', index);
					if (crct <= i) {
						i--;
					}
				}
				!prevent && this.getMethods('onRemove') && this.executeMethod('onRemove', arrnme, cur, this.$node);
			}
		}
		if (!this.data.ltPropUploadMultiple && ((arrnme == "queueList" && flag) || check)) {
			//check is a flag to used to trigger the finishcallback
			this.data.retry ? this.retrySendingFile() : this.processqueue(undefined, true);
		}
		if (arrnme === "queueList" || arrnme === "predefinedList") {
			this.constructAriaString();
		}
	}

    uploadFile(file) {
		var props = this.$addon.deepCopyObject(this.data.ltPropAjax);
		file.isChunk ? this.proceedChunk(file, props) : this.proceedUpload(file, props, false);
		//comments may be need in future please check git
		// if( this.getMethods( 'onBeforeUpload' ) ) {
		// 	ret = this.executeMethod( 'onBeforeUpload', file, props, this.$node );
		// }
		// if( ret && ret.then ) {
		// 	Promise.resolve( ret ).then( function(){
		// 		file.isChunk ? this.proceedChunk( file, props ) : this.proceedUpload( file, props );
		// 	}.bind( this ))
		// } else if( ret != false ) {

		// } else {
		// 	if( file.constructor != Array ){
		// 		file = [ file ];
		// 	}
		// 	for( var i = 0; i < file.length; i++ ){
		// 		//this.removeFrmUpload( file[ i ].id, 'queueList' );
		// 		this.removeFrmUpload( file[ i ].id, 'currentUpload',true);//need to be checked
		// 	}
		// }
	}

    succFunc(evt) {
		if (this.$node) {
			var file = arguments[2].xhr.file, ret = arguments[2].xhr.ret, tempRet = [], duplicate;
			file.xhr && delete file.xhr;
			this.getMethods('onRequestSuccess') && this.executeMethod('onRequestSuccess', ret, file, this.$node);
			if (file.constructor != Array) {
				file = [file];
			}
			for (var i = 0; i < file.length; i++) {
				this.$component.set(file[i], 'status', 'success');
				this.$addon.objectUtils(file[i], 'delete', 'xhr');
				if (!this.data.ltPropUploadMultiple) {
					var lxhrs = this.getData("lxhrs");
					duplicate = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3___default().search(lxhrs, "fileId", file[i].id);
					duplicate.length && this.$addon.arrayUtils(lxhrs, 'removeAt', lxhrs.indexOf(duplicate[0]));
					ret.fileId = file[i].id;
					this.$addon.arrayUtils(this.getData("lxhrs"), 'push', ret);
					this.getMethods('onFileSuccess') && this.executeMethod('onFileSuccess', ret, file[i], this.$node);
					this.removeFrmUpload(file[i].id, 'currentUpload', true, true); //need to be checked
				}
				else {
					tempRet.push(file[i].id);
					this.removeFrmUpload(file[i].id, 'currentUpload', true); //need to be checked
				}
			}
			if (this.data.ltPropUploadMultiple) {
				ret.fileId = tempRet;
				this.$addon.arrayUtils(this.getData("lxhrs"), 'push', ret);
				this.setData("uploadMultipleRetry", 0);
				this.processqueue(undefined, true);
			}
			delete arguments[2].xhr.file;
		}
	}

    reject(evt) {
		if (this.$node) {
			var file = evt.xhr.file, ret = evt.xhr.ret, retry = file.retry, tempRet = [], duplicate;
			if (this.data.abort || retry >= this.data.ltPropRetry || (this.data.ltPropUploadMultiple && this.data.uploadMultipleRetry >= this.data.ltPropRetry)) {
				file.xhr && delete file.xhr;
				this.getMethods('onRequestFailure') && this.executeMethod('onRequestFailure', ret, file, this.$node, this.data.abort);
				if (file.constructor != Array) {
					file = [file];
				}
				for (var i = 0; i < file.length; i++) {
					this.$component.set(file[i], 'status', 'error');
					this.$addon.objectUtils(file[i], 'delete', 'xhr');
					if (!this.data.ltPropUploadMultiple) {
						var lxhrs = this.getData("lxhrs");
						duplicate = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3___default().search(lxhrs, "fileId", file[i].id);
						duplicate.length && this.$addon.arrayUtils(lxhrs, 'removeAt', lxhrs.indexOf(duplicate[0]));
						ret.fileId = file[i].id;
						this.getMethods("onFileFailure") && this.executeMethod('onFileFailure', ret, file[i], this.$node, this.data.abort);
						!this.data.abort && this.$addon.arrayUtils(this.getData("lxhrs"), 'push', ret);
					}
					else {
						tempRet.push(file[i].id);
					}
					this.removeFrmUpload(file[i].id, 'currentUpload', true, !this.data.abort); //need to be checked

				}
				if (this.data.ltPropUploadMultiple) {
					ret.fileId = tempRet;
					this.$addon.arrayUtils(this.getData("lxhrs"), 'push', ret);
					this.setData("uploadMultipleRetry", 0);
					this.processqueue(undefined, true);
				}
				if (this.data.abort) {
					this.$addon.objectUtils(evt.xhr.file, 'add', 'retry', this.data.ltPropRetry);
					this.setData("abort", false);
				}
				delete evt.xhr.file;
			} else {
				if (!this.data.ltPropUploadMultiple) {
					this.$component.set(evt.xhr.file, 'status', 'retrying');
					this.$addon.objectUtils(evt.xhr.file, 'add', 'retry', retry + 1);
					this.getMethods('onRetry') && this.executeMethod('onRetry', ret, file, this.$node);
					this.uploadFile(file);
				}
				else {
					delete file.xhr;
					for (var i = 0; i < file.length; i++) {
						this.$component.set(evt.xhr.file[i], 'status', 'retrying');
						this.$component.set(evt.xhr.file[i], 'retry', evt.xhr.file[i].retry + 1);
					}
					this.setData("uploadMultipleRetry", this.data.uploadMultipleRetry + 1);
					this.getMethods('onRetry') && this.executeMethod('onRetry', ret, file, this.$node);
					this.uploadFile(file);
				}
			}
		}
	}

    progress(evt) {
		if (evt.lengthComputable) {
			var total = evt.total, upload = evt.loaded, xhr = evt.target.xhr,
				file = xhr.file;

			if (file.constructor != Array) {
				file = [file];
			}
			for (var i = 0; i < file.length; i++) {
				if (this.data.ltPropUploadMultiple) {
					this.$component.set(file[i], { loaded: file[i].size, percentage: 100 });
				}
				else {
					this.$component.set(file[i], { loaded: upload, percentage: Math.round(upload * 100 / total) });
				}
				this.getMethods('onProgress') && this.executeMethod('onProgress', evt, xhr, file[i], this.$node);
			}
		}
	}

    removeChunk(id, origin, prevent) {
		var arr = this.data.chunkUpload, cur = this.findIndex(arr, function (obj) {
			return obj.chunkProp.chunkId == id
		})
		if (cur > -1) {
			this.$addon.arrayUtils(arr, 'removeAt', cur);
			!prevent && this.processChunkQueue(origin.chunks)
		}
	}

    chunkReject(evt) {
		if (this.$node) {
			var file = evt.xhr.file, origin = file.chunkProp.origin, ret = arguments[0].xhr.ret;
			if (!this.data.abort && file.retry < this.data.ltPropChunkRetry) {
				this.$component.set(file, 'status', 'retrying');
				this.$addon.objectUtils(file, 'add', 'retry', file.retry + 1);
				this.removeChunk(file.chunkProp.chunkId, origin, true);
				this.getMethods('onRetry') && this.executeMethod('onRetry', ret, file, this.$node);
				this.$component.set(origin, 'currentUploadingChunks', origin.currentUploadingChunks - 1);
				this.processChunkQueue(file, true);
			} else {
				this.getMethods('onRequestFailure') && this.executeMethod('onRequestFailure', ret, file, this.$node, this.data.abort);
				this.$component.set(file, 'status', 'error');
				this.removeChunk(file.chunkProp.chunkId, origin, true);
				this.getMethods('onChunkError') && this.executeMethod('onChunkError', ret, file, origin, this.$node, this.data.abort);
				this.$addon.objectUtils(file, 'delete', 'xhr');
				delete evt.xhr.file;
				this.$component.set(origin, 'currentUploadingChunks', origin.currentUploadingChunks - 1);
				this.$component.set(origin, 'error', origin.error + 1);
				if (origin.status != 'error') {
					var lxhrs = this.getData("lxhrs"), duplicate;
					this.$component.set(origin, 'status', 'error');
					duplicate = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3___default().search(lxhrs, "fileId", origin.id);
					duplicate.length && this.$addon.arrayUtils(lxhrs, 'removeAt', lxhrs.indexOf(duplicate[0]));
					ret.fileId = origin.id;
					this.$addon.arrayUtils(this.getData("lxhrs"), 'push', ret);
				}
				if (!this.data.abort) {
					this.abortChunksFrmUpload(origin.id);
					this.getMethods("onFileFailure") && this.executeMethod('onFileFailure', ret, origin, this.$node, this.data.abort);
					this.data.retry ? this.retrySendingFile()
						: this.processqueue(undefined, true);
				}
				else {
					this.setData("abort", false);
				}
			}
		}
	}

    chunkSuccess(evt) {
		if (this.$node) {
			var file = arguments[2].xhr.file, origin = file.chunkProp.origin, ret = arguments[2].xhr.ret;
			this.getMethods('onRequestSuccess') && this.executeMethod('onRequestSuccess', ret, file, this.$node);
			this.$component.set(file, 'status', 'success');
			this.removeChunk(file.chunkProp.chunkId, origin, true);
			this.getMethods('onChunkSuccess') && this.executeMethod('onChunkSuccess', ret, file, origin, this.$node);
			this.$addon.objectUtils(file, 'delete', 'xhr');
			delete arguments[2].xhr.file;
			this.$component.set(origin, 'finished', origin.finished + 1);
			this.$component.set(origin, 'currentUploadingChunks', origin.currentUploadingChunks - 1);
			if (origin.finished == origin.total) {
				var lxhrs = this.getData("lxhrs"), duplicate;
				this.$component.set(origin, 'status', 'success');
				duplicate = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3___default().search(lxhrs, "fileId", origin.id);
				duplicate.length && this.$addon.arrayUtils(lxhrs, 'removeAt', lxhrs.indexOf(duplicate[0]));
				ret.fileId = origin.id;
				this.$addon.arrayUtils(this.getData("lxhrs"), 'push', ret);
				this.getMethods('onFileSuccess') && this.executeMethod('onFileSuccess', ret, origin, this.$node);
				this.data.retry ? this.retrySendingFile()
					: this.processqueue(undefined, true);
			}
			else {
				this.processChunkQueue(origin.chunks, true);
			}
		}

	}

    chunkProgress(evt) {
		if (evt.lengthComputable) {
			var total = evt.total, upload = evt.loaded, file = evt.target.xhr.file, origin = file.chunkProp.origin, diff = upload - file.loaded;
			this.$component.set(file, 'loaded', upload);
			this.$component.set(origin, { loaded: Math.min(origin.loaded + diff, origin.size), percentage: Math.min(Math.round((origin.loaded + diff) * 100 / origin.size), 100) });
			this.getMethods('onProgress') && this.executeMethod('onProgress', evt, evt.target.xhr, origin, this.$node)
		}
	}

    proceedChunk(files, props) {
		var data = this.data, chunkSize = data.ltPropChunkSize, oriSize = files.size, size = 0, blobs = [];
		while (size <= oriSize) {
			var start = size, end = Math.min(oriSize, size += chunkSize), totalChunkSize = end - start;
			blobs.push({
				file: files.file.slice(start, end), chunkProp: {
					chunkOffset: start,
					chunkEnd: end,
					chunkSize: totalChunkSize,
					chunkId: "lyteChunk" + new Date().getTime() + parseInt(Math.random() * 10E10),
					chunkIndex: blobs.length,
					origin: files,
					chunkCount: Math.ceil(files.size / chunkSize),
					totalSize: files.size
				}, name: files.file.name, loaded: 0, retry: 0
			});
		}
		this.$component.set(files, { chunks: blobs, error: 0, finished: 0, total: blobs.length });
		if (data.ltPropParallelChunkCount === Infinity) {
			this.setData("chunkCount", blobs.length);
		}
		this.processChunkQueue(blobs)
	}

    processChunkQueue(blobs, frmFail) {
		var data = this.data, idx = 0;
		if (blobs.constructor != Array) {
			blobs = [blobs];
		}
		while ((!data.ltPropParallelChunkUpload && data.chunkUpload.length < 1) || ((data.ltPropParallelChunkUpload && (data.ltPropParallelChunkCount === Infinity) || (data.ltPropParallelChunkCount != Infinity && /*data.ltPropMultipleUpload &&*/ data.chunkUpload.length < data.ltPropParallelChunkCount)) /*|| ( !data.ltPropMultipleUpload && !data.currentUpload.length )*/)) {
			var bb = blobs[idx];
			if (!bb) {
				if (data.retry) {
					this.retrySendingFile();
				}
				else if (data.ltPropParallelChunkUpload) {
					data.ltPropParallelChunkCount != Infinity && data.chunkUpload.length < data.ltPropParallelChunkCount && this.processqueue();
					data.ltPropParallelChunkCount == Infinity && this.processqueue();
				}
				break;
			}
			if (!/success|uploading/.test(bb.status) && (!frmFail || (frmFail && !/error/.test(bb.status)))) {
				var file = bb.chunkProp.origin;
				this.$component.set(file, { status: 'uploading', percentage: file.percentage || 0, loaded: file.loaded || 0, size: file.size, currentUploadingChunks: file.currentUploadingChunks + 1 || 1 })
				this.proceedUpload(bb, this.$addon.deepCopyObject(data.ltPropAjax), true);
				this.$addon.arrayUtils(data.chunkUpload, 'push', bb);
				idx++;
			} else {
				idx++;
				continue;
			}
		}
	}

    getRelativePath(fileInfo) {
		var file = fileInfo.file;
		return file.webkitRelativePath || file.relativePath;
	}

    proceedUpload(file, props, isChunk) {
		if (/success|uploading/.test((file[0] && file[0].status) || file.status)) {
			return;
		}
		var formdata = new FormData(), callback, keys = ["chunkOffset", "chunkSize", "chunkIndex", "chunkCount", "totalSize"], fileName;
		if (file.constructor == Array) {
			for (var j = 0; j < file.length; j++) {
				fileName = this.data.ltPropFolder ? this.getRelativePath(file[j]) : file[j].name;
				formdata.append(this.data.ltPropParamName + '[' + j + ']', file[j].file, fileName);
			}
		} else {
			fileName = this.data.ltPropFolder && !isChunk ? this.getRelativePath(file) : file.name;
			formdata.append(this.data.ltPropParamName, file.file, fileName);
		}
		if (isChunk) {
			for (var index = 0; index < keys.length; index++) {
				formdata.append(keys[index], file.chunkProp[keys[index]]);
			}
			var origin = file.chunkProp.origin;
			formdata.append("fileId", origin.id);
			fileName = this.data.ltPropFolder ? this.getRelativePath(origin) : origin.name;
			formdata.append("fileName", fileName);
		}
		props.success = isChunk ? this.chunkSuccess.bind(this) : this.succFunc.bind(this);
		props.error = isChunk ? this.chunkReject.bind(this) : this.reject.bind(this);
		var xhr = new window.XMLHttpRequest();
		props.type = 'POST';
		file.xhr = xhr;
		xhr.file = file;
		xhr.upload.xhr = xhr;
		xhr.upload.addEventListener('progress', isChunk ? this.chunkProgress.bind(this) : this.progress.bind(this), false);
		props.xhr = xhr;
		props.data = formdata;
		props.processData = false;
		// set content-type false and make sure browser
		props.contentType = false;
		if (this.getMethods('onBeforeSend')) {
			callback = this.executeMethod('onBeforeSend', xhr, file, isChunk, this.$node, formdata, props);
		}
		if (callback && callback.then) {
			Promise.resolve(callback).then(function () {
				this.finishSend(props, xhr, file);
			}.bind(this))
		} else if (callback == false) {
			if (file.constructor != Array) {
				file = [file];
			}
			for (var i = 0; i < file.length; i++) {
				//this.removeFrmUpload( file[ i ].id, 'queueList' );
				this.removeFrmUpload(file[i].id, 'currentUpload', true); //need to be checked
			}
			return
		} else {
			if (callback && callback.constructor == FormData) {
				props.data = callback;
			}
			this.finishSend(props, xhr, file, isChunk)
		}

	}

    finishSend(props, xhr, file, isChunk) {
		if (file.constructor == Array) {
			for (var i = 0; i < file.length; i++) {
				this.$component.set(file[i], 'status', 'uploading');
			}
		} else {
			this.$component.set(file, 'status', 'uploading');
		}
		var ret = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3___default().ajax(props);
		ret.xhr = xhr;
		xhr.ret = ret;
		this.getMethods('onSend') && this.executeMethod('onSend', xhr, ret, file, !!isChunk, this.$node, props);
	}

    finishcallback(files) {
		var currentFiles = files || this.data.uploadedFiles, chunk = this.data.chunkUpload, lxhr = this.data.lxhrs, flag;
		if (!currentFiles.length) {
			return;
		}
		for (var index = 0; index < currentFiles.length; index++) {
			if (!currentFiles[index].status || currentFiles[index].status == "uploading") {
				return;
			}
			else if (currentFiles[index].status == "error") {
				flag = true;
			}
		}
		for (var index = 0; index < chunk.length; index++) {
			if (chunk[index].status == "uploading") {
				return;
			}
			else if (chunk[index].status == "error") {
				flag = true;
			}
		}
		if (!this.data.ltPropMultiple) {
			currentFiles = currentFiles[0];
			lxhr = lxhr[0];
		}
		if (flag) {
			this.getMethods('onFailure') && this.executeMethod('onFailure', currentFiles, this.$node, lxhr);
			this.setData("uploadedFiles", []);
			this.setData("lxhrs", []);
		}
		else {
			this.getMethods("onSuccess") && this.executeMethod('onSuccess', currentFiles, this.$node, lxhr);
			this.setData("uploadedFiles", []);
			this.setData("lxhrs", []);
		}
		if (this.data.manualUpload == true) {
			this.setData("manualUpdFiles", []);
			this.setData("manualUpload", false);
		}
	}

    getTotalFileSize(array) {
		var fileSize = 0;
		array.forEach(function (file) {
			var size = file.size;
			if (typeof size === "number") {
				fileSize += size;
			}
		});
		return fileSize;
	}

    addPredefinedListSize(array) {
		var totalListSize = this.getTotalFileSize(array);
		this.addToTotalFilesSize(totalListSize);
	}

    removePredefindListSize(array) {
		var totalListSize = this.getTotalFileSize(array);
		this.removeFromTotalFileSize(totalListSize);
	}

    checkTotalFilessize(fileSize) {
		var size = this.getData("totalFilesSize"),
			totalSize = this.getData("curTotFilesSize");
		if (size && (totalSize + fileSize) > size) {
			return true;
		}
		return false;
	}

    addToTotalFilesSize(fileSize) {
		var size = this.getData("totalFilesSize");
		if (size) {
			var total = this.getData("curTotFilesSize");
			this.setData("curTotFilesSize", total + fileSize);
		}
	}

    removeFromTotalFileSize(fileSize) {
		var size = this.getData("totalFilesSize");
		if (size) {
			var total = this.getData("curTotFilesSize");
			this.setData("curTotFilesSize", total - fileSize);
		}
	}

    openFileWindow(evt, fromEnter) {
		if (!this.data.ltPropYield && this.data.ltPropMultiple) {
			if (!evt.shiftKey) {
				_lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3___default()('#lyteFileUpdSelectedFile.lyteFileUpdListFile').removeAttr('id');
			} else {
				evt.preventDefault();
			}
			if (evt.target.className != "lyteFileUpdRetryMsg") {
				_lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3___default()(evt.target).closest('.lyteFileUpdListFile').attr('id', 'lyteFileUpdSelectedFile');
			}
		}
		if (evt.ctrlKey || evt.shiftKey || evt.metaKey) {
			return
		}
		var isSelectArea, close = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3___default()(evt.target).closest('lyte-file-close');
		if (close.length) {
			this.$node.removeUpload(close.eq(0).attr('data-value'))
			return;
		}
		var retry = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3___default()(evt.target).closest('lyte-file-retry');
		if (retry.length) {
			this.$node.upload(retry.eq(0).attr('data-value'), undefined, true);
			return;
		}
		isSelectArea = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3___default()(evt.target).closest('lyte-file-select-area').length || fromEnter;
		if (isSelectArea && this.data.ltPropMultiple || (this.data.queueList.length == 0 && this.data.predefinedList.length == 0) || this.data.ltPropAllowReplace) {
			if (this.getMethods('onBeforeOpen') && this.executeMethod('onBeforeOpen', evt, this.$node) == false) {
				return
			}
			this._file.click();
		}
	}

    getFilesFromEntry(entry, fileList, path) {
		return new Promise(function (resolve) {
			entry.file(function (file) {
				if (file.name.substring(0, 1) !== '.') { // will not read hidden files
					file.relativePath = path + "/" + file.name;
					fileList.push(file);
				}
				resolve();
			}, function (error) {
				console.warn(error);
				resolve();
			});
		});
	}

    getFilesFromDirectory(directory, path, fileList) {
		var self = this;
		var dirReader = directory.createReader(), promises = [];
		return new Promise(function (resolve) {
			dirReader.readEntries(function (entries) {
				var length = entries.length;
				if (length > 0) {
					var entry;
					for (var index = 0; index < length; index++) {
						entry = entries[index];
						if(entry) {
							if (entry.isFile) {
								promises.push(self.getFilesFromEntry(entry, fileList, path));
							} else if (entry.isDirectory) {
								promises.push(self.getFilesFromDirectory(entry, path + "/" + entry.name, fileList));
							}
						}
					}
					if (promises.length) {
						Promise.all(promises).then(function () {
							resolve();
						});
					}
					else {
						resolve();
					}
				}
			}, function (error) {
				console.warn(error);
				resolve();
			});
		});
	}

    filterDropItems(items) {
		var self = this;
		var fileList = [], promises = [];;
		return new Promise(function (resolve) {
			var item;
			for (let index = 0; index < items.length; index++) {
				var item = items[index];
				if (item.webkitGetAsEntry != null) {
					var entry = item.webkitGetAsEntry();
					if(entry) {
						if (entry.isFile) {
							fileList.push(item.getAsFile());
						} else if (entry.isDirectory && self.data.ltPropFolder) {
							promises.push(self.getFilesFromDirectory(entry, entry.name, fileList));
						}
					}
				}
				else if (item.getAsFile != null && (item.kind == null || item.kind === "file")) {// firefox android
					fileList.push(item.getAsFile());
				}
			}
			if (promises.length) {
				Promise.all(promises).then(function () {
					resolve(fileList);
				});
			}
			else {
				resolve(fileList);
			}
		});
	}

    getValidDroppedItems(dataTransfer, event) { // Valid file and folder
		var self = this;
		var files = dataTransfer.files;
		return new Promise(function (resolve) {
			var items = dataTransfer.items;
			if (items && items.length && (items[0].webkitGetAsEntry !== null)) {
				self.filterDropItems(items).then(function (validFiles) {
					resolve(validFiles);
				});
			} else {
				resolve(files);
			}
		});
	}

    static actions(arg1) {
		return Object.assign(super.actions({
			change: function (evt, _this) {
				if (_this.files.length) {
					if (!this.data.ltPropMultiple && this.data.ltPropAllowReplace) {
						this.removeFrmUpload(this.data.queueList, 'queueList', true);
						this.data.predefinedList.length && this.removeFrmUpload(this.data.predefinedList, 'predefinedList', true);
					}
					var files = Array.from(_this.files);
					if (this.getMethods("onSelect") && this.executeMethod("onSelect", files, evt) === false) {
						this._file.value = "";
						return;
					}
					this.validate(files);
				}
			},

			drag: function (evt) {
				var type = evt.type, nwStr = "onDrag", match = type.match(/drag(.+)/);
				if (match && match[1]) {
					nwStr += match[1].slice(0, 1).toUpperCase() + match[1].slice(1);
					if (/enter|over/.test(evt.type)) {
						if (evt.type == 'dragover') {
							var tran = evt.dataTransfer;
							if (tran) {
								var effect = tran.effectAllowed;
								tran.dropEffect = 'move' === effect || 'linkMove' === effect ? 'move' : 'copy';
							}
						}
						evt.preventDefault();
					}
				}
				if (type == "dragenter") {
					this.setData('fileClass', 'fileDragEnter');
				} else if (type == "dragleave") {
					this.setData('fileClass', '');
				}
				this.getMethods(nwStr) && this.executeMethod(nwStr, evt, this.$node);
			},

			drop: function (evt) {
				this.setData('fileClass', '');
				var dT = evt.dataTransfer;
				if (dT.files.length) {
					var self = this;
					evt.preventDefault();
					this.getValidDroppedItems(dT).then(function (validList) {
						if (validList.length) {
							if (self.getMethods('onBeforeDrop') && self.executeMethod('onBeforeDrop', evt, self.$node, validList) == false) {
								return;
							}
							evt.preventDefault();
							if (!self.data.ltPropMultiple) {
								self.$node.removeUpload();
							}
							self.validate(validList);
							self.getMethods('onDrop') && self.executeMethod('onDrop', evt, self.$node, validList);
						}
					})
				}
			},

			click: function (evt) {
				this.openFileWindow(evt);
			},

			paste: function (evt) {
				var clip = evt.clipboardData || window.clipboardData, items = clip.items, files = [];
				for (var i = 0; i < items.length; i++) {
					var file = items[i].getAsFile();
					if (file) {
						files.push(file)
					}
				}
				if (files.length) {
					if (this.getMethods('onBeforePaste') && this.executeMethod('onBeforePaste', evt, files, this.$node) == false) {
						return;
					}
					if (!this.data.ltPropMultiple) {
						this.$node.removeUpload();
					}
					this.validate(files);
					this.getMethods('onPaste') && this.executeMethod('onPaste', evt, files, this.$node);
				}
			},

			keydown: function (evt) {
				if (evt.which == 8) {
					var elem = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3___default()("#lyteFileUpdSelectedFile lyte-file-close", this.$node)
					for (var i = 0; i < elem.length; i++) {
						this.$node.removeUpload(elem.eq(i).attr('data-value'));
					}
					elem.length && evt.preventDefault();
				}
				else if (evt.which === 13) {
					this.openFileWindow(evt, true);
					evt.preventDefault();
				}
			}
		}), arg1);
	}

    static observers(arg1) {
		return Object.assign(super.observers({
			ariaObserver: function (change) {
				var newAria = this.data.ltPropAriaAttributes;
				if (this.data.ltPropAria) {
					if (!change) {
						this.setData("randomAriaId", new Date().getTime() + parseInt(Math.random() * 10E10));
					}
					this.addAriaValues(newAria);
				}
			}.observes('ltPropAriaAttributes.*').on('didConnect'),

			disableDataObserver: function () {
				var ltPropDisabled = this.data.ltPropDisabled;
				var fileUploadWrapper = this.$node.querySelector(".fileUploadWrapper");
				if (ltPropDisabled) {
					fileUploadWrapper.setAttribute("aria-disabled", true);
				}
				else {
					fileUploadWrapper.removeAttribute("aria-disabled");
				}

			}.observes('ltPropDisabled').on('didConnect'),

			folderUploadObserver: function () {
				this.folderUpload();
			}.observes('ltPropFolder'),

			trigUpl: function (arg) {
				if (arg.newValue) {
					this.processqueue();
					var compRef = this;
					this._triggerId = setTimeout(function () {
						compRef.setData('ltPropTriggerUpload', false);
						delete compRef._triggerId;
					}, 0);
				}
			}.observes('ltPropTriggerUpload'),

			resetObserver: function (changeObject) {
				if (changeObject.newValue) {
					this.$node.removeUpload();
					var compRef = this;
					this._resetId = setTimeout(function () {
						compRef.setData("ltPropReset", false);
						delete compRef._resetId;
					}, 0);
				}
			}.observes('ltPropReset'),

			convertToBytes: function () {
				var size = this.getData("ltPropTotalFilesSize");
				if (size) {
					var fileUnit = size.substring(size.length - 2),
						totalSize = parseInt(size.substring(0, size.length - 2)),
						validFormat = ["KB", "MB", "GB"],
						indexOf = validFormat.indexOf(fileUnit);
					var predefinedList = this.data.predefinedList;
					if (indexOf > -1) {
						this.setData("totalFilesSize", totalSize * (Math.pow(1000, indexOf + 1)))
					}
					if (Array.isArray(predefinedList)) {
						this.addPredefinedListSize(predefinedList);
					}
				}
			}.observes("ltPropTotalFilesSize").on("init"),

			predefinedListObserver: function (changeObject) {
				var size = this.getData("totalFilesSize");
				if (size) {
					var oldValue = changeObject.oldValue;
					var newValue = changeObject.newValue;
					if (Array.isArray(oldValue)) {
						this.removePredefindListSize(oldValue);
					}
					if (Array.isArray(newValue)) {
						this.addPredefinedListSize(newValue);
					}
				}
			}.observes('predefinedList'),

			predefinedArrayListObserver: function (changeObject) {
				var size = this.getData("totalFilesSize");
				if (size) {
					var oldValue = changeObject.removedItems;
					var newValue = changeObject.insertedItems;
					if (Array.isArray(oldValue)) {
						this.removePredefindListSize(oldValue);
					}
					if (Array.isArray(newValue)) {
						this.addPredefinedListSize(newValue);
					}
				}
			}.observes('predefinedList.[]')
		}), arg1);
	}

    _() {
        _;
    }
}

LyteFileuploadComponent._template = "<template tag-name=\"lyte-fileupload\"> <input class=\"fileuploadInput {{ltPropClass}}\" id=\"{{ltPropId}}\" type=\"file\" name=\"{{ltPropName}}\" onchange=\"{{action('change',event,this)}}\" multiple=\"{{ltPropMultiple}}\" accept=\"{{ltPropAccept}}\"> <div tabindex=\"{{ltPropTabindex}}\" class=\"fileUploadWrapper {{fileClass}} {{if(ltPropMultiple,'multiFileupload','singleFileUpload')}} lyteFileUpd{{ltPropAppearance}}Type {{if(ltPropDisabled,'lyteFileUpdDisabled')}} {{maxFileClass}}\" ondragenter=\"{{action('drag',event)}}\" ondragover=\"{{action('drag',event)}}\" ondrop=\"{{action('drop',event)}}\" onclick=\"{{action('click',event)}}\" style=\"outline: none;position: relative;\" onpaste=\"{{action('paste',event)}}\" onkeydown=\"{{action('keydown',event)}}\" aria-labelledby=\"{{randomAriaId}}\" data-tabindex=\"{{ltPropDataTabindex}}\"> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{ltPropYield}}\" is=\"case\" lc-id=\"lc_id_0\"> <lyte-yield yield-name=\"file\" queue-list=\"{{queueList}}\" predefined-list=\"{{predefinedList}}\"></lyte-yield> </template><template default=\"\"> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{ltPropMultiple}}\" is=\"case\" lc-id=\"lc_id_0\"> <lyte-file-select-area> <lyte-file-message class=\"lyteFileUpdMsgWrap\"> <span class=\"lyteFileUpdMsg\">{{lyteUiI18n(ltPropMessage,\"fileupload\")}}</span> </lyte-file-message> </lyte-file-select-area> <div class=\"lyteFileUpdList\"> <template items=\"{{predefinedList}}\" item=\"item\" index=\"index\" is=\"for\" _new=\"true\"> <div class=\"lyteFileUpdListFile\"> <div class=\"lyteFileUpdTypePreview\"> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{lyteUiImageFile(item)}}\" is=\"case\" lc-id=\"lc_id_0\"> <img class=\"lyteFileUpdThumb\" src=\"{{item.src}}\"> </template><template default=\"\"> <span class=\"lyteFileUpdTypeIcon {{item.fileType}}\"></span> </template></template> </div> <lyte-text class=\"lyteFileUpdFileName\" lt-prop-value=\"{{item.name}}\"></lyte-text> <span class=\"lyteFileUpdFileSize\">( {{lyteUiFileSize(item.size,ltPropFileUnit,ltPropDigits)}} )</span> <lyte-file-close data-value=\"{{item.id}}\" role=\"button\" aria-label=\"{{ariaCloseLabel}} selected {{item.name}} file\"> </lyte-file-close> </div> </template> <template items=\"{{queueList}}\" item=\"item\" index=\"index\" is=\"for\" _new=\"true\"> <div class=\"lyteFileUpdListFile {{concat('lyteFile',lyteUiCapitalizeName(item.status))}}\"> <div class=\"lyteFileUpdTypePreview\"> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{lyteUiImageFile(item)}}\" is=\"case\" lc-id=\"lc_id_0\"> <img class=\"lyteFileUpdThumb\" src=\"{{item.src}}\"> </template><template default=\"\"> <span class=\"lyteFileUpdTypeIcon {{item.fileType}}\"></span> </template></template> </div> <lyte-text class=\"lyteFileUpdFileName\" lt-prop-value=\"{{item.name}}\"></lyte-text> <span class=\"lyteFileUpdFileSize\">( {{lyteUiFileSize(item.size,ltPropFileUnit,ltPropDigits)}} )</span> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{expHandlers(item.percentage,'!=',undefined)}}\" is=\"case\" lc-id=\"lc_id_0\"> <div class=\"lyteFileUpdFileStatus\" data-completed=\"{{item.percentage}}\"> <div class=\"lyteFileUpdProgressBar\"> <div class=\"lyteFileUpdProgressFill\" style=\"width: {{item.percentage}}%\"></div> </div> </div> </template></template> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{expHandlers(item.status,'==',&quot;error&quot;)}}\" is=\"case\" lc-id=\"lc_id_0\"> <lyte-file-retry data-value=\"{{item.id}}\" role=\"button\"> <span class=\"lyteFileUpdFailMsg\">{{lyteUiI18n(ltPropFailureMessage,\"fileupload\")}}</span> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{expHandlers(ltPropUploadMultiple,'!')}}\" is=\"case\" lc-id=\"lc_id_0\"> <span class=\"lyteFileUpdRetryMsg\">{{lyteUiI18n(ltPropRetryText,\"fileupload\")}}</span> </template></template> </lyte-file-retry> </template></template> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{item.lyteErrorMsg}}\" is=\"case\" lc-id=\"lc_id_0\"><span class=\"lyteFileUpdFailMsg\"> {{item.lyteErrorMsg}} </span></template></template> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{expHandlers(expHandlers(ltPropUploadMultiple,'!'),'||',expHandlers(expHandlers(expHandlers(item.status,'!'),'||',expHandlers(item.status,'==',&quot;error&quot;)),'||',expHandlers(item.status,'==',&quot;success&quot;)))}}\" is=\"case\" lc-id=\"lc_id_0\"> <lyte-file-close aria-level=\"2\" tabindex=\"0\" aria-label=\"{{ariaCloseLabel}} selected {{item.name}} file\" role=\"button\" data-value=\"{{item.id}}\"> </lyte-file-close> </template></template> </div> </template> </div> </template><template default=\"\"> <lyte-file-select-area> <lyte-file-message class=\"lyteFileUpdMsgWrap {{if(expHandlers(queueList.length,'||',predefinedList.length),'lyteHide','')}}\"> <span class=\"lyteFileUpdMsg\"> {{lyteUiI18n(ltPropMessage,\"fileupload\")}} </span> </lyte-file-message> <div class=\"lyteFileUpdList\" tabindex=\"0\" aria-level=\"2\" aria-label=\"SelectedFile:{{ariaSelectedFiles}}\"> <template items=\"{{predefinedList}}\" item=\"item\" index=\"index\" is=\"for\" _new=\"true\"> <div class=\"lyteFileUpdListFile\"> <div class=\"lyteFileUpdTypePreview\"> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{lyteUiImageFile(item)}}\" is=\"case\" lc-id=\"lc_id_0\"> <img class=\"lyteFileUpdThumb\" src=\"{{item.src}}\"> </template><template default=\"\"> <span class=\"lyteFileUpdTypeIcon {{item.fileType}}\"></span> </template></template> </div> <lyte-text class=\"lyteFileUpdFileName\" lt-prop-value=\"{{item.name}}\"></lyte-text> <span class=\"lyteFileUpdFileSize\">( {{lyteUiFileSize(item.size,ltPropFileUnit,ltPropDigits)}} )</span> <lyte-file-close data-value=\"{{item.id}}\" aria-label=\"{{ariaCloseLabel}} selected {{item.name}} file\" role=\"button\"> </lyte-file-close> </div> </template> <template items=\"{{queueList}}\" item=\"item\" index=\"index\" is=\"for\" _new=\"true\"> <div class=\"lyteFileUpdListFile {{concat('lyteFile',lyteUiCapitalizeName(item.status))}}\"> <div class=\"lyteFileUpdTypePreview\"> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{lyteUiImageFile(item)}}\" is=\"case\" lc-id=\"lc_id_0\"> <img class=\"lyteFileUpdThumb\" src=\"{{item.src}}\"> </template><template default=\"\"> <span class=\"lyteFileUpdTypeIcon {{item.fileType}}\"></span> </template></template> </div> <lyte-text class=\"lyteFileUpdFileName\" lt-prop-value=\"{{item.name}}\"></lyte-text> <span class=\"lyteFileUpdFileSize\">( {{lyteUiFileSize(item.size,ltPropFileUnit,ltPropDigits)}} )</span> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{expHandlers(item.percentage,'!=',undefined)}}\" is=\"case\" lc-id=\"lc_id_0\"> <div class=\"lyteFileUpdFileStatus\" data-completed=\"{{item.percentage}}\"> <div class=\"lyteFileUpdProgressBar\"> <div class=\"lyteFileUpdProgressFill\" style=\"width: {{item.percentage}}%\"></div> </div> </div> </template></template> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{expHandlers(item.status,'==',&quot;error&quot;)}}\" is=\"case\" lc-id=\"lc_id_0\"> <lyte-file-retry data-value=\"{{item.id}}\" role=\"button\"> <span class=\"lyteFileUpdFailMsg\">{{lyteUiI18n(ltPropFailureMessage,\"fileupload\")}}</span> <span class=\"lyteFileUpdRetryMsg\"> {{lyteUiI18n(ltPropRetryText,\"fileupload\")}} </span> </lyte-file-retry> </template></template> <lyte-file-close data-value=\"{{item.id}}\" tabindex=\"0\" aria-label=\"{{ariaCloseLabel}} selected {{item.name}} file\" role=\"button\"> </lyte-file-close> </div> </template> </div> </lyte-file-select-area> </template></template> </template></template> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{fileClass}}\" is=\"case\" lc-id=\"lc_id_0\"><div ondragleave=\"{{action('drag',event)}}\" class=\"lyteFileDragWrapper\"> </div></template></template> </div> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{ltPropAria}}\" is=\"case\" lc-id=\"lc_id_0\"><span id=\"{{randomAriaId}}\" style=\"display: none;\"> SelectedFiles:{{ariaSelectedFiles}} </span></template></template> </template>";;
LyteFileuploadComponent._dynamicNodes = [{"t":"a","p":[1]},{"t":"a","p":[3]},{"t":"s","p":[3,1],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"cn":"lc_id_0"},{"t":"i","p":[1],"in":0,"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{"dN":[{"t":"s","p":[1],"c":{"lc_id_0":{"dN":[{"t":"tX","p":[1,1,1,0],"cn":"lc_id_0"},{"t":"cD","p":[1,1],"in":3,"sibl":[2],"cn":"lc_id_0"},{"t":"cD","p":[1],"in":2,"sibl":[1],"cn":"lc_id_0"},{"t":"a","p":[3,1],"cn":"lc_id_0"},{"t":"f","p":[3,1],"dN":[{"t":"s","p":[1,1,1],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{"dN":[{"t":"a","p":[1],"cn":"default"}]},"dc":{"lc_id_0":{},"default":{}},"hd":true,"co":["lc_id_0"],"in":2,"sibl":[1]},{"t":"a","p":[1,3]},{"t":"cD","p":[1,3],"in":1,"sibl":[0]},{"t":"tX","p":[1,5,1]},{"t":"a","p":[1,7]},{"t":"cD","p":[1,7],"in":0}],"dc":[1,0],"hc":true,"trans":true,"in":1,"sibl":[0],"cn":"lc_id_0"},{"t":"a","p":[3,3],"cn":"lc_id_0"},{"t":"f","p":[3,3],"dN":[{"t":"a","p":[1]},{"t":"s","p":[1,1,1],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{"dN":[{"t":"a","p":[1],"cn":"default"}]},"dc":{"lc_id_0":{},"default":{}},"hd":true,"co":["lc_id_0"],"in":5,"sibl":[4]},{"t":"a","p":[1,3]},{"t":"cD","p":[1,3],"in":4,"sibl":[3]},{"t":"tX","p":[1,5,1]},{"t":"s","p":[1,7],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"cn":"lc_id_0"},{"t":"a","p":[1,1,1],"a":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'width: '","item.percentage","'%'"]}}},"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{}},"hd":true,"co":["lc_id_0"],"in":3,"sibl":[2]},{"t":"s","p":[1,9],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"cn":"lc_id_0"},{"t":"tX","p":[1,1,0],"cn":"lc_id_0"},{"t":"s","p":[1,3],"c":{"lc_id_0":{"dN":[{"t":"tX","p":[1,0],"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{}},"hd":true,"co":["lc_id_0"],"in":1,"sibl":[0],"cn":"lc_id_0"},{"t":"cD","p":[1],"in":0,"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{"dc":[0],"hc":true,"trans":true}},"hd":true,"co":["lc_id_0"],"hc":true,"trans":true,"in":2,"sibl":[1]},{"t":"s","p":[1,11],"c":{"lc_id_0":{"dN":[{"t":"tX","p":[0,1],"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{}},"hd":true,"co":["lc_id_0"],"in":1,"sibl":[0]},{"t":"s","p":[1,13],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"cn":"lc_id_0"},{"t":"cD","p":[1],"in":0,"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{"dc":[0],"hc":true,"trans":true}},"hd":true,"co":["lc_id_0"],"hc":true,"trans":true,"in":0}],"dc":[4,2,0],"hc":true,"trans":true,"in":0,"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{"dN":[{"t":"a","p":[1,1],"cn":"default"},{"t":"tX","p":[1,1,1,1],"cn":"default"},{"t":"cD","p":[1,1],"in":3,"sibl":[2],"cn":"default"},{"t":"a","p":[1,3],"cn":"default"},{"t":"a","p":[1,3,1],"cn":"default"},{"t":"f","p":[1,3,1],"dN":[{"t":"s","p":[1,1,1],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{"dN":[{"t":"a","p":[1],"cn":"default"}]},"dc":{"lc_id_0":{},"default":{}},"hd":true,"co":["lc_id_0"],"in":2,"sibl":[1]},{"t":"a","p":[1,3]},{"t":"cD","p":[1,3],"in":1,"sibl":[0]},{"t":"tX","p":[1,5,1]},{"t":"a","p":[1,7]},{"t":"cD","p":[1,7],"in":0}],"dc":[1,0],"hc":true,"trans":true,"in":2,"sibl":[1],"cn":"default"},{"t":"a","p":[1,3,3],"cn":"default"},{"t":"f","p":[1,3,3],"dN":[{"t":"a","p":[1]},{"t":"s","p":[1,1,1],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{"dN":[{"t":"a","p":[1],"cn":"default"}]},"dc":{"lc_id_0":{},"default":{}},"hd":true,"co":["lc_id_0"],"in":4,"sibl":[3]},{"t":"a","p":[1,3]},{"t":"cD","p":[1,3],"in":3,"sibl":[2]},{"t":"tX","p":[1,5,1]},{"t":"s","p":[1,7],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"cn":"lc_id_0"},{"t":"a","p":[1,1,1],"a":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'width: '","item.percentage","'%'"]}}},"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{}},"hd":true,"co":["lc_id_0"],"in":2,"sibl":[1]},{"t":"s","p":[1,9],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"cn":"lc_id_0"},{"t":"tX","p":[1,1,0],"cn":"lc_id_0"},{"t":"tX","p":[1,3,1],"cn":"lc_id_0"},{"t":"cD","p":[1],"in":0,"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{"dc":[0],"hc":true,"trans":true}},"hd":true,"co":["lc_id_0"],"hc":true,"trans":true,"in":1,"sibl":[0]},{"t":"a","p":[1,11]},{"t":"cD","p":[1,11],"in":0}],"dc":[3,1,0],"hc":true,"trans":true,"in":1,"sibl":[0],"cn":"default"},{"t":"cD","p":[1],"in":0,"cn":"default"}]},"dc":{"lc_id_0":{"dc":[3,2,1,0],"hc":true,"trans":true},"default":{"dc":[3,2,1,0],"hc":true,"trans":true}},"hd":true,"co":["lc_id_0"],"hc":true,"trans":true,"in":0,"cn":"default"}]},"dc":{"lc_id_0":{"dc":[0],"hc":true,"trans":true},"default":{"dc":[0],"hc":true,"trans":true}},"hd":true,"co":["lc_id_0"],"hc":true,"trans":true,"in":2,"sibl":[1]},{"t":"s","p":[3,3],"c":{"lc_id_0":{"dN":[{"t":"a","p":[0],"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{}},"hd":true,"co":["lc_id_0"],"in":1,"sibl":[0]},{"t":"s","p":[5],"c":{"lc_id_0":{"dN":[{"t":"a","p":[0],"cn":"lc_id_0"},{"t":"tX","p":[0,1],"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{}},"hd":true,"co":["lc_id_0"],"in":0},{"type":"dc","trans":true,"hc":true,"p":[2]}];;

LyteFileuploadComponent._observedAttributes = [
    "ltPropName",
    "ltPropMultiple",
    "ltPropAccept",
    "ltPropId",
    "ltPropClass",
    "ltPropAppearance",
    "ltPropDisabled",
    "ltPropYield",
    "ltPropFileLimit",
    "ltPropMinimumFileSize",
    "ltPropTotalFilesSize",
    "ltPropParallel",
    "ltPropAutoUpload",
    "ltPropTriggerUpload",
    "ltPropParamName",
    "ltPropThumb",
    "ltPropTabindex",
    "ltPropRetry",
    "ltPropFileUnit",
    "ltPropDigits",
    "ltPropMessage",
    "ltPropFailureMessage",
    "ltPropRetryText",
    "ltPropFiles",
    "ltPropFolder",
    "ltPropChunk",
    "ltPropChunkSize",
    "ltPropParallelChunkUpload",
    "ltPropParallelChunkCount",
    "ltPropChunkRetry",
    "ltPropUploadMultiple",
    "ltPropUploadMultipleCount",
    "ltPropAjax",
    "ltPropAllowReplace",
    "ltPropFilesCount",
    "ltPropAriaAttributes",
    "ltPropReset",
    "ltPropPreventDuplicate",
    "ltPropListErrorFiles",
    "ltPropResetFileValue",
    "ltPropAria",
    "ltPropDataTabindex",
    "queueList",
    "predefinedList",
    "currentUpload",
    "chunkUpload",
    "fileClass",
    "chunkCount",
    "abort",
    "lxhrs",
    "uploadedFiles",
    "manualUpdFiles",
    "uploadMultipleRetry",
    "retryFiles",
    "retry",
    "manualUpload",
    "totalFilesSize",
    "curTotFilesSize",
    "ariaCloseLabel",
    "commonAriaLabel",
    "ariaSelectedFiles",
    "randomAriaId"
];

/**
 * @syntax nonYielded
 * <lyte-fileupload></lyte-fileupload>
 */
/**
 * @syntax
 * @attribute ltPropYield=true
 * @attribute ltPropMultiple=true
 *	<lyte-fileupload lt-prop-yield=true lt-prop-multiple = true>
 *  	<template is = "registerYield" yield-name = "file">
 *	 	<lyte-file-select-area>
 *	  	 	<lyte-file-message class="lyteFileUpdMsgWrap"> <span class="lyteFileUpdMsg"> Drag file here or browse to upload </span> </lyte-file-message>
 *	 	</lyte-file-select-area>
 *		<div class="lyteFileUpdList">
 *			<template lyte-for="{{predefinedList}} as item index">
 *				<div class="lyteFileUpdListFile">
 *					<div class="lyteFileUpdTypePreview">
 *						<template lyte-if="{{item.src}}">
 *								<img class="lyteFileUpdThumb" src={{item.src}}>
 *						</template>
 *						<template lyte-else>
 *							<span class="lyteFileUpdTypeIcon {{item.fileType}}"></span>
 *						</template>
 *					</div>
 *					<lyte-text class = "lyteFileUpdFileName" lt-prop-value = {{item.name}}></lyte-text>
 *					<span class="lyteFileUpdFileSize">( {{lyteUiFileSize(item.size, ltPropFileUnit, ltPropDigits)}} )</span>
 *					<lyte-file-close data-value = {{item.id}} class = {{item.status}}></lyte-file-close>
 *				</div>
 *			</template>
 *	  	  	<template lyte-for="{{queueList}} as item index">
 *	  	  		<div class="lyteFileUpdListFile {{item.status}}">
 *	  				<div class="lyteFileUpdTypePreview">
 *	  	  	  	 		<template lyte-if="{{item.src}}">
 *	  	  	  	  	  		<img class="lyteFileUpdThumb" src={{item.src}}>
 * 						</template>
 *	  	  	  	  	  	<template lyte-else>
 *	  	  	  	  	  		<span class="lyteFileUpdTypeIcon {{item.fileType}}"></span>
 *	  	  	  	  	  	</template>
 *	  	  	  	  	</div>
 *	  	  	  	  	<lyte-text class = "lyteFileUpdFileName" lt-prop-value = {{item.name}}> </lyte-text>
 *	  	  	  	  	<span class="lyteFileUpdFileSize"> ( {{lyteUiFileSize(item.size, 'KB', 2)}} ) </span>
 *	  	  	  	  	<template lyte-if="{{!ltPropUploadMultiple && item.percentage != undefined}}">
 *	  	  	  	  		<div class="lyteFileUpdFileStatus" data-completed = {{item.percentage}}>
 *	  	  	  	  	  		<div class="lyteFileUpdProgressBar {{item.status}}">
 *	  	  	  	  	  	  		<div class="lyteFileUpdProgressFill" style="width: {{item.percentage}}%"> </div>
 *	  	  	  	  	  		</div>
 *	  	  	  	  		</div>
 *					</template>
 * 					<template lyte-if='{{item.status=="error"}}'>
 *	  	  	  	  		<lyte-file-retry data-value = {{item.id}}>
 *	  	  	  	  	  		<span class="lyteFileUpdFailMsg">Attachment failed </span>
 *	  	  	  	  	  		<template lyte-if="{{!ltPropUploadMultiple}}">
 *	  	  	  	  	  			<span class="lyteFileUpdRetryMsg"> Retry </span>
 *	  	  	  	  	  		</template>
 *	  	  	  	  		</lyte-file-retry>
 *	  	  	  	  	</template>
 *               	<template lyte-if='{{(!ltPropUploadMultiple)||(!item.status||item.status=="error"||item.status=="success")}}'>
 *	  	  	  	  		<lyte-file-close data-value = {{item.id}} class = {{item.status}}> </lyte-file-close>
 *	  	  	  	  	</template>
 *	  	  	  	</div>
 *	  		</template>
 *	 	</div>
 *		</template>
 *	</lyte-fileupload>
 */
/**
 * @syntax
 * @attribute ltPropYield=true
 * @attribute ltPropMultiple=false
 *	<lyte-fileupload lt-prop-yield = true lt-prop-multiple = false>
 *		<template is = "registerYield" yield-name = "file">
 *	  		<lyte-file-select-area>
 *	  	  		<lyte-file-message class="lyteFileUpdMsgWrap{{if(queueList.length, 'lyteHide', '')}}">
 *	  	  	  		<span class="lyteFileUpdMsg"> Drag file here or browse to upload </span>
 *	  	  	  	</lyte-file-message>
 *	  	  	  	<div class="lyteFileUpdList">
 *					<template lyte-for="{{predefinedList}} as item index">
 *						<div class="lyteFileUpdListFile">
 *							<div class="lyteFileUpdTypePreview">
 *								<template lyte-if="{{item.src}}">
 *										<img class="lyteFileUpdThumb" src={{item.src}}>
 *								</template>
 * 								<template lyte-else>
 *									<span class="lyteFileUpdTypeIcon {{item.fileType}}"></span>
 *								</template>
 *							</div>
 *							<lyte-text class = "lyteFileUpdFileName" lt-prop-value = {{item.name}}></lyte-text>
 *							<span class="lyteFileUpdFileSize">( {{lyteUiFileSize(item.size, ltPropFileUnit, ltPropDigits)}} )</span>
 *							<lyte-file-close data-value = {{item.id}} class = {{item.status}}></lyte-file-close>
 *						</div>
 *					</template>
 *					<template lyte-for="{{queueList}} as item index">
 *	  	  	  	  		<div class="lyteFileUpdListFile {{item.status}}">
 *	  	  	  	  	 		<div class="lyteFileUpdTypePreview">
 *	  	  	  	  	  	  		<template lyte-if="{{item.src}}">
 *	  	  	  	  	  	  			<img class="lyteFileUpdThumb" src={{item.src}}>
 *	  	  	  	  	  	  		</template>
 *								<template lyte-else>
 *	  	  	  	  	  	  			<span class="lyteFileUpdTypeIcon {{item.fileType}}"> </span>
 *	  	  	  	  	  	  		</template>
 *	  	  	  	  	  		</div>
 *	  	  	  	  	  		<lyte-text class = "lyteFileUpdFileName" lt-prop-value = {{item.name}}> </lyte-text>
 *	  	  	  	  	  		<span class="lyteFileUpdFileSize"> ( {{lyteUiFileSize(item.size, 'KB', 2)}} ) </span>
 *	  	  	  	  	  		<div lyte-if="{{item.percentage != undefined}}" class="lyteFileUpdFileStatus" data-completed = {{item.percentage}}>
 *	  	  	  	  	  	 		<div class="lyteFileUpdProgressBar {{item.status}}">
 *	  	  	  	  	  	  			<div class="lyteFileUpdProgressFill" style="width: %"> </div>
 *	  	  	  	  	  	 		</div>
 *	  	  	  	  	  		</div>
 *	  	  	  	  	  		<lyte-file-retry lyte-if='{{item.status=="error"}}' data-value = {{item.id}}>
 *	  	  	  	  	  	  		<span class="lyteFileUpdFailMsg"> Attachment failed </span>
 *	  	  	  	  	  	  		<span class="lyteFileUpdRetryMsg"> Retry </span>
 *	  	  	  	  	  		</lyte-file-retry>
 *	  	  	  	  	  		<lyte-file-close data-value = {{item.id}} class = {{item.status}}> </lyte-file-close>
 *	  	  	  	 		</div>
 *	  	  	  		</template>
 *	 			</div>
 *	  		</lyte-file-select-area>
 *		</template>
 *	</lyte-fileupload>
 */



LyteFileuploadComponent.register("lyte-fileupload", {
    hash: "LyteFileuploadComponent_4",
    refHash: "C_lyte-ui-component_@zoho/lyte-ui-component_2"
});

/***/ }),

/***/ 76954627:
/*!**************************************************************************************!*\
  !*** ./node_modules/@zoho/lyte-ui-component/components/javascript/lyte-hovercard.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LyteHovercardComponent": () => (/* binding */ LyteHovercardComponent)
/* harmony export */ });
/* harmony import */ var _lyte_wormhole_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lyte-wormhole.js */ 57986490);
/* harmony import */ var _lyte_popover_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lyte-popover.js */ 36213367);
/* harmony import */ var _slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../@slyte/core/index.js */ 56505143);
/* harmony import */ var _component_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../component.js */ 50761997);
/* harmony import */ var _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../lyte-dom/modules/lyte-dom-utils.js */ 19978124);
/* harmony import */ var _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3__);







/**
 * Renders a hovercard
 * @component lyte-hovercard
 * @dependencies lyte-popover
 * /components/lyte-popover.js
 * /theme/compiledCSS/default/ltr/lyte-ui-popover.css
 * @version  3.1.0
 * @methods beforeRender,afterRender,onHovercardShow,onHovercardHide,onHovercardBeforeHide
 */
class LyteHovercardComponent extends _component_js__WEBPACK_IMPORTED_MODULE_2__.Component {
  constructor() {
    super();
  }

  data(arg1) {
    return Object.assign(super.data({
      /** 
       * @componentProperty {boolean} ltPropDisplay=true
       * @version 3.1.0
       */
      'ltPropDisplay' : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)( 'boolean', { 'default' : true } ),
      /** 
       * @componentProperty {boolean} ltPropShow=false
       * @version 3.1.0
       */
        'ltPropShow' : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)( 'boolean', { 'default' : false } ),
        /** 
       * @componentProperty {string} ltPropOriginElem=''
       * @version 3.1.0
       */
        'ltPropOriginElem' : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)( 'string', { 'default' : '' } ),
        /** 
       * @componentProperty {string} ltPropMaxHeight=''
       * @version 3.1.0
       */
        'ltPropMaxHeight' : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)( 'string', { 'default' : '' } ),
        /** 
       * @componentProperty {string} ltPropWidth=''
       * @version 3.1.0
       */
        'ltPropWidth' : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)( 'string', { 'default' : '' } ),
        /** 
       * @componentProperty {string} ltPropHeight=auto
       * @version 3.1.0
       */
        'ltPropHeight' : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)( 'string', { 'default' : 'auto' } ),
        /** 
       * @componentProperty {string} ltPropPlacement=''
       * @version 3.1.0
       */
        'ltPropPlacement' : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)( 'string', { 'default' : '' } ),
        /** 
       * @componentProperty {number} ltPropClass=''
       * @version 3.1.0
       */
        'ltPropClass' : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)( 'string', { 'default' : window._lyteUiUtils.resolveDefaultValue( 'lyte-hovercard', 'class', '' ) } ),
        /** 
       * @componentProperty {string} ltPropId=''
       * @version 3.1.0
       */
        'ltPropId' : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)( 'string', { 'default' : '' } ),
        /** 
       * @componentProperty {number} ltPropShowDelay=0
       * @version 3.1.0
       */
        'ltPropShowDelay' : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)( 'number', { 'default': 0 } ),
        /** 
       * @componentProperty {number} ltPropHideDelay=0
       * @version 3.1.0
       */
        'ltPropHideDelay' : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)( 'number', { 'default': 0 } ),
        /** 
       * @componentProperty {number} ltPropMaxDisplayTime=5000
       * @version 3.1.0
       */
        'ltPropMaxDisplayTime' : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)( 'number', { 'default' : 5000 } ),
        /** 
       * @componentProperty {boolean} ltPropKeepAlive=false
       * @version 3.1.0
       */
        'ltPropKeepAlive' : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)( 'boolean', { 'default' : false } ),
        /** 
       * @componentProperty {boolean} ltPropFollowCursor=false
       * @version 3.1.0
       */
        'ltPropFollowCursor' : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)( 'boolean', { 'default' : false } ),
        /** 
       * @componentProperty {string} ltPropPopoverWrapperClass
       * @version 3.1.0
       */
        'ltPropPopoverWrapperClass' : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)( 'string',{'default': window._lyteUiUtils.resolveDefaultValue( 'lyte-hovercard', 'popoverWrapperClass', '' ) }),
        /** 
       * @componentProperty {object} ltPropOffset={}
       * @version 3.1.0
       */
        'ltPropOffset' : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)( 'object', { 'default' : {} } ),
        /** 
       * @componentProperty {boolean} ltPropCloseOnEscape=true
       * @version 3.1.0
       */
        'ltPropCloseOnEscape' : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)( 'boolean', { 'default' : true } ),
        /** 
        * @componentProperty {boolean} ltPropAutoShow=false
        * @version 3.1.0
        */
        'ltPropAutoShow' : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)( 'boolean', { 'default' : false}),
         /** 
        * @componentProperty {boolean} ltPropHideOnClick=false
        * @version 3.1.0
        */
        'ltPropHideOnClick' : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)( 'boolean', { 'default' : window._lyteUiUtils.resolveDefaultValue( 'lyte-hovercard', 'hideOnClick', false ) } ),
         /**
          * @componentProperty {boolean} ltPropAria
          * @version 3.1.0
          * @default false
          *
          */
        "ltPropAria" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)( 'boolean', { default : false } ),
        /**
         * @componentProperty {object} ltPropAriaAttributes={}
         * @version 3.1.0
         */
        "ltPropAriaAttributes" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)( 'object', { default : {} } ),
         /**
         * @componentProperty {boolean} ltPropPreventFocus=true
         */
        "ltPropPreventFocus" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('boolean', { default : true } ),
         /**
         * @componentProperty {string} ltPropMaxWidth
         */
        "ltPropMaxWidth" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('string',{default:''}),
        "ltPropType" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('string',{default :'callout'}),
        "ltPropDimmer":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("object",{"default":{"color":"black","opacity":"0.4"}}),
        "ltPropAnimation":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("string",{"default":"fade"}), //fade,zoom
        "ltPropAutoAlign" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)('boolean', {default : false}),

        'mousePosition' : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)( 'array', { 'default' : [] } ),
        'mouseover' : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)( 'boolean', { 'default' : false } ),
        'originEle' : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)( 'string', { 'default' : ''})

    }), arg1);   
  }

  init() {
    if( this.getMethods( 'beforeRender' ) ){
            this.executeMethod( 'beforeRender', this.$node );
      }
  }

  didConnect() {
    this._popover = this.$node.getElementsByTagName('lyte-popover')[0]
    this._hovercardScroll = this.hovercardScroll.bind( this );
    this._hovercardHideOnClick = this.hovercardHideOnClick.bind(this)
    this._mousemove = this.mousemove.bind(this);
    this._oriEleMouseMove = this.oriEleMousemove.bind(this)
    if(this.getData('ltPropAutoShow') && this.getData('ltPropOriginElem')){
      this.setMouseMove()
    }
    _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3___default().fastdom.measure( function() {
         var fg = window.getComputedStyle( this.$node ).getPropertyValue( 'direction' ) == 'rtl';
         _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3___default().fastdom.mutate( function(){
           if( fg ) {
             this.direction = true;
           }
         }.bind( this ) )
    }.bind( this ) )
    window._lyteUiUtils.dispatchEvent( 'afterrender', this.$node ); 

    if( this.getMethods( 'afterRender' ) ) {
       this.executeMethod('afterRender', this.$node);
    }
  }

  didDestroy() {
    this.$node.classList.remove('lyteActive')
    if( this.getData( 'ltPropHideOnClick') ){
      document.removeEventListener( 'click' , this._hovercardHideOnClick )
    }
    var originElem = document.querySelector( this.$node.ltProp( 'originElem' ) ) 

    if(originElem ){
      this._closeHoverCard && originElem.removeEventListener( 'mouseleave', this._closeHoverCard )
      this.removeEventListenerForOriginElem(originElem)

    }
    if(this._popover){
      this._popover.setData('ltPropShow',false)
    }
    if(window._lyteUiUtils.lyteHovercard){
      delete window._lyteUiUtils.lyteHovercard[this.$node.ltProp( 'originElem' ) ]

    }
    if( this._childComp ){
      this._childComp.remove()
    }
    if(this.getData('ltPropAutoShow')){
      document.removeEventListener('mousemove',this._mousemove)
    }
    delete this.prevHoverCardNode;
    delete this._childComp;
    delete this._popover;
  }

  setMaxHeightAndWidth(div) {
    if(this.getData('ltPropMaxWidth')){
      div.style.maxWidth = this.getData('ltPropMaxWidth')
    }
    if(this.getData('ltPropMaxHeight')){
      div.style.maxHeight = this.getData('ltPropMaxHeight')
    }
  }

  isNode(target) {
   return target instanceof HTMLElement || target instanceof Node;  

 }

  addEventListenerForOriginElem(originElem) {
    if(originElem){
      originElem.addEventListener( 'mousemove', this._oriEleMouseMove )
    }
  }

  removeEventListenerForOriginElem(originElem) {
    if(originElem){
      originElem.removeEventListener( 'mousemove', this._oriEleMouseMove )
    }
    this.setData( 'mousePosition', [] )
    this.setData( 'mouseover', false )

  }

  hovercardHideOnClick(event) {
    var target = event.target,
    popoverWormhole = this._popover.component.actualModalDiv;
    if( this.getData( 'ltPropHideOnClick' ) && this.getData( 'ltPropShow' ) && this.isNode(target) && !( target === popoverWormhole || popoverWormhole.contains( target ) ) ){
          this.setData( 'ltPropShow', false )
      }
  }

  oriEleMousemove(eve) {

    if( !this.getData( 'mouseover' ) ) {
        this.mouseovereve( eve )
        this.setData( 'mouseover', true )
    }
    var currMpos = [ eve.clientX, eve.clientY ];
    var mpos = this.getData( 'mousePosition' );
    var diff = [ currMpos[ 0 ] - ( mpos[ 0 ]? mpos[ 0 ] : 0 ), currMpos[ 1 ] - ( mpos[ 1 ] ? mpos[ 1 ] : 0 ) ];
    if( this._popover.ltProp( 'show' ) && this._popover.component.childComp) {
      var popupEle = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3___default()( '.lyteHoverCardFollowCursor .lytePopover' ,this._popover.component.childComp)[ 0 ];
      var clientRect = popupEle.getBoundingClientRect();
      popupEle.style.top = clientRect.top + diff[ 1 ] + 'px';
      popupEle.style.left = clientRect.left + diff[ 0 ] + 'px';
    }
    this.setData( 'mousePosition', currMpos );
  }

  mouseovereve(eve) {
    var mpos = [ eve.clientX, eve.clientY ];
    var pos = '';
    var clientRect = document.querySelector( this.$node.ltProp( 'originElem' ) )
    
    this._popover.ltProp( {
      offset : { left : mpos[ 0 ] - 9, top : mpos[ 1 ] - 9, height : 18, width : 18 }
    } )
    this.setData('ltPropOffset',{ left : mpos[ 0 ] , top : mpos[ 1 ] , height : 18, width : 18 })
    this.setData( 'mousePosition', mpos );
  }

  mousemove(event) {
    var nodeName1 = event.target.correspondingElement || event.target;
    while(nodeName1 && nodeName1.tagName != 'BODY' && nodeName1 != document && nodeName1.tagName != 'HTML' ){
        
        var iHovercard = nodeName1.getAttribute( 'lyte-hovercard' );

        if( iHovercard ){
          var hovercard = this.findMatchingHoverCard(nodeName1);
          if( hovercard && !hovercard.getData('ltPropShow')){
             hovercard.setData('ltPropShow',true);
          } 
          break;
          
        }
        else {
            nodeName1 = nodeName1.parentNode;
        }  
    }
  
}

  findMatchingHoverCard(node) {
    for(var item in window._lyteUiUtils.lyteHovercard){
       if(node.matches(item)){
         return window._lyteUiUtils.lyteHovercard[item];
       }
   }
  }

  setMouseMove() {
     var map = window._lyteUiUtils.lyteHovercard ? window._lyteUiUtils.lyteHovercard : []
     map[this.$node.ltProp( 'originElem' )] = this.$node;
     window._lyteUiUtils.lyteHovercard = map;
     document.addEventListener('mousemove',this._mousemove)
   }

  compouteOffset(popover) {
      var arr = [ 'ltPropWidth', 'ltPropHeight' ];
      for( var i = 0; i < arr.length; i++ ) {
            if( this.getData( arr[ i ] ) ) {
                  popover.setData( arr[ i ], this.getData( arr[ i ] ) )
            }
       }
  }

  createHoverCard(event, popoverWormhole) {
    var popover = this._popover
    if(popover){
      window._lyteUiUtils.dispatchEvent( 'beforeshow', this.$node, { originalEvent: event } ); 
       var res = true;
        if( this.getMethods( 'onBeforeHovercardShow' ) ) {
          res = this.executeMethod('onBeforeHovercardShow', this.$node );
        }
        if(!res){
          return false
        }
        popover.ltProp( 'show', true )
        popover.ltProp( 'allowMultiple', true)
        this.$node.classList.add( 'lyteActive' )
        if( this.getMethods( 'onHovercardShow' ) ) {
                this.executeMethod('onHovercardShow', this.$node );
        }
    }
    if( !this.getData( 'ltPropKeepAlive' ) && !this.getData('ltPropFollowCursor')) {
          var originElem = document.querySelector( this.$node.ltProp( 'originElem' ) )

          popover._maxdisp = setTimeout( function() {
            this.removeHoverCard(popover, originElem, event, popoverWormhole)
          }.bind( this ), this.getData( 'ltPropMaxDisplayTime' ) );
    }
    
  }

  removeTimeout(popover) {
        clearTimeout( popover._settime )
        clearTimeout( popover._maxdisp )
        clearTimeout( popover._bodyTimeout )
  }

  closeHoverCard(event) {
      var wormHole = this._childComp,
       popoverWormhole = this._popover.component.actualModalDiv,
       popover = this._popover,
       originElem = document.querySelector( this.$node.ltProp( 'originElem' ) )
      if(  this.prevHoverCardNode && this.isNode(event.target) && ( this.getData('ltPropFollowCursor') || event.target == this.prevHoverCardNode || this.prevHoverCardNode.contains( event.target ) ) && popoverWormhole && event.relatedTarget != popoverWormhole && !popoverWormhole.contains( event.relatedTarget )) {
                popover._bodyTimeout = setTimeout( this.removeHoverCard.bind( this ), this.getData( 'ltPropHideDelay' ), popover, originElem, event ) ;

          } else if( popoverWormhole  && this.isNode(event.relatedTarget ) && (event.relatedTarget == popoverWormhole || popoverWormhole.contains( event.relatedTarget )  )  ) {  
              this.removeTimeout( popover )
              this._popovermouseleave = this.popoverMouseLeave.bind( this )
              popoverWormhole.addEventListener( 'mouseleave', this._popovermouseleave )
              originElem.removeEventListener( 'mouseleave', this._closeHoverCard )
  
           } 
  }

  removeHoverCard(popover, originElem, event, popoverWormhole) {
    var res = true
    if(this.getMethods( 'onHovercardBeforeHide' ) ) {
          res = this.executeMethod( 'onHovercardBeforeHide', this.$node, event );
          if( !res && originElem){
              originElem.removeEventListener( 'mouseleave', this._closeHoverCard )
              if( this._popovermouseleave && popoverWormhole ){
                popoverWormhole.removeEventListener( 'mouseleave', this._popovermouseleave )
              }
          }
    }
    if( res && ( ( this.prevHoverCardNode  && this.isNode(event.target) && ( event.target == this.prevHoverCardNode || this.prevHoverCardNode.contains( event.target ) ) ) || ( popoverWormhole  && this.isNode(event.target) && ( event.target == popoverWormhole || popoverWormhole.contains( event.target ) ) ) ) ){
            this.removeTimeout( popover )

            if( this.getData( 'ltPropShow' ) && popover ) {
                    this.setData( 'ltPropShow', false )
                    popover.setData( 'ltPropShow',false )
                }  
    }
  }

  popoverMouseLeave(event) {
    var wormHole = this._childComp ,
    popoverWormhole = this._popover.component.actualModalDiv ,
    popover = this._popover ,
    originElem = document.querySelector( this.$node.ltProp( 'originElem' ) ),
    element =document.elementFromPoint(event.clientX, event.clientY)
   if( popoverWormhole  && this.isNode(event.target) && !popoverWormhole.contains(element) && ( event.target == popoverWormhole || popoverWormhole.contains( event.target ) ) && event.relatedTarget != this.prevHoverCardNode && !this.prevHoverCardNode.contains( event.relatedTarget ) ) {
     popover._bodyTimeout = setTimeout( this.removeHoverCard.bind( this ), this.getData( 'ltPropHideDelay' ), popover, originElem, event, popoverWormhole );
   }
   else if( this.prevHoverCardNode  && this.isNode(event.relatedTarget) && ( event.relatedTarget == this.prevHoverCardNode || this.prevHoverCardNode.contains( event.relatedTarget ) ) ) {
         popover._settime = setTimeout( this.createHoverCard.bind( this ), this.getData( 'ltPropShowDelay' ), event, popoverWormhole );
         this._closeHoverCard = this.closeHoverCard.bind( this )
         originElem.addEventListener( 'mouseleave', this._closeHoverCard )
         if( this._popovermouseleave ){
           popoverWormhole.removeEventListener( 'mouseleave', this._popovermouseleave )
         }

   }
  }

  hovercardScroll(event) {
    if(_lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3___default()(this.$node).hasClass("lyteActive")){
    var res = true
        var component = this,
            wormHole = component._childComp ,
            popoverWormhole = component._popover.component.actualModalDiv ,
            popover =component._popover ,
            originElem = document.querySelector( this.getData('ltPropOriginElem') )
            
        if(component.getMethods( 'onHovercardBeforeHide' ) ) {
            res = component.executeMethod( 'onHovercardBeforeHide', component.$node );
            if( !res && originElem){
                originElem.removeEventListener( 'mouseleave', component._closeHoverCard )
                if(  component._popovermouseleave && popoverWormhole ){
                    popoverWormhole.removeEventListener( 'mouseleave', component._popovermouseleave )
                  }
            }
        }
        if(res ){
            
            if( component.getData( 'ltPropShow' ) && popover ) {
                component.setData( 'ltPropShow', false )
                
            }
            if( component.prevHoverCardNode ) {
              delete component.prevHoverCardNode
            }
            component.removeTimeout( popover )
        }
      
      }
  }

  static methods(arg1) {
    return Object.assign(super.methods({
      beforeWormholeAppend : function(args){
        this._childComp = args
      }
    }), arg1);
  }

  static observers(arg1) {
    return Object.assign(super.observers({
      originEleObs : function(arg){
        
        if( window._lyteUiUtils.lyteHovercard){
          var originElem = document.querySelector( arg.oldValue  )  
          if(originElem ){
            this._closeHoverCard && originElem.removeEventListener( 'mouseleave', this._closeHoverCard )
            this.removeEventListenerForOriginElem(originElem)

          }
          delete window._lyteUiUtils.lyteHovercard[ arg.oldValue ]
          window._lyteUiUtils.lyteHovercard[this.getData( 'ltPropOriginElem' )] = this.$node
          this.setData('ltPropShow', false)
        } else {
          this.setMouseMove()
        }
    
       
      }.observes('ltPropOriginElem'),

      showToggled : function() {

          var popover = this._popover
          if( popover.component && !popover.getData( 'ltPropBindToBody' ) ) {
              popover.ltProp( 'bindToBody', true )
          }
          var wormHole = this._childComp.querySelector('.hoverCardWrapper' ),
           popoverWormhole = this._popover.component.actualModalDiv,
           originElem = document.querySelector( this.$node.ltProp( 'originElem' ) ) 
          if( this.getData( 'ltPropShow' ) && originElem ) {
              this.prevHoverCardNode = originElem;
              if( this.getData( 'ltPropHideOnClick') ){
                  document.addEventListener( 'click' , this._hovercardHideOnClick )
              }
             
              window._lyteUiUtils.appendChild( popoverWormhole, wormHole )

              popover.ltProp( 'originElem', this.getData( 'ltPropOriginElem' ) )
              popover.ltProp( 'freeze', false )
              popover.ltProp( 'duration', undefined )
              // popover.ltProp('offset',this.getData('ltPropOffset'))
              // popover.ltProp('preventFocus',this.getData('ltPropPreventFocus'))
              // popover.ltProp( 'closeOnEscape', this.getData( 'ltPropCloseOnEscape' ) )
              this.compouteOffset( popover );
              this.setMaxHeightAndWidth(wormHole)
              // if(this.getData('ltPropPopoverWrapperClass')){
              //    popover.setData( 'ltPropWrapperClass', popover.getData( 'ltPropWrapperClass' )+' '+ this.getData('ltPropPopoverWrapperClass'))
              // }
              if( this.getData( 'ltPropFollowCursor' ) ) {
                  this.addEventListenerForOriginElem( originElem )
                  // popover.setData( 'ltPropWrapperClass', popover.getData( 'ltPropWrapperClass' )+ ' lyteHoverCardFollowCursor' )
              }
            
              popover._settime = setTimeout( this.createHoverCard.bind( this ), this.getData( 'ltPropShowDelay' ), window.event, popoverWormhole );
              
              this._closeHoverCard = this.closeHoverCard.bind( this )
              originElem.addEventListener( 'mouseleave', this._closeHoverCard )
          }
          else{
               popover.ltProp( 'show', false )

              popover.ltProp( 'bindToBody', false )
              // popover.setData( 'ltPropWrapperClass', 'lyteHovercardPopover' )
              this.$node.classList.remove( 'lyteActive' )
              if(originElem){
                originElem.removeEventListener( 'mouseleave', this._closeHoverCard )
              }
              if( this._popovermouseleave ){
                  popoverWormhole.removeEventListener( 'mouseleave', this._popovermouseleave )

              }
               if( this.getData( 'ltPropHideOnClick') ){
                document.removeEventListener( 'click' , this._hovercardHideOnClick )
              }
              this.removeEventListenerForOriginElem( originElem )
              if( this.getMethods( 'onHovercardHide' ) ) {
                  this.executeMethod( 'onHovercardHide', this.$node );
              }
              if( this.prevHoverCardNode ) {
                  delete this.prevHoverCardNode
              }
              delete this._childComp;
              delete this._mousedownFlag;
              this.removeTimeout( popover )
          }
      }.observes( 'ltPropShow' )
    }), arg1);
  }

  _() {
    _;
  }
}

LyteHovercardComponent._template = "<template tag-name=\"lyte-hovercard\"> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{ltPropShow}}\" is=\"case\" lc-id=\"lc_id_0\"> <lyte-wormhole case=\"{{ltPropShow}}\" style=\"{{if(ltPropShowCopy,'visibility:visible','visibility:hidden')}}\" on-before-append=\"{{method(&quot;beforeWormholeAppend&quot;)}}\"> <template is=\"registerYield\" yield-name=\"lyte-content\"> <div class=\"hoverCardWrapper {{ltPropClass}}\" id=\"{{ltPropId}}\"> <lyte-yield yield-name=\"hoverCardYield\"></lyte-yield> </div> </template> </lyte-wormhole> </template></template> <lyte-popover class=\"lyteHoverCard\" lt-prop-aria=\"{{ltPropAria}}\" lt-prop-aria-attributes=\"{{ltPropAriaAttributes}}\" lt-prop-wrapper-class=\"lyteHovercardPopover {{ltPropPopoverWrapperClass}} {{if(ltPropFollowCursor,'lyteHoverCardFollowCursor','')}}\" lt-prop-close-on-body-click=\"false\" lt-prop-type=\"{{ltPropType}}\" lt-prop-show-close-button=\"false\" lt-prop-bind-to-body=\"true\" lt-prop-placement=\"{{ltPropPlacement}}\" lt-prop-offset=\"{{ltPropOffset}}\" lt-prop-close-on-escape=\"{{ltPropCloseOnEscape}}\" lt-prop-prevent-focus=\"{{ltPropPreventFocus}}\" lt-prop-dimmer=\"{{ltPropDimmer}}\" lt-prop-animation=\"{{ltPropAnimation}}\" lt-prop-auto-align=\"{{ltPropAutoAlign}}\"> <template is=\"registerYield\" yield-name=\"popover\"> </template> </lyte-popover> </template>";;
LyteHovercardComponent._dynamicNodes = [{"t":"s","p":[1],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"a":{"style":{"name":"style","helperInfo":{"name":"if","args":["ltPropShowCopy","'visibility:visible'","'visibility:hidden'"]}}},"cn":"lc_id_0"},{"t":"r","p":[1,1],"dN":[{"t":"a","p":[1]},{"t":"i","p":[1,1],"in":0}],"dc":[0],"hc":true,"trans":true,"in":1,"sibl":[0],"cn":"lc_id_0"},{"t":"cD","p":[1],"in":0,"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{"dc":[1,0],"hc":true,"trans":true}},"hd":true,"co":["lc_id_0"],"hc":true,"trans":true,"in":2,"sibl":[1]},{"t":"a","p":[3]},{"t":"r","p":[3,1],"dN":[],"in":1,"sibl":[0]},{"t":"cD","p":[3],"in":0},{"type":"dc","trans":true,"hc":true,"p":[2,0]}];;

LyteHovercardComponent._observedAttributes = [
  "ltPropDisplay",
  "ltPropShow",
  "ltPropOriginElem",
  "ltPropMaxHeight",
  "ltPropWidth",
  "ltPropHeight",
  "ltPropPlacement",
  "ltPropClass",
  "ltPropId",
  "ltPropShowDelay",
  "ltPropHideDelay",
  "ltPropMaxDisplayTime",
  "ltPropKeepAlive",
  "ltPropFollowCursor",
  "ltPropPopoverWrapperClass",
  "ltPropOffset",
  "ltPropCloseOnEscape",
  "ltPropAutoShow",
  "ltPropHideOnClick",
  "ltPropAria",
  "ltPropAriaAttributes",
  "ltPropPreventFocus",
  "ltPropMaxWidth",
  "ltPropType",
  "ltPropDimmer",
  "ltPropAnimation",
  "ltPropAutoAlign",
  "mousePosition",
  "mouseover",
  "originEle"
];

window.addEventListener( 'scroll', function(event) {
   window.clearTimeout( window._lyteUiUtils._expressDebounce );

  window._lyteUiUtils._expressDebounce = setTimeout( function() {

    var activeHovercard = document.querySelector('lyte-hovercard.lyteActive')
    if(activeHovercard){
       var popover = activeHovercard.component._popover
       if(popover){
        var childComp = popover.component.actualModalDiv
        var target = arguments[0].target
        if(childComp.contains(target)){
          return;
        }
       }
    }


      var hovercard = document.getElementsByTagName( 'lyte-hovercard' ),
      i = 0;
     
          for( ; i < hovercard.length; i++ ) {
              if( hovercard[ i ] ){
                  hovercard[ i ].component.hovercardScroll();
              }
          
      }   
  }, 250,event );
  
}, true );

/**
 * @syntax yielded
 * <lyte-hovercard>
 *     <template is = "registerYield" yield-name = "hoverCardYield">
 *         <lyte-hovercard-content>
 *             //Some Content
 *         </lyte-hovercard-content>
 *     </template>
 * </lyte-hovercard>
 */


LyteHovercardComponent.register("lyte-hovercard", {
  hash: "LyteHovercardComponent_4",
  refHash: "C_lyte-ui-component_@zoho/lyte-ui-component_2"
});


/***/ }),

/***/ 36213367:
/*!************************************************************************************!*\
  !*** ./node_modules/@zoho/lyte-ui-component/components/javascript/lyte-popover.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LytePopoverComponent": () => (/* binding */ LytePopoverComponent)
/* harmony export */ });
/* harmony import */ var _lyte_wormhole_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lyte-wormhole.js */ 57986490);
/* harmony import */ var _slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../@slyte/core/index.js */ 56505143);
/* harmony import */ var _component_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../component.js */ 50761997);
/* harmony import */ var _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../lyte-dom/modules/lyte-dom-utils.js */ 19978124);
/* harmony import */ var _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2__);






window.addPopoverEvent = function(event) {

    document.addEventListener('click',function(event){
        if(window.LytePopup._stopPropagation){
            window.LytePopup._sourceComp.setData('ltPropStopClick', false);
            return;
        }
        var ele = event.target;
        while(!_lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()(ele).hasClass('popoverWrapper') && ele.tagName != "LYTE-POPOVER-FREEZE" && ele.tagName != 'LYTE-DROP-BOX' && ele.tagName != 'HTML'){
            ele = ele.parentElement;
            if(!ele){
                return
            }
        }
        if(ele.tagName == 'HTML' || ele.tagName == "LYTE-POPOVER-FREEZE"){
            for(var i = window.LytePopup.components.length -1 ; i>=0; i--){
                var dropdowns = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()(window.LytePopup.components[i].childComp).find('lyte-dropdown')
                var dontClose = false;
                if(dropdowns[0]){
                    for(var j = 0;j<dropdowns.length;j++){
                        if(dropdowns[j]){
                            if(dropdowns[j].getData('ltPropIsOpen')){
                                dontClose = true
                            }
                        }
                    }
                }
                if(window.LytePopup.components[i].$node.tagName == "LYTE-POPOVER" && window.LytePopup.components[i].childComp.style.visibility == "visible" && !dontClose){
                    // LytePopup.evt = event;
                    var popover = window.LytePopup.components[i].$node;
                    // if(popover && popover.component.getData('visible') && popover.component.getData('ltPropCloseOnBodyClick') && !popover.component.getData('dragRunning')){
                    if((popover && popover.component.getData('visible') && popover.component.getData('ltPropCloseOnBodyClick') && !popover.component.getData('dragRunning')) && ((!_lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()(event.target).closest('lyte-input')[0]) || (!popover.component.getData('ltPropIgnoreInput')))){
                        popover.component.setData('visible',false);
                        popover.ltProp('show',false);
                        break;
                    }
                }
            }
        }
        /*  If ele is having popoverWrapper class ie. a popover and it is not the popover that is opened at last which is the current popover element in the page
            this means the click has happened outside the current popover
            so the current popover should be closed */
        else if(ele.classList.contains('popoverWrapper') && window.LytePopup.components.length > 1 && window.LytePopup.components[window.LytePopup.components.length -1].$node.tagName == "LYTE-POPOVER"){
            var comp = window.LytePopup.components[window.LytePopup.components.length -1];
            var dropdowns = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()(comp.childComp).find('lyte-dropdown')
            var dontClose = false;
            if(dropdowns[0]){
                for(var i = 0;i<dropdowns.length;i++){
                    if(dropdowns[i]){
                        if(dropdowns[i].getData('ltPropIsOpen')){
                            dontClose = true
                        }
                    }
                }
            }
            if(!(comp.childComp.contains(ele)) && comp.getData('visible') && comp.getData('ltPropCloseOnBodyClick')){
                comp.setData('visible',false);
                comp.$node.ltProp('show',false);
            }
        }
    },true);

    window.addEventListener('scroll',function(event){    //This is for closing the dropdown when an outside area is clicked(CODE HELP)
       // console.log("called scroll");
       if(window.LytePopup.makingVisible) {
        window.LytePopup.makingVisible = false;
        return;
       }
        var wormhole;
        for(var i=window.LytePopup.components.length-1;i>=0;i--){
            if(window.LytePopup.components[i].$node && window.LytePopup.components[i].$node.nodeName == "LYTE-POPOVER" && window.LytePopup.components[i].childComp.style.visibility == "visible"){
                wormhole = window.LytePopup.components[i].childComp;
                if(window.LytePopup.components[i].data.ltPropCloseOnScroll){
                  window.LytePopup.components[i].setData('ltPropShow' , false);
                  return;
                }
                if(wormhole && wormhole._callee.component.$node.ltProp("scrollable")){
                    if(window.LytePopup.components[i].callOnScroll(event)){
                        var ele =  wormhole.querySelector('.lytePopover');
                        if(!ele/* || !wormhole._callee.ltProp('originElem')*/){
                            return ;
                        }
                        while(ele.tagName != 'LYTE-WORMHOLE'){
                            ele = ele.parentElement
                        }
                        var curscroll = event.target
                        // if(curscroll.nodeName == "#document"){     //This probably happens because scrollIntoView is used to focus the dropdown which is open at the start so the event.target is #document(CODE HELP)
                        //     return ;
                        // }
                        while(curscroll.tagName != "LYTE-WORMHOLE" && curscroll.tagName != 'HTML' && curscroll.nodeName != "#document"){
                            curscroll = curscroll.parentElement
                        }
                        if(curscroll.tagName == 'LYTE-WORMHOLE' && curscroll.isEqualNode(ele)){
                            return ;
                        }
                        // console.log("didnt return");
                        ele._callee.component.computeOffsetImpl();
                        if(ele._callee.component.getData('ltPropForceScroll')){
                            continue;
                        }

                        var par = document.querySelector(ele._callee.ltProp('originElem'));
                        var screl = event.target
                        var pbcr = par.getBoundingClientRect();

                        var boundary = ele._callee.ltProp("boundary");
                        var popoverElem = ele.querySelector('.lytePopover');
                        var windowSpacing = ele._callee.getData('ltPropWindowSpacing') || {};
                        if(!windowSpacing.top){
                            windowSpacing.top = 0
                        }
                        if(!windowSpacing.bottom){
                            windowSpacing.bottom = 0
                        }
                        if(!windowSpacing.right){
                            windowSpacing.right = 0
                        }
                        if(!windowSpacing.left){
                            windowSpacing.left = 0
                        }
                        if(!(Object.keys(boundary).length === 0 && boundary.constructor === Object)){
                            if(boundary.top && popoverElem.getBoundingClientRect().top < parseFloat(boundary.top)){
                                ele._callee.ltProp('show',false);
                            }
                            else if(boundary.bottom && popoverElem.getBoundingClientRect().bottom > parseFloat(boundary.bottom)){
                                ele._callee.ltProp('show',false);
                            }
                            else if(boundary.left && popoverElem.getBoundingClientRect().left < parseFloat(boundary.left)){
                                ele._callee.ltProp('show',false);
                            }
                            else if(boundary.right && popoverElem.getBoundingClientRect().right > parseFloat(boundary.right)){
                                ele._callee.ltProp('show',false);
                            }
                        }
                        // console.log("for moving up",sbcr.top,pbcr.top)
                        // console.log("for moving down",(sbcr.top+sbcr.height),(pbcr.top+pbcr.height))
                        if(screl.contains(par)){
                            var arrowEle = ele.querySelector('#lytePopoverArrow');
                            if(arrowEle && arrowEle.classList.contains('lytePopoverArrowBottom') && ((pbcr.top+(pbcr.height/2)) > window.innerHeight)){
                                ele._callee.ltProp('show',false);
                            }
                            if((arrowEle &&
                                    (arrowEle.classList.contains('lytePopoverArrowLeft') || arrowEle.classList.contains('lytePopoverArrowRight')) &&
                                    ((arrowEle.getBoundingClientRect().bottom >= ele.querySelector('.lytePopover').getBoundingClientRect().bottom) ||
                                        (arrowEle.getBoundingClientRect().top <= ele.querySelector('.lytePopover').getBoundingClientRect().top))
                                )){
                                ele._callee.ltProp('show',false);
                            }
                            if(screl.nodeName == "#document"){     //This probably happens because scrollIntoView is used to focus the dropdown which is open at the start so the event.target is #document(CODE HELP)
                                // console.log("pbcr.top ==> ",pbcr.top,"   pbcr.bottom ==> ",pbcr.bottom);
                                var winH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                                var winW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                                if(pbcr.top < windowSpacing.top || (pbcr.bottom+3) >= (winH - windowSpacing.bottom)){
                                    ele._callee.ltProp('show',false);
                                }
                                // console.log("pbcr.left ==> ",pbcr.left,"   pbcr.right ==> ",pbcr.right);
                                if(pbcr.left < windowSpacing.left || (pbcr.right+3) >= (winW - windowSpacing.right)){
                                    ele._callee.ltProp('show',false);
                                }
                            }
                            else{
                                var sbcr = screl.getBoundingClientRect();
                                if((sbcr.top + windowSpacing.top) > pbcr.top || (sbcr.top + sbcr.height - windowSpacing.bottom) < (pbcr.top + pbcr.height)){
                                    ele._callee.ltProp('show',false);
                                }
                                if((sbcr.left + windowSpacing.left) > pbcr.left || (sbcr.left + sbcr.width - windowSpacing.right) < (pbcr.left + pbcr.width)){
                                    ele._callee.ltProp('show',false);
                                }
                            }
                        }

                    }
                }
            }
        }


    },true);

    window.addEventListener("resize",function(event){
        if(window.LytePopup._lytePopoverRTId){
            // console.log(LytePopup._lytePopoverRTId);
            clearTimeout(window.LytePopup._lytePopoverRTId);
            window.LytePopup._lytePopoverRTId = false;
        }
        for(var i = window.LytePopup.components.length - 1 ; i >= 0 ; i--){
          var thDiv = window.LytePopup.components[i].$node.component
          // if((thDiv.$node.ltProp("height") === "auto" || thDiv.$node.ltProp("width") === "auto")){
          //   thDiv.setData('modalElemWidth' , thDiv.actualModalDiv.getBoundingClientRect().width)
          //   thDiv.setData('modalElemHeight' , thDiv.actualModalDiv.getBoundingClientRect().height)
          // }
        }
        window.LytePopup._lytePopoverRTId = setTimeout(function(){
            for(var i = LytePopup.components.length - 1 ; i >= 0 ; i--){
                if(LytePopup.components[i].$node && LytePopup.components[i].$node.nodeName == "LYTE-POPOVER" && LytePopup.components[i].childComp.style.visibility == "visible" && LytePopup.components[i].childComp.querySelector('.lytePopover')){
                    LytePopup.components[i].$node.component.setData('resize', true);
                    LytePopup.components[i].$node.component.updateScrollHandling(event);

                    /*  Commented calling these functions from here and called them from inside updateScrollHandling
                        so that the functions gets called in a synchronised manner and doesnt overlap each other. */

                    // LytePopup.components[i].$node.component.computeOffsetImpl();
                    // LytePopup.components[i].$node.component.callOnResize(event);
                    // var origElemPosition = document.querySelector(LytePopup.components[i].$node.ltProp('originElem')).getBoundingClientRect();
                    // var winH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                    // if(origElemPosition.bottom + 3 >= winH){
                    //     LytePopup.components[i].$node.ltProp("show",false);
                    // }
                }
            }
            LytePopup._lytePopoverRTId = false;
        },100);
    },true);

};

/**
 * Renders a popover
 * @component lyte-popover
 * @version 1.0.0
 * @dependencies lyte-wormhole
 * @methods onBeforeShow,onShow,onBeforeClose,onClose,onResize,onScroll,onPositionChange
 * @utility alignPopover,calculateOffset,trapFocus
 */

class LytePopoverComponent extends _component_js__WEBPACK_IMPORTED_MODULE_1__.Component {
    constructor() {
        super();
    }

    data(arg1) {
        return Object.assign(super.data({
            //config from callee
            /**
             * @componentProperty {boolean} ltPropShow
             * @version 1.0.0
             * @default false
             *
             */
            "ltPropShow":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean",{"default": false}),

            /**
             * @componentProperty {callout|box} ltPropType
             * @version 1.0.0
             * @default callout
             */
            "ltPropType":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("string",{"default":"callout"}),

            /**
             * @componentProperty {boolean} ltPropFreeze
             * @version 1.0.0
             * @default true
             *
             */
            "ltPropFreeze":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean",{"default": true}),

            /**
             * @componentProperty {boolean} ltPropShowCloseButton
             * @version 1.0.0
             * @default true
             *
             */
            "ltPropShowCloseButton":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean",{"default": true}),

            /**
             * @componentProperty {boolean} ltPropCloseOnEscape
             * @version 1.0.0
             * @default true
             *
             */
            "ltPropCloseOnEscape":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean",{"default": true}),

            /**
             * @componentProperty {string} ltPropOriginElem
             * @version 1.0.0
             */
            "ltPropOriginElem":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("string",{"default":""}),

            /**
             * @experimental ltPropPosition
             */
            "ltPropPosition":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("string",{"default":"bottom"}),

            /**
             * @componentProperty {bottom|bottomLeft|bottomRight|top|topLeft|topRight|left|right} ltPropPlacement
             * @version 1.0.0
             */
            "ltPropPlacement":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("string",{"default":""}),

            /**
             * @typedef {object} dimmer
             * @property {colorstring} color
             * @property {string} opacity
             */
            /**
             * @componentProperty {dimmer} ltPropDimmer
             * @version 1.0.0
             */
            "ltPropDimmer":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("object",{"default":{}}),

            /**
             * @componentProperty {boolean} ltPropDraggable
             * @version 1.0.0
             * @default false
             *
             */
            "ltPropDraggable":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean",{"default": false}),

            /**
             * @componentProperty {boolean} ltPropAllowMultiple
             * @version 1.0.0
             * @default false
             *
             */
            "ltPropAllowMultiple":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean",{"default": false}),

            /**
             * @componentProperty {boolean} ltPropScrollable
             * @version 1.0.0
             * @default false
             *
             */
            "ltPropScrollable":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean",{"default": false}),

            /**
             * @componentProperty {string} ltPropMaxHeight
             * @version 1.0.0
             * @suffix px,pt,cm,mm,vh,vm,em
             */
            "ltPropMaxHeight":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("string",{"default":""}),

            /**
             * @componentProperty {string} ltPropMaxWidth
             * @version 1.0.0
             * @suffix px,pt,cm,mm,vh,vm,em
             */
            "ltPropMaxWidth":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("string",{"default":""}),

            /**
             * @componentProperty {string} ltPropWidth
             * @version 1.0.0
             * @suffix px,pt,cm,mm,vh,vm,em
             */
            "ltPropWidth":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("string",{"default":""}),

            /**
             * @componentProperty {string} ltPropHeight
             * @version 1.0.0
             * @suffix px,pt,cm,mm,vh,vm,em
             */
            "ltPropHeight":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("string",{"default":"auto"}),

            /**
             * @componentProperty {string} ltPropWrapperClass
             * @version 1.0.0
             */
            "ltPropWrapperClass":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("string",{"default":""}),
            /**
             * @typedef {object} boundary
             * @property {string} left
             * @property {string} right
             * @property {string} top
             * @property {string} bottom
             */
            /**
             * @componentProperty {boundary} ltPropBoundary
             * @version 1.0.0
             * @default {}
             */
            "ltPropBoundary" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("object",{"default":{}}),

            /**
             * @componentProperty {boolean} ltPropCloseOnBodyClick
             * @version 1.0.0
             * @default true
             *
             */
            "ltPropCloseOnBodyClick" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean",{"default" : true}),

            /**
             * @componentProperty {number} ltPropDuration
             * @version 1.0.0
             * @default 400
             */
            "ltPropDuration" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("number",{"default" : 400}),
            /**
             * @typedef {object} popoverOffset
             * @property {string} top
             * @property {string} left
             * @property {string} bottom
             * @property {string} right
             * @property {string} height
             * @property {string} width
             */
            /**
             * @componentProperty {object} ltPropOffset
             * @version 1.0.0
             */
            "ltPropOffset" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("object",{"default" : {}}),


            /**
              * @componentProperty {object} ltPropOffsetFromTarget
            */
            "ltPropOffsetFromTarget" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("object" , {"default" : {}}),


            /**
             * @componentProperty {boolean} ltPropBindToBody
             * @version 1.0.0
             * @default false
             *
             */
            "ltPropBindToBody" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean",{"default":false}),

            /**
             * @componentProperty {string} ltPropHeaderPadding
             * @version 1.0.0
             * @default ""
             */
            "ltPropHeaderPadding":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("string",{"default":""}),

            /**
             * @componentProperty {string} ltPropContentPadding
             * @version 1.0.0
             * @default ""
             */
            "ltPropContentPadding":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("string",{"default":""}),

            /**
             * @componentProperty {string} ltPropFooterPadding
             * @version 1.0.0
             * @default ""
             */
            "ltPropFooterPadding":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("string",{"default":""}),

            /**
             * @componentProperty {fade|zoom} ltPropAnimation
             * @version 2.1.0
             * @default fade
             */
            "ltPropAnimation":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("string",{"default":"fade"}), //fade,zoom
            /**
             * @typedef {object} windowspacing
             * @property {number} top
             * @property {number} left
             * @property {number} bottom
             * @property {number} right
             */
            /**
             * @componentProperty {object} ltPropWindowSpacing
             * @version 2.1.1
             * @default { "top" : "30","left" : "30","bottom":"30","right" : "30"}
             */
            "ltPropWindowSpacing":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("object"),

            /**
             * @componentProperty {boolean} ltPropForceScroll
             * @version 2.2.14
             * @default false
             *
             */
            "ltPropForceScroll" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('boolean', { default : false }),

            /**
             * @componentProperty {boolean} ltPropAutoAlign
             * @version 2.2.15
             * @default false
             *
             */
            "ltPropAutoAlign" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('boolean', {default : false}),

            /**
             * @componentProperty {boolean} ltPropAria
             * @version 3.1.0
             * @default false
             *
             */
            "ltPropAria" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'boolean', { default : false } ),

            /**
             * @componentProperty {object} ltPropAriaAttributes
             * @version 3.1.0
             */
            "ltPropAriaAttributes" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'object', { default : {} } ),

            /**
             * @componentProperty {boolean} ltPropPreventFocus
             * @version 3.2.0
             * @default false
             *
             */
            "ltPropPreventFocus" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('boolean', { default : false } ),

            /**
             * @componentProperty {boolean} ltPropStopClick
             * @version 3.13.0
             * @default false
             *
             */
            "ltPropStopClick" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('boolean', {default : false}),

            "ltPropIgnoreBoundary" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('boolean' , {default : false}),

            "ltPropMargin" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('object'),

            "ltPropCloseOnScroll" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('boolean' , {
              default : false
            }),

            /**
             * @componentProperty {boolean} ltPropAllowContainment
             * @version 3.66.0
             * @default false
             *
             */

            "ltPropAllowContainment" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('boolean' , {
                default : false
            }),
            "ltPropIgnoreInput" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('boolean' , {
                default : false
            }),
            "ltPropFocusOnClose" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('boolean' , {
                default : false
            }),
            //local properties
            "ltPropShowWormhole" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('boolean' , {
                default : false
            }),
            

            "buttons":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("array",{"default":[{"type":"accept","text":"Ok"}]}),
            "ltPropShowCopy":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean",{"default": false}),
            "visible" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean",{"default" : true}),
            "timeOutId" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("number"),
            "classTobeAdded" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("string"),
            "keys" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("object", {"default" : {37: 1, 38: 1, 39: 1, 40: 1}}),
            "first" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean",{"default":true}),
            "arrowHidden" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean", {"default" : false}),
            "arrowEle" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("object"),
            "returnedFalse" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean",{"default":false}),
            "transformOrigin" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("string"),
            "windowSpacing" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("object"),
            "lyteUnbound": (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'boolean', { 'default': false } ),
            "prevOffsetVal": (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("object"),
            "calculateHW": (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean", {'default': false}),
            "checkAria" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("number", {"default":0}),
            "prevRect" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("object", {'default' : undefined}),
            "margin" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("object"),
            "modalElemWidth" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('string', {"default" : ''}),
            "modalElemHeight" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('string', {"default" : ''}),
            "dragRunning" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('boolean' , {"default" : false})
        }), arg1);
    }

    addDragHandler() {
        var dragHeader = this.actualModalDiv.querySelector('lyte-popover-header');
        if(dragHeader){
            dragHeader.parentEle = this;
            if(this.$node.ltProp("draggable")){
                dragHeader.addEventListener('mousedown',this.handleMove,true);
                dragHeader.addEventListener('touchstart',this.handleMove,true);
                dragHeader.classList.add('lytePopoverHeaderDraggable');
            }
            else{
                dragHeader.removeEventListener('mousedown',this.handleMove,true);
                dragHeader.removeEventListener('touchstart',this.handleMove,true);
                dragHeader.classList.remove('lytePopoverHeaderDraggable');
            }
        }
        else{
            console.warn("This popover is not draggable because it has no header");
            this.$node.ltProp("draggable",false);
        }
    }

    handleMove(e) {
        var drag = e.currentTarget.parentEle.actualModalDiv;
        window.LytePopup.node=drag;
        _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()(e.target).addClass('lytePopoverDragRunning')
        if(e.type == "mousedown"){
            LytePopup.xPos=e.clientX-this.getBoundingClientRect().left;
            LytePopup.yPos=e.clientY-this.getBoundingClientRect().top;
        }
        else if(e.type == "touchstart"){
            LytePopup.xPos=e.touches[0].clientX-this.getBoundingClientRect().left;
            LytePopup.yPos=e.touches[0].clientY-this.getBoundingClientRect().top;
        }
        var elePos = drag.getBoundingClientRect();
        drag.style.transitionDuration = "0s";
        var arrowEle = drag.parentElement.querySelector("#lytePopoverArrow");
        if(arrowEle){
            this.parentEle.setData('arrowHidden',true);
            this.parentEle.setData('arrowEle',arrowEle);
            arrowEle.style.display = "none";
        }
        if(e.type == "mousedown"){
            window.addEventListener('mousemove',e.currentTarget.parentEle.handleDrag,true);
            window.addEventListener('mouseup',e.currentTarget.parentEle.stopDrag,true);
        }
        else if(e.type == "touchstart"){
            document.body.addEventListener('touchmove',e.currentTarget.parentEle.handleDrag,true);
            document.body.addEventListener('touchend',e.currentTarget.parentEle.stopDrag,true);
        }
    }

    handleDrag(e) {
        var drag = window.LytePopup.node;
        var curComp = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()(drag).closest('lyte-wormhole')[0]._callee
        curComp.setData('dragRunning' , true);
        
        var curleft = 0
        var curtop = 0

        if(e.type == "mousemove"){
            curleft = e.clientX-drag.offsetParent.getBoundingClientRect().left - window.LytePopup.xPos
            curtop = e.clientY-drag.offsetParent.getBoundingClientRect().top  - window.LytePopup.yPos
        }
        else if(e.type == "touchmove"){
            curleft = e.touches[0].clientX-drag.offsetParent.getBoundingClientRect().left-window.LytePopup.xPos
            curtop = e.touches[0].clientY-drag.offsetParent.getBoundingClientRect().top-window.LytePopup.yPos
        }

        if(!curComp.getData('ltPropAllowContainment')){
            drag.style.left = curleft + 'px'
            drag.style.top = curtop + 'px'
        } else {
            if(curleft + drag.getBoundingClientRect().width <= window.innerWidth && (curleft >= 0)){
                drag.style.left = curleft + 'px';
            }else if(curleft < 0){
                drag.style.left = "0px";
            } else {
                drag.style.left = ( window.innerWidth - drag.getBoundingClientRect().width ) + 'px';
            }
    
            if(curtop + drag.getBoundingClientRect().height <= window.innerHeight && (curtop >= 0)){
                drag.style.top = curtop + 'px';
            }else if(curtop < 0){
                drag.style.top = "0px";
            } else {
                drag.style.top = ( window.innerHeight - drag.getBoundingClientRect().height ) + 'px';
            }
        }

     

        window.getSelection().removeAllRanges();
    }

    stopDrag(e) {
        var targetElem = e.target;
        if(!_lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()(targetElem).hasClass('lytePopoverDragRunning')){
            targetElem = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()('.lytePopoverDragRunning')[0]
        }
        var drag = window.LytePopup.node;
        var curComp = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()(drag).closest('lyte-wormhole')[0]._callee
        while(targetElem && targetElem !== document){
            if(targetElem.parentEle){
                if(e.type == "mouseup"){
                    window.removeEventListener('mousemove',targetElem.parentEle.handleDrag,true);
                    window.removeEventListener('mouseup',targetElem.parentEle.stopDrag,true);
                    curComp.setData('dragRunning' , false);
                    _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()('.lytePopoverDragRunning').removeClass('lytePopoverDragRunning');
                }
                else if(e.type == "touchend"){
                    this.removeEventListener('touchmove',targetElem.parentEle.handleDrag,true);
                    this.removeEventListener('touchend',targetElem.parentEle.stopDrag,true);
                    _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()('.lytePopoverDragRunning').removeClass('lytePopoverDragRunning');
                }
                break;
            }
            targetElem = targetElem.parentElement ? targetElem.parentElement : document;
        }
    }

    setRTLPosition() {
        var positions = this.getData('ltPropPlacement').trim().split(" ");
        if(positions.length > 1){
            var newPosition = "";
            for(var i = 0; i < positions.length; i++){
                newPosition += this.getRTLPosition(positions[i]) + " ";
            }
            this.setData('ltPropPlacement',newPosition.trim());
        }
        else{
            this.setData('ltPropPlacement', this.getRTLPosition(positions[0]));
        }
    }

    getRTLPosition(position) {
        if(position == "bottomLeft"){
            return "bottomRight";
        }
        else if(position == "bottomRight"){
            return "bottomLeft";
        }
        else if(position == "topLeft"){
            return "topRight";
        }
        else if(position == "topRight"){
            return "topLeft";
        }
        else if(position == "left"){
            return "right";
        }
        else if(position == "right"){
            return "left";
        }
        return position;
    }

    clearFastdomBatch() {
        if(this.fastdomfn1){
            _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.clear(this.fastdomfn1);
            delete this.fastdomfn1;
        }
        if(this.fastdomfn2){
            _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.clear(this.fastdomfn2);
            delete this.fastdomfn2;
        }
        if(this.fastdomfn3){
            _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.clear(this.fastdomfn3);
            delete this.fastdomfn3;
        }
        if(this.fastdomfn4){
            _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.clear(this.fastdomfn4);
            delete this.fastdomfn4;
        }
        if(this.fastdomfn5){
            _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.clear(this.fastdomfn5);
            delete this.fastdomfn5;
        }
        if(this.fastdomfn6){
            _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.clear(this.fastdomfn6);
            delete this.fastdomfn6;
        }
        if(this.fastdomfn7){
            _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.clear(this.fastdomfn7);
            delete this.fastdomfn7;
        }
        if(this.initCompute){
            clearTimeout(this.initCompute);
            delete this.initCompute;
        }
    }

    removeDOMReferences() {
        if(this.childComp){
            delete this.childComp;
        }
        if(this.actualModalDiv){
            delete this.actualModalDiv;
        }
    }

    callOnResize(event) {
        if(this.getMethods('onResize')){
            this.executeMethod('onResize',event,this);
        }
        var origElemPosition = this.getData('ltPropOriginElem') ? document.querySelector(this.$node.ltProp('originElem')).getBoundingClientRect() : null;
        if(!!origElemPosition){
            var winH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            var winW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            if( !(this.getData('ltPropForceScroll')) && ( (origElemPosition.bottom > winH) || (origElemPosition.right > winW) || (origElemPosition.left < 0) || (origElemPosition.top < 0) ) ){
                this.$node.ltProp("show",false);
            }
        }

    }

    callOnScroll(event) {
        var returnVal;
        if(this.getMethods('onScroll')){
            returnVal = this.executeMethod('onScroll',event,this);
        }
        return (returnVal == undefined ? true : returnVal);
    }

    /**
     * The method is going to set height and width to the popover
     *
     */
    updateScrollHandling(event) {   //Sets the height and width of the popover

        if(!this.$node.ltProp("freeze") && this.$node.ltProp("forceScroll")){
            this.$node.ltProp("scrollable",true);
        }
        var modalElem = this.actualModalDiv;
        var oldHeight, oldWidth, newHeight, newWidth,
        contentNode = modalElem.querySelector("lyte-popover-content");

        if(this.getData('resize') && this.getData('ltPropAutoAlign') && this.$node.mutobserver){
            this.$node.mutobserver.disconnect();
        }
        // contentNode = contentNode ? contentNode : modalElem;
        modalElem.style.maxWidth = "";
        modalElem.style.maxHeight = "";
        modalElem.style.height = this.$node.ltProp("height") ? this.$node.ltProp("height") : "auto";
        modalElem.style.width = this.$node.ltProp("width")?this.$node.ltProp("width"):"auto";
        if(this.getData('resize')){
          modalElem.style.width = this.getData('modalElemWidth') + "px"
          modalElem.style.height = this.getData('modalElemHeight') + "px"
        }
        /*------------------------------ MEASURE STARTS --------------------------*/
        this.fastdomfn1 = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.measure(function(){   //Measures the initial height and width based on the content of popover
            delete this.fastdomfn1;
            var modalElemOffset = modalElem.getBoundingClientRect();
            /*IF maxwidth or maxheigth given as a percentage then to calculate the actual width or height
                                we need the modalElements parent element's width and height*/
            var modalParentOff = modalElem.parentElement.getBoundingClientRect();
            /*var totalHeight = ((modalElem.querySelector('lyte-popover-header') ? modalElem.querySelector('lyte-popover-header').getBoundingClientRect().height : 0) +
                                    (modalElem.querySelector('lyte-popover-content') ? modalElem.querySelector('lyte-popover-content').getBoundingClientRect().height : 0) +
                                        (modalElem.querySelector('lyte-popover-footer') ? modalElem.querySelector('lyte-popover-footer').getBoundingClientRect().height : 0))*/
            var cs = window.getComputedStyle(modalElem);
            var borderDimensionY = ((cs.borderTopWidth ? parseFloat(cs.borderTopWidth) : 0) +
                                     (cs.borderBottomWidth ? parseFloat(cs.borderBottomWidth) : 0));
            var windowSpacing = this.getData('windowSpacing');
            var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - (windowSpacing.top + windowSpacing.bottom);
            /*------------------------------ MUTATE STARTS --------------------------*/
            this.fastdomfn2 = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.mutate(function(){  //Measures and sets the height and width based on the user provided max values
                delete this.fastdomfn2;
                if(this.$node.ltProp("maxWidth")){
                    // this.$node.ltProp("scrollable",true);
                    oldWidth = modalElemOffset.width;
                    // modalElem.style.width = this.$node.ltProp("maxWidth");
                    newWidth = this.$node.ltProp("maxWidth").indexOf('%') != -1 ? ((parseFloat(this.$node.ltProp("maxWidth"))/100) * modalParentOff.width) : parseFloat(this.$node.ltProp("maxWidth"));
                    // if(oldWidth < newWidth){
                    //     modalElem.style.width = oldWidth+"px";
                    //     newWidth = oldWidth;
                    // }
                    modalElem.style.maxWidth = this.$node.ltProp("maxWidth");
                    if(contentNode){
                        contentNode.style.overflowX = "auto";
                    }
                    else{
                        modalElem.style.overflowX = "auto";
                    }

                }
                // else{
                //     newWidth = modalElemOffset.width;
                // }

                if(this.$node.ltProp("maxHeight")/* && totalHeight >= parseInt(this.$node.ltProp("maxHeight"))*/){
                    this.childComp.querySelector(".popoverWrapper").classList.add("scrollable");
                    // this.$node.ltProp("scrollable",true);
                    this.setData("calculateHW",true);
                    oldHeight = modalElemOffset.height - borderDimensionY;
                    var newH = this.$node.ltProp("maxHeight").indexOf('%') != -1 ? ((parseFloat(this.$node.ltProp("maxHeight"))/100) * modalParentOff.height) : parseFloat(this.$node.ltProp("maxHeight"));
                    modalElem.style.maxHeight = this.$node.ltProp("maxHeight");
                    newHeight = newH - borderDimensionY;
                    if(!contentNode){
                        modalElem.style.overflowY = "auto";
                    }
                }
                else{
                    oldHeight = modalElemOffset.height - borderDimensionY;
                    /*  If height is provided in px or em then we dont compare if it is greater than window height as it is fixed
                        And also we add a maxHeight to the content div so that if the elements inside the content is increased
                        there wont be any issue in popover size as we have a fixed max height for popover.  */
                    if(this.$node.ltProp('height') && ((this.$node.ltProp('height')).indexOf('px') != -1 || (this.$node.ltProp('height')).indexOf('em') != -1)){
                        newHeight = oldHeight;
                        this.setData("calculateHW",true);
                    }
                    else{
                        newHeight = h-20;
                    }
                }

                if(this.getData("calculateHW") && contentNode){
                    var popoverHeader = this.actualModalDiv.querySelector("lyte-popover-header"), popoverFooter = this.actualModalDiv.querySelector("lyte-popover-footer");
                    var popoverHOff = 0,popoverFOff = 0;
                    /*------------------------------ MEASURE STARTS --------------------------*/
                    this.fastdomfn3 = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.measure(function(){    //Measures the heaser and footer dimensions
                        delete this.fastdomfn3;
                        if(popoverHeader){
                            if(this.$node.ltProp("maxWidth")){
                                popoverHeader.style.overflowX = "auto";
                            }
                            popoverHOff = popoverHeader.offsetHeight;
                        }
                        if(popoverFooter){
                            if(this.$node.ltProp("maxWidth")){
                                popoverFooter.style.overflowX = "auto";
                            }
                            popoverFOff = popoverFooter.offsetHeight;
                        }
                        /*------------------------------ MUTATE STARTS --------------------------*/
                        this.fastdomfn4 = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.mutate(function(){   //Sets the final height and width of the popover
                            delete this.fastdomfn4;
                            var newH = (newHeight - (popoverHOff + popoverFOff));
                            contentNode.style.maxHeight = (newH > 0 ? newH : 50) +"px";
                            contentNode.style.overflowY = "auto";
                            // if(this.getData('ltPropHeight')){
                            //     contentNode.style.height = (oldHeight - (popoverHOff + popoverFOff))+"px";
                            // }
                            // else{
                            //     contentNode.style.height = "auto";
                            // }
                            // modalElem.style.width = this.$node.ltProp("width")?this.$node.ltProp("width"):"auto";
                            // modalElem.style.maxWidth = newWidth > 0 ? (newWidth +"px"):("70%");

                            /*  Moved the calling of computeOffsetImpl function from here during resize so that
                                the height and width calculation of the popover is completed and then we can position the popover.  */
                            if(this.getData('resize')){
                                // if(this.getData('ltPropAutoAlign') && this.$node.mutobserver){
                                //     this.$node.mutobserver.disconnect();
                                // }
                                this.computeOffsetImpl(event);
                            }

                            /* Checks and adds mutation observer */
                            // this.addMutationObserver();
                            modalElem = null;
                            contentNode = null;
                            popoverHeader = null;
                            popoverFooter = null;
                        },this);
                        /*------------------------------ MUTATE ENDS --------------------------*/
                    },this);
                    /*------------------------------ MEASURE ENDS --------------------------*/
                }
                else{
                    this.childComp.querySelector(".popoverWrapper").classList.remove("scrollable");
                    /*  Moved the calling of computeOffsetImpl function from here during resize so that
                        the height and width calculation of the popover is completed and then we can position the popover.  */
                    if(this.getData('resize')){
                        // if(this.getData('ltPropAutoAlign') && this.$node.mutobserver){
                        //     this.$node.mutobserver.disconnect();
                        // }
                        this.computeOffsetImpl(event);
                    }
                    /* Checks and adds mutation observer */
                    // this.addMutationObserver();
                    modalElem = null;
                    contentNode = null;
                }
            },this);
            /*------------------------------ MUTATE ENDS --------------------------*/
        },this);
        /*------------------------------ MEASURE ENDS --------------------------*/
    }

    // Mutation observer
    addMutationObserver() {
        if(this.getData('ltPropAutoAlign')){
            var popover = this.$node,
            targetNode = this.actualModalDiv, reAlign, config;
            this.setData('prevOffsetVal', {
                    height : this.actualModalDiv.offsetHeight,
                    width : this.actualModalDiv.offsetWidth
                });
            popover.mutobserver = new window.MutationObserver( function( mutations ) {
                if(this.getData('ltPropAutoAlign')){
                    var popoverElem = this.actualModalDiv;
                    var prevOffsetVal = this.getData('prevOffsetVal');
                    var offsetWidth = popoverElem.offsetWidth;
                    var offsetHeight = popoverElem.offsetHeight;
                    for( var i = 0; i < mutations.length; i++ ) {
                        // console.log(mutations[ i ].type + " ====== " + mutations[i].attributeName);
                        if( ((mutations[ i ].type === 'attributes')/* && mutations[ i ].attributeName === 'style'*/) || mutations[i].type == 'childList' || mutations[i].type == 'subtree' ) {
                            if(prevOffsetVal.width != offsetWidth || prevOffsetVal.height != offsetHeight){
                                reAlign = true;
                                this.setData('prevOffsetVal', {
                                    height : offsetHeight,
                                    width : offsetWidth
                                })
                                break;
                            }
                        }
                    }
                    if(reAlign){
                        reAlign = false;
                        this.computeOffsetImpl(null, true);
                    }
                }
            }.bind( this ) );

            config = {
                attributes: true,
                childList : true,
                subtree: true
                // attributeFilter: ['style', 'class']
            };

            popover.mutobserver.observe( targetNode, config );
            // Mutation observer ends
        }
    }

    /**
     * The method is going to do left and top computation and add it to the popover when it is opened
     *
     */
    computeOffsetImpl(event, reAlign) {
        var lyteSelf = this;
        var classTobeAdded = "", offsetLeft="",offsetTop="";
        var modalEle = this.actualModalDiv;
        // modalEle.classList.remove('lytePopoverCenter','lytePopoverBottomCenter','lytePopoverBottomLeft','lytePopoverBottomRight','lytePopoverTopCenter','lytePopoverTopLeft','lytePopoverTopRight','lytePopoverLeft','lytePopoverRight');
        // modalEle.style.left = "";
        // modalEle.style.top = "";
        /*------------------------------ MEASURE STARTS --------------------------*/
        _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.measure(function(){
            if(this.$node.ltProp("showCopy")){
                if(this.$node.ltProp('originElem') != "" || !(lyteSelf.$component.registeredHelpers.lyteUiIsEmptyObject(this.$node.ltProp('offset')))){
                    var ele = this.$node.ltProp('originElem') ? document.querySelector(this.$node.ltProp('originElem')) : null;
                    if(!ele && lyteSelf.$component.registeredHelpers.lyteUiIsEmptyObject(this.$node.ltProp('offset'))){
                        console.error("The origin element is either not present or may be removed. Kindly check.")
                        this.setData('ltPropShow',false);
                        return;
                    }
                    var modalElemOffset = modalEle.getBoundingClientRect();
                    var modalElePosition = {top: modalElemOffset.top,
                                            right: modalElemOffset.right,
                                            bottom: modalElemOffset.bottom,
                                            left: modalElemOffset.left,
                                            width: modalEle.offsetWidth,
                                            height: modalEle.offsetHeight
                                           };
                    // var xscroll = window.pageXOffset || document.documentElement.scrollLeft;
                    // var yscroll = window.pageYOffset || document.documentElement.scrollTop;
                    var wrapperOffset = modalEle.parentElement.getBoundingClientRect();
                    var windowSpacing = Object.assign({},this.getData('windowSpacing'));
                    var bodyHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - windowSpacing.bottom;
                    var bodyWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - windowSpacing.right;
                    var origElemPosition;
                    if(lyteSelf.$component.registeredHelpers.lyteUiIsEmptyObject(this.$node.ltProp('offset'))){  //If origin element is present and there is no ltPropOffset
                        var eleOffset = ele.getBoundingClientRect();
                        origElemPosition = {
                                              top: eleOffset.top,
                                              right: eleOffset.right,
                                              bottom: eleOffset.bottom,
                                              left: eleOffset.left,
                                              width: eleOffset.width,
                                              height: eleOffset.height
                                            };
                    }
                    else{   //if ltPropOffset has value
                        origElemPosition = {
                                              width:parseInt(this.$node.ltProp('offset').width) || 0,
                                              height:parseInt(this.$node.ltProp('offset').height) || 0,
                                              top:parseInt(this.$node.ltProp('offset').top),
                                              left:parseInt(this.$node.ltProp('offset').left),
                                              bottom:(parseInt(this.$node.ltProp('offset').bottom) || parseInt(this.$node.ltProp('offset').top) + (parseInt(this.$node.ltProp('offset').height) || 0)),
                                              right:(parseInt(this.$node.ltProp('offset').right) || parseInt(this.$node.ltProp('offset').left) + (parseInt(this.$node.ltProp('offset').width) || 0))
                                            }
                    }
                    // if(!this.getData('ltPropFreeze')){
                    //     origElemPosition.top = origElemPosition.top + yscroll;
                    //     origElemPosition.left = origElemPosition.left + xscroll;
                    // }
                    var elementPosition = origElemPosition;
                    var offObj = {}, newOffObj = {};
                    var position =  this.$node.ltProp('positionNew');
                    var flag = true;
                    var count = 0,
                    index = 0,
                    props;
                    do{
                        if(this.$node.ltProp('placement')/* && !this.$node.ltProp('freeze')*/){
                            props = this.$node.ltProp('placement').trim().split(" ");
                            if(props.length == 1){
                                flag = true;
                                offObj = this.positionPopover(this.$node.ltProp('placement'),elementPosition,modalElePosition);
                                position = this.$node.ltProp('placement');
                                switch(position){
                                    case 'bottom':
                                    case 'top':
                                        if(offObj.offsetLeft+modalElePosition.width > bodyWidth){
                                            offObj.offsetLeft = Math.max(windowSpacing.left, bodyWidth - modalElePosition.width);
                                        }
                                        if(offObj.offsetLeft < windowSpacing.left){
                                            offObj.offsetLeft = windowSpacing.left;
                                        }
                                        break;
                                    case 'left':
                                    case 'right':
                                        if(offObj.offsetTop+modalElePosition.height > bodyHeight){
                                            offObj.offsetTop = Math.max(windowSpacing.top, bodyHeight - modalElePosition.height)/*origElemPosition.bottom - modalElePosition.height*/;
                                        }
                                        if(offObj.offsetTop < windowSpacing.top){
                                            offObj.offsetTop = windowSpacing.top;
                                        }
                                        break;
                                }
                            }
                            else{
                                if(index < props.length){
                                    position = props[index];
                                    flag = true;
                                    offObj = this.positionPopover(position,elementPosition,modalElePosition);
                                    newOffObj = offObj;
                                    switch(position){
                                        case 'bottom':
                                            if(bodyHeight < (newOffObj.offsetTop+modalElePosition.height) || (bodyHeight - (newOffObj.offsetTop+modalElePosition.height)) < windowSpacing.bottom){
                                                index++;
                                                flag = false;
                                                break;
                                            }

                                            if((newOffObj.offsetLeft-modalElePosition.width) < windowSpacing.left /*0*/){
                                                offObj.offsetLeft = elementPosition.left;
                                                flag = true;
                                            }
                                            if(bodyWidth < (offObj.offsetLeft+modalElePosition.width)){
                                                offObj.offsetLeft = bodyWidth - modalElePosition.width - 10;
                                                flag = true;
                                            }
                                            break;
                                        case 'bottomLeft':
                                            if(bodyHeight < (newOffObj.offsetTop+modalElePosition.height) || (bodyHeight - (newOffObj.offsetTop+modalElePosition.height)) < windowSpacing.bottom){
                                                index++;
                                                flag = false;
                                                break;
                                            }

                                            if((newOffObj.offsetLeft-modalElePosition.width) < windowSpacing.left /*0*/){
                                                offObj.offsetLeft = elementPosition.left;
                                                flag = true;
                                            }
                                            if(bodyWidth < (newOffObj.offsetLeft+modalElePosition.width)){
                                                offObj.offsetLeft = bodyWidth - modalElePosition.width - 10;
                                                flag = true;
                                            }
                                            break;
                                        case 'bottomRight':
                                            if(bodyHeight < (newOffObj.offsetTop+modalElePosition.height) || (bodyHeight - (newOffObj.offsetTop+modalElePosition.height)) < windowSpacing.bottom){
                                                index++;
                                                flag = false;
                                                break;
                                            }

                                            if((newOffObj.offsetLeft-modalElePosition.width) < windowSpacing.left /*0*/){
                                                offObj.offsetLeft = elementPosition.left;
                                                flag = true;
                                            }
                                            if(bodyWidth < (newOffObj.offsetLeft+modalElePosition.width)){
                                                offObj.offsetLeft = bodyWidth - modalElePosition.width - 10;
                                                flag = true;
                                            }
                                            break;
                                        case 'top':
                                            if(newOffObj.offsetTop < windowSpacing.top /*0*/){
                                                index++;
                                                flag = false;
                                                break;
                                            }

                                            if((newOffObj.offsetLeft-modalElePosition.width) < windowSpacing.left /*0*/){
                                                offObj.offsetLeft = elementPosition.left;
                                                flag = true;
                                            }
                                            if(bodyWidth < (offObj.offsetLeft+modalElePosition.width)){
                                                offObj.offsetLeft = bodyWidth - modalElePosition.width - 10;
                                                flag = true;
                                            }
                                            break;
                                        case 'topLeft':
                                            if(newOffObj.offsetTop < windowSpacing.top /*0*/){
                                                index++;
                                                flag = false;
                                                break;
                                            }

                                            if((newOffObj.offsetLeft-modalElePosition.width) < windowSpacing.left /*0*/){
                                                offObj.offsetLeft = elementPosition.left;
                                                flag = true;
                                            }
                                            if(bodyWidth < (newOffObj.offsetLeft+modalElePosition.width)){
                                                offObj.offsetLeft = bodyWidth - modalElePosition.width - 10;
                                                flag = true;
                                            }
                                            break;
                                        case 'topRight':
                                            if(newOffObj.offsetTop < windowSpacing.top /*0*/){
                                                index++;
                                                flag = false;
                                                break;
                                            }

                                            if((newOffObj.offsetLeft-modalElePosition.width) < windowSpacing.left /*0*/){
                                                offObj.offsetLeft = elementPosition.left;
                                                flag = true;
                                            }
                                            if(bodyWidth < (newOffObj.offsetLeft+modalElePosition.width)){
                                                offObj.offsetLeft = bodyWidth - modalElePosition.width - 10;
                                                flag = true;
                                            }
                                            break;
                                        case 'left':
                                            if(newOffObj.offsetTop < windowSpacing.top){
                                                index++;
                                                flag = false;
                                                break;
                                            }
                                            if(newOffObj.offsetLeft < windowSpacing.left /*0*/){
                                                index++;
                                                flag = false;
                                                offsetLeft = (elementPosition.left + elementPosition.width)+9;
                                                offsetTop = elementPosition.top;
                                                break;
                                            }
                                            if((newOffObj.offsetTop-modalElePosition.height) < windowSpacing.top /*0*/ ){
                                                offObj.offsetTop = elementPosition.top;
                                            }
                                            if(bodyHeight < (offObj.offsetTop+modalElePosition.height)){
                                                offObj.offsetTop = bodyHeight - modalElePosition.height;
                                            }
                                            break;
                                        case 'leftCenter':
                                        case 'leftBottom':
                                            if(newOffObj.offsetTop < windowSpacing.top){
                                                index++;
                                                flag = false;
                                                break;
                                            }
                                            if(newOffObj.offsetLeft < windowSpacing.left /*0*/){
                                                index++;
                                                flag = false;
                                                break;
                                            }
                                            if(bodyHeight < (offObj.offsetTop+modalElePosition.height)){
                                                index++;
                                                flag = false;
                                                break;
                                            }
                                            break;
                                        case 'right':
                                            if(newOffObj.offsetTop < windowSpacing.top){
                                                index++;
                                                flag = false;
                                                break;
                                            }
                                            if(bodyWidth < (newOffObj.offsetLeft+modalElePosition.width)){
                                                index++;
                                                flag = false;
                                                offObj.offsetLeft = (elementPosition.left - modalElePosition.width)-9;
                                                offObj.offsetTop = elementPosition.top;
                                                break;
                                            }
                                            if((newOffObj.offsetTop-modalElePosition.height) < windowSpacing.top /*0*/ ){
                                                offObj.offsetTop = elementPosition.top;
                                            }
                                            if(bodyHeight < (offObj.offsetTop+modalElePosition.height)){
                                                offObj.offsetTop = bodyHeight - modalElePosition.height;
                                            }
                                        break;
                                        case 'rightCenter':
                                        case 'rightBottom':
                                            if(newOffObj.offsetTop < windowSpacing.top){
                                                index++;
                                                flag = false;
                                                break;
                                            }
                                            if(bodyWidth < (newOffObj.offsetLeft+modalElePosition.width)){
                                                index++;
                                                flag = false;
                                                break;
                                            }
                                            if(bodyHeight < (offObj.offsetTop+modalElePosition.height)){
                                                index++;
                                                flag = false;
                                                break;
                                            }
                                        break;
                                    }
                                }
                                else{
                                    flag = true;
                                }
                            }
                        }
                        else{
                           count++;
                            flag = true;
                            offObj = this.positionPopover(position,elementPosition,modalElePosition);
                            // if(!this.$node.ltProp('freeze')){
                            //     newOffObj.offsetTop = origElemPosition.top/* + origElemPosition.height*/;
                            //     newOffObj.offsetLeft = origElemPosition.left/* + origElemPosition.width*/;
                            // }
                            // else{
                                newOffObj = offObj;
                            // }
                            switch(position){
                                case 'bottom':
                                    if(bodyHeight < (newOffObj.offsetTop+modalElePosition.height) || (bodyHeight - (newOffObj.offsetTop+modalElePosition.height)) < windowSpacing.bottom){
                                        position = "top";
                                        flag = false;
                                        break;
                                    }

                                    if((newOffObj.offsetLeft-modalElePosition.width) < windowSpacing.left /*0*/){
                                        offObj.offsetLeft = elementPosition.left + (this.getData('ltPropOffsetFromTarget').left || 0);
                                        flag = true;
                                    }
                                    if(bodyWidth < (offObj.offsetLeft+modalElePosition.width)){
                                        offObj.offsetLeft = bodyWidth - modalElePosition.width - (this.getData('ltPropType') == "box" ? 0 : 9);
                                        flag = true;
                                    }
                                    break;
                                case 'bottomLeft':
                                    if(bodyHeight < (newOffObj.offsetTop+modalElePosition.height) || (bodyHeight - (newOffObj.offsetTop+modalElePosition.height)) < windowSpacing.bottom){
                                        position = "top";
                                        flag = false;
                                        break;
                                    }

                                    if((newOffObj.offsetLeft-modalElePosition.width) < windowSpacing.left /*0*/){
                                        offObj.offsetLeft = elementPosition.left;
                                        flag = true;
                                    }
                                    if(bodyWidth < (newOffObj.offsetLeft+modalElePosition.width)){
                                        offObj.offsetLeft = bodyWidth - modalElePosition.width - (this.getData('ltPropType') == "box" ? 0 : 9);
                                        flag = true;
                                    }
                                    break;
                                case 'bottomRight':
                                    if(bodyHeight < (newOffObj.offsetTop+modalElePosition.height) || (bodyHeight - (newOffObj.offsetTop+modalElePosition.height)) < windowSpacing.bottom){
                                        position = "top";
                                        flag = false;
                                        break;
                                    }

                                    if((newOffObj.offsetLeft-modalElePosition.width) < windowSpacing.left /*0*/){
                                        offObj.offsetLeft = elementPosition.left;
                                        flag = true;
                                    }
                                    if(bodyWidth < (newOffObj.offsetLeft+modalElePosition.width)){
                                        offObj.offsetLeft = bodyWidth - modalElePosition.width - (this.getData('ltPropType') == "box" ? 0 : 9);
                                        flag = true;
                                    }
                                    break;
                                case 'top':
                                    if(newOffObj.offsetTop < windowSpacing.top /*0*/){
                                        position = (window._lyteUiUtils.getRTL() ? "left" : "right");
                                        flag = false;
                                        break;
                                    }

                                    if((newOffObj.offsetLeft-modalElePosition.width) < windowSpacing.left /*0*/){
                                        offObj.offsetLeft = elementPosition.left;
                                        flag = true;
                                    }
                                    if(bodyWidth < (offObj.offsetLeft+modalElePosition.width)){
                                        offObj.offsetLeft = bodyWidth - modalElePosition.width - (this.getData('ltPropType') == "box" ? 0 : 9);
                                        flag = true;
                                    }
                                    break;
                                case 'topLeft':
                                    if(newOffObj.offsetTop < windowSpacing.top /*0*/){
                                        position = "right";
                                        flag = false;
                                        break;
                                    }

                                    if((newOffObj.offsetLeft-modalElePosition.width) < windowSpacing.left /*0*/){
                                        offObj.offsetLeft = elementPosition.left;
                                        flag = true;
                                    }
                                    if(bodyWidth < (newOffObj.offsetLeft+modalElePosition.width)){
                                        offObj.offsetLeft = bodyWidth - modalElePosition.width - (this.getData('ltPropType') == "box" ? 0 : 9);
                                        flag = true;
                                    }
                                    break;
                                case 'topRight':
                                    if(newOffObj.offsetTop < windowSpacing.top /*0*/){
                                        position = "left";
                                        flag = false;
                                        break;
                                    }

                                    if((newOffObj.offsetLeft-modalElePosition.width) < windowSpacing.left /*0*/){
                                        offObj.offsetLeft = elementPosition.left;
                                        flag = true;
                                    }
                                    if(bodyWidth < (newOffObj.offsetLeft+modalElePosition.width)){
                                        offObj.offsetLeft = bodyWidth - modalElePosition.width - (this.getData('ltPropType') == "box" ? 0 : 9);
                                        flag = true;
                                    }
                                    break;
                                case 'left':
                                    if(newOffObj.offsetTop < windowSpacing.top){
                                        position = "bottom";
                                        flag = false;
                                        break;
                                    }
                                    if(newOffObj.offsetLeft < windowSpacing.left /*0*/){
                                        position = "right";
                                        offObj.offsetLeft = (elementPosition.left + elementPosition.width)+(this.getData('ltPropType') == "box" ? 0 : 9);
                                        offObj.offsetTop = elementPosition.top;
                                    }
                                    if((newOffObj.offsetTop-modalElePosition.height) < windowSpacing.top /*0*/ ){
                                        offObj.offsetTop = elementPosition.top;
                                    }
                                    if(bodyHeight < (offObj.offsetTop+modalElePosition.height)){
                                        offObj.offsetTop = Math.max(windowSpacing.top, bodyHeight - modalElePosition.height) /*bodyHeight - modalElePosition.height*/;
                                    }
                                    break;
                                case 'right':
                                    if(newOffObj.offsetTop < windowSpacing.top){
                                        position = "bottom";
                                        flag = false;
                                        break;
                                    }
                                    if(bodyWidth < (newOffObj.offsetLeft+modalElePosition.width)){
                                        position = "left";
                                        offObj.offsetLeft = (elementPosition.left - modalElePosition.width)-(this.getData('ltPropType') == "box" ? 0 : 9);
                                        offObj.offsetTop = elementPosition.top;
                                    }
                                    if((newOffObj.offsetTop-modalElePosition.height) < windowSpacing.top /*0*/ ){
                                        offObj.offsetTop = elementPosition.top;
                                    }
                                    if(bodyHeight < (offObj.offsetTop+modalElePosition.height)){
                                        offObj.offsetTop = Math.max(windowSpacing.top, bodyHeight - modalElePosition.height) /*bodyHeight - modalElePosition.height*/;
                                    }
                                    break;
                            }

                            if(this.getData('ltPropIgnoreBoundary')){
                              flag = true
                            }

                        }

                    }while(!flag && count <= 8)
                    var positions = ["bottom","bottomLeft","bottomRight","top","topLeft","topRight","right","left"];
                    if(this.getData('ltPropForceScroll')){
                        if(position.indexOf("left") != -1 || position.indexOf("right") != -1){
                            if(elementPosition.height <= modalElePosition.height){
                                if(offObj.offsetTop > elementPosition.top){
                                    offObj.offsetTop = elementPosition.top;
                                }
                                else if(offObj.offsetTop+modalElePosition.height < elementPosition.bottom){
                                    offObj.offsetTop = elementPosition.bottom - modalElePosition.height;
                                }
                            }
                            else{
                                if(offObj.offsetTop < elementPosition.top){
                                    offObj.offsetTop = elementPosition.top;
                                }
                                else if(offObj.offsetTop+modalElePosition.height > elementPosition.bottom){
                                    offObj.offsetTop = elementPosition.bottom - modalElePosition.height;
                                }
                            }
                        }
                        else{
                            if(offObj.offsetLeft > elementPosition.left){
                                offObj.offsetLeft = elementPosition.left;
                            }
                            else if(offObj.offsetLeft+modalElePosition.width < elementPosition.right){
                                offObj.offsetLeft = elementPosition.right - modalElePosition.width;
                            }
                        }
                    }
                    offsetLeft = offObj.offsetLeft;
                    offsetTop = offObj.offsetTop;

                    if(this.$node.ltProp('type') === "callout"){
                        if(position.indexOf("bottom") > -1){
                            offObj.classTobeAdded = "lytePopoverArrowTop";
                            offObj.posClass = "lytePopBottomToOrig";
                        }
                        else if(position.indexOf("top") > -1){
                            offObj.classTobeAdded = "lytePopoverArrowBottom";
                            offObj.posClass = "lytePopTopToOrig";
                        }
                        else if(position.indexOf("left") > -1){
                             offObj.classTobeAdded = "lytePopoverArrowRight";
                             offObj.posClass = "lytePopLeftToOrig";
                        }
                        else if(position.indexOf("right") > -1){
                             offObj.classTobeAdded = "lytePopoverArrowLeft";
                             offObj.posClass = "lytePopRightToOrig";
                        }
                        var arrowIcon = modalEle.querySelector("#lytePopoverArrow");
                        arrowIcon.classList.remove("lytePopoverArrowTop","lytePopoverArrowBottom","lytePopoverArrowRight","lytePopoverArrowLeft");
                        arrowIcon.classList.add(offObj.classTobeAdded);
                        var arrowIconOffset;
                        if(!(modalEle.parentElement.classList.contains(offObj.posClass))){
                            modalEle.parentElement.classList.remove("lytePopBottomToOrig","lytePopTopToOrig","lytePopLeftToOrig","lytePopRightToOrig");
                            modalEle.parentElement.classList.add(offObj.posClass);
                        }
                        /*------------------------------ MEASURE STARTS --------------------------*/
                        _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.measure(function(){
                            arrowIconOffset = {height : arrowIcon.offsetHeight, width : arrowIcon.offsetWidth};
                        });
                        /*------------------------------ MEASURE ENDS --------------------------*/
                        /*------------------------------ MUTATE STARTS --------------------------*/
                        //Positions the arrowIcon of the popover and the popover too based on origin elem
                        _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.mutate(function(){   //If originElem -> height < arrowIcon -> height OR originElem -> width < arrowIcon -> width
                            var diagonal = Math.floor(Math.sqrt((arrowIconOffset.height * arrowIconOffset.height) + (arrowIconOffset.width * arrowIconOffset.width)) - 2) ;
                            if(offObj.classTobeAdded === "lytePopoverArrowTop" || offObj.classTobeAdded === "lytePopoverArrowBottom"){
                                var leftVal = Math.abs(offsetLeft - (elementPosition.left+(elementPosition.width-diagonal)/2));
                                arrowIcon.style.left = leftVal+"px";
                                arrowIcon.style.top = "";
                                if(leftVal < 13 && origElemPosition.width <= (diagonal+22) ){
                                    var diff = 13 - leftVal;
                                    // if(Math.round(origElemPosition.left) == Math.round(offsetLeft)/* && (offsetLeft - diff) >= 0*/){
                                        leftVal += diff;
                                        arrowIcon.style.left = leftVal + "px";
                                        offsetLeft -= diff;
                                    // }
                                }
                                else if(modalElePosition.width - (leftVal + diagonal) < 13 && origElemPosition.width <= (diagonal+22)){
                                    var diff = 13 - (modalElePosition.width - (leftVal + diagonal));
                                    // if(Math.round(origElemPosition.left + origElemPosition.width) == Math.round(modalElePosition.width + offsetLeft)){
                                        leftVal -= diff;
                                        arrowIcon.style.left = leftVal + "px";
                                        offsetLeft += diff;
                                    // }
                                }
                                if(leftVal > (modalElePosition.width - (2 * diagonal))){
                                    leftVal =  (modalElePosition.width - (2 * diagonal));
                                    arrowIcon.style.left = leftVal + "px";
                                }
                                if(offObj.classTobeAdded === "lytePopoverArrowTop"){
                                    this.setData('transformOrigin',Math.round(leftVal)+"px top");
                                }
                                if(offObj.classTobeAdded === "lytePopoverArrowBottom"){
                                    this.setData('transformOrigin',Math.round(leftVal)+"px bottom");
                                }
                            }
                            else{
                                var topVal = Math.abs(offsetTop - (elementPosition.top+(elementPosition.height-diagonal)/2));
                                arrowIcon.style.left = "";
                                arrowIcon.style.top = topVal +"px";
                                if(topVal < 13 && origElemPosition.height <= (diagonal+22) ){
                                    var diff = 13 - topVal;
                                    // if(Math.round(origElemPosition.top) == Math.round(offsetTop)/* && (offsetTop - diff) >= 0*/){
                                        topVal += diff;
                                        arrowIcon.style.top = topVal + "px";
                                        offsetTop -= diff;
                                    // }
                                }
                                else if(modalElePosition.height - (topVal + diagonal) < 13 && origElemPosition.height <= (diagonal+22)){
                                    var diff = 13 - (modalElePosition.height - (topVal + diagonal));
                                    // if(Math.round(origElemPosition.top + origElemPosition.height) == Math.round(modalElePosition.height + offsetTop)){
                                        topVal -= diff;
                                        arrowIcon.style.top = topVal + "px";
                                        offsetTop += diff;
                                    // }
                                }
                                if(offObj.classTobeAdded === "lytePopoverArrowLeft"){
                                    this.setData('transformOrigin',"left "+Math.round(topVal)+"px");
                                }
                                if(offObj.classTobeAdded === "lytePopoverArrowRight"){
                                    this.setData('transformOrigin',"right "+Math.round(topVal)+"px");
                                }
                            }
                        },this);
                        /*------------------------------ MUTATE ENDS --------------------------*/

                    }
                    else{
                        if(position.indexOf("bottom") > -1){
                            offObj.posClass = "lytePopBottomToOrig";
                        }
                        else if(position.indexOf("top") > -1){
                            offObj.posClass = "lytePopTopToOrig";
                        }
                        else if(position === "left"){
                             offObj.posClass = "lytePopLeftToOrig";
                        }
                        else if(position === "right"){
                             offObj.posClass = "lytePopRightToOrig";
                        }
                        if(!(modalEle.parentElement.classList.contains(offObj.posClass))){
                            modalEle.parentElement.classList.remove("lytePopBottomToOrig","lytePopTopToOrig","lytePopLeftToOrig","lytePopRightToOrig");
                            modalEle.parentElement.classList.add(offObj.posClass);
                        }
                        if(offObj.posClass == "lytePopBottomToOrig" || offObj.posClass == "lytePopTopToOrig"){
                            var leftVal = Math.abs(offsetLeft - (elementPosition.left+elementPosition.width/2));
                            if(offObj.posClass == "lytePopBottomToOrig"){
                                this.setData('transformOrigin',Math.round(leftVal)+"px top");
                            }
                            if(offObj.posClass == "lytePopTopToOrig"){
                                this.setData('transformOrigin',Math.round(leftVal)+"px bottom");
                            }
                        }
                        else{
                            var topVal = Math.abs(offsetTop - (elementPosition.top+elementPosition.height/2));
                            if(offObj.posClass === "lytePopRightToOrig"){
                                this.setData('transformOrigin',"left "+Math.round(topVal)+"px");
                            }
                            if(offObj.posClass === "lytePopLeftToOrig"){
                                this.setData('transformOrigin',"right "+Math.round(topVal)+"px");
                            }
                        }

                    }
                    this.setData('classTobeAdded',offObj.classTobeAdded);
                }
                else{
                    console.error("Please provide values for either ltPropOriginElem or ltPropOffset to open the popover at proper position.")
                    this.setData('ltPropShow',false);
                    return;
                }
                this.$node.ltProp('positionNew',position);
                /*------------------------------ MUTATE STARTS --------------------------*/
                _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.mutate(function(){
                    offsetLeft -= wrapperOffset.left ? wrapperOffset.left : 0;
                    offsetTop -= wrapperOffset.top ? wrapperOffset.top : 0;
                    modalEle.style.left = offsetLeft+"px";
                    modalEle.style.top = offsetTop+"px";
                    if(this.getData("first")){
                        window.LytePopup.bindTransitionEnd(this.actualModalDiv);
                        this.callOnShow();
                        this.setOpacityAndVisibility();
                        this.setData("first",false);
                        /* Checks and adds mutation observer */
                        _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.mutate(function(){
                            this.addMutationObserver();
                        },this);
                    }
                    else if(this.getData('resize')){
                        this.callOnResize(event);
                        this.setData('resize', false);
                        modalEle.style.height = this.$node.ltProp("height") ? this.$node.ltProp("height") : "auto";
                        modalEle.style.width = this.$node.ltProp("width")?this.$node.ltProp("width"):"auto";
                        // this.setData('modalElemHeight' , '')
                        // this.setData('modalElemWidth' , '')
                        /* Checks and adds mutation observer */
                        _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.mutate(function(){
                            this.addMutationObserver();
                        },this);
                    }
                    else if(reAlign){
                        var prevRect = this.getData('prevRect');
                        if(prevRect && ( (prevRect.left != offsetLeft) || (prevRect.top != offsetTop) ) && this.getMethods('onPositionChange')){
                            this.executeMethod('onPositionChange', this);
                        }
                    }
                    this.setData('prevRect', {left : offsetLeft, top : offsetTop});
                },this);
                /*------------------------------ MUTATE ENDS --------------------------*/
            }
        },this);
        /*------------------------------ MEASURE ENDS --------------------------*/
        if(this.$node.ltProp("freeze")){
            document.body.classList.add('bodyWrapper');
            // LytePopup.bodywrapperCount += 1;
        }

        var curSelf = this
        var openTransFun = function(){
          curSelf.setData('modalElemWidth' , curSelf.actualModalDiv.offsetWidth)
          curSelf.setData('modalElemHeigh' , curSelf.actualModalDiv.offsetHeight)
          curSelf.actualModalDiv.removeEventListener('transitionend' , openTransFun)
        }

        this.actualModalDiv.addEventListener('transitionend' , openTransFun)
    }

    /**
     * The method is going to return the left and top values that can be set to the popover based on the origin element's position
     *
     */
    positionPopover(position, elementPosition, modalElePosition) {
        var  offsetLeft=0,offsetTop=0,classTobeAdded,margin=this.getData("margin");
        if(this.getData('ltPropOriginElem') == ""){
            elementPosition.width = modalElePosition.width
        }
        switch(position){
            case 'bottom':
                offsetLeft = elementPosition.left - (modalElePosition.width - elementPosition.width)/2;
                offsetTop = elementPosition.top+elementPosition.height+ (this.getData('ltPropType') == "box" ? 0 : 9) + margin.top;
                classTobeAdded = "lytePopoverArrowTop";
                break;
            case 'bottomLeft':
                offsetLeft = elementPosition.left;
                offsetTop = elementPosition.top +elementPosition.height+(this.getData('ltPropType') == "box" ? 0 : 9) + margin.top;
                classTobeAdded = 'lytePopoverArrowTop';
                break;
            case 'bottomRight':
                offsetLeft = (elementPosition.left + elementPosition.width) - modalElePosition.width;
                offsetTop =  elementPosition.top +elementPosition.height+(this.getData('ltPropType') == "box" ? 0 : 9) + margin.top;
                classTobeAdded = 'lytePopoverArrowTop';
                break;
            case 'top':
                offsetLeft = elementPosition.left - (modalElePosition.width - elementPosition.width)/2;
                offsetTop = elementPosition.top - (modalElePosition.height+(this.getData('ltPropType') == "box" ? 0 : 9)) - margin.bottom;
                classTobeAdded = 'lytePopoverArrowBottom';
                break;
            case 'topLeft':
                offsetLeft = elementPosition.left;
                offsetTop = elementPosition.top - (modalElePosition.height+(this.getData('ltPropType') == "box" ? 0 : 9)) - margin.bottom;
                classTobeAdded = 'lytePopoverArrowBottom';
                break;
            case 'topRight':
                offsetLeft = (elementPosition.left + elementPosition.width) - modalElePosition.width;
                offsetTop = elementPosition.top - (modalElePosition.height+(this.getData('ltPropType') == "box" ? 0 : 9)) - margin.bottom;
                classTobeAdded = 'lytePopoverArrowBottom';
                break;
            case 'left':
                offsetLeft = (elementPosition.left - modalElePosition.width)-(this.getData('ltPropType') == "box" ? 0 : 9) + margin.left;
                offsetTop = elementPosition.top;
                classTobeAdded = 'lytePopoverArrowRight';
                break;
            case 'leftCenter':
                offsetLeft = (elementPosition.left - modalElePosition.width)-(this.getData('ltPropType') == "box" ? 0 : 9) + margin.left;
                offsetTop = elementPosition.top + (elementPosition.height - modalElePosition.height) / 2;
                classTobeAdded = 'lytePopoverArrowRight';
                break;
            case 'leftBottom':
                offsetLeft = (elementPosition.left - modalElePosition.width)-(this.getData('ltPropType') == "box" ? 0 : 9) + margin.left;
                offsetTop = elementPosition.bottom  - modalElePosition.height;
                classTobeAdded = 'lytePopoverArrowRight';
                break;
            case 'right':
                offsetLeft = (elementPosition.left + elementPosition.width)+(this.getData('ltPropType') == "box" ? 0 : 9) - margin.right;
                offsetTop = elementPosition.top;
                classTobeAdded = 'lytePopoverArrowLeft';
                break;
            case 'rightCenter':
                offsetLeft = (elementPosition.left + elementPosition.width)+(this.getData('ltPropType') == "box" ? 0 : 9) - margin.right;
                offsetTop = elementPosition.top + (elementPosition.height - modalElePosition.height) / 2;
                classTobeAdded = 'lytePopoverArrowLeft';
                break;
            case 'rightBottom':
                offsetLeft = (elementPosition.left + elementPosition.width)+(this.getData('ltPropType') == "box" ? 0 : 9) - margin.right;
                offsetTop = elementPosition.bottom - modalElePosition.height;
                classTobeAdded = 'lytePopoverArrowLeft';
                break;
        }
        return {offsetLeft:offsetLeft,offsetTop:offsetTop,classTobeAdded:classTobeAdded};
    }

    callOnShow() {
        this.$node.classList.add('lytePopoverOpened');
        if(this.getMethods("onShow")){
            this.executeMethod("onShow",this);
        }
    }

    setOpacityAndVisibility() {
        if(this.getData('ltPropAnimation') === "zoom"){
            this.actualModalDiv.style.transition = "none";
            this.actualModalDiv.style.transform = "scale(0)";
            // this.actualModalDiv.style.opacity = "1";
            this.actualModalDiv.classList.add('lytePopoverVisible');
            // this.actualModalDiv.classList.add('lyteZoom');
            var self = this;
            setTimeout(function(){
                self.actualModalDiv.style.transition = "";
                self.actualModalDiv.style.transitionDuration = (parseFloat(self.getData('ltPropDuration'))/1000) + "s";
                window.LytePopup.makingVisible = true;

                self.actualModalDiv.style.transformOrigin = self.getData('transformOrigin');
                self.actualModalDiv.style.transform = "scale(1)";
            },50);
        }
        else{
            this.actualModalDiv.style.transitionDuration = (parseFloat(this.getData('ltPropDuration'))/1000) + "s";
            window.LytePopup.makingVisible = true;
            // this.actualModalDiv.style.opacity = "1";
            this.actualModalDiv.classList.add('lytePopoverVisible');
        }

        /* ---- Commented for position error ---*/
        /* if(!this.$node.ltProp('freeze') && this.getData('classTobeAdded') && (this.getData('classTobeAdded') == "lytePopoverArrowLeft" || this.getData('classTobeAdded') == "lytePopoverArrowRight")){
            var actualModalDivOffset = this.actualModalDiv.getBoundingClientRect();
            var origElemPosition = document.querySelector(this.getData('ltPropOriginElem')).getBoundingClientRect();
            if(actualModalDivOffset.top != origElemPosition.top){
                this.actualModalDiv.style.top = origElemPosition.top + "px";
            }
        } */
    }

    onBeforeCloseHandling(event) {
        var result = true;
        
        if(this.getMethods("onBeforeClose")){
            result = this.executeMethod("onBeforeClose",event,this);
        }
        var self = this;
        if(result === undefined || result){
            window._lyteUiUtils.dispatchEvent('lytePopoverBeforeClose' , this.actualModalDiv)
            delete this.$node.alignPopover;
            delete this.$node.calculateOffset;
            if(this.getData('ltPropFreeze') && this.addedFreezeDetails){
                window.LytePopup.hideOrShowFreeze("close",this);
                delete this.addedFreezeDetails;
            }

            if(this.getData('ltPropAutoAlign') && this.$node.mutobserver){
                this.$node.mutobserver.disconnect();
                delete this.$node.mutobserver;
            }

            if(this.getData('arrowHidden')){
                this.getData('arrowEle').style.display = "";
                this.setData('arrowHidden',false);
                this.setData('arrowEle',null);
            }
            if(window._lyteUiUtils.getRTL() && this.getData('ltPropPlacement')){
                this.setRTLPosition();
            }
            if(this.getData('ltPropDuration') == undefined){
                // this.childComp.querySelector(".popoverWrapper").style.position = "";
                this.$node.ltProp({"showCopy":false,"show":false});
                this.$node.classList.remove('lytePopoverOpened');
                if(this.getData('ltPropAnimation') == "zoom"){
                    this.actualModalDiv.style.transform = "scale(0)";
                }
                else{
                    // this.actualModalDiv.style.opacity = 0;
                    this.actualModalDiv.classList.remove('lytePopoverVisible');

                }
                window.LytePopup.closePopup(this);
                // LytePopup.bindTransitionEnd(this.actualModalDiv);
                this.setData('visible',false);
                if(this.$node.ltProp('freeze') && this.childComp.querySelector("lyte-popover-freeze")){
                    this.childComp.querySelector("lyte-popover-freeze").style.opacity = 0;
                    this.childComp.querySelector("lyte-popover-freeze").style.visibility = "";
                }
                if(!this.$node.ltProp('freeze')){
                    this.childComp.querySelector(".popoverWrapper").classList.remove('noFreeze');
                }
                if(!this.getData('ltPropFreeze') && document.body.classList.contains('lyteStopBodyScrolling')){
                    document.body.classList.remove('lyteStopBodyScrolling');
                }
                if(this.getMethods("onClose")){
                    this.executeMethod("onClose",event,this);
                    if(this.childComp){
                        this.setData('ltPropShowWormhole' , false)
                    }
                }
                // if(this.$node.ltProp('freeze')){
                //     LytePopup.bodywrapperCount -= 1;
                //     if(LytePopup.bodywrapperCount == 0 || LytePopup.components.length == 0){
                //         document.body.classList.remove('bodyWrapper');
                //     }
                // }
                window.LytePopup.checkAndRemoveWrapper();
                setTimeout(function(){
                    if(!(self.getData('visible'))){
                        if(_lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()(self.childComp).find('.lytePopover')[0]){
                            _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()(self.childComp).find('.lytePopover')[0].style.left = ""
                            _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()(self.childComp).find('.lytePopover')[0].style.top = ""
                        }
                        if(self.childComp){
                            self.childComp.classList.add("lytePopoverDispNone");
                            self.setData('ltPropShowWormhole' , false)
                        }
                    }
                },20)
            }
            else{
                var animDur = parseInt(this.getData('ltPropDuration'));
                this.tIdClose = setTimeout(function(){
                    self.tIdClose = false;
                    if(self.getData('ltPropAnimation') == "zoom"){
                        // self.actualModalDiv.style.opacity = "0";
                        self.actualModalDiv.classList.remove('lytePopoverVisible');
                        self.actualModalDiv.style.transform = "";
                    }

                    self.$node.ltProp({"showCopy":false,"show":false});
                    self.$node.classList.remove('lytePopoverOpened');
                    if(self.getMethods("onClose")){
                        self.executeMethod("onClose",event,self);
                        if(self.childComp){
                            self.setData('ltPropShowWormhole' , false)
                        }
                    }
                    // if(self.$node.ltProp('freeze')){
                    //     LytePopup.bodywrapperCount -= 1;
                    //     if(LytePopup.bodywrapperCount == 0 || LytePopup.components.length == 0){
                    //         document.body.classList.remove('bodyWrapper');
                    //     }
                    // }
                    window.LytePopup.checkAndRemoveWrapper();
                    if(!(self.getData('ltPropBindToBody'))){
                        self.removeDOMReferences();
                    }
                },animDur);
                this.actualModalDiv.style.transitionDuration = ((animDur == 0 ? 0 : animDur > 300 ? animDur - 200 : 100) / 1000)+"s";
                if(this.getData('ltPropAnimation') == "zoom"){
                    this.actualModalDiv.style.transform = "scale(0)";
                }
                else{
                    // this.actualModalDiv.style.opacity = 0;
                    this.actualModalDiv.classList.remove('lytePopoverVisible');
                }
                window.LytePopup.closePopup(this);
                // LytePopup.bindTransitionEnd(this.actualModalDiv);
                this.setData('visible',false);
                // this.actualModalDiv.addEventListener('transitionend', popoverCloseTransitionend)
                // function popoverCloseTransitionend(){
                //   self.actualModalDiv.removeEventListener('transitionend' , popoverCloseTransitionend)
                //   if(!(self.getData('visible'))){
                //     if($L(self.childComp).find('.lytePopover')[0]){
                //       $L(self.childComp).find('.lytePopover')[0].style.left = ""
                //       $L(self.childComp).find('.lytePopover')[0].style.top = ""
                //     }
                //     self.childComp.classList.add("lytePopoverDispNone");
                //   }
                // }
                setTimeout(function(){
                  if(!(self.getData('visible'))){
                      if(_lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()(self.childComp).find('.lytePopover')[0]){
                        _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()(self.childComp).find('.lytePopover')[0].style.left = ""
                        _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()(self.childComp).find('.lytePopover')[0].style.top = ""
                      }
                      if(self.childComp){
                        self.childComp.classList.add("lytePopoverDispNone");
                        self.setData('ltPropShowWormhole' , false)
                        if(!self.$node.ltProp('freeze')){
                            self.childComp.querySelector(".popoverWrapper").classList.remove('noFreeze');
                        }
                      }
                    }
                },(parseInt(self.getData('ltPropDuration'))+20))
                if(this.$node.ltProp('freeze') && this.childComp.querySelector("lyte-popover-freeze")){
                    this.childComp.querySelector("lyte-popover-freeze").style.opacity = 0;
                    this.childComp.querySelector("lyte-popover-freeze").style.visibility = "";
                }
                if(!this.getData('ltPropFreeze') && document.body.classList.contains('lyteStopBodyScrolling')){
                    document.body.classList.remove('lyteStopBodyScrolling');
                }
            }
        }
        else{
            // if(LytePopup.evt){
            //     delete LytePopup.evt;
            // }
            this.setData('returnedFalse',true);
            if(!this.getData('visible')){
                this.setData('visible',true);
            }
            this.$node.ltProp('show',true);
            this.setData('ltPropShowWormhole' , true)
        }
    }

    onBeforeShowHandling() {
        var result = true;
        if(this.getMethods("onBeforeShow")){
            result = this.executeMethod("onBeforeShow",this);
        }
        if(result === undefined || result){
            this.childComp.classList.remove("lytePopoverDispNone");
            this.setData('checkAria', this.getData('checkAria')+1);
            if(this.getData('ltPropDraggable')){
                this.addDragHandler();
            }
            this.updateScrollHandling();
            if(!this.$node.ltProp('freeze')){
                this.childComp.querySelector(".popoverWrapper").classList.add('noFreeze');
            }

            this.$node.ltProp("positionNew",this.$node.ltProp("position"));
            if(this.getData('ltPropDuration') == undefined){
                this.$node.ltProp('showCopy',true);
                this.fastdomfn5 = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.mutate(function(){
                    delete this.fastdomfn5;
                    this.fastdomfn6 = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.measure(function(){
                        delete this.fastdomfn6;
                        this.fastdomfn7 = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.mutate(function(){
                            delete this.fastdomfn7;
                            this.computeOffsetImpl();
                        },this);
                    },this);
                },this);
            }
            else{
                var self = this;
                this.initCompute = setTimeout(function(){
                    delete self.initCompute;
                    /*------------------------------ MUTATE STARTS --------------------------*/
                    self.$node.ltProp('showCopy',true);
                    self.fastdomfn5 = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.mutate(function(){
                        delete self.fastdomfn5;
                        self.fastdomfn6 = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.measure(function(){
                            delete self.fastdomfn6;
                            self.fastdomfn7 = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.mutate(function(){
                                delete self.fastdomfn7;
                                self.computeOffsetImpl();
                            },self);
                        },self);
                    },self);
                    /*------------------------------ MUTATE ENDS --------------------------*/
                },0);
            }
            if(!this.getData("first")){
                this.setData("first",true);
            }
            _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.measure(function(){
                var scrollParent = this.$node.ltProp('originElem') ? window.LytePopup.getScrollParent(document.querySelector(this.$node.ltProp('originElem'))) : null;
                if(!this.getData('ltPropFreeze') && !(scrollParent && scrollParent.isEqualNode(document.body))){
                    document.body.classList.add('lyteStopBodyScrolling');
                }
            },this);
            if(!this.getData('visible')){
                this.setData('visible',true);
            }
            window.LytePopup.addPopup(this);
            if(this.$node.ltProp('freeze')){
                var freezeStyle = this.childComp.querySelector("lyte-popover-freeze").style;
                // freezeStyle.transitionDuration = (parseFloat(this.getData('ltPropDuration'))/1000) + "s";
                // freezeStyle.opacity = this.getData('ltPropDimmer').opacity;
                var dimmerValue = this.getData('ltPropDimmer');

                if(!_lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().isEmptyObject(dimmerValue)) {
                    freezeStyle.background = dimmerValue.color;
                    if(!this.addedFreezeDetails){
                        freezeStyle.opacity = dimmerValue.opacity;
                    }
                }
            }
            this.$node.alignPopover = this.computeOffsetImpl.bind(this);
            this.$node.calculateOffset = this.updateScrollHandling.bind(this);
        }
        else{
            this.$node.ltProp({"showCopy":false,"show":false});
        }
    }

    didDestroy() {
       this.setData('ltPropShowWormhole', false);
       this.$node.classList.remove('lytePopoverOpened');
       if(this.childComp){
           this.clearFastdomBatch();
           if(this.getData('ltPropAutoAlign') && this.$node.mutobserver){
               this.$node.mutobserver.disconnect();
               delete this.$node.mutobserver;
           }
           if(this.tIdBeforeClose){
               clearTimeout(this.tIdBeforeClose);
               this.tIdBeforeClose = false;
           }
           if(this.tIdClose){
               clearTimeout(this.tIdClose);
               this.tIdClose = false;
           }
           if(this.getData('ltPropFreeze') && this.addedFreezeDetails){
               window.LytePopup.hideOrShowFreeze("close",this);
               delete this.addedFreezeDetails;
           }
           // if(LytePopup.evt){
           //     delete LytePopup.evt;
           // }
           window.LytePopup.closePopup(this)
           this.childComp.remove();
           // delete this.childComp;
           // delete this.actualModalDiv;
           this.removeDOMReferences();
           // if(this.$node.ltProp('freeze')){
           //     LytePopup.bodywrapperCount -= 1;
           //     if(LytePopup.bodywrapperCount == 0 || LytePopup.components.length == 0){
           //         document.body.classList.remove('bodyWrapper');
           //     }
           // }
           window.LytePopup.checkAndRemoveWrapper();
           if(!this.getData('ltPropFreeze') && document.body.classList.contains('lyteStopBodyScrolling')){
               document.body.classList.remove('lyteStopBodyScrolling');
           }
       }
   }

    static actions(arg1) {
        return Object.assign(super.actions({
            close : function(){
               this.$node.ltProp("show",false);
               this.setData('ltPropShowWormhole' , false)
            }
        }), arg1);
    }

    static methods(arg1) {
        return Object.assign(super.methods({
            beforeWormholeAppend : function(arg){
                this.childComp = arg;

                //Sets the padding style based on user provide padding values
                if(this.$node.parentElement && this.$node.parentElement.tagName == 'LYTE-COLORPICKER'){
                    this.$node.parentElement.component.childComp = this.childComp;
                }
                if(this.childComp.querySelector('lyte-popover-header')){
                    this.childComp.querySelector('lyte-popover-header').style.padding = this.getData('ltPropHeaderPadding');
                }
                if(this.childComp.querySelector('lyte-popover-content')){
                    this.childComp.querySelector('lyte-popover-content').style.padding = this.getData('ltPropContentPadding');
                }
                if(this.childComp.querySelector('lyte-popover-footer')){
                    this.childComp.querySelector('lyte-popover-footer').style.padding = this.getData('ltPropFooterPadding');
                }
                this.actualModalDiv = this.childComp.querySelector(".lytePopover");
                if(this.childComp.querySelector('lyte-popover-header') && this.getData('ltPropShowCloseButton')){
                    var headerHeight=0, closeHeight= 0;
                    _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.measure(function(){
                        headerHeight = this.childComp.querySelector('lyte-popover-header').offsetHeight /*this.childComp.querySelector('lyte-popover-header').getBoundingClientRect().height*/;
                        closeHeight = this.childComp.querySelector('.lytePopoverClose').offsetHeight /*this.childComp.querySelector('.lytePopoverClose').getBoundingClientRect().height*/;
                    },this);
                    _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.mutate(function(){
                        this.childComp.querySelector('.lytePopoverClose').style.top = (headerHeight - closeHeight) / 2 + "px";
                    },this);
                }
            }
        }), arg1);
    }

    static observers(arg1) {
        return Object.assign(super.observers({
            computeSpacing : function(){
                var windowSpacing = Object.assign({},this.getData('ltPropWindowSpacing'));
                if(!windowSpacing.left){
                    windowSpacing.left = 30;
                }
                if(!windowSpacing.right){
                    windowSpacing.right = 30;
                }
                if(!windowSpacing.top){
                    windowSpacing.top = 30;
                }
                if(!windowSpacing.bottom){
                    windowSpacing.bottom = 30;
                }
                this.setData('windowSpacing',Object.assign({},windowSpacing));

                var margin = Object.assign({},this.getData('ltPropMargin'));
                if(!margin.left){
                    margin.left = 0;
                }
                if(!margin.right){
                    margin.right = 0;
                }
                if(!margin.top){
                    margin.top = 0;
                }
                if(!margin.bottom){
                    margin.bottom = 0;
                }
                this.setData('margin',Object.assign({},margin));
            }.observes('ltPropWindowSpacing', 'ltPropMargin').on('init'),

            showToggled : function(){
                var event = event || window.event;
                if(this.getData('returnedFalse')){
                    this.setData('returnedFalse',false);
                    return;
                }
                if(this.$node.ltProp("show") && !this.$node.ltProp("showCopy")){
                    if(this.tIdBeforeClose){
                        clearTimeout(this.tIdBeforeClose);
                        delete this.tIdBeforeClose;
                    }
                    if(this.tIdBeforeShow){
                        clearTimeout(this.tIdBeforeShow);
                        delete this.tIdBeforeShow;
                    }
                    if(window._lyteUiUtils.getRTL() && this.getData('ltPropPlacement')){
                        this.setRTLPosition();
                    }
                    this.$node.ltProp("bindToBody",true);
                    if(this.getData('ltPropDuration') == undefined){
                        this.onBeforeShowHandling(event);
                    }
                    else{
                        var self = this;
                        this.tIdBeforeShow = setTimeout(function(){
                            delete self.tIdBeforeShow;
                            self.onBeforeShowHandling(event);
                        },0);
                    }
                    this.setData('ltPropShowWormhole' , true);
                    window._lyteUiUtils.dispatchEvent('lytePopoverBeforeOpen' , this.actualModalDiv)
                }
                else{
                    this.setData('ltPropShowWormhole' , false)
                    this.clearFastdomBatch();
                    if(this.tIdBeforeShow){
                        clearTimeout(this.tIdBeforeShow);
                        delete this.tIdBeforeShow;
                    }
                    if(this.tIdBeforeClose){
                        clearTimeout(this.tIdBeforeClose);
                        delete this.tIdBeforeClose;
                    }
                    if(this.$node.ltProp("showCopy")){
                        // console.log(LytePopup.evt);
                        if(this.getData('ltPropDuration') == undefined){
                            this.onBeforeCloseHandling(/*LytePopup.evt || */event);
                            if(!(this.getData('ltPropBindToBody'))){
                                this.removeDOMReferences();
                            }
                        }
                        else{
                            var self = this;
                            this.tIdBeforeClose = setTimeout(function(){
                                delete self.tIdBeforeClose;
                                self.onBeforeCloseHandling(event);
                            },0);
                        }
                    }
                    else{
                        if(!(this.getData('ltPropBindToBody'))){
                            this.removeDOMReferences();
                        }
                    }
                }
            }.observes("ltPropShow").on('didConnect'),

            changeShow : function(){
                if(!this.getData('ltPropBindToBody')){
                    this.clearFastdomBatch();
                    if(this.tIdBeforeShow){
                        clearTimeout(this.tIdBeforeShow);
                        delete this.tIdBeforeShow;
                    }
                    if(this.tIdBeforeClose){
                        clearTimeout(this.tIdBeforeClose);
                        delete this.tIdBeforeClose;
                    }
                    if(this.getData('ltPropFreeze') && this.addedFreezeDetails){
                        window.LytePopup.hideOrShowFreeze("close",this,true);
                        delete this.addedFreezeDetails;
                    }
                    if(this.getData('ltPropShow')){
                        this.setData('ltPropShow',false);
                    }
                    else{
                        this.setData('ltPropShowCopy', false);
                        window.LytePopup.closePopup(this);
                        this.setData('visible',false);
                        this.removeDOMReferences();
                    }
                }
            }.observes("ltPropBindToBody"),

            addAriaValues : function( arg ) {
                if(this.getData('ltPropAria')){
                    var ariaProp = this.getData('ltPropAriaAttributes') || {};
                    window._lyteUiUtils.setAttribute( this.actualModalDiv, ariaProp, arg ? arg.oldValue : {} );
                    var closeIcon = this.actualModalDiv.querySelector('.lytePopoverClose');
                    if(closeIcon){
                        closeIcon.setAttribute('aria-label', ariaProp['close-label'] || 'Close icon at top right position');
                    }
                }
            }.observes('ltPropAriaAttributes','ltPropAriaAttributes.{}','checkAria'),

            scrollHandling : function(){
                if(!this.getData('ltPropShow')){
                    return;
                }
                this.updateScrollHandling();
            }.observes("ltPropWidth","ltPropMaxWidth","ltPropHeight","ltPropMaxHeight"),

            computeOffset : function(){
                if(this.getData('ltPropShow')){
                  this.computeOffsetImpl();
                } else {
                  return
                }
            }.observes("ltPropOriginElem"),

            observeClickEvent : function(){
                window.LytePopup._stopPropagation = this.getData('ltPropStopClick');
                if(LytePopup._stopPropagation){
                    LytePopup._sourceComp = this;
                }
                else{
                    if(LytePopup._sourceComp){
                        delete LytePopup._sourceComp;
                    }
                }
            }.observes('ltPropStopClick')
        }), arg1);
    }

    _() {
        _;
    }
}

LytePopoverComponent._template = "<template tag-name=\"lyte-popover\"> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{ltPropBindToBody}}\" is=\"case\" lc-id=\"lc_id_0\"> <lyte-wormhole case=\"true\" style=\"{{if(ltPropShowCopy,'visibility:visible','visibility:hidden')}}\" on-before-append=\"{{method(&quot;beforeWormholeAppend&quot;)}}\" lt-prop-focus-on-close=\"{{ltPropFocusOnClose}}\" lt-prop-show=\"{{ltPropShowWormhole}}\"> <template is=\"registerYield\" yield-name=\"lyte-content\"> <div class=\"popoverWrapper {{ltPropWrapperClass}} lytePopupZI\"> <div class=\"{{if(ifEquals(ltPropAnimation,'zoom'),'lytePopover lyteZoom','lytePopover')}}\"> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{ifEquals(ltPropType,&quot;callout&quot;)}}\" is=\"case\" lc-id=\"lc_id_0\"> <span id=\"lytePopoverArrow\" class=\"lytePopoverArrowIcon\"></span> </template></template> <template is=\"switch\" l-c=\"true\"><template is=\"case\" case=\"{{ltPropShowCloseButton}}\" lc-id=\"lc_id_0\"><span class=\"lytePopoverClose\" onclick=\"{{action('close')}}\" tabindex=\"0\"></span></template></template> <lyte-yield yield-name=\"popover\"></lyte-yield> </div> <template is=\"switch\" l-c=\"true\"><template is=\"case\" case=\"{{ltPropFreeze}}\" lc-id=\"lc_id_0\"><lyte-popover-freeze></lyte-popover-freeze></template></template> </div> </template> </lyte-wormhole> </template></template> </template>";;
LytePopoverComponent._dynamicNodes = [{"t":"s","p":[1],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"a":{"style":{"name":"style","helperInfo":{"name":"if","args":["ltPropShowCopy","'visibility:visible'","'visibility:hidden'"]}}},"cn":"lc_id_0"},{"t":"r","p":[1,1],"dN":[{"t":"a","p":[1]},{"t":"a","p":[1,1]},{"t":"s","p":[1,1,1],"c":{"lc_id_0":{"dN":[],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{}},"hd":true,"co":["lc_id_0"],"in":3,"sibl":[2]},{"t":"s","p":[1,1,3],"c":{"lc_id_0":{"dN":[{"t":"a","p":[0],"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{}},"hd":true,"co":["lc_id_0"],"in":2,"sibl":[1]},{"t":"i","p":[1,1,5],"in":1,"sibl":[0]},{"t":"s","p":[1,3],"c":{"lc_id_0":{"dN":[{"t":"cD","p":[0],"in":0,"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{"dc":[0],"hc":true,"trans":true}},"hd":true,"co":["lc_id_0"],"hc":true,"trans":true,"in":0}],"dc":[1,0],"hc":true,"trans":true,"in":1,"sibl":[0],"cn":"lc_id_0"},{"t":"cD","p":[1],"in":0,"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{"dc":[1,0],"hc":true,"trans":true}},"hd":true,"co":["lc_id_0"],"hc":true,"trans":true,"in":0},{"type":"dc","trans":true,"hc":true,"p":[0]}];;

LytePopoverComponent._observedAttributes = [
    "ltPropShow",
    "ltPropType",
    "ltPropFreeze",
    "ltPropShowCloseButton",
    "ltPropCloseOnEscape",
    "ltPropOriginElem",
    "ltPropPosition",
    "ltPropPlacement",
    "ltPropDimmer",
    "ltPropDraggable",
    "ltPropAllowMultiple",
    "ltPropScrollable",
    "ltPropMaxHeight",
    "ltPropMaxWidth",
    "ltPropWidth",
    "ltPropHeight",
    "ltPropWrapperClass",
    "ltPropBoundary",
    "ltPropCloseOnBodyClick",
    "ltPropDuration",
    "ltPropOffset",
    "ltPropOffsetFromTarget",
    "ltPropBindToBody",
    "ltPropHeaderPadding",
    "ltPropContentPadding",
    "ltPropFooterPadding",
    "ltPropAnimation",
    "ltPropWindowSpacing",
    "ltPropForceScroll",
    "ltPropAutoAlign",
    "ltPropAria",
    "ltPropAriaAttributes",
    "ltPropPreventFocus",
    "ltPropStopClick",
    "ltPropIgnoreBoundary",
    "ltPropMargin",
    "ltPropCloseOnScroll",
    "ltPropAllowContainment",
    "ltPropIgnoreInput",
    "ltPropFocusOnClose",
    "ltPropShowWormhole",
    "buttons",
    "ltPropShowCopy",
    "visible",
    "timeOutId",
    "classTobeAdded",
    "keys",
    "first",
    "arrowHidden",
    "arrowEle",
    "returnedFalse",
    "transformOrigin",
    "windowSpacing",
    "lyteUnbound",
    "prevOffsetVal",
    "calculateHW",
    "checkAria",
    "prevRect",
    "margin",
    "modalElemWidth",
    "modalElemHeight",
    "dragRunning"
];

if (document.readyState === "complete" || document.readyState === "interactive"){
    window.addPopoverEvent();
}
else{
    document.addEventListener("DOMContentLoaded", function(event){
        window.addPopoverEvent(event);
    });
}

/**
 * @syntax yielded
 * <lyte-popover>
 *     <template is = "registerYield" yield-name = "popover">
 *         <lyte-popover-header> Create Profile </lyte-popover-header>
 *         <lyte-popover-content>
 *             //Some Content
 *         </lyte-popover-content>
 *         <lyte-popover-footer class = "right">
 *             //Some button
 *         </lyte-popover-footer>
 *     </template>
 * </lyte-popover>
 */


LytePopoverComponent.register("lyte-popover", {
    hash: "LytePopoverComponent_4",
    refHash: "C_lyte-ui-component_@zoho/lyte-ui-component_2"
});


/***/ }),

/***/ 39319760:
/*!*********************************************************************************!*\
  !*** ./node_modules/@zoho/lyte-ui-component/components/javascript/lyte-text.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LyteTextComponent": () => (/* binding */ LyteTextComponent)
/* harmony export */ });
/* harmony import */ var _lyte_hovercard_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lyte-hovercard.js */ 76954627);
/* harmony import */ var _slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../@slyte/core/index.js */ 56505143);
/* harmony import */ var _component_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../component.js */ 50761997);
/* harmony import */ var _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../lyte-dom/modules/lyte-dom-utils.js */ 19978124);
/* harmony import */ var _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2__);






/**
 * This component is used to show tooltip when its content exceeds
 * @component lyte-text
 * @version 2.2.0
 */

window._lyteUiUtils.measureFont = function( style ){
	var str = [];
		
	[ 'fontStyle', 'fontVariant', 'fontWeight', 'fontSize', 'fontFamily' ].forEach( function( item ){
		var __style = style[ item ];
		__style && str.push( __style );
	});

	return str.join( ' ' );
}

window._lyteUiUtils.check4ellipsis = function( $node, to_value, force_allow, multiLine ){
	var __width = multiLine ? "Height" : "Width",
	offwidth = $node[ "offset" + __width ],
	scrollwidth = $node[ "scroll" + __width ],
	tooltip = scrollwidth > offwidth;

	if( scrollwidth == offwidth && force_allow && !multiLine ){
		var bcr_width = $node.getBoundingClientRect().width;

		if( offwidth - bcr_width <= 0.5 ){
			var compStyle = window.getComputedStyle( $node ),
			font = compStyle.font,
			ctx = document.createElement( "canvas" ).getContext( "2d" );

			ctx.font = font || window._lyteUiUtils.measureFont( compStyle );
			var measured = ctx.measureText( to_value ).width;

			if( measured - bcr_width >= 0.015 ){
				tooltip = true;
			}
		}
	}

	return tooltip;
}

class LyteTextComponent extends _component_js__WEBPACK_IMPORTED_MODULE_1__.Component {
    constructor() {
        super();
    }

    data(arg1) {
		var default_values = window._lyteUiUtils.getDefault( 'lyte-text' );

		return Object.assign(super.data({
			/**
			 * @componentProperty {string} ltPropValue=''
			 * @version 2.2.0
			 */
			ltPropValue : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'string', { default : '' } ),
			/**
			 * @componentProperty {boolean} ltPropShow=true
			 * @version 2.2.0
			 */
			ltPropShow : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'boolean', { default : default_values.show ==false ? false : true } ),
			/**
			 * @componentProperty {boolean} ltPropYield=false
			 * @version 2.2.20
			 */
			ltPropYield : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'boolean', { default : default_values.yield || false } ),
			/**
			 * @componentProperty {Boolean} ltPropText
			 * @version 3.50.0
			 */
			ltPropText : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'boolean', { default : default_values.text == false ? false : true } ),
			/**
			 * @componentProperty {array} ltPropArray
			 * @version 3.50.0
			 */
			ltPropArray : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'array' ),
			/**
			 * @componentProperty {string} ltPropSuffix=""
			 * @version 3.50.0
			 */
			ltPropSuffix : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'string', { default : default_values.suffix || "" } ),
			/**
			 * @componentProperty {string} ltPropHovercard='{}'
			 * @component lyte-hovercard
			 * @version 3.50.0
			 */
			ltPropHovercard : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'string', { default : default_values.hovercard || '{}' } ),
			/**
			 * @componentProperty {string} ltPropSeparator=', '
			 * @version 3.50.0
			 */
			ltPropSeparator : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'string', { default : default_values.separator || ", " } ),
			/**
			 * @componentProperty {number} ltPropWidth=0
			 * @version 3.50.0
			 */
			ltPropWidth : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'number', { default : default_values.width || 0 } ),
			/**
			 * @componentProperty {number} ltPropMinCount=0
			 * @version 3.50.2
			 */
			ltPropMinCount : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'number', { default : default_values.minCount || 0 } ),
			/**
			 * @componentProperty {string} ltPropTooltipConfig='{}'
			 * @component lyte-tooltip ltPropTooltipConfig
			 * @version 3.52.0
			 */
			ltPropTooltipConfig : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( "string", { default : default_values.tooltipConfig || '{}' } ),

			ltPropRerender : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'boolean', { default : false } ),

			/**
			 * @componentProperty {string} ltPropTail
			 * @version 3.98.0
			 */
			
			ltPropTail : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( "string", { default : default_values.tail || "" } ),

			/**
			 * @componentProperty {boolean} ltPropFillAvailable=false
			 * @version 3.98.0
			 */
			ltPropFillAvailable : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'boolean', { default : default_values.fillAvailable || false } ),

			/**
			 * @componentPropery {boolean} ltPropShowHovercardOnClick=false
			 * @version 3.98.0
			 */

			ltPropShowHovercardOnClick : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'boolean', { default : default_values.showHovercardOnClick || false } ),

			/**
			 * @componentPropery {string} ltPropHovercardKey="Space"
			 * @version 3.98.0
			 */

			ltPropHovercardKey : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'string', { default : default_values.hovercardKey || " " } ),
			
			/**
			 * @componentProperty {boolean} ltPropTag=false
			 * @version 3.103.0
			 */
			ltPropTag : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'boolean', { default : default_values.hoverCardArray || false } ),

			/**
			 * @componentProperty {number} ltPropAdditionalSpace=0
			 * @version 3.103.0
			 */
			ltPropAdditionalSpace : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'number', { default : 0 } ),

			/**
			 * @componentProperty {string} ltPropTabindex="-1"
			 * @version 3.103.0
			 */
			ltPropTabindex : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'string', { default : "-1" } ),

			/**
			 * @componentProperty {boolean} ltPropMultiLine=false
			 * @version 3.105.0
			 */
			ltPropMultiLine : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'boolean', { default : default_values.multiLine || false } ),

			renderHover : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'boolean', { default : false } ),
			lyteUnbound : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'boolean', { default : false } ),
			hoverCardArray : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'array', { default : [] } ),
			render : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'boolean' ),
			show : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'boolean', { default : false } ),
			originElem : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'string', { default : "" } ),
			suffix : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'string', { default : "" } ),
			
			dummyText : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'string', { default : "" } ),
			tailText : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'string', { default : "" } ),
			renderArray : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)( 'array', { default : [] } )
		}), arg1);		
	}

    init() {
		var __data = this.data,
		arr = __data.ltPropArray;

		if( arr ){
			var $node = this.$node,
			hovercard = JSON.parse( __data.ltPropHovercard );

			__data.ltPropText = !arr;

			__data.originElem = hovercard.originElem || ( function(){
				var id = $node.id;
				if( !id ){
					id = $node.id = 'lyteText_' + parseInt( Math.random() * 10000 );
				}
				return "#" + id + ' .lyteTextSuffix>span';
			})();
		}
	}

    didDestroy() {
		_lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.clear( this.prev_fast );
	}

    render_array() {
		var __this = this,
		__data = __this.data,
		array = __data.ltPropArray,
		suffix = __data.ltPropSuffix,
		fastdom = (_lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom),
		__length = array.length,
		arr = [],
		separator = __data.ltPropSeparator,
		fns = 'prev_fast';

		__this.setData( 'render', true );
		
		fastdom.clear( __this[ fns ] );

		__this[ fns ] = fastdom.measure( function(){

			delete __this[ fns ];

			var $node = __this.$node,
			elem = $node.getElementsByClassName( 'lyteTextRenderDiv' )[ 0 ];

			if( !elem ){
				return;
			}

			var __child = elem.children,
			ns = 'getBoundingClientRect',
			__width = 'width',
			is_tag = __data.ltPropTag,
			additional_space = __data.ltPropAdditionalSpace,
			suffix_width = elem.nextElementSibling.children[ 0 ][ ns ]()[ __width ],
			act_width = __data.ltPropWidth || $node.offsetWidth,
			sum = 0,
			break_point,
			i = 0;

			for( ; i < __length; i++ ){
				var __div = __child[ i ],
				spans = __div.children,
				span_elem = spans[ 0 ],
				span_wid = span_elem[ ns ]()[ __width ],
				comma_wid;

				if( is_tag ){
					var __style = getComputedStyle( span_elem );
					span_wid += ( parseFloat( __style.marginInlineStart ) + parseFloat( __style.marginInlineEnd ) );
					comma_wid = 0;
					if( i + 1 != __length ){
						span_wid += additional_space;
					}
				} else {
					comma_wid = spans[ 1 ][ ns ]()[ __width ];
				}

				arr.push({
					width : span_wid,
					comma : comma_wid
				});

				sum += ( span_wid + comma_wid );

				if( sum > act_width ){
					break_point = true;
					act_width -= suffix_width;
					while( sum > act_width ){
						var __last = arr.pop();
						if( __last ){
							sum -= ( __last.width + __last.comma - additional_space );
							i--;
						} else {
							break;
						}
					}
					break;
				}
			}

			fastdom.mutate( function(){
				var str = '',
				h_arr = [],
				suffixText = "",
				to_render = [];

				if( break_point ){

					var fn = "remove";

					if( __data.ltPropFillAvailable && !is_tag ){
						i++;
						fn = "add";
					} else if( i == -1 ){
						i = /*Math.max(  */Math.min( __length, __data.ltPropMinCount ) - 1/*, 0 )*/;
						fn = "add";
					}

					_lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()( $node )[ fn + 'Class' ]( 'lyteTextNoSpace' );

					for( var k = 0; k < __length; k++ ){
						var __cur = array[ k ];
						if( k <= i ){
							if( is_tag ){
								to_render.push( __cur );
							} else {
								str += ( ( k ? separator : "" ) + __cur );
							}
						} else {
							h_arr.push( __cur );
						}
					}

					if( i + 1 != __length ){
						suffixText = ( suffix.replace( '{0}', ( __length - ++i ) ) );
					}

				} else {
					is_tag ? to_render = array : void 0;
					str = array.join( separator );
				}

				__this.setData({
					ltPropValue : str,
					suffix : suffixText,
					render : false,
					hoverCardArray : h_arr,
					renderHover : break_point && __data.ltPropShow,
					renderArray : to_render
				});

			});
		});
	}

    reset(__node, __value, frm_mid) {
		var $node = __node || this.$node,
		data = this.data;

		if( data.ltPropText || __node ){
			var value_to = "",
			tooltip = window._lyteUiUtils.check4ellipsis( $node,  __value || data.ltPropValue, !data.ltPropYield, data.ltPropMultiLine );

			if( tooltip && data.ltPropShow ){
				value_to = __value || data.ltPropValue;
			}
			$node.setAttribute( 'lt-prop-title', frm_mid ? ( tooltip && data.ltPropShow ? data.ltPropValue : "" ) : value_to );
		} 
	}

    over(evt) {
		var __data = this.data,
		is_click = __data.ltPropShowHovercardOnClick;

		switch( evt.type ){
			case "click" : {
				if( !is_click ){
					return;
				}
			}
			break; 
			case "keydown" : {
				var allow = true;
				if( is_click ){
					var keys = ( __data.ltPropHovercardKey || "" ).split( /\,|\|/g );
					if( keys.indexOf( evt.key ) + 1 ){
						evt.preventDefault();	
						allow = false;
					}
				} 
				if( allow ) {
					return;
				}
			}
			break;
			default : {
				if( is_click ){
					return;
				}
			}
		}

		if( !evt.target.closest( '.lyteTextSuffix' ) ){
			return;
		}

		is_click ? window.requestAnimationFrame( function(){
			this.setData( 'show', __data.ltPropShow );
		}.bind( this ) ) : this.setData( 'show', __data.ltPropShow );
	}

    static actions(arg1) {
        return Object.assign(super.actions({
			focusout : function(){
				var __data = this.data;

				if( __data.ltPropShowHovercardOnClick && __data.show ){
					this.setData( "show", false );
				}
			},

			mouse : function(){
				if( this.data.ltPropTail ){
					return;
				}
				this.reset();
			},

			over : function( evt ){
				this.data.ltPropArray && this.over( evt );
			},

			submouse : function( __this ){
				if( _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()( this.$node ).hasClass( 'lyteTextNoSpace' ) /*&& data.ltPropMinCount*/ ){
					this.reset( __this, this.data.ltPropValue );
				}
			},

			tailmouse : function( __this ){
				this.reset( __this, this.data.dummyText, true );
			}
        }), arg1);
    }

    static methods(arg1) {
        return Object.assign(super.methods({
			beforeHide : function( __node, evt ){
				if( this.data.ltPropShowHovercardOnClick && ( evt || {} ).type == "mouseleave" ){
					return false;
				}
				return true;
			}
        }), arg1);
	}

    static observers(arg1) {
        return Object.assign(super.observers({
			value_obs : function( arg ){
				var text = this.data.ltPropValue,
				tail = this.data.ltPropTail;
		
				if( tail ){
					var regx = new RegExp( tail ),
					match = text.match( regx )[ 0 ] || "";
		
					this.setData({
						dummyText : text.slice( 0, -match.length ),
						tailText : match
					});
		
					if( !arg ){
						this.$node.classList.add( "lyteTextNoSpace" );
					}
				}
		
			}.observes( 'ltPropValue' ).on( 'init' ),

			rerender_obs : function( arg ){
				if( arg.newValue && this.data.ltPropArray ){
					this.render_array();
					this.setData( arg.item, !1 );
				}
			}.observes( 'ltPropRerender' ),
		
			didCnt : function( arg ){
				if( this.data.ltPropArray ){
					this.render_array();
				} else if( !arg && this.data.ltPropMultiLine ){
					var $node = this.$node,
					__attr = 'lt-prop-tooltip-style',
					__style = $node.getAttribute( __attr );
		
					$node.classList.add( "lyteTextWithMultipleLineContent" );
					!__style && ( __style = "width:50%;" ) && $node.setAttribute( __attr, __style );
				}
			}.observes( 'ltPropSuffix', 'ltPropArray', 'ltPropArray.[]', 'ltPropWidth' ).on( 'didConnect' )
		}), arg1);
	}

    _() {
        _;
    }
}

LyteTextComponent._template = "<template tag-name=\"lyte-text\" lt-prop-title=\"\" onmouseenter=\"{{action('mouse')}}\" onmouseover=\"{{action('over',event)}}\"><template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{ltPropText}}\" is=\"case\" lc-id=\"lc_id_0\"><template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{ltPropYield}}\" is=\"case\" lc-id=\"lc_id_0\"> <lyte-yield class=\"lyteTextYield\" yield-name=\"lyte-text\" lt-prop-value=\"{{ltPropValue}}\"></lyte-yield> </template><template default=\"\"><template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{ltPropTail}}\" is=\"case\" lc-id=\"lc_id_0\"> <span class=\"lyteTextWrapper\" onmouseenter=\"{{action('tailmouse',this)}}\" lt-prop-tooltip-class=\"lyteTextTooltip\" lt-prop-tooltip-config=\"{{ltPropTooltipConfig}}\">{{dummyText}}</span> <span class=\"lyteTextTail\">{{tailText}}</span> </template><template default=\"\">{{ltPropValue}}</template></template> </template></template> </template><template default=\"\"> <span class=\"lyteTextWrapper\" onmouseenter=\"{{action('submouse',this)}}\" lt-prop-tooltip-class=\"lyteTextTooltip\" lt-prop-tooltip-config=\"{{ltPropTooltipConfig}}\">{{ltPropValue}}</span> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{suffix}}\" is=\"case\" lc-id=\"lc_id_0\"> <span class=\"lyteTextSuffix\" onclick=\"{{action('over',event)}}\" onkeydown=\"{{action('over',event)}}\" onfocusout=\"{{action('focusout',event)}}\">{{unescape(suffix)}}</span> </template></template> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{renderHover}}\" is=\"case\" lc-id=\"lc_id_0\"> <lyte-hovercard lt-prop=\"{{ltPropHovercard}}\" lt-prop-hide-on-click=\"{{ltPropShowHovercardOnClick}}\" lt-prop-origin-elem=\"{{originElem}}\" lt-prop-show=\"{{lbind(show)}}\" on-hovercard-before-hide=\"{{method('beforeHide')}}\"> <template is=\"registerYield\" yield-name=\"hoverCardYield\"> <lyte-hovercard-content> <template items=\"{{hoverCardArray}}\" item=\"item\" index=\"index\" is=\"for\" _new=\"true\"> <div class=\"lyteTextHovercardList\">{{item}}</div> </template> </lyte-hovercard-content> </template> </lyte-hovercard> </template></template> </template></template> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{render}}\" is=\"case\" lc-id=\"lc_id_0\"> <div class=\"lyteTextRenderDiv\"> <template items=\"{{ltPropArray}}\" item=\"item\" index=\"index\" is=\"for\" _new=\"true\"> <div class=\"lyteTextIndividual\"> <span class=\"lyteTextWord\">{{item}}</span> <span class=\"lyteTextComma\">{{unescape(ltPropSeparator)}}</span> </div> </template> </div> <div class=\"lyteTextSuffix\"> <span>{{unescape(ltPropSuffix)}}</span> </div> </template></template> </template>";;
LyteTextComponent._dynamicNodes = [{"t":"s","p":[0],"c":{"lc_id_0":{"dN":[{"t":"s","p":[0],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"cn":"lc_id_0"},{"t":"i","p":[1],"in":0,"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{"dN":[{"t":"s","p":[0],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"cn":"lc_id_0"},{"t":"tX","p":[1,0],"cn":"lc_id_0"},{"t":"tX","p":[3,0],"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{"dN":[{"t":"tX","p":[0],"cn":"default"}]},"dc":{"lc_id_0":{},"default":{}},"hd":true,"co":["lc_id_0"],"cn":"default"}]},"dc":{"lc_id_0":{"dc":[0],"hc":true,"trans":true},"default":{}},"hd":true,"co":["lc_id_0"],"hc":true,"trans":true,"in":0,"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{"dN":[{"t":"a","p":[1],"cn":"default"},{"t":"tX","p":[1,0],"cn":"default"},{"t":"s","p":[3],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"cn":"lc_id_0"},{"t":"tX","p":[1,0],"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{}},"hd":true,"co":["lc_id_0"],"in":1,"sibl":[0],"cn":"default"},{"t":"s","p":[5],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"cn":"lc_id_0"},{"t":"r","p":[1,1],"dN":[{"t":"a","p":[1,1]},{"t":"f","p":[1,1],"dN":[{"t":"tX","p":[1,0]}],"in":1,"sibl":[0]},{"t":"cD","p":[1],"in":0}],"dc":[0],"hc":true,"trans":true,"in":1,"sibl":[0],"cn":"lc_id_0"},{"t":"cD","p":[1],"in":0,"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{"dc":[1,0],"hc":true,"trans":true}},"hd":true,"co":["lc_id_0"],"hc":true,"trans":true,"in":0,"cn":"default"}]},"dc":{"lc_id_0":{"dc":[0],"hc":true,"trans":true},"default":{"dc":[0],"hc":true,"trans":true}},"hd":true,"co":["lc_id_0"],"hc":true,"trans":true,"in":1,"sibl":[0]},{"t":"s","p":[2],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1,1],"cn":"lc_id_0"},{"t":"f","p":[1,1],"dN":[{"t":"tX","p":[1,1,0]},{"t":"tX","p":[1,3,0]}],"cn":"lc_id_0"},{"t":"tX","p":[3,1,0],"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{}},"hd":true,"co":["lc_id_0"],"in":0},{"type":"dc","trans":true,"hc":true,"p":[1]}];;

LyteTextComponent._observedAttributes = [
    "ltPropValue",
    "ltPropShow",
    "ltPropYield",
    "ltPropText",
    "ltPropArray",
    "ltPropSuffix",
    "ltPropHovercard",
    "ltPropSeparator",
    "ltPropWidth",
    "ltPropMinCount",
    "ltPropTooltipConfig",
    "ltPropRerender",
    "ltPropTail",
    "ltPropFillAvailable",
    "ltPropShowHovercardOnClick",
    "ltPropHovercardKey",
    "ltPropTag",
    "ltPropAdditionalSpace",
    "ltPropTabindex",
    "ltPropMultiLine",
    "renderHover",
    "lyteUnbound",
    "hoverCardArray",
    "render",
    "show",
    "originElem",
    "suffix",
    "dummyText",
    "tailText",
    "renderArray"
];

window.addEventListener( "resize", function(){
	clearTimeout( window.__lyteTextTimeout );
	window.__lyteTextTimeout = setTimeout( function(){
		window.__lyteTextTimeout = void 0;

		var elems = document.getElementsByTagName( "lyte-text" ),
		len = elems.length;

		for( var i = 0; i < len; i++ ){
			var cur = elems[ i ];

			if( cur.ltProp( 'array' ) ){
				cur.component.render_array();
			}
		}

	}, 100 );
}, true );

/**
 * Now ellipsis tooltip can be extended for non lyte-text elements also. Elements having the mentioned class will be considered as ellipsis element
 */

document.addEventListener( "mouseover", function( evt ){
	var cls_name = 'lyteTextEllipsisNode',
	target = evt.target;
	
	if( _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()( target ).hasClass( cls_name ) ){
		var __attr = "lt-prop-title",
		to_value = target.getAttribute( "data-lyte-text-tooltip" ) || target.textContent.trim();

		if( window._lyteUiUtils.check4ellipsis( target, to_value, true, false ) ){
			target.setAttribute( __attr, to_value );
		} else {
			target.removeAttribute( __attr );
		}
	}
}, true );

/**
* @syntax nonYielded
* <lyte-text lt-prop-value = "some long text having higher width"></lyte-text>
*/

/**
*  @syntax staticBuilder
*  <lyte-text lt-prop-value = "Some long text to be displayed"></lyte-text>
*/

/**
* @syntax yielded
* <lyte-text lt-prop-yield = true lt-prop-value = "some long text having higher width">
* 	 <template is = "registerYield" yield-name = "lyte-text">
*		your value
*	 </template>
* </lyte-text>
*/

/**
* @syntax Array of text
*	<lyte-text lt-prop-array = '[ "Text1", "Text2", "Text3" ]'></lyte-text>
*/


LyteTextComponent.register("lyte-text", {
    hash: "LyteTextComponent_4",
    refHash: "C_lyte-ui-component_@zoho/lyte-ui-component_2"
});

/***/ })

}]);
//# sourceMappingURL=home-comp.js.map