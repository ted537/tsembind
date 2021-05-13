// transform registry into typescript declarations

// duplicate definitions from embind.js because
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
	const ptr = registry.types[typeId]
	const str = readLatin1String(module)(ptr);
	// FIXME kind of sketchy, 
	// should probably do this comparison somewhere else
	return str || "void"
}

// can't give names here unfortunately
const typeNamesToParameters = typenames =>
	typenames.map(
		(typename,idx) => `arg${idx}: ${typename}`
	)

const getFunctionDeclaration = (module,registry) => funcInfo => {
	const {name,argCount,rawArgTypesAddr} = funcInfo;
	// TODO
	const nameStr = readLatin1String(module)(name)
	const argTypes = heap32VectorToArray(module)(argCount, rawArgTypesAddr);
	const argTypeNames = argTypes.map(typeIdToTypeName(module,registry))
	const [returnType,...parameterTypes] = argTypeNames;
	const parameters = typeNamesToParameters(parameterTypes)
	return `declare function ${nameStr}(${parameters}): ${returnType};`
}

const getClassFunctionDeclaration = (module,registry) => funcInfo => {
	const {methodName,argCount,rawArgTypesAddr} = funcInfo;
	const humanName = readLatin1String(module)(methodName);
	const argTypes = heap32VectorToArray(module)(argCount, rawArgTypesAddr);
	const argTypeNames = argTypes.map(typeIdToTypeName(module,registry))
	const [returnType, instanceType, ...parameterTypes] = argTypeNames;
	const parameters = typeNamesToParameters(parameterTypes)

	return `\t${humanName}(${parameters}): ${returnType};`
}

const getClassDeclaration = (module,registry) => classInfo => {
	const {name,functions} = classInfo;
	const humanName = readLatin1String(module)(name)
	return [
		[`declare class ${humanName} {`],
		functions.map(getClassFunctionDeclaration(module,registry)),
		['}']
	].flat().join('\n')
}

const capitalize = text =>
	text[0].toUpperCase() + text.slice(1)

const CamelCase = words =>
	words.split(' ').map(capitalize).join('')

// TS is not responsible for enforcing number sizes (int8 vs int32 etc)
const declarationForNumber = (module,registry) => name => {
	const humanName = readLatin1String(module)(name)
	const camelCased = CamelCase(humanName)
	return `type ${camelCased} = Number`
}

const declarationsForRegistry = (module,registry) => {
	return [
		registry.numbers.map(declarationForNumber(module,registry)),
		registry.functions.
			map(getFunctionDeclaration(module,registry)),
		Object.values(registry.classes).
			map(getClassDeclaration(module,registry))
	].flat().join('\n')
}

module.exports = {declarationsForRegistry}
