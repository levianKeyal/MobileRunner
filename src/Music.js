import { getSfxSettings, setSfxEnabled, setSfxVolume } from './SoundEffects.js?v=0.10.28';
const music=new Audio('./assets/nastelbom-intense-453507.mp3');
music.loop=true;
music.preload='none';
const LOOP_END_SECONDS=132.5;
music.addEventListener('timeupdate',()=>{
 if(music.currentTime>=LOOP_END_SECONDS)music.currentTime=0;
});
const enabledInput=document.getElementById('musicEnabled');
const volumeInput=document.getElementById('musicVolume');
const volumeValue=document.getElementById('volumeValue');
const MUSIC_PREF_KEY='mobileRunner.musicEnabled';
const VOLUME_PREF_KEY='mobileRunner.musicVolume';
let enabled=true;
let volume=23;
try{
 enabled=localStorage.getItem(MUSIC_PREF_KEY)!=='false';
 const saved=localStorage.getItem(VOLUME_PREF_KEY);
 if(saved!==null&&Number.isFinite(Number(saved)))volume=Math.max(0,Math.min(100,Math.round(Number(saved))));
}catch{}
let started=false;
let gamePaused=false;
function render(){
 enabledInput.checked=enabled;
 volumeInput.value=String(volume);
 volumeValue.textContent=volume+' %';
 music.volume=volume/100;
}
async function startMusic(){
 if(!enabled||started||gamePaused)return;
 started=true;
 try{await music.play();}catch{started=false;}
}
enabledInput.addEventListener('change',()=>{
 enabled=enabledInput.checked;
 try{localStorage.setItem(MUSIC_PREF_KEY,String(enabled));}catch{}
 if(!enabled){music.pause();started=false;}else startMusic();
 render();
});
volumeInput.addEventListener('input',()=>{
 volume=Number(volumeInput.value);
 music.volume=volume/100;
 volumeValue.textContent=volume+' %';
 try{localStorage.setItem(VOLUME_PREF_KEY,String(volume));}catch{}
});
document.addEventListener('mobileRunner:pause',e=>{
 gamePaused=Boolean(e.detail?.paused);
 if(gamePaused){music.pause();started=false;}else if(enabled)startMusic();
});
document.addEventListener('pointerdown',startMusic,{passive:true});
document.addEventListener('keydown',startMusic);
const sfxEnabledInput=document.getElementById('sfxEnabled');
const sfxVolumeInput=document.getElementById('sfxVolume');
const sfxVolumeValue=document.getElementById('sfxVolumeValue');
function renderSfx(){
 const settings=getSfxSettings();
 sfxEnabledInput.checked=settings.enabled;
 sfxVolumeInput.value=String(settings.volume);
 sfxVolumeValue.textContent=settings.volume+' %';
}
sfxEnabledInput.addEventListener('change',()=>{
 setSfxEnabled(sfxEnabledInput.checked);
 renderSfx();
});
sfxVolumeInput.addEventListener('input',()=>{
 setSfxVolume(sfxVolumeInput.value);
 renderSfx();
});
renderSfx();
render();
