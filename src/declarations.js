// transform registry into typescript declarations
const {readLatin1String, heap32VectorToArray} = require('./embind.js')

// TODO hijack register void
const typeIdToTypeName = (module,registry) => typeId => {
	// TODO assert that we only have one void type
	if (!(typeId in registry.types)) {
		console.warn(`typeId=${typeId} not found in registry`)
		return 'any'
	}

	return registry.types[typeId](module)
}

// can't give names here unfortunately
const typeNamesToParameters = typenames =>
	typenames.map(
		(typename,idx) => `arg${idx}: ${typename}`
	).join(', ')

const getFunctionDeclaration = (module,registry) => funcInfo => {
	const {name,argCount,rawArgTypesAddr} = funcInfo;
	// TODO
	const nameStr = readLatin1String(module)(name)
	const argTypes = heap32VectorToArray(module)(argCount, rawArgTypesAddr);
	const argTypeNames = argTypes.map(typeIdToTypeName(module,registry))
	const [returnType,...parameterTypes] = argTypeNames;
	const parameters = typeNamesToParameters(parameterTypes)
	return `declare function ${nameStr}(${parameters}): ${returnType};`
}

const getClassFunctionDeclaration = (module,registry) => funcInfo => {
	const {methodName,argCount,rawArgTypesAddr} = funcInfo;
	const humanName = readLatin1String(module)(methodName);
	const argTypes = heap32VectorToArray(module)(argCount, rawArgTypesAddr);
	const argTypeNames = argTypes.map(typeIdToTypeName(module,registry))
	const [returnType, instanceType, ...parameterTypes] = argTypeNames;
	const parameters = typeNamesToParameters(parameterTypes)

	return `\t${humanName}(${parameters}): ${returnType};`
}

const getClassClassFunctionDeclaration = (module,registry) => funcInfo => {
	const {methodName,argCount,rawArgTypesAddr} = funcInfo;
	const humanName = readLatin1String(module)(methodName);
	const argTypes = heap32VectorToArray(module)(argCount, rawArgTypesAddr);
	const argTypeNames = argTypes.map(typeIdToTypeName(module,registry))
	const [returnType, ...parameterTypes] = argTypeNames;
	const parameters = typeNamesToParameters(parameterTypes)

	return `\tstatic ${humanName}(${parameters}): ${returnType};`
}

const getClassConstructorDeclaration = (module,registry) => funcInfo => {
	const {argCount, rawArgTypesAddr} = funcInfo;
	const argTypes = heap32VectorToArray(module)(argCount, rawArgTypesAddr);
	const argTypeNames = argTypes.map(typeIdToTypeName(module,registry))
	const [returnType, ...parameterTypes] = argTypeNames;
	const parameters = typeNamesToParameters(parameterTypes)

	return `\tconstructor(${parameters});`
}

const getClassDeclaration = (module,registry) => classInfo => {
	const {name,classFunctions,functions,constructors} = classInfo;
	const humanName = readLatin1String(module)(name)
	return [
		[`declare class ${humanName} {`],
		constructors.map(getClassConstructorDeclaration(module,registry)),
		classFunctions.map(getClassClassFunctionDeclaration(module,registry)),
		functions.map(getClassFunctionDeclaration(module,registry)),
		['}']
	].flat().join('\n')
}

const getEnumValueDeclaration = (module,registry) => valInfo => {
	const {name,enumValue} = valInfo;
	const humanName = readLatin1String(module)(name)
	return `\t${humanName} = ${enumValue},`
}

const getEnumDeclaration = (module,registry) => enumInfo => {
	const {getName,values} = enumInfo;
	const name = getName(module)
	return [
		[`enum ${name} {`],
		values.map(getEnumValueDeclaration(module,registry)),
		['}']
	].flat().join('\n')
}


// TS is not responsible for enforcing number sizes (int8 vs int32 etc)
const declarationForNumber = (module,registry) => name => {
	return `type ${name(module)} = Number`
}

const declarationsForRegistry = (module,registry) => {
	return [
		registry.numbers.map(declarationForNumber(module,registry)),
		registry.functions
			.map(getFunctionDeclaration(module,registry)),
		Object.values(registry.classes)
			.map(getClassDeclaration(module,registry)),
		Object.values(registry.enums)
			.map(getEnumDeclaration(module,registry))
	].flat().join('\n')
}

module.exports = {declarationsForRegistry}
