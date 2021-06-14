import * as Declaration from './declaration'

export interface Specifier {
	name: string
}
export interface Annotated {
	comment?: string
}
export type Annotator = (specifier: Specifier) => Annotated

export function emptyHintFunction(specifier: Specifier) {
	return {comment:''}
}

const makeAnnotate = 
	(annotator: Annotator) => 
	<T extends Specifier> (declared: T): T & Annotated =>

	({...declared, ...annotator(declared)})

// mutates
export function annotateRegistry(
		registry: Declaration.Registry, annotator: Annotator
): Declaration.Registry {
	const annotate = makeAnnotate(annotator)
	return {
		...registry,
		functions: registry.functions.map(annotate)
	}
}

export function getCommentLines(comment?: string) {
	if (comment==undefined) return []
	else return comment.split('\n')
}