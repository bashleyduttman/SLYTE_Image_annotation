"use strict";
(self["webpackChunkImageannotation"] = self["webpackChunkImageannotation"] || []).push([["components/javascript/image-comp"],{

/***/ 54259987:
/*!*********************************************!*\
  !*** ./components/javascript/image-comp.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ImageComp": () => (/* binding */ ImageComp)
/* harmony export */ });
/* harmony import */ var _node_modules_zoho_lyte_ui_component_components_javascript_lyte_drawer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/@zoho/lyte-ui-component/components/javascript/lyte-drawer.js */ 91630440);
/* harmony import */ var _node_modules_slyte_component_src_directives_lyte_shadow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/@slyte/component/src/directives/lyte-shadow.js */ 9665350);
/* harmony import */ var _node_modules_slyte_component_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../node_modules/@slyte/component/index.js */ 26633);
/* harmony import */ var _node_modules_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../node_modules/@slyte/core/index.js */ 56505143);
/* harmony import */ var _data_store_schemas_Annotation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../data-store/schemas/Annotation */ 38834365);







class ImageComp extends _node_modules_slyte_component_index_js__WEBPACK_IMPORTED_MODULE_3__.Component {
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
            imageUrl: (0,_node_modules_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("string"),
			flgRectangle: (0,_node_modules_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("boolean", {default: false}),
			Bbox: (0,_node_modules_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("array", {default: [],watch:true})
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
        var rec = this.$db.newEntity({schema: _data_store_schemas_Annotation__WEBPACK_IMPORTED_MODULE_2__.AnnotationSchema});

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
                const rect=this.$db.cache.getEntity({schema:_data_store_schemas_Annotation__WEBPACK_IMPORTED_MODULE_2__.AnnotationSchema ,pK:annotation.id})
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


ImageComp.register("image-comp", {
    hash: "ImageComp_4",
    refHash: "C_ImageAnnotation_app_0"
});

/***/ }),

/***/ 91630440:
/*!***********************************************************************************!*\
  !*** ./node_modules/@zoho/lyte-ui-component/components/javascript/lyte-drawer.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LyteDrawerComponent": () => (/* binding */ LyteDrawerComponent)
/* harmony export */ });
/* harmony import */ var _helpers_helpers_dev_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/helpers-dev.js */ 60488310);
/* harmony import */ var _lyte_modal_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lyte-modal.js */ 38197755);
/* harmony import */ var _slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../@slyte/core/index.js */ 56505143);
/* harmony import */ var _component_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../component.js */ 50761997);
/* harmony import */ var _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../lyte-dom/modules/lyte-dom-utils.js */ 19978124);
/* harmony import */ var _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3__);







window.addCloseEvent = function() {

	document.addEventListener('click',function(event){
		var ele = event.target;
		while(!_lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3___default()(ele).hasClass('modalWrapper') && ele.tagName != "LYTE-DRAWER-BODY" && ele.tagName != "LYTE-DRAWER" && ele.tagName !="LYTE-DRAWER-FREEZE" && ele.tagName != "LYTE-MODAL-FREEZE" && ele.tagName != 'LYTE-DROP-BOX' && ele.tagName != 'HTML'){
            ele = ele.parentElement;
            if(!ele){
                return
            }
        }
		if(ele.tagName == 'HTML' || ele.tagName == "LYTE-MODAL-FREEZE" || ele.tagName == "LYTE-DRAWER-FREEZE"){
			var last = window._LyteDrawer_.length-1;
			if(last > -1){
				if(window._LyteDrawer_[last].tagName == "LYTE-DRAWER" && window._LyteDrawer_[last].ltProp('show') && window._LyteDrawer_[last].ltProp("overlayClose")){
					if(window._LyteDrawer_[last]){
						window._LyteDrawer_[last].ltProp('show',false);
					}
				}
			}
		}
	},true);
	document.addEventListener('keydown',function(event){
			event = event || window.event;
            var isEscape = false;
            if ("key" in event) {
                isEscape = (event.key == "Escape" || event.key == "Esc");
            } else {
                isEscape = (event.keyCode == 27);
            }
            if (isEscape) {
				var last = window._LyteDrawer_.length-1;
				if(last > -1){
					if(window._LyteDrawer_[last].tagName == "LYTE-DRAWER" && window._LyteDrawer_[last].ltProp('show') && window._LyteDrawer_[last].ltProp("closeOnEscape")){
						if(window._LyteDrawer_[last]){
							window._LyteDrawer_[last].ltProp('show',false);
						}
					}
				}
            }
	},true);
};

/**
 * Renders a Drawer
 * @component lyte-drawer
 * @version  4.0.0
 * @methods onBeforeShow,onShow,onBeforeClose,onClose,onSelected
 */
if(!window._LyteDrawer_){
    window._LyteDrawer_ = [];
}

class LyteDrawerComponent extends _component_js__WEBPACK_IMPORTED_MODULE_2__.Component {
    constructor() {
        super();
    }

    data(arg1) {
		return Object.assign(super.data({
			/** 
			 * @componentProperty  {left | right} ltPropPosition=left
			 */
			ltPropPosition:(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("string",{"default":"left"}),
			/** 
			 * @componentProperty  {string} ltPropWidth=200px
			 */
			ltPropWidth:(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("string",{"default":"200px"}),
			/** 
			 * @componentProperty  {string} ltPropHeight=100%
			 */
			ltPropHeight:(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("string",{"default":"100%"}),
			/** 
			 * @componentProperty  {object} ltPropModal={}
			 */
			ltPropModal:(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("object",{"default":{}}),
			/** 
			 * @componentProperty  {boolean} ltPropFreeze=true
			 */
			ltPropFreeze:(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("boolean",{"default":true}),
			/** 
			 * @componentProperty  {string} ltPropAnimationDuration=0.3s
			 */
			ltPropAnimationDuration:(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("string",{"default":"0.3s"}),
			/** 
			 * @componentProperty  {boolean} ltPropMiniVariant=false
			 */
			ltPropMiniVariant:(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("boolean",{"default":false}),
			/** 
			 * @componentProperty  {string} ltPropUserValue=name
			 */
			ltPropUserValue: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("string",{default:"name"}),
			/** 
			 * @componentProperty  {string} ltPropSystemValue=value
			 */
			ltPropSystemValue:(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("string",{default:"value"}),
			/** 
			 * @componentProperty {array} ltPropOptions
			 * @default []
			 */
			ltPropOptions:(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("array",{default:[]}),
			/** 
			 * @componentProperty  {boolean} ltPropShow=false
			 */
			ltPropShow:(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("boolean",{"default":false}),
			/** 
			 * @componentProperty  {string} ltPropSelectedClass
			 */
			ltPropSelectedClass:(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("string"),
			/** 
			 * @componentProperty  {string} ltPropSelected
			 */
			ltPropSelected:(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("string"),
			/** 
			 * @componentProperty  {boolean} ltPropCloseOnSelect=false
			 */
			ltPropCloseOnSelect:(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("boolean",{"default":false}),
			/** 
			 * @componentProperty  {boolean} ltPropOverlayClose=true
			 */
			ltPropOverlayClose : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("boolean",{"default":true}),
			/** 
			 * @componentProperty  {boolean} ltPropShowOpenButton=true
			 */
			 ltPropShowOpenButton : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("boolean",{"default":true}),
			/** 
			 * @componentProperty  {boolean} ltPropShowCloseButton=true
			 */
			 ltPropShowCloseButton : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("boolean",{"default":true}),
			 /** 
			 * @componentProperty  {boolean} ltPropCloseOnEscape=true
			 */
			ltPropCloseOnEscape : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("boolean",{"default":true}),
			/** 
			 * @componentProperty  {array} ltPropDisabledList
			 * @default []
			 */
			 ltPropDisabledList:(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("array",{"default":[]}),
			/** 
			 * @componentProperty  {string} ltPropWrapperClass
			 */
			ltPropWrapperClass:(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("string"),
			/** 
			 * @componentProperty  {inline | overlay |  inlineOverlay} ltPropLayout=overlay
			 */
			ltPropLayout: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("string",{"default":"overlay"}),
			/** 
			 * @componentProperty  {string} ltPropExpandMiniVariant="click"
			 */
			ltPropExpandMiniVariant: (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("string",{
				"default": "click"
			}),
			/** 
			 * @componentProperty  {string} ltPropMiniVariantWidth=50px
			 */
			ltPropMiniVariantWidth : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("string",{"default": "50px"}),
			/** 
			 * @componentProperty  {boolean} ltPropYield=false
			 */
			ltPropYield:(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("boolean",{default:false}),
			ltPropDataTabindex : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("string",{"default" : ""}),

			returnedFalse : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("boolean",{"default" : false}),
			currentPosition : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("string"),
			config : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("object",{
				"default" : {}
			}),
			isMouseEvent : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("boolean",{"default":false}),
			modalAttr : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_4__.prop)("object",{"default": {}})
		}), arg1);		
	}

    // methods calling start
    selected(selectedValue, lyteDrawerItem) {
		if(this.getMethods("onSelected")){
			this.executeMethod("onSelected",selectedValue,lyteDrawerItem,this); 
		}
	}

    beforeShow(skip) {
		if(!skip && this.getMethods("onBeforeShow")){
			return this.executeMethod("onBeforeShow", this); 
		}
	}

    show(skip) {
		if(!skip && this.getMethods("onShow")){
			this.executeMethod("onShow", this); 
		}
	}

    beforeClose(skip) {
		if(!skip && this.getMethods("onBeforeClose")){
			return this.executeMethod("onBeforeClose", this); 
		}
	}

    close(skip) {
		if(!skip && this.getMethods("onClose")){
			this.executeMethod("onClose", this); 
		}
	}

    // methods calling end

    getDrawerForModal() {
		var actualModalDiv = this.$node.querySelector("lyte-modal").component.actualModalDiv;
		if(actualModalDiv) {
			return actualModalDiv.querySelector("lyte-modal-content");
		}
	}

    getParentElement() {
		/* 
			get parent element based on layout
		*/
		var layout = this.data.ltPropLayout;
		if(layout == "overlay"){
			return this.getDrawerForModal();
		}
		return this.$node.querySelector(".lyteDrawerInlineBody");
	}

    getDrawerPanel() {
		var layout = this.data.ltPropLayout;
		if(layout == "overlay"){
			return this.getDrawerForModal();
		}
		return this.$node.querySelector(".lyteDrawerPanel");
	}

    getLyteDrawerItem(parentElement, drawerItemvalue) {
		/* 
			get lyte drawer item from parent element
		*/
		return parentElement.querySelector("[data-value ='"+window._lyteUiUtils.escape(drawerItemvalue)+"']");
	}

    getActiveDrawerItem(parentElement) {
		/* 
			get active drawer item using active class
		*/
		return parentElement.querySelector(".lyteDrawerActiveItem");
	}

    activeClassActionForDrawerItem(element, action) {
		/*
		function used to add or remove activeClass from a element
		*/ 
		if(element){
			var selectedClass = this.data.ltPropSelectedClass;
			element.classList[action]("lyteDrawerActiveItem");
			if(selectedClass){
				element.classList[action](selectedClass);
			}
		}
	}

    removePreviouslySelected(parent) {
		/* 
			removing the selected class from the previously selected element
		*/
		var prevActiveDrawerItem = this.getActiveDrawerItem(parent);
		this.activeClassActionForDrawerItem(prevActiveDrawerItem, "remove");
	}

    addDisableClassForDrawerItem(parentElement, value) {
		/* 
			adding disabled class to drawerItem
		*/
		var element = this.getLyteDrawerItem(parentElement, value);
		if(element){
			element.classList.add("lyteDrawerDisabledItem");
		}
	}

    removeDisableClassFromDrawerItem(element) {
		/* 
			remove disabled class from lyte drawer item
		*/
		element.classList.add("lyteDrawerDisabledItem");
	}

    selectDrawerItem() {
		/* 
			selecting drawerItem using ltPropSelected
		*/
		var close = this.data.ltPropCloseOnSelect,
		parent = this.getDrawerPanel();
		if(parent){
			var selected = this.data.ltPropSelected;
			var curActiveDrawerItem = this.getLyteDrawerItem(parent, selected);
			this.removePreviouslySelected(parent);
			this.activeClassActionForDrawerItem(curActiveDrawerItem, "add");
			if(curActiveDrawerItem){
				if(close){
					this.setData("ltPropShow",false);
				}
			}
		}
		else {
			this.setData("config.selection",true);
		}
	}

    disableDrawerItems() {
		/* 
			disabling drawerItem using ltPropDisableList
		*/
		var array = this.getData("ltPropDisabledList"),
		parent = this.getDrawerPanel();
		if(parent){
			var disabledlist = parent.querySelectorAll(".lyteDrawerDisabledItem");
			for(var index = 0 ; index<disabledlist.length;index++){
				this.removeDisableClassFromDrawerItem(disabledlist[index]);
			}
			for(var index = 0 ; index<array.length;index++){
				this.addDisableClassForDrawerItem(parent, array[index]);
			}
		}
		else {
			this.setData("config.disable",true);
		}
	}

    removeDrawerFromStore() {
		/* 
		removing the lyteDrawer node from global variable(_LyteDrawer_)
		*/
		var drawer = this.$node;
		var lyteDrawers =  _LyteDrawer_;
		var drawerlength = lyteDrawers.length;
		for(var index=0; index<drawerlength; index++) {
			if(lyteDrawers[index] === drawer) {
				lyteDrawers.splice(index,1);
				break;
			}
		}
	}

    getPosition() {
		/* checking the rtl direction and getting correct position */
		return this.data.ltPropPosition;
	}

    initializeDataForModal() {
		/* setting initial data for modal like slideFromLeft or slideFromRight*/
		var lyteModal = this.$node.querySelector("lyte-modal");
		var offset = lyteModal.ltProp("offset"),
		currentPosition = this.getPosition(),
		seconds =  (this.data.ltPropAnimationDuration || '').replace(/s/g, '');
		lyteModal.ltProp("transition",{
			"animation": "slideFrom"+window._lyteUiUtils.capitalize(currentPosition),
			"duration":seconds
		});
		lyteModal.ltProp("offset",{[currentPosition] : "0px", top: offset.top});
	}

    getFreezeLayer() {
		/* To get freeze layer element from dom*/
		return this.$node.querySelector("lyte-drawer-freeze");
	}

    showFreezeLayer() {
		/* To show freeze layer for inline and inlineOverlay drawer*/
		if(this.data.ltPropFreeze) {
			var freezeLayer = this.getFreezeLayer();
			freezeLayer.style.display = "block";
			setTimeout(function(){
				freezeLayer.classList.add('lyteDrawerFreezeLayerShown');
			},0);
		}
	}

    hideFreezeLayer(initialStage) {
		/* To hide freeze layer for inline and inlineOverlay drawers*/
		if(this.data.ltPropFreeze) {
			var freezeLayer = this.getFreezeLayer();
			freezeLayer.classList.remove('lyteDrawerFreezeLayerShown');
		}
	}

    focusDrawerPanel() {
		this.getDrawerPanel().focus();
	}

    showInlineDrawer() {
		/* Used to open inline and inlineOverlay drawer*/
		var returnValue =  this.beforeShow();
		if(returnValue === false){
			this.setData({
				"returnedFalse": true,
				"ltPropShow": false
			});
		}
		else{
			this.showFreezeLayer();
			this.show();
			_LyteDrawer_.push(this.$node);
		}
	}

    closeInlineDrawer() {
		/* close the opened inline and inlineOverlay drawer*/
		var returnValue = this.beforeClose();
		if(returnValue === false){
			this.setData({
				"returnedFalse": true,
				"ltPropShow": true
			});
		}
		else{
			this.hideFreezeLayer();
			this.close();
			this.removeDrawerFromStore();	
		}
	}

    isFocusedLyteDrawerItem(element) {
		var focusClassName = "lyteDrawerItemFocused";
		return element.classList.contains(focusClassName);
	}

    isActiveLyteDrawerItem(element) {
		var activeClassName = "lyteDrawerActiveItem";
		return element.classList.contains(activeClassName);
	}

    isDisabledLyteDrawerItem(element) {
		var disabledClassname = "lyteDrawerDisabledItem";
		return element.classList.contains(disabledClassname);
	}

    isLyteDrawerItem(element) {
		if(element && element.tagName == "LYTE-DRAWER-ITEM" && 
		!this.isDisabledLyteDrawerItem(element)) {
			return true;
		}
	}

    getActiveOrFocusedItem(elements) {
		var len = elements.length,
		activeIndex;
		for(var index=0; index<len; index++) {
			if(this.isFocusedLyteDrawerItem(elements[index])){
				return index;
			}
			else if(this.isActiveLyteDrawerItem(elements[index])) {
				activeIndex =  index;
			}
		}
		return activeIndex;
	}

    isNotActiveElement(element) {
		if(element) {
			return !element.classList.contains("lyteDrawerActiveItem");
		}
	}

    isValidFocusableItem(element) {
		return !element.classList.contains("lyteDrawerDisabledItem");
	}

    findNextActive(elements, index, forward) {
		var increment = forward ? 1 : -1,
		eleLen = elements.length;
		if(index === undefined){
			index = forward ? 0 : eleLen-1;
		}
		else {
			index = index + increment;
		}
		for( ;  forward ? index < eleLen : index > -1; index = index + increment ) {
			if( this.isValidFocusableItem(elements[index])) {
				return elements[index];
			}
		}
	}

    getAllDrawerItems() {
		var parentElement = this.getDrawerPanel();
		return parentElement.querySelectorAll("lyte-drawer-item");
	}

    isValidateElement(element) {
		return element != document 
		&& element != document.body
		&& element != document.documentElement 
		 && element.tagName != 'LYTE-DRAWER-BODY';
	}

    elementsFromPoint(x, y) {
        var elements = [], 
		element = document.elementFromPoint(x, y), 
		prevElement;
        while (this.isValidateElement(element)) {
            element._pointerEvents = element.style.pointerEvents;
            element.style.pointerEvents = 'none';
            elements.push(element);
            prevElement = element;
            element = document.elementFromPoint(x, y);
            if (prevElement === element) {
                break
            }
        }
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.pointerEvents = elements[i]._pointerEvents;
            delete elements[i]._pointerEvents;
        }
        return elements;
    }

    openDrawer() {
		var parentElement = this.getDrawerPanel();
		var expandMiniVariant =  this.data.ltPropExpandMiniVariant;
		var eventName = this.data.isMouseEvent?"mouseenter":expandMiniVariant;
		this.setData("ltPropShow",true);
		if(this.data.ltPropShow) {
			parentElement.removeEventListener( eventName, this._bindedDrawerOpen, true);
			if(this.data.isMouseEvent) {
				document.addEventListener( "mousemove", this._bindedDrawerClose, true);
			}
		}
	}

    closeOnHover(event) {
        if (this.$node) {
            var elements = document.elementsFromPoint ? document.elementsFromPoint(event.clientX, event.clientY) 
			: this.elementsFromPoint(event.clientX, event.clientY);
			var parentElement = this.getDrawerPanel();
            if (elements.indexOf(parentElement) == -1 ) {
				this.setData("ltPropShow", false);
				if(!this.data.ltPropShow) {
					document.removeEventListener( "mousemove", this._bindedDrawerClose, true);
					parentElement.addEventListener( "mouseenter", this._bindedDrawerOpen, true);
				}
            }
        }
    }

    isMiniVariant() {
		return this.data.ltPropMiniVariant;
	}

    isMouseEvent(eventName) {
		return /^(mouseenter|mousemove|mouseover|hover)$/.test(eventName);
	}

    initializeEvent() {
		if(this.isMiniVariant()) {
			var parentElement = this.getDrawerPanel();
			if(parentElement) {
				var expandMiniVariant = this.data.ltPropExpandMiniVariant;
				var eventName = expandMiniVariant;
				if(eventName) {
					var isMouseEvent =  this.isMouseEvent(eventName);
					this._bindedDrawerOpen = this.openDrawer.bind(this);
					if(isMouseEvent) {
						this._bindedDrawerClose = this.closeOnHover.bind(this);
						eventName = "mouseenter";
					}
					parentElement.addEventListener(eventName,this._bindedDrawerOpen,true);
					this.setData("isMouseEvent", isMouseEvent);
				}
			}
		}
	}

    checkAndUpdateSelectedValue(config) {
		if(config.selection) {
			this.selectDrawerItem();
			this.$addon.objectUtils(config, "delete", "selection");
		}
	}

    checkAndUpdateDisbaleList(config) {
		if(config.disable) {
			this.disableDrawerItems();
			this.$addon.objectUtils(config, "delete", "disable");
		}
	}

    initializeDrawerDefaultData() {
		var config = this.data.config;
		this.checkAndUpdateSelectedValue(config);
		this.checkAndUpdateDisbaleList(config);
	}

    moveIntoView(element) {
		var panel = this.getDrawerPanel(),
		panelScrollTop = panel.scrollTop,
		elementTop = element.offsetTop;

		if( elementTop <= panelScrollTop ) {
			panel.scrollTop = elementTop;
		}
		else {
			panel.scrollTop =elementTop + element.offsetHeight - panel.offsetHeight;
		}
	}

    updateModalAttr() {
		var modalAttr =  this.$addon.deepCopyObject(this.data.ltPropModal);
		var notAllowed = ["width", "height","showCloseButton","closeOnEscape", 
		"allowMultiple", "overlayClose","freeze", "wrapperClass"];
		notAllowed.forEach(function(item){
			if(modalAttr.hasOwnProperty(item)) {
				delete modalAttr[item]
			}
		});
		this.setData("modalAttr",  modalAttr);
	}

    removeAttachedEvents() {
		if(this.isMiniVariant()){
			var parentElement = this.getDrawerPanel();
			var	expandMiniVariant = this.data.ltPropExpandMiniVariant;
			if(expandMiniVariant) {
				var eventName = this.data.isMouseEvent?"mouseenter":expandMiniVariant; 
				if(this.data.isMouseEvent){
					document.removeEventListener( "mousemove", this._bindedDrawerClose, true);
				}
				parentElement.addEventListener( eventName, this._bindedDrawerOpen, true);
				delete this._bindedDrawerClose;
				delete this._bindedDrawerOpen;
			}
		}
	}

    initializeShow() {
		var show  = this.data.ltPropShow;
		if(show) {
			var layout = this.data.ltPropLayout;
			if(layout === "inline" ||  layout === "inlineOverlay"){
				this.showInlineDrawer(!window.changes);
			}
		}
	}

    removeMiniVariantEvent() {
		var parentElement = this.getDrawerPanel();
		var eventName =  this.data.ltPropExpandMiniVariant;
		if(!this.isMouseEvent(eventName)) {
			parentElement.addEventListener(eventName,this._bindedDrawerOpen,true);
		}
	}

    // lifecycle hooks start

    init() {
		this.initializeShow();
	}

    didConnect() {
		this.initializeEvent();
	}

    didDestroy() {
		//remove documnet event listener
		this.removeDrawerFromStore();
		this.removeAttachedEvents();
	}

    //observers end

    static actions(arg1) {
        return Object.assign(super.actions({

            selectedItem:function(event,type){
                var closestItem = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3___default()(event.target).closest("lyte-drawer-item", this.$node)[0];
                if(this.isLyteDrawerItem(closestItem)) {
                    var value = closestItem.getAttribute("data-value");
                    this.setData("ltPropSelected",value);
                    this.selected( this.data.ltPropSelected, closestItem);
                }
            },

            makeDrawerItemActive : function(event) {
                
                var keyCode = event.keyCode;
                var drawerItems = this.getAllDrawerItems();
                var activeIndex = this.getActiveOrFocusedItem(drawerItems);
                var activeItem =  drawerItems[activeIndex];
                if(this.data.ltPropShow){
                    if( keyCode === 38  || keyCode === 40 ) {
                        var forward = keyCode === 40;
                        var nextActiveItem = this.findNextActive(drawerItems, activeIndex, forward);
                        if(nextActiveItem) {
                            if(activeItem){
                                activeItem.classList.remove("lyteDrawerItemFocused");
                            }
                            nextActiveItem.classList.add("lyteDrawerItemFocused");
                            this.moveIntoView(nextActiveItem);
                            event.preventDefault();
                        }
                    }
                    else if(keyCode === 13 && this.isNotActiveElement(activeItem)) {
                        var value = activeItem.getAttribute("data-value");
                        activeItem.classList.remove("lyteDrawerItemFocused");
                        this.setData("ltPropSelected",value);
                        this.selected( this.data.ltPropSelected, activeItem);
                        event.preventDefault();
                    }
                }

            },

            selectActiveItem : function(event){
                var closestItem = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_3___default()(event.target).closest("lyte-drawer-item", this.$node)[0];
                var drawerPanel = this.getDrawerPanel();
                var focusedItem = drawerPanel.querySelector(".lyteDrawerItemFocused");
                if(focusedItem) {
                    focusedItem.classList.remove("lyteDrawerItemFocused");
                }
                if(closestItem) {
                    closestItem.classList.add("lyteDrawerItemFocused");
                }
            },

            openDrawer : function() {
                this.setData("ltPropShow",true);
            },
            
            closeDrawer : function() {
                this.setData("ltPropShow",false);
            },

            updateFreezeLayerStyle : function(node) {
                if(this.data.ltPropShow ===  false) {
                    node.style.setProperty("display", "none");
                }
            }

        }), arg1);
    }

    static methods(arg1) {
        return Object.assign(super.methods({
            /* These below methods will work for overlay drawer only*/

            modalOnBeforeShow:function(component){
                this.initializeDataForModal(component.$node);
                return this.beforeShow();
            },

            modalOnShow:function(component){
                this.initializeDrawerDefaultData();
                this.show();
                this.focusDrawerPanel();
                _LyteDrawer_.push(this.$node);
            },

            modalOnBeforeClose:function(event,component){
                return this.beforeClose();
            },

            modalOnClose:function(component){
                if(this.isMiniVariant()) {
                    return;
                }
                this.removeDrawerFromStore();
                this.close();
            }

        }), arg1);
    }

    static observers(arg1) {
        return Object.assign(super.observers({
            // lifecycle hooks end

            //observers start
            selectedObserver : function(changes){
                this.selectDrawerItem();
            }.observes("ltPropSelected").on('didConnect'),

            disabledListObserver : function(){
                this.disableDrawerItems();
            }.observes("ltPropDisabledList").on('didConnect'),

            showChanges:function(changes){
                if(this.data.returnedFalse){
                    this.setData('returnedFalse',false);
                    return;
                }
                var  show  = this.data.ltPropShow,
                layout = this.$node.ltProp("layout"),
                position = this.getPosition();
                this.setData("currentPosition",position);
                if(show){
                    if(layout === "inline" ||  layout === "inlineOverlay"){
                        this.showInlineDrawer(!changes);
                    }
                }
                else {
                    if(layout == "inline" || layout === "inlineOverlay"){
                        this.closeInlineDrawer(!changes);
                        if(this.isMiniVariant()) {
                            this.removeMiniVariantEvent();
                        }
                    }
                }
            }.observes("ltPropShow").on('didConnect'),

            styleObserver : function(observerChange){
                // all animation are handled using css variable in css
                if(this.data.ltPropLayout != "overlay"){
                    var drawerPanel =  this.getDrawerPanel();
                    var compData =  this.data;
                    var cssVarMapping  =  {
                        ltPropWidth : "--lyte-drawer-width",
                        ltPropMiniVariantWidth : "--lyte-drawer-mini-variant-width",
                        ltPropAnimationDuration : "--lyte-drawer-transition-duration"
                    }
                    if(observerChange) {
                        var key = observerChange.item;
                        drawerPanel.style.setProperty( cssVarMapping[key], compData[key]);
                    }
                    else {
                        for(var key in cssVarMapping) {
                            drawerPanel.style.setProperty( cssVarMapping[key], compData[key]);
                        }
                    }
                }
            }.observes("ltPropWidth","ltPropAnimationDuration","ltPropMiniVariantWidth").on("didConnect"),

            modalAttrObserver :  function(){
                this.updateModalAttr();
            }.observes("ltPropModal")
        }), arg1);
    }

    _() {
        _;
    }
}

LyteDrawerComponent._template = "<template tag-name=\"lyte-drawer\" class=\"{{if(expHandlers(ltPropLayout,'===','overlay'),'lyteDrawerModal')}}\"> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{expHandlers(ltPropLayout,'==',&quot;overlay&quot;)}}\" is=\"case\" lc-id=\"lc_id_0\"> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{ltPropShowOpenButton}}\" is=\"case\" lc-id=\"lc_id_0\"><div onclick=\"{{action('openDrawer')}}\" class=\"lyteDrawerOpenElem lyteDrawerOpenElemLeft\"> <div class=\"lyteDrawerToggleIcon\"></div> </div></template></template> <lyte-modal lt-prop-allow-multiple=\"true\" lt-prop-show-close-button=\"{{ltPropShowCloseButton}}\" lt-prop-close-on-escape=\"{{ltPropCloseOnEscape}}\" lt-prop-overlay-close=\"{{ltPropOverlayClose}}\" lt-prop-width=\"{{ltPropWidth}}\" lt-prop-wrapper-class=\"lyteDrawerModal {{ltPropWrapperClass}}\" lt-prop-height=\"{{ltPropHeight}}\" lt-prop-freeze=\"{{ltPropFreeze}}\" lt-prop-show=\"{{lbind(ltPropShow)}}\" on-before-show=\"{{method(&quot;modalOnBeforeShow&quot;)}}\" on-show=\"{{method(&quot;modalOnShow&quot;)}}\" on-before-close=\"{{method(&quot;modalOnBeforeClose&quot;)}}\" on-close=\"{{method(&quot;modalOnClose&quot;)}}\" lt-prop=\"{{stringify(modalAttr)}}\"> <template is=\"registerYield\" yield-name=\"modal\"> <lyte-modal-content class=\"lyteDrawerModal\" onclick=\"{{action(&quot;selectedItem&quot;,event,&quot;overlay&quot;)}}\" onkeydown=\"{{action(&quot;makeDrawerItemActive&quot;,event,&quot;overlay&quot;)}}\" onmousemove=\"{{action(&quot;selectActiveItem&quot;,event)}}\" data-tabindex=\"{{ltPropDataTabindex}}\" tabindex=\"0\"> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{ltPropYield}}\" is=\"case\" lc-id=\"lc_id_0\"> <lyte-yield yield-name=\"drawerPanel\"></lyte-yield> </template><template default=\"\"> <lyte-drawer-body> <template items=\"{{ltPropOptions}}\" item=\"item\" index=\"index\" is=\"for\" _new=\"true\"><template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{lyteUiOptGroupCheck(item)}}\" is=\"case\" lc-id=\"lc_id_0\"> <lyte-drawer-group> <lyte-drawer-label> {{lyteUiReturnOnlyKey(item)}} </lyte-drawer-label> <template items=\"{{lyteUiReturnValueBy(item,lyteUiReturnOnlyKey(item))}}\" item=\"subitem\" index=\"indexval\" is=\"for\" _new=\"true\"> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{lyteUiIsObject(subitem)}}\" is=\"case\" lc-id=\"lc_id_0\"> <lyte-drawer-item data-value=\"{{subitem[ltPropSystemValue]}}\"> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{ltPropMiniVariant}}\" is=\"case\" lc-id=\"lc_id_0\"> <span class=\"lyteDrawerMiniIcon\" style=\"background-image:{{subitem.icon}};\"></span> <span class=\"lyteDrawerMiniLabel\">{{subitem[ltPropUserValue]}}</span> </template><template default=\"\"> {{subitem[ltPropUserValue]}} </template></template> </lyte-drawer-item> </template><template default=\"\"> <lyte-drawer-item data-value=\"{{subitem}}\"> {{subitem}} </lyte-drawer-item> </template></template> </template> </lyte-drawer-group> </template><template case=\"{{lyteUiIsObject(item)}}\" is=\"case\" lc-id=\"lc_id_1\"> <lyte-drawer-item data-value=\"{{item[ltPropSystemValue]}}\"> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{ltPropMiniVariant}}\" is=\"case\" lc-id=\"lc_id_0\"> <span class=\"lyteDrawerMiniIcon\" style=\"background:{{item.icon}};\"></span> <span class=\"lyteDrawerMiniLabel\">{item[ltPropUserValue]}}</span> </template><template default=\"\"> {{item[ltPropUserValue]}} </template></template> </lyte-drawer-item> </template><template default=\"\"> <lyte-drawer-item data-value=\"{{item}}\"> {{item}} </lyte-drawer-item> </template></template> </template> </lyte-drawer-body> </template></template> </lyte-modal-content> </template> </lyte-modal> </template><template default=\"\"> <div class=\"lyteDrawerInlineBody {{if(expHandlers(currentPosition,'===','left'),'lyteDrawerPanelLeft','lyteDrawerPanelRight')}} {{if(ltPropShow,'lyteDrawerShown','lyteDrawerHidden')}} {{if(expHandlers(ltPropLayout,'===','inlineOverlay'),'lyteDrawerInlineOverlay','lyteDrawerInlineDisplace')}} {{if(ltPropMiniVariant,'lyteDrawerMiniVariant')}}\" style=\"height:{{ltPropHeight}};\"> <div class=\"lyteDrawerPanel {{ltPropWrapperClass}}\" onclick=\"{{action(&quot;selectedItem&quot;,event,&quot;inline&quot;)}}\" onkeydown=\"{{action(&quot;makeDrawerItemActive&quot;,event,&quot;inline&quot;)}}\" onmousemove=\"{{action(&quot;selectActiveItem&quot;,event)}}\" data-tabindex=\"{{ltPropDataTabindex}}\" tabindex=\"0\"> <div class=\"drawerWrapper\"> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{ltPropYield}}\" is=\"case\" lc-id=\"lc_id_0\"> <lyte-yield yield-name=\"drawerPanel\"> </lyte-yield> </template><template default=\"\"> <lyte-drawer-actions> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{expHandlers(ltPropShowOpenButton,'&amp;&amp;',expHandlers(ltPropShow,'!'))}}\" is=\"case\" lc-id=\"lc_id_0\"><div onclick=\"{{action('openDrawer')}}\" class=\"lyteDrawerOpenElem lyteDrawerOpenElemLeft\"> <div class=\"lyteDrawerToggleIcon\"></div> </div></template></template> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{expHandlers(ltPropShowCloseButton,'&amp;&amp;',ltPropShow)}}\" is=\"case\" lc-id=\"lc_id_0\"><div onclick=\"{{action('closeDrawer')}}\" class=\"lyteDrawerCloseIconWrap\"> <div class=\"lyteDrawerToggleIcon\"></div> </div></template></template> </lyte-drawer-actions> <lyte-drawer-body> <template items=\"{{ltPropOptions}}\" item=\"item\" index=\"index\" is=\"for\" _new=\"true\"><template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{lyteUiOptGroupCheck(item)}}\" is=\"case\" lc-id=\"lc_id_0\"> <lyte-drawer-group> <lyte-drawer-label> {{lyteUiReturnOnlyKey(item)}} </lyte-drawer-label> <template items=\"{{lyteUiReturnValueBy(item,lyteUiReturnOnlyKey(item))}}\" item=\"subitem\" index=\"indexval\" is=\"for\" _new=\"true\"> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{lyteUiIsObject(subitem)}}\" is=\"case\" lc-id=\"lc_id_0\"> <lyte-drawer-item data-value=\"{{subitem[ltPropSystemValue]}}\"> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{ltPropMiniVariant}}\" is=\"case\" lc-id=\"lc_id_0\"> <span class=\"lyteDrawerMiniIcon\" style=\"background:{{subitem.icon}};\"></span> <span class=\"lyteDrawerMiniLabel\">{{subitem[ltPropUserValue]}}</span> </template><template default=\"\"> {{subitem[ltPropUserValue]}} </template></template> </lyte-drawer-item> </template><template default=\"\"> <lyte-drawer-item data-value=\"{{subitem}}\"> {{subitem}} </lyte-drawer-item> </template></template> </template> </lyte-drawer-group> </template><template case=\"{{lyteUiIsObject(item)}}\" is=\"case\" lc-id=\"lc_id_1\"> <lyte-drawer-item data-value=\"{{item[ltPropSystemValue]}}\"> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{ltPropMiniVariant}}\" is=\"case\" lc-id=\"lc_id_0\"> <span class=\"lyteDrawerMiniIcon\" style=\"background-image:{{item.icon}};\"></span> <span class=\"lyteDrawerMiniLabel\">{{item[ltPropUserValue]}}</span> </template><template default=\"\"> {{item[ltPropUserValue]}} </template></template> </lyte-drawer-item> </template><template default=\"\"> <lyte-drawer-item data-value=\"{{item}}\"> {{item}} </lyte-drawer-item> </template></template> </template> </lyte-drawer-body> </template></template> </div> </div> <div class=\"lyteDrawerContent\"> <lyte-yield yield-name=\"drawerContent\"> </lyte-yield> </div> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{ltPropFreeze}}\" is=\"case\" lc-id=\"lc_id_0\"> <lyte-drawer-freeze ontransitionend=\"{{action('updateFreezeLayerStyle',this)}}\"> </lyte-drawer-freeze> </template></template> </div> </template></template> </template>";;
LyteDrawerComponent._dynamicNodes = [{"t":"s","p":[1],"c":{"lc_id_0":{"dN":[{"t":"s","p":[1],"c":{"lc_id_0":{"dN":[{"t":"a","p":[0],"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{}},"hd":true,"co":["lc_id_0"],"in":2,"sibl":[1],"cn":"lc_id_0"},{"t":"a","p":[3],"cn":"lc_id_0"},{"t":"r","p":[3,1],"dN":[{"t":"a","p":[1]},{"t":"s","p":[1,1],"c":{"lc_id_0":{"dN":[{"t":"i","p":[1],"in":0,"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{"dN":[{"t":"a","p":[1,1],"cn":"default"},{"t":"f","p":[1,1],"dN":[{"t":"s","p":[0],"c":{"lc_id_0":{"dN":[{"t":"tX","p":[1,1,1],"cn":"lc_id_0"},{"t":"cD","p":[1,1],"in":2,"sibl":[1],"cn":"lc_id_0"},{"t":"a","p":[1,3],"cn":"lc_id_0"},{"t":"f","p":[1,3],"dN":[{"t":"s","p":[1],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"cn":"lc_id_0"},{"t":"s","p":[1,1],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"a":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'background-image:'","subitem.icon","';'"]}}},"cn":"lc_id_0"},{"t":"tX","p":[3,0],"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{"dN":[{"t":"tX","p":[1],"cn":"default"}]},"dc":{"lc_id_0":{},"default":{}},"hd":true,"co":["lc_id_0"],"in":1,"sibl":[0],"cn":"lc_id_0"},{"t":"cD","p":[1],"in":0,"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{"dN":[{"t":"a","p":[1],"cn":"default"},{"t":"tX","p":[1,1],"cn":"default"},{"t":"cD","p":[1],"in":0,"cn":"default"}]},"dc":{"lc_id_0":{"dc":[0],"hc":true,"trans":true},"default":{"dc":[0],"hc":true,"trans":true}},"hd":true,"co":["lc_id_0"],"hc":true,"trans":true,"in":0}],"dc":[0],"hc":true,"trans":true,"in":1,"sibl":[0],"cn":"lc_id_0"},{"t":"cD","p":[1],"in":0,"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true},"lc_id_1":{"dN":[{"t":"a","p":[1],"cn":"lc_id_1"},{"t":"s","p":[1,1],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"a":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'background:'","item.icon","';'"]}}},"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{"dN":[{"t":"tX","p":[1],"cn":"default"}]},"dc":{"lc_id_0":{},"default":{}},"hd":true,"co":["lc_id_0"],"in":1,"sibl":[0],"cn":"lc_id_1"},{"t":"cD","p":[1],"in":0,"cn":"lc_id_1"}],"cdp":{"t":"a","p":[1]},"dcn":true}},"d":{"dN":[{"t":"a","p":[1],"cn":"default"},{"t":"tX","p":[1,1],"cn":"default"},{"t":"cD","p":[1],"in":0,"cn":"default"}]},"dc":{"lc_id_0":{"dc":[2,1,0],"hc":true,"trans":true},"lc_id_1":{"dc":[0],"hc":true,"trans":true},"default":{"dc":[0],"hc":true,"trans":true}},"hd":true,"co":["lc_id_0","lc_id_1"],"hc":true,"trans":true,"in":0}],"dc":[0],"hc":true,"trans":true,"in":1,"sibl":[0],"cn":"default"},{"t":"cD","p":[1],"in":0,"cn":"default"}]},"dc":{"lc_id_0":{"dc":[0],"hc":true,"trans":true},"default":{"dc":[1,0],"hc":true,"trans":true}},"hd":true,"co":["lc_id_0"],"hc":true,"trans":true,"in":1,"sibl":[0]},{"t":"cD","p":[1],"in":0}],"dc":[1,0],"hc":true,"trans":true,"in":1,"sibl":[0],"cn":"lc_id_0"},{"t":"cD","p":[3],"in":0,"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{"dN":[{"t":"a","p":[1],"a":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'height:'","ltPropHeight","';'"]}}},"cn":"default"},{"t":"a","p":[1,1],"cn":"default"},{"t":"s","p":[1,1,1,1],"c":{"lc_id_0":{"dN":[{"t":"i","p":[1],"in":0,"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{"dN":[{"t":"s","p":[1,1],"c":{"lc_id_0":{"dN":[{"t":"a","p":[0],"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{}},"hd":true,"co":["lc_id_0"],"in":4,"sibl":[3],"cn":"default"},{"t":"s","p":[1,3],"c":{"lc_id_0":{"dN":[{"t":"a","p":[0],"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{}},"hd":true,"co":["lc_id_0"],"in":3,"sibl":[2],"cn":"default"},{"t":"cD","p":[1],"in":2,"sibl":[1],"cn":"default"},{"t":"a","p":[3,1],"cn":"default"},{"t":"f","p":[3,1],"dN":[{"t":"s","p":[0],"c":{"lc_id_0":{"dN":[{"t":"tX","p":[1,1,1],"cn":"lc_id_0"},{"t":"cD","p":[1,1],"in":2,"sibl":[1],"cn":"lc_id_0"},{"t":"a","p":[1,3],"cn":"lc_id_0"},{"t":"f","p":[1,3],"dN":[{"t":"s","p":[1],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"cn":"lc_id_0"},{"t":"s","p":[1,1],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"a":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'background:'","subitem.icon","';'"]}}},"cn":"lc_id_0"},{"t":"tX","p":[3,0],"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{"dN":[{"t":"tX","p":[1],"cn":"default"}]},"dc":{"lc_id_0":{},"default":{}},"hd":true,"co":["lc_id_0"],"in":1,"sibl":[0],"cn":"lc_id_0"},{"t":"cD","p":[1],"in":0,"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{"dN":[{"t":"a","p":[1],"cn":"default"},{"t":"tX","p":[1,1],"cn":"default"},{"t":"cD","p":[1],"in":0,"cn":"default"}]},"dc":{"lc_id_0":{"dc":[0],"hc":true,"trans":true},"default":{"dc":[0],"hc":true,"trans":true}},"hd":true,"co":["lc_id_0"],"hc":true,"trans":true,"in":0}],"dc":[0],"hc":true,"trans":true,"in":1,"sibl":[0],"cn":"lc_id_0"},{"t":"cD","p":[1],"in":0,"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true},"lc_id_1":{"dN":[{"t":"a","p":[1],"cn":"lc_id_1"},{"t":"s","p":[1,1],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"a":{"style":{"name":"style","helperInfo":{"name":"concat","args":["'background-image:'","item.icon","';'"]}}},"cn":"lc_id_0"},{"t":"tX","p":[3,0],"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{"dN":[{"t":"tX","p":[1],"cn":"default"}]},"dc":{"lc_id_0":{},"default":{}},"hd":true,"co":["lc_id_0"],"in":1,"sibl":[0],"cn":"lc_id_1"},{"t":"cD","p":[1],"in":0,"cn":"lc_id_1"}],"cdp":{"t":"a","p":[1]},"dcn":true}},"d":{"dN":[{"t":"a","p":[1],"cn":"default"},{"t":"tX","p":[1,1],"cn":"default"},{"t":"cD","p":[1],"in":0,"cn":"default"}]},"dc":{"lc_id_0":{"dc":[2,1,0],"hc":true,"trans":true},"lc_id_1":{"dc":[0],"hc":true,"trans":true},"default":{"dc":[0],"hc":true,"trans":true}},"hd":true,"co":["lc_id_0","lc_id_1"],"hc":true,"trans":true,"in":0}],"dc":[0],"hc":true,"trans":true,"in":1,"sibl":[0],"cn":"default"},{"t":"cD","p":[3],"in":0,"cn":"default"}]},"dc":{"lc_id_0":{"dc":[0],"hc":true,"trans":true},"default":{"dc":[2,1,0],"hc":true,"trans":true}},"hd":true,"co":["lc_id_0"],"hc":true,"trans":true,"in":2,"sibl":[1],"cn":"default"},{"t":"i","p":[1,3,1],"in":1,"sibl":[0],"cn":"default"},{"t":"s","p":[1,5],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"cn":"lc_id_0"},{"t":"cD","p":[1],"in":0,"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{"dc":[0],"hc":true,"trans":true}},"hd":true,"co":["lc_id_0"],"hc":true,"trans":true,"in":0,"cn":"default"}]},"dc":{"lc_id_0":{"dc":[1,0],"hc":true,"trans":true},"default":{"dc":[2,1,0],"hc":true,"trans":true}},"hd":true,"co":["lc_id_0"],"hc":true,"trans":true,"in":0},{"type":"dc","trans":true,"hc":true,"p":[0]}];;

LyteDrawerComponent._observedAttributes = [
    "ltPropPosition",
    "ltPropWidth",
    "ltPropHeight",
    "ltPropModal",
    "ltPropFreeze",
    "ltPropAnimationDuration",
    "ltPropMiniVariant",
    "ltPropUserValue",
    "ltPropSystemValue",
    "ltPropOptions",
    "ltPropShow",
    "ltPropSelectedClass",
    "ltPropSelected",
    "ltPropCloseOnSelect",
    "ltPropOverlayClose",
    "ltPropShowOpenButton",
    "ltPropShowCloseButton",
    "ltPropCloseOnEscape",
    "ltPropDisabledList",
    "ltPropWrapperClass",
    "ltPropLayout",
    "ltPropExpandMiniVariant",
    "ltPropMiniVariantWidth",
    "ltPropYield",
    "ltPropDataTabindex",
    "returnedFalse",
    "currentPosition",
    "config",
    "isMouseEvent",
    "modalAttr"
];

//need to be moved as common code
if (document.readyState === "complete" || document.readyState === "interactive"){
    window.addCloseEvent();
}
else{
    document.addEventListener("DOMContentLoaded", function(){
        window.addCloseEvent();
    });
}



LyteDrawerComponent.register("lyte-drawer", {
    hash: "LyteDrawerComponent_4",
    refHash: "C_lyte-ui-component_@zoho/lyte-ui-component_2"
});


/***/ }),

/***/ 38197755:
/*!**********************************************************************************!*\
  !*** ./node_modules/@zoho/lyte-ui-component/components/javascript/lyte-modal.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LyteModalComponent": () => (/* binding */ LyteModalComponent)
/* harmony export */ });
/* harmony import */ var _lyte_wormhole_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lyte-wormhole.js */ 57986490);
/* harmony import */ var _slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../@slyte/core/index.js */ 56505143);
/* harmony import */ var _component_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../component.js */ 50761997);
/* harmony import */ var _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../lyte-dom/modules/lyte-dom-utils.js */ 19978124);
/* harmony import */ var _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2__);






window.addModalEvent = function(event) {
    window.addEventListener('resize',function(event){
        // console.log(Math.max(document.documentElement.clientHeight, window.innerHeight || 0));
        if(window.LytePopup._lyteModalRTId){
            // console.log(LytePopup._lyteModalRTId);
            clearTimeout(window.LytePopup._lyteModalRTId);
            window.LytePopup._lyteModalRTId = false;
        }
        window.LytePopup._lyteModalRTId = setTimeout(function(){
            // for(var i = LytePopup.components.length - 1 ; i >= 0 ; i--){
            for(var i = 0  ; i < LytePopup.components.length ; i++){
            // console.log(LytePopup.components[i].$node);
                if(LytePopup.components[i].$node && LytePopup.components[i].$node.nodeName == "LYTE-MODAL" && LytePopup.components[i].childComp.style.visibility == "visible" && LytePopup.components[i].childComp.querySelector('.lyteModal')){
                    LytePopup.components[i].$node.component.setData('resizeCalled',true);
                    if(LytePopup.components[i].getData('ltPropParentModalId') == '' && LytePopup.components[i].getData('ltPropDependentModalId') != '') {
                        LytePopup.components[i].$node.component.updateScrollHandling();
                    }
                    else if(LytePopup.components[i].getData('ltPropParentModalId') == '' && LytePopup.components[i].getData('ltPropDependentModalId') == '') {
                        if((i == LytePopup.components.length - 1) && LytePopup.components[i].renderSidewise){
                            continue;
                        }
                        LytePopup.components[i].$node.component.updateScrollHandling();
                    }
                }
            }
            LytePopup._lyteModalRTId = false;
        },100);
    },true);

    document.addEventListener('click',function(event){
        var ele = event.target;
        while(!_lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()(ele).hasClass('modalWrapper') && ele.tagName != "LYTE-MODAL-FREEZE" && ele.tagName != 'LYTE-DROP-BOX' && ele.tagName != 'HTML'){
            ele = ele.parentElement;
            if(!ele){
                return
            }
        }
        if(ele.tagName == "HTML" || ele.tagName == "LYTE-MODAL-FREEZE"){
            for(var i = window.LytePopup.components.length -1 ; i>=0; i--){
                if(window.LytePopup.components[i].$node.tagName == "LYTE-MODAL" && window.LytePopup.components[i].childComp.style.visibility == "visible"){
                    var modal = window.LytePopup.components[i].$node;
                    var dontClose = true
                    if(modal.component.getData('ltPropAllowContainment') && ele.tagName === 'HTML'){
                        dontClose = false
                    }
                    if(modal && modal.component.getData('ltPropOverlayClose') && dontClose){
                        modal.ltProp('show',false);
                        break;
                    }
                }
            }
        }
        else{
            /*  If ele is having modalWrapper class ie. a modal and it is not the modal that is opened at last which is the current modal element in the page
            this means the click has happened outside the current modal
            so the current modal should be closed */
            if(ele.classList.contains('modalWrapper') && window.LytePopup.components.length > 1 && window.LytePopup.components[window.LytePopup.components.length -1].$node.tagName == "LYTE-MODAL"){
                var modal = window.LytePopup.components[window.LytePopup.components.length -1];
                var dontClose = true
                if(modal.getData('ltPropAllowContainment') && ele.tagName === 'HTML'){
                    dontClose = false
                }
                if(!(modal.childComp.contains(ele)) && modal.childComp.style.visibility == "visible" && modal.getData('ltPropOverlayClose') && dontClose){
                    modal.$node.ltProp('show',false);
                }
            }
        }
    },true);
};

/**
 * Renders a modal
 * @component lyte-modal
 * @version 1.0.0
 * @dependencies lyte-wormhole
 * @methods onBeforeShow,onShow,onBeforeClose,onClose,onResize
 * @utility alignModal,calculateOffset,trapFocus, reflectTransitionChange
 */

/**
 * @customElement lyte-modal-header
 */
/**
 * @customElement lyte-modal-content
 */
/**
 * @customElement  lyte-modal-footer
 */

class LyteModalComponent extends _component_js__WEBPACK_IMPORTED_MODULE_1__.Component {
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
             */
            "ltPropShow":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean",{"default": false}),

            /**
             * @componentProperty {boolean} ltPropFreeze
             * @version 1.0.0
             * @default true
             */
            "ltPropFreeze":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean",{"default": true}),

            /**
             * @componentProperty {boolean} ltPropShowCloseButton
             * @version 1.0.0
             * @default true
             */
            "ltPropShowCloseButton":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean",{"default": true}),

            /**
             * @componentProperty {boolean} ltPropCloseOnEscape
             * @version 1.0.0
             * @default true
             */
            "ltPropCloseOnEscape":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean",{"default": true}),
            /**
             * @typedef {object} transition
             * @property {slideFromTop|slideFromBottom|slideFromLeft|slideFromRight|fadeIn|zoom} animation
             * @property {string} duration
             */
            /**
             * @componentProperty {transition} ltPropTransition
             * @version 1.0.0
             * @default { "animation" :"slideFromTop" , "duration":"0.5s"}
             */
            "ltPropTransition":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("object",{"default":{"animation":"slideFromTop","duration":"0.5"}}),
            /**
             * @typedef {object} offset
             * @property {string} top
             * @property {string} left
             * @property {string} bottom
             * @property {string} right
             */
            /**
             * @componentProperty {offset} ltPropOffset
             * @version 1.0.0
             * @default { "top" :"center", "left" :"center"}
             */
            "ltPropOffset":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("object",{"default":{"top":"center","left":"center"}}),
            /**
             * @typedef {object} dimmer
             * @property {colorstring} color
             * @property {string} opacity
             */
            /**
             * @componentProperty {dimmer} ltPropDimmer
             * @version 1.0.0
             */
            "ltPropDimmer":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("object"), //,{"default":{"color":"black","opacity":"0.4"}}

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
             * @default auto
             * @suffix px,pt,cm,mm,vh,vm,em
             */
            "ltPropHeight":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("string",{"default":"auto"}),

            /**
             * @componentProperty {string} ltPropWrapperClass
             * @version 1.0.0
             */
            "ltPropWrapperClass":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("string",{"default":""}),

            /**
             * @componentProperty {boolean} ltPropBindToBody
             * @version 1.0.0
             * @default false
             *
             */
            "ltPropBindToBody":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean",{"default":false}),

            /**
             * @experimental ltPropShowCopy
             */
            "ltPropShowCopy":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean",{"default": false}),

            /**
             * @componentProperty {boolean} ltPropReRenderModal
             * @version 1.0.0
             * @default false
             *
             */
            "ltPropReRenderModal":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean",{"default":false}),

            /**
             * @componentProperty {boolean} ltPropOverlayClose
             * @version 1.0.0
             * @default false
             *
             */
            "ltPropOverlayClose":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean",{"default":false}),

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
             * @version 3.3.0
             * @default false
             *
             */
            "ltPropPreventFocus" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('boolean', { default : false } ),

            /**
             * @componentProperty {boolean} ltPropSetContentHeight
             * @version 3.9.0
             * @default false
             *
             */
            "ltPropSetContentHeight" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('boolean', { default : false } ),

            /**
             * @componentProperty {number} ltPropCloseDuration
             * @version 3.10.0
             * @default undefined
             */
            "ltPropCloseDuration" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("number",{"default" : undefined}),

            /**
             * @componentProperty {boolean} ltPropOverlapModal
             * @version 3.19.0
             * @default true
             *
             */
            "ltPropOverlapModal" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('boolean', { default : true } ),

            /**
             * @componentProperty {boolean} ltPropIgnoreInlineDirection
             * @version 3.19.0
             * @default true
             *
             */
            "ltPropIgnoreInlineDirection" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('boolean', { default : false } ),

            /**
             * @componentProperty {boolean} ltPropAllowContainment
             * @version 3.68.0
             * @default false
             *
             */

             "ltPropAllowContainment" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('boolean' , {
                default : false
            }),
            "ltPropFocusOnClose" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('boolean' , {
                default : false
            }),
            "ltPropPadding" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('string' , {
                default : ""
            }),

            "ltPropDependentModalId": (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('string', {default: ''}),
            "ltPropParentModalId": (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('string', {default: ''}),
            "ltPropShowWormhole" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('boolean' , {
                default : false
            }),

            
            //local properties
            "first":(0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean",{"default":true}),
            'resizeCalled' : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean",{"default":false}),
            'initializedPosition' : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean",{"default":false}),
            "prevHeight" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("number"),
            "returnedFalse" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean",{"default" : false}),
            "prevModalHeight" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("number"),
            "prevModalWidth" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("number"),
            "calculateHW" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("boolean", {"default":false}),
            "checkAria" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)("number", {"default":0}),
            "beforeDragPosition" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('object' , {default : {xPos:0,yPos:0}}),
            "resetTriggered" : (0,_slyte_core_index_js__WEBPACK_IMPORTED_MODULE_3__.prop)('boolean' , {default : false})
            // "modalCreationOrder" : Lyte.attr('number' , {'default' : -1}),
        }), arg1);
    }

    addDragHandler() {
        var dragHeader = this.actualModalDiv.querySelector('lyte-modal-header');
        if(this.$node.ltProp("draggable")){
            _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()(dragHeader).addClass('lyteModalDragRunning');
        }
        if(dragHeader){
            dragHeader.parentEle = this;
            if(this.$node.ltProp("draggable")){
                dragHeader.addEventListener('mousedown',this.handleMove,true);
                dragHeader.addEventListener('touchstart',this.handleMove,true);
                dragHeader.classList.add('lyteModalHeaderDraggable');
            }
            else{
                dragHeader.removeEventListener('mousedown',this.handleMove,true);
                dragHeader.removeEventListener('touchstart',this.handleMove,true);
                dragHeader.classList.remove('lyteModalHeaderDraggable');
            }
        }
        else{
            console.warn("This modal is not draggable because it has no header");
            this.$node.ltProp("draggable",false);
        }
    }

    handleMove(e) {
        if(e.button === 2){
            return
        }
        var drag = e.currentTarget.parentEle.actualModalDiv, mouseOffset;
        window.LytePopup.node=drag;
        if(e.type == "mousedown"){
            mouseOffset = { x : e.clientX, y : e.clientY};
        }
        if(e.type == "touchstart"){
            mouseOffset = { x : e.touches[0].clientX, y : e.touches[0].clientY};
        }
        if(e.currentTarget.parentEle.getData('ltPropTransition').animation == "fadeIn"){
            LytePopup.xPos=mouseOffset.x-this.getBoundingClientRect().left;
            LytePopup.yPos=mouseOffset.y-this.getBoundingClientRect().top;
        }
        else{
            LytePopup.xPos=mouseOffset.x;
            LytePopup.yPos=mouseOffset.y;
        }
        var elePos = drag.getBoundingClientRect();
        drag.style.transitionDuration = "0s";
        if(e.type == "mousedown"){
            window.addEventListener('mousemove',e.currentTarget.parentEle.handleDrag,true);
            window.addEventListener('mouseup',e.currentTarget.parentEle.stopDrag,true);
        }
        if(e.type == "touchstart"){
            document.body.addEventListener('touchmove',e.currentTarget.parentEle.handleDrag,true);
            document.body.addEventListener('touchend',e.currentTarget.parentEle.stopDrag,true);
        }

    }

    handleDrag(e) {
        var drag = window.LytePopup.node;
        var curComp = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()(drag).closest('lyte-wormhole')[0]._callee
        var dragBounding = drag.getBoundingClientRect()
        var compStyle = window.getComputedStyle(drag);
        if(!window.LytePopup.node){
            return;
        }
        var curleft = 0
        var curtop = 0
        var mouseOffset;
        if(e.type == "mousemove"){
            mouseOffset = { x : e.clientX, y : e.clientY};
        }
        if(e.type == "touchmove"){
            mouseOffset = { x : e.touches[0].clientX, y : e.touches[0].clientY};
        }
        if(window.LytePopup.node.closest('lyte-wormhole')._callee.component.getData('ltPropTransition').animation == "fadeIn"){
            curleft = (mouseOffset.x-window.LytePopup.xPos)
            curtop = (mouseOffset.y-window.LytePopup.yPos)
            if(!curComp.getData('ltPropAllowContainment')){
                drag.style.left = curleft+'px';
                drag.style.top = curtop+'px';
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

        }
        else{
          var matrix = window.LytePopup.node.closest('lyte-wormhole')._callee.component.transform
          if((window.LytePopup.node.closest('lyte-wormhole')._callee.component.getData('ltPropTransition').animation == "zoom") && !matrix){
            matrix = {}
            matrix.x = 0;
            matrix.y = 0
          } 
            var x = matrix.x+(mouseOffset.x-window.LytePopup.xPos),
                y = matrix.y+(mouseOffset.y-window.LytePopup.yPos);
                drag.style.transform = "translate("+x+"px, "+y+"px)";

                dragBounding = drag.getBoundingClientRect()

            if(curComp.getData('ltPropAllowContainment')){
                if(dragBounding.left + dragBounding.width > window.innerWidth && (dragBounding.left >= 0)){
                    x = (window.innerWidth - dragBounding.width) - parseFloat(compStyle.left)
                } else if(dragBounding.left<0){
                    x =  - parseFloat(compStyle.left)
                }
                if(dragBounding.top + dragBounding.height > window.innerHeight && (dragBounding.top >= 0)){
                    y = (window.innerHeight - dragBounding.height) - parseFloat(compStyle.top)
                } else if(dragBounding.top<0){
                    y = - parseFloat(compStyle.top)
                }
                drag.style.transform = "translate("+x+"px, "+y+"px)";
            }


        }
        window.getSelection().removeAllRanges();
    }

    stopDrag(e) {
        var targetElem = e.target;
        if(!_lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()(targetElem).hasClass('lyteModalDragRunning')){
            targetElem = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()('.lyteModalDragRunning')[0]
        }
        while(targetElem && targetElem !== document){
            if(targetElem.parentEle){
                if(e.type == "mouseup"){
                    this.removeEventListener('mousemove',targetElem.parentEle.handleDrag,true);
                    this.removeEventListener('mouseup',targetElem.parentEle.stopDrag,true);
                }
                if(e.type == "touchend"){
                    this.removeEventListener('touchmove',targetElem.parentEle.handleDrag,true);
                    this.removeEventListener('touchend',targetElem.parentEle.stopDrag,true);
                }
                break;
            }
            targetElem = targetElem.parentElement ? targetElem.parentElement : document;
        }
        if(window.LytePopup.node){
            var comp = window.LytePopup.node.closest('lyte-wormhole')._callee.component;
            window.LytePopup.node.style.transitionDuration = comp.getData('ltPropTransition').duration;
            if(comp.getData('ltPropTransition').animation != "fadeIn"){
                var matrix = new window.WebKitCSSMatrix(window.getComputedStyle(comp.actualModalDiv).transform);
                comp.transform = {'x' : matrix.m41, 'y' : matrix.m42};
            }
            LytePopup.node = null;
        }
    }

    clearFastdomBatch() {
        if(this.fastdomfn1){
            _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.clear(this.fastdomfn1);
        }
        if(this.fastdomfn2){
            _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.clear(this.fastdomfn2);
        }
        if(this.fastdomfn3){
            _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.clear(this.fastdomfn3);
        }
        if(this.fastdomfn4){
            _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.clear(this.fastdomfn4);
        }
        if(this.fastdomfn5){
            _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.clear(this.fastdomfn5);
        }
        if(this.fastdomfn6){
            _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.clear(this.fastdomfn6);
        }
        if(this.fastdomfn7){
            _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.clear(this.fastdomfn7);
        }
        if(this.fastdomfn8){
            _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.clear(this.fastdomfn8);
        }
        if(this.beforeShowId){
            clearTimeout(this.beforeShowId);
        }
    }

    /**
     * The method is going to set height and width of the modal
     *
     */
    updateScrollHandling() {    //It sets the height and width of the modal
        if(!this.$node.ltProp("freeze")){
            // this.$node.ltProp("scrollable",true);
            this.setData("calculateHW",true);
        }
        var modalElem = this.actualModalDiv;
        var oldHeight, oldWidth, newHeight, newWidth,
        w =  Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        contentNode = modalElem.querySelector("lyte-modal-content");
        // contentNode = contentNode ? contentNode : modalElem;
        modalElem.style.maxWidth = "";
        modalElem.style.maxHeight = "";
        modalElem.style.height = this.$node.ltProp("height")?this.$node.ltProp("height"):"auto";
        modalElem.style.width = this.$node.ltProp("width")?( (!(this.getData('ltPropOverlapModal')) && this.$node.ltProp("width").indexOf('%') != -1) ? ((parseFloat(this.$node.ltProp("width"))/100) * w) + "px" : this.$node.ltProp("width") ):"auto";
        // console.log(this.$node.ltProp("width"));
        /*------------------------------ MEASURE STARTS --------------------------*/
        this.fastdomfn2 = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.measure(function() {    //Measures the initial height and width
            delete this.fastdomfn2;
            var modalElemOffset = modalElem.getBoundingClientRect();
            /*IF maxwidth or maxheigth given as a percentage then to calculate the actual width or height
                                we need the modalElements parent element's width and height*/
            var modalParentOff = modalElem.parentElement.getBoundingClientRect();
            var cs = window.getComputedStyle(modalElem);
            var borderDimensionY = ((cs.borderTopWidth ? parseFloat(cs.borderTopWidth) : 0) +
                                     (cs.borderBottomWidth ? parseFloat(cs.borderBottomWidth) : 0));
            var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - (this.getData('ltPropFreeze') ? parseInt(window.getComputedStyle(modalElem.parentElement).top) : 0);
            // console.log(modalElemOffset);
            /*------------------------------ MUTATE STARTS --------------------------*/
            this.fastdomfn3 = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.mutate(function(){    //Checks for the max height and width provided by the user and sets the modal height and width based on that
                delete this.fastdomfn3;
                if(this.$node.ltProp("maxWidth")){
                    // this.$node.ltProp("scrollable",true);
                    // this.setData("calculateHW",true);
                    // oldWidth = modalElemOffset.width /*- borderDimensionX*/;
                    newWidth = this.$node.ltProp("maxWidth").indexOf('%') != -1 ? ((parseFloat(this.$node.ltProp("maxWidth"))/100) * modalParentOff.width) : parseFloat(this.$node.ltProp("maxWidth"));
                    modalElem.style.maxWidth = newWidth + "px";
                    // if(oldWidth < newWidth){
                    //     modalElem.style.width = oldWidth+"px";
                    //     // newWidth = oldWidth;
                    // }
                    modalElem.style.overflowX = "auto";
                }
                else{
                    newWidth = modalElemOffset.width /*- borderDimensionX*/;
                }

                if(this.$node.ltProp("maxHeight")){
                    this.childComp.querySelector(".modalWrapper").classList.add("scrollable");
                    // this.$node.ltProp("scrollable",true);
                    this.setData("calculateHW",true);
                    oldHeight = modalElemOffset.height - borderDimensionY;
                    var newH = this.$node.ltProp("maxHeight").indexOf('%') != -1 ? ((parseFloat(this.$node.ltProp("maxHeight"))/100) * modalParentOff.height) : parseFloat(this.$node.ltProp("maxHeight"));
                    // modalElem.style.height = newH + "px";
                    modalElem.style.maxHeight = newH + "px";
                    newHeight = newH - borderDimensionY;
                }
                else{
                    /*  +1 is added here to the oldHeight as offsetHeights are rounded off values. ie. 5.5 => 6.
                        So, if 5.5 + 5.5 = 11. But offsetHeight will give 6 + 6 by rounding off 5.5 which is != 11.
                        So for safety we add extra 1 px to the total height.
                    */
                    oldHeight = modalElem.offsetHeight - borderDimensionY + 1;
                    //If height is provided in px or em then we dont compare if it is greater than window height as it is fixed
                    if(this.$node.ltProp('height') && this.$node.ltProp('height') != "auto"/* && ((this.$node.ltProp('height')).indexOf('px') != -1 || (this.$node.ltProp('height')).indexOf('em') != -1)*/){
                        newHeight = oldHeight;
                        this.setData("calculateHW",true);
                    }
                    else{
                        newHeight = oldHeight > h ? h-40 : oldHeight;
                    }
                    if(this.$node.ltProp("scrollable")){
                        if(!(this.$node.ltProp('height')) || this.$node.ltProp('height') == "auto"){
                            newHeight = h-40;
                        }
                        this.setData("calculateHW",true);
                    }
                    if(contentNode /*this.actualModalDiv.querySelector("lyte-modal-content")*/ && contentNode.offsetHeight /*this.actualModalDiv.querySelector("lyte-modal-content")*/ > oldHeight - ((this.actualModalDiv.querySelector("lyte-modal-header") ? this.actualModalDiv.querySelector("lyte-modal-header").offsetHeight : 0) + (this.actualModalDiv.querySelector("lyte-modal-footer") ? this.actualModalDiv.querySelector("lyte-modal-footer").offsetHeight : 0))){
                        // this.$node.ltProp("scrollable",true);
                        this.setData("calculateHW",true);
                    }
                }
                if(this.getData("calculateHW") && contentNode){
                    var modalheader = this.actualModalDiv.querySelector("lyte-modal-header"), modalFooter = this.actualModalDiv.querySelector("lyte-modal-footer");
                    var modalHOff = null,modalFOff = null;
                    /*------------------------------ MEASURE STARTS --------------------------*/
                    this.fastdomfn4 = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.measure(function(){   //measures the content haeder, content and footer dimensions
                        delete this.fastdomfn4;
                        if(modalheader){
                            modalHOff = modalheader.offsetHeight;
                        }
                        if(modalFooter){
                            modalFOff = modalFooter.offsetHeight;
                        }
                        var diff = 0;
                        var modalHeight = modalElem.getBoundingClientRect().height;
                        // if(this.getData('resizeCalled')){
                        //     //to get the difference between previous height and current height
                        //     if(this.getData('prevHeight') < modalHeight){
                        //         diff = modalHeight - this.getData('prevHeight');
                        //     }
                        //     this.setData('resizeCalled',false);
                        // }
                        this.setData('prevHeight',modalHeight);
                        /*------------------------------ MUTATE STARTS --------------------------*/
                        this.fastdomfn5 = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.mutate(function(){   //Sets the final height and width of the modal
                            delete this.fastdomfn5;
                            var newH = (newHeight - ((modalHOff ? modalHOff : 0)+ (modalFOff ? modalFOff : 0)));
                            contentNode.style.maxHeight = (newH > 0 ? newH : 50) + diff +"px";
                            contentNode.style.overflowY = "auto";
                            if(this.$node.ltProp('height') != "auto" && this.getData('ltPropSetContentHeight')){
                                contentNode.style.height = newH + "px";
                            }
                            // if(this.getData('first')){
                            //     contentNode.style.height = (oldHeight - ((modalHOff ? modalHOff.height : 0)+ (modalFOff ? modalFOff.height : 0))) +"px";
                            // }
                            // modalElem.style.width = this.$node.ltProp("width")?this.$node.ltProp("width"):"auto";
                            // this.actualModalDiv.style.maxWidth = newWidth > 0 ? (newWidth +"px"):("70%");
                            modalElem = null;
                            contentNode = null;
                            modalheader = null;
                            modalFooter = null;
                            if(!this.getData('initializedPosition')){
                                this.computeOffsetImpl();
                                this.setData('initializedPosition',true);
                            }
                            else if(this.getData('resizeCalled')){
                                this.computeOffsetImplOnResize();
                                this.setData('resizeCalled',false);
                            }
                        },this);
                        /*------------------------------ MUTATE ENDS --------------------------*/
                    },this);
                    /*------------------------------ MEASURE ENDS --------------------------*/
                }
                else{
                    this.childComp.querySelector(".modalWrapper").classList.remove("scrollable");
                    modalElem = null;
                    contentNode = null;
                    if(!this.getData('initializedPosition')){
                        this.computeOffsetImpl();
                        this.setData('initializedPosition',true);
                    }
                    else if(this.getData('resizeCalled')){
                        this.computeOffsetImplOnResize();
                        this.setData('resizeCalled',false);
                    }
                }

                if (!this.$node.ltProp("freeze")) {
                    this.childComp.querySelector(".modalWrapper").classList.add('noFreeze');
                    if(!this.renderSidewise){
                        this.actualModalDiv.style.position = "fixed";
                    }
                }
                // else{
                //     this.childComp.querySelector(".modalWrapper").style.position = "fixed";
                // }
            },this);
            /*------------------------------ MUTATE ENDS --------------------------*/
        },this);
        /*------------------------------ MEASURE ENDS --------------------------*/


    }

    callOnShow() {
        // if(this.getData('ltPropFreeze')){
        //     this.childComp.querySelector("lyte-modal-freeze").style.transitionDuration = this.getData('ltPropTransition').duration + "s";
        // }
        this.$node.classList.add('lyteModalOpened');
        var _this = this
        setTimeout(function(){
          var style = window.getComputedStyle(_this.actualModalDiv);
          var matrix = new window.WebKitCSSMatrix(style.transform);
          _this.setData('beforeDragPosition' , {
            xPos : matrix.m41,
            yPos : matrix.m42,
            scale : matrix.a
          })
          window._lyteUiUtils.dispatchEvent('lyteModalOpened' , _this.actualModalDiv)
        },(parseFloat(this.getData('ltPropTransition').duration)*1000+10))
        if(this.getMethods("onShow")){
            this.executeMethod("onShow",this);
        }
        if(this.addAriaValues){
            this.addAriaValues();
        }
    }

    callOnResize() {
        // this.updateScrollHandling();
        var dependentModalId = this.getData('ltPropDependentModalId');
        if(dependentModalId != '') {
            var dependentModalObj = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()(dependentModalId)[0].component;
            dependentModalObj.updateScrollHandling();
        }
        // if(this.isResponsibleForSidewiseRender()){
        //     LytePopup.components[1].$node.component.updateScrollHandling();
        // }
        var style = window.getComputedStyle(this.actualModalDiv);
        var matrix = new window.WebKitCSSMatrix(style.transform);
        this.setData('beforeDragPosition' , {
          xPos : matrix.m41,
          yPos : matrix.m42,
          scale : matrix.a
        })
        if(this.getMethods("onResize")){
            this.executeMethod("onResize",this);
        }
    }

    enableTransform(val, pos, duration) {
        this.$node.ltProp('showCopy',true);
        var self = this;
        setTimeout(function(){
            if(pos == 'x'){
                self.actualModalDiv.style.transform = "translate("+val+"px,0px)";
                self.transform = {'x' : val, 'y' : 0};
            }
            if(pos == 'y'){
                self.actualModalDiv.style.transform = "translate(0px,"+val+"px)";
                self.transform = {'x' : 0, 'y' : val};
            }
        },(duration != undefined ? duration : undefined))

    }

    /**
     * The method is going to redo the left and top computation when the modal is opened and the window is resized
     *
     */
    computeOffsetImplOnResize() {
        /*------------------------------ MEASURE STARTS --------------------------*/
         _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.measure(function() {
            var modalEle = this.actualModalDiv,
                modalElePosition = modalEle.getBoundingClientRect(),
                parentStyle = window.getComputedStyle(modalEle.parentElement),
                parentTop = parseInt(parentStyle.top), //Takes the modalWrapper's top value and subtracts it from the modals top to nullify the parent's top
                parentLeft = parseInt(parentStyle.left),
                correctedTop = modalEle.offsetTop,
                w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - (this.getData('ltPropFreeze') ? parentLeft : 0),
                h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - (this.getData('ltPropFreeze') ? parentTop : 0),
                prevWinH = this.getData('prevWinH'),
                prevWinW = this.getData('prevWinW'),
                transform = this.transform /*new WebKitCSSMatrix(window.getComputedStyle(modalEle).transform)*/,
                newTop = null,
                newLeft = null,
                offsetObj = this.getData('ltPropOffset'),
                heightDiff = this.getData('prevModalHeight') - modalElePosition.height,
                widthDiff = this.getData('prevModalWidth') - modalElePosition.width,
                freezeLayer, wrapperDiv;
                this.calculateForSidewiseRender();
            if(this.renderSidewise){
                this.renderProps.windowWidth = w;
                w = this.getData('ltPropTransition').animation == 'slideFromRight' ? this.renderProps.left : (this.renderProps.windowWidth - this.renderProps.right);
                freezeLayer = this.childComp.querySelector('lyte-modal-freeze');
                wrapperDiv = this.actualModalDiv.parentElement;
            }
            if(this.getData('ltPropTransition').animation === "fadeIn" || this.getData('ltPropTransition').animation === "zoom"){
              prevWinH = modalElePosition.height
              prevWinW = modalElePosition.width
                if(w < prevWinW){
                    if((offsetObj.left && offsetObj.left == "center") || (offsetObj.right && offsetObj.right == "center")){
                        newLeft = ((prevWinW - w) / 2);
                    }
                    else if(offsetObj.right){
                        newLeft = modalElePosition.left - (prevWinW - w);
                    }
                    else if(offsetObj.left){
                        newLeft = modalElePosition.left;
                    }
                }
                if(w > prevWinW){
                    if((offsetObj.left && offsetObj.left == "center") || (offsetObj.right && offsetObj.right == "center")){
                        newLeft = ((w - prevWinW) / 2);
                    }
                    else if(offsetObj.right){
                        newLeft = modalElePosition.left + (w - prevWinW);
                    }
                    else if(offsetObj.left){
                        newLeft = modalElePosition.left;
                    }
                }
                if(h < prevWinH){
                    if((offsetObj.top && offsetObj.top == "center") || (offsetObj.bottom && offsetObj.bottom == "center")){
                        newTop = (h - modalElePosition.height)/2 /*correctedTop - ((prevWinH - h) / 2)*/;
                    }
                    else if(offsetObj.bottom){
                        newTop = correctedTop - (prevWinH - h);
                    }
                    else if(offsetObj.top){
                        newTop = correctedTop;
                    }
                }
                if(h > prevWinH){
                    if((offsetObj.top && offsetObj.top == "center") || (offsetObj.bottom && offsetObj.bottom == "center")){
                        newTop = (h - modalElePosition.height)/2 /*correctedTop + ((h - prevWinH) / 2)*/;
                    }
                    else if(offsetObj.bottom && offsetObj.bottom != "center"){
                        newTop = correctedTop + (h - prevWinH);
                    }
                    else if(offsetObj.top && offsetObj.top != "center"){
                        newTop = correctedTop;
                    }
                }
                _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.mutate(function() {
                    if(newTop){
                        modalEle.style.top = newTop + "px";
                    }
                    if(newLeft){
                        modalEle.style.left = newLeft + "px";
                    }
                    this.callOnResize();
                },this);
            }
            else{
                if(w < prevWinW){
                    if((offsetObj.left && offsetObj.left == "center") || (offsetObj.right && offsetObj.right == "center")){
                        newLeft = transform.x - ((prevWinW - w) / 2) + (widthDiff / 2);
                    }
                    else if(offsetObj.right){
                        newLeft = transform.x - (prevWinW - w) + widthDiff;
                    }
                    else if(offsetObj.left){
                        newLeft = transform.x;
                    }
                    this.transform.x = newLeft;
                }
                if(w > prevWinW){
                    if((offsetObj.left && offsetObj.left == "center") || (offsetObj.right && offsetObj.right == "center")){
                        newLeft = transform.x + ((w - prevWinW) / 2) + (widthDiff / 2);
                    }
                    else if(offsetObj.right){
                        newLeft = transform.x + (w - prevWinW) + widthDiff;
                    }
                    else if(offsetObj.left){
                        newLeft = transform.x;
                    }
                    this.transform.x = newLeft;
                }
                if(h < prevWinH){
                    if((offsetObj.top && offsetObj.top == "center") || (offsetObj.bottom && offsetObj.bottom == "center")){
                        newTop = transform.y - ((prevWinH - h) / 2) + (heightDiff / 2);
                    }
                    else if(offsetObj.bottom){
                        newTop = transform.y - (modalElePosition.bottom - h + parseInt(offsetObj.bottom)) /*(prevWinH - h)*/;
                    }
                    else if(offsetObj.top){
                        newTop = transform.y;
                    }
                    this.transform.y = newTop;
                }
                if(h > prevWinH){
                    if((offsetObj.top && offsetObj.top == "center") || (offsetObj.bottom && offsetObj.bottom == "center")){
                        newTop = transform.y + ((h - prevWinH) / 2) + (heightDiff / 2);
                    }
                    else if(offsetObj.bottom && offsetObj.bottom != "center"){
                        newTop = transform.y + (h - modalElePosition.bottom - parseInt(offsetObj.bottom))/*(h - prevWinH)*/;
                    }
                    else if(offsetObj.top && offsetObj.top != "center"){
                        newTop = transform.y;
                    }
                    // console.log("prev top", this.transform.y);
                    // console.log("new top", newTop);
                    this.transform.y = newTop;
                }
                _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.mutate(function() {
                    modalEle.style.transitionDuration = "0s";
                    if(this.getData('ltPropTransition').animation === "slideFromTop" || this.getData('ltPropTransition').animation === "slideFromBottom"){
                        if(w < prevWinW){
                            if((offsetObj.left && offsetObj.left == "center") || (offsetObj.right && offsetObj.right == "center")){
                                modalEle.style.left = modalElePosition.left - ((prevWinW - w) / 2) + (widthDiff/2) + "px";
                            }
                            else if(offsetObj.right){
                                modalEle.style.left = modalElePosition.left - (prevWinW - w) + widthDiff + "px";
                            }
                            else if(offsetObj.left){
                                modalEle.style.left = modalElePosition.left + "px";
                            }
                            // modalEle.style.left = modalElePosition.left - ((prevWinW - w)/2) + "px";
                        }
                        if(w > prevWinW){
                            if((offsetObj.left && offsetObj.left == "center") || (offsetObj.right && offsetObj.right == "center")){
                              modalEle.style.left = modalElePosition.left + ((w - prevWinW) / 2) + (widthDiff/2) + "px";
                            }
                            else if(offsetObj.right){
                                modalEle.style.left = modalElePosition.left + (w - prevWinW) + widthDiff + "px";
                            }
                            else if(offsetObj.left){
                                modalEle.style.left = modalElePosition.left + "px";
                            }
                            // modalEle.style.left = modalElePosition.left + ((w - prevWinW)/2) + "px";
                        }
                        modalEle.style.transform = "translate(0px,"+this.transform.y+"px)";
                    }
                    else if(this.getData('ltPropTransition').animation === "slideFromLeft" || this.getData('ltPropTransition').animation === "slideFromRight"){
                        if(h < prevWinH){
                            if((offsetObj.top && offsetObj.top == "center") || (offsetObj.bottom && offsetObj.bottom == "center")){
                                modalEle.style.top = correctedTop - ((prevWinH - h) / 2) + (heightDiff/2) + "px";
                            }
                            else if(offsetObj.bottom){
                                modalEle.style.top = correctedTop - (prevWinH - h) + "px";
                            }
                            else if(offsetObj.top){
                                modalEle.style.top = correctedTop + "px";
                            }
                            // modalEle.style.top = modalElePosition.top - ((prevWinH - h)/2) + "px";
                        }
                        if(h > prevWinH){
                            if((offsetObj.top && offsetObj.top == "center") || (offsetObj.bottom && offsetObj.bottom == "center")){
                                modalEle.style.top = correctedTop + ((h - prevWinH) / 2) + (heightDiff/2) + "px";
                            }
                            else if(offsetObj.bottom && offsetObj.bottom != "center"){
                                modalEle.style.top = correctedTop + (h - prevWinH) + "px";
                            }
                            else if(offsetObj.top && offsetObj.top != "center"){
                                modalEle.style.top = correctedTop + "px";
                            }
                            // modalEle.style.top = modalElePosition.top + ((h - prevWinH)/2) + "px";
                        }
                        modalEle.style.transform = "translate("+this.transform.x+"px,0px)";
                        if(this.renderSidewise){
                            if(this.getData('ltPropTransition').animation == 'slideFromRight'){
                                var rightValue = this.renderProps.windowWidth - this.renderProps.left;
                                if(freezeLayer){
                                    freezeLayer.style.right = rightValue + "px";
                                }
                                if(wrapperDiv){
                                    wrapperDiv.style.right = rightValue - 5 + "px";
                                }
                            }
                            if(this.getData('ltPropTransition').animation == 'slideFromLeft'){
                                if(freezeLayer){
                                    freezeLayer.style.left = this.renderProps.right + "px";
                                }
                                if(wrapperDiv){
                                    wrapperDiv.style.left = (this.renderProps.right + 1) + "px";
                                }
                            }
                        }
                    }
                    this.callOnResize();
                    // modalEle.style.transitionDuration = this.$node.ltProp("transition").duration+"s";
                },this);
            }
            this.setData('prevModalHeight',modalElePosition.height);
            this.setData('prevModalWidth',modalElePosition.width);
            this.setData('prevWinH',h);
            this.setData('prevWinW',w);
        },this);
        /*------------------------------ MEASURE ENDS --------------------------*/
        // modalEle = null;
    }

    isResponsibleForSidewiseRender() {
        var components = window.LytePopup.components;
        if(components.length > 1 && components[components.length - 2] === this && components[components.length - 1].renderSidewise){
            return true;
        }
        return false;
    }

    /**
     * The method is going to calculate the left and top value of the modal and perform the animation
     *
     */
    computeOffsetImpl(arg, triggeredFromTransChange) {
        var lyteSelf = this;
        //sets the left and top of the modal based on user provided values
        var _this = this.nodeName && this.nodeName === "LYTE-MODAL" ? this.component : this;
        /*------------------------------ MEASURE STARTS --------------------------*/
        _this.fastdomfn6 = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.measure(function() {
           delete _this.fastdomfn6;
           if(!_this.actualModalDiv){
               return;
           }
           _this.calculateForSidewiseRender();
           var modalEle = _this.actualModalDiv;
           var freezeLayer, wrapperDiv;
           var offsetObj = lyteSelf.$addon .deepCopyObject(_this.$node.ltProp('offset'));
           var modalRect = modalEle.getBoundingClientRect();
           var modalElePosition = {top: modalRect.top,
                                   right: modalRect.right,
                                   bottom: modalRect.bottom,
                                   left: modalRect.left,
                                   width: modalEle.offsetWidth,
                                   height: modalEle.offsetHeight
                               };
           var parentLeft = 0, parentTop = 0;
           if(_this.getData('ltPropFreeze')){
               var parentStyle = window.getComputedStyle(modalEle.parentElement);
               parentLeft = parseInt(parentStyle.left);
               parentTop = parseInt(parentStyle.top);
           }
           var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - parentLeft;
           if(_this.renderSidewise){
               _this.renderProps.windowWidth = w;
               w = _this.getData('ltPropTransition').animation == 'slideFromRight' ? _this.renderProps.left : (_this.renderProps.windowWidth - _this.renderProps.right);
               freezeLayer = _this.childComp.querySelector('lyte-modal-freeze');
               wrapperDiv = _this.actualModalDiv.parentElement;
           }
           var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - parentTop;
            // $L.fastdom.mutate(() => {
               modalEle.style.transitionDuration = (arg != undefined ? arg : _this.$node.ltProp("transition").duration)+"s";
           // },this);
           _this.setData('prevWinH',h);
           _this.setData('prevWinW',w);
           _this.setData('prevModalHeight',modalElePosition.height);
           _this.setData('prevModalWidth',modalElePosition.width);
           if(offsetObj){
               if(offsetObj.left === "center" || offsetObj.right === "center"){
                   var offLeft = (w - modalElePosition.width)/2;
                   if(offLeft < 0){
                       offLeft = 20;
                   }
                   offsetObj.left = offLeft;
               }
               if(offsetObj.top === "center" || offsetObj.bottom === "center"){
                   var offTop = (h - modalElePosition.height)/2;
                   if(offTop < 0){
                       offTop = 20;
                   }
                   offsetObj.top = offTop;
               }
               if(offsetObj.right && offsetObj.right !== "center"){
                   if(offsetObj.right.indexOf("%") > -1){
                       offsetObj.left = w-(modalElePosition.width+(w/parseFloat(offsetObj.right)));
                   }
                   else{
                       offsetObj.left = w-(modalElePosition.width+parseFloat(offsetObj.right));
                   }
               }
               if(offsetObj.bottom && offsetObj.bottom !== "center"){
                   if(offsetObj.bottom.indexOf("%") > -1){
                       offsetObj.top = h-(modalElePosition.height+(h/parseFloat(offsetObj.bottom)));
                   }
                   else{
                       offsetObj.top = h-(modalElePosition.height+parseFloat(offsetObj.bottom));
                   }
               }
               if(offsetObj.left === "" || offsetObj.left == undefined){
                   _this.data.ltPropOffset.left = "center";
                   offsetObj.left = ((w - modalElePosition.width)/2);
               }
               if(offsetObj.top === "" || offsetObj.top == undefined){
                   _this.data.ltPropOffset.top = "center";
                   offsetObj.top = ((h - modalElePosition.height)/2);
               }
               if(_this.getData('ltPropTransition').originElement){
                   var ele = document.querySelector(_this.getData('ltPropTransition').originElement);
                   if(!ele){
                       console.error("The originElement provided does not exist. Kindly Check!");
                   }
                   else{
                       var eleOffset = ele.getBoundingClientRect();
                       offsetObj.originElementPos = {xDiff : (eleOffset.left + (eleOffset.width/2)) - (parseFloat(offsetObj.left) + (modalElePosition.width/2)),
                                                     yDiff : (eleOffset.top + (eleOffset.height/2)) - (parseFloat(offsetObj.top) + (modalElePosition.height/2)) };
                   }
               }
               /*------------------------------ MUTATE STARTS --------------------------*/
                _this.fastdomfn7 = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.mutate(function() {
                   delete _this.fastdomfn7;
                   if(_this.getData('first')){
                       window.LytePopup.bindTransitionEnd(_this.actualModalDiv);
                   }
                   if(_this.getData('ltPropTransition').animation == "slideFromTop"){
                       modalEle.style.left = parseFloat(offsetObj.left) + "px";
                       modalEle.style.top = (-1 * modalElePosition.height) + "px";
                       if(triggeredFromTransChange){
                           modalEle.style.transform = "translate(0px,"+(parseInt(offsetObj.top)+modalElePosition.height)+"px)";
                           _this.transform = {'x' : 0, 'y' : (parseInt(offsetObj.top)+modalElePosition.height)};
                           return;
                       }
                       _this.enableTransform(parseInt(offsetObj.top)+modalElePosition.height,"y",arg);
                   }
                   else if(_this.getData('ltPropTransition').animation == "slideFromBottom"){
                       modalEle.style.left = parseFloat(offsetObj.left) + "px";
                       modalEle.style.top = h+1 + "px";
                       if(triggeredFromTransChange){
                           modalEle.style.transform = "translate(0px,"+(-1 * (h - parseInt(offsetObj.top) + 1))+"px)";
                           _this.transform = {'x': 0, 'y': (-1 * (h - parseInt(offsetObj.top) + 1))};
                           return;
                       }
                       _this.enableTransform(-1 * (h - parseInt(offsetObj.top) + 1),"y",arg);
                   }
                   else if(_this.getData('ltPropTransition').animation == "slideFromLeft"){
                       if(_this.renderSidewise){
                           if(freezeLayer){
                               freezeLayer.style.left = _this.renderProps.right + "px";
                           }
                           if(wrapperDiv){
                               wrapperDiv.style.left = _this.renderProps.right + "px";
                           }
                       }
                       modalEle.style.top = parseFloat(offsetObj.top) + "px";
                       modalEle.style.left = (-1 * modalElePosition.width) + "px";
                       if(triggeredFromTransChange){
                           modalEle.style.transform = "translate("+(parseInt(offsetObj.left)+modalElePosition.width)+"px,0px)";
                           _this.transform = {'x' : (parseInt(offsetObj.left)+modalElePosition.width), 'y' : 0};
                           return;
                       }
                       _this.enableTransform(parseInt(offsetObj.left)+modalElePosition.width,'x',arg);
                   }
                   else if(_this.getData('ltPropTransition').animation == "slideFromRight"){
                       if(_this.renderSidewise){
                           var rightValue = _this.renderProps.windowWidth - _this.renderProps.left;
                           if(freezeLayer){
                               freezeLayer.style.right = rightValue + "px";
                           }
                           if(wrapperDiv){
                               wrapperDiv.style.right = rightValue - 5 + "px";
                           }
                       }
                       modalEle.style.top = parseFloat(offsetObj.top) + "px";
                       modalEle.style.left = w + 1 + "px";
                       if(triggeredFromTransChange){
                           modalEle.style.transform = "translate("+(-1 * (w - parseInt(offsetObj.left) + 1))+"px,0px)";
                           _this.transform = {'x' : (-1 * (w - parseInt(offsetObj.left) + 1)), 'y' : 0};
                           return;
                       }
                       _this.enableTransform(-1 * (w - parseInt(offsetObj.left) + 1),'x',arg);
                   }
                   else if(_this.getData('ltPropTransition').animation == "fadeIn"){
                       modalEle.style.left = parseFloat(offsetObj.left) + "px";
                       modalEle.style.top = parseFloat(offsetObj.top) + "px";
                       if(triggeredFromTransChange){
                           modalEle.style.transform = "";
                           return;
                       }
                       _this.$node.ltProp('showCopy',true);
                       // setTimeout(function(){
                           modalEle.style.opacity = 1;
                       // },200);
                   }
                   else if(_this.getData('ltPropTransition').animation == "zoom"){
                       _this.$node.ltProp('showCopy',true);
                       var transform = "scale(0)";
                       if(offsetObj.originElementPos){
                           transform = "translateX( "+ offsetObj.originElementPos.xDiff + "px) translateY( "+ offsetObj.originElementPos.yDiff + "px) scale(0)";
                       }
                       modalEle.style.left = parseFloat(offsetObj.left) + "px";
                       modalEle.style.top = parseFloat(offsetObj.top) + "px";
                       modalEle.style.transition = "none";
                       if(triggeredFromTransChange){
                           modalEle.style.transform = offsetObj.originElementPos ? 'translateX(0) translateY(0) scale(1)' : 'scale(1)';
                           setTimeout(function(){
                               modalEle.style.transition = "";
                           },16)
                           return;
                       }
                       modalEle.style.transform = transform;
                       modalEle.style.opacity = 1;
                       setTimeout(function(){
                           modalEle.style.transition = "";
                           modalEle.style.transitionDuration = (arg != undefined ? arg : _this.$node.ltProp("transition").duration)+"s";
                           if(offsetObj.originElementPos){
                               modalEle.style.transform = 'translateX(0) translateY(0) scale(1)';
                           }
                           else{
                               modalEle.style.transform = 'scale(1)';
                           }
                       },50);
                   }

                   if(_this.$node.ltProp("freeze")){
                       document.body.classList.add('bodyWrapper');
                       // LytePopup.bodywrapperCount += 1;
                   }
                   if(_this.getData('first')){
                       // LytePopup.bindTransitionEnd(_this.actualModalDiv);
                       _this.callOnShow();
                       _this.setData("first",false);
                   }
               },_this);
               /*------------------------------ MUTATE ENDS --------------------------*/
           }
           else{
               _this.setData('ltPropOffset',{left:"center", top:"center"});
               // _this.data.ltPropOffset.left = "center";
               // _this.data.ltPropOffset.top = "center";
               offsetObj.left = ((w - modalElePosition.width)/2);
               offsetObj.top = ((h - modalElePosition.height)/2);
               if(!_this.$node.ltProp("scrollable")){
                   if(offsetObj.left < 0){
                       offsetObj.left = 20;
                   }
                   if(offsetObj.top < 0){
                       offsetObj.top = 20;
                   }
               }
               if(_this.getData('ltPropTransition').originElement){
                   var ele = document.querySelector(_this.getData('ltPropTransition').originElement);
                   if(!ele){
                       console.error("The originElement provided does not exist. Kindly Check!");
                   }
                   else{
                       var eleOffset = ele.getBoundingClientRect();
                       offsetObj.originElementPos = {xDiff : (eleOffset.left + (eleOffset.width/2)) - (offsetObj.left + (modalElePosition.width/2)),
                                                     yDiff : (eleOffset.top + (eleOffset.height/2)) - (offsetObj.top + (modalElePosition.height/2)) };
                   }
               }
               /*------------------------------ MUTATE STARTS --------------------------*/
               _this.fastdomfn8 = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.mutate(function() {
                   delete _this.fastdomfn8;
                   if(_this.getData('first')){
                       window.LytePopup.bindTransitionEnd(_this.actualModalDiv);
                   }
                   if(_this.getData('ltPropTransition').animation == "slideFromTop"){
                       modalEle.style.left = parseFloat(offsetObj.left) + "px";
                       modalEle.style.top = (-1 * modalElePosition.height) + "px";
                       if(triggeredFromTransChange){
                           modalEle.style.transform = "translate(0px,"+(parseInt(offsetObj.top)+modalElePosition.height)+"px)";
                           _this.transform = {'x' : 0, 'y' : (parseInt(offsetObj.top)+modalElePosition.height)};
                           return;
                       }
                       _this.enableTransform(parseInt(offsetObj.top)+modalElePosition.height,"y",arg);
                   }
                   else if(_this.getData('ltPropTransition').animation == "slideFromBottom"){
                       modalEle.style.left = parseFloat(offsetObj.left) + "px";
                       modalEle.style.top = h+1 + "px";
                       if(triggeredFromTransChange){
                           modalEle.style.transform = "translate(0px,"+(-1 * (h - parseInt(offsetObj.top) + 1))+"px)";
                           _this.transform = {'x': 0, 'y': (-1 * (h - parseInt(offsetObj.top) + 1))};
                           return;
                       }
                       _this.enableTransform(-1 * (h - parseInt(offsetObj.top) + 1),"y",arg);
                   }
                   else if(_this.getData('ltPropTransition').animation == "slideFromLeft"){
                       if(_this.renderSidewise){
                           if(freezeLayer){
                               freezeLayer.style.left = _this.renderProps.right + "px";
                           }
                           if(wrapperDiv){
                               wrapperDiv.style.left = _this.renderProps.right + "px";
                           }
                       }
                       modalEle.style.top = parseFloat(offsetObj.top) + "px";
                       modalEle.style.left = (-1 * modalElePosition.width) + "px";
                       if(triggeredFromTransChange){
                           modalEle.style.transform = "translate("+(parseInt(offsetObj.left)+modalElePosition.width)+"px,0px)";
                           _this.transform = {'x' : (parseInt(offsetObj.left)+modalElePosition.width), 'y' : 0};
                           return;
                       }
                       _this.enableTransform(parseInt(offsetObj.left)+modalElePosition.width,'x',arg);
                   }
                   else if(_this.getData('ltPropTransition').animation == "slideFromRight"){
                       if(_this.renderSidewise){
                           var rightValue = _this.renderProps.windowWidth - _this.renderProps.left;
                           if(freezeLayer){
                               freezeLayer.style.right = rightValue + "px";
                           }
                           if(wrapperDiv){
                               wrapperDiv.style.right = rightValue - 5 + "px";
                           }
                       }
                       modalEle.style.top = parseFloat(offsetObj.top) + "px";
                       modalEle.style.left = w + 1 + "px";
                       if(triggeredFromTransChange){
                           modalEle.style.transform = "translate("+(-1 * (w - parseInt(offsetObj.left) + 1))+"px,0px)";
                           _this.transform = {'x' : (-1 * (w - parseInt(offsetObj.left) + 1)), 'y' : 0};
                           return;
                       }
                       _this.enableTransform(-1 * (w - parseInt(offsetObj.left) + 1),'x',arg);
                   }
                   else if(_this.getData('ltPropTransition').animation == "fadeIn"){
                       modalEle.style.left = parseFloat(offsetObj.left) + "px";
                       modalEle.style.top = parseFloat(offsetObj.top) + "px";
                       if(triggeredFromTransChange){
                           modalEle.style.transform = "";
                           return;
                       }
                       _this.$node.ltProp('showCopy',true);
                       // setTimeout(function(){
                           modalEle.style.opacity = 1;
                       // },200);
                   }
                   else if(_this.getData('ltPropTransition').animation == "zoom"){
                       _this.$node.ltProp('showCopy',true);
                       var transform = "scale(0)";
                       if(offsetObj.originElementPos){
                           transform = "translateX( "+ offsetObj.originElementPos.xDiff + "px) translateY( "+ offsetObj.originElementPos.yDiff + "px) scale(0)";
                       }
                       modalEle.style.left = parseFloat(offsetObj.left) + "px";
                       modalEle.style.top = parseFloat(offsetObj.top) + "px";
                       modalEle.style.transition = "none";
                       if(triggeredFromTransChange){
                           modalEle.style.transform = offsetObj.originElementPos ? 'translateX(0) translateY(0) scale(1)' : 'scale(1)';
                           setTimeout(function(){
                               modalEle.style.transition = "";
                           },16)
                           return;
                       }
                       modalEle.style.transform = transform;
                       modalEle.style.opacity = 1;
                       setTimeout(function(){
                           modalEle.style.transition = "";
                           modalEle.style.transitionDuration = (arg != undefined ? arg : _this.$node.ltProp("transition").duration)+"s";
                           if(offsetObj.originElementPos){
                               modalEle.style.transform = 'translateX(0) translateY(0) scale(1)';
                           }
                           else{
                               modalEle.style.transform = 'scale(1)';
                           }
                       },50);
                   }
                   if(_this.$node.ltProp("freeze")){
                       document.body.classList.add('bodyWrapper');
                       // LytePopup.bodywrapperCount += 1;
                   }
                   if(_this.getData('first')){
                       _this.callOnShow();
                       _this.setData("first",false);
                   }
               },_this);
               /*------------------------------ MUTATE ENDS --------------------------*/
           }
       },_this);
        /*------------------------------ MEASURE ENDS --------------------------*/
        // modalEle = null;
    }

    /**
     * The method is going to check if sidewise render will be done and assigns the values that will be used for sidewise rendering of the modal
     *
     */
    calculateForSidewiseRender() {
        if(window.LytePopup.components.length > 1){
            var prevModal;
            // if(this.getData('modalCreationOrder') > 0) {
            // // if(LytePopup.components[LytePopup.components.length - 2].$node.tagName === "LYTE-MODAL"){
                // prevModal = LytePopup.components[this.getData('modalCreationOrder')-1];
            // }
            var parentModalId = this.getData('ltPropParentModalId');
            if( parentModalId != '') {
                prevModal = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()(parentModalId)[0].component;
            }
            else if(parentModalId == '' && this.getData('ltPropDependentModalId') == '') {
                var curModalIndexInArray = window.LytePopup.components.indexOf(this);
				if((curModalIndexInArray > 0) && (window.LytePopup.components[curModalIndexInArray - 1].$node.tagName === "LYTE-MODAL")){
					prevModal = window.LytePopup.components[curModalIndexInArray - 1];
				}
            }
            if(!this.getData('ltPropOverlapModal') && prevModal && prevModal.getData('ltPropAllowMultiple') && ["slideFromLeft","slideFromRight"].indexOf(this.getData('ltPropTransition').animation) != -1){
                this.renderSidewise = true;
                var prevModalOffset = prevModal.actualModalDiv.getBoundingClientRect();
                this.renderProps = {
                    prevModal : prevModal,
                    left : Math.round(prevModalOffset.left),
                    right : Math.round(prevModalOffset.right),
                    width : Math.round(prevModalOffset.width)
                };
            }
        }
    }

    closeModal() {
        var freezeLayer = this.childComp.querySelector('lyte-modal-freeze');
        if(this.renderSidewise){
            if(this.getData('ltPropTransition').animation == "slideFromRight"){
                if(freezeLayer){
                    freezeLayer.style.right = "";
                }
                this.actualModalDiv.parentElement.style.right = "";
            }
            if(this.getData('ltPropTransition').animation == "slideFromLeft"){
                if(freezeLayer){
                    freezeLayer.style.left = "";
                }
                this.actualModalDiv.parentElement.style.left = "";
            }
            delete this.renderSidewise;
            delete this.renderProps;
        }
        if(window._lyteUiUtils.getRTL()){
            if(!this.getData('ltPropIgnoreInlineDirection')){
              if(this.getData('ltPropTransition').animation == "slideFromLeft"){
                  this.getData('ltPropTransition').animation = "slideFromRight";
              }
              else if(this.getData('ltPropTransition').animation == "slideFromRight"){
                  this.getData('ltPropTransition').animation = "slideFromLeft";
              }
            var offset = this.getData('ltPropOffset'),
                newOffset = {};
            for(window.key in offset){
                if(window.key == "left" && offset[window.key] != "center"){
                    newOffset.right = offset[window.key];
                }
                else if(window.key == "right"){
                    newOffset.left = offset[window.key];
                }
                else{
                    newOffset[window.key] = offset[window.key];
                }
            }
            this.setData('ltPropOffset',newOffset);
          }
        }
        if(this.getData('ltPropTransition').animation == "zoom"){
            this.actualModalDiv.style.opacity = "0";
            this.actualModalDiv.style.transform = "";
        }
        if(!this.$node.ltProp('freeze')){
            this.childComp.querySelector(".modalWrapper").classList.remove('noFreeze');
        }
        this.$node.ltProp({"showCopy":false,"show":false});
        // LytePopup.closePopup(this);

        if(!this.$node.ltProp('freeze')){
            this.actualModalDiv.style.position = "";
        }
        this.$node.classList.remove('lyteModalOpened');
        if(this.actualModalDiv){
            this.actualModalDiv.style.transform = "";
        }

		var transitionDuration = this.getData('ltPropTransition').duration;
		var closeDuration = this.getData('ltPropCloseDuration');
		if(closeDuration) {
			transitionDuration = (closeDuration / 1000);
		}
		var _this = this;
		setTimeout(function() {
			var modalElem = _this.$node;
            if(modalElem){
                modalElem.ltProp({"showCopy":false, "show": false});
                modalElem.classList.remove('lyteModalOpened');
                _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()(_this.childComp).addClass('lyteModalHidden');
                if( _this.getData('ltPropTransition').animation == "zoom"){
                    _this.actualModalDiv.style.opacity = "0";
                    _this.actualModalDiv.style.transform = "";
                }
            }
            if(_this.getMethods("onClose")){
                _this.executeMethod("onClose",_this);
            }
		}, (transitionDuration * 1000));

        window._lyteUiUtils.dispatchEvent('lyteModalClosed' , this.actualModalDiv)
        if(window._lyteUiUtils.popupStack.modalStack.length < 1 ){
            document.body.classList.remove('bodyWrapper');
            document.body.classList.remove('lyteBodyWrapper');
        }
        this.setData('ltPropShowWormhole' , false);
        // if(this.getMethods("onClose")){
        //     this.executeMethod("onClose",this);
        // }
        window.LytePopup.checkAndRemoveWrapper();
    }

    onBeforeCloseHandling(event) {
        var result = true;
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        if(this.actualModalDiv){
            window._lyteUiUtils.dispatchEvent('lyteModalBeforeClose' , this.actualModalDiv)
        }
        if(this.getMethods("onBeforeClose")){
            result = this.executeMethod("onBeforeClose",event,this);
        }
        if(result === undefined || result){
            if(this.actualModalDiv && this.childComp){
                if(this.getData('ltPropFreeze') && this.addedFreezeDetails){
                    window.LytePopup.hideOrShowFreeze("close",this);
                    delete this.addedFreezeDetails;
                }
                var animDur = parseFloat(this.$node.ltProp('transition').duration) * 1000;
                var self = this;
                // console.log("duration",animDur);
                // var t1 = performance.now();
                this.timeOutId = setTimeout(function(){
                    delete self.timeOutId;
                    // var t2 = performance.now();
                    // console.log(t2 -t1);
                    self.closeModal();
                },animDur);
                var modalEle = this.actualModalDiv;
                if(this.getData('ltPropCloseDuration')){
                    modalEle.style.transitionDuration = (this.getData('ltPropCloseDuration') / 1000)+"s";
                }
                else{
                    modalEle.style.transitionDuration = (animDur / 1000)+"s";
                }
                // console.log("transitionDuration", modalEle.style.transitionDuration);
                var modalElemOffset;
                var transform = "scale(0)", transformVal;
                /*------------------------------ MEASURE STARTS --------------------------*/
                _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.measure(function(){
                    modalElemOffset = modalEle.getBoundingClientRect();
                    if(this.getData('ltPropTransition').animation == "zoom" && this.getData('ltPropTransition').originElement){
                        var ele = document.querySelector(this.getData('ltPropTransition').originElement);
                        if(!ele){
                            Console.error("The originElement provided does not exist. Kindly Check!");
                        }
                        else{
                            var eleOffset = ele.getBoundingClientRect();
                            var modalElePosition = {top: modalElemOffset.top,
                                                    right: modalElemOffset.right,
                                                    bottom: modalElemOffset.bottom,
                                                    left: modalElemOffset.left,
                                                    width: modalEle.offsetWidth,
                                                    height: modalEle.offsetHeight
                                                };
                            var originElementPos = {xDiff : (eleOffset.left + (eleOffset.width/2)) - (modalElePosition.left + (modalElePosition.width/2)),
                                                          yDiff : (eleOffset.top + (eleOffset.height/2)) - (modalElePosition.top + (modalElePosition.height/2)) };
                            transform = "translateX( "+ originElementPos.xDiff + "px) translateY( "+ originElementPos.yDiff + "px) scale(0)"
                        }
                    }
                },this);
                /*------------------------------ MEASURE ENDS --------------------------*/
                /*------------------------------ MUTATE STARTS --------------------------*/
                _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.mutate(function(){
                    if(this.getData('ltPropTransition').animation == "slideFromTop"){
                        // modalEle.style.transform = "translateY(-100%)";
                        transformVal = -(Math.ceil(modalElemOffset.height) + parseInt(modalEle.style.top) + 10) + "px";
                        modalEle.style.transform = "translateY("+transformVal+")";
                    }
                    else if(this.getData('ltPropTransition').animation == "slideFromBottom"){
                        // modalEle.style.transform = "translateY(100%)";
                        transformVal = (h - parseInt(modalEle.style.top) + 10) + "px";
                        modalEle.style.transform = "translateY("+transformVal+")";
                    }
                    else if(this.getData('ltPropTransition').animation == "slideFromLeft"){
                        // modalEle.style.transform = "translateX(-100%)";
                        transformVal = -(Math.ceil(modalElemOffset.width) + parseInt(modalEle.style.left) + 10) + "px";
                        modalEle.style.transform = "translateX("+transformVal+")";
                    }
                    else if(this.getData('ltPropTransition').animation == "slideFromRight"){
                        // modalEle.style.transform = "translateX(100%)";
                        transformVal = (((this.renderProps && this.renderProps.left) || w ) - parseInt(modalEle.style.left) + 10) + "px";
                        modalEle.style.transform = "translateX("+transformVal+")";
                    }
                    else if(this.getData('ltPropTransition').animation == "fadeIn"){
                        modalEle.style.opacity = 0;
                    }
                    else if(this.getData('ltPropTransition').animation == "zoom"){
                        modalEle.style.transform = transform;
                    }
                    delete this.transform;
                    if(!(this.$node.classList.contains('lyteModalOpened'))){
                        modalEle.style.transform = "";
                    }
                },this);
                _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.mutate(function(){
                    modalEle = null;
                });
                /*------------------------------ MUTATE ENDS --------------------------*/

                modalEle.classList.remove('lyteModalFromTop','lyteModalFromBottom','lyteModalFromLeft','lyteModalFromRight','lyteModalFadeIn','lyteZoom');
                if(this.$node.ltProp('freeze') && this.childComp.querySelector("lyte-modal-freeze")){
                    var freezeLayer = this.childComp.querySelector("lyte-modal-freeze");
                    setTimeout(function(){
                        freezeLayer.style.opacity = 0;
                        freezeLayer.style.visibility = "";
                    }.bind(this), 300);
                }
                window.LytePopup.closePopup(this);
                // LytePopup.bindTransitionEnd(this.actualModalDiv);
                this.setData("first",true);
                this.setData('initializedPosition',false);
                this.setData('calculateHW', false);
            }
            this.$node.alignModal = null;
            this.$node.resetPosition = null;
            this.$node.alignLyteModal = null;
            this.$node.calculateOffset = null;
            this.$node.reflectTransitionChange = null;
        }
        else{
            this.setData('returnedFalse',true);
            this.$node.ltProp('show',true);
        }
    }

    onBeforeShowHandling() {
        var result = true;
        if(this.getMethods("onBeforeShow")){
            result = this.executeMethod("onBeforeShow",this) ;
        }
        // if(!_lyteUiUtils.modalCreationOrder){
        //   _lyteUiUtils.modalCreationOrder = 0
        // }
        // _lyteUiUtils.modalCreationOrder += 1
        // this.setData('modalCreationOrder' , _lyteUiUtils.modalCreationOrder-1);
        if(result === undefined || result){
            this.setData('checkAria', this.getData('checkAria')+1);
            this.addDragHandler();
            this.updateScrollHandling();

            var modalEle = this.actualModalDiv;
            var val = "";
            modalEle.style.transitionDuration = this.$node.ltProp("transition").duration+"s";
            var classVal = "lyteModalFrom";
            var modalStyle = this.actualModalDiv.style;
            var modalElemOffset = this.actualModalDiv.getBoundingClientRect();
            var windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

            switch(this.$node.ltProp("transition").animation){
                case "slideFromTop":
                    classVal += "Top";
                    break;
                case "slideFromBottom":
                    classVal += "Bottom";
                    break;
                case "slideFromLeft":
                    classVal += "Left";
                    break;
                case "slideFromRight":
                    classVal += "Right";
                    break;
                case "fadeIn":
                    classVal = "lyteModalFadeIn";
                    break;
                case "zoom":
                    classVal = "lyteZoom";
                    break;
            }
            /*------------------------------ MUTATE STARTS --------------------------*/
            this.fastdomfn1 = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default().fastdom.mutate(function(){
                delete this.fastdomfn1;
                this.actualModalDiv.classList.add(classVal);
                this.actualModalDiv.style.opacity = "";
                modalEle = null;
            },this);
            /*------------------------------ MUTATE ENDS --------------------------*/
            window.LytePopup.addPopup(this);
            this.calculateForSidewiseRender();
            if(this.$node.ltProp('freeze')){
                var freezeLayer = this.childComp.querySelector("lyte-modal-freeze");
                if(this.renderSidewise){
                    if(this.getData('ltPropTransition').animation == 'slideFromRight'){
                        freezeLayer.style.right = (windowWidth - this.renderProps.left) + "px";
                    }
                    if(this.getData('ltPropTransition').animation == 'slideFromLeft'){
                        freezeLayer.style.left = this.renderProps.right + "px";
                    }

                }
                var freezeStyle = freezeLayer.style;
                // freezeStyle.opacity = this.getData('ltPropDimmer').opacity;
                if(this.getData('ltPropDimmer') && this.getData('ltPropDimmer').color){
                    freezeStyle.background = this.getData('ltPropDimmer').color;
                }
                if(!this.addedFreezeDetails){
                    freezeStyle.opacity = this.getData('ltPropDimmer') && this.getData('ltPropDimmer').opacity ? this.getData('ltPropDimmer').opacity : "";
                }
            }
            this.$node.alignModal = this.computeOffsetImpl.bind(this, 0, true)
            this.$node.resetPosition = function(){
              window.LytePopup.x = this.getData('beforeDragPosition').xPos
              LytePopup.y = this.getData('beforeDragPosition').yPos
              LytePopup.xPos = this.getData('beforeDragPosition').xPos
              LytePopup.yPos = this.getData('beforeDragPosition').yPos
              this.component.transform.x = this.getData('beforeDragPosition').xPos
              this.component.transform.y = this.getData('beforeDragPosition').yPos
              if(this.getData('ltPropTransition').animation === "zoom"){
                this.component.actualModalDiv.style.transform = "translate("+this.getData('beforeDragPosition').xPos+"px ,"+this.getData('beforeDragPosition').yPos+"px) scale("+this.getData('beforeDragPosition').scale+")"
              } else {
                this.component.actualModalDiv.style.transform = "translate("+this.getData('beforeDragPosition').xPos+"px ,"+this.getData('beforeDragPosition').yPos+"px)"
              }
            }
            this.$node.alignLyteModal = function(){
              this.component.updateScrollHandling()
              this.component.computeOffsetImpl.bind(this.component, 0, true)
            }
            this.$node.calculateOffset = this.updateScrollHandling.bind(this);
            this.$node.reflectTransitionChange = this.reflectTransitionChange.bind(this);
        }
        else{
            this.setData('returnedFalse',true);
            this.$node.ltProp({"showCopy":false,"show":false});
        }
    }

    /**
     * The method is going to change the transition property when the modal is opened with different animation and closed with different animation
     * This util function is required to be triggered by the developer after they change the ltPropTransition value
     * The function can be triggered in onShow inside a setTimeout of 500ms or before the ltPropShow of the modal is set to false
     *
     */
    reflectTransitionChange() {
        this.computeOffsetImpl(null, true);
    }

    didDestroy() {
        //   _lyteUiUtils.modalCreationOrder -= 1;
        this.setData('ltPropShowWormhole', false);
        this.$node.classList.remove('lyteModalOpened');
        if(this.timeOutId){
            clearTimeout(this.timeOutId);
            delete this.timeOutId;
        }
        if(this.beforeCloseId){
            clearTimeout(this.beforeCloseId);
            delete this.beforeCloseId;
        }
        if(this.renderSidewise){
            delete this.renderSidewise;
            delete this.renderProps;
        }
        if(this.childComp){
            this.clearFastdomBatch();
            if(this.getData('ltPropFreeze') && this.addedFreezeDetails){
                window.LytePopup.hideOrShowFreeze("close",this);
                delete this.addedFreezeDetails;
            }
            window.LytePopup.closePopup(this);
            this.childComp.remove();
            delete this.actualModalDiv;
            delete this.childComp;
            // if(this.$node.ltProp('freeze')){
            //     LytePopup.bodywrapperCount -= 1;
            //     if(LytePopup.bodywrapperCount == 0 || LytePopup.components.length == 0){
            //         document.body.classList.remove('bodyWrapper');
            //     }
            // }
            window.LytePopup.checkAndRemoveWrapper();
        }
        // LytePopup.components = [];
    }

    static actions(arg1) {
        return Object.assign(super.actions({
            close : function(){
               this.$node.ltProp("show",false);
            }
        }), arg1);
    }

    static methods(arg1) {
        return Object.assign(super.methods({
            beforeWormholeAppend : function(arg){
                if(this.childComp){
                    delete this.childComp;
                }
                if(this.actualModalDiv){
                    delete this.actualModalDiv;
                }
                this.childComp = arg;
                this.actualModalDiv = this.childComp.querySelector(".lyteModal");
            }
        }), arg1);
    }

    static observers(arg1) {
        return Object.assign(super.observers({
            showToggled : function(){

                var event = event || window.event;
                if(this.getData('returnedFalse')){
                    this.setData('returnedFalse',false);
                    return;
                }
                if(this.$node.ltProp("reRenderModal")){
                    if(this.$node.ltProp("show")){
                        this.$node.ltProp({"showCopy":false, "show":false});
                        window.LytePopup.closePopup(this);
                        this.setData("first",true);
                        this.setData('initializedPosition',false);
                    }
                    this.$node.ltProp("reRenderModal",false);
                }
                if(this.timeOutId){
                    delete this.timeOutId;
                    this.closeModal();
                    window.LytePopup.closePopup(this);
                }
                if(this.$node.ltProp("show") && !this.$node.ltProp("showCopy")){
                    _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()(this.childComp).removeClass('lyteModalHidden')
                    if(window._lyteUiUtils.getRTL()){
                      if(!this.getData('ltPropIgnoreInlineDirection')){
                        if(this.getData('ltPropTransition').animation == "slideFromLeft"){
                            this.getData('ltPropTransition').animation = "slideFromRight";
                        }
                        else if(this.getData('ltPropTransition').animation == "slideFromRight"){
                            this.getData('ltPropTransition').animation = "slideFromLeft";
                        }
                        var offset = this.getData('ltPropOffset'),
                            newOffset = {};
                        for(window.key in offset){
                            if(window.key == "left" && offset[window.key] != "center"){
                                newOffset.right = offset[window.key];
                            }
                            else if(window.key == "right"){
                                newOffset.left = offset[window.key];
                            }
                            else{
                                newOffset[window.key] = offset[window.key];
                            }
                        }
                        this.setData('ltPropOffset',newOffset);
                      }
                    }
                    if(window.LytePopup.components.indexOf(this) != -1){
                        window.LytePopup.closePopup(this);
                        this.setData("first",true);
                        this.setData('initializedPosition',false);
                    }
                    this.$node.ltProp("bindToBody",true);
                    window._lyteUiUtils.dispatchEvent('lyteModalBeforeOpen' , this.actualModalDiv)
                    this.setData('ltPropShowWormhole' , true)

                    if(this.getData('ltPropPadding') !== ''){
                        var modalYield = _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()(this.childComp).find('.lyteModalYield').eq(0)
                        modalYield.addClass('lyteModalYieldWithPadding')
                        modalYield[0].style.padding = this.getData('ltPropPadding')
                    }

                    var self = this;
                    this.beforeShowId = setTimeout(function(){
                        delete self.beforeShowId;
                        self.onBeforeShowHandling();
                    },0);

                }
                else{
                    this.setData('ltPropShowWormhole' , false)
                    if(this.transitionEndTimeout){
                        clearTimeout(this.transitionEndTimeout);
                        delete this.transitionEndTimeout;
                    }
                    this.clearFastdomBatch();
                    if(this.$node.ltProp("showCopy")){
                        var self = this;
                        this.beforeCloseId = setTimeout(function(){
                            delete self.beforeCloseId;
                            self.onBeforeCloseHandling(event);
                        },0);
                    }
                    else{
                        if(window.LytePopup.components.indexOf(this) != -1){
                            window.LytePopup.closePopup(this);
                            this.setData("first",true);
                            this.setData('initializedPosition',false);
                        }
                    }
                }
            }.observes("ltPropShow","ltPropReRenderModal").on('didConnect'),

            triggerDraggable : function(){
              this.addDragHandler();
            }.observes("ltPropDraggable"),

            changeBindToBody : function(){
                if(!this.getData('ltPropBindToBody')){
                    if(this.getData('ltPropFreeze') && this.addedFreezeDetails){
                        window.LytePopup.hideOrShowFreeze("close",this,true);
                        delete this.addedFreezeDetails;
                    }
                    window.LytePopup.closePopup(this);
                    if(this.renderSidewise){
                        delete this.renderSidewise;
                        delete this.renderProps;
                    }
                    this.actualModalDiv = null;
                    this.childComp = null;
                    if(this.getData('ltPropShow') ){
                        this.setData({'ltPropShowCopy':false,'ltPropShow':false});
                    }
                    else if(this.getData('ltPropShowCopy')){
                        this.setData('ltPropShowCopy', false);
                    }
                    this.setData("first",true);
                    this.setData('initializedPosition',false);
                    this.$node.classList.remove('lyteModalOpened');
                    // if(this.$node.ltProp('freeze')){
                    //     LytePopup.bodywrapperCount -= 1;
                    //     if(LytePopup.bodywrapperCount == 0){
                    //         document.body.classList.remove('bodyWrapper');
                    //     }
                    // }
                    window.LytePopup.checkAndRemoveWrapper();
                }
            }.observes("ltPropBindToBody"),

            addAriaValues : function( arg ) {
                if(this.getData('ltPropAria')){
                    var ariaProp = this.getData('ltPropAriaAttributes') || {};
                    _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()(this.actualModalDiv).attr('aria-modal' , true)
                    _lyte_dom_modules_lyte_dom_utils_js__WEBPACK_IMPORTED_MODULE_2___default()(this.actualModalDiv).attr('aria-expanded' , this.getData('ltPropShow'))
                    window._lyteUiUtils.setAttribute( this.actualModalDiv, ariaProp, arg ? arg.oldValue : {} );
                    var closeIcon = this.actualModalDiv.querySelector('.lyteModalClose');
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
            }.observes("ltPropWidth","ltPropMaxWidth","ltPropHeight","ltPropMaxHeight")
        }), arg1);
    }

    _() {
        _;
    }
}

LyteModalComponent._template = "<template tag-name=\"lyte-modal\" role=\"dialog\" aria-label=\"lyte modal\"> <template is=\"switch\" l-c=\"true\" _new=\"true\"><template case=\"{{expHandlers(ltPropBindToBody,'&amp;&amp;',expHandlers(ltPropReRenderModal,'!'))}}\" is=\"case\" lc-id=\"lc_id_0\"> <lyte-wormhole case=\"true\" style=\"{{if(ltPropShowCopy,'visibility:visible','visibility:hidden')}}\" lt-prop-focus-on-close=\"{{ltPropFocusOnClose}}\" on-before-append=\"{{method(&quot;beforeWormholeAppend&quot;)}}\" lt-prop-show=\"{{ltPropShowWormhole}}\"> <template is=\"registerYield\" yield-name=\"lyte-content\"> <div class=\"modalWrapper {{ltPropWrapperClass}} lytePopupZI\"> <div class=\"lyteModal\"> <template is=\"switch\" l-c=\"true\"><template is=\"case\" case=\"{{ltPropShowCloseButton}}\" lc-id=\"lc_id_0\"><span class=\"lyteModalClose\" onclick=\"{{action('close')}}\" tabindex=\"0\"></span></template></template> <lyte-yield yield-name=\"modal\" class=\"lyteModalYield\"></lyte-yield> </div> <template is=\"switch\" l-c=\"true\"><template is=\"case\" case=\"{{ltPropFreeze}}\" lc-id=\"lc_id_0\"><lyte-modal-freeze></lyte-modal-freeze></template></template> </div> </template> </lyte-wormhole> </template></template> </template>";;
LyteModalComponent._dynamicNodes = [{"t":"s","p":[1],"c":{"lc_id_0":{"dN":[{"t":"a","p":[1],"a":{"style":{"name":"style","helperInfo":{"name":"if","args":["ltPropShowCopy","'visibility:visible'","'visibility:hidden'"]}}},"cn":"lc_id_0"},{"t":"r","p":[1,1],"dN":[{"t":"a","p":[1]},{"t":"s","p":[1,1,1],"c":{"lc_id_0":{"dN":[{"t":"a","p":[0],"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{}},"hd":true,"co":["lc_id_0"],"in":2,"sibl":[1]},{"t":"i","p":[1,1,3],"in":1,"sibl":[0]},{"t":"s","p":[1,3],"c":{"lc_id_0":{"dN":[{"t":"cD","p":[0],"in":0,"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{"dc":[0],"hc":true,"trans":true}},"hd":true,"co":["lc_id_0"],"hc":true,"trans":true,"in":0}],"dc":[1,0],"hc":true,"trans":true,"in":1,"sibl":[0],"cn":"lc_id_0"},{"t":"cD","p":[1],"in":0,"cn":"lc_id_0"}],"cdp":{"t":"a","p":[0]},"dcn":true}},"d":{},"dc":{"lc_id_0":{"dc":[1,0],"hc":true,"trans":true}},"hd":true,"co":["lc_id_0"],"hc":true,"trans":true,"in":0},{"type":"dc","trans":true,"hc":true,"p":[0]}];;

LyteModalComponent._observedAttributes = [
    "ltPropShow",
    "ltPropFreeze",
    "ltPropShowCloseButton",
    "ltPropCloseOnEscape",
    "ltPropTransition",
    "ltPropOffset",
    "ltPropDimmer",
    "ltPropDraggable",
    "ltPropAllowMultiple",
    "ltPropScrollable",
    "ltPropMaxHeight",
    "ltPropMaxWidth",
    "ltPropWidth",
    "ltPropHeight",
    "ltPropWrapperClass",
    "ltPropBindToBody",
    "ltPropShowCopy",
    "ltPropReRenderModal",
    "ltPropOverlayClose",
    "ltPropAria",
    "ltPropAriaAttributes",
    "ltPropPreventFocus",
    "ltPropSetContentHeight",
    "ltPropCloseDuration",
    "ltPropOverlapModal",
    "ltPropIgnoreInlineDirection",
    "ltPropAllowContainment",
    "ltPropFocusOnClose",
    "ltPropPadding",
    "ltPropDependentModalId",
    "ltPropParentModalId",
    "ltPropShowWormhole",
    "first",
    "resizeCalled",
    "initializedPosition",
    "prevHeight",
    "returnedFalse",
    "prevModalHeight",
    "prevModalWidth",
    "calculateHW",
    "checkAria",
    "beforeDragPosition",
    "resetTriggered"
];

if (document.readyState === "complete" || document.readyState === "interactive"){
    window.addModalEvent();
}
else{
    document.addEventListener("DOMContentLoaded", function(event){
        window.addModalEvent(event);
    });
}

if (typeof Object.assign != 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: window.assign = function(target, varArgs) { // .length of function is 2
      'use strict';
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}

/**
 * @syntax yielded
 * <lyte-modal>
 *     <template is = "registerYield" yield-name = "modal">
 *         <lyte-modal-header> Create Profile </lyte-modal-header>
 *         <lyte-modal-content>
 *             //Some Content
 *         </lyte-modal-content>
 *         <lyte-modal-footer class = "right">
 *             //Some button
 *         </lyte-modal-footer>
 *     </template>
 * </lyte-modal>
 */


LyteModalComponent.register("lyte-modal", {
    hash: "LyteModalComponent_4",
    refHash: "C_lyte-ui-component_@zoho/lyte-ui-component_2"
});


/***/ })

}]);
//# sourceMappingURL=image-comp.js.map