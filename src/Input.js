export class Input {
 constructor(){
  this.jumpQueued=false;this.jumpHeld=false;this.shootQueue=[];
  const jump=document.getElementById('jump');
  const jumpCanvas=jump.querySelector('.jump-visual');
  const jumpCtx=jumpCanvas.getContext('2d');
  const drawJump=pressed=>{jumpCtx.clearRect(0,0,jumpCanvas.width,jumpCanvas.height);jumpCtx.fillStyle=pressed?'#475569':'#334155';jumpCtx.fillRect(0,0,jumpCanvas.width,jumpCanvas.height);};
  drawJump(false);
  let jumpPointer=null;
  jump.addEventListener('pointerdown',e=>{
   if(jumpPointer!==null)return;
   e.preventDefault();jumpPointer=e.pointerId;
   this.jumpHeld=true;this.jumpQueued=true;drawJump(true);
   try{jump.setPointerCapture(e.pointerId);}catch{}
  });
  const releaseJump=e=>{
   if(e.pointerId!==jumpPointer)return;
   jumpPointer=null;this.jumpHeld=false;drawJump(false);
  };
  jump.addEventListener('pointerup',releaseJump);
  jump.addEventListener('pointercancel',releaseJump);
  jump.addEventListener('lostpointercapture',releaseJump);
  const shoot=document.getElementById('shoot');
  const canvas=shoot.querySelector('.shoot-visual');
  const ctx=canvas.getContext('2d');
  const angles={right:[-Math.PI/4,Math.PI/4],down:[Math.PI/4,3*Math.PI/4],left:[3*Math.PI/4,5*Math.PI/4],up:[5*Math.PI/4,7*Math.PI/4]};
  const draw=direction=>{
   const size=canvas.width,mid=size/2;
   ctx.clearRect(0,0,size,size);
   ctx.fillStyle='#334155';
   ctx.fillRect(0,0,size,size);
   if(!angles[direction])return;
   ctx.beginPath();ctx.moveTo(mid,mid);
   ctx.arc(mid,mid,size,angles[direction][0],angles[direction][1]);
   ctx.closePath();ctx.fillStyle='#f59e0b';ctx.fill();
  };
  draw(null);
  let activePointer=null;
  let lastDirection=null;
  const directionAt=e=>{
   const r=shoot.getBoundingClientRect();
   const x=(e.clientX-r.left)/r.width-.5;
   const y=(e.clientY-r.top)/r.height-.5;
   return Math.abs(x)>=Math.abs(y)?(x>=0?'right':'left'):(y>=0?'down':'up');
  };
  const selectDirection=e=>{
   const direction=directionAt(e);
   if(direction===lastDirection)return;
   lastDirection=direction;
   this.shootQueue.push(direction);
   draw(direction);
  };
  shoot.addEventListener('pointerdown',e=>{
   if(activePointer!==null)return;
   e.preventDefault();
   activePointer=e.pointerId;
   lastDirection=null;
   selectDirection(e);
   try{shoot.setPointerCapture(e.pointerId);}catch{}
  });
  shoot.addEventListener('pointermove',e=>{
   if(e.pointerId!==activePointer)return;
   e.preventDefault();
   selectDirection(e);
  });
  const clear=e=>{
   if(e.pointerId!==activePointer)return;
   activePointer=null;
   lastDirection=null;
   draw(null);
  };
  shoot.addEventListener('pointerup',clear);
  shoot.addEventListener('pointercancel',clear);
  shoot.addEventListener('lostpointercapture',clear);
  window.addEventListener('keydown',e=>{
   if(e.repeat)return;
   if(e.code==='Space'||e.code==='ArrowUp'){e.preventDefault();this.jumpHeld=true;this.jumpQueued=true;}
   if(e.code==='KeyX')this.shootQueue.push('right');
  });
  window.addEventListener('keyup',e=>{if(e.code==='Space'||e.code==='ArrowUp')this.jumpHeld=false;});
  window.addEventListener('blur',()=>{this.jumpHeld=false;});
 }
 bind(id,fn){document.getElementById(id).addEventListener('pointerdown',e=>{e.preventDefault();fn();});}
 consumeJump(){const v=this.jumpQueued;this.jumpQueued=false;return v;}
 consumeShoot(){return this.shootQueue.shift()||null;}
 clearShoot(){this.shootQueue.length=0;}
}