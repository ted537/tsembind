#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const {program} = require('commander')
const {generateTypescriptBindings} = require('./tsembind.js')
program.version('0.0.1')

program
	.requiredOption('-i, --input <lib.js>', 'your input embind library')
	.option('-o, --output <lib.d.ts>', '.d.ts output location')

program.parse(process.argv);
const {input,output} = program.opts();
if (!fs.existsSync(input)) {
	throw `Input file ${input} does not exist!!!`
}
const actualOutput = output ? output : path.basename(input,'.js') + '.d.ts'
console.log('writing output to '+actualOutput)

generateTypescriptBindings(process.cwd()+'/'+input).then(
	bindings => fs.writeFileSync(output, bindings)
);
