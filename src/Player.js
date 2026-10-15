export class Player {
 constructor(){this.size=34;this.y=0;this.vy=0;this.grounded=true;this.jumpsUsed=0;this.maxJumps=2;this.flash=0;this.rotation=0;this.spinning=false;this.spinProgress=0;this.spinDuration=.52;this.health=1;this.invulnerable=0;this.jumpCut=false;}
 reset(groundY){this.y=groundY-this.size;this.vy=0;this.grounded=true;this.jumpsUsed=0;this.rotation=0;this.spinning=false;this.spinProgress=0;this.flash=0;this.health=1;this.invulnerable=0;this.jumpCut=false;}
 addEnergy(){if(this.health>=3)return false;this.health++;return true;}
 takeHit(){if(this.invulnerable>0)return false;this.health--;if(this.health>0)this.invulnerable=1.15;return this.health<=0;}
 jump(){if(this.jumpsUsed>=this.maxJumps)return false;this.vy=-680;this.jumpCut=false;this.grounded=false;this.jumpsUsed++;if(this.jumpsUsed===2){this.spinning=true;this.spinProgress=0;this.rotation=0;}return true;}
 setJumpHeld(held){if(!held&&!this.jumpCut&&this.vy<0){this.vy*=.42;this.jumpCut=true;}}
 land(surfaceY){this.y=surfaceY-this.size;this.vy=0;this.grounded=true;this.jumpsUsed=0;}
 shoot(){this.flash=.13;}
 update(dt){this.vy+=1800*dt;this.y+=this.vy*dt;this.grounded=false;if(this.spinning){this.spinProgress=Math.min(1,this.spinProgress+dt/this.spinDuration);this.rotation=this.spinProgress*Math.PI*2;if(this.spinProgress>=1){this.spinning=false;this.rotation=0;}}this.flash=Math.max(0,this.flash-dt);this.invulnerable=Math.max(0,this.invulnerable-dt);}
 draw(ctx,x){ctx.save();if(this.invulnerable>0&&Math.floor(this.invulnerable*12)%2===0)ctx.globalAlpha=.45;ctx.translate(x+this.size/2,this.y+this.size/2);ctx.rotate(this.rotation);ctx.translate(-this.size/2,-this.size/2);ctx.fillStyle=this.health===3?'#22c55e':this.health===2?'#38bdf8':'#ef4444';ctx.fillRect(0,0,this.size,this.size);ctx.strokeStyle=this.health===3?'#bbf7d0':this.health===2?'#bae6fd':'#fecaca';ctx.lineWidth=2;ctx.strokeRect(0,0,this.size,this.size);ctx.fillStyle='#0f172a';ctx.fillRect(22,12,7,5);ctx.restore();if(this.flash>0){ctx.fillStyle='#fbbf24';ctx.fillRect(x+this.size+2,this.y+13,18,7);}}
}