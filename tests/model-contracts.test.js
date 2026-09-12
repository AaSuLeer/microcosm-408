import assert from 'node:assert/strict';
import {modelContract,contractMarkup} from '../src/model-contracts.js';
import {catalog,defaults,memoryLayout} from '../src/labs.js';
for(const page of Object.keys(catalog)){const m=modelContract(page,defaults());assert.equal(Object.keys(m).length,6);assert.ok(Object.values(m).every(s=>typeof s==='string'&&s.length>0));assert.doesNotMatch(contractMarkup(page,defaults()),/undefined|katex-error/);}
for(const mode of ['word','bit','both']){const p={...defaults(),mode},l=memoryLayout(mode);assert.ok(modelContract('memory',p).width.includes(`${l.words}字×${l.width}位`));}
assert.match(modelContract('pipeline',{...defaults(),forwarding:'off'}).algorithm,/关闭/);
assert.match(modelContract('isa',{...defaults(),isaTopic:'call'}).algorithm,/参数不改变/);
assert.match(contractMarkup('divider',defaults()),/<table>/);
