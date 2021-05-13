const capitalize = text =>
	text[0].toUpperCase() + text.slice(1)

const CamelCase = words =>
	words.split(' ').map(capitalize).join('')

module.exports = {CamelCase}
