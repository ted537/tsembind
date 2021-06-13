import { WASMExports } from './wasm'
import { Nominal } from "./nominal"

export interface EmscriptenModule {
	asm: WASMExports
	HEAPU8: Uint8Array
    HEAP32: Int32Array
}

export type Pointer = number