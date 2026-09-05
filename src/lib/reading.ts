import { load } from 'cheerio';
import { createHighlighter } from 'shiki';
import katex from 'katex';

const languages = ['r', 'python', 'bash', 'yaml', 'julia', 'javascript', 'typescript', 'sql', 'html', 'css', 'json', 'markdown'];
const highlighter = createHighlighter({ themes: ['github-light', 'github-dark'], langs: languages });
const aliases: Record<string, string> = { js: 'javascript', ts: 'typescript', sh: 'bash', shell: 'bash', yml: 'yaml', 'shinylive-python': 'python' };
const labels: Record<string, string> = { r: 'R', python: 'Python', bash: 'Shell', yaml: 'YAML', julia: 'Julia', javascript: 'JavaScript', typescript: 'TypeScript', sql: 'SQL', html: 'HTML', css: 'CSS', json: 'JSON', markdown: 'Markdown', text: 'Plain text' };

/** Render imported and MDX content once, at build time. Never execute source code. */
export async function formatReadingHtml(html: string, reader = false): Promise<string> {
  const $ = load(html, { xml: false }, false);
  const syntax = await highlighter;
  // Imported bodies already sit inside the page's article landmark.
  $('article.article-body').each((_, el) => { $(el).replaceWith($(el).contents()); });
  $('.anchorjs-link, .header-anchor, .code-copy-button, button[title="Copy to Clipboard"]').remove();
  $('a').filter((_, el) => !$(el).attr('href') && !$(el).text().trim()).remove();
  if (!reader) {
    const cover = $('img').first();
    if (['/images/amazonlogo.jpeg', '/images/webr.png', '/images/apple.jpeg', '/images/pokemon.jpeg', '/images/githublogo.png'].includes(cover.attr('src') || '')) cover.addClass('brand-editorial-cover');
  }

  if (reader) {
    // The slide export retained empty drawing tags after stripping coordinates.
    // These contain no visible figure data and otherwise reserve 300x150 boxes.
    $('svg').filter((_, el) => !$(el).text().trim() && !$(el).find('[d],[points],[x],[x1],[width],[viewBox],[href]').length && !$(el).attr('viewBox')).remove();
    // Reveal vertical stacks are structural containers, not additional slides.
    $('section').get().reverse().forEach(el => {
      if ($(el).children('section').length) $(el).replaceWith($(el).contents());
    });
    $('section').each((i, el) => {
      const section = $(el).addClass('reader-section');
      const headings = section.find('h1,h2,h3,h4').toArray();
      headings.forEach((h, index) => { h.tagName = index === 0 ? 'h2' : 'h3'; });
      if (i === 0) {
        section.addClass('reader-byline');
        section.find('h2').first().remove(); // The page title retains this exact title.
      } else {
        section.prepend(`<p class="reader-slide-number">Slide ${i + 1}</p>`);
        if (headings.length && section.text().trim() === `Slide ${i + 1}${$(headings[0]).text().trim()}`) section.addClass('reader-chapter');
      }
    });
    // Retain tab panel contents as a linear sequence, with their original labels.
    $('ul[id^="tabset-"]').each((_, el) => {
      $(el).find('a').each((_, a) => {
        const target = $(a).attr('href');
        if (target?.startsWith('#')) $(target).prepend($('<h3 class="reader-panel-title"></h3>').text($(a).text()));
      });
      $(el).remove();
    });
    $('br').each((_, el) => { if (!$(el).next().length && !$(el).nextAll().text().trim()) $(el).remove(); });
  }

  let codeIndex = 0;
  for (const pre of $('pre').toArray()) {
    const block = $(pre);
    const code = block.children('code').first();
    const text = code.length ? code.text() : block.text();
    const output = block.attr('data-code-kind') === 'output' || block.closest('.cell-output-stdout,.cell-output-stderr,.cell-output-error').length > 0;
    const classes = `${block.attr('data-language') || ''} ${code.attr('data-language') || ''} ${block.attr('class') || ''} ${code.attr('class') || ''}`.split(/\s+/).map(c => c.replace(/^language-/, ''));
    const hint = classes.map(c => aliases[c] || c.toLowerCase()).find(c => languages.includes(c));
    const language = output ? 'text' : hint || 'text';
    const rendered = load(syntax.codeToHtml(text, { lang: language, themes: { light: 'github-light', dark: 'github-dark' }, defaultColor: false }), {}, false);
    // Keep every emitted token above 4.5:1 on its light/dark code surface.
    rendered('[style]').each((_, el) => { rendered(el).attr('style', rendered(el).attr('style')!
      .replace(/--shiki-dark:#6a737d/gi, '--shiki-dark:#9da7b3')
      .replace(/--shiki-light:#e36209/gi, '--shiki-light:#a04a00')); });
    const highlighted = rendered('pre').addClass('reading-code').attr({ tabindex: '0', role: 'region', 'aria-label': `${output ? 'Output' : labels[language]} block, scroll to read`, 'data-language': language });
    // Existing fragment links to code lines remain valid after tokenization.
    if (block.attr('id')) highlighted.attr('id', block.attr('id')!);
    const lineIds = code.children('span[id]').toArray().map(el => $(el).attr('id'));
    rendered('.line').each((i, line) => { if (lineIds[i]) rendered(line).attr('id', lineIds[i]!); });
    if (rendered('code').text() !== text) throw new Error('Highlighting changed source text');
    const frame = $('<div class="code-frame"></div>').attr({ 'data-code-kind': output ? 'output' : 'source', id: `reading-code-block-${++codeIndex}` });
    const toolbar = $('<div class="code-toolbar"></div>');
    toolbar.append($('<span class="code-language"></span>').text(output ? 'Output' : labels[language]));
    toolbar.append($('<span class="code-lines" aria-hidden="true"></span>').text(`${text.split('\n').length} lines`));
    toolbar.append('<button type="button" data-copy-code>Copy</button><span class="sr-only" role="status" aria-live="polite" data-copy-status></span>');
    frame.append(toolbar).append(rendered.html());
    block.replaceWith(frame);
  }

  $('table').each((i, table) => {
    const t = $(table);
    if (t.closest('.table-scroll').length) return;
    const caption = t.find('caption,.gt_title').first().text().trim();
    const wrapper = $('<div class="table-scroll" tabindex="0" role="region"></div>').attr({ 'aria-label': caption || `Data table ${i + 1}, scroll horizontally`, id: `reading-table-${i + 1}` });
    t.wrap(wrapper);
    t.find('thead th').each((_, th) => { if (!$(th).attr('scope') && !$(th).attr('colspan')) $(th).attr('scope', 'col'); });
  });
  $('.math:not([data-katex-rendered])').each((_, el) => {
    const node = $(el);
    const tex = node.text().trim().replace(/^\\[([]|\\[)\]]$/g, '').replace(/^\$\$|\$\$$/g, '').replace(/(?<!\\)%/g, '\\%');
    node.html(katex.renderToString(tex, { throwOnError: false, displayMode: node.hasClass('display'), strict: 'ignore' })).attr('data-katex-rendered', '');
  });
  // Normalize heading levels without changing their wording or fragment targets.
  if (!reader) $('h1').each((_, el) => { el.tagName = 'h2'; });
  return $.html();
}
