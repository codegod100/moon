<script lang="ts">
  import {
    configureOAuth,
    createAuthorizationUrl,
    getSession,
    resolveFromIdentity,
  } from "@atcute/oauth-browser-client";
  import { onMount } from "svelte";
  const { meta } = $props();
  console.log({ meta });
  configureOAuth({ metadata: meta });
  const handle: string = localStorage["handle"];
  async function sessionData() {
    localStorage["url"] = location.href;
    console.log({ localStorage });
    // if (!handle) return location.assign(`/login`);
    const { identity } = await resolveFromIdentity(handle);
    try {
      const session = await getSession(identity.id, {
        allowStale: true,
      });
    } catch (e) {
      console.log(e);
      //   location.assign(`/login/${handle}`);
    }
  }
  onMount(async () => {
    const { identity, metadata } = await resolveFromIdentity(handle);
    const url = await createAuthorizationUrl({
      metadata,
      identity,
      scope: "atproto transition:generic",
    });
    console.log({ url });
    location.assign(url);
  });

  //   sessionData();
</script>
