import CreateModule from '../lib/enum2'

CreateModule().then( module => {
    console.log(module.Direction.Up == module.Direction.Down)
    console.log(module.Direction.Up == module.Direction.Up)
})