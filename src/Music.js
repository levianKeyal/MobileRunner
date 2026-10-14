const music=new Audio('./assets/nastelbom-intense-453507.mp3');
music.loop=true;
music.volume=0.35;
music.preload='none';
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
