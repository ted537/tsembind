import { EmscriptenModule, Pointer } from './emscripten'
import { Registry } from './injection/registry';

// duplicate definitions from actual embind.js because
// the original definitions arehidden behind closures
export const readLatin1String = 
		(module: EmscriptenModule) => 
		(ptr:Pointer) => {                                     
    let str = "";                                                               
    let c = ptr;                                                                
    while (module.HEAPU8[c]) {                                                  
        str += String.fromCharCode(module.HEAPU8[c]);                           
        ++c;                                                                    
    }                                                                           
    return str;                                                                 
}

export const heap32VectorToArray = 
		(module: EmscriptenModule) => 
		(count: number, firstElement: number) => 
{
	const array = [];                                                           
	for (let i = 0; i < count; i++) {                                         
	  array.push(module.HEAP32[(firstElement >> 2) + i]);                          
	}                                                                         
	return array;                                                             
} 

export const typeIdToTypeName = 
	(module: EmscriptenModule,registry: Registry) => 
	(typeId: Pointer) =>
{
	if (!(typeId in registry.types)) {
		console.warn(`typeId=${typeId} not found in registry`)
		return 'unknown'
	}

	return registry.types[typeId](module)
}
//
// can't give names here unfortunately
export const typeNamesToParameters = (typenames: string[]) =>
	typenames.map(
		(typename,idx) => `arg${idx}: ${typename}`
	).join(', ')

module.exports = {
	readLatin1String, heap32VectorToArray, 
	typeIdToTypeName, typeNamesToParameters
};
