export interface Parameter {
    name: string
    typename: string
}

export interface Function {
    name: string
    parameters: Parameter[]
    returnType: string
}

export interface Class {

}

export interface Enum {
    name: string
}

/** Registry with resolved types */
export interface Registry {
    functions: Function[]
    classes: Class[]
    numbers: string[]
    enums: Enum[]
}