import {Component} from "@slyte/component";
import { prop } from "@slyte/core";
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
        
        // const existingBoxes = parent.querySelectorAll('.edit-rectangle-box');
        // existingBoxes.forEach(box => box.remove());
        
        console.log("Number of annotations in _recMap:", Bbox.length);
        
        Bbox._recMap.forEach((annotation, key) => {
            console.log("Creating box for annotation:", annotation);
            
            const box = document.createElement('div');
            box.className = 'edit-rectangle-box';
            box.style.position = 'absolute';
            box.style.border = '2px solid red';
            box.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
            box.style.cursor = 'move';
            box.style.zIndex = '10';
            
            const bbox = annotation.Bbox || annotation.bbox;
            
            if (bbox) {
                console.log("Bbox values:", bbox);
                
                const addPx = (val) => {
                    if (!val) return '0px';
                    return String(val).includes('px') ? val : val + 'px';
                };
                
                box.style.left = addPx(bbox.x);
                box.style.top = addPx(bbox.y);
                box.style.width = addPx(bbox.width);
                box.style.height = addPx(bbox.height);
                
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

    data() {
        return {
            imageUrl: prop("string"),
			flgRectangle: prop("boolean", {default: false}),
			Bbox: prop("array", {default: []})
        }
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

    static methods() {
        return {
        }
    }

    static actions() {
        return {
            handleRectangleCreation: function(event) {
                event.preventDefault();
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
            
            handleRectangleRelease: function() {
                console.log("this is updating")
                if (this.isDrawing && this.currentRect) {
                    this.createResizeHandles(this.currentRect);
                    this.showHandlesForRect(this.currentRect);
                    var rec = this.$db.newEntity({schema: AnnotationSchema});
                    var x = parseInt(this.currentRect.style.left);
                    var y = parseInt(this.currentRect.style.top);
                    var width = parseInt(this.currentRect.style.width);
                    var height = parseInt(this.currentRect.style.height);
                    var config = {x: x, y: y, width: width, height: height};
                    console.log("config", config); 
                    rec.$.set("Bbox",config);
                    var image_id = localStorage.getItem("imageId");
                    rec.$.set("image_id",image_id)
                    console.log(image_id)
                   
                    
                    var self = this;
                    
                    var result=rec.$.save().then(function(data) {
                      console.log("success")
                    }, function(err) {
                    console.log("not success",err)
                    });
                    console.log(result)
                    
                }
                
                this.isDrawing = false;
                this.isDragging = false;
                this.isResizing = false;
                this.resizeHandle = null;
                this.currentRect = null;
            },
            
            handleDelete: function() {
                const rectangles = document.querySelectorAll('.edit-rectangle-box');
                rectangles.forEach(rect => rect.remove());
                this.hideAllHandles();
            },
            
            handleDownload: function() {
                console.log('Download functionality would be implemented here');
                alert('Download functionality would capture the image with rectangles');
            },
            
            handleRectangleClick: function() {
                var current = !this.getData("flgRectangle");
                this.setData("flgRectangle", current);
            }
        }
    }

    static observers() {
        return {
            Bbox: function(newValue) {
                if (newValue && newValue._recMap && newValue._recMap.size > 0) {
                    // When Bbox changes, reload boxes
                    console.log("Bbox observer triggered, reloading boxes");
                    setTimeout(() => {
                        this.loadExistingBoxes();
                    }, 50);
                }
            }
        }
    }
}

export {ImageComp};