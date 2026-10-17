// Temporary boss prototype: fixed size, no attacks or contact damage.
const COLORS=Array.from({length:47},(_,i)=>`hsl(${(25+i*137.508)%360} 80% ${42+(i%5)*7}%)`).concat(['#22c55e','#2563eb','#ef4444']);
export class AreaBoss {
 constructor(worldX,groundY,playerSize){
  this.worldX=worldX;this.size=playerSize*4;this.y=groundY-this.size;
  this.health=50;this.maxHealth=50;this.flying=false;this.isBoss=true;this.groundY=groundY;this.vy=0;this.phase='idle';this.phaseTime=2;this.shotClock=0;this.shotsFired=0;this.lastShotLane=-1;this.expression='neutral';this.expressionClock=0;this.squashTime=0;this.squashDuration=.34;this.victorious=false;
 }
 box(x){return {x,y:this.y,width:this.size,height:this.size};}
 hit(){this.health=Math.max(0,this.health-1);this.expression='angry';this.expressionClock=.3;return this.health===0;}
 celebrateVictory(){this.victorious=true;this.expression='smug';this.expressionClock=Infinity;}
 update(dt){this.squashTime=Math.max(0,this.squashTime-dt);this.expressionClock=Math.max(0,this.expressionClock-dt);if(this.phase==='stomp'){this.vy+=1950*dt;this.y+=this.vy*dt;if(this.y>=this.groundY-this.size){this.y=this.groundY-this.size;this.vy=0;this.phase='recover';this.phaseTime=.9;this.expression='surprised';this.expressionClock=.55;this.squashTime=this.squashDuration;return {stomp:true};}return {};}
 this.phaseTime-=dt;if(this.phase==='burst'){this.shotClock-=dt;if(this.shotClock<=0){this.shotClock=.9+Math.random()*.3;const choices=[0,1].filter(lane=>lane!==this.lastShotLane);const lane=choices[Math.floor(Math.random()*choices.length)];this.lastShotLane=lane;this.shotsFired++;this.expression='angry';this.expressionClock=.35;if(this.phaseTime<=0){this.phase='recover';this.phaseTime=1.2;}return {shotY:this.groundY-[16,78][lane]};}return {};}
 if(this.phaseTime<=0){if(this.phase==='recover'){this.phase='idle';this.phaseTime=1.1+Math.random()*1.1;this.expression='neutral';}else if(Math.random()<.45){this.phase='stomp';this.vy=-680;this.expression='angry';this.expressionClock=.6;}else{this.phase='burst';this.phaseTime=10;this.shotClock=.5;this.shotsFired=0;}}return {};}

 draw(ctx,x){
  ctx.save();const squash=this.squashTime>0?Math.sin(Math.PI*this.squashTime/this.squashDuration)*.27:0;ctx.translate(x+this.size/2,this.groundY);ctx.scale(1+squash,1-squash);ctx.translate(-(x+this.size/2),-this.groundY);
  const color=COLORS[Math.min(COLORS.length-1,50-this.health)];
  ctx.fillStyle=color;ctx.fillRect(x,this.y,this.size,this.size);
  ctx.strokeStyle='#f8fafc';ctx.lineWidth=4;ctx.strokeRect(x+2,this.y+2,this.size-4,this.size-4);
  ctx.fillStyle='#0f172a';const unit=this.size/8;
  const face=this.victorious?'smug':this.expressionClock>0?this.expression:(this.phase==='burst'?'angry':this.phase==='stomp'?'surprised':'neutral');
  if(face==='smug'){
   // Chunky pixel-style face, consistent with the other expressions.
   ctx.fillRect(x+unit*2,this.y+unit*2.5,unit*1.6,unit*.38);
   ctx.fillRect(x+unit*4.7,this.y+unit*2.05,unit*1.6,unit*.38);
   ctx.fillRect(x+unit*2.2,this.y+unit*3.1,unit*1.15,unit*.62);
   ctx.fillRect(x+unit*4.9,this.y+unit*3.1,unit*1.15,unit*.62);
   ctx.fillRect(x+unit*3,this.y+unit*5.35,unit*2.3,unit*.52);
   ctx.fillRect(x+unit*5.3,this.y+unit*4.85,unit*.55,unit*.52);
  }
  else if(face==='surprised'){ctx.fillRect(x+unit*2,this.y+unit*3,unit,unit);ctx.fillRect(x+unit*5,this.y+unit*3,unit,unit);ctx.beginPath();ctx.ellipse(x+unit*4,this.y+unit*5.4,unit*.75,unit,0,0,Math.PI*2);ctx.fill();}
  else if(face==='angry'){ctx.fillRect(x+unit*2,this.y+unit*3,unit,unit*.65);ctx.fillRect(x+unit*5,this.y+unit*3,unit,unit*.65);ctx.strokeStyle='#0f172a';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x+unit*2,this.y+unit*2.3);ctx.lineTo(x+unit*3.3,this.y+unit*3);ctx.moveTo(x+unit*6,this.y+unit*2.3);ctx.lineTo(x+unit*4.7,this.y+unit*3);ctx.stroke();ctx.fillRect(x+unit*3,this.y+unit*5.3,unit*2,unit*.5);}
  else{const blink=Math.sin(performance.now()*.003)>.98;ctx.fillRect(x+unit*2,this.y+unit*3,unit,blink?2:unit);ctx.fillRect(x+unit*5,this.y+unit*3,unit,blink?2:unit);ctx.fillRect(x+unit*3,this.y+unit*5,unit*2,unit*.5);}
  ctx.restore();
 }
}
