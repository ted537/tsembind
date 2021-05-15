const path = require('path')
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

WebAssembly.instantiate = wrapWebAssemblyInit(WebAssembly.instantiate)

// note that the Emscripten Module is NOT the WebAssembly Module.
// However, since they share some components, we can find a mapping
const registryForEmscriptenModule = module =>
	registries.get(module.asm)

const getDeclarations = module => {
	const registry = registryForEmscriptenModule(module);
	return declarationsForRegistry(module,registry)
}

const moduleFromRequire = async requireResult => {
	if (typeof requireResult === "function")
		return await requireResult();
	// TODO handle -s EXPORT_NAME
	else {
		await new Promise(res=>requireResult.onRuntimeInitialized=res)
		return requireResult
	}
}

const generateTypescriptBindings = async inputFilename => {
	const absoluteInputFilename = path.resolve(process.cwd(),inputFilename)
	const module = await moduleFromRequire(require(absoluteInputFilename))
	return getDeclarations(module)
}

module.exports = {generateTypescriptBindings}
