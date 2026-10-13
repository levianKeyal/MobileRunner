export class Input {
 constructor(){this.jumpQueued=false;this.shootQueued=false;this.bind('jump',()=>this.jumpQueued=true);this.bind('shoot',()=>this.shootQueued=true);window.addEventListener('keydown',e=>{if(e.repeat)return;if(e.code==='Space'||e.code==='ArrowUp'){e.preventDefault();this.jumpQueued=true;}if(e.code==='KeyX')this.shootQueued=true;});}
 bind(id,fn){document.getElementById(id).addEventListener('pointerdown',e=>{e.preventDefault();fn();});}
 consumeJump(){const v=this.jumpQueued;this.jumpQueued=false;return v;}
 consumeShoot(){const v=this.shootQueued;this.shootQueued=false;return v;}
}