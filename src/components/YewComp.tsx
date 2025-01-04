import init, { mount_app } from "../../yew/pkg/yew_astro.js";
import { ulid } from "@std/ulid";
import { onMount, atom } from "nanostores";
import { useStore } from "@nanostores/preact";

export default function () {
  const id = `id-${ulid()}`;
  async function start() {
    await init();
    if (id) mount_app(`#${id}`);
  }
  start();
  return (
    <div class="">
      <div id={id}>Sup {id}</div>
    </div>
  );
}
