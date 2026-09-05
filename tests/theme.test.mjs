import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const layout = readFileSync(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8');
const controller = layout.split('<!-- One controller owns theme state')[1].split('<script is:inline>')[1].split('</script>')[0];
function setup({ saved = null, blocked = false, dark = false } = {}) {
  const handlers = {};
  const button = { setAttribute(k, v) { this[k] = v; } };
  const media = { matches: dark, addEventListener(_, fn) { this.change = fn; } };
  const document = {
    documentElement: { dataset: {} },
    getElementById: () => button,
    querySelectorAll: () => [],
    addEventListener(name, fn) { (handlers[name] ??= []).push(fn); },
    dispatchEvent(event) { for (const fn of handlers[event.type] ?? []) fn(event); },
  };
  const window = { matchMedia: () => media, addEventListener: document.addEventListener.bind(document) };
  const localStorage = {
    getItem() { if (blocked) throw Error('blocked'); return saved; },
    setItem(_, value) { if (blocked) throw Error('blocked'); saved = value; },
  };
  runInNewContext(controller, { document, window, localStorage, Event: class { constructor(type) { this.type = type; } }, HTMLIFrameElement: class {} });
  return { document, media, button, saved: () => saved, fire: (type, values = {}) => document.dispatchEvent({ type, ...values }), theme: () => document.documentElement.dataset.theme };
}
test('stored preference wins over OS and persists across page swaps', () => {
  const ctx = setup({ saved: 'light', dark: true });
  assert.equal(ctx.theme(), 'light');
  ctx.fire('theme:select', { detail: 'dark' });
  ctx.document.documentElement.dataset.theme = 'light';
  ctx.fire('astro:after-swap');
  assert.equal(ctx.theme(), 'dark');
  assert.equal(ctx.saved(), 'dark');
  assert.equal(ctx.button['aria-pressed'], 'true');
});
test('blocked storage does not undo a selected theme', () => {
  const ctx = setup({ blocked: true });
  ctx.fire('theme:select', { detail: 'dark' });
  ctx.fire('astro:after-swap');
  ctx.fire('astro:page-load');
  assert.equal(ctx.theme(), 'dark');
  ctx.fire('theme:select', { detail: 'light' });
  assert.equal(ctx.button['aria-pressed'], 'false');
});
test('system changes apply only without an explicit selection', () => {
  const ctx = setup({ saved: 'invalid' });
  ctx.media.matches = true; ctx.media.change();
  assert.equal(ctx.theme(), 'dark');
  ctx.fire('theme:select', { detail: 'light' });
  ctx.media.change();
  assert.equal(ctx.theme(), 'light');
});
test('cross-tab storage changes and clearing synchronize the page', () => {
  const ctx = setup({ dark: false });
  ctx.fire('storage', { key: 'theme', newValue: 'dark' });
  assert.equal(ctx.theme(), 'dark');
  ctx.fire('storage', { key: null, newValue: null });
  assert.equal(ctx.theme(), 'light');
});
test('invalid selection events are ignored', () => {
  const ctx = setup();
  ctx.fire('theme:select', { detail: 'unexpected' });
  assert.equal(ctx.theme(), 'light');
});
