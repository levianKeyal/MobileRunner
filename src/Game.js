import { BreakablePlatform, BlockDebris } from './BreakablePlatform.js?v=0.10.40';
import { EnemyFragments } from './EnemyFragments.js?v=0.10.40';
import { ImpactDust } from './ImpactDust.js?v=0.10.40';
import { PowerUp } from './PowerUp.js?v=0.10.40';
import { DeathParticles } from './DeathParticles.js?v=0.10.40';
import { playPlayerShot } from './SoundEffects.js?v=0.10.40';
import { Input } from './Input.js?v=0.10.40';
import { Player } from './Player.js?v=0.10.40';
import { World } from './World.js?v=0.10.40';
import { Enemy } from './Enemy.js?v=0.10.40';
const intersects=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
export class Game {
 constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.input=new Input();this.width=0;this.height=0;this.groundY=0;this.lastTime=null;this.resizeCanvas();this.tutorialComplete=this.readTutorialComplete();this.recordFirstStart();this.forceTutorialOnce=false;this.gameOver=false;this.stats=this.loadStats();this.reset();document.getElementById('pause').addEventListener('click',()=>this.setPaused(true));document.getElementById('resume').addEventListener('click',()=>this.setPaused(false));document.getElementById('restart').addEventListener('click',()=>this.reset());document.getElementById('debugTutorial').addEventListener('click',()=>this.restartTutorial());window.addEventListener('resize',()=>this.resize());document.addEventListener('visibilitychange',()=>{this.lastTime=null;});requestAnimationFrame(t=>this.frame(t));}
 setPaused(paused){
  if(this.gameOver||this.paused===paused)return;
  this.paused=paused;
  document.getElementById('pausePanel').hidden=!paused;
  document.getElementById('controls').hidden=paused;
  this.input.consumeJump();this.input.clearShoot();this.input.jumpHeld=false;
  this.lastTime=null;
  document.dispatchEvent(new CustomEvent('mobileRunner:pause',{detail:{paused}}));
 }
 resizeCanvas(){this.width=window.innerWidth;this.height=window.innerHeight;this.groundY=Math.round(this.height*.74);const ratio=Math.min(window.devicePixelRatio||1,2);this.canvas.width=Math.round(this.width*ratio);this.canvas.height=Math.round(this.height*ratio);this.ctx.setTransform(ratio,0,0,ratio,0,0);}
 resize(){const oldGround=this.groundY;this.resizeCanvas();if(this.player){this.player.y+=this.groundY-oldGround;if(this.player.grounded)this.player.y=this.groundY-this.player.size;}}
 recordFirstStart(){try{if(!localStorage.getItem('mobileRunner.firstStartedAt'))localStorage.setItem('mobileRunner.firstStartedAt',new Date().toISOString());}catch{}}
 readTutorialComplete(){try{return localStorage.getItem('mobileRunner.tutorialComplete')==='true';}catch{return false;}}
 finishTutorial(){this.tutorialComplete=true;try{localStorage.setItem('mobileRunner.tutorialComplete','true');}catch{}}
 loadStats(){try{const s=JSON.parse(localStorage.getItem('mobileRunner.stats')||'{}');return {maxKOs:Number(s.maxKOs)||0,maxMeters:Number(s.maxMeters)||0,deaths:Number(s.deaths)||0};}catch{return {maxKOs:0,maxMeters:0,deaths:0};}}
 die(){if(this.gameOver)return;this.gameOver=true;this.deathParticles=new DeathParticles(this.playerX,this.player.y,this.player.size,this.groundY);this.deathPhase='exploding';this.deathScrollElapsed=0;this.deathScrollStart=this.world.distance;this.deathScrollSpeed=this.world.speed;const meters=Math.floor(this.world.distance/10);this.stats.maxKOs=Math.max(this.stats.maxKOs,this.score);this.stats.maxMeters=Math.max(this.stats.maxMeters,meters);this.stats.deaths++;try{localStorage.setItem('mobileRunner.stats',JSON.stringify(this.stats));}catch{}document.getElementById('finalKOs').textContent=this.score;document.getElementById('maxKOs').textContent=this.stats.maxKOs;document.getElementById('finalMeters').textContent=meters+' m';document.getElementById('maxMeters').textContent=this.stats.maxMeters+' m';document.getElementById('totalDeaths').textContent=this.stats.deaths;document.getElementById('controls').hidden=true;this.input.consumeJump();this.input.clearShoot();}
 restartTutorial(){this.forceTutorialOnce=true;this.reset();}
 reset(){this.paused=false;document.getElementById('pausePanel').hidden=true;this.gameOver=false;this.deathParticles=null;this.deathPhase=null;this.deathScrollElapsed=0;this.lastShotAt=-Infinity;document.getElementById('results').classList.remove('visible');document.getElementById('results').hidden=true;document.getElementById('controls').hidden=false;this.input.consumeJump();this.input.clearShoot();this.runtimeError=null;document.getElementById('runtimeError')?.remove();this.player=new Player();this.player.reset(this.groundY);this.world=new World(Math.floor(Math.random()*4294967295));this.bullets=[];this.enemyBullets=[];this.enemies=[];this.platforms=[];this.energyItems=[];this.impactDust=[];this.enemyFragments=[];this.blockDebris=[];this.jumpApexY=this.player.y;this.nextEnergyAt=45;this.score=0;this.elapsedTime=0;this.playerX=Math.round(this.width*.25);this.recoveryDuration=2;this.recoveryElapsed=0;this.recoveryStartX=this.playerX;this.recovering=false;this.tutorialMode=this.forceTutorialOnce||!this.tutorialComplete;this.forceTutorialOnce=false;this.tutorialWalls=[];this.tutorialFinishX=Infinity;if(this.tutorialMode){const start=20*this.world.speed+this.width+170;this.tutorialWalls=[{x:start,width:86,offset:76,solid:true},{x:start+650,width:90,offset:186,solid:true}];this.tutorialFinishX=start+650+90;}this.nextPlatformX=Math.max(this.width+170,540);this.nextEnemyX=Math.max(this.width+160,500);this.nextComboAt=this.nextEnemyX+900+Math.random()*500;document.getElementById('score').textContent='0';this.lastTime=null;}
 platformLevels(){const jumpHeight=680*680/(2*1800);return [Math.round(jumpHeight*.56),Math.round(jumpHeight*1.52)];}
 spawnPlatforms(){if(this.tutorialMode)return;/* Generate terrain beyond the longest possible combo before checking enemy positions. */const ahead=this.world.distance+this.width+700;const levels=this.platformLevels();while(this.nextPlatformX<ahead){const width=145+Math.random()*100;const offset=levels[Math.random()<.65?0:1];if(Math.random()<.28){
  const columns=3+Math.floor(Math.random()*3);
  const rows=3+Math.floor(Math.random()*5);
  const wall=new BreakablePlatform(this.nextPlatformX,columns,rows,this.player.size);
  this.platforms.push(wall);
  this.nextPlatformX+=wall.width+190+Math.random()*190;
 }else{
  this.platforms.push({x:this.nextPlatformX,width,offset,solid:Math.random()<.3});
  this.nextPlatformX+=width+110+Math.random()*190;
 }}this.platforms=this.platforms.filter(p=>p.x+p.width>this.world.distance);}
 spawnEnemies(){
  const ahead=this.world.distance+this.width+90;
  const size=32;
  const bounceFlight=2*570/1800;
  const comboSpacing=Math.round(this.world.speed*bounceFlight*.96);
  while(this.nextEnemyX<ahead){
   const x=this.nextEnemyX;
   const arrivalTime=this.elapsedTime+Math.max(0,(x-this.world.distance-this.width)/this.world.speed);
   if(this.tutorialMode&&arrivalTime>=20){this.nextEnemyX=x+110+Math.random()*180;continue;}
   // Occasional groups of 3-5 stationary ground enemies, paced to the stomp rebound.
   if(!this.tutorialMode&&x>=this.nextComboAt&&Math.random()<.65){
    const count=3+Math.floor(Math.random()*3);
    const endX=x+(count-1)*comboSpacing+size;
    const clearTerrain=[...this.platforms,...this.tutorialWalls].every(p=>p.x>=endX+this.player.size||p.x+p.width<=x-this.player.size);
    const clearEnemies=this.enemies.every(e=>e.worldX+e.size<=x-size||e.worldX>=endX+size);
    if(clearTerrain&&clearEnemies){
     for(let i=0;i<count;i++)this.enemies.push(new Enemy(x+i*comboSpacing,0,'basic'));
     this.nextEnemyX=endX+180+Math.random()*110;
     this.nextComboAt=this.nextEnemyX+850+Math.random()*700;
     continue;
    }
    this.nextComboAt=x+260+Math.random()*180;
   }
   const solid=[...this.platforms,...this.tutorialWalls].find(p=>p.solid&&x<p.x+p.width&&x+size>p.x);
   if(solid&&(x<solid.x+this.player.size*2||x+size>solid.x+solid.width-12)){this.nextEnemyX+=110+Math.random()*180;continue;}
   const platforms=this.platforms.filter(p=>!p.solid&&x>=p.x+12&&x+size<=p.x+p.width-12);
   const selected=solid||(platforms.length&&Math.random()<.55?platforms[Math.floor(Math.random()*platforms.length)]:null);
   const roll=Math.random();
   const type=this.tutorialMode?(arrivalTime<10?'basic':arrivalTime<15?'shooter':'burst'):(roll<.48?'basic':roll<.72?'shooter':roll<.85?'burst':'jumper');
   this.enemies.push(new Enemy(x,selected?selected.offset:0,type));
   this.nextEnemyX+=110+Math.random()*180;
  }
 }
 spawnEnergy(dt){if(this.tutorialMode)return;while(this.elapsedTime>=this.nextEnergyAt){this.energyItems.push(new PowerUp('energy',this.width+30,this.groundY,this.world.speed));this.nextEnergyAt+=45+Math.random()*20;}for(const item of this.energyItems)item.update(dt,this.groundY);this.energyItems=this.energyItems.filter(item=>item.x+item.size>-30);}
 receiveHit(){if(this.player.invulnerable>0)return;if(this.player.takeHit())this.die();}
 shoot(direction='right'){const now=performance.now();if(now-this.lastShotAt<1000/8)return;this.lastShotAt=now;const vectors={right:[1,0],left:[-1,0],up:[0,-1],down:[0,1]};const [dx,dy]=vectors[direction]||vectors.right;this.player.shoot();playPlayerShot();const vertical=dy!==0;const width=vertical?6:14;const height=vertical?14:6;const x=this.playerX+this.player.size/2-width/2+dx*(this.player.size/2+5);const y=this.player.y+this.player.size/2-height/2+dy*(this.player.size/2+5);const life=dx>0?Math.max(0,(this.width-x-width)*.8/750):.45;this.bullets.push({x,y,width,height,vx:dx*750,vy:dy*750,life});}
 breakBlock(wall,tile){
  if(wall.breakTile(tile.row,tile.col)){this.blockDebris.push(new BlockDebris(tile));return true;}
  return false;
 }
 collideBreakableBlocks(previousY){
  const player=this.player, left=this.playerX,right=left+player.size;
  const previousTop=previousY,previousBottom=previousY+player.size;
  const currentTop=player.y,currentBottom=currentTop+player.size;
  const goingUp=player.vy<0&&!player.stomping;
  const goingDown=player.stomping&&player.vy>0;
  if(!goingUp&&!goingDown)return;
  const hits=[];
  for(const wall of this.platforms){
   if(!wall.breakable)continue;
   for(const tile of wall.tiles(this.groundY)){
    const tileLeft=tile.x-this.world.distance;
    if(right<=tileLeft+1||left>=tileLeft+tile.width-1)continue;
    if(goingUp&&previousTop>=tile.y+tile.height-2&&currentTop<=tile.y+tile.height){
     hits.push({wall,tile,edge:tile.y+tile.height});
    }else if(goingDown&&previousBottom<=tile.y+2&&currentBottom>=tile.y){
     hits.push({wall,tile,edge:tile.y});
    }
   }
  }
  if(goingUp){
   // Break every tile crossed by the player's head without changing jump momentum.
   for(const hit of hits)this.breakBlock(hit.wall,hit.tile);
  }else if(goingDown){
   // Every crossed row breaks; stomp continues without slowing or landing.
   for(const hit of hits)this.breakBlock(hit.wall,hit.tile);
  }
 }
 resolveLanding(previousBottom){const x=this.playerX;const foot=this.player.y+this.player.size;if(this.player.vy<0)return;let landingY=this.groundY;for(const p of [...this.platforms,...this.tutorialWalls]){if(p.breakable){if(this.player.stomping)continue;for(const tile of p.tiles(this.groundY)){const px=tile.x-this.world.distance;const top=tile.y;const overlapX=Math.min(x+this.player.size,px+tile.width)-Math.max(x,px);if(overlapX>=Math.min(8,this.player.size*.25)&&previousBottom<=top+1&&foot>=top&&top<landingY)landingY=top;}continue;}const px=p.x-this.world.distance;const top=this.groundY-p.offset;if(x+this.player.size>px&&x<px+p.width&&previousBottom<=top+3&&foot>=top&&top<landingY)landingY=top;}if(previousBottom<=landingY+3&&foot>=landingY){const wasAirborne=this.player.jumpsUsed>0&&!this.player.grounded;const wasStomp=this.player.stomping;this.player.land(landingY);if(wasAirborne){const fallDistance=Math.max(0,landingY-this.player.size-this.jumpApexY);const intensity=wasStomp?2.5:Math.max(.35,Math.min(2.5,fallDistance/115));if(wasStomp)this.player.squashTime=this.player.squashDuration;this.impactDust.push(new ImpactDust(this.world.distance+this.playerX+this.player.size/2,landingY,intensity));this.jumpApexY=this.player.y;}}}
 update(dt){if(this.input.consumeJump()){if(this.player.stompChainReady){this.player.startStomp();}else if(this.player.jump())this.jumpApexY=this.player.y;else this.player.startStomp();}this.player.setJumpHeld(this.input.jumpHeld);let shootDirection;while((shootDirection=this.input.consumeShoot()))this.shoot(shootDirection);this.elapsedTime+=dt;this.world.update(dt);if(this.tutorialMode&&this.elapsedTime>=20){this.enemies=[];this.enemyBullets=[];}this.spawnPlatforms();this.tutorialWalls=this.tutorialWalls.filter(p=>p.x+p.width>this.world.distance);this.spawnEnergy(dt);if(!this.tutorialMode||this.elapsedTime<20)this.spawnEnemies();for(const enemy of this.enemies){
  if(enemy.update(dt))this.impactDust.push(new ImpactDust(enemy.worldX+enemy.size/2,this.groundY-enemy.surfaceOffset));
 }
 this.impactDust=this.impactDust.filter(dust=>!dust.update(dt));this.enemyFragments.forEach(f=>f.update(dt));this.enemyFragments=this.enemyFragments.filter(f=>!f.isOffscreen(this.world.distance));this.blockDebris=this.blockDebris.filter(d=>!d.update(dt,this.groundY));
 const previousY=this.player.y;const previousBottom=previousY+this.player.size;this.player.update(dt);this.collideBreakableBlocks(previousY);if(!this.player.grounded)this.jumpApexY=Math.min(this.jumpApexY,this.player.y);if(this.player.stomping){
  const bottom=this.player.y+this.player.size;
  for(const enemy of this.enemies){
   const box=enemy.box(enemy.worldX-this.world.distance,this.groundY);
   const horizontally=this.playerX+this.player.size>box.x&&this.playerX<box.x+box.width;
   const verticalContact=bottom>box.y&&this.player.y<box.y+box.height;
   if(horizontally&&verticalContact&&this.player.vy>0){
    this.player.y=box.y-this.player.size;
    if(enemy.hit()){this.enemyFragments.push(new EnemyFragments(enemy,this.groundY));this.enemies.splice(this.enemies.indexOf(enemy),1);this.score++;document.getElementById('score').textContent=String(this.score);}
    this.impactDust.push(new ImpactDust(this.world.distance+this.playerX+this.player.size/2,box.y,2.5));
    this.player.bounceFromStomp();
    this.jumpApexY=this.player.y;
    break;
   }
  }
 }
 this.resolveLanding(previousBottom);
 const targetX=Math.round(this.width*.25);
 let pushed=false;
 for(const wall of [...this.platforms,...this.tutorialWalls]){
  if(!wall.solid)continue;
  if(wall.breakable){if(this.player.stomping)continue;for(const tile of wall.tiles(this.groundY)){const left=tile.x-this.world.distance;const top=tile.y;const overlap=this.player.y+this.player.size>top+8&&this.player.y<top+tile.height-2&&this.playerX+this.player.size>left+2&&this.playerX<left+tile.width-2;if(overlap){this.playerX=Math.min(this.playerX,left-this.player.size);pushed=true;}}continue;}
  const left=wall.x-this.world.distance;
  const top=this.groundY-wall.offset;
  const sideContact=this.player.y+this.player.size>top+2&&this.player.y<this.groundY&&this.playerX+this.player.size>left&&this.playerX<left+wall.width;
  if(sideContact){this.playerX=Math.min(this.playerX,left-this.player.size);pushed=true;}
 }
 if(this.playerX<=0){this.die();return;}
 if(pushed){this.recovering=false;this.recoveryElapsed=0;}
 else if(this.playerX<targetX){
  if(!this.recovering){this.recovering=true;this.recoveryElapsed=0;this.recoveryStartX=this.playerX;}
  this.recoveryElapsed=Math.min(this.recoveryDuration,this.recoveryElapsed+dt);
  const t=this.recoveryElapsed/this.recoveryDuration;
  const eased=t*t*(3-2*t);
  this.playerX=this.recoveryStartX+(targetX-this.recoveryStartX)*eased;
  if(t>=1)this.recovering=false;
 }else{this.recovering=false;}
 const playerX=this.playerX;
 const playerBox={x:playerX,y:this.player.y,width:this.player.size,height:this.player.size};for(let i=this.energyItems.length-1;i>=0;i--){const item=this.energyItems[i];const box=item.box();if(intersects(playerBox,box)&&this.player.addEnergy())this.energyItems.splice(i,1);}if(this.tutorialMode&&this.world.distance+playerX>this.tutorialFinishX){this.finishTutorial();this.tutorialMode=false;this.nextPlatformX=this.world.distance+this.width+160;this.nextEnemyX=this.world.distance+this.width+160;}
 for(const enemy of this.enemies){if(!enemy.shooter)continue;const x=enemy.worldX-this.world.distance;if(x<this.width-enemy.size&&x>playerX+enemy.size){enemy.hasEnteredScreen=true;}if(enemy.hasEnteredScreen&&x>playerX+enemy.size&&x<this.width&&enemy.advanceFireTimer(dt)){this.enemyBullets.push({x:x-12,y:this.groundY-enemy.surfaceOffset-enemy.jumpOffset-enemy.size*.5-3,width:12,height:6,speed:430});}}
 const survivors=[];for(const bullet of this.bullets){const previousX=bullet.x;const previousY=bullet.y;bullet.x+=bullet.vx*dt;bullet.y+=bullet.vy*dt;bullet.life-=dt;if(bullet.life<=0)continue;let hitBlock=null;let blockDistance=Infinity;
 for(const wall of this.platforms){if(!wall.breakable)continue;for(const tile of wall.tiles(this.groundY)){
  const box={...tile,x:tile.x-this.world.distance};
  const swept={x:Math.min(previousX,bullet.x),y:Math.min(previousY,bullet.y),width:bullet.width+Math.abs(bullet.x-previousX),height:bullet.height+Math.abs(bullet.y-previousY)};
  if(intersects(swept,box)){const distance=Math.abs(box.x-previousX)+Math.abs(box.y-previousY);if(distance<blockDistance){blockDistance=distance;hitBlock={wall,tile};}}
 }}
 let hit=null;let nearest=Infinity;for(const enemy of this.enemies){const box=enemy.box(enemy.worldX-this.world.distance,this.groundY);const swept={x:Math.min(previousX,bullet.x),y:Math.min(previousY,bullet.y),width:bullet.width+Math.abs(bullet.x-previousX),height:bullet.height+Math.abs(bullet.y-previousY)};if(intersects(swept,box)&&box.x<nearest){nearest=box.x;hit=enemy;}}if(hitBlock&&(!hit||blockDistance<=Math.abs(nearest-previousX))){this.breakBlock(hitBlock.wall,hitBlock.tile);}else if(hit){if(hit.hit()){this.enemyFragments.push(new EnemyFragments(hit,this.groundY));this.enemies.splice(this.enemies.indexOf(hit),1);this.score++;document.getElementById('score').textContent=String(this.score);}}else if(bullet.x+bullet.width>0&&bullet.x<this.width+20&&bullet.y+bullet.height>0&&bullet.y<this.height+20)survivors.push(bullet);}this.bullets=survivors;
 const hostile=[];for(const bullet of this.enemyBullets){const previousX=bullet.x;bullet.x-=bullet.speed*dt;const swept={x:bullet.x,y:bullet.y,width:bullet.width+previousX-bullet.x,height:bullet.height};if(intersects(swept,playerBox)){this.receiveHit();if(this.gameOver)return;continue;}if(bullet.x+bullet.width>0)hostile.push(bullet);}this.enemyBullets=hostile;
 this.enemies=this.enemies.filter(e=>e.worldX+e.size>this.world.distance);for(const enemy of this.enemies){if(intersects(playerBox,enemy.box(enemy.worldX-this.world.distance,this.groundY))){this.receiveHit();if(this.gameOver)return;}}}
 draw(){this.world.draw(this.ctx,this.width,this.height,this.groundY);for(const p of [...this.platforms,...this.tutorialWalls]){if(p.breakable){p.draw(this.ctx,this.world.distance,this.groundY);continue;}const x=p.x-this.world.distance;const y=this.groundY-p.offset;this.ctx.fillStyle=p.solid?'#475569':'#64748b';this.ctx.fillRect(x,y,p.width,p.solid?p.offset:14);this.ctx.fillStyle=p.solid?'#cbd5e1':'#94a3b8';this.ctx.fillRect(x,y,p.width,4);this.ctx.fillStyle='#334155';for(let stripe=x+12;stripe<x+p.width-8;stripe+=28)this.ctx.fillRect(stripe,y+7,13,3);}for(const item of this.energyItems)item.draw(this.ctx);for(const enemy of this.enemies)enemy.draw(this.ctx,enemy.worldX-this.world.distance,this.groundY);for(const dust of this.impactDust)dust.draw(this.ctx,this.world.distance);for(const fragments of this.enemyFragments)fragments.draw(this.ctx,this.world.distance);for(const debris of this.blockDebris)debris.draw(this.ctx,this.world.distance);if(!this.gameOver)this.player.draw(this.ctx,this.playerX);if(this.deathParticles)this.deathParticles.draw(this.ctx);this.ctx.fillStyle='#fde047';for(const bullet of this.bullets)this.ctx.fillRect(bullet.x,bullet.y,bullet.width,bullet.height);this.ctx.fillStyle='#fb923c';for(const bullet of this.enemyBullets)this.ctx.fillRect(bullet.x,bullet.y,bullet.width,bullet.height);document.getElementById('distance').textContent=`${Math.floor(this.world.distance/10)} m`;}
 updateDeathWorld(dt,shift){
  // Existing projectiles remain active, but can no longer damage anything.
  this.bullets=this.bullets.filter(b=>{b.x+=b.vx*dt-shift;b.y+=b.vy*dt;b.life-=dt;return b.life>0&&b.x+b.width>0&&b.x<this.width+30&&b.y+b.height>0&&b.y<this.height+30;});
  this.enemyBullets=this.enemyBullets.filter(b=>{b.x-=b.speed*dt+shift;return b.x+b.width>0;});
  // Let airborne jumpers finish landing without beginning another jump.
  for(const enemy of this.enemies){
   if(enemy.type==='jumper'&&enemy.jumpState!=='waiting'){
    if(enemy.update(dt))this.impactDust.push(new ImpactDust(enemy.worldX+enemy.size/2,this.groundY-enemy.surfaceOffset));
   }
  }
  this.impactDust=this.impactDust.filter(dust=>!dust.update(dt));this.enemyFragments.forEach(f=>f.update(dt));this.enemyFragments=this.enemyFragments.filter(f=>!f.isOffscreen(this.world.distance));this.blockDebris=this.blockDebris.filter(d=>!d.update(dt,this.groundY));
 }
 frame(time){try{const dt=this.lastTime===null?0:Math.min((time-this.lastTime)/1000,.033);this.lastTime=time;if(this.paused){this.draw();return;}if(!this.gameOver)this.update(dt);else if(this.deathPhase==='exploding'){const duration=.8;const oldDistance=this.world.distance;if(this.deathScrollElapsed<duration){this.deathScrollElapsed=Math.min(duration,this.deathScrollElapsed+dt);const t=this.deathScrollElapsed/duration;const distanceOffset=this.deathScrollSpeed*duration*(t-t*t+t*t*t/3);this.world.distance=this.deathScrollStart+distanceOffset;}const shift=this.world.distance-oldDistance;this.updateDeathWorld(dt,shift);const settled=this.deathParticles?.update(dt);if(settled&&this.deathScrollElapsed>=duration){this.deathPhase='results';const panel=document.getElementById('results');panel.hidden=false;requestAnimationFrame(()=>{if(this.gameOver&&this.deathPhase==='results')panel.classList.add('visible');});}}else if(this.gameOver&&this.deathPhase==='results'){this.updateDeathWorld(dt,0);}this.draw();}catch(error){if(!this.runtimeError){this.runtimeError=String(error?.stack||error);console.error('MobileRunner runtime error',error);const notice=document.createElement('div');notice.id='runtimeError';notice.style.cssText='position:absolute;top:100px;left:12px;right:12px;z-index:20;padding:12px;background:#7f1d1d;color:white;font:12px monospace;white-space:pre-wrap;overflow-wrap:anywhere;max-height:35vh;overflow:auto';notice.textContent='Error del juego (captura esta pantalla): '+this.runtimeError;document.getElementById('app').appendChild(notice);}}finally{requestAnimationFrame(t=>this.frame(t));}}
}