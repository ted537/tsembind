const {inject, getDeclarations} = require('../src/tsembind.js')
inject();
async function main() {
	const module = await require('../build/simplefunc.js')();
	console.log(getDeclarations(module))
	console.log(module.___getTypeName(12))
}
main()
