// Destructible wall of player-sized blocks. Blocks are independent and never fall.
export class BreakablePlatform {
 constructor(x,columns,rows,blockSize=34){
  this.x=x;this.blockSize=blockSize;this.columns=columns;this.rows=rows;
  this.width=columns*blockSize;this.offset=rows*blockSize;this.solid=true;this.breakable=true;
  this.blocks=Array.from({length:rows},()=>Array(columns).fill(true));
 }
 tiles(groundY){
  const tiles=[],s=this.blockSize,top=groundY-this.offset;
  for(let row=0;row<this.rows;row++)for(let col=0;col<this.columns;col++){
   if(this.blocks[row][col])tiles.push({x:this.x+col*s,y:top+row*s,width:s,height:s,row,col});
  }
  return tiles;
 }
 breakTile(row,col){
  if(!this.blocks[row]?.[col])return false;
  this.blocks[row][col]=false;return true;
 }
 draw(ctx,cameraX,groundY){
  const s=this.blockSize,top=groundY-this.offset;
  for(let row=0;row<this.rows;row++)for(let col=0;col<this.columns;col++){
   if(!this.blocks[row][col])continue;
   const x=this.x+col*s-cameraX,y=top+row*s;
   if(x+s<0||x>ctx.canvas.width)continue;
   ctx.fillStyle='#a16207';ctx.fillRect(x,y,s,s);
   ctx.fillStyle='#fbbf24';ctx.fillRect(x+2,y+2,s-4,4);
   ctx.fillStyle='#713f12';ctx.fillRect(x+3,y+s-6,s-6,3);
   ctx.strokeStyle='#451a03';ctx.lineWidth=2;ctx.strokeRect(x+.5,y+.5,s-1,s-1);
  }
 }
}
export class BlockDebris {
 constructor(tile){
  this.pieces=Array.from({length:12},(_,i)=>{
   const angle=Math.random()*Math.PI*2,speed=75+Math.random()*160;
   return {x:tile.x+Math.random()*tile.width,y:tile.y+Math.random()*tile.height,
    vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-65,
    size:3+Math.random()*5,life:.45+Math.random()*.45,
    color:i%3===0?'#fbbf24':i%2===0?'#a16207':'#78350f'};
  });
 }
 update(dt,groundY){
  for(const p of this.pieces){
   p.life-=dt;p.vy+=850*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
   if(p.y+p.size>groundY){p.y=groundY-p.size;p.vy=-Math.abs(p.vy)*.2;p.vx*=.6;}
  }
  return this.pieces.every(p=>p.life<=0);
 }
 draw(ctx,cameraX){
  for(const p of this.pieces){if(p.life<=0)continue;ctx.globalAlpha=Math.min(1,p.life*2);ctx.fillStyle=p.color;ctx.fillRect(p.x-cameraX,p.y,p.size,p.size);}
  ctx.globalAlpha=1;
 }
}
