import {Component} from "@slyte/component";
import { prop } from "@slyte/core";
import { ImagesSchema } from "/data-store/schemas/Images";
class HomeComp extends Component {
	constructor() {
		super();
	}
	init(){
		
		this.setData("images",this.data.data)
		// const temp=this.getData("images")
		// var images=this.getData("images");
		var pagenumber=(parseInt(this.$app.Globals.get("pageNumber").number)+1).toString()
		var prevNumber=(parseInt(this.$app.Globals.get("pageNumber").number)-1).toString()
		var cn=parseInt(this.$app.Globals.get("pageNumber").number)
		this.setData("current",cn);
		console.log("route number",pagenumber)
		this.setData("next",pagenumber)
		// this.setData("size",images.reduce((sum,img)=>sum+parseInt(img.size),0))
		this.setData("prev",prevNumber)
		// console.log("image. ",images)

		
		
		
	}
	data() {
		return {
			next:prop("string",{default:"0"}),
			prev:prop('string',{default:"0"}),
			current:prop("number",{default:0}),
			images:prop("array",{watch:true}),
			selectedFile:prop("object"),
			previewUrl:prop("string",{default:"none"}),
			total:prop("number",{default:0}),
			size:prop("number",{default:0})
			
		}	
	}

	static methods() {
		return {
			onRemove:function(){
				console.log("dropped");
				this.setData("previewUrl","none");
			},
			onSuccess:function(event){
				
			}
		}
	}

	static actions() {
		return {
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
				this.$router.navigateTo("image");
				
			
				
			},
			
		
		

		}
	}
	
	static observers() {
		return {
			imageObserver:function(change){
				this.setData("total",this.getData("images").length)
			}.observes('images.length')
		}
	}

}

export {HomeComp}; 
