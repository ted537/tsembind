const {generateTypescriptBindings} = require('../src/tsembind.js')
const assert = require('assert')

describe('getTypescriptBindings', ()=> {
	it('should detect that a void function exists', async ()=>{
		assert.equal(
			'declare function f();',
			await generateTypescriptBindings('lib/voidfunc.js')
		)
	} )
})
