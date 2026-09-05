import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from 'cheerio';
import { formatReadingHtml } from '../src/lib/reading.ts';

test('highlighting preserves escaped characters, indentation, blank lines and trailing newline', async () => {
  const input = 'if (x < 3) {\n  print("a & b")\n\n}\n';
  const source = load('<pre class="sourceCode r"><code></code></pre>', {}, false);
  source('code').text(input);
  const result = load(await formatReadingHtml(source.html()));
  assert.equal(result('pre code').text(), input);
  assert.equal(result('pre').attr('data-language'), 'r');
  assert.ok(result('[style*="--shiki-dark"]').length > 2);
  assert.equal(result('[data-copy-code]').length, 1);
});
test('output and unknown text remain unguessed; MDX language metadata is respected', async () => {
  const result = load(await formatReadingHtml('<div class="cell-output-stdout"><pre><code>Call:\nlm(y ~ x)</code></pre></div><pre><code>ambiguous words</code></pre><pre class="astro-code" data-language="python"><code>print(42)</code></pre>'));
  assert.equal(result('[data-code-kind="output"] .code-language').text(), 'Output');
  assert.deepEqual(result('pre').map((_, e) => result(e).attr('data-language')).get(), ['text', 'text', 'python']);
});
test('reader removes stack wrappers and stale controls while preserving source and panel labels', async () => {
  const result = load(await formatReadingHtml('<section id="title-slide"><h1>Title</h1><p>Author</p></section><section><section id="example"><h1>Example</h1><ul id="tabset-1"><li><a href="#panel">R</a></li></ul><div id="panel"><pre data-language="r"><code>x &lt;- 1</code><button title="Copy to Clipboard"></button></pre></div></section></section>', true));
  assert.equal(result('section section').length, 0);
  assert.equal(result('h1').length, 0);
  assert.equal(result('h2').text(), 'Example');
  assert.equal(result('.reader-panel-title').text(), 'R');
  assert.equal(result('code').text(), 'x <- 1');
  assert.equal(result('button').length, 1);
});
test('table scrolling retains data-driven cell colors and math is rendered statically', async () => {
  const result = load(await formatReadingHtml('<table><tr><td style="background-color:#762A83;color:#fff">8</td></tr></table><span class="math inline">\\(x^2\\)</span>'));
  assert.equal(result('.table-scroll').attr('tabindex'), '0');
  assert.equal(result('td').attr('style'), 'background-color:#762A83;color:#fff');
  assert.equal(result('.katex').length, 1);
  assert.equal(result('.katex-error').length, 0);
});
