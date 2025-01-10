<script lang="ts">
    import { actions } from "astro:actions";
    import { onMount } from "svelte";
    import confetti from "canvas-confetti";
    console.log("hi");
    let users: ArrayLike<{ username: string; id: number }> | undefined;
    let title: string;
    let content: string;
    let posts:
        | ArrayLike<{
              id: number;
              title: string;
              content: string;
          }>
        | undefined;
    onMount(async () => {
        console.log("mounted");
        users = await actions.getUsers().then((u) => u.data);
        posts = await actions.getPosts().then((u) => u.data);
        console.log({ users });
        console.log({ posts });
    });
</script>

{#if !posts}
    <div>Loading posts...</div>
{:else if posts}
    {#each posts as post}
        <div class="m-2">
            <div class="flex">
                <div class="mr-2">Title: {post.title}</div>
                <button
                    class="bg-red-500 hover:bg-red-700 text-sm text-white p-1 m-1 rounded ml-2 small"
                    onclick={async () => {
                        await actions.deletePost({ id: post.id });
                        posts = await actions.getPosts().then((u) => u.data);
                    }}>delete</button
                >
            </div>
            <div>Content: {post.content}</div>
        </div>
    {/each}
{/if}
<div class="mb-10">
    <div>
        <input
            type="text"
            placeholder="Title"
            bind:value={title}
            class="bg-gray-800 text-white rounded p-2 mb-1"
        />
    </div>
    <div>
        <textarea
            placeholder="Content"
            bind:value={content}
            class="bg-gray-800 text-white rounded p-2"
        ></textarea>
    </div>
    <button
        onclick={async () => {
            await actions.createPost({ title, content });
            console.log("post created");
            title = "";
            content = "";
            posts = await actions.getPosts().then((u) => u.data);
        }}
        class="bg-blue-500 hover:bg-blue-700 text-white
        p-1 m-2 rounded small">Create post</button
    >
</div>

<button
    class="bg-blue-500 hover:bg-blue-700 text-white p-1 m-2 rounded small"
    onclick={async () => {
        const user = await actions.insertUser({ username: "yolo" });
        console.log({ user });
        users = await actions.getUsers().then((u) => u.data);
        // throwConfetti();
        confetti();
    }}>create user</button
>
{#if !users}
    <div>Loading users....</div>
{/if}
{#if users && users.length === 0}
    <div>No users found</div>
{:else if users}
    {#each users as user}
        <div>
            {user.id}
            {user.username}
            <button
                class="bg-red-500 hover:bg-red-700 text-white p-1 m-1 rounded ml-2 small"
                onclick={async () => {
                    console.log("deleting");
                    await actions.deleteUser({ id: user.id });
                    users = await actions.getUsers().then((u) => u.data);
                }}>delete</button
            >
        </div>
    {/each}
{/if}
