import { writable } from 'svelte/store';

export const messages = writable([]);
export const loading = writable(false);
export const nastechStatus = writable('disconnected');

const NAS_TECH_API = 'http://localhost:9119';

export async function sendMessage(text) {
  messages.update(m => [...m, { role: 'user', content: text }]);
  loading.set(true);
  
  try {
    const res = await fetch(`${NAS_TECH_API}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();
    messages.update(m => [...m, { role: 'assistant', content: data.response || data.message || 'No response' }]);
  } catch (e) {
    messages.update(m => [...m, { role: 'assistant', content: `Error: ${e.message}. Is NasTech Agent running on port 9119?` }]);
  }
  
  loading.set(false);
}

export async function checkStatus() {
  try {
    const res = await fetch(`${NAS_TECH_API}/api/health`);
    nastechStatus.set(res.ok ? 'connected' : 'error');
  } catch {
    nastechStatus.set('disconnected');
  }
}
