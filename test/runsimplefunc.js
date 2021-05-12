require('../src/tsembind.js')
async function main() {
	const module = await require('../build/simplefunc.js')();
}
main()
