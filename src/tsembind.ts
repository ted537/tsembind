import path from 'path'
import {injectBindings} from './injection/inject'

import {WASMExports} from './wasm'
import {EmscriptenModule} from './emscripten'
import { Registry } from './injection/registry'
import { emptyHintFunction, HintFunction } from './hint'
import { convertInjectionRegistryToDeclarationRegistry } from './declaration'
import { declarationsForRegistry } from './declaration/generate'

const registries = new Map<WASMExports, Registry>();

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
	const injectionRegistry = registryForEmscriptenModule(module);
	if (!injectionRegistry)
		throw new Error("Cannot find module")
	const declarationRegistry = 
		convertInjectionRegistryToDeclarationRegistry(injectionRegistry, module)
	
	return declarationsForRegistry(declarationRegistry)
}

interface GlobalEmscriptenModule { onRuntimeInitialized: any}
async function moduleFromRequire(
		requireResult: CallableFunction | GlobalEmscriptenModule
) {
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