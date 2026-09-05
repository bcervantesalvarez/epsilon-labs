// Resolve current DOM nodes on every event: Astro replaces them on navigation.
export function mountNavigation(win, doc) {
  let frame = 0;
  const update = () => {
    frame = 0;
    const button = doc.getElementById('scroll-top');
    if (button) button.hidden = win.scrollY <= Math.min(480, win.innerHeight * .65);
  };
  const schedule = () => {
    if (!frame) frame = win.requestAnimationFrame(update);
  };
  const initContents = () => {
    doc.querySelectorAll('.article-body:not(.deck-reader)').forEach(body => {
      if (body.parentElement?.closest('.article-body')) return;
      if (body.previousElementSibling?.matches('[data-article-contents]')) return;
      const headings = [...body.querySelectorAll('h2')].filter(h => h.textContent.trim());
      if (headings.length < 3) return;
      const details = doc.createElement('details');
      details.dataset.articleContents = '';
      details.className = 'article-contents max-w-prose mx-auto';
      const summary = doc.createElement('summary');
      summary.textContent = 'On this page';
      const nav = doc.createElement('nav');
      nav.setAttribute('aria-label', 'Article sections');
      const list = doc.createElement('ul');
      headings.forEach((heading, index) => {
        if (!heading.id) {
          let id = `article-section-${index + 1}`;
          while (doc.getElementById(id)) id += '-section';
          heading.id = id;
        }
        const item = doc.createElement('li');
        const link = doc.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent.trim();
        link.dataset.sectionJump = heading.id;
        item.append(link); list.append(item);
      });
      nav.append(list); details.append(summary, nav); body.before(details);
    });
  };
  const onLoad = () => { update(); initContents(); };
  const click = event => {
    const target = event.target;
    if (target?.closest?.('#scroll-top, [data-back-top]')) {
      event.preventDefault();
      doc.getElementById('main')?.focus({ preventScroll: true });
      win.scrollTo({ top: 0, behavior: win.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    } else if (target?.closest?.('.skip-link[href="#main"]')) {
      doc.getElementById('main')?.focus({ preventScroll: true });
    } else {
      const link = target?.closest?.('[data-section-jump]');
      const heading = link && doc.getElementById(link.dataset.sectionJump);
      if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    }
  };
  win.addEventListener('scroll', schedule, { passive: true });
  win.addEventListener('resize', schedule, { passive: true });
  doc.addEventListener('astro:page-load', onLoad);
  doc.addEventListener('click', click);
  onLoad();
  return () => {
    win.cancelAnimationFrame(frame);
    win.removeEventListener('scroll', schedule);
    win.removeEventListener('resize', schedule);
    doc.removeEventListener('astro:page-load', onLoad);
    doc.removeEventListener('click', click);
  };
}
