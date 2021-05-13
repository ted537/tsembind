const {generateTypescriptBindings} = require('../src/tsembind.js')
const assert = require('assert')

const findClassDeclaration = async libname => {
	const text = await generateTypescriptBindings(libname)
	const lines = text.split('\n')
	const lineIndex = lines.findIndex(line=>line.includes('declare class'))
	return lines.slice(lineIndex).join('\n')
}

const findFuncDeclaration = async libname => {
	const text = await generateTypescriptBindings(libname)
	const lines = text.split('\n')
	const lineIndex = lines.findIndex(line=>line.includes('declare function'))
	return lines[lineIndex]
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
	it('should generate a class multi-parameter method declaration', 
		async ()=>{
			assertEqualNormalized(
				await findClassDeclaration('lib/classmethodmultiparam.js'),
				'declare class A { f(arg0: Int, arg1: Float): Int; }'
			)
		}
	)
	it('should generate a constructor declaration', 
		async ()=>{
			assertEqualNormalized(
				await findClassDeclaration('lib/constructor.js'),
				'declare class A { constructor(); }'
			)
		}
	)
	it('should generate a constructor declaration with arguments',
		async ()=>{
			assertEqualNormalized(
				await findClassDeclaration('lib/constructor_args.js'),
				'declare class A { constructor(arg0: Int, arg1: Float); }'
			)
		}
	)
	it('should generate a declaration using a shared pointer',
		async ()=>{
			assertEqualNormalized(
				await findFuncDeclaration('lib/smartptr.js'),
				'declare function MakeSharedA(): A;'
			)
		}
	)
})
