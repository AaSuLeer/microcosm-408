import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog,defaults,frame,total} from '../src/labs.js';
import {lesson,renderProse} from '../src/prose.js';
import {schematicMarkup} from '../src/textbook.js';
import {flowchartMarkup} from '../src/flowchart.js';
test('every lesson and diagram renders through every teaching step',()=>{
 const p=defaults();
 for(const page of Object.keys(catalog)) for(let i=0;i<total(page,p);i++) {
  const f=frame(page,i,p);
  const prose=lesson(page,p,f);
  assert.match(prose,/class="katex/); assert.doesNotMatch(prose,/katex-error/);
  assert.doesNotMatch(JSON.stringify(schematicMarkup(page,p,f)),/NaN|undefined/);
  assert.doesNotMatch(flowchartMarkup(page,p,f,i),/NaN|undefined/);
 }
});
test('prose supports Markdown and math without executing supplied HTML',()=>{
 const html=renderProse('### 标题\n\n**步骤** $S_i=A_i$\n\n<script>alert(1)</script>\n\n[危险](javascript:alert)');
 assert.match(html,/<h3>/);assert.match(html,/<strong>步骤/);assert.match(html,/katex/);
 assert.doesNotMatch(html,/<script>|href="javascript:/);
});
test('parameter modes and boundary inputs render every phase',()=>{
 const cases=[];const add=(page,p)=>cases.push([page,{...defaults(),...p}]);
 for(const isaMode of ['immediate','direct','indirect','register','registerIndirect','base','index','relative'])for(const displacement of [0,127,128,255])add('isa',{isaMode,displacement,base:255,pcNext:255});
 for(const isaTopic of ['call','branch'])add('isa',{isaTopic});
 for(const controlOp of ['ADD','LOAD'])for(const controller of ['micro','hardwired'])add('control',{controlOp,controller});
 for(const pipelineCase of ['load','alu','branch'])for(const forwarding of ['on','off'])add('pipeline',{pipelineCase,forwarding});
 for(const interruptEnable of [0,1])for(const interruptMask of [0,1])add('interrupts',{interruptEnable,interruptMask});
 for(const mode of ['bit','word','both'])for(const address of [0,3])add('memory',{mode,address});
 for(const ioMode of ['dma','poll','interrupt'])add('io',{ioMode});
 for(const va of [0,255,256,767,768,1023])add('paging',{va});
 for(const track of [0,7])for(const surface of [0,5])for(const sector of [0,11])add('disk',{track,surface,sector});
 for(const d of [0,1])for(const enable of [0,1])add('flipflop',{d,enable});
 for(const page of ['adder','multiplier','divider'])for(const [a,b] of [[0,1],[1,255],[127,1],[128,255],[255,255]])add(page,{a,b});
 for(const [page,p] of cases)for(let i=0;i<total(page,p);i++){
  const f=frame(page,i,p);
  assert.doesNotMatch(schematicMarkup(page,p,f),/NaN|undefined/);
  assert.doesNotMatch(flowchartMarkup(page,p,f,i),/NaN|undefined/);
  assert.doesNotMatch(lesson(page,p,f),/katex-error|undefined/);
 }
});
