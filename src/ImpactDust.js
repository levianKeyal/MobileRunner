// Small ground-impact dust burst, drawn as lightweight Canvas squares.
export class ImpactDust {
 constructor(worldX,y){
  this.groundY=y;
  this.particles=Array.from({length:12},(_,i)=>({
   worldX:worldX+(Math.random()-.5)*22,y:y-3,
   vx:(Math.random()-.5)*155,vy:-35-Math.random()*125,
   size:2+Math.random()*5,life:.35+Math.random()*.35,
   maxLife:0,color:i%3===0?'#cbd5e1':i%2===0?'#94a3b8':'#64748b'
  }));
  for(const p of this.particles)p.maxLife=p.life;
 }
 update(dt){
  for(const p of this.particles){
   p.life=Math.max(0,p.life-dt);
   p.worldX+=p.vx*dt;p.y+=p.vy*dt;p.vy+=500*dt;
   if(p.y>this.groundY-p.size){p.y=this.groundY-p.size;p.vy=0;p.vx*=.75;}
  }
  return this.particles.every(p=>p.life<=0);
 }
 draw(ctx,distance){
  for(const p of this.particles){
   if(p.life<=0)continue;
   ctx.globalAlpha=p.life/p.maxLife;
   ctx.fillStyle=p.color;ctx.fillRect(p.worldX-distance,p.y,p.size,p.size);
  }
  ctx.globalAlpha=1;
 }
}
