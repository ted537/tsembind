# Typescript for Emsripten (TSEMBIND)

Generate `.d.ts` files using your existing Emscripten projects.
Re-compiling is not necessary!

Installation:
```
npm i -g git+https://github.com/ted537/tsembind.git
```

Usage:
```
tsembind my-embind-lib.js
```

## How it works

Embind registers functions,classes, etc. at runtime,
by calling JS functions like `__embind_register_function()` from WASM.
These functions can be replaced by replacing `WebAssembly.instantiate()` 
with a wrapper.
Similarly, `__embind_register_function()` can be wrapped
to compile the type information.

## Development

First, Install EMSDK. Then, run the standard cmake commands in this repo.

```
mkdir build
cd build
emcmake cmake ..
emmake make
```

To test, run `npm link` followed by `tsembind lib/examplelib.js`
