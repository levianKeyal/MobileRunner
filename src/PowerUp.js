// Shared flight path for all collectible power-ups.
export class PowerUp {
 constructor(type,x,groundY,scrollSpeed){
  this.type=type;
  this.size=24;
  this.x=x;
  this.speed=scrollSpeed*1.10;
  this.phase=Math.PI/2;
  this.period=3.2;
  this.y=groundY-this.size;
  this.update(0,groundY);
 }
 update(dt,groundY){
  this.x-=this.speed*dt;
  this.phase+=2*Math.PI*dt/this.period;
  // Normal jump height from Player physics: v0=680 px/s, g=1800 px/s².
  const jumpHeight=680*680/(2*1800);
  const playerSize=34;
  const top=groundY-playerSize-jumpHeight-10;
  const bottom=groundY-12;
  const center=(top+bottom)/2;
  const amplitude=(bottom-top)/2;
  this.y=center+amplitude*Math.sin(this.phase);
 }
 box(){return {x:this.x,y:this.y,width:this.size,height:this.size};}
 draw(ctx){
  const x=this.x,y=this.y;
  ctx.fillStyle='#fbbf24';ctx.fillRect(x,y,this.size,this.size);
  ctx.fillStyle='#fef3c7';ctx.fillRect(x+9,y+3,6,18);ctx.fillRect(x+3,y+9,18,6);
  ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.strokeRect(x,y,this.size,this.size);
 }
}
