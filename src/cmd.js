#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const {program} = require('commander')
const {generateTypescriptBindings} = require('./tsembind.js')
program.version('0.0.1')

program
	.requiredOption('-i, --input <lib.js>', 'your input embind library')
	.option('-o, --output <lib.d.ts>', '.d.ts output location')

function changeExtension(filename, ext) {
	const {dir,name} = path.parse(filename)
	return path.format({dir,name,ext})
}

program.parse(process.argv);
const {input,output} = program.opts();
if (!fs.existsSync(input)) {
	throw `Input file ${input} does not exist!!!`
}

generateTypescriptBindings(process.cwd()+'/'+input).then(bindings => {
	if (output) fs.writeFileSync(output, bindings) 
	else console.log(bindings)
});
