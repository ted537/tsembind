export interface HintSpecifier {
	name: string
}
export interface Hint {
	comment: string
}
export type HintFunction = (specifier: HintSpecifier) => Hint

export function emptyHintFunction(specifier: HintSpecifier) {
	return {comment:''}
}