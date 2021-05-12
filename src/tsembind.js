const registries = new Map();

const wrapRegisterFunction = (registry,f) => function(...args) {
	registry.functions.push({
		returnType:args[0],
		parameterTypes: args.slice(1)
	})
	return f(...args)
}

const wrapRegisterClass = (registry,f) => (...args) => {
	console.log("registering class")
	console.log(...args)
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

const wrapWebAssemblyInit = init => async (binary,info) => {
	const {registry,injectedInfo} = injectBindings(info)
	const result = await init(binary,injectedInfo)
	const {module,instance} = result;
	registries.set(instance.exports,registry)
	return result;
}

const inject = () =>
	WebAssembly.instantiate = wrapWebAssemblyInit(WebAssembly.instantiate)

// note that the Emscripten Module is NOT the WebAssembly Module.
// However, since they share some components, we can find a mapping
const registryForEmscriptenModule = module =>
	registries.get(module.asm)

const getDeclarations = module => {
	const registry = registryForEmscriptenModule(module);
	return registry;
}

module.exports = {inject, getDeclarations}
