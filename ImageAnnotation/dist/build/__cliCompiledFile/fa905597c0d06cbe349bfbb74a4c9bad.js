import { _defineProperty } from "@slyte/core/src/lyte-utils";
import "../../node_modules/@zoho/lyte-ui-component/components/javascript/lyte-fileupload.js";
import './loading-comp.js';
import {Component} from "../../node_modules/@slyte/component/index.js";
import { prop } from "../../node_modules/@slyte/core/index.js";
import { ImagesSchema } from "../../data-store/schemas/Images";

class HomeComp extends Component {
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
			images:prop("array",{watch:true}),
			selectedFile:prop("object"),
			previewUrl:prop("string",{default:"none"}),
			total:prop("number",{default:0}),
			size:prop("number",{default:0})
			
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
					const rec = this.$db.newEntity({ schema: ImagesSchema });

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
export {HomeComp};
HomeComp.register("home-comp", {
    hash: "HomeComp_4",
    refHash: "C_ImageAnnotation_app_0"
}); 
