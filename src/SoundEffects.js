// Short overlapping shots are allowed; each shot has its own playback instance.
const SHOT_URL='./assets/zapsplat_multimedia_game_sound_simple_sci_fi_gunshot_114682.mp3';
const shotPool=Array.from({length:5},()=>{
 const audio=new Audio(SHOT_URL);
 audio.preload='auto';
 audio.volume=0.55;
 return audio;
});
let nextShot=0;
export function playPlayerShot(){
 const available=shotPool.find(audio=>audio.paused||audio.ended);
 const audio=available||shotPool[nextShot++%shotPool.length];
 try{
  audio.currentTime=0;
  const playing=audio.play();
  if(playing&&typeof playing.catch==='function')playing.catch(()=>{});
 }catch{}
}
