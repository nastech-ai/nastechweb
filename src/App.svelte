<script>
  import { messages, loading, sendMessage, checkStatus, nastechStatus } from './lib/nastech.js';
  import { onMount } from 'svelte';
  
  let input = '';
  
  onMount(() => checkStatus());
  
  async function send() {
    if (!input.trim()) return;
    const text = input;
    input = '';
    await sendMessage(text);
  }
</script>

<div class="app">
  <header>
    <h1>◆ NasTech Web</h1>
    <span class="status" class:connected={$nastechStatus === 'connected'}>
      {$nastechStatus}
    </span>
  </header>
  
  <main>
    {#each $messages as msg}
      <div class="msg {msg.role}">
        <span class="role">{msg.role}</span>
        <p>{msg.content}</p>
      </div>
    {/each}
    {#if $loading}
      <div class="msg assistant"><span class="role">assistant</span><p class="typing">...</p></div>
    {/if}
  </main>
  
  <footer>
    <input bind:value={input} on:keydown={(e) => e.key === 'Enter' && send()} placeholder="Ask NasTech..." disabled={$loading} />
    <button on:click={send} disabled={$loading}>Send</button>
  </footer>
</div>

<style>
  :root { --bg: #0a0a12; --panel: #141830; --primary: #00d4ff; --text: #dadada; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: var(--bg); color: var(--text); font-family: system-ui, sans-serif; }
  .app { display: flex; flex-direction: column; height: 100vh; max-width: 800px; margin: 0 auto; }
  header { display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid #333; }
  header h1 { color: var(--primary); font-size: 1.2rem; }
  .status { font-size: 0.8rem; padding: 0.2rem 0.5rem; border-radius: 4px; background: #333; }
  .status.connected { background: #0a4a0a; color: #0f0; }
  main { flex: 1; overflow-y: auto; padding: 1rem; }
  .msg { margin-bottom: 1rem; padding: 0.8rem; border-radius: 8px; }
  .msg.user { background: var(--panel); margin-left: 2rem; }
  .msg.assistant { background: #1a1a2e; margin-right: 2rem; }
  .msg .role { font-size: 0.7rem; color: var(--primary); text-transform: uppercase; }
  .msg p { margin-top: 0.3rem; white-space: pre-wrap; }
  .typing { animation: blink 1s infinite; }
  @keyframes blink { 50% { opacity: 0.3; } }
  footer { display: flex; gap: 0.5rem; padding: 1rem; border-top: 1px solid #333; }
  footer input { flex: 1; padding: 0.8rem; background: var(--panel); border: 1px solid #333; color: var(--text); border-radius: 8px; }
  footer button { padding: 0.8rem 1.5rem; background: var(--primary); color: #000; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }
  footer button:disabled { opacity: 0.5; }
</style>
