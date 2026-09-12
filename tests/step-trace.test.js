import assert from 'node:assert/strict';
import {defaults,frame,catalog,total} from '../src/labs.js';
import {stepTrace,resolveTraceKey} from '../src/step-trace.js';
import {traceMarkup} from '../src/step-trace-view.js';
const p=defaults();
for(const page of Object.keys(catalog))for(let i=0;i<total(page,p);i++){
 const f=frame(page,i,p),prev=i?frame(page,i-1,p):null,t=stepTrace(page,p,f,prev);
 assert.ok(t.rows.length>0);assert.doesNotMatch(traceMarkup(t,t.rows[0].key),/undefined|NaN/);
}
const f=frame('divider',2,p),t=stepTrace('divider',p,f,frame('divider',1,p));
assert.equal(t.rows.find(r=>r.key==='accumulator').after,f.values.accumulator);
const adder=stepTrace('adder',p,frame('adder',0,p),null);
assert.equal(resolveTraceKey('result',adder),'sum');
assert.equal(adder.rows.find(r=>r.key==='sum').before,0);
assert.match(traceMarkup(adder,'result'),/操作前/);

const trial=stepTrace('divider',p,frame('divider',1,p),frame('divider',0,p));
assert.equal(trial.rows.find(r=>r.key==='accumulator').after,-p.b);
assert.equal(t.rows.find(r=>r.key==='accumulator').before,-p.b);
assert.equal(t.rows.find(r=>r.key==='accumulator').after,0);
assert.match(trial.destination,/9位试减/);
assert.match(t.destination,/恢复余数/);
