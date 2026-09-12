import {Box3,Vector3} from 'three';
// Logical bus nodes have no mesh; use a small port instead of empty-box infinities.
export function connectionExtents(group){
 const box=new Box3().setFromObject(group);
 if(box.isEmpty())return {x:.12,z:.12};
 const size=box.getSize(new Vector3());
 return {x:Math.max(.12,Math.min(1.3,size.x/2)),z:Math.max(.12,Math.min(1.5,size.z/2))};
}
