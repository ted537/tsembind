import CreateModule from '../lib/examplelib'

CreateModule().then(module => {
    const multiplier = new module.Multiplier(4)
    const x = multiplier.multiply(4)
    console.log(x)
})