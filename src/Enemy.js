export class Enemy {
 constructor(worldX,size=32){this.worldX=worldX;this.size=size;}
 draw(ctx,x,groundY){const y=groundY-this.size;ctx.fillStyle='#ef4444';ctx.fillRect(x,y,this.size,this.size);ctx.strokeStyle='#fecaca';ctx.lineWidth=2;ctx.strokeRect(x,y,this.size,this.size);ctx.fillStyle='#450a0a';ctx.fillRect(x+6,y+11,6,6);ctx.fillRect(x+20,y+11,6,6);}
}