#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const {program} = require('commander')
const {generateTypescriptBindings} = require('./tsembind.js')

program
	.version('0.0.1')
	.arguments('<lib.js>')
	.description('generate typescript bindings for embind library', {
		'lib.js': 'input embind library file'
	})
	.action(async libjs => {
		const bindings = await generateTypescriptBindings(libjs)
		console.log(bindings)
	})
	.allowExcessArguments(false)
	.parseAsync(process.argv)

