const registries = new Map();

const wrapRegisterFunction = (registry,f) => function(...args) {
	console.log("registering function")
	registry.functions.push({
		returnType:args[0],
		parameterTypes: args.slice(1)
	})
	return f(...args)
}

const wrapRegisterClass = (registry,f) => (...args) => {
	console.log("registering class")
	return f(...args)
}

const injectBindings = info => {
	const registry = {functions:[], classes:[]}
	const {
		_embind_register_function,
		_embind_register_class
	} = info.env;
	const injectedEnv = {...info.env,
		_embind_register_function: 
			wrapRegisterFunction(registry,_embind_register_function),
		_embind_register_class:
			wrapRegisterClass(registry,_embind_register_class)
	}
	const injectedInfo = {...info,env:injectedEnv}
	return {registry, injectedInfo}
}

const wrapWebAssemblyInit = originalFunction => async (binary,info) => {
	const {registry,injectedInfo} = injectBindings(info)
	const result = await originalFunction(binary,injectedInfo)
	const {module,instance} = result;
	registries.set(instance.exports,registry)
	return result;
}

const inject = () =>
	WebAssembly.instantiate = wrapWebAssemblyInit(WebAssembly.instantiate)

const getDeclarations = module =>
	registries.get(module.asm)

module.exports = {inject, getDeclarations}
