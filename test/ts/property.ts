import CreateModule from '../lib/classproperty'

CreateModule().then( module => {
    const a = new module.A()
    a.x = 5
    console.log(a.x)
})