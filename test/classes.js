const {generateTypescriptBindings} = require('../src/tsembind.js')
const assert = require('assert')

const findClassDeclaration = async (libname,classname) => {
	classname = classname || ''
	const text = await generateTypescriptBindings(libname)
	const lines = text.split('\n')
	const lineIndex = lines.findIndex(
		line=>line.includes(`interface ${classname}`)
	)
	return lines.slice(lineIndex).join('\n')
}

const findFuncDeclaration = async libname => {
	const text = await generateTypescriptBindings(libname)
	const lines = text.split('\n')
	const lineIndex = lines.findIndex(line=>line.includes('('))
	return lines[lineIndex]
}

const normalize = str => str.replace(/\s+/g, ' ')
const assertEqualNormalized = (a,b) => assert.equal(normalize(a),normalize(b))

describe('getTypescriptBindings (for classes)', ()=> {
	it('should generate a class declaration', async ()=>{
		assertEqualNormalized(
			await findClassDeclaration('lib/emptyclass.js'),
			'interface A { }'
		)
	} )
	it('should generate a subclass declaration', async ()=>{
		assertEqualNormalized(
			await findClassDeclaration('lib/subclass.js','B'),
			'interface B extends A { }'
		)
	} )
	it('should generate a class method declaration', async ()=>{
		assertEqualNormalized(
			await findClassDeclaration('lib/classmethod.js'),
			'interface A { f(): void; }'
		)
	} )
	it('should generate a class class method declaration', async ()=>{
		assertEqualNormalized(
			await findClassDeclaration('lib/classclassmethod.js'),
			'interface A { static f(): void; }'
		)
	} )
	it('should generate a class multi-parameter method declaration', 
		async ()=>{
			assertEqualNormalized(
				await findClassDeclaration('lib/classmethodmultiparam.js'),
				'interface A { f(arg0: Int, arg1: Float): Int; }'
			)
		}
	)
	it('should generate a constructor declaration', 
		async ()=>{
			assertEqualNormalized(
				await findClassDeclaration('lib/constructor.js'),
				'interface A { constructor(); }'
			)
		}
	)
	it('should generate a constructor declaration with arguments',
		async ()=>{
			assertEqualNormalized(
				await findClassDeclaration('lib/constructor_args.js'),
				'interface A { constructor(arg0: Int, arg1: Float); }'
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
