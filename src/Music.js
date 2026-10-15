const music=new Audio('./assets/nastelbom-intense-453507.mp3');
music.loop=true;
music.volume=0.35*0.65; // 65% of the previous music volume
music.preload='none';
// Skip the nearly inaudible tail of the track to avoid a pause between loops.
const LOOP_END_SECONDS=132.5;
music.addEventListener('timeupdate',()=>{
 if(music.currentTime>=LOOP_END_SECONDS){music.currentTime=0;}
});
const toggle=document.getElementById('musicToggle');
const MUSIC_PREF_KEY='mobileRunner.musicEnabled';
let enabled=true;
try{enabled=localStorage.getItem(MUSIC_PREF_KEY)!=='false';}catch{}
let started=false;
let gamePaused=false;
function render(){toggle.textContent=enabled?'♫ MÚSICA: ON':'♫ MÚSICA: OFF';toggle.setAttribute('aria-pressed',String(enabled));}
async function startMusic(){
 if(!enabled||started||gamePaused)return;
 started=true;
 try{await music.play();}catch{started=false;}
}
toggle.addEventListener('pointerdown',e=>e.stopPropagation());
toggle.addEventListener('click',()=>{
 enabled=!enabled;try{localStorage.setItem(MUSIC_PREF_KEY,String(enabled));}catch{}render();
 if(enabled){startMusic();}else{music.pause();started=false;}
});
document.addEventListener('mobileRunner:pause',e=>{gamePaused=Boolean(e.detail?.paused);if(gamePaused){music.pause();started=false;}else if(enabled){startMusic();}});
document.addEventListener('pointerdown',startMusic,{passive:true});
document.addEventListener('keydown',startMusic);
render();
