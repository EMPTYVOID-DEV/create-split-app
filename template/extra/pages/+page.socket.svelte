<script lang="ts">
  import { io } from "$lib/utils/clientSocket";
  import { onMount } from "svelte";

  let messages = [];

  onMount(() => {
    io.on("message", (message) => {
      messages = [...messages, message];
    });
  });
  function omit() {
    io.omit("new");
  }
</script>

<div class="messages">
  {#each messages as message}
    <span>{message}</span>
  {/each}
  <button on:click={() => omit()}>New message</button>
</div>

<style>
  .messages {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 400px;
    margin: 0 auto;
    padding: 1rem;
    border: 1px solid var(--silver);
    border-radius: 0.5rem;
  }

  .messages span {
    background-color: var(--silver);
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    word-break: break-word;
  }

  .messages button {
    align-self: flex-end;
    background-color: var(--blue);
    color: var(--white);
    border: none;
    border-radius: 0.25rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
  }
</style>
