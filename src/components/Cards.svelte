<script lang="ts">
    import { Card, getCards } from "../store/cards";
    import { onMount } from "svelte";
    const { meta } = $props();
    let cards = $state<Card[]>([]);
    onMount(async () => {
        cards = await getCards(meta);
    });
    import ImageForm from "./ImageForm.svelte";
</script>

<ImageForm bind:value={cards} {meta} />
<div class="columns-1 lg:columns-4 gap-4 w-full">
    {#each cards as c}
        <div class="border w-full lg:w-60 break-inside-avoid mb-4">
            <div class="">
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
