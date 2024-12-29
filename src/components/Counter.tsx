import { atom } from 'nanostores';
import { useStore } from '@nanostores/preact';
const foo = atom("werp")
export default function(props){
    console.log({props})
    const $foo = useStore(foo)
    return <>
    <div>{$foo} ok</div>
    <div>{props.state.name}</div>
    <button  class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 font-medium shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200" onClick={()=>{
        console.log("I'm scared")
        foo.set("derp")
    }}>HEllo?</button>
    </>
}