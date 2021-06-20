import * as Declaration from './declaration'

export interface Specifier {
	name: string
}

export interface ParameterAnnotation {
	name?: string
	typename?: string
}

export interface Annotated {
	comment?: string
	name?: string
	parameters?: Record<number,ParameterAnnotation>
	shouldExport?: boolean
}
export type Annotator = (specifier: Specifier) => Annotated | undefined

export function emptyHintFunction(specifier: Specifier) {
	return {comment:''}
}

export const  annotateFunction =
		(annotator: Annotator) => 
		(func: Declaration.Function): Declaration.Function => 
{
	const annotated = annotator(func)
	const newParameters = func.parameters.map((funcparameter,idx) => ({
		name: (annotated?.parameters||{})[idx]?.name || funcparameter.name,
		typename: (annotated?.parameters||{})[idx]?.typename || funcparameter.typename
	}))
	return {
		...func,
		comment: annotated?.comment,
		parameters: newParameters
	}
}

export const annotateClass = 
		(annotator: Annotator) =>
		(cppclass: Declaration.Class): Declaration.Class =>
{
	return {
		...cppclass,
		comment: annotator(cppclass)?.comment,
		staticFunctions: 
			cppclass.staticFunctions.map(annotateFunction(annotator)),
		memberFunctions:
			cppclass.memberFunctions.map(annotateFunction(annotator))
	}
}

export const annotateEnum = 
		(annotator: Annotator) =>
		(declaredEnum: Declaration.Enum): Declaration.Enum =>
{
	const annotated = annotator(declaredEnum)
	return {
		...declaredEnum,
		// export by default, ignore if specified
		shouldExport: 
			annotated?.shouldExport!=null ? annotated.shouldExport : true
	}
}

// mutates
export function annotateRegistry(
		registry: Declaration.Registry, annotator: Annotator
): Declaration.Registry {
	return {
		...registry,
		functions: registry.functions.map(annotateFunction(annotator)),
		classes: registry.classes.map(annotateClass(annotator)),
		moduleName: 
			annotator({name:registry.moduleName})?.name || registry.moduleName,
		enums: registry.enums.map(annotateEnum(annotator))
	}
}

export function getCommentLines(comment?: string) {
	if (comment==undefined) return []
	else return comment.split('\n')
}
