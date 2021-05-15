const {generateTypescriptBindings} = require('../src/tsembind.js')
const assert = require('assert')

const findClassDeclaration = async (libname,classname) => {
	classname = classname || ''
	const text = await generateTypescriptBindings(libname)
	const lines = text.split('\n')
	const lineIndex = lines.findIndex(
		line=>line.includes(`interface ${classname}`)
	)
	const footerIndex = lines.findIndex(
		line=>line.includes('CustomEmbindModule')
	)
	return lines.slice(lineIndex,footerIndex).join('\n')
}

const findFuncDeclaration = async libname => {
	const text = await generateTypescriptBindings(libname)
	const lines = text.split('\n')
	const lineIndex = lines.findIndex(
		line=>line.includes('(') && !line.includes('declare ')
	)
	return lines[lineIndex]
}

const normalize = str => str.replace(/\s+/g, ' ')
const assertEqualNormalized = (a,b) => assert.equal(normalize(a),normalize(b))

describe('getTypescriptBindings (for classes)', ()=> {
	it('should generate a class declaration', async ()=>{
		assertEqualNormalized(
			await findClassDeclaration('lib/emptyclass.js'),
			'export interface A { }'
		)
	} )
	it('should generate a subclass declaration', async ()=>{
		assertEqualNormalized(
			await findClassDeclaration('lib/subclass.js','B'),
			'export interface B extends A { }'
		)
	} )
	it('should generate a class method declaration', async ()=>{
		assertEqualNormalized(
			await findClassDeclaration('lib/classmethod.js'),
			'export interface A { f(): void; }'
		)
	} )
	it('should generate a class class method declaration', async ()=>{
		assertEqualNormalized(
			await findClassDeclaration('lib/classclassmethod.js'),
			'export interface A { static f(): void; }'
		)
	} )
	it('should generate a class multi-parameter method declaration', 
		async ()=>{
			assertEqualNormalized(
				await findClassDeclaration('lib/classmethodmultiparam.js'),
				'export interface A { f(arg0: Int, arg1: Float): Int; }'
			)
		}
	)
	it('should generate a constructor declaration', 
		async ()=>{
			assertEqualNormalized(
				await findClassDeclaration('lib/constructor.js'),
				'export interface A { constructor(); }'
			)
		}
	)
	it('should generate a constructor declaration with arguments',
		async ()=>{
			assertEqualNormalized(
				await findClassDeclaration('lib/constructor_args.js'),
				'export interface A { constructor(arg0: Int, arg1: Float); }'
			)
		}
	)
	it('should generate a declaration using a shared pointer',
		async ()=>{
			assertEqualNormalized(
				await findFuncDeclaration('lib/smartptr.js'),
				'\tMakeSharedA(): A;'
			)
		}
	)
})
