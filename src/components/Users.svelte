<script lang="ts">
  //   import { db, User } from "astro:db";
  import { actions } from "astro:actions";
  import { onMount } from "svelte";
  console.log("hi");
  let users: ArrayLike<{ username: string; id: number }> | undefined;
  onMount(async () => {
    console.log("mounted");
    users = await actions.getUsers().then((u) => u.data);
    console.log({ users });
  });
</script>

<button
  class="bg-blue-500 hover:bg-blue-700 text-white p-1 m-2 rounded small"
  onclick={async () => {
    await actions.insertUser("yolo");
    users = await actions.getUsers().then((u) => u.data);
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
          await actions.deleteUser(user.id);
          users = await actions.getUsers().then((u) => u.data);
        }}>delete</button
      >
    </div>
  {/each}
{/if}
