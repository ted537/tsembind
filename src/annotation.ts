export interface Specifier {
	name: string
}
export interface Annotation {
	comment: string
}
export type Annotator = (specifier: Specifier) => Annotation

export function emptyHintFunction(specifier: Specifier) {
	return {comment:''}
}