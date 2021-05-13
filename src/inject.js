// inject required typing info during register_function() and similar
const wrapRegisterFunction = (registry,f) => (...args) => {
	const [name,argCount, rawArgTypesAddr, signature, rawInvoker,fn] = args;
	registry.functions.push({name,argCount,rawArgTypesAddr})
	return f(...args)
}

const wrapRegisterClass = (registry,f) => (...args) => {
	const [
		rawType,rawPointerType,rawConstPointerType, 
		baseClassRawType, 
		getActualTypeSignature, getActualType,
		upcastSignature, upcast,
		downcastSignature, downcast,
		name, destructorSignature, rawDestructor
	] = args;
	const types = [
		rawType, rawPointerType, rawConstPointerType,
		baseClassRawType
	];
	for (const type of types) registry.types[type] = name;
	registry.classes[rawType] = {name,functions:[]}
	return f(...args)
}

const wrapRegisterClassFunction = (registry,f) => (...args) => {
	const [rawClassType,methodName,argCount,rawArgTypesAddr] = args;
	registry.classes[rawClassType].functions.push(
		{methodName,argCount,rawArgTypesAddr})
	return f(...args)
}

const wrapRegisterInt = (registry,f) => (...args) => {
	const [primitiveType, name, size, minRange, maxRange] = args;
	registry.types[primitiveType] = name
	return f(...args)
}

const injectBindings = info => {
	const registry = {
		functions:[], classes:{},
		types: {}
	}
	const {
		_embind_register_function,
		_embind_register_class,
		_embind_register_class_function,
		_embind_register_integer
	} = info.env;
	const injectedEnv = {...info.env,
		_embind_register_function: 
			wrapRegisterFunction(registry,_embind_register_function),
		_embind_register_class:
			wrapRegisterClass(registry,_embind_register_class),
		_embind_register_integer:
			wrapRegisterInt(registry,_embind_register_integer),
		_embind_register_class_function:
			wrapRegisterClassFunction(registry,_embind_register_class_function)
	}
	const injectedInfo = {...info,env:injectedEnv}
	return {registry, injectedInfo}
}

module.exports = {injectBindings}
