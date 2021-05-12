#!/usr/bin/env node

const {injectBindings} = require('./inject.js')
const {declarationsForRegistry} = require('./declarations.js')

const registries = new Map();

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
	return declarationsForRegistry(module,registry)
}

module.exports = {inject, getDeclarations}

const generateBindings = () => {
	console.log("generating bindings...")
}
if (require.main === module) {
	generateBindings()
}
