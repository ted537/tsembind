export interface Parameter {
    name: string
    typename: string
}

export interface FuncInfo {
    name: string
    parameters: Parameter[]
}

export interface ClassInfo {

}

export interface EnumInfo {

}

/** Registry with resolved types */
export interface DeclarationRegistry {
    types: Record<string,FuncInfo>
    functions: FuncInfo[]
    classes: Record<string,ClassInfo>
    numbers: string[]
    enums: Record<string,EnumInfo>
}