import init, { mount_component } from "../../sauron/pkg/moon_wasm.js";
import { ulid } from "@std/ulid";
import { useEffect } from "preact/hooks";
const id = `id-${ulid()}`;
await init().catch(console.error);

export default function () {
  useEffect(() => {
    mount_component(`#${id}`, "dog");
  });
  return (
    <>
      <div id={id}></div>
    </>
  );
}
