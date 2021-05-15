const {generateTypescriptBindings} = require('../src/tsembind.js')
const assert = require('assert')

const findFunctions = text => {
	const lines = text.split('\n')
	return lines.filter(
		line=>line.includes('(') && !line.includes('declare ')
	).join('\n')
}

describe('getTypescriptBindings (for simple functions)', ()=> {
	it('should generate a void function declaration', async ()=>{
		assert.equal(
			findFunctions(await generateTypescriptBindings('lib/voidfunc.js')),
			'\tf(): void;'
		)
	} )
	it('should generate a void function declaration for non-modularized', 
	async ()=>{
		assert.equal(
			findFunctions(await generateTypescriptBindings('lib/nonmodule.js')),
			'\tf(): void;'
		)
	} )
	it('should generate a void function declaration after optimization',
	async ()=>{
		assert.equal(
			findFunctions(await generateTypescriptBindings('lib/optimized.js')),
			'\tf(): void;'
		)
	} )
	it('should generate a declaration for a function returning an integer', 
		async ()=>{
			assert.equal(
				findFunctions(await generateTypescriptBindings('lib/return_int.js')),
				'\tf(): Int;'
			)
		}
	)
	it('should generate a declaration for a function returning a float', 
		async ()=>{
			assert.equal(
				findFunctions(await generateTypescriptBindings('lib/return_float.js')),
				'\tf(): Float;'
			)
		}
	)
	it('should generate a declaration for a function returning a bool', 
		async ()=>{
			assert.equal(
				findFunctions(await generateTypescriptBindings('lib/return_bool.js')),
				'\tf(): boolean;'
			)
		}
	)
	it('should generate a declaration for a function returning a string', 
		async ()=>{
			assert.equal(
				findFunctions(await generateTypescriptBindings('lib/return_string.js')),
				'\tf(): string;'
			)
		}
	)
	it('should generate a declaration for an int identity function',
		async ()=>{
			assert.equal(
				findFunctions(await generateTypescriptBindings('lib/identity.js')),
				'\tf(arg0: Int): Int;'
			)
		}
	)
	it('should generate a declaration for an int sum function',
		async ()=>{
			assert.equal(
				findFunctions(await generateTypescriptBindings('lib/sum.js')),
				'\tf(arg0: Int, arg1: Int): Int;'
			)
		}
	)
	it('should generate declarations for function overloads',
		async ()=>{
			assert.equal(
				findFunctions
					(await generateTypescriptBindings('lib/overload.js')),
				'\tf(): void;\n'+
				'\tf(arg0: Int): void;'
			)
		}
	)
})

