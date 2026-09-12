import test from 'node:test';
import assert from 'node:assert/strict';
import {defaults,frame} from '../src/labs.js';
import {addressResult,isaTrace,controlTrace,pipelineTrace,interruptTrace} from '../src/advanced.js';
import {arithmeticMotion} from '../src/arithmetic-view.js';
test('addressing distinguishes pointers, register contents and sign extension',()=>{
 const p=defaults();assert.equal(addressResult({...p,isaMode:'base'}).ea,76);
 assert.equal(addressResult({...p,isaMode:'relative',displacement:254}).ea,32);
 assert.equal(addressResult({...p,isaMode:'direct'}).value,43);
 const indirect=addressResult({...p,isaMode:'indirect'});assert.equal(indirect.ea,43);assert.equal(indirect.value,136);
 assert.equal(addressResult({...p,isaMode:'immediate'}).ea,null);
 assert.equal(addressResult({...p,isaMode:'register'}).value,64);
 const call=isaTrace({...p,isaTopic:'call'});assert.equal(call.at(-1).values.pc,34);assert.equal(call.at(-1).values.sp,240);
});
test('microoperations write result only at writeback',()=>{
 for(const [controlOp,result] of [['ADD',12],['LOAD',37]]){const trace=controlTrace({...defaults(),controlOp});assert.equal(trace[5].values.R0,7);assert.equal(trace[6].values.R0,result);assert.equal(trace.at(-1).values.next,0);}
});
test('pipeline timing preserves dependencies with and without forwarding',()=>{
 const p=defaults();const alu=pipelineTrace({...p,pipelineCase:'alu'}),load=pipelineTrace(p),no=pipelineTrace({...p,forwarding:'off'});
 assert.equal(alu.length,7);assert.equal(load.length,8);assert.equal(no.length,11);
 assert.equal(load[3].occupants[1].stage,'ID / 等待');assert.equal(load[4].occupants[1].stage,'EX');
 const branch=pipelineTrace({...p,pipelineCase:'branch'});assert.equal(branch[3].occupants.filter(o=>o.stage==='FLUSH').length,2);assert.equal(branch[3].occupants[3].stage,'IF');
});
test('masked interrupt does not enter ISR; IRET restores saved state',()=>{
 const p=defaults();for(const q of [{...p,interruptMask:1},{...p,interruptEnable:0}]){const t=interruptTrace(q);assert.ok(t.every(f=>f.values.PC===34&&f.values.SP===240));}
 const t=interruptTrace(p);assert.equal(t[5].values.SP,234);assert.equal(t[3].values.IF,0);assert.equal(t.at(-1).values.SP,240);assert.equal(t.at(-1).values.PC,34);assert.equal(t.at(-1).values.IF,1);
});
test('animated bit rows agree with real arithmetic before and after transitions',()=>{
 for(const [a,b] of [[7,5],[255,255],[0,1],[128,3]])for(const page of ['multiplier','divider']){const p={...defaults(),a,b};for(let i=0;i<24;i++){const f=frame(page,i,p),m=arithmeticMotion(page,p,f);for(const r of m.rows)assert.equal(r.after,f.values[r.id]);if(page==='multiplier'&&f.phase===2){assert.equal(m.rows[0].after,m.rows[0].before*2);assert.equal(m.rows[1].after,m.rows[1].before>>1);}if(page==='divider'&&f.phase===0){const r=m.rows[2];assert.equal(r.after,r.before*2+r.fill);}}}
});

const {orthogonalPosition}=await import('../src/arithmetic-view.js');
for(let k=0;k<=100;k++){
 const p=orthogonalPosition(300,166,505,326,326,k/100);
 assert.ok(p.x===300||p.y===326,'Moving operand must follow the drawn orthogonal path');
}
assert.deepEqual(orthogonalPosition(505,468,660,670,484,1),{x:660,y:670});
const {polylinePosition}=await import('../src/arithmetic-view.js');
const incomingRoute=[[318,166],[318,224],[940,224],[940,326],[505,326]];
for(let i=0;i<=100;i++){
 const p=polylinePosition(incomingRoute,i/100);
 assert.ok(!(p.x>=300&&p.x<=588&&p.y>=260&&p.y<=302),'Dividend bit must not travel through divisor register');
}
