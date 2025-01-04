import init, { mount_component } from "../../../sauron/pkg/moon_wasm.js";
import { ulid } from "@std/ulid";
import { useEffect } from "preact/hooks";
const id = `id-${ulid()}`;

async function start() {
  await init().catch(console.error);
  mount_component(`#${id}`, "cat");
}
export default function () {
  useEffect(() => {
    start();
  });
  return (
    <>
      <div id={id}></div>
    </>
  );
}
