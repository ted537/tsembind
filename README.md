# Typescript for Emsripten (TSEMBIND)

Generate `.d.ts` files using your existing Emscripten projects.
Re-compiling is not necessary!

Usage:
```
const {inject, getDeclarations} = require('tsembind')
async function main() {
	const module = await require('./your-embind-wasm-module.js')
	const declaratios = getDeclarations(module)
	// in practice, save them to a file probably
	console.log(declarations)
}
main()
```

## How it works

Embind registers functions,classes, etc. at runtime,
by calling JS functions like `__embind_register_function()` from WASM.
These functions can be replaced by replacing `WebAssembly.instantiate()` 
with a wrapper.
Similarly, `__embind_register_function()` can be wrapped
to compile the type information.
