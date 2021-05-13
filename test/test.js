const {generateTypescriptBindings} = require('../src/tsembind.js')
const assert = require('assert')

const lastLine = text =>
	text.slice(text.lastIndexOf('\n')+1)

describe('getTypescriptBindings', ()=> {
	it('should detect that a void function exists', async ()=>{
		assert.equal(
			lastLine(await generateTypescriptBindings('lib/voidfunc.js')),
			'declare function f(): void;'
		)
	} )
})
