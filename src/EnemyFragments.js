// World-space fragments remain on the ground until the camera has passed them.
export class EnemyFragments {
 constructor(enemy,groundY){
  this.groundY=groundY-enemy.surfaceOffset;
  this.worldX=enemy.worldX;
  this.size=enemy.size;
  this.age=0;
  const base=enemy.health>1?'#38bdf8':'#ef4444';
  const accents=enemy.type==='burst'?['#b91c1c','#f87171']:enemy.type==='jumper'?['#2563eb','#93c5fd']:[base,'#ffffff'];
  const top=this.groundY-enemy.size-enemy.jumpOffset;
  this.fragments=Array.from({length:18},(_,i)=>{
   const angle=Math.random()*Math.PI*2;
   const speed=100+Math.random()*225;
   return {x:enemy.worldX+Math.random()*enemy.size,y:top+Math.random()*enemy.size,
    vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-75,
    size:3+Math.random()*5,angle:Math.random()*Math.PI*2,
    spin:(Math.random()-.5)*11,color:i%6===0?accents[i%accents.length]:i%5===0?'#ffffff':base,rest:false};
  });
 }
 update(dt){
  this.age+=dt;
  for(const p of this.fragments){
   if(p.rest)continue;
   p.vy+=1350*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.angle+=p.spin*dt;
   if(p.y+p.size>=this.groundY){
    p.y=this.groundY-p.size;
    if(Math.abs(p.vy)>75&&this.age<2.4){p.vy=-Math.abs(p.vy)*.24;p.vx*=.62;p.spin*=.55;}
    else{p.vy=0;p.vx=0;p.spin=0;p.rest=true;}
   }
  }
  if(this.age>=3.2)for(const p of this.fragments){p.y=Math.min(p.y,this.groundY-p.size);p.vx=0;p.vy=0;p.spin=0;p.rest=true;}
 }
 isOffscreen(cameraX){return this.fragments.every(p=>p.x+p.size<cameraX);}
 draw(ctx,cameraX){
  for(const p of this.fragments){
   ctx.save();ctx.translate(p.x-cameraX+p.size/2,p.y+p.size/2);ctx.rotate(p.angle);
   ctx.fillStyle=p.color;ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);ctx.restore();
  }
 }
}
