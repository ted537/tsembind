import { WASMExports } from './wasm'

export interface EmscriptenModule {
	asm: WASMExports
	HEAPU8: Uint8Array
    HEAP32: Int32Array
}