export const probabilities = [.1,.22,.38,.46,.57,.69,.82,.93];
export const margin = n => 1.96 / Math.sqrt(n);
export const regionValues = key => ({ all: [30,40,20], north: [12,18,10], south: [18,22,10] })[key];
export function mountPracticeCards(doc) {
  const flip = (card, open) => {
    card.dataset.flipped = String(open);
    const front = card.querySelector('.practice-front');
    const back = card.querySelector('.practice-back');
    front.inert = open; back.inert = !open;
    front.setAttribute('aria-hidden', String(open)); back.setAttribute('aria-hidden', String(!open));
    card.querySelector('[data-flip-open]').setAttribute('aria-expanded', String(open));
    const focusTarget = card.querySelector(open ? '[data-flip-close]' : '[data-flip-open]');
    focusTarget.focus({ preventScroll: true });
    focusTarget.scrollIntoView?.({ block: 'nearest', behavior: 'instant' });
  };
  doc.addEventListener('click', event => {
    const target = event.target;
    const card = target?.closest?.('.practice-flip');
    if (!card) return;
    if (target.closest('[data-flip-close]')) return flip(card, false);
    if (target.closest('[data-flip-open]') || (target.closest('.practice-front') && !target.closest('a,button,input,select'))) return flip(card, true);
    const output = card.querySelector('output');
    if (target.closest('[data-demo-run]')) {
      const count = Number(card.dataset.runs || 0) + 1; card.dataset.runs = String(count);
      output.textContent = `Run ${count} · 12 + 18 + 10 + 20 = 60`;
    }
    const answer = target.closest('[data-demo-answer]');
    if (answer) output.textContent = answer.dataset.demoAnswer === 'design' ? 'Yes. Start with study design, independence and distributional assumptions before choosing a method.' : 'Try again. A small p-value does not justify a method; study design and assumptions come first.';
  });
  doc.addEventListener('input', event => {
    const input = event.target;
    const card = input?.closest?.('.practice-flip');
    if (!card || !input.matches('[data-demo-input]')) return;
    const output = card.querySelector('output');
    const kind = Number(card.dataset.practiceKind);
    if (kind === 0) {
      const n = Number(input.value), m = margin(n), half = m * 150;
      card.querySelector('[data-interval]').setAttribute('d',`M${150-half} 50H${150+half}M${150-half} 40V60M${150+half} 40V60`);
      output.textContent = `n = ${n} · margin ±${m.toFixed(2)}`;
    } else if (kind === 1) {
      const threshold = Number(input.value)/100;
      card.querySelectorAll('[data-probability]').forEach(dot => dot.dataset.positive = String(Number(dot.dataset.probability) >= threshold));
      output.textContent = `Threshold ${input.value}% · ${probabilities.filter(p=>p>=threshold).length} of 8 flagged`;
    } else if (kind === 2) {
      const values = regionValues(input.value);
      card.querySelectorAll('.demo-bars span').forEach((bar,i) => { bar.style.setProperty('--bar',`${values[i]/40*100}%`); bar.textContent = `${'ABC'[i]} · ${values[i]}`; });
      output.textContent = `${input.selectedOptions[0].textContent} · ${values.reduce((a,b)=>a+b,0)} illustrative units`;
    } else if (kind === 5) output.textContent = `${card.querySelectorAll('input:checked').length} of 3 review prompts checked`;
  });
}
