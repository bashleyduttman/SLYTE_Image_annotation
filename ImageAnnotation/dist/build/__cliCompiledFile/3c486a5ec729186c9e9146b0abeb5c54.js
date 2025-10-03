//ignorei18n_start
import {ComponentRegistry,_LC} from "@slyte/component";
import { Service } from "@slyte/core/src/service";
import { Lyte } from "@slyte/core";
/*convert to custom class and register*/
class Shadow extends Service {
    constructor(registryInstance){
        super();
        this["shadowList"] = [];
        this["toAddEvents"] = [];
        this["val"] = 1;
        this["importStyle"] = {};
        this["importSrc"] = [];
        var shadow = this;
        _LC.appendChild = function(){
            let registryIns = this;
            var argumentsArr = Array.from(arguments);
            argumentsArr.$unshift(registryIns);
            return shadow.appendChild.apply(shadow,argumentsArr);
        }
        _LC.insertBefore = function(){
            let registryIns = this;
            var argumentsArr = Array.from(arguments);
            argumentsArr.$unshift(registryIns);
            return shadow.insertBefore.apply(shadow,argumentsArr);
        }
        _LC.insertAfter = function(){
            let registryIns = this;
            var argumentsArr = Array.from(arguments);
            argumentsArr.$unshift(registryIns);
            return shadow.insertAfter.apply(shadow,argumentsArr);
        }
        _LC.addEventListener = function(){
            return shadow.addEventListener.apply(shadow,arguments);
        }
        _LC.removeEventListener = function(){
            return shadow.removeEventListener.apply(shadow,arguments);
        }
        _LC.removeChild = function(){
            return shadow.removeChild.apply(shadow,arguments);
        }
        registryInstance.addEventListener = _LC.addEventListener;
        registryInstance.removeEventListener = _LC.removeEventListener;
        registryInstance.removeChild = _LC.removeChild;
        this.getHostElement = _LC.shadow.getHostElement;
        this.stringToStyle = _LC.shadow.stringToStyle;
        registryInstance.appendChild = _LC.appendChild;
        registryInstance.insertAfter = _LC.insertAfter;
        registryInstance.insertBefore = _LC.insertBefore
    }
    static register(){
        ComponentRegistry.addFakeDirective(this,"shadow");
    }
    addEventListener(obj){
        this.toAddEvents.$push(obj);
        var list = this.shadowList.length;
        for(let i=0;i<list;i++){
            this.shadowList[i].addEventListener(obj.eventName ,obj.listener ,obj.options);
        }
    }
    removeEventListener(obj){
        var index = this.toAddEvents.findIndex(item => item.eventName === obj.eventName && item.listener === obj.listener);
        if(index != -1){
            this.toAddEvents.$splice(index,1);
            var list = this.shadowList.length;
            for(let i=0;i<list;i++){
                this.shadowList[i].removeEventListener(obj.eventName,obj.listener,obj.options);
            }
        }
    }
    getShadowParent(shadowParent,directiveObj){
        while(shadowParent){
            let hostEleParent = this.getHostElement(shadowParent);
            if(shadowParent && hostEleParent && hostEleParent.tagName != "SHADOW-WRAPPER"){
                // var shadowDeep = hostEleParent.component.data.lyteShadowDeep;//af getShadowParent
                // let directiveObj = shadowParent.getDirectiveObj();
                var shadowDeep = _LC.directive.getTransitionArg(hostEleParent, "shadow-deep");
                break;
            }
            shadowParent = shadowParent.parentNode;
        }
        return {shadowParent : shadowParent, shadowDeep : shadowDeep};
    }
    appendChild(registryInstance , outlet, ele, obj) {
        let componentParent;
        if(obj && obj instanceof Object && obj.referenceNode){
            componentParent = obj.referenceNode;
        }else{
            componentParent = undefined;
        }
        _LC.ignoreDisconnect = Lyte.ignoreDisconnect = true;
        var shadowParent = componentParent ? componentParent.getRootNode(): ele?ele.getRootNode():undefined;
        var nonShadowParent = ele;
        let hostEleParent = this.getHostElement(shadowParent);
        if(shadowParent && hostEleParent){
            nonShadowParent = this.looping(nonShadowParent);
        }
        if(shadowParent && hostEleParent && outlet && hostEleParent != (outlet.lastElementChild ? this.getHostElement(outlet.lastElementChild.getRootNode()):this.getHostElement(outlet.getRootNode()))){
            var a = {"type":"appendChild", "shadowParent":hostEleParent ,"outlet":outlet ,"element":ele,"nonShadowParent":nonShadowParent}
            this.addElements(a,registryInstance);
        }
        else{
            outlet.appendChild(ele);
        }
        _LC.ignoreDisconnect = Lyte.ignoreDisconnect = false;
    }
    removeChild(outlet, component) {
        let rootNode = component.getRootNode();
        let hostEle = this.getHostElement(rootNode);
        if(hostEle){
            component.parentNode.removeChild(component);
        }
        else{
            outlet.removeChild(component);
        }
    }
    insertBefore(registryInstance, referenceNode, newNode, parentNode,obj) {
        let componentParent;
        if(obj){
            if(obj && obj instanceof Object && obj.referenceNode){
                componentParent = obj.referenceNode;
            }
            else{
                componentParent = obj;  
            }
        }else if(parentNode && parentNode instanceof Object && parentNode.referenceNode){
            componentParent = parentNode.referenceNode;
            parentNode = undefined;
        }
        else{
            componentParent = obj;
        }
        _LC.ignoreDisconnect = Lyte.ignoreDisconnect = true;
        if(!parentNode) {
            if(!referenceNode) {
                Lyte.error("LC010");
                _LC.ignoreDisconnect = Lyte.ignoreDisconnect = false;
                return;
            } else {
                parentNode = referenceNode.parentNode;
            }
        }
        var shadowParent = componentParent ? componentParent.getRootNode(): newNode.getRootNode();
        var nonShadowParent = newNode;
        let hostEleParent = this.getHostElement(shadowParent);
        if(shadowParent && hostEleParent){
            nonShadowParent = this.looping(nonShadowParent);
        }
        if(shadowParent && hostEleParent && referenceNode && hostEleParent != this.getHostElement(referenceNode.getRootNode())){
            // this.addElements("insertBefore",shadowParent,parentNode,newNode ,referenceNode ? referenceNode : null)
            var a ={
                "type":"insertBefore",
                "shadowParent":hostEleParent,
                "outlet":parentNode,
                "element":newNode,
                "refNode": referenceNode ? referenceNode : null,
                "nonShadowParent":nonShadowParent
            }
            this.addElements(a,registryInstance);
        }
        else{
            _LC.insertBeforeNative(parentNode , newNode, referenceNode ? referenceNode : null);
        }
        _LC.ignoreDisconnect = Lyte.ignoreDisconnect = false;
    }
    insertAfter() {
        //splice last arg
        //for now no thisref
        var argumentsArr = Array.from(arguments);
        var registryInstance = argumentsArr.$shift();
        var componentParent;
        var obj = argumentsArr[argumentsArr.length-1];
        if(obj instanceof Object && obj.referenceNode){
            componentParent = obj.referenceNode;
            argumentsArr.$splice(-1);
        }
        var referenceNode = argumentsArr.$shift();
        _LC.ignoreDisconnect = Lyte.ignoreDisconnect = true;

        var shadowParent = componentParent ? componentParent.getRootNode() : argumentsArr[0].getRootNode();
        var nonShadowParent = argumentsArr[0];
        let hostEleParent = this.getHostElement(shadowParent);
        if(shadowParent && hostEleParent){
            nonShadowParent = this.looping(nonShadowParent);
        }
        // var shadowParent = argumentsArr[0] ? argumentsArr[0].getRootNode(): undefined;
        if(shadowParent && hostEleParent && referenceNode && hostEleParent != this.getHostElement(referenceNode.getRootNode())){
            var a = {"type":"insertAfter","shadowParent":hostEleParent,"element":argumentsArr ,"refNode":referenceNode ? referenceNode : null,"nonShadowParent":nonShadowParent}
            this.addElements(a,registryInstance)
        }
        else{
            // insertBefore(parentNode , newNode, referenceNode ? referenceNode : null);
            referenceNode.after.apply(referenceNode, argumentsArr);
        }
        // referenceNode.after.apply(referenceNode, argumentsArr);
        _LC.ignoreDisconnect = Lyte.ignoreDisconnect = false;
    }
    attachStyleToParentShadow(comp,shadowParent,content){
        let tagName = comp.tagName
        if(comp._compClass._style && shadowParent._duplicateStyle.indexOf(tagName)==-1){
            shadowParent._duplicateStyle.$push(tagName);
            var styleString = comp._compClass._style;
            var style = this.stringToStyle(styleString);
            style.setAttribute("lyte-id","shadow-style-"+tagName);
            this.prependStyle(shadowParent, style);
            if(shadowParent._sw.length > 0){
                var self = this;
                shadowParent._sw.forEach(function(item,index){
                    if(item.shadowRoot._duplicateStyle.indexOf(tagName) == -1){
                        item.shadowRoot._duplicateStyle.$push(tagName);
                        var style = self.stringToStyle(styleString);
                        style.setAttribute("lyte-id","shadow-style-"+tagName);
                        self.prependStyle(item.shadowRoot, style);
                    }
                });
            }
        }
        if(shadowParent._compList.indexOf(tagName) == -1){ 
            shadowParent._compList.$push(tagName)
            let hostEleParent = this.getHostElement(shadowParent);
            this.updateLessDiv(hostEleParent._lessDiv,[tagName]);
        }
        var htmlStyle = content.querySelectorAll("style");
        var htmlLink = content.querySelectorAll("link");
        if(htmlStyle.length > 0 && shadowParent._sw.length > 0){
            shadowParent._sw.forEach(function(item,index){
                htmlStyle.forEach(function(sty,i){
                    item.shadowRoot.appendChild(sty.cloneNode(true))
                });
            });
        }
        if(htmlLink.length > 0 && shadowParent._sw.length > 0){
            shadowParent._sw.forEach(function(item,index){
                htmlLink.forEach(function(sty,i){
                    item.shadowRoot.appendChild(sty.cloneNode(true))
                });  
            });
        }
        var self = this;
        shadowParent._sw.forEach(function(item,index){
            if(item.shadowRoot._compList.indexOf(tagName) == -1){ 
                item.shadowRoot._compList.$push(tagName)
                self.updateLessDiv(item._lessDiv,[tagName]);
            }
        });  
    }
    applyShadow(node,content,shadowParent,dependentPromises){
        node.component.data.lyteShadow = true;
        this.newShadowComp(node,shadowParent);
        let directiveObj = node.getDirectiveObj();
        directiveObj && directiveObj.appendHooks('beforeAppend',node,true,true,dependentPromises);
        node.shadowRoot.appendChild(content);
        directiveObj && directiveObj.appendHooks('onAppend',node,true,true,dependentPromises);
        directiveObj && directiveObj.appendHooks('afterAppend',node,true,true,dependentPromises);
    }
    attachStyle(comp,shadow){
        let directiveObj = comp.getDirectiveObj();
        shadow._duplicateStyle = [];
        shadow._sw = [];
        if(comp._compClass._style){
            var style = this.stringToStyle(comp._compClass._style);
            style.setAttribute("lyte-id","shadow-style-" + comp.tagName);
            // style._id = shadow._id;
            if(shadow._duplicateStyle.indexOf(comp.tagName) == -1){
                shadow._duplicateStyle.$push(comp.tagName);
            }
            shadow.appendChild(style);
        }
        this.inlineStyle(comp,shadow,directiveObj);
    }
    attachEvents(thisRef){
        var bodyEvents = _LC.globalDOMEvents;
        for (var _i = 0; _i < bodyEvents.length; _i++) {
            var evnt = bodyEvents[_i];
            thisRef.addEventListener(evnt, _LC.globalEventHandler, true);
        }
        //lc.addedevents
        var toAddEvents = this.toAddEvents;
        var len = toAddEvents.length
        for(let i=0;i<len;i++){
            thisRef.addEventListener(toAddEvents[i].eventName ,toAddEvents[i].listener ,toAddEvents[i].options);
        }
        //lbind event
        thisRef.addEventListener("change", _LC.changeEventhandler);
    }
    updateYield(comp,node,toAppend,content1,parentScope){
        node.attachShadow({"mode":"open"});
        comp._shadowChild ? comp._shadowChild.$push(node) : comp._shadowChild = [node];
        node._shadowChild = [];
        node._shadowParent = comp;
        let directiveObj = comp.getDirectiveObj();
        if(parentScope){
            node.shadowRoot._compList = [parentScope.tagName]
        }else{
            node.shadowRoot._compList = [];
        }
        node.shadowRoot._sw = [];
        node.shadowRoot._duplicateStyle = [];
        // node.shadowRoot._id = this.generateId();
        this.shadowList.$push(node.shadowRoot);
        node.shadowRoot._lyteShadow = true;
        this.attachEvents(node.shadowRoot);
        if(content1){
            var stag = this.stringToStyle(toAppend._callee._compClass._style);
            if(toAppend._callee && toAppend._callee._compClass._style){
                stag.setAttribute("lyte-id","shadow-yield-style-"+toAppend._callee.tagName);
                node.shadowRoot.appendChild(stag);
                node.shadowRoot._duplicateStyle.$push(toAppend._callee.tagName);
            }
            this.inlineStyle(node,node.shadowRoot,directiveObj);
            this.createLessDiv(node.shadowRoot,node);
            node.shadowRoot.appendChild(content1);
        }
        else{
            this.inlineStyle(node,node.shadowRoot,directiveObj);
            this.createLessDiv(node.shadowRoot,node);
            node.shadowRoot.appendChild(toAppend.content.cloneNode(true, "lyte"));
        }
    }
    prependStyle(shadowParent ,style){
        var nodes = shadowParent.querySelectorAll("[lyte-id^='shadow-']");
        var last = nodes[nodes.length- 1];
        if(last){
            _LC.insertBeforeNative(shadowParent,style,last.nextSibling)
        }else{
            _LC.insertBeforeNative(shadowParent,style,shadowParent.childNodes[0])
        }
    }
    addElements(obj,registryInstance){//type ,shadowParent,outlet,ele,refNode
        var type = obj.type;
        var ele = obj.element;
        var outlet = obj.outlet;
        var shadowParent = obj.shadowParent;
        var refNode = obj.refNode;
        var nonShadowParent = obj.nonShadowParent;
        var success,finalshadow;
        var self = this;
        // var argumentsArr = argumentsArr;
        if(nonShadowParent){
            var parentInstance = nonShadowParent;
            // var id = nonShadowParent._id;
            var sw = nonShadowParent._sw;
            var tagName = nonShadowParent.tagName;
        }
        else{
            var parentInstance = shadowParent;
            if(shadowParent.tagName == "SHADOW-WRAPPER"){
                parentInstance = shadowParent.shadowRoot._swParent;
            }
            // var id = shadowParent.shadowRoot._id;
            var sw = shadowParent.shadowRoot._sw;
            var tagName = shadowParent.tagName;
        }
        switch(type){
            case "appendChild":
                var pos = outlet.lastElementChild;
                if(pos && pos.shadowRoot  && pos.tagName == "SHADOW-WRAPPER" && parentInstance == pos.shadowRoot._swParent){
                    outlet.lastElementChild.shadowRoot.appendChild(ele);
                    success = true;
                    finalshadow = outlet.lastElementChild.shadowRoot;
                }
                break;
            case "insertBefore":
                var pos = refNode.previousElementSibling;
                if(pos && pos.shadowRoot && pos.tagName == "SHADOW-WRAPPER" && parentInstance == pos.shadowRoot._swParent){
                    refNode.previousElementSibling.shadowRoot.appendChild(ele);
                    success = true;
                    finalshadow = refNode.previousElementSibling.shadowRoot;
                }
                break;
            case "insertAfter":
                var pos = refNode.nextElementSibling;
                if(pos && pos.shadowRoot  && pos.tagName == "SHADOW-WRAPPER" && parentInstance == pos.shadowRoot._swParent){
                    refNode.nextElementSibling.shadowRoot.lastElementChild.after.apply(refNode.nextElementSibling.shadowRoot.lastElementChild, ele);
                    success = true;
                    finalshadow = refNode.nextElementSibling.shadowRoot;
                }
                break;
        }
        if(!success){
            var wrapper = document.createElement("shadow-wrapper");
            // if(shadowParent.tagName == "LYTE_YIELD"){
            // }
            wrapper.attachShadow({"mode":"open"});//af
            this.shadowList.$push(wrapper.shadowRoot);
            wrapper.shadowRoot._shadowChild = [];
            wrapper.shadowRoot._lyteShadow = true;
            wrapper.shadowRoot._compList = [];
            // wrapper.shadowRoot._id = id;
            wrapper.shadowRoot._duplicateStyle = [];
            wrapper.shadowRoot._linkRef = [];
            if(Array.isArray(ele)){
                ele.forEach(function(item,index){
                    wrapper.shadowRoot.appendChild(item);
                });
            }else{
                wrapper.shadowRoot.append(ele);
            }
            this.attachEvents(wrapper.shadowRoot);
            if(shadowParent.tagName == "SHADOW-WRAPPER"){
                var shadowParentComp = shadowParent.shadowRoot._swParent;
                shadowParentComp.shadowRoot ? shadowParentComp.shadowRoot._sw.$push(wrapper) :shadowParentComp._sw.$push(wrapper);
                wrapper.setAttribute("lyte-id",shadowParentComp.tagName);
                wrapper.shadowRoot._swParent = shadowParentComp;
            }
            else{
                sw.$push(wrapper);
                wrapper.setAttribute("lyte-id",tagName);
                wrapper.shadowRoot._swParent = parentInstance;
            }
            if(type == "appendChild"){
                outlet.appendChild(wrapper);    
            }else if(type == "insertBefore"){
                _LC.insertBeforeNative(outlet ,wrapper, refNode); 
            }
            else{
                refNode.after.apply(refNode, [wrapper]);
            }
            finalshadow = wrapper.shadowRoot;
            shadowParent.shadowRoot._compList.forEach(function(compName){
                wrapper.shadowRoot._compList.$push(compName);
            })
            //lessdiv
            let hostEle = this.getHostElement(finalshadow);
            this.createLessDiv(finalshadow,hostEle,shadowParent,shadowParent.shadowRoot._compList)
            this.insertInLessDiv(shadowParent,hostEle._lessDiv)
            this.updateLessDiv(hostEle._lessDiv,shadowParent.shadowRoot._compList);
        }
        //attach style tag from .css
        var parentStyleList = shadowParent.shadowRoot._duplicateStyle;
        if(parentStyleList.length > 0){
            parentStyleList.forEach(function(item,index){
                // var compIns = _LC._registeredComponents[item.toLowerCase()];
                var compIns = registryInstance._registeredComponents[item.toLowerCase()];//af check which registry?
                if(finalshadow._duplicateStyle.indexOf(item) == -1 && compIns._style){
                    var sty = self.stringToStyle(compIns._style);
                    sty.setAttribute("lyte-id","shadow-style-"+item);//update less style
                    finalshadow._duplicateStyle.$push(item);
                    // sty._id = id;
                    self.prependStyle(finalshadow, sty);
                }
            })
        }
        //get custom style tag in hmtl file
        var customStyle = shadowParent.shadowRoot.querySelectorAll("style");
        customStyle.forEach(function(item,index){
            if(!item.getAttribute("lyte-id") && !item.getAttribute("lyte-id-imported") &&!item.getAttribute("placeHolder")){
                self.prependStyle(finalshadow, item.cloneNode(true));
            }
        });
        var customLink = shadowParent.shadowRoot.querySelectorAll("link");
        customLink.forEach(function(item,index){
            finalshadow.appendChild(item.cloneNode(true));
                // this.prependStyle(finalshadow, item.cloneNode(true));
        });
    }
    inlineStyle(node,shadow,directiveObj){
        // let directiveObj = node.getDirectiveObj();
        let stryleArg = _LC.directive.getTransitionArg(node, "shadow-style");
        if(stryleArg != undefined){
            var innerStyle = document.createElement("style");
            innerStyle.setAttribute("lyte-id","shadow-inner-style-" + node.tagName);
            innerStyle.innerHTML = stryleArg;
            shadow.appendChild(innerStyle);
        }
        // else if(node.hasAttribute("lyte-shadow-style")){
        //     var styleTag = document.createElement('style');
        //     styleTag.setAttribute("lyte-id","shadow-inner-style");
        //     var styleContent = node.getAttribute("lyte-shadow-style");
        //     styleTag.innerHTML = styleContent;
        //     node.shadowRoot.appendChild(styleTag);
        // }
    }
    generateId(){
        return "id"+(this.val++);
    }
    destroyRef(comp){
        if(comp.shadowRoot){
            //removing reference from shadowlists
            var index = this.shadowList.indexOf(comp.shadowRoot)
            index > -1 ? this.shadowList.$splice(index,1):null;
            //removing reference from shadow wrapper
            var shadowWrapper = comp.shadowRoot._sw;
            if(shadowWrapper && shadowWrapper.length > 0){
                for(var i=0;i<shadowWrapper.length;i++){
                    var index = this.shadowList.indexOf(shadowWrapper[i].shadowRoot)
                    index > -1 ? this.shadowList.$splice(index,1):null;
                    shadowWrapper[i].remove()
                }
                comp.shadowRoot._sw = undefined;
            }
            var ind = comp._shadowParent._shadowChild.indexOf(comp);
            ind != -1 ? comp._shadowParent._shadowChild.$splice(ind,1) : null;
            comp._shadowParent = undefined;
            comp._lessDiv = undefined;
        }
        else if(comp._hasShadowParent){
            var shadowWrapper = comp._sw;
            if(shadowWrapper && shadowWrapper.length > 0){
                for(var i=0;i<shadowWrapper.length;i++){
                    var index = this.shadowList.indexOf(shadowWrapper[i].shadowRoot)
                    index > -1 ? this.shadowList.$splice(index,1):null;
                    shadowWrapper[i].remove()
                }
                comp._sw = undefined;
            }
        }
    }
    createLessDiv(shadow,comp){
        var div = document.createElement("div");
        div.setAttribute("id","lessDiv");
        shadow.appendChild(div)
        comp._lessDiv = div;
        comp._lessDiv._impNames = [];
    }
    insertInLessDiv(shadowParent,lessDiv){
        var self = this;
        if(shadowParent && shadowParent._lessDiv._impNames){
            shadowParent._lessDiv._impNames.forEach(function(item){
                lessDiv._impNames.$push(item);
                var sty = document.createElement("style")
                sty.setAttribute("placeHolder",self.importStyle[item].src);
                sty.setAttribute("id",item);
                lessDiv.appendChild(sty);
            })
        }
    }
    updateLessDiv(lessDiv,compNames){
        var self = this;
        lessDiv._impNames.forEach(function(id){
            compNames.forEach(function(tagName){
                if(self.importStyle[id] && self.importStyle[id].status == "resolved" && self.importStyle[id].response[tagName]){
                    var a = document.createElement("style");
                    a.setAttribute("lyte-id-imported","shadow-style-"+tagName)
                    a.setAttribute("impSrc",id);
                    a.innerHTML = self.importStyle[id].response[tagName];
                    var ele = lessDiv.querySelector("[id="+id+"]");
                //   lessDiv.insertBefore(a,ele);
                    _LC.insertBeforeNative(lessDiv, a, ele);
                }
            })
        })
    }
    traversing(shadowParent,comp,lessObj,src,id){
        if(shadowParent && shadowParent.shadowRoot){
            var callee = shadowParent; 
            this.recursion([callee],comp,lessObj,src,shadowParent,id);
        }else{
            // var callee = LyteClass.$.shadowDiv;
            this.recursion(Lyte.$.shadowDiv._shadowChild, comp, lessObj, src, shadowParent, id);
        }
        //callback
        if(comp._methods.onSuccess){
            comp.executeMethod("onSuccess")
        }
    }
    recursion(shadowChild,comp,lessObj,src,shadowParent,id){
        var self = this;
        shadowChild.forEach(function(item,index){
            item.shadowRoot._compList.forEach(function(compName){
                if(lessObj[compName]){
                    var style = document.createElement("style");
                    style.innerHTML = lessObj[compName];
                    style.setAttribute("lyte-id-imported","shadow-style-"+compName)
                    style.setAttribute("impSrc",id)
                    var ele = item._lessDiv.querySelector("[id="+id+"]")
                //   item._lessDiv.insertBefore(style,ele);
                    _LC.insertBeforeNative(item._lessDiv, style, ele);
                }
            }.bind(item))
            if(item.shadowRoot._sw && item.shadowRoot._sw.length > 0){
                self.recursion(item.shadowRoot._sw,comp,lessObj,src,shadowParent,id)
            }
            if(item._shadowChild && item._shadowChild.length > 0){
                self.recursion(item._shadowChild,comp,lessObj,src,shadowParent,id)
            } 
        }.bind(comp))
    }
    newShadowComp(comp,shadowParent){
        // let found;
        // if(comp._specialAttributeDetails){
        //     comp._specialAttributeDetails.forEach(function(attr){
        //         if(attr.hookName == "shadow-deep"){
        //             found = attr
        //         }
        //     })
        // }
        // debugger
        // let deepVal = found.val;
        let directiveObj = comp.getDirectiveObj();
        let pNode = this.getHostElement(shadowParent);
        if(shadowParent && _LC.directive.getTransitionArg(comp,"shadow-deep") == undefined && directiveObj.getTransitionAttr(pNode,"shadow-deep") ){
            if(!comp._specialAttributeDetails){
                comp._specialAttributeDetails = [];
            }
            comp._specialAttributeDetails.push(directiveObj.getTransitionAttr(pNode,"shadow-deep") )
            // comp.component.data.lyteShadowDeep = this.getHostElement(shadowParent).component.data.lyteShadowDeep;
        }
        var shadow = comp.attachShadow({mode: 'open'});
        // shadow._id = this.generateId();
        shadow._lyteShadow = true;
        shadow._compList = [comp.tagName];
        let hostEle = this.getHostElement(shadow);
        let hostEleParent = this.getHostElement(shadowParent);
        hostEle._shadowChild ? null : hostEle._shadowChild= [];
        if(shadowParent){
            hostEle._shadowParent = hostEleParent;
            hostEleParent._shadowChild.$push(hostEle)
        }else{
            Lyte.$.shadowDiv._shadowChild.$push(hostEle)
            hostEle._shadowParent = Lyte.$.shadowDiv;
        }
        this.attachStyle(comp,shadow);
        this.attachEvents(comp.shadowRoot);
        this.shadowList.$push(shadow);
        if(!shadowParent){
            this.createLessDiv(shadow,comp,hostEle._shadowParent);
            this.insertInLessDiv(hostEle._shadowParent,comp._lessDiv)
            this.updateLessDiv(comp._lessDiv,[comp.tagName]);
        }else{
            this.createLessDiv(shadow,comp,hostEleParent);
            this.insertInLessDiv(hostEleParent,comp._lessDiv);
            this.updateLessDiv(comp._lessDiv,[comp.tagName]);
        }
    }
    looping(parent){
        while(parent){
            if(parent.component && parent.tagName != "LYTE-YIELD"){
                return parent;
            }
            parent = parent.parentNode;
        }
    }
    placeHolderTraversing(shadowParent,src,id){
        shadowParent.forEach(function(shadow){
            shadow._lessDiv._impNames.$push(id);
            var s = document.createElement("style");
            s.setAttribute("placeHolder",src);
            s.setAttribute("id",id);
            shadow._lessDiv.appendChild(s);
            if(shadow._shadowChild && shadow._shadowChild.length > 0){
                this.placeHolderTraversing(shadow._shadowChild,src,id);
            }
        }); 
    }
}
Shadow.__lMod = "Shadow";
Shadow.register();
export default Shadow;
//ignorei18n_end