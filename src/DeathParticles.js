// Fragments use fixed-step-ish integration and settle on the frozen ground.
export class DeathParticles {
 constructor(x,y,size,groundY){
  this.groundY=groundY;
  this.age=0;
  this.fragments=Array.from({length:22},(_,i)=>{
   const angle=Math.random()*Math.PI*2;
   const speed=110+Math.random()*260;
   const s=4+Math.random()*6;
   return {x:x+size*(.12+Math.random()*.76),y:y+size*(.12+Math.random()*.76),
    vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-90,
    size:s,angle:Math.random()*Math.PI*2,spin:(Math.random()-.5)*11,
    color:i%5===0?'#bbf7d0':i%4===0?'#86efac':'#22c55e',rest:false};
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
  return this.fragments.every(p=>p.rest);
 }
 draw(ctx){
  for(const p of this.fragments){
   ctx.save();ctx.translate(p.x+p.size/2,p.y+p.size/2);ctx.rotate(p.angle);
   ctx.fillStyle=p.color;ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);ctx.restore();
  }
 }
}
