export class Input {
 constructor(){
  this.jumpQueued=false;this.shootQueued=null;
  this.bind('jump',()=>this.jumpQueued=true);
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
  shoot.addEventListener('pointerdown',e=>{
   e.preventDefault();
   const r=shoot.getBoundingClientRect();
   const x=(e.clientX-r.left)/r.width-.5;
   const y=(e.clientY-r.top)/r.height-.5;
   this.shootQueued=Math.abs(x)>=Math.abs(y)?(x>=0?'right':'left'):(y>=0?'down':'up');
   draw(this.shootQueued);
   try{shoot.setPointerCapture(e.pointerId);}catch{}
  });
  const clear=()=>draw(null);
  shoot.addEventListener('pointerup',clear);
  shoot.addEventListener('pointercancel',clear);
  shoot.addEventListener('lostpointercapture',clear);
  window.addEventListener('keydown',e=>{
   if(e.repeat)return;
   if(e.code==='Space'||e.code==='ArrowUp'){e.preventDefault();this.jumpQueued=true;}
   if(e.code==='KeyX')this.shootQueued='right';
  });
 }
 bind(id,fn){document.getElementById(id).addEventListener('pointerdown',e=>{e.preventDefault();fn();});}
 consumeJump(){const v=this.jumpQueued;this.jumpQueued=false;return v;}
 consumeShoot(){const v=this.shootQueued;this.shootQueued=null;return v;}
}