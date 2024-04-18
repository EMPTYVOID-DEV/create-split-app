<script lang="ts">
  import { io } from "$lib/client/utils/clientSocket";
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

<div class="home">
  <div class="messages">
    {#each messages as message}
      <span>{message}</span>
    {/each}
    <button on:click={() => emit()}>New message</button>
  </div>
</div>

<style>
  .home {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .messages {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 0 auto;
    padding: 1rem;
    border: 1px solid #3498db;
    border-radius: 0.5rem;
  }

  .messages span {
    background-color: #505050;
    color: #ffffff;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    word-break: break-word;
  }

  .messages button {
    align-self: flex-end;
    background-color: #3498db;
    color: #ffffff;
    border: none;
    outline: none;
    border-radius: 0.25rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
  }
</style>
