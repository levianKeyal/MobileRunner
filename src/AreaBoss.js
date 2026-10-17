// Temporary boss prototype: fixed size, no attacks or contact damage.
const COLORS=Array.from({length:47},(_,i)=>`hsl(${(25+i*137.508)%360} 80% ${42+(i%5)*7}%)`).concat(['#22c55e','#2563eb','#ef4444']);
export class AreaBoss {
 constructor(worldX,groundY,playerSize){
  this.worldX=worldX;this.size=playerSize*4;this.y=groundY-this.size;
  this.health=50;this.maxHealth=50;this.flying=false;this.isBoss=true;
 }
 box(x){return {x,y:this.y,width:this.size,height:this.size};}
 hit(){this.health=Math.max(0,this.health-1);return this.health===0;}
 draw(ctx,x){
  const color=COLORS[Math.min(COLORS.length-1,50-this.health)];
  ctx.fillStyle=color;ctx.fillRect(x,this.y,this.size,this.size);
  ctx.strokeStyle='#f8fafc';ctx.lineWidth=4;ctx.strokeRect(x+2,this.y+2,this.size-4,this.size-4);
  ctx.fillStyle='#0f172a';const unit=this.size/8;
  ctx.fillRect(x+unit*2,this.y+unit*3,unit,unit);
  ctx.fillRect(x+unit*5,this.y+unit*3,unit,unit);
  ctx.fillRect(x+unit*3,this.y+unit*5,unit*2,unit*.5);
  ctx.fillStyle='#020617';ctx.fillRect(x,this.y-16,this.size,9);
  ctx.fillStyle='#fbbf24';ctx.fillRect(x,this.y-16,this.size*(this.health/this.maxHealth),9);
 }
}
