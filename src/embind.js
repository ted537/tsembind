// duplicate definitions from actual embind.js because
// the original definitions arehidden behind closures
const readLatin1String = module => ptr => {                                     
    let str = "";                                                               
    let c = ptr;                                                                
    while (module.HEAPU8[c]) {                                                  
        str += String.fromCharCode(module.HEAPU8[c]);                           
        ++c;                                                                    
    }                                                                           
    return str;                                                                 
}

const heap32VectorToArray = module => (count, firstElement) => {
	const array = [];                                                           
	for (let i = 0; i < count; i++) {                                         
	  array.push(module.HEAP32[(firstElement >> 2) + i]);                          
	}                                                                         
	return array;                                                             
} 

const typeIdToTypeName = (module,registry) => typeId => {
	if (!(typeId in registry.types)) {
		console.warn(`typeId=${typeId} not found in registry`)
		return 'unknown'
	}

	return registry.types[typeId](module)
}
//
// can't give names here unfortunately
const typeNamesToParameters = typenames =>
	typenames.map(
		(typename,idx) => `arg${idx}: ${typename}`
	).join(', ')

module.exports = {
	readLatin1String, heap32VectorToArray, 
	typeIdToTypeName, typeNamesToParameters
};
