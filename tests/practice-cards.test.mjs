import { test } from 'node:test';
import assert from 'node:assert/strict';
import { margin, probabilities, regionValues, mountPracticeCards } from '../src/lib/practice-cards.js';
test('illustrative interval follows inverse square-root scaling', () => {
  assert.equal(margin(32)/margin(128), 2);
});
test('synthetic regional totals reconcile and increasing threshold reduces flags', () => {
  assert.deepEqual(regionValues('north').map((v,i)=>v+regionValues('south')[i]),regionValues('all'));
  assert.equal(probabilities.filter(p=>p>=.5).length,4);
  assert.equal(probabilities.filter(p=>p>=.9).length,1);
});
test('flip moves focus and removes inactive face from interaction on a newly swapped card', () => {
  const handlers={}; mountPracticeCards({addEventListener(type,fn){handlers[type]=fn;}});
  const node=()=>({attrs:{},focused:false,inert:false,setAttribute(k,v){this.attrs[k]=v;},focus(){this.focused=true;}});
  const front=node(),back=node(),open=node(),close=node();
  const card={dataset:{},querySelector:s=>({'.practice-front':front,'.practice-back':back,'[data-flip-open]':open,'[data-flip-close]':close})[s]};
  const click=selector=>handlers.click({target:{closest:s=>s==='.practice-flip'?card:s===selector?{}:null}});
  click('[data-flip-open]'); assert.equal(front.inert,true);assert.equal(back.inert,false);assert.equal(close.focused,true);assert.equal(open.attrs['aria-expanded'],'true');
  click('[data-flip-close]'); assert.equal(front.inert,false);assert.equal(back.inert,true);assert.equal(open.focused,true);assert.equal(open.attrs['aria-expanded'],'false');
});
