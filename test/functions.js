const {generateTypescriptBindings} = require('../src/tsembind.js')
const assert = require('assert')

const lastLine = text =>
	text.slice(text.lastIndexOf('\n')+1)

describe('getTypescriptBindings (for simple functions)', ()=> {
	it('should generate a void function declaration', async ()=>{
		assert.equal(
			lastLine(await generateTypescriptBindings('lib/voidfunc.js')),
			'declare function f(): void;'
		)
	} )
	it('should generate a declaration for a function returning an integer', 
		async ()=>{
			assert.equal(
				lastLine(await generateTypescriptBindings('lib/return_int.js')),
				'declare function f(): Int;'
			)
		}
	)
	it('should generate a declaration for a function returning a float', 
		async ()=>{
			assert.equal(
				lastLine(await generateTypescriptBindings('lib/return_float.js')),
				'declare function f(): Float;'
			)
		}
	)
	it('should generate a declaration for a function returning a bool', 
		async ()=>{
			assert.equal(
				lastLine(await generateTypescriptBindings('lib/return_bool.js')),
				'declare function f(): boolean;'
			)
		}
	)
	it('should generate a declaration for an int identity function',
		async ()=>{
			assert.equal(
				lastLine(await generateTypescriptBindings('lib/identity.js')),
				'declare function f(arg0: Int): Int;'
			)
		}
	)
	it('should generate a declaration for an int sum function',
		async ()=>{
			assert.equal(
				lastLine(await generateTypescriptBindings('lib/sum.js')),
				'declare function f(arg0: Int, arg1: Int): Int;'
			)
		}
	)
})

