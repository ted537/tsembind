#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const {program} = require('commander')
const {generateTypescriptBindings} = require('./tsembind.js')

program
	.version('0.0.1')
	.arguments('<lib.js>')
	.option('--hint <fname>', 'hint file')
	.description('generate typescript bindings for embind library', {
		'lib.js': 'input embind library file'
	})
	.action(async libjs => {
		const opts = program.opts();
		const hint = require(path.resolve(process.cwd(), opts.hint));
		const bindings = await generateTypescriptBindings(libjs, hint);
		console.log(bindings)
	})
	.allowExcessArguments(false)
	.parseAsync(process.argv)

