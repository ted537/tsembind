import { heap32VectorToArray, readLatin1String } from '../embind'
import { EmscriptenModule, Pointer } from '../emscripten'
import * as Injection from '../injection/registry'

export interface Parameter {
    name: string
    typename: string
}

export interface Function {
    name: string
    parameters: Parameter[]
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

function resolveTypenames(
        types: Record<number, Injection.StringGetter>, module: EmscriptenModule
): Record<Pointer,string> {
    return Object.fromEntries(Object.entries(types).map(
        ([ptr,namegetter]) => [ptr, namegetter(module)]
    ))
}

function typeIdToTypeName(ctx: DeclarationContext, typeId: Pointer) {
    return ctx.injectionRegistry.types[typeId](ctx.module)
}

// resolve injected function info to a standalone declaration
const resolveFunction = 
        (ctx: DeclarationContext) =>
        (injected: Injection.FreeFunction) =>
{
    const {argCount, rawArgTypesAddr} = injected
    const argTypes = heap32VectorToArray(ctx.module)(argCount, rawArgTypesAddr)
    const argTypeNames = argTypes.map(id => typeIdToTypeName(ctx,id))
    const [returnType, ...parameterTypes] = argTypeNames
    const parameters = parameterTypes.map(
        (typename,idx) => ({typename, name: `arg${idx}`})
    )
    return <Function>{
        name: readLatin1String(ctx.module)(injected.name),
        parameters: parameters
    }
}

const resolveClass = 
        (ctx: DeclarationContext) =>
        (injected: Injection.Class): Class =>
{
    return {

    }
}

const resolveNumber =
        (ctx: DeclarationContext) =>
        (injected: Injection.StringGetter) =>
{
    return injected(ctx.module) 
}

const resolveEnum =
        (ctx: DeclarationContext) =>
        (injected: Injection.EnumInfo) =>
{
    const name = injected.getName(ctx.module)
    return {name}
}

export interface DeclarationContext {
    injectionRegistry: Injection.Registry,
    module: EmscriptenModule
}
export function convertInjectionRegistryToDeclarationRegistry(
        injectionRegistry: Injection.Registry, module: EmscriptenModule
): Registry {
    const typenames = resolveTypenames(injectionRegistry.types, module)
    const ctx = {injectionRegistry, module, typenames}
    // once injection is complete, there is no need to store these as records;
    // arrays are sufficient and simpler
    const classes = Object.values(injectionRegistry.classes)
    const enums = Object.values(injectionRegistry.enums)
    return {
        functions: injectionRegistry.functions.map(resolveFunction(ctx)),
        classes: classes.map(resolveClass(ctx)),
        numbers: injectionRegistry.numbers.map(resolveNumber(ctx)),
        enums: enums.map(resolveEnum(ctx))
    }
}