
// Global festive effects: every interactive button gets a bright burst.
const fxLayer = document.createElement("div");
fxLayer.className = "celebration-fx";
fxLayer.setAttribute("aria-hidden", "true");
document.body.appendChild(fxLayer);

function burstAt(x, y, amount = 30, spread = 170) {
  const palette = ["#ffe5a6", "#ffc45c", "#f6a7d7", "#b9a0ff", "#fff8df", "#ff9b72", "#9fe7ff"];
  // Bright central flash makes each burst feel like a complete firecracker.
  const flash = document.createElement("i");
  flash.className = "burst-flash";
  flash.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:14px;height:14px;border-radius:50%;background:#fff7d7;box-shadow:0 0 22px 12px #ffc45c;transform:translate(-50%,-50%);animation:burstFlash 520ms ease-out forwards`;
  fxLayer.appendChild(flash);
  flash.addEventListener("animationend", () => flash.remove(), { once: true });

  for (let i = 0; i < amount; i++) {
    const particle = document.createElement("i");
    particle.className = "burst-particle";
    const angle = Math.random() * Math.PI * 2;
    const distance = spread * (.35 + Math.random() * .85);
    particle.style.setProperty("--x", `${x}px`);
    particle.style.setProperty("--y", `${y}px`);
    particle.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    particle.style.setProperty("--color", palette[i % palette.length]);
    particle.style.setProperty("--size", `${3 + Math.random() * 5}px`);
    particle.style.setProperty("--duration", `${750 + Math.random() * 650}ms`);
    fxLayer.appendChild(particle);
    particle.addEventListener("animationend", () => particle.remove(), { once: true });
  }
}

function launchRocket(targetX = Math.random() * window.innerWidth,
                      targetY = 80 + Math.random() * window.innerHeight * .55) {
  const rocket = document.createElement("i");
  rocket.className = "rocket-trail";
  const startX = Math.random() * window.innerWidth;
  const startY = window.innerHeight + 30;
  const angle = Math.atan2(targetY - startY, targetX - startX) * 180 / Math.PI;
  rocket.style.setProperty("--start-x", `${startX}px`);
  rocket.style.setProperty("--start-y", `${startY}px`);
  rocket.style.setProperty("--end-x", `${targetX}px`);
  rocket.style.setProperty("--end-y", `${targetY}px`);
  rocket.style.setProperty("--rocket-angle", `${angle}deg`);
  fxLayer.appendChild(rocket);
  rocket.addEventListener("animationend", () => {
    burstAt(targetX, targetY, 76, 230);
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
  // Fireworks launch from across the bottom and burst at different points
  // throughout the full browser viewport, not inside the decorative sky panel.
  for(let i=0;i<9;i++){
    setTimeout(()=>launchRocket(
      window.innerWidth * (.08 + Math.random() * .84),
      window.innerHeight * (.10 + Math.random() * .62)
    ), i * 150);
  }
  // Add two immediate, broad bursts to fill the screen with sparkle.
  setTimeout(()=>burstAt(window.innerWidth*.22,window.innerHeight*.32,58,210),360);
  setTimeout(()=>burstAt(window.innerWidth*.78,window.innerHeight*.42,58,210),620);
  sparks++;$("sparkCount").textContent=`${sparks} FULL-SCREEN FIREWORK SHOW${sparks===1?"":"S"} — KEEP SHINING`;
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


// Grand finale: warm glow, falling festive confetti and a final rocket salute.
function launchFinaleCelebration(){
  document.querySelector(".final-screen-glow")?.remove();
  const glow=document.createElement("div");glow.className="final-screen-glow";document.body.appendChild(glow);
  const colors=["#ffe5a6","#ffc45c","#f6a7d7","#b9a0ff","#fff8df","#ff9b72"];
  for(let i=0;i<115;i++){
    const bit=document.createElement("i");bit.className="finale-confetti";
    bit.style.setProperty("--left",`${Math.random()*100}vw`);bit.style.setProperty("--w",`${3+Math.random()*5}px`);
    bit.style.setProperty("--h",`${5+Math.random()*9}px`);bit.style.setProperty("--c",colors[i%colors.length]);
    bit.style.setProperty("--t",`${3.5+Math.random()*4}s`);bit.style.setProperty("--drift",`${-90+Math.random()*180}px`);
    bit.style.setProperty("--spin",`${360+Math.random()*900}deg`);document.body.appendChild(bit);
    bit.addEventListener("animationend",()=>bit.remove(),{once:true});
  }
  for(let i=0;i<11;i++)setTimeout(()=>launchRocket(window.innerWidth*(.08+Math.random()*.84),window.innerHeight*(.12+Math.random()*.55)),i*210);
}
const originalShowScreen=showScreen;
showScreen=function(id){originalShowScreen(id);if(id==="finalScreen")launchFinaleCelebration();else document.querySelector(".final-screen-glow")?.remove();};
