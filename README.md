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

## Limitations

Embind only knows the order and type of parameters at runtime. As such, declarations will refer to parameters as `arg0`, `arg1`, etc

## Compatibility

Known to work with the following EMSDK config.

```
releases-upstream-c2ac7520fad29a7937ed60ab6a95b08eb374c7ba-64bit
node-14.15.5-64bit
```

## Development

Install EMSDK, make sure everything is on the path, and then run `npm build`

To debug, run `npm link` followed by `tsembind lib/examplelib.js`

To run the automatic tests, run `npm test`
