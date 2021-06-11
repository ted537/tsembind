#!/usr/bin/env node
import path from 'path'
import {program} from 'commander'
import {generateTypescriptBindings} from './tsembind.js'
import { HintFunction } from './hint.js'

program
	.version('0.0.1')
	.arguments('<lib.js>')
	.option('--hint <fname>', 'hint file')
	.description('generate typescript bindings for embind library', {
		'lib.js': 'input embind library file'
	})
	.action(async (libjs:string) => {
		const opts = program.opts();
		const hint: HintFunction|undefined = 
			opts.hint && require(path.resolve(process.cwd(), opts.hint));
		const bindings = await generateTypescriptBindings(libjs, hint);
		console.log(bindings)
	})
	.allowExcessArguments(false)
	.parseAsync(process.argv)

