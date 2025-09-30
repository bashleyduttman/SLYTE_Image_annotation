function cmpSet(lyte, obj, key, value, opts, fromStore){
    if(lyte && lyte.$utils && lyte.$utils.set){
        lyte.$utils.set(obj, key, value, opts, fromStore);
    }
    else{
        obj[key] = value;
    }
}

function emit(db, type, record, attr, err){
	record.$.emit(type, [record,attr,err]);
	record.$.schema.emit(type, [record, attr, err]);
	db.emit(type, [record.$.schema._name, record, attr, err]);
}

export { cmpSet, emit }; 