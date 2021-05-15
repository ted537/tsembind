const {readLatin1String, heap32VectorToArray} = require('./embind.js')
const {CamelCase} = require('./str.js')

const readName = name => module => 
	readLatin1String(module)(name)
const readNameCamelCased = name => module =>
	CamelCase(readLatin1String(module)(name))

const wrappers = {};

// inject required typing info during register_function() and similar
wrappers['_embind_register_function'] = (registry,f) => (...args) => {
	const [name,argCount, rawArgTypesAddr, signature, rawInvoker,fn] = args;
	registry.functions.push({name,argCount,rawArgTypesAddr})
	return f(...args)
}

wrappers['_embind_register_class'] = (registry,f) => (...args) => {
	const [
		rawType,rawPointerType,rawConstPointerType, 
		baseClassRawType, 
		getActualTypeSignature, getActualType,
		upcastSignature, upcast,
		downcastSignature, downcast,
		name, destructorSignature, rawDestructor
	] = args;
	const types = [rawType, rawPointerType, rawConstPointerType]
	for (const type of types) registry.types[type] = readName(name)

	registry.classes[rawType] = {
		name, baseClassRawType,
		functions:[],constructors:[],classFunctions:[],properties:[]
	}
	return f(...args)
}

wrappers['_embind_register_smart_ptr'] = (registry,f) => (...args) => {
	const [
		rawType,rawPointeeType,
		name,sharingPolicy,
		getPointeeSignature,rawGetPointee,
		constructorSignature,rawConstructor,
		shareSignature,rawShare,
		destructorSignature,rawDestructor
	] = args;

	const types = [rawType,rawPointeeType];
	for (const type of types) registry.types[type] = readName(name)

	return f(...args);
}

wrappers['_embind_register_class_function'] = (registry,f) => (...args) => {
	const [rawClassType,methodName,argCount,rawArgTypesAddr] = args;
	registry.classes[rawClassType].functions.push(
		{methodName,argCount,rawArgTypesAddr}
	)
	return f(...args)
}

wrappers['_embind_register_class_property'] = (registry,f) => (...args) => {
	const [
		classType,fieldName,
		getterReturnType,getterSignature,getter,getterContext,
		setterArgumentType,setterSignature,setter,setterContext
	] = args;
	registry.classes[classType].properties.push({fieldName,getterReturnType})
	return f(...args)
}

wrappers['_embind_register_class_class_function'] = 
		(registry,f) => (...args) => 
{
	const [
		rawClassType,methodName,argCount,rawArgTypesAddr,
		invokerSignature, rawInvoker, fn
	] = args;
	registry.classes[rawClassType].classFunctions.push(
		{methodName, argCount, rawArgTypesAddr}
	)
	return f(...args)
}

wrappers['_embind_register_class_constructor'] = (registry,f) => (...args) => {
	const [
		rawClassType,argCount,rawArgTypesAddr,
		invokerSignature, invoker, rawConstructor
	] = args;
	registry.classes[rawClassType].constructors.push({argCount,rawArgTypesAddr})
	return f(...args)
}

wrappers['_embind_register_integer'] = (registry,f) => (...args) => {
	const [primitiveType, name, size, minRange, maxRange] = args;
	const getName = readNameCamelCased(name)
	registry.types[primitiveType] = getName
	registry.numbers.push(getName)
	return f(...args)
}

wrappers['_embind_register_float'] = (registry,f) => (...args) => {
	const [rawType, name, size] = args;
	const getName = readNameCamelCased(name)
	registry.types[rawType] = getName
	registry.numbers.push(getName)
	return f(...args)
}

wrappers['_embind_register_std_string'] = (registry,f) => (...args) => {
	const [rawType,name] = args;
	registry.types[rawType] = () => "string"
	return f(...args)
}

wrappers['_embind_register_void'] = (registry,f) => (...args) => {
	const [rawType, name] = args;
	registry.types[rawType] = () => "void"
	return f(...args);
}

wrappers['_embind_register_emval'] = (registry,f) => (...args) => {
	const [rawType, name] = args;
	registry.types[rawType] = () => "any"
	return f(...args);
}

wrappers['_embind_register_memory_view'] = (registry,f) => (...args) => {
	const [rawType, dataTypeIndex, name] = args;
	const typeMapping = [
        Int8Array,
        Uint8Array,
        Int16Array,
        Uint16Array,
        Int32Array,
        Uint32Array,
        Float32Array,
        Float64Array,
    ];
	const type = typeMapping[dataTypeIndex];
	registry.types[rawType] = () => type.name;
	return f(...args)
}

wrappers['_embind_register_bool'] = (registry,f) => (...args) => {
	const [rawType,name,size,trueValue,falseValue] = args;
	registry.types[rawType] = () => "boolean"
	return f(...args)
}

wrappers['_embind_register_enum'] = (registry,f) => (...args) => {
	const [rawType,name,size,isSigned] = args;
	registry.types[rawType] = readName(name)
	registry.enums[rawType] = {getName:readName(name),values:[]}
	return f(...args)
}

wrappers['_embind_register_enum_value'] = (registry,f) => (...args) => {
	const [rawEnumType,name,enumValue] = args;
	registry.enums[rawEnumType].values.push({name,enumValue})
	return f(...args)
}

// add aliases for __embind_register_function() and the like
for (name in wrappers) wrappers[`_${name}`] = wrappers[name]

const originalName = func => {
	const source = func.toString()
	if (!source.startsWith("function ")) return null;
	return source.slice("function ".length,source.indexOf("("))
}

const injectBindings = info => {
	const registry = {
		functions: [], numbers: [],
		classes: {}, types: {}, enums: {}
	}

	const injectObject = ([name,obj]) => {
		if (typeof obj=== "object") {
			return [
				name,
				Object.fromEntries(
					Object.entries(obj).map(injectObject)
				)
			]
		}
		const wrapper = wrappers[name] || wrappers[originalName(obj)]
		if (wrapper) return [name,wrapper(registry,obj)]

		return [name,obj]
	}
	const injectedInfo = Object.fromEntries(
		Object.entries(info).map(injectObject)
	)
	return {registry, injectedInfo}
}

module.exports = {injectBindings}
