// Shared SFX preferences; all future effects should use these settings.
const SHOT_URL='./assets/zapsplat_multimedia_game_sound_simple_sci_fi_gunshot_114682.mp3';
const SFX_ENABLED_KEY='mobileRunner.sfxEnabled';
const SFX_VOLUME_KEY='mobileRunner.sfxVolume';
let enabled=true;
let volume=20;
try{
 enabled=localStorage.getItem(SFX_ENABLED_KEY)!=='false';
 const stored=localStorage.getItem(SFX_VOLUME_KEY);
 if(stored!==null&&Number.isFinite(Number(stored)))volume=Math.max(0,Math.min(100,Math.round(Number(stored))));
}catch{}
const shotPool=Array.from({length:5},()=>{
 const audio=new Audio(SHOT_URL);
 audio.preload='auto';
 audio.volume=volume/100;
 return audio;
});
let nextShot=0;
export function getSfxSettings(){return {enabled,volume};}
export function setSfxEnabled(value){
 enabled=Boolean(value);
 try{localStorage.setItem(SFX_ENABLED_KEY,String(enabled));}catch{}
 if(!enabled)for(const audio of shotPool){audio.pause();audio.currentTime=0;}
}
export function setSfxVolume(value){
 volume=Math.max(0,Math.min(100,Math.round(Number(value)||0)));
 for(const audio of shotPool)audio.volume=volume/100;
 try{localStorage.setItem(SFX_VOLUME_KEY,String(volume));}catch{}
}
export function playPlayerShot(){
 if(!enabled||volume===0)return;
 const available=shotPool.find(audio=>audio.paused||audio.ended);
 const audio=available||shotPool[nextShot++%shotPool.length];
 try{
  audio.currentTime=0;
  const playing=audio.play();
  if(playing&&typeof playing.catch==='function')playing.catch(()=>{});
 }catch{}
}
