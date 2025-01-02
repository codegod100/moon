import init from "../../sauron/pkg/counter.js";
await init().catch(console.error);

export default function(){
    return <><button class="hidden inline-block px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors shadow-md"/></>
}