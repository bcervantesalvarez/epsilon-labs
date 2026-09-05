import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { load } from 'cheerio';

const drafts = process.argv.includes('--drafts');
const routes = ['blog/rare-events-dregora', 'blog/algorithms-study-boundaries', 'projects/dregora-codex'];
const read = path => readFileSync(resolve('dist', path), 'utf8');
for (const route of routes) {
  assert.equal(existsSync(resolve('dist', route, 'index.html')), drafts, route);
  assert.equal(existsSync(resolve('dist', 'og', `${route}.png`)), drafts, `OG ${route}`);
  const listing = read(`${route.split('/')[0]}/index.html`);
  assert.equal(listing.includes(`href="/${route}"`), drafts, `listing ${route}`);
  assert.ok(!read('blog/rss.xml').includes(route), `RSS excludes ${route}`);
  if (!drafts) continue;
  const html = read(`${route}/index.html`), $ = load(html);
  assert.equal($('meta[name=robots]').attr('content'), 'noindex,nofollow');
  assert.equal($('h1').length, 1);
  assert.equal($('.katex-error').length, 0);
  assert.ok($('.draft-note').text().includes('Not published'));
  assert.ok(!/C:[\\/]|Users[\\/]|BEGIN .*PRIVATE KEY|ghp_[A-Za-z0-9]{20}/i.test(html), 'private strings');
  for (const el of $('main a[href^="/"], article a[href^="/"], article img[src^="/"]').toArray()) {
    const url = $(el).attr('href') || $(el).attr('src');
    const path = url.split('#')[0].split('?')[0].slice(1);
    assert.ok(existsSync(resolve('dist', path)) || existsSync(resolve('dist', path, 'index.html')), `local target ${url}`);
  }
  if (route.includes('rare-events')) {
    assert.equal($('.katex').length, 2, 'both formulas render');
    assert.ok($('.code-language').text().includes('Python'), 'actual MDX language detected');
    assert.ok($('code span[style*="--shiki-dark"]').length > 5, 'dual-theme syntax tokens');
  }
}
console.log(`Personal content checks passed (${drafts ? 'review' : 'production'} build).`);
