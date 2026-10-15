// Shared movement and drawing for collectible power-ups.
export class PowerUp {
 constructor(type,x,groundY,scrollSpeed){
  this.type=type;
  this.size=24;
  this.x=x;
  this.y=groundY-this.size-18;
  this.verticalSpeed=-235;
  this.speed=scrollSpeed*1.2;
 }
 update(dt,groundY){
  this.x-=this.speed*dt;
  const top=60;
  const bottom=Math.max(top+this.size,groundY-this.size-8);
  this.y+=this.verticalSpeed*dt;
  if(this.y<top){this.y=top+(top-this.y);this.verticalSpeed=Math.abs(this.verticalSpeed);}
  if(this.y>bottom){this.y=bottom-(this.y-bottom);this.verticalSpeed=-Math.abs(this.verticalSpeed);}
  this.y=Math.max(top,Math.min(bottom,this.y));
 }
 box(){return {x:this.x,y:this.y,width:this.size,height:this.size};}
 draw(ctx){
  const x=this.x,y=this.y;
  ctx.fillStyle='#fbbf24';ctx.fillRect(x,y,this.size,this.size);
  ctx.fillStyle='#fef3c7';ctx.fillRect(x+9,y+3,6,18);ctx.fillRect(x+3,y+9,18,6);
  ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.strokeRect(x,y,this.size,this.size);
 }
}
