import { EmscriptenModule } from "../emscripten";

export interface FuncInfo {
    name: number
    argCount: number
    rawArgTypesAddr: number
}

export interface ClassPropertyInfo {
     fieldName: number, 
     getterReturnType: number
}

export interface ClassFunctionInfo {
    methodName: number;
    argCount: number;
    rawArgTypesAddr: number;
}

export interface ClassConstructorInfo {
    argCount: number;
    rawArgTypesAddr: number;
}

export interface ClassClassFunctionInfo {
    methodName: number;
    argCount: number;
    rawArgTypesAddr: number;
}

export interface ClassInfo {
    name: number;
    baseClassRawType: number;

    properties: ClassPropertyInfo[]
    functions: ClassFunctionInfo[]
    classFunctions: ClassClassFunctionInfo[]
    constructors: ClassConstructorInfo[]
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
export interface InjectionRegistry {
    types: Record<number,StringGetter>
    functions: FuncInfo[]
    classes: Record<number,ClassInfo>
    numbers: StringGetter[]
    enums: Record<number,EnumInfo>
}