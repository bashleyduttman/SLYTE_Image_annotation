import { _LC } from "@slyte/component";
_LC.freeze = {};
_LC.object.freezeData = function(data, prop){
    if(prop.freeze && data && typeof data == "object" && !Object.isFrozen(data)){
        Object.freeze(data);
    }
}
_LC.freeze.prop = function(comp, propName){
    if(comp){
        if(comp.localName == "lyte-yield"){
            comp = _LC.getCallee(comp);
        }
        if(comp && comp.component && comp.component.__data[propName] && comp.component.__data[propName].freeze){
            return true;
        }
    } 
}
_LC.freeze.component = function(compClass,data, obj){
    let compOptions = _LC.map.component.get(compClass);
    if(compOptions && compOptions.freeze){
        // _LC.object.freezeData(data, obj);
        return true;
    }
}
let freeze = _LC.freeze;
export default freeze