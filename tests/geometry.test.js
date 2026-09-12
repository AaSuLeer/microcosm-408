import assert from 'node:assert/strict';
import {Group,Mesh,BoxGeometry,MeshBasicMaterial} from 'three';
import {connectionExtents} from '../src/geometry.js';
import {HardwareScene} from '../src/scene3d.js';
const bus=new Group();bus.position.set(2,.1,-.1);
const chip=new Group();chip.add(new Mesh(new BoxGeometry(2,1,2),new MeshBasicMaterial()));chip.position.set(-5,.1,-3);
assert.deepEqual(connectionExtents(bus),{x:.12,z:.12});
for(const [a,b] of [[bus,chip],[chip,bus],[bus,bus]]){
 const {path,points}=HardwareScene.prototype.tracePath(a,b);
 assert.ok(points.every(v=>[v.x,v.y,v.z].every(Number.isFinite)));
 for(let i=0;i<=100;i++){const p=path.getPoint(i/100),t=path.getTangent(i/100);assert.ok(p&&[p.x,p.y,p.z,t.x,t.y,t.z].every(Number.isFinite));}
}
