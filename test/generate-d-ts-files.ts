import path from 'path'
import {readdir,writeFile} from 'fs/promises'
import {generateTypescriptBindings} from 'tsembind'
import assert from 'assert'

function withoutExt(fname: string, ext: string) {
	assert(fname.endsWith(ext))
	return fname.slice(0,fname.length-ext.length)
}

async function generateDeclarationAndSaveToFile(libjs: string) {
	const bindings = await generateTypescriptBindings(libjs);
	const dtsFname = withoutExt(libjs,'.js') + '.d.ts'
	await writeFile(dtsFname, bindings);
}

async function generateDeclarationFilesForTestLibraries() {
	const jsFiles = (await readdir('./test/lib'))
		.filter( fname => fname.endsWith('.js') )

	await Promise.all(jsFiles.map(fname => 
		generateDeclarationAndSaveToFile(path.resolve('./test/lib/',fname))
	));
}

generateDeclarationFilesForTestLibraries()
