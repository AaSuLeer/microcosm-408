// Screen-space packing keeps callouts readable as the camera moves.
export function placeLabels(items,width,height){
 const placed=[];const gap=10,pad=14;
 for(const item of [...items].sort((a,b)=>Number(b.active)-Number(a.active))){
  const w=Math.min(item.width,width-pad*2),h=item.height;
  if(w<=0||h>height-pad*2)continue;
  const candidates=[];
  const add=(x,y)=>{x=Math.max(pad,Math.min(width-pad-w,x));y=Math.max(pad,Math.min(height-pad-h,y));candidates.push({x,y,score:(x+w/2-item.ax)**2+(y+h/2-item.ay)**2});};
  add(item.ax-w/2,item.ay-h-20);
  for(let y=pad;y<=height-pad-h;y+=h+gap)for(let x=pad;x<=width-pad-w;x+=Math.max(24,w/3))add(x,y);
  candidates.sort((a,b)=>a.score-b.score);
  const spot=candidates.find(c=>placed.every(p=>c.x+w+gap<=p.x||p.x+p.width+gap<=c.x||c.y+h+gap<=p.y||p.y+p.height+gap<=c.y));
  if(spot)placed.push({...item,...spot,width:w,height:h});
 }
 return placed;
}
