// generate declarations for classes.
// 1) user-facing type such that user can write functions with bound types.
//    this type holds instance-level things such as functions and members

// 2) internal class with constructors / static functions.
//    this is what is actually attached to the module instance
//
// 3) declaration binding internal class to exported module
const {
	readLatin1String, heap32VectorToArray,
	typeIdToTypeName, typeNamesToParameters
} = require('../embind.js')

const indent = line => `\t${line}`

// user facing type
const getClassInstanceDeclaration = (module,registry) => classInfo => {
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
const getClassClassDeclaration = (module,registry) => classInfo => {
	const name = readLatin1String(module)(classInfo.name);
	return [
		`declare interface ${name}Class {`,
		...classInfo.constructors.
			map(getClassConstructorDeclaration(module,registry)).
			map(indent),
		...classInfo.classFunctions.
			map(getClassClassFunctionDeclaration(module,registry))
			.map(indent),
		`}`,
	].join('\n')
}

// binding
const getClassModuleDeclaration = (module,registry) => classInfo => {
	const name = readLatin1String(module)(classInfo.name);
	return `${name}: ${name}Class;`
}


const getClassExternalDeclaration = (module,registry) => classInfo => {
	return [
		getClassInstanceDeclaration(module,registry)(classInfo),
		getClassClassDeclaration(module,registry)(classInfo)
	].join('\n')
}

const getClassFunctionDeclaration = (module,registry) => funcInfo => {
	const {methodName,argCount,rawArgTypesAddr} = funcInfo;
	const humanName = readLatin1String(module)(methodName);
	const argTypes = heap32VectorToArray(module)(argCount, rawArgTypesAddr);
	const argTypeNames = argTypes.map(typeIdToTypeName(module,registry))
	const [returnType, instanceType, ...parameterTypes] = argTypeNames;
	const parameters = typeNamesToParameters(parameterTypes)

	return `${humanName}(${parameters}): ${returnType};`
}

const getClassConstructorDeclaration = (module,registry,name) => funcInfo => {
	const {argCount, rawArgTypesAddr} = funcInfo;
	const argTypes = heap32VectorToArray(module)(argCount, rawArgTypesAddr);
	const argTypeNames = argTypes.map(typeIdToTypeName(module,registry))
	const [returnType, ...parameterTypes] = argTypeNames;
	const parameters = typeNamesToParameters(parameterTypes)

	return `new (${parameters}): ${name};`
}

const getClassClassFunctionDeclaration = (module,registry) => funcInfo => {
	const {methodName,argCount,rawArgTypesAddr} = funcInfo;
	const humanName = readLatin1String(module)(methodName);
	const argTypes = heap32VectorToArray(module)(argCount, rawArgTypesAddr);
	const argTypeNames = argTypes.map(typeIdToTypeName(module,registry))
	const [returnType, ...parameterTypes] = argTypeNames;
	const parameters = typeNamesToParameters(parameterTypes)

	return `static ${humanName}(${parameters}): ${returnType};`
}

const getClassPropertyDeclaration = (module,registry) => funcInfo => {
	const {fieldName,getterReturnType} = funcInfo;
	const typename = typeIdToTypeName(module,registry)(getterReturnType)
	const name = readLatin1String(module)(fieldName)
	return `${name}: ${typename};`
}


module.exports = {
	getClassExternalDeclaration,
	getClassModuleDeclaration
}
