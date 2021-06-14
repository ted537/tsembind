import {generateTypescriptBindings} from '../..'
import { Annotator } from '../../src/annotation'

const annotate: Annotator = ({name}) => ({
    comment:`/** placeholder documentation for ${name} */`,
    parameters: [{name:'x'},{name:'y'}]
})

async function main() {
    const bindings = 
        await generateTypescriptBindings('./test/lib/classclassmethod.js', annotate)
    console.log(bindings)
}
main()