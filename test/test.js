const {generateTypescriptBindings} = require('../src/tsembind.js')
const assert = require('assert')

const lastLine = text =>
	text.slice(text.lastIndexOf('\n')+1)

describe('getTypescriptBindings', ()=> {
	it('should generate a void function declaration', async ()=>{
		assert.equal(
			lastLine(await generateTypescriptBindings('lib/voidfunc.js')),
			'declare function f(): void;'
		)
	} )
})

describe('getTypescriptBindings', ()=> {
	it('should generate a declaration for a function returning an integer', 
		async ()=>{
			assert.equal(
				lastLine(await generateTypescriptBindings('lib/return_int.js')),
				'declare function f(): Int;'
			)
		}
	)
})

describe('getTypescriptBindings', ()=> {
	it('should generate a declaration for a function returning a float', 
		async ()=>{
			assert.equal(
				lastLine(await generateTypescriptBindings('lib/return_float.js')),
				'declare function f(): Float;'
			)
		}
	)
})
