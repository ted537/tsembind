import path from 'path'
import {injectBindings} from './inject'
import {declarationsForRegistry} from './declarations'

import {WASMExports} from './wasm'
import {EmscriptenModule} from './emscripten'
import { InjectionRegistry } from './injection/registry'
import { emptyHintFunction, HintFunction } from './hint'

const registries = new Map<WASMExports, InjectionRegistry>();

const wrapWebAssemblyInit = 
		(init:CallableFunction) => 
		async (binary: WASMExports, info: WebAssembly.ModuleImports) => 
{
	const {registry,injectedInfo} = injectBindings(info)
	const result = await init(binary,injectedInfo)
	const {module,instance} = result;
	registries.set(instance.exports,registry)
	return result;
}

// TODO fix typing with something less hacky
(WebAssembly.instantiate as any) = wrapWebAssemblyInit(WebAssembly.instantiate)

// note that the Emscripten Module is NOT the WebAssembly Module.
// However, since they share some components, we can find a mapping
const registryForEmscriptenModule = (module: EmscriptenModule) =>
	registries.get(module.asm)

const getDeclarations = (module: EmscriptenModule,hint: HintFunction) => {
	const registry = registryForEmscriptenModule(module);
	if (!registry)
		throw new Error("Cannot find module")
	return declarationsForRegistry(module,registry,hint)
}

interface GlobalEmscriptenModule { onRuntimeInitialized: any}
async function moduleFromRequire(requireResult: CallableFunction | GlobalEmscriptenModule) {
	if (typeof requireResult === "function")
		return await requireResult();
	else {
		await new Promise(res=>requireResult.onRuntimeInitialized=res)
		return requireResult
	}
}

export async function generateTypescriptBindings(
		inputFilename: string,hint?: HintFunction
) {
	const absoluteInputFilename = path.resolve(process.cwd(),inputFilename)
	const module = await moduleFromRequire(require(absoluteInputFilename))
	return getDeclarations(module,hint || emptyHintFunction)
}