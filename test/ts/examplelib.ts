import CreateModule from '../lib/examplelib'

CreateModule().then(module => {
    const multiplier = new module.Multiplier(4)
})