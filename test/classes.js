const {generateTypescriptBindings} = require('../src/tsembind.js')
const assert = require('assert')

const findClassDeclaration = async libname => {
	const text = await generateTypescriptBindings(libname)
	const lines = text.split('\n')
	const lineIndex = lines.findIndex(line=>line.includes('declare class'))
	return lines.slice(lineIndex).join('\n')
}

const normalize = str => str.replace(/\s+/g, ' ')
const assertEqualNormalized = (a,b) => assert.equal(normalize(a),normalize(b))

describe('getTypescriptBindings (for classes)', ()=> {
	it('should generate a class declaration', async ()=>{
		assertEqualNormalized(
			await findClassDeclaration('lib/emptyclass.js'),
			'declare class A { }'
		)
	} )
	it('should generate a class method declaration', async ()=>{
		assertEqualNormalized(
			await findClassDeclaration('lib/classmethod.js'),
			'declare class A { f(): void; }'
		)
	} )
})
