import { Annotated } from "../annotation";

export interface Property {
    name: string
    typename: string
}

export interface Parameter {
    name: string
    typename: string
}

export interface Function extends Annotated {
    name: string
    parameters: Parameter[]
    returnType: string
}

export interface Constructor {
    parameters: Parameter[]
}

export interface Class {
    name: string
    staticFunctions: Function[]
    memberFunctions: Function[]
    constructors: Constructor[]
    properties: Property[]
}

export interface Enum {
    name: string
    values: string[]
}

/** Registry with resolved types */
export interface Registry {
    moduleName: string
    functions: Function[]
    classes: Class[]
    numbers: string[]
    enums: Enum[]
}