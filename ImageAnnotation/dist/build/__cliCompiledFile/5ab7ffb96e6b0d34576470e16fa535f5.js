import { _defineProperty } from "@slyte/core/src/lyte-utils";
import "../helpers/helpers-dev.js";
import './lyte-modal.js';
import { prop } from "../../../../@slyte/core/index.js";
import { Component } from "../component.js";
import $L from "../../../lyte-dom/modules/lyte-dom-utils.js";

window.addCloseEvent = function() {

	document.addEventListener('click',function(event){
		var ele = event.target;
		while(!$L(ele).hasClass('modalWrapper') && ele.tagName != "LYTE-DRAWER-BODY" && ele.tagName != "LYTE-DRAWER" && ele.tagName !="LYTE-DRAWER-FREEZE" && ele.tagName != "LYTE-MODAL-FREEZE" && ele.tagName != 'LYTE-DROP-BOX' && ele.tagName != 'HTML'){
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

class LyteDrawerComponent extends Component {
    constructor() {
        super();
    }

    data(arg1) {
		return Object.assign(super.data({
			/** 
			 * @componentProperty  {left | right} ltPropPosition=left
			 */
			ltPropPosition:prop("string",{"default":"left"}),
			/** 
			 * @componentProperty  {string} ltPropWidth=200px
			 */
			ltPropWidth:prop("string",{"default":"200px"}),
			/** 
			 * @componentProperty  {string} ltPropHeight=100%
			 */
			ltPropHeight:prop("string",{"default":"100%"}),
			/** 
			 * @componentProperty  {object} ltPropModal={}
			 */
			ltPropModal:prop("object",{"default":{}}),
			/** 
			 * @componentProperty  {boolean} ltPropFreeze=true
			 */
			ltPropFreeze:prop("boolean",{"default":true}),
			/** 
			 * @componentProperty  {string} ltPropAnimationDuration=0.3s
			 */
			ltPropAnimationDuration:prop("string",{"default":"0.3s"}),
			/** 
			 * @componentProperty  {boolean} ltPropMiniVariant=false
			 */
			ltPropMiniVariant:prop("boolean",{"default":false}),
			/** 
			 * @componentProperty  {string} ltPropUserValue=name
			 */
			ltPropUserValue: prop("string",{default:"name"}),
			/** 
			 * @componentProperty  {string} ltPropSystemValue=value
			 */
			ltPropSystemValue:prop("string",{default:"value"}),
			/** 
			 * @componentProperty {array} ltPropOptions
			 * @default []
			 */
			ltPropOptions:prop("array",{default:[]}),
			/** 
			 * @componentProperty  {boolean} ltPropShow=false
			 */
			ltPropShow:prop("boolean",{"default":false}),
			/** 
			 * @componentProperty  {string} ltPropSelectedClass
			 */
			ltPropSelectedClass:prop("string"),
			/** 
			 * @componentProperty  {string} ltPropSelected
			 */
			ltPropSelected:prop("string"),
			/** 
			 * @componentProperty  {boolean} ltPropCloseOnSelect=false
			 */
			ltPropCloseOnSelect:prop("boolean",{"default":false}),
			/** 
			 * @componentProperty  {boolean} ltPropOverlayClose=true
			 */
			ltPropOverlayClose : prop("boolean",{"default":true}),
			/** 
			 * @componentProperty  {boolean} ltPropShowOpenButton=true
			 */
			 ltPropShowOpenButton : prop("boolean",{"default":true}),
			/** 
			 * @componentProperty  {boolean} ltPropShowCloseButton=true
			 */
			 ltPropShowCloseButton : prop("boolean",{"default":true}),
			 /** 
			 * @componentProperty  {boolean} ltPropCloseOnEscape=true
			 */
			ltPropCloseOnEscape : prop("boolean",{"default":true}),
			/** 
			 * @componentProperty  {array} ltPropDisabledList
			 * @default []
			 */
			 ltPropDisabledList:prop("array",{"default":[]}),
			/** 
			 * @componentProperty  {string} ltPropWrapperClass
			 */
			ltPropWrapperClass:prop("string"),
			/** 
			 * @componentProperty  {inline | overlay |  inlineOverlay} ltPropLayout=overlay
			 */
			ltPropLayout: prop("string",{"default":"overlay"}),
			/** 
			 * @componentProperty  {string} ltPropExpandMiniVariant="click"
			 */
			ltPropExpandMiniVariant: prop("string",{
				"default": "click"
			}),
			/** 
			 * @componentProperty  {string} ltPropMiniVariantWidth=50px
			 */
			ltPropMiniVariantWidth : prop("string",{"default": "50px"}),
			/** 
			 * @componentProperty  {boolean} ltPropYield=false
			 */
			ltPropYield:prop("boolean",{default:false}),
			ltPropDataTabindex : prop("string",{"default" : ""}),

			returnedFalse : prop("boolean",{"default" : false}),
			currentPosition : prop("string"),
			config : prop("object",{
				"default" : {}
			}),
			isMouseEvent : prop("boolean",{"default":false}),
			modalAttr : prop("object",{"default": {}})
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
                var closestItem = $L(event.target).closest("lyte-drawer-item", this.$node)[0];
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
                var closestItem = $L(event.target).closest("lyte-drawer-item", this.$node)[0];
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

export { LyteDrawerComponent };

LyteDrawerComponent.register("lyte-drawer", {
    hash: "LyteDrawerComponent_4",
    refHash: "C_lyte-ui-component_@zoho/lyte-ui-component_2"
});
