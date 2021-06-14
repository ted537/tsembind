export interface Property {
    name: string
    typename: string
}

export interface Parameter {
    name: string
    typename: string
}

export interface Function {
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
    functions: Function[]
    classes: Class[]
    numbers: string[]
    enums: Enum[]
}