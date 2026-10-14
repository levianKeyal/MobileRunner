const music=new Audio('./assets/nastelbom-intense-453507.mp3');
music.loop=true;
music.volume=0.35;
music.preload='none';
// Skip the nearly inaudible tail of the track to avoid a pause between loops.
const LOOP_END_SECONDS=132.5;
music.addEventListener('timeupdate',()=>{
 if(music.currentTime>=LOOP_END_SECONDS){music.currentTime=0;}
});
const toggle=document.getElementById('musicToggle');
let enabled=true;
let started=false;
function render(){toggle.textContent=enabled?'♫ MÚSICA: ON':'♫ MÚSICA: OFF';toggle.setAttribute('aria-pressed',String(enabled));}
async function startMusic(){
 if(!enabled||started)return;
 started=true;
 try{await music.play();}catch{started=false;}
}
toggle.addEventListener('pointerdown',e=>e.stopPropagation());
toggle.addEventListener('click',()=>{
 enabled=!enabled;render();
 if(enabled){startMusic();}else{music.pause();started=false;}
});
document.addEventListener('pointerdown',startMusic,{passive:true});
document.addEventListener('keydown',startMusic);
render();
