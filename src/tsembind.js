const wrapRegisterFunction = f => (...args) => {
	console.log("registering function")
	return f(...args)
}

const wrapRegisterClass = f => (...args) => {
	console.log("registering class")
	return f(...args)
}

const injectBindings = env =>
	({...env,
		_embind_register_function: 
			wrapRegisterFunction(env._embind_register_function),
		_embind_register_class:
			wrapRegisterClass(env._embind_register_class)
	})

const wrapWebAssemblyInit = originalFunction => (binary,info) =>
	originalFunction(binary,{...info,env:injectBindings(info.env)})

WebAssembly.instantiate = wrapWebAssemblyInit(WebAssembly.instantiate)
