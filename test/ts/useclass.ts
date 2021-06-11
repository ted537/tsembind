import CreateEmbindModule,{} from '../lib/classclassmethod'

CreateEmbindModule().then( module => {
	const x = module.A.f()
	console.log(x)
})
