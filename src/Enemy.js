export class Enemy {
 constructor(worldX,surfaceOffset=0,type='basic',size=32){this.worldX=worldX;this.surfaceOffset=surfaceOffset;this.size=size;this.type=type;this.health=(type==='basic'||type==='jumper')?1:2;this.shooter=type==='shooter'||type==='burst';this.jumpHeight=type==='jumper'?45+Math.random()*75:0;this.jumpOffset=0;this.jumpVelocity=0;this.jumpState='waiting';this.jumpWait=Math.random()*1.2;this.fireTimer=0.4+Math.random()*0.25;this.hasEnteredScreen=false;this.burstRemaining=type==='burst'?3:0;}
 update(dt){
  if(this.type!=='jumper')return false;
  if(this.jumpState==='waiting'){
   this.jumpWait-=dt;
   if(this.jumpWait<=0){this.jumpState='rising';this.jumpVelocity=650;this.jumpHeight=45+Math.random()*75;}
  }else if(this.jumpState==='rising'){
   this.jumpOffset+=this.jumpVelocity*dt;
   this.jumpVelocity-=1800*dt;
   if(this.jumpOffset>=this.jumpHeight||this.jumpVelocity<=0){
    this.jumpOffset=Math.min(this.jumpOffset,this.jumpHeight);
    this.jumpVelocity=0;this.jumpState='falling';
   }
  }else{
   this.jumpVelocity+=5200*dt;
   this.jumpOffset-=this.jumpVelocity*dt;
   if(this.jumpOffset<=0){
    this.jumpOffset=0;this.jumpVelocity=0;
    this.jumpState='waiting';this.jumpWait=.55+Math.random()*.6;
    return true;
   }
  }
  return false;
 }
 box(x,groundY){return {x,y:groundY-this.surfaceOffset-this.size-this.jumpOffset,width:this.size,height:this.size};}
 hit(){this.health--;return this.health<=0;}
 advanceFireTimer(dt){this.fireTimer-=dt;if(this.fireTimer>0)return false;if(this.type==='burst'){this.burstRemaining--;if(this.burstRemaining>0){this.fireTimer=0.25;}else{this.burstRemaining=3;this.fireTimer=2.3+Math.random()*0.7;}}else{this.fireTimer=2.0+Math.random()*0.9;}return true;}
 draw(ctx,x,groundY){const y=groundY-this.surfaceOffset-this.size-this.jumpOffset;ctx.fillStyle=this.health>1?'#38bdf8':'#ef4444';ctx.fillRect(x,y,this.size,this.size);ctx.strokeStyle=this.health>1?'#bae6fd':'#fecaca';ctx.lineWidth=2;ctx.strokeRect(x,y,this.size,this.size);ctx.fillStyle='#0f172a';ctx.fillRect(x+6,y+11,6,6);ctx.fillRect(x+20,y+11,6,6);if(this.type==='jumper'){ctx.fillStyle='#2563eb';ctx.fillRect(x-2,y+5,this.size+4,7);ctx.fillStyle='#93c5fd';ctx.fillRect(x+2,y+6,this.size-4,2);}if(this.type==='burst'){ctx.fillStyle='#b91c1c';ctx.fillRect(x-2,y+7,this.size+4,7);ctx.fillStyle='#f87171';ctx.fillRect(x+2,y+8,this.size-4,2);}if(this.shooter){ctx.fillStyle='#475569';ctx.fillRect(x-7,y+15,8,5);ctx.fillStyle='#94a3b8';ctx.fillRect(x-9,y+16,3,3);}}
}