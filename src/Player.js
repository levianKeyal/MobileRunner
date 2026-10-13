export class Player {
 constructor(){this.size=34;this.y=0;this.vy=0;this.grounded=true;this.jumpsUsed=0;this.maxJumps=2;this.flash=0;this.rotation=0;this.spinning=false;this.spinProgress=0;this.spinDuration=.52;}
 reset(groundY){this.y=groundY-this.size;this.vy=0;this.grounded=true;this.jumpsUsed=0;this.rotation=0;this.spinning=false;this.spinProgress=0;this.flash=0;}
 jump(){if(this.jumpsUsed>=this.maxJumps)return false;this.vy=-680;this.grounded=false;this.jumpsUsed++;if(this.jumpsUsed===2){this.spinning=true;this.spinProgress=0;this.rotation=0;}return true;}
 land(surfaceY){this.y=surfaceY-this.size;this.vy=0;this.grounded=true;this.jumpsUsed=0;}
 shoot(){this.flash=.13;}
 update(dt){this.vy+=1800*dt;this.y+=this.vy*dt;this.grounded=false;if(this.spinning){this.spinProgress=Math.min(1,this.spinProgress+dt/this.spinDuration);this.rotation=this.spinProgress*Math.PI*2;if(this.spinProgress>=1){this.spinning=false;this.rotation=0;}}this.flash=Math.max(0,this.flash-dt);}
 draw(ctx,x){ctx.save();ctx.translate(x+this.size/2,this.y+this.size/2);ctx.rotate(this.rotation);ctx.translate(-this.size/2,-this.size/2);ctx.fillStyle='#22c55e';ctx.fillRect(0,0,this.size,this.size);ctx.strokeStyle='#bbf7d0';ctx.lineWidth=2;ctx.strokeRect(0,0,this.size,this.size);ctx.fillStyle='#052e16';ctx.fillRect(22,12,7,5);ctx.restore();if(this.flash>0){ctx.fillStyle='#fbbf24';ctx.fillRect(x+this.size+2,this.y+13,18,7);}}
}