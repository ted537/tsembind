// generate declarations for classes.
// 1) user-facing type such that user can write functions with bound types.
//    this type holds instance-level things such as functions and members

import { EmscriptenModule } from "../emscripten";
import { StaticFunction, Constructor, MemberFunction, Class, Property, FreeFunction, Registry } from "../injection/registry";

// 2) internal class with constructors / static functions.
//    this is what is actually attached to the module instance
//
// 3) declaration binding internal class to exported module
import {
	readLatin1String, heap32VectorToArray,
	typeIdToTypeName, typeNamesToParameters
} from '../embind'

const indent = (line: string) => `\t${line}`

// user facing type
const getClassInstanceDeclaration = 
		(module: EmscriptenModule, registry: Registry) => 
		(classInfo: Class) => 
{
	const name = readLatin1String(module)(classInfo.name);
	return [
		`declare const valid${name}: unique symbol;`,
		`export interface ${name} {`,
		`\t[valid${name}]: true`,
		...classInfo.functions.
			map(getClassFunctionDeclaration(module,registry)).
			map(indent),
		...classInfo.properties.
			map(getClassPropertyDeclaration(module,registry)).
			map(indent),
		`\tdelete(): void`,
		`}`,
	].join('\n')
}

// internal class
const getClassClassDeclaration = 
		(module: EmscriptenModule, registry: Registry) => 
		(classInfo: Class) => 
{
	const name = readLatin1String(module)(classInfo.name);
	return [
		`declare interface ${name}Class {`,
		...classInfo.constructors.
			map(getClassConstructorDeclaration(module,registry,name)).
			map(indent),
		...classInfo.classFunctions.
			map(getClassClassFunctionDeclaration(module,registry))
			.map(indent),
		`}`,
	].join('\n')
}

// binding
export const getClassModuleDeclaration = 
		(module: EmscriptenModule, registry: Registry) => 
		(classInfo: Class) => {
	const name = readLatin1String(module)(classInfo.name);
	return `${name}: ${name}Class;`
}


export const getClassExternalDeclaration = 
		(module: EmscriptenModule, registry: Registry) => 
		(classInfo: Class) => {
	return [
		getClassInstanceDeclaration(module,registry)(classInfo),
		getClassClassDeclaration(module,registry)(classInfo)
	].join('\n')
}

const getClassFunctionDeclaration = 
		(module: EmscriptenModule, registry: Registry) => 
		(funcInfo: MemberFunction) => {
	const {methodName,argCount,rawArgTypesAddr} = funcInfo;
	const humanName = readLatin1String(module)(methodName);
	const argTypes = heap32VectorToArray(module)(argCount, rawArgTypesAddr);
	const argTypeNames = argTypes.map(typeIdToTypeName(module,registry))
	const [returnType, instanceType, ...parameterTypes] = argTypeNames;
	const parameters = typeNamesToParameters(parameterTypes)

	return `${humanName}(${parameters}): ${returnType};`
}

export const getClassConstructorDeclaration = 
		(module: EmscriptenModule,registry: Registry,name: string) => 
		(constructorInfo: Constructor) => {
	const {argCount, rawArgTypesAddr} = constructorInfo;
	const argTypes = heap32VectorToArray(module)(argCount, rawArgTypesAddr);
	const argTypeNames = argTypes.map(typeIdToTypeName(module,registry))
	const [returnType, ...parameterTypes] = argTypeNames;
	const parameters = typeNamesToParameters(parameterTypes)

	return `new (${parameters}): ${name};`
}

const getClassClassFunctionDeclaration = 
		(module: EmscriptenModule, registry: Registry) => 
		(funcInfo: StaticFunction) => {
	const {methodName,argCount,rawArgTypesAddr} = funcInfo;
	const humanName = readLatin1String(module)(methodName);
	const argTypes = heap32VectorToArray(module)(argCount, rawArgTypesAddr);
	const argTypeNames = argTypes.map(typeIdToTypeName(module,registry))
	const [returnType, ...parameterTypes] = argTypeNames;
	const parameters = typeNamesToParameters(parameterTypes)

	return `${humanName}(${parameters}): ${returnType};`
}

const getClassPropertyDeclaration = 
		(module: EmscriptenModule, registry: Registry) => 
		(propertyInfo: Property) => {
	const {fieldName,getterReturnType} = propertyInfo;
	const typename = typeIdToTypeName(module,registry)(getterReturnType)
	const name = readLatin1String(module)(fieldName)
	return `${name}: ${typename};`
}