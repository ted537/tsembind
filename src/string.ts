export const capitalize = (text:string) =>
	text[0].toUpperCase() + text.slice(1)

export const CamelCase = (words:string) =>
	words.split(' ').map(capitalize).join('')
