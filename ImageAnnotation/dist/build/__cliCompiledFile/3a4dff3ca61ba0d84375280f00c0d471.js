import { _defineProperty } from "@slyte/core/src/lyte-utils";
import "../../node_modules/@zoho/lyte-ui-component/components/javascript/lyte-drawer.js";
import "../../node_modules/@slyte/component/src/directives/lyte-shadow.js";
import {Component} from "../../node_modules/@slyte/component/index.js";
import { prop } from "../../node_modules/@slyte/core/index.js";
import { AnnotationSchema } from "../../data-store/schemas/Annotation";

class ImageComp extends Component {
    constructor() {
		super();
        this.currentRect = null;
        this.startX = 0;
        this.startY = 0;
        this.isDrawing = false;
        this.isDragging = false;
        this.isResizing = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        this.resizeHandle = null;
        this.rectToEntityMap = new Map();
        
  
        this.handleWindowResize = this.handleWindowResize.bind(this);
    }

    init() {
        const data = localStorage.getItem("imageData");
        console.log("Init - image Annotations:", this.data.imageAnnotations);
        
        if (data) {
            this.setData("imageUrl", data);
        }
    }

    didConnect() {
        const data = localStorage.getItem("imageData");
        console.log("image Annotations ", this.data.imageAnnotations);
        
        if (data) {
            this.setData("imageUrl", data);
            this.setData("Bbox", this.data.imageAnnotations);
            
            setTimeout(() => {
                this.loadExistingBoxes();
            }, 500);
        }
        
        
        window.addEventListener('resize', this.handleWindowResize);
    }

    didDisconnect() {
       
        window.removeEventListener('resize', this.handleWindowResize);
    }

    handleWindowResize() {
        // Redraw all rectangles when window resizes
        this.repositionAllBoxes();
    }

    repositionAllBoxes() {
        const parent = document.querySelector(".edit-image-container");
        if (!parent) return;

        const boxes = parent.querySelectorAll('.edit-rectangle-box');
        
        boxes.forEach(box => {
            const entity = this.rectToEntityMap.get(box);
            if (entity) {
                const bbox = entity.Bbox || entity.bbox;
                if (bbox) {
                    const containerWidth = parent.offsetWidth;
                    const containerHeight = parent.offsetHeight;
                    box.style.left = (bbox.x * containerWidth) + 'px';
                    box.style.top = (bbox.y * containerHeight) + 'px';
                    box.style.width = (bbox.width * containerWidth) + 'px';
                    box.style.height = (bbox.height * containerHeight) + 'px';
                }
            }
        });
    }

    loadExistingBoxes() {
        const parent = document.querySelector(".edit-image-container");
        const Bbox = this.getData("Bbox");
        console.log("Loading boxes, parent:", parent);
        console.log("Bbox data:", Bbox);
        if (!parent || !Bbox || !Bbox._recMap) {
            console.log("Cannot load boxes - missing parent or data");
            return;
        }
        console.log("Number of annotations in _recMap:", Bbox.length);
        const containerWidth = parent.offsetWidth;
        const containerHeight = parent.offsetHeight;
        Bbox._recMap.forEach((annotation, key) => {
            console.log("Creating box for annotation:", annotation);
            const deleteBtn=document.createElement("div");
            deleteBtn.className='annotation-delete-btn';
            deleteBtn.style.cursor="pointer"
            deleteBtn.innerHTML="delete"
            deleteBtn.style.backgroundColor="black";
            deleteBtn.style.textAlign="center"
            deleteBtn.style.color="white"
            deleteBtn.style.display="none"
            const textInput=document.createElement("input")
            textInput.type="text"
            textInput.value=annotation.text||"";
            textInput.placeholder="enter your text"
            textInput.className="annotation-input-box"
            textInput.addEventListener("click", (e) => {
                e.stopPropagation();
                textInput.focus();
            });

            textInput.addEventListener("mousedown", (e) => {
                e.stopPropagation();
                
            });

            textInput.addEventListener("input", (e) => {
                e.stopPropagation();
                const element=textInput.closest('.edit-rectangle-box')
                this.saveRectangleUpdate(element)
                if (e.key === "Enter") {
                    textInput.blur();
                }

            });

            textInput.addEventListener("blur", (e) => {
                annotation.$.set("text", textInput.value);
                annotation.$.save().then(() => {
                    console.log("Text saved");
                }, (err) => {
                    console.log("Text save failed", err);
                });
            });
            // deleteBtn.style.textAlign="right"

            deleteBtn.addEventListener("mouseover",(e)=>{
                deleteBtn.style.color="red";
                deleteBtn.style.display="block"
                e.stopPropagation()

            })
            deleteBtn.addEventListener("click",(e)=>{
                deleteBtn.style.display="none"
                e.stopPropagation()
            
                ImageComp.actions().handleDelete.call(this,annotation)
            })
            deleteBtn.addEventListener("mouseout",(e)=>{
                
                deleteBtn.style.color="white";
            })
            const box = document.createElement('div');
            box.className = 'edit-rectangle-box';
            box.style.position = 'absolute';
            box.style.border = '2px solid red';
            box.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
            box.style.cursor = 'move';
            box.style.zIndex = '10';
            box.appendChild(deleteBtn)
            box.appendChild(textInput)
            box.addEventListener("mouseover",()=>{
                deleteBtn.style.display="block"
                deleteBtn.style.cursor="pointer"
            })
            box.addEventListener("mouseout",()=>{
                deleteBtn.style.display="none"
            })
            box.dataset.entityId = annotation.$.get('id') || key;
            this.rectToEntityMap.set(box, annotation);
            
            const bbox = annotation.Bbox || annotation.bbox;
            
            if (bbox) {
                console.log("Bbox values:", bbox);
                
                // Check if values are percentages (0-1) or pixels
                const isPercentage = bbox.x <= 1 && bbox.y <= 1 && 
                                    bbox.width <= 1 && bbox.height <= 1;
                
                if (isPercentage) {
                    // Convert percentages to pixels
                    box.style.left = (bbox.x * containerWidth) + 'px';
                    box.style.top = (bbox.y * containerHeight) + 'px';
                    box.style.width = (bbox.width * containerWidth) + 'px';
                    box.style.height = (bbox.height * containerHeight) + 'px';
                } else {
                    // Use pixel values directly (backward compatibility)
                    const addPx = (val) => {
                        if (!val) return '0px';
                        return String(val).includes('px') ? val : val + 'px';
                    };
                    
                    box.style.left = addPx(bbox.x);
                    box.style.top = addPx(bbox.y);
                    box.style.width = addPx(bbox.width);
                    box.style.height = addPx(bbox.height);
                }
                
                console.log("Box final styles:", {
                    left: box.style.left,
                    top: box.style.top,
                    width: box.style.width,
                    height: box.style.height
                });
                
                parent.appendChild(box);
                
                this.createResizeHandles(box);
                console.log("Box created and handles added");
            } else {
                console.log("No bbox data found in annotation");
            }
        });
        
        console.log("Finished loading all boxes");
    }

    data(arg1) {
        return Object.assign(super.data({
            imageUrl: prop("string"),
			flgRectangle: prop("boolean", {default: false}),
			Bbox: prop("array", {default: [],watch:true})
        }), arg1);
    }

    createResizeHandles(rect) {
        const existingHandles = rect.querySelectorAll('.resize-handle');
        existingHandles.forEach(handle => handle.remove());

        const positions = ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'];
        positions.forEach(pos => {
            const handle = document.createElement('div');
            handle.className = `resize-handle resize-${pos}`;
            handle.style.position = 'absolute';
            handle.style.width = '8px';
            handle.style.height = '8px';
            handle.style.backgroundColor = 'red';
            handle.style.border = '1px solid white';
            handle.style.cursor = this.getCursorForPosition(pos);
            handle.style.display = 'none';
            handle.style.zIndex = '1000';
         
            switch(pos) {
                case 'nw': handle.style.left = '-4px'; handle.style.top = '-4px'; break;
                case 'ne': handle.style.right = '-4px'; handle.style.top = '-4px'; break;
                case 'sw': handle.style.left = '-4px'; handle.style.bottom = '-4px'; break;
                case 'se': handle.style.right = '-4px'; handle.style.bottom = '-4px'; break;
                case 'n': handle.style.left = 'calc(50% - 4px)'; handle.style.top = '-4px'; break;
                case 's': handle.style.left = 'calc(50% - 4px)'; handle.style.bottom = '-4px'; break;
                case 'e': handle.style.right = '-4px'; handle.style.top = 'calc(50% - 4px)'; break;
                case 'w': handle.style.left = '-4px'; handle.style.top = 'calc(50% - 4px)'; break;
            }
            
            rect.appendChild(handle);
        });
    }

    getCursorForPosition(pos) {
        const cursors = {
            'nw': 'nw-resize', 'ne': 'ne-resize', 'sw': 'sw-resize', 'se': 'se-resize',
            'n': 'n-resize', 's': 's-resize', 'e': 'e-resize', 'w': 'w-resize'
        };
        return cursors[pos] || 'default';
    }

    hideAllHandles() {
        const allHandles = document.querySelectorAll('.resize-handle');
        allHandles.forEach(handle => handle.style.display = 'none');
    }

    showHandlesForRect(rect) {
        this.hideAllHandles();
        const handles = rect.querySelectorAll('.resize-handle');
        handles.forEach(handle => handle.style.display = 'block');
    }

    saveRectangleUpdate(rect) {
        const entity = this.rectToEntityMap.get(rect);
        
        if (entity) {
            const container = document.querySelector('.edit-image-container');
            const inputText = rect.querySelector(".annotation-input-box"); // Get input from THIS rectangle
            console.log("inputText", inputText.value);
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;
            
            const x = parseInt(rect.style.left);
            const y = parseInt(rect.style.top);
            const width = parseInt(rect.style.width);
            const height = parseInt(rect.style.height);
            
            // Store as percentages (0-1 range)
            const config = {
                x: x / containerWidth,
                y: y / containerHeight,
                width: width / containerWidth,
                height: height / containerHeight
            };
            entity.$.set("text",inputText.value)
            
            console.log("Updating existing annotation (as percentages):", config);
            entity.$.set("Bbox", config);
            
            entity.$.save().then(function(data) {
                console.log("Update successful");
            }, function(err) {
                console.log("Update failed", err);
            });
        } else {
            console.log("No entity found for this rectangle");
        }
    }

    static methods(arg1) {
        return Object.assign(super.methods({
        }), arg1);
    }

    static actions(arg1) {
        return Object.assign(super.actions({
            handleRectangleCreation: function(event) {
                event.preventDefault();
                
                if(event.target.classList.contains("annotation-delete-btn") || event.target.classList.contains("annotation-input-box"))return;
                if(!this.getData("flgRectangle")) return;
               
                if (event.target.classList.contains('resize-handle')) {
                    this.isResizing = true;
                    this.currentRect = event.target.parentElement;
                    this.resizeHandle = event.target;
                    this.startX = event.clientX;
                    this.startY = event.clientY;
                    const rectStyle = this.currentRect.style;
                    this.initialLeft = parseInt(rectStyle.left);
                    this.initialTop = parseInt(rectStyle.top);
                    this.initialWidth = parseInt(rectStyle.width);
                    this.initialHeight = parseInt(rectStyle.height);
                    return;
                }
                
                if (event.target.classList.contains("edit-rectangle-box")) {
                    this.currentRect = event.target;
                    this.isDragging = true;
                    
                    this.showHandlesForRect(this.currentRect);
                    
                    const container = document.querySelector('.edit-image-container');
                    const containerRect = container.getBoundingClientRect();
                    const rectRect = this.currentRect.getBoundingClientRect();
                    
                    this.dragOffsetX = event.clientX - rectRect.left;
                    this.dragOffsetY = event.clientY - rectRect.top;
                    return;
                }
                
                this.hideAllHandles();
                
                const container = document.querySelector('.edit-image-container');
                if (!container) return;
                
                const rect = container.getBoundingClientRect();
                
                this.startX = event.clientX - rect.left;
                this.startY = event.clientY - rect.top;
                this.isDrawing = true;
                const deleteBtn=document.createElement("div");
                deleteBtn.className='annotation-delete-btn';
                deleteBtn.style.cursor="pointer"
                deleteBtn.innerHTML="delete"
                deleteBtn.style.color="white"
                deleteBtn.style.backgroundColor="black"
                deleteBtn.style.textAlign="center"
                deleteBtn.style.display="none"
                deleteBtn.addEventListener("mouseover",(e)=>{
                    deleteBtn.style.display="block"
                    deleteBtn.style.color="red";


                })
                deleteBtn.addEventListener("click",(e)=>{
                deleteBtn.style.display="none"
                e.stopPropagation()
            
                // ImageComp.actions().handleDelete.call(this,annotation)
                })
                
                deleteBtn.addEventListener("mouseout",(e)=>{
                    deleteBtn.style.color="white";
                    deleteBtn.style.display="none"

                })
                 const textInput=document.createElement("input")
            textInput.type="text"
            textInput.value="";
            textInput.placeholder="enter your text"
            textInput.className="annotation-input-box"

            textInput.addEventListener("click", (e) => {
                e.stopPropagation();
                textInput.focus();
            });

            textInput.addEventListener("mousedown", (e) => {
                e.stopPropagation();
            });

            textInput.addEventListener("keydown", (e) => {
                e.stopPropagation();
                if (e.key === "Enter") {
                    textInput.blur();
                }
            });

            
                this.currentRect = document.createElement('div');
                this.currentRect.className = 'edit-rectangle-box';
                this.currentRect.style.position = 'absolute';
                this.currentRect.style.left = this.startX + 'px';
                this.currentRect.style.top = this.startY + 'px';
                this.currentRect.style.width = '0px';
                this.currentRect.style.height = '0px';
                this.currentRect.style.border = '2px solid red';
                this.currentRect.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
                this.currentRect.style.cursor = 'move';
                this.currentRect.appendChild(deleteBtn)
                this.currentRect.appendChild(textInput)
                this.currentRect.addEventListener("mouseover",()=>{
                    deleteBtn.style.display="block"

                })
                 this.currentRect.addEventListener("mouseout",()=>{
                    deleteBtn.style.display="none"

                })
                container.appendChild(this.currentRect);
                
            },
            
            resizeRectangle: function(event) {
                if (this.isResizing && this.currentRect && this.resizeHandle) {
                    const deltaX = event.clientX - this.startX;
                    const deltaY = event.clientY - this.startY;
                    const handleClass = this.resizeHandle.className;
                    
                    let newLeft = this.initialLeft;
                    let newTop = this.initialTop;
                    let newWidth = this.initialWidth;
                    let newHeight = this.initialHeight;
                    
                    if (handleClass.includes('resize-w')) {
                        newLeft = this.initialLeft + deltaX;
                        newWidth = this.initialWidth - deltaX;
                    }
                    if (handleClass.includes('resize-e')) {
                        newWidth = this.initialWidth + deltaX;
                    }
                    if (handleClass.includes('resize-n')) {
                        newTop = this.initialTop + deltaY;
                        newHeight = this.initialHeight - deltaY;
                    }
                    if (handleClass.includes('resize-s')) {
                        newHeight = this.initialHeight + deltaY;
                    }
                    
                    if (newWidth < 10) newWidth = 10;
                    if (newHeight < 10) newHeight = 10;
                    
                    this.currentRect.style.left = newLeft + 'px';
                    this.currentRect.style.top = newTop + 'px';
                    this.currentRect.style.width = newWidth + 'px';
                    this.currentRect.style.height = newHeight + 'px';
                    
                    return;
                }
                       
                if (this.isDragging && this.currentRect && !this.isDrawing) {
                    const container = document.querySelector('.edit-image-container');
                    const containerRect = container.getBoundingClientRect();
                    
                    const newLeft = event.clientX - containerRect.left - this.dragOffsetX;
                    const newTop = event.clientY - containerRect.top - this.dragOffsetY;
                    
                    this.currentRect.style.left = Math.max(0, newLeft) + 'px';
                    this.currentRect.style.top = Math.max(0, newTop) + 'px';
                    return;
                }
                
                if (!this.currentRect || !this.isDrawing) return;
                
                const container = document.querySelector('.edit-image-container');
                if (!container) return;
                
                const rect = container.getBoundingClientRect();
                const currentX = event.clientX - rect.left;
                const currentY = event.clientY - rect.top;
                
                const width = Math.abs(currentX - this.startX);
                const height = Math.abs(currentY - this.startY);
                
                const left = Math.min(currentX, this.startX);
                const top = Math.min(currentY, this.startY);
                
                this.currentRect.style.left = left + 'px';
                this.currentRect.style.top = top + 'px';
                this.currentRect.style.width = width + 'px';
                this.currentRect.style.height = height + 'px';
            },
            
            handleRectangleRelease: function(event) {
                console.log("this is updating", this.currentRect);
                console.log("evnet",event.target.classList)
                 if (this.isDrawing && this.currentRect) {
        this.createResizeHandles(this.currentRect);
        this.showHandlesForRect(this.currentRect);

        // create new entity
        var rec = this.$db.newEntity({schema: AnnotationSchema});

        const container = document.querySelector('.edit-image-container');
        const inputBox = this.currentRect.querySelector(".annotation-input-box");
        const textInput = inputBox ? inputBox.value : "";

        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        const x = parseInt(this.currentRect.style.left);
        const y = parseInt(this.currentRect.style.top);
        const width = parseInt(this.currentRect.style.width);
        const height = parseInt(this.currentRect.style.height);

        var config = {
            x: x / containerWidth,
            y: y / containerHeight,
            width: width / containerWidth,
            height: height / containerHeight
        };

        rec.$.set("Bbox", config);
        rec.$.set('text', textInput);
        var image_id = localStorage.getItem("imageId");
        rec.$.set("image_id", image_id);

       
        this.rectToEntityMap.set(this.currentRect, rec);


        const deleteBtn = this.currentRect.querySelector(".annotation-delete-btn");
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            ImageComp.actions().handleDelete.call(this, rec);
        };
        var temp=this;
       // In handleRectangleRelease, replace the save operation:
        
        rec.$.save().then(function() {
            console.log("success");
        }, function(err) {
            console.log("Save failed - full error:", err);
            console.error("Error details:", {
                status: err.status,
                statusText: err.statusText,
                response: err.response
            });
        });
        // debugger
        // this.$db.getAll({schema:AnnotationSchema}).then(function(){
        //     const data=temp.$db.cache.getAll({schema:AnnotationSchema});
        //     console.log("data",data);
        // },function(){

        // })
        

        
        
       
        
        
    } else if ((this.isDragging || this.isResizing) && this.currentRect) {
                    console.log("Saving updated rectangle");
                    this.saveRectangleUpdate(this.currentRect);
                }
               
                this.isDrawing = false;
                this.isDragging = false;
                this.isResizing = false;
                this.resizeHandle = null;
                this.currentRect = null;
                var element=document.querySelectorAll('.edit-rectangle-box');
                
                
               
            },
            
            handleDelete: function(annotation) {
                
                const rectangles=document.querySelectorAll('.edit-rectangle-box');
                rectangles.forEach(element => {
                    if(this.rectToEntityMap.get(element)===annotation){
                        element.remove();
                        this.rectToEntityMap.delete(element)
                        
                    }
                });
                const rect=this.$db.cache.getEntity({schema:AnnotationSchema ,pK:annotation.id})
                rect.$.delete();
                rect.$.save().then(function(){
                    //success
                    console.log("success")
                },function(){
                    //failed callback
                })
                console.log("delete ",rect)

                
            },
            
            handleDownload: function() {
                console.log('Download functionality would be implemented here');
                alert('Download functionality would capture the image with rectangles');
            },
            
            handleRectangleClick: function(event) {
                if(event.target.style.backgroundColor==="white"){
                    event.target.style.backgroundColor="transparent"
                    event.target.style.color="white"
                }
                else{
                    event.target.style.backgroundColor="white";
                    event.target.style.color="black"
                }
                event.target.style.borderRadius="10px"
                var current = !this.getData("flgRectangle");
                this.setData("flgRectangle", current);
            }
        }), arg1);
    }

    static observers(arg1) {
        return Object.assign(super.observers({
            Bbox: function(newValue) {
                console.log("newValue",newValue)
                if (newValue && newValue._recMap && newValue._recMap.size > 0) {
                    console.log("Bbox observer triggered, reloading boxes");
                    setTimeout(() => {
                        this.loadExistingBoxes();
                    }, 50);
                }
            }.observes('Bbox.*')
        }), arg1);
    }

    _() {
        _;
    }
}

ImageComp._template = "<template tag-name=\"image-comp\" @shadow-supported=\"\"> <!-- <div class=\"edit-header\"> <div class=\"edit-rectangle\">Draw Rectangle</div> <div class=\"edit-download\" onclick=\"{{action('handleDownload')}}\">Download</div> <div class=\"edit-delete\" onclick=\"{{action('handleDelete')}}\">Delete All</div> </div> --> <div class=\"image-main\"> <div class=\"image-drawer\"> <lyte-drawer lt-prop-selected-class=\"activeclass\" lt-prop-close-on-select=\"true\" lt-prop-layout=\"overlay\" lt-prop-yield=\"true\" lt-prop-show=\"true\" class=\"drawer\" lt-prop-freeze=\"true\" lt-prop-animation-duration=\"0.3s\" lt-prop-show-close-button=\"true\"> <template is=\"registerYield\" yield-name=\"drawerPanel\"> <lyte-drawer-body class=\"image-body\"> <lyte-drawer-label class=\"image-label\"> Shapes</lyte-drawer-label> <lyte-drawer-item onclick=\"{{action('handleRectangleClick',event)}}\" data-value=\"sent\" class=\"image-label-items image-rect\"> Rectangle </lyte-drawer-item> <!-- <lyte-drawer-item data-value=\"draft\" class=\"image-label-items\"> circle </lyte-drawer-item> <lyte-drawer-item data-value=\"spam\" class=\"image-label-items\"> square </lyte-drawer-item> --> </lyte-drawer-body> </template> </lyte-drawer> </div> <div class=\"edit-image-container\" onmousedown=\"{{action('handleRectangleCreation',event)}}\" onmousemove=\"{{action('resizeRectangle',event)}}\" onmouseup=\"{{action('handleRectangleRelease',event)}}\"> <img class=\"edit-image\" src=\"{{imageUrl}}\" alt=\"Editable Image\" draggable=\"false\"> <!-- <div lyte-for=\"{{Bbox}} as item ind\" class=\"edit-rectangle-box\" style=\"width:{{item.Bbox.width}}px;height:{{item.Bbox.height}}px;top:{{item.Bbox.x}}px;left:{{item.Bbox.y}}px;position: absolute;\"></div> --> </div> </div> </template><style>/* .edit-header {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    padding: 10px;\n    background-color: #121212;\n    border-bottom: 6px solid rgb(217, 216, 199);\n} */\n\n/* .edit-rectangle, .edit-download, .edit-delete {\n    padding: 8px 16px;\n    background-color: #eff1f4;\n    color: rgb(0, 0, 0);\n    border: none;\n    border-radius: 4px;\n    cursor: pointer;\n    font-size: 14px;\n} */\n\n/* .edit-rectangle:hover, .edit-download:hover, .edit-delete:hover {\n    background-color: #0056b3;\n} */\n /* .edit-delete {\n    background-color: #dc3545;\n}\n\n.edit-delete:hover {\n    background-color: #c82333;\n} */\n .annotation-input-box{\n/* background-color: rgb(255, 255, 255);\ncolor:rgb(0, 0, 0);\nborder:none; */\nwidth: 99%;\nborder: none;\nheight: 20px;\n\nborder-bottom: solid 2px black;\n\n/* display: flex; */\n\n }\n.image-main{\n  \n   display: flex;\n   width: 100%;\n   \n  \n}\n.lyteModal{\n    background-color: black;\n    color:white;\n}\n.image-drawer{\n    flex:0\n}\n.lyteDrawerOpenElem{\n    background-color: #0b0b0b;\n}\n\n.image-label{\n    font-weight: bolder;\n    font-size: 30px;\n    color:white;\n\n}\n\n/* .activeclass,.activeclass:hover{\n background-color: rgb(10, 10, 10);\n border-radius: 10px;\n} */\n.image-label-items{\n    color:rgb(254, 253, 253);\n}\n.image-label-items:hover{\nbackground-color: rgb(255, 255, 255);\nborder-radius: 10px;\ncolor:rgb(0, 0, 0);\n}\n.edit-image-container {\n   flex:2;\n   \n    user-select: none;\n}\n\n\n\n.edit-image {\n    width: 100%;\n   \n  \n    height: 100vh;\n    border-radius: 5px;\n    background-color: rgb(216, 216, 202);\n   \n    \n}\n\n.edit-rectangle-box {\n    position: absolute;\n    border: 2px solid red;\n    background-color: rgba(255, 0, 0, 0.1);\n    cursor: move;\n    z-index: 10;\n}\n\n.edit-rectangle-box:hover {\n    border-color: #ff4444;\n    background-color: rgba(255, 0, 0, 0.2);\n}</style>";;
ImageComp._dynamicNodes = [{"t":"r","p":[3,1,1,1],"dN":[{"t":"cD","p":[1,1],"in":2,"sibl":[1]},{"t":"a","p":[1,3]},{"t":"cD","p":[1,3],"in":1,"sibl":[0]},{"t":"cD","p":[1],"in":0}],"dc":[2,1,0],"hc":true,"trans":true,"in":1,"sibl":[0]},{"t":"cD","p":[3,1,1],"in":0},{"t":"a","p":[3,3]},{"t":"a","p":[3,3,1]},{"type":"dc","trans":true,"hc":true,"p":[1,0]}];;
ImageComp._observedAttributes = ["imageUrl", "flgRectangle", "Bbox"];
export {ImageComp};

ImageComp.register("image-comp", {
    hash: "ImageComp_4",
    refHash: "C_ImageAnnotation_app_0"
});