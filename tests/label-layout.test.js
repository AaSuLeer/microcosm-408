import test from 'node:test';
import assert from 'node:assert/strict';
import {placeLabels} from '../src/label-layout.js';
test('crowded callouts remain separated and inside the viewport',()=>{
 for(const width of [360,800,1200]){
 const items=Array.from({length:12},(_,id)=>({id,ax:width/2,ay:240,width:150,height:40,active:id===11}));
 const placed=placeLabels(items,width,550);
 assert.equal(placed[0].id,11);
 for(const a of placed){assert.ok(a.x>=0&&a.x+a.width<=width&&a.y>=0&&a.y+a.height<=550);for(const b of placed)if(a!==b)assert.ok(a.x+a.width<=b.x||b.x+b.width<=a.x||a.y+a.height<=b.y||b.y+b.height<=a.y);}
 }
});
