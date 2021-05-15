const {generateTypescriptBindings} = require('../src/tsembind.js')
const assert = require('assert')

const findEnumDeclaration = async libname => {
	const text = await generateTypescriptBindings(libname)
	const lines = text.split('\n')
	const lineIndex = lines.findIndex(line=>line.includes('enum '))
	const footerIndex = lines.findIndex(
		line=>line.includes('CustomEmbindModule')
	)
	return lines.slice(lineIndex,footerIndex).join('\n')
}

const normalize = str => str.replace(/\s+/g, ' ')
const assertEqualNormalized = (a,b) => assert.equal(normalize(a),normalize(b))

describe('getTypescriptBindings (for enums)', ()=> {
	it('should generate an enum declaration', async ()=>{
		assertEqualNormalized(
			await findEnumDeclaration('lib/emptyenum.js'),
			'enum Direction { }'
		)
	} )
	it('should generate an enum declaration with a value', async ()=>{
		assertEqualNormalized(
			await findEnumDeclaration('lib/enum1.js'),
			'enum Direction { Up = 1, }'
		)
	} )
	it('should generate an enum declaration with multiple values', async ()=>{
		assertEqualNormalized(
			await findEnumDeclaration('lib/enum2.js'),
			'enum Direction { Up = 1, Down = 2, }'
		)
	} )
})
