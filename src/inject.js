const {readLatin1String, heap32VectorToArray} = require('./embind.js')
const {CamelCase} = require('./str.js')

const readName = name => module => 
	readLatin1String(module)(name)
const readNameCamelCased = name => module =>
	CamelCase(readLatin1String(module)(name))

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

	for (const type of types) registry.types[type] = readName(name)
	registry.classes[rawType] = {name,functions:[],constructors:[]}
	return f(...args)
}

const wrapRegisterClassFunction = (registry,f) => (...args) => {
	const [rawClassType,methodName,argCount,rawArgTypesAddr] = args;
	registry.classes[rawClassType].functions.push(
		{methodName,argCount,rawArgTypesAddr}
	)
	return f(...args)
}

const wrapRegisterClassConstructor = (registry,f) => (...args) => {
	const [
		rawClassType,argCount,rawArgTypesAddr,
		invokerSignature, invoker, rawConstructor
	] = args;
	registry.classes[rawClassType].constructors.push({argCount,rawArgTypesAddr})
	return f(...args)
}

const wrapRegisterInt = (registry,f) => (...args) => {
	const [primitiveType, name, size, minRange, maxRange] = args;
	const getName = readNameCamelCased(name)
	registry.types[primitiveType] = getName
	registry.numbers.push(getName)
	return f(...args)
}

const wrapRegisterFloat = (registry,f) => (...args) => {
	const [rawType, name, size] = args;
	const getName = () => "Float"
	registry.types[rawType] = getName
	registry.numbers.push(getName)
	return f(...args)
}

const wrapRegisterVoid = (registry,f) => (...args) => {
	const [rawType, name] = args;
	registry.types[rawType] = () => "void"
	return f(...args);
}

const wrapRegisterEnum = (registry,f) => (...args) => {
	const [rawType,name,size,isSigned] = args;
	registry.types[rawType] = readName(name)
	registry.enums[rawType] = {getName:readName(name),values:[]}
	return f(...args)
}

const wrapRegisterEnumValue = (registry,f) => (...args) => {
	const [rawEnumType,name,enumValue] = args;
	registry.enums[rawEnumType].values.push({name,enumValue})
	return f(...args)
}

const injectBindings = info => {
	const registry = {
		functions: [], numbers: [],
		classes: {}, types: {}, enums: {}
	}
	const {
		_embind_register_function,
		_embind_register_class,
		_embind_register_class_function,
		_embind_register_class_constructor,
		_embind_register_integer,
		_embind_register_float,
		_embind_register_void,
		_embind_register_enum,
		_embind_register_enum_value
	} = info.env;
	const injectedEnv = {...info.env,
		_embind_register_function: 
			wrapRegisterFunction(registry,_embind_register_function),
		_embind_register_enum:
			wrapRegisterEnum(registry,_embind_register_enum),
		_embind_register_enum_value:
			wrapRegisterEnumValue(registry,_embind_register_enum_value),
		_embind_register_class:
			wrapRegisterClass(registry,_embind_register_class),
		_embind_register_integer:
			wrapRegisterInt(registry,_embind_register_integer),
		_embind_register_float:
			wrapRegisterFloat(registry,_embind_register_float),
		_embind_register_class_function:
			wrapRegisterClassFunction(registry,_embind_register_class_function),
		_embind_register_class_constructor:
			wrapRegisterClassConstructor(registry,_embind_register_class_constructor),
		_embind_register_void:
			wrapRegisterVoid(registry,_embind_register_void)
	}
	const injectedInfo = {...info,env:injectedEnv}
	return {registry, injectedInfo}
}

module.exports = {injectBindings}
