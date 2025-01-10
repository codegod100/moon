<script lang="ts">
    // import { cards as cardStore } from "../store/cards";
    const { meta, cardsData } = $props();
    let cards = $state(cardsData);
    import {
        configureOAuth,
        createAuthorizationUrl,
        getSession,
        resolveFromIdentity,
    } from "@atcute/oauth-browser-client";
    import ImageForm from "./ImageForm.svelte";
    configureOAuth({ metadata: meta });
</script>

<ImageForm bind:value={cards} />
<div class="flex flex-wrap gap-4 justify-center w-full">
    {#each cards as c}
        <div class="border flex items-center flex-col w-full lg:w-60">
            <div
                class="break-words break-all whitespace-pre-wrap overflow-hidden"
            >
                {c.text}
            </div>
            <div>
                {#if c.links}
                    {#each c.links as l}
                        <div>
                            <a href={l.url}>
                                <b>{l.title}</b>
                            </a>{" "}
                            {l.description} <img src={l.image} alt="link" />
                        </div>
                    {/each}
                {/if}
            </div>
            {#if c.image}
                <div class="w-full">
                    <a
                        href={`https://cdn.bsky.app/img/feed_thumbnail/plain/${c.image.did}/${c.image.link}`}
                    >
                        <img
                            alt="thumbnail"
                            class="w-full h-auto object-cover"
                            src={`https://cdn.bsky.app/img/feed_thumbnail/plain/${c.image.did}/${c.image.link}`}
                        />
                    </a>
                </div>
            {/if}
            <div class="mt-auto self-start pt-2">
                <a href={`https://pdsls.dev/${c.uri}`}>
                    <img class="mr-2" src="/download.svg" alt="download" />
                </a>
            </div>
        </div>
    {/each}
</div>
