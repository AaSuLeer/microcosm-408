import assert from 'node:assert/strict';
import {knowledgeTree,knowledgeTreeLayout,knowledgeMapMarkup} from '../src/knowledge-map.js';
const keys=[];function collect(ns){for(const n of ns){keys.push(n.key);collect(n.children);}}collect(knowledgeTree);
assert.equal(new Set(keys).size,keys.length);
const closed=knowledgeTreeLayout(new Set());
assert.equal(closed.nodes.length,7);
const full=knowledgeTreeLayout(new Set(keys));
assert.ok(Math.max(...full.nodes.map(n=>n.depth))>=6);
assert.ok(full.nodes.length>250);
for(const side of [-1,1])for(let depth=1;depth<10;depth++){
 const ns=full.nodes.filter(n=>n.side===side&&n.depth===depth).sort((a,b)=>a.y-b.y);
 for(let i=1;i<ns.length;i++)assert.ok(ns[i].y-ns[i].own/2>=ns[i-1].y+ns[i-1].own/2,'Node boxes must not overlap');
}
for(const e of full.edges)assert.equal(e.to.depth,e.from.depth+1);
const part=knowledgeTreeLayout(new Set(['1','1-1','1-1-0']));
assert.ok(part.nodes.some(n=>n.key==='1-1-0-0'));
assert.ok(!knowledgeTreeLayout(new Set(['1'])).nodes.some(n=>n.key==='1-1-0-0'));
const svg=knowledgeMapMarkup(new Set(keys));
assert.ok(svg.includes('data-link="adder"')&&svg.includes('data-link="pipeline"'));
assert.ok(!svg.includes('理解与方法'));
assert.ok(svg.includes('tree-node-line')&&svg.includes('★ 重点'));
assert.ok(svg.includes('marker-priority')&&svg.includes('marker-formula')&&svg.includes('marker-pitfall'));
assert.equal(knowledgeTree[4].children.find(n=>n.title==='指令流水线').tag,'重点');
