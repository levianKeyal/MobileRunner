import { Enemy } from './Enemy.js';
// Flying enemies share the same damage, projectile and fragment interfaces as ground enemies.
export class FlyingEnemy extends Enemy {
 constructor(worldX,groundY,type='flyA'){
  super(worldX,0,type,32);
  this.health=type==='flyB'?2:1;
  this.shooter=type==='flyB';
  this.baseY=groundY-140-Math.random()*45;
  this.y=this.baseY;
  this.phase=Math.random()*Math.PI*2;
  this.time=0;
  this.direction=1;
  this.pause=0;
  this.flightSpeed=type==='flyA'?158:0;
  this.groundY=groundY;
  this.flying=true;
 }
 update(dt,platforms=[]){
  this.time+=dt;
  if(this.type==='flyA'){
   this.worldX-=this.flightSpeed*dt;
   this.phase+=dt*2.1;
   const target=this.baseY+34*Math.sin(this.phase);
   let safeY=target;
   for(const p of platforms){
    if(!p.solid||this.worldX+this.size<p.x-26||this.worldX>p.x+p.width+18)continue;
    safeY=Math.min(safeY,this.groundY-p.offset-this.size-12);
   }
   // Rise promptly before the wall; descend smoothly after passing it.
   this.y+=Math.max(-420*dt,Math.min(180*dt,safeY-this.y));
  }else{
   if(this.pause>0){this.pause-=dt;}
   else{
    const upper=this.groundY-255,lower=this.groundY-65;
    this.y+=this.direction*105*dt;
    if(this.y<=upper){this.y=upper;this.direction=1;this.pause=1.2;}
    if(this.y>=lower){this.y=lower;this.direction=-1;this.pause=1.2;}
   }
  }
  return false;
 }
 box(x){return {x,y:this.y,width:this.size,height:this.size};}
 draw(ctx,x){
  const y=this.y;
  ctx.fillStyle=this.type==='flyB'?'#38bdf8':'#ef4444';
  ctx.fillRect(x,y,this.size,this.size);
  ctx.strokeStyle=this.type==='flyB'?'#bae6fd':'#fecaca';
  ctx.lineWidth=2;ctx.strokeRect(x,y,this.size,this.size);
  ctx.fillStyle='#0f172a';ctx.fillRect(x+7,y+11,5,5);ctx.fillRect(x+20,y+11,5,5);
  // Animated-looking wings distinguish both flyers from ordinary enemies.
  ctx.fillStyle=this.type==='flyB'?'#7dd3fc':'#fca5a5';
  const flap=Math.sin(this.time*13)*5;
  ctx.beginPath();ctx.moveTo(x+3,y+9);ctx.lineTo(x-13,y-7+flap);ctx.lineTo(x-8,y+18);ctx.fill();
  ctx.beginPath();ctx.moveTo(x+this.size-3,y+9);ctx.lineTo(x+this.size+13,y-7+flap);ctx.lineTo(x+this.size+8,y+18);ctx.fill();
  if(this.type==='flyB'){ctx.fillStyle='#475569';ctx.fillRect(x-8,y+17,9,5);}
 }
}