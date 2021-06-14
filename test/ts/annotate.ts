import {generateTypescriptBindings} from '../..'
import { Annotator } from '../../src/annotation'

const annotate: Annotator = ({name}) => ({
    comment:`/** placeholder documentation for ${name} */`
})

async function main() {
    const bindings = 
        await generateTypescriptBindings('./test/lib/sum.js', annotate)
    console.log(bindings)
}
main()