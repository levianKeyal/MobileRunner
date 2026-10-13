export class Enemy {
 constructor(worldX,surfaceOffset=0,health=1,size=32){this.worldX=worldX;this.surfaceOffset=surfaceOffset;this.size=size;this.health=health;this.shooter=health===2;this.fireTimer=0.55+Math.random()*0.45;this.hasEnteredScreen=false;}
 box(x,groundY){return {x,y:groundY-this.surfaceOffset-this.size,width:this.size,height:this.size};}
 hit(){this.health--;return this.health<=0;}
 draw(ctx,x,groundY){const y=groundY-this.surfaceOffset-this.size;ctx.fillStyle=this.health>1?'#38bdf8':'#ef4444';ctx.fillRect(x,y,this.size,this.size);ctx.strokeStyle=this.health>1?'#bae6fd':'#fecaca';ctx.lineWidth=2;ctx.strokeRect(x,y,this.size,this.size);ctx.fillStyle='#0f172a';ctx.fillRect(x+6,y+11,6,6);ctx.fillRect(x+20,y+11,6,6);if(this.shooter){ctx.fillStyle='#475569';ctx.fillRect(x-7,y+15,8,5);ctx.fillStyle='#94a3b8';ctx.fillRect(x-9,y+16,3,3);}}
}