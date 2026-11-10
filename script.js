
// Global festive effects: every interactive button gets a bright burst.
const fxLayer = document.createElement("div");
fxLayer.className = "celebration-fx";
fxLayer.setAttribute("aria-hidden", "true");
document.body.appendChild(fxLayer);

function burstAt(x, y, amount = 30) {
  const palette = ["#ffe5a6", "#ffc45c", "#f6a7d7", "#b9a0ff", "#fff8df", "#ff9b72"];
  for (let i = 0; i < amount; i++) {
    const particle = document.createElement("i");
    particle.className = "burst-particle";
    const angle = Math.random() * Math.PI * 2;
    const distance = 35 + Math.random() * 105;
    particle.style.setProperty("--x", `${x}px`);
    particle.style.setProperty("--y", `${y}px`);
    particle.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    particle.style.setProperty("--color", palette[i % palette.length]);
    particle.style.setProperty("--size", `${3 + Math.random() * 4}px`);
    particle.style.setProperty("--duration", `${650 + Math.random() * 500}ms`);
    fxLayer.appendChild(particle);
    particle.addEventListener("animationend", () => particle.remove(), { once: true });
  }
}

function launchRocket(y = 50 + Math.random() * 40) {
  const rocket = document.createElement("i");
  rocket.className = "rocket-trail";
  rocket.style.setProperty("--rocket-y", `${y}vh`);
  rocket.style.setProperty("--rocket-angle", `${-13 + Math.random() * 22}deg`);
  fxLayer.appendChild(rocket);
  rocket.addEventListener("animationend", () => {
    const rect = rocket.getBoundingClientRect();
    burstAt(Math.min(window.innerWidth - 30, window.innerWidth * (.72 + Math.random() * .2)),
            rect.top + 8, 42);
    rocket.remove();
  }, { once: true });
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button, [role='button'], a");
  if (!target) return;
  const rect = target.getBoundingClientRect();
  burstAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 26);
});

// Let the main celebration button send several rockets across the whole viewport.
document.addEventListener("click", (event) => {
  if (event.target.closest("#sparkBtn")) {
    [12, 28, 45, 63, 79].forEach((y, index) => setTimeout(() => launchRocket(y), index * 190));
  }
});

const $ = id => document.getElementById(id);
const screens = ["welcome","diyaScreen","fireworksScreen","wishScreen","dakshinaScreen","finalScreen"];
const audio = $("tiharAudio");
let songStarted = false;
function showScreen(id){screens.forEach(s=>$(s).classList.toggle("active",s===id));window.scrollTo({top:0,behavior:"smooth"});}
function updateSound(){const playing=!audio.paused;$("soundDot").classList.toggle("on",playing);$("soundLabel").textContent=playing?"MUSIC PLAYING":"SOUND OFF";}
$("startBtn").addEventListener("click",async()=>{
  showScreen("diyaScreen");
  try{await audio.play();songStarted=true;updateSound();}catch(e){$("soundLabel").textContent="ADD YOUR SONG FILE";}
});
audio.addEventListener("play",updateSound);audio.addEventListener("pause",updateSound);
audio.addEventListener("ended",()=>{updateSound(); if(!$("dakshinaScreen").classList.contains("active")&&!$("finalScreen").classList.contains("active")) showScreen("dakshinaScreen");});
$("diyaBtn").addEventListener("click",()=>{$("diyaBtn").classList.add("lit");$("diyaHint").textContent="A LITTLE LIGHT CAN CHANGE EVERYTHING";$("toFireworks").classList.remove("hidden");});
$("toFireworks").addEventListener("click",()=>showScreen("fireworksScreen"));
let sparks=0;
$("sparkBtn").addEventListener("click",()=>{
  const sky=$("sky");
  for(let i=0;i<24;i++){const p=document.createElement("i");p.className="spark";p.style.left=(8+Math.random()*84)+"%";p.style.top=(10+Math.random()*78)+"%";p.style.animationDelay=(Math.random()*.35)+"s";p.style.background=["#ffe2a1","#f6a7d7","#a9d8ff","#fff3cb"][i%4];sky.appendChild(p);setTimeout(()=>p.remove(),1800);}
  sparks++;$("sparkCount").textContent=`${sparks} LITTLE BURST${sparks===1?"":"S"} OF JOY — KEEP SHINING`;
});
$("toWish").addEventListener("click",()=>showScreen("wishScreen"));
$("wishForm").addEventListener("submit",e=>{
  e.preventDefault();const name=$("wishName").value.trim();const wish=$("wishText").value.trim();if(!wish)return;
  $("wishResponse").textContent=`${name?name+", ":""}May this wish find its way to you. May your hard work bring success, your days bring happiness, and your home always be filled with peace. ✨`;
  $("wishResponse").classList.remove("hidden");$("toDakshina").classList.remove("hidden");
});
$("toDakshina").addEventListener("click",()=>{showScreen("dakshinaScreen");});
$("finishBtn").addEventListener("click",()=>{audio.pause();showScreen("finalScreen");});
$("replayBtn").addEventListener("click",()=>{audio.currentTime=0;showScreen("welcome");updateSound();});
$("qrImage").addEventListener("load",()=>{$("qrImage").classList.remove("hidden");$("qrPlaceholder").classList.add("hidden");});
$("qrImage").addEventListener("error",()=>{$("qrImage").classList.add("hidden");$("qrPlaceholder").classList.remove("hidden");});
// A two-minute fallback reveals Dakshina even if the supplied track is longer.
let revealTimer;
$("startBtn").addEventListener("click",()=>{clearTimeout(revealTimer);revealTimer=setTimeout(()=>{if(!$("finalScreen").classList.contains("active"))showScreen("dakshinaScreen");},120000);});
