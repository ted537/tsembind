import { EmscriptenModule, Pointer } from "../emscripten";

export interface FreeFunction {
    name: number
    argCount: number
    rawArgTypesAddr: Pointer
}

export interface Property {
     fieldName: Pointer, 
     getterReturnType: Pointer
}

export interface MemberFunction {
    methodName: Pointer;
    argCount: number;
    rawArgTypesAddr: Pointer;
}

export interface Constructor {
    argCount: number;
    rawArgTypesAddr: Pointer;
}

export interface StaticFunction {
    methodName: Pointer;
    argCount: number;
    rawArgTypesAddr: Pointer;
}

export interface Class {
    name: Pointer;
    baseClassRawType: Pointer;

    properties: Property[]
    functions: MemberFunction[]
    classFunctions: StaticFunction[]
    constructors: Constructor[]
}

export interface EnumInfo {
    getName: StringGetter
    values: EnumValueInfo[]
}

export interface EnumValueInfo {
    name: Pointer
    enumValue: number
}

export type StringGetter = (module: EmscriptenModule) => string
export interface Registry {
    types: Record<Pointer,StringGetter>
    functions: FreeFunction[]
    classes: Record<number,Class>
    numbers: StringGetter[]
    enums: Record<number,EnumInfo>
}