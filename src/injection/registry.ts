import { EmscriptenModule } from "../emscripten";

export interface FreeFunction {
    name: number
    argCount: number
    rawArgTypesAddr: number
}

export interface MemberProperty {
     fieldName: number, 
     getterReturnType: number
}

export interface MemberFunction {
    methodName: number;
    argCount: number;
    rawArgTypesAddr: number;
}

export interface Constructor {
    argCount: number;
    rawArgTypesAddr: number;
}

export interface StaticFunction {
    methodName: number;
    argCount: number;
    rawArgTypesAddr: number;
}

export interface Class {
    name: number;
    baseClassRawType: number;

    properties: MemberProperty[]
    functions: MemberFunction[]
    classFunctions: StaticFunction[]
    constructors: Constructor[]
}

export interface EnumInfo {
    getName: StringGetter
    values: EnumValueInfo[]
}

export interface EnumValueInfo {
    name: number
    enumValue: number
}

export type StringGetter = (module: EmscriptenModule) => string
export interface Registry {
    types: Record<number,StringGetter>
    functions: FreeFunction[]
    classes: Record<number,Class>
    numbers: StringGetter[]
    enums: Record<number,EnumInfo>
}