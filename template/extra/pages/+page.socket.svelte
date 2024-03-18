<script lang="ts">
  import { io } from "$lib/utils/clientSocket";
  import { onMount } from "svelte";

  let messages = [];

  onMount(() => {
    io.on("message", (message) => {
      messages = [...messages, message];
    });
  });
  function emit() {
    io.emit("new");
  }
</script>

<div class="messages">
  {#each messages as message}
    <span>{message}</span>
  {/each}
  <button on:click={() => emit()}>New message</button>
</div>

<style>
  .messages {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 400px;
    margin: 0 auto;
    padding: 1rem;
    border: 1px solid var(--primaryColor);
    border-radius: 0.5rem;
  }

  .messages span {
    background-color: var(--muteColor);
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    word-break: break-word;
  }

  .messages button {
    align-self: flex-end;
    background-color: var(--primaryColor);
    color: var(--backgroundColor);
    border: none;
    border-radius: 0.25rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
  }
</style>
