export class Player {
 constructor(){this.size=34;this.y=0;this.vy=0;this.grounded=true;this.jumpsUsed=0;this.maxJumps=2;this.flash=0;}
 reset(groundY){this.y=groundY-this.size;this.vy=0;this.grounded=true;this.jumpsUsed=0;}
 jump(){if(this.jumpsUsed>=this.maxJumps)return false;this.vy=-680;this.grounded=false;this.jumpsUsed++;return true;}
 shoot(){this.flash=.13;}
 update(dt,groundY){if(!this.grounded){this.vy+=1800*dt;this.y+=this.vy*dt;if(this.y+this.size>=groundY){this.y=groundY-this.size;this.vy=0;this.grounded=true;this.jumpsUsed=0;}}else this.y=groundY-this.size;this.flash=Math.max(0,this.flash-dt);}
 draw(ctx,x){ctx.fillStyle='#22c55e';ctx.fillRect(x,this.y,this.size,this.size);ctx.strokeStyle='#bbf7d0';ctx.lineWidth=2;ctx.strokeRect(x,this.y,this.size,this.size);ctx.fillStyle='#052e16';ctx.fillRect(x+22,this.y+12,7,5);if(this.flash>0){ctx.fillStyle='#fbbf24';ctx.fillRect(x+this.size+2,this.y+13,18,7);}}
}