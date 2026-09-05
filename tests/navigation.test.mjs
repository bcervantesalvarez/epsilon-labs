import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mountNavigation } from '../src/lib/navigation.js';
function setup(reduce = false) {
  const events = new Map();
  const nodes = { 'scroll-top': { hidden: true }, main: { focus(options) { this.options = options; } } };
  const bus = { addEventListener(type, fn) { events.set(type, fn); }, removeEventListener(type) { events.delete(type); } };
  const doc = { ...bus, getElementById: id => nodes[id], querySelectorAll: () => [] };
  let pending;
  const win = { ...bus, scrollY: 0, innerHeight: 800, matchMedia: () => ({ matches: reduce }), requestAnimationFrame(fn) { pending = fn; return 1; }, cancelAnimationFrame() {}, scrollTo(options) { this.lastScroll = options; } };
  const dispose = mountNavigation(win, doc);
  return { nodes, win, dispose, fire(type, event) { events.get(type)?.(event); }, flush() { pending?.(); pending = null; } };
}
test('new page button replaces detached button after Astro navigation', () => {
  const s = setup(); s.win.scrollY = 600; s.fire('scroll'); s.flush();
  const old = s.nodes['scroll-top']; assert.equal(old.hidden, false);
  s.nodes['scroll-top'] = { hidden: true }; s.fire('astro:page-load');
  assert.equal(s.nodes['scroll-top'].hidden, false);
  s.win.scrollY = 0; s.fire('scroll'); s.flush();
  assert.equal(s.nodes['scroll-top'].hidden, true); assert.equal(old.hidden, false);
});
test('top action transfers focus before scrolling and respects reduced motion', () => {
  for (const reduced of [false, true]) {
    const s = setup(reduced); let prevented = false;
    s.fire('click', { target: { closest: selector => selector.includes('#scroll-top') }, preventDefault() { prevented = true; } });
    assert.equal(prevented, true); assert.deepEqual(s.nodes.main.options, { preventScroll: true });
    assert.deepEqual(s.win.lastScroll, { top: 0, behavior: reduced ? 'instant' : 'smooth' });
  }
});
test('short viewport uses a reachable threshold and cleanup stops listeners', () => {
  const s = setup(); s.win.innerHeight = 400; s.win.scrollY = 270; s.fire('resize'); s.flush();
  assert.equal(s.nodes['scroll-top'].hidden, false); s.dispose();
  s.win.scrollY = 0; s.fire('astro:page-load'); assert.equal(s.nodes['scroll-top'].hidden, false);
});
