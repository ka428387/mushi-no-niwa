'use strict';
/* app.js — システム（Claude Code 担当）：音・虫の動き・保存・ボタンの動き。見た目は art.js / style.css */
// ───────── 虫の種類 ─────────

const SPECIES={
  suzumushi:{name:'スズムシ',voice:'リーン、リーン',freq:4000,am:[62,.5],gain:.32,
    desc:'平安時代から声を楽しまれてきた鳴く虫の代表。江戸時代には飼育して売り歩く「虫売り」もいた。翅を立ててこすり合わせて鳴く。',
    phrase(v,t,k){let T=t;const n=ri(2,4);for(let i=0;i<n;i++){const d=rr(.26,.34)/Math.sqrt(k);v.glide(T,T+d,.985,1);v.tone(T,d,1,.03,.09);T+=d+.2/k}return T-t+rr(.6,2.2)/k}},
  emma:{name:'エンマコオロギ',voice:'コロコロリー',freq:3700,am:[45,.4],gain:.34,
    desc:'日本で最も大きなコオロギの仲間。顔つきが閻魔さまに似ていることから名がついた。草むらや畑のすみでよく鳴いている。',
    phrase(v,t,k){let T=t;v.freq(T,1);const P=m=>{for(let j=0;j<m;j++){v.tone(T,.022,.9,.003,.008);T+=Math.max(.026,.037/k)}};
      P(ri(3,4));T+=.05/k;P(ri(3,4));T+=.07/k;const d=.3/Math.sqrt(k);v.glide(T,T+d,1,.97);v.tone(T,d,1,.02,.1);T+=d;return T-t+rr(.5,1.6)/k}},
  matsumushi:{name:'マツムシ',voice:'チンチロリン',freq:3100,am:[30,.2],gain:.34,
    desc:'ススキなどの草原にすむ。声はよく知られているのに、姿を見たことのある人は少ない。和歌や唱歌にも多く登場する。',
    phrase(v,t,k){let T=t;v.freq(T,1);v.tone(T,.07,1,.004,.05);T+=.16/k;v.freq(T,1.07);v.tone(T,.035,.8,.003,.02);T+=Math.max(.04,.055/k);
      v.freq(T,1);v.tone(T,.035,.8,.003,.02);T+=.07/k;v.freq(T,1.1);v.tone(T,.2,.9,.004,.16);T+=.2;return T-t+rr(1.1,2.3)/k}},
  kantan:{name:'カンタン',voice:'ルルルルル…',freq:2150,am:[48,.85],gain:.38,
    desc:'淡い緑色の細い体で「鳴く虫の女王」とも呼ばれる。クズなどの葉の上で、やわらかく長く鳴き続ける。',
    phrase(v,t,k){const d=rr(1.8,4.5);v.freq(t,1);v.glide(t,t+d,1,.99);v.tone(t,d,1,.35,.6);return d+rr(.6,2)/k}},
  kutsuwa:{name:'クツワムシ',voice:'ガチャガチャ',freq:2800,noise:true,q:1.3,am:[110,.9],gain:.3,
    desc:'馬の口につける轡（くつわ）が鳴る音に似ていることから名がついた。大型のキリギリスの仲間で、声もにぎやか。',
    phrase(v,t,k){let T=t;const n=ri(8,18);for(let i=0;i<n;i++){v.tone(T,.045,.55,.003,.02);T+=Math.max(.05,.06/k);v.tone(T,.075,1,.004,.03);T+=Math.max(.085,.13/k)}return T-t+rr(2.5,6)/k}},
  umaoi:{name:'ウマオイ',voice:'スイーッチョン',freq:3600,am:[90,.55],gain:.3,
    desc:'馬を追う馬子（まご）の声に聞こえることから名がついた。ほかの虫を食べる肉食の虫で、林のへりの草木で鳴く。',
    phrase(v,t,k){let T=t;const n=ri(1,3);for(let i=0;i<n;i++){const d=.32;v.glide(T,T+d,.93,1.03);v.tone(T,d,.9,.22,.03);T+=d+.1/k;v.freq(T,1.12);v.tone(T,.06,1,.003,.04);T+=.06+.45/k}return T-t+rr(1,2.5)/k}},
  kanetataki:{name:'カネタタキ',voice:'チッ、チッ、チッ',freq:4500,am:[1,0],gain:.3,
    desc:'鉦（かね）をたたく音にたとえられる。体長1cmほどの小さな虫で、生け垣や木の上で鳴く。声はするのに見つけにくい。',
    phrase(v,t,k){let T=t;const n=ri(4,11);for(let i=0;i<n;i++){v.tone(T,.024,1,.006,.016);T+=rr(.26,.32)/k}return T-t+rr(3,8)/k}},
  kusahibari:{name:'クサヒバリ',voice:'フィリリリリ…',freq:5000,am:[70,.6],gain:.2,shy:true,
    desc:'体長7mmほどの小さなコオロギの仲間。ヒバリのように澄んだ声で、昼間にも鳴く。とても臆病で、近づくとすぐ黙る。',
    phrase(v,t,k){const d=rr(1,2.4);v.tone(t,d,1,.05,.15);return d+rr(.5,1.3)/k}},
  tsuzure:{name:'ツヅレサセコオロギ',voice:'リッ、リッ、リッ…',freq:3700,am:[38,.5],gain:.3,
    desc:'人家のまわりにも多い、晩秋まで鳴く身近なコオロギ。昔の人はこの声を「肩刺せ、綴れ刺せ（冬に備えて着物をつくろえ）」と聞きなした。',
    phrase(v,t,k){let T=t;const n=ri(8,20);for(let i=0;i<n;i++){v.tone(T,.08,1,.01,.03);T+=rr(.26,.3)/k}return T-t+rr(1,3)/k}},
  kirigirisu:{name:'キリギリス',voice:'ギーッ、チョン',freq:3000,noise:true,q:2,am:[150,.85],gain:.3,
    desc:'夏から初秋の草原で鳴く大型の虫。古い和歌の「きりぎりす」は、今のコオロギのことだったといわれている。',
    phrase(v,t,k){let T=t;const n=ri(2,5);for(let i=0;i<n;i++){const d=.26/Math.sqrt(k);v.freq(T,1);v.tone(T,d,1,.03,.05);T+=d+.07/k;v.freq(T,1.2);v.tone(T,.05,.8,.006,.03);T+=.05+.55/k}return T-t+rr(1.5,3.5)/k}},
  aomatsu:{name:'アオマツムシ',voice:'リーリーリー',freq:4000,am:[55,.35],gain:.26,
    desc:'明治時代に日本に入ったとされる外来の虫。街路樹や公園の木の上で、にぎやかに鳴く。いまでは都会の秋の音になっている。',
    phrase(v,t,k){let T=t;const n=ri(6,14);for(let i=0;i<n;i++){const d=.17/Math.sqrt(k);v.glide(T,T+d,.99,1.01);v.tone(T,d,1,.02,.05);T+=d+.11/k}return T-t+rr(.8,2)/k}},
  kumasuzu:{name:'クマスズムシ',voice:'ジジジジ…',freq:3600,noise:true,q:3,am:[130,.9],gain:.22,
    desc:'体長7mmほどの黒い小さな虫。名前にスズムシとあるが、スズムシとは別の仲間。落ち葉の間など地面の近くで、細かく鳴く。',
    phrase(v,t,k){const d=rr(1,3);v.tone(t,d,1,.08,.2);return d+rr(1,3)/k}},
  tsuyumushi:{name:'ツユムシ',voice:'チッ…チキチキチキ',freq:3900,am:[1,0],gain:.22,
    desc:'細長い体で、よく飛ぶ。声は小さく控えめで、つぶやくように鳴く。ほかの虫の声のすき間から聞こえてくる。',
    phrase(v,t,k){let T=t;const n=ri(1,3);for(let i=0;i<n;i++){v.freq(T,1);v.tone(T,.03,.8,.006,.02);T+=rr(.5,.9)/k}
      if(Math.random()<.6){const m=ri(4,9);v.freq(T,1.05);for(let j=0;j<m;j++){v.tone(T,.025,1,.006,.015);T+=.07/k}}return T-t+rr(2,5)/k}},
  kayakiri:{name:'カヤキリ',voice:'ジーーーー',freq:2300,noise:true,q:1.6,am:[190,.7],gain:.2,
    desc:'日本最大級のキリギリスの仲間。ススキなどカヤの草原で、太く長い声で鳴き続ける。ほかの虫の声を下から支える音。',
    phrase(v,t,k){const d=rr(4,10);v.tone(t,d,1,.3,.5);return d+rr(2,5)/k}},
};
const SP_KEYS=Object.keys(SPECIES);
for(const k of SP_KEYS)Object.assign(SPECIES[k],SPECIES_LOOK[k]); // 見た目（大きさなど）は art.js

const AREAS={
  kusamura:{name:'秋の野原',n:7,
    w:{emma:5,suzumushi:4,tsuzure:3,kanetataki:2,matsumushi:1,kumasuzu:1,kusahibari:1}},
  kawara:{name:'河原のススキ原',n:7,
    w:{matsumushi:4,emma:3,kutsuwa:2,kirigirisu:2,kayakiri:2,suzumushi:1,kusahibari:1}},
  hayashi:{name:'雑木林のへり',n:6,
    w:{kantan:4,umaoi:3,kanetataki:3,kutsuwa:2,tsuyumushi:2,kumasuzu:1,kusahibari:1}},
  kouen:{name:'街の公園',n:7,
    w:{aomatsu:5,tsuzure:4,emma:3,kanetataki:2,tsuyumushi:1,kumasuzu:1}},
};
for(const k in AREAS)Object.assign(AREAS[k],AREA_LOOK[k],{horizon:HORIZON[k]}); // 見た目は art.js、地平線は art-fit.js

// ───────── 保存 ─────────
// ?selftest のときは自動テスト（本物のデータとは別の保存場所を使う）
const SELFTEST=/[?&]selftest\b/.test(location.search);
const KEY=SELFTEST?'mushinoniwa.selftest':'mushinoniwa.v1';
if(SELFTEST)try{localStorage.removeItem(KEY)}catch(e){}
const S=Object.assign({bugs:[],nextId:1,seen:{},settings:{temp:22,depth:.7,wind:.35,vol:.8},area:'kusamura'},(()=>{try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return{}}})());
S.settings=Object.assign({temp:22,depth:.7,wind:.35,vol:.8,soft:.6,weather:'clear'},S.settings);
if(S.settings.weather==='heavy')S.settings.weather='light';
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const GARDEN_MAX=12;
const inGarden=()=>S.bugs.filter(b=>b.garden);

function traits(b){const t=[];t.push(b.pitch<.98?'低めの声':b.pitch>1.02?'高めの声':'ふつうの声');t.push(b.rate>1.04?'せっかち':b.rate<.96?'のんびり屋':'マイペース');return t.join('・')}

// ───────── 音 ─────────
let revOut,gardenRev,rainRev,rainBus,rainHiss,lowpass,shelf,ac,master,reverbIn,fieldBus,gardenBus,previewBus,noiseBuf,windGain,playing=true;
function makeIR(sec){const n=ac.sampleRate*sec,b=ac.createBuffer(2,n,ac.sampleRate);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,3.2)}return b}
function initAudio(){
  const AC=window.AudioContext||window.webkitAudioContext;ac=new AC();
  try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch(e){}
  master=ac.createGain();master.gain.value=S.settings.vol;
  lowpass=ac.createBiquadFilter();lowpass.type='lowpass';lowpass.Q.value=.5;
  shelf=ac.createBiquadFilter();shelf.type='highshelf';shelf.frequency.value=3500;setSoft(S.settings.soft);
  const comp=ac.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=3;
  master.connect(lowpass);lowpass.connect(shelf);shelf.connect(comp);comp.connect(ac.destination);
  const rev=ac.createConvolver();rev.buffer=makeIR(3.2);reverbIn=ac.createGain();reverbIn.gain.value=S.settings.depth;reverbIn.connect(rev);revOut=ac.createGain();rev.connect(revOut);revOut.connect(master);
  gardenRev=ac.createGain();gardenRev.connect(reverbIn);rainRev=ac.createGain();rainRev.connect(reverbIn); // 庭の虫・雨の響きは、図鑑の試聴中に小さくできるよう別の道を通す
  fieldBus=ac.createGain();gardenBus=ac.createGain();previewBus=ac.createGain();[fieldBus,gardenBus,previewBus].forEach(b=>b.connect(master));
  noiseBuf=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate);{const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
  // 風：ブラウンノイズ寄りの低い音にゆっくりした揺らぎ
  const wb=ac.createBuffer(2,ac.sampleRate*4,ac.sampleRate);for(let c=0;c<2;c++){const d=wb.getChannelData(c);let l=0;for(let i=0;i<d.length;i++){l=(l+.02*(Math.random()*2-1))/1.02;d[i]=l*3.5}}
  const ws=ac.createBufferSource();ws.buffer=wb;ws.loop=true;const wl=ac.createBiquadFilter();wl.type='lowpass';wl.frequency.value=700;
  const gust=ac.createGain();gust.gain.value=.6;const glfo=ac.createOscillator();glfo.frequency.value=.07;const glg=ac.createGain();glg.gain.value=.4;glfo.connect(glg);glg.connect(gust.gain);glfo.start();
  windGain=ac.createGain();windGain.gain.value=S.settings.wind*.5;ws.connect(wl);wl.connect(gust);gust.connect(windGain);windGain.connect(master);ws.start();
  // 雨：葉にあたるサーッという音（高すぎないよう帯域を絞る）
  rainBus=ac.createGain();rainBus.gain.value=0;rainBus.connect(master);
  const rb=ac.createBuffer(2,ac.sampleRate*3,ac.sampleRate);for(let c=0;c<2;c++){const d=rb.getChannelData(c);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
  const rs=ac.createBufferSource();rs.buffer=rb;rs.loop=true;const rhp=ac.createBiquadFilter();rhp.type='highpass';rhp.frequency.value=450;
  const rlp=ac.createBiquadFilter();rlp.type='lowpass';rlp.frequency.value=3200;rlp.Q.value=.4;rainHiss=ac.createGain();rainHiss.gain.value=0;
  rs.connect(rhp);rhp.connect(rlp);rlp.connect(rainHiss);rainHiss.connect(rainBus);rs.start();
  rainLvl=RAIN_T[S.settings.weather];
  setInterval(tick,60);
}
function setSoft(v,now){const t=now||0;lowpass.frequency.setTargetAtTime(9500-5000*v,t,.05);shelf.gain.setTargetAtTime(-2-9*v,t,.05)}
// ───────── 雨 ─────────
const RAIN_T={clear:0,light:.45};
let rainLvl=0,nextDrop=0,nextDrip=0,dripUntil=0;
function drop(t,lvl){ // 雨粒：高さのない、こもった「パツ」
  const n=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain(),p=ac.createStereoPanner();
  n.buffer=noiseBuf;f.type='bandpass';f.frequency.value=rr(500,1400);f.Q.value=rr(.8,1.4);
  const a=rr(.02,.06)*(.6+.4*lvl),d=rr(.018,.035);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(a,t+.002);g.gain.exponentialRampToValueAtTime(.0001,t+d);p.pan.value=rr(-.9,.9);
  n.connect(f);f.connect(g);g.connect(p);p.connect(rainBus);n.start(t,Math.random()*1.8,d+.01)}
function drip(t){ // 軒先のしずく：左手前で低く短い「ポタ」
  const o=ac.createOscillator(),g=ac.createGain(),p=ac.createStereoPanner(),f=rr(360,440);
  o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*.85,t+.06);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+.12);
  const n=ac.createBufferSource(),nf=ac.createBiquadFilter(),ng=ac.createGain(); // 着地の「タ」
  n.buffer=noiseBuf;nf.type='bandpass';nf.frequency.value=900;nf.Q.value=1;ng.gain.setValueAtTime(.03,t);ng.gain.exponentialRampToValueAtTime(.0001,t+.02);
  p.pan.value=-.55;const sd=ac.createGain();sd.gain.value=.15;
  o.connect(g);n.connect(nf);nf.connect(ng);ng.connect(p);g.connect(p);p.connect(rainBus);g.connect(sd);sd.connect(rainRev);
  o.start(t);o.stop(t+.14);n.start(t,Math.random()*1.8,.03)}
function rainTick(){const now=ac.currentTime,h=now+.3,tgt=RAIN_T[S.settings.weather];
  rainLvl+=(tgt-rainLvl)*.02; // 約3秒かけて強まる・弱まる
  rainHiss.gain.setTargetAtTime(.05*rainLvl+.12*rainLvl*rainLvl,now,.3);
  if(nextDrop<now)nextDrop=now;
  while(rainLvl>.03&&nextDrop<h){drop(nextDrop,rainLvl);nextDrop+=-Math.log(1-Math.random())/(2+14*rainLvl)}
  if(tgt>0&&rainLvl>.2)dripUntil=now+90; // 雨がやんでも90秒ほど、しずくが残る
  if(now<dripUntil){const fade=tgt>0?1:(dripUntil-now)/90;if(nextDrip<now)nextDrip=now+rr(.3,1);
    while(nextDrip<h){if(Math.random()<.35+.65*fade)drip(nextDrip);nextDrip+=rr(.9,2.4)/(.4+.6*fade)}}}
function setWeather(w){if(S.settings.weather===w)return;S.settings.weather=w;save();renderWeather()}
function renderWeather(){const el=document.getElementById('weather');el.innerHTML='';for(const[k,l]of[['clear','晴れ'],['light','小雨']]){
  const b=document.createElement('button');b.textContent=l;b.className=S.settings.weather===k?'on':'';b.onclick=()=>setWeather(k);el.appendChild(b)}}
renderWeather();
// ───────── 月（実際の月齢） ─────────
const SYNODIC=29.530588853,NEW_MOON_REF=Date.UTC(2000,0,6,18,14);
function moonAge(){return(((Date.now()-NEW_MOON_REF)/864e5)%SYNODIC+SYNODIC)%SYNODIC}
function moonInfo(){const age=moonAge(),p=age/SYNODIC,illum=(1-Math.cos(2*Math.PI*p))/2;
  const names=[[1.5,'新月'],[4,'三日月'],[6.5,'夕月'],[9,'上弦の月'],[11,'十日夜の月'],[13.3,'十三夜の月'],[16,'満月'],[17.3,'十六夜の月'],[20,'寝待月'],[23.5,'下弦の月'],[27.5,'有明の月'],[99,'新月']];
  return{age,p,illum,name:names.find(n=>age<n[0])[1]}}
function litPath(c,x,y,r,m){const waxing=m.p<.5,k=Math.cos(2*Math.PI*m.p);c.beginPath();c.arc(x,y,r,-Math.PI/2,Math.PI/2,!waxing);c.ellipse(x,y,r*Math.abs(k),r,0,Math.PI/2,-Math.PI/2,waxing?k>0:k<=0)}
function drawArtMoon(c,img,rect,d,m,hide=0){
  const x=rect.x+d.x*rect.w,y=rect.y+d.y*rect.h,r=d.r*rect.w,R=r*1.06,dim=(1-m.illum)*.9;
  if(dim>.01){const g=c.createRadialGradient(x,y,R,x,y,r*2.9);g.addColorStop(0,rgba(d.sky,dim));g.addColorStop(1,rgba(d.sky,0));c.fillStyle=g;c.beginPath();c.arc(x,y,r*2.9,0,7);c.fill()} // 新月に近いほど光の輪を弱める
  c.fillStyle=mixHex(d.rim,d.sky,1-m.illum);c.beginPath();c.arc(x,y,R,0,7);c.fill(); // 欠けている側
  if(m.illum>.005){c.save();litPath(c,x,y,R,m);c.clip();c.drawImage(img,rect.x,rect.y,rect.w,rect.h);c.restore()} // 光っている側は元の絵
  if(hide>.01){const g=c.createRadialGradient(x,y,0,x,y,r*3);g.addColorStop(0,rgba(d.sky,hide));g.addColorStop(.5,rgba(d.sky,hide*.8));g.addColorStop(1,rgba(d.sky,0));c.fillStyle=g;c.beginPath();c.arc(x,y,r*3,0,7);c.fill()} // 雨雲
}
const tempo=()=>clamp(1+(S.settings.temp-22)*.045,.6,1.45);

class Voice{
  constructor(spKey,ind,bus){
    const sp=SPECIES[spKey];this.sp=sp;this.ind=ind;this.marks=[];this.lastEnd=0;this.silentUntil=0;this.muted=false;
    this.env=ac.createGain();this.env.gain.value=0;
    this.am=ac.createGain();const[amf,amd]=sp.am;this.am.gain.value=1-amd/2;
    this.lfo=ac.createOscillator();this.lfo.frequency.value=amf;const lg=ac.createGain();lg.gain.value=amd/2;this.lfo.connect(lg);lg.connect(this.am.gain);this.lfo.start();
    this.base=sp.freq*(ind.pitch||1);
    if(sp.noise){this.src=ac.createBufferSource();this.src.buffer=noiseBuf;this.src.loop=true;const f=ac.createBiquadFilter();f.type='bandpass';f.frequency.value=this.base;f.Q.value=sp.q;this.src.connect(f);f.connect(this.am);this.fp=f.frequency;this.src.start(0,Math.random()*1.5)}
    else{this.src=ac.createOscillator();this.src.frequency.value=this.base;this.src.connect(this.am);this.fp=this.src.frequency;this.src.start()}
    this.am.connect(this.env);
    const lvl=ac.createGain();lvl.gain.value=sp.gain;this.env.connect(lvl);
    this.out=ac.createGain();this.out.gain.value=0;lvl.connect(this.out);
    this.pan=ac.createStereoPanner();this.out.connect(this.pan);this.pan.connect(bus);
    this.send=ac.createGain();this.send.gain.value=.3;this.out.connect(this.send);this.send.connect(bus===gardenBus?gardenRev:reverbIn);
    this.nodes=[this.env,this.am,lg,lvl,this.out,this.pan,this.send];
    this.nextT=ac.currentTime+.1+Math.random()*2.5;
  }
  k(){return tempo()*(this.ind.rate||1)}
  tone(t,d,a,att,rel){t=Math.max(t,this.lastEnd+.002);att=Math.min(Math.max(att,.007),d*.4);rel=Math.min(Math.max(rel,.014),d-att);const g=this.env.gain;
    g.setValueAtTime(0,t);g.linearRampToValueAtTime(a,t+att);g.setValueAtTime(a,t+d-rel);g.linearRampToValueAtTime(0,t+d);this.lastEnd=t+d;this.marks.push([t,t+d])}
  freq(t,r){this.fp.setValueAtTime(this.base*r,Math.max(t,this.lastEnd))}
  glide(t0,t1,r0,r1){t0=Math.max(t0,this.lastEnd);this.fp.setValueAtTime(this.base*r0,t0);this.fp.linearRampToValueAtTime(this.base*r1,Math.max(t1,t0+.01))}
  schedule(h){
    const now=ac.currentTime;if(this.nextT<now)this.nextT=now+.05;
    while(this.nextT<h){
      if(this.muted||now<this.silentUntil){this.nextT=Math.max(this.nextT+.3,this.silentUntil);continue}
      const k=this.k(),ps=this.partners?this.partners():[];
      // 掛け合い：近くの仲間が鳴いている間は待ち、鳴き終わりに合わせて返す
      let wait=0;for(const p of ps)if(p.lastEnd>this.nextT-.05)wait=Math.max(wait,p.lastEnd);
      if(wait){this.nextT=wait+rr(.08,.25)/k;continue}
      this.nextT+=Math.max(.2,this.sp.phrase(this,this.nextT,k));
      for(const p of ps)if(p.nextT>this.lastEnd+1&&Math.random()<.6)p.nextT=this.lastEnd+rr(.1,.35)/k;
    }
    this.lfo.frequency.setTargetAtTime(this.sp.am[0]*Math.sqrt(this.k()),now,.3);
  }
  singing(now){while(this.marks.length&&this.marks[0][1]<now)this.marks.shift();return this.marks.length>0&&this.marks[0][0]<=now}
  hush(sec){const now=ac.currentTime;this.silentUntil=now+sec;this.env.gain.cancelScheduledValues(now);this.env.gain.setTargetAtTime(0,now,.03);
    this.fp.cancelScheduledValues(now);this.lastEnd=now+.1;this.marks=[];this.nextT=this.silentUntil+rr(0,.8)}
  setMuted(m){this.muted=m;if(m)this.hush(0);else this.nextT=ac.currentTime+.2}
  stop(){const now=ac.currentTime;this.out.gain.cancelScheduledValues(now);this.out.gain.setTargetAtTime(0,now,.08);this.dead=true;
    setTimeout(()=>{try{this.src.stop();this.lfo.stop()}catch(e){}this.nodes.forEach(n=>n.disconnect())},600)}
}

function sfx(kind){if(!ac)return;const t=ac.currentTime;
  if(kind==='swish'){const s=ac.createBufferSource();s.buffer=noiseBuf;const f=ac.createBiquadFilter();f.type='bandpass';f.Q.value=.8;f.frequency.setValueAtTime(600,t);f.frequency.exponentialRampToValueAtTime(2400,t+.18);
    const g=ac.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.25,t+.05);g.gain.linearRampToValueAtTime(0,t+.22);s.connect(f);f.connect(g);g.connect(master);s.start(t);s.stop(t+.3)}
  if(kind==='catch'){[880,1320,1760].forEach((fr,i)=>{const o=ac.createOscillator();o.type='triangle';o.frequency.value=fr;const g=ac.createGain();const s=t+i*.09;g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(.08,s+.01);g.gain.exponentialRampToValueAtTime(.001,s+.9);o.connect(g);g.connect(master);g.connect(reverbIn);o.start(s);o.stop(s+1)})}
}


// ───────── 探す ─────────
const fc=document.getElementById('fc');
const F={bugs:[],blades:[],lx:0,ly:0,tx:0,ty:0,speed:0,W:0,H:0,respawn:[],net:null,down:null,active:false};
function pickSpecies(){const w=AREAS[S.area].w;let sum=0;for(const k in w)sum+=w[k];let r=Math.random()*sum;for(const k in w){r-=w[k];if(r<=0)return k}return Object.keys(w)[0]}
function spawnBug(){const m=40;let x,y,tries=0;do{x=rr(m,F.W-m);y=rr(fieldGroundY(),F.H-m);tries++}while(tries<20&&(Math.hypot(x-F.lx,y-F.ly)<160||F.bugs.some(b=>Math.hypot(b.x-x,b.y-y)<70)));
  const sp=pickSpecies();const ind={pitch:1+(Math.random()+Math.random()-1)*.04,rate:1+(Math.random()+Math.random()-1)*.08};
  F.bugs.push({sp,x,y,ind,voice:new Voice(sp,ind,fieldBus)})}
// 背景や虫の絵が読み込めたら描き直す（art.js が知らせる）
document.addEventListener('izayoi:artload',e=>{const{kind,key}=e.detail;
  if(kind==='area'&&F.active&&S.area===key){buildBlades();F.bugs.forEach(b=>{b.y=clamp(b.y,fieldGroundY(),F.H-30)})}
  if(kind==='bug'){renderZukan();renderBench()}});
function artGroundY(img,frac,W,H,px=.5){if(img&&img.complete&&img.naturalWidth){const r=coverRect(img,W,H,px,.5);return r.y+frac*r.h}return frac*H}
function fieldGroundY(){return clamp(artGroundY(AREA_ART[S.area],AREAS[S.area].horizon,F.W,F.H,artPosX()),20,F.H-90)}
function buildBlades(){const s=buildFieldScenery(S.area,F.W,F.H,fieldGroundY());F.blades=s.blades;F.trees=s.trees}
function enterField(){F.active=true;const{W,H}=fitCanvas(fc);F.W=W;F.H=H;F.lx=F.tx=W/2;F.ly=F.ty=H*.6;buildBlades();
  F.bugs.forEach(b=>b.voice.stop());F.bugs=[];F.respawn=[];for(let i=0;i<AREAS[S.area].n;i++)spawnBug()}
function leaveField(){F.active=false;F.bugs.forEach(b=>b.voice.stop());F.bugs=[]}
function fieldLocal(e){const r=fc.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
fc.addEventListener('pointerdown',e=>{const p=fieldLocal(e);F.down={x:p.x,y:p.y,moved:false};if(e.pointerType!=='mouse'){F.tx=F.lx;F.ty=F.ly}fc.setPointerCapture(e.pointerId)});
fc.addEventListener('pointermove',e=>{const p=fieldLocal(e);if(e.pointerType==='mouse'){F.tx=p.x;F.ty=p.y}
  if(F.down){if(Math.hypot(p.x-F.down.x,p.y-F.down.y)>10)F.down.moved=true;if(F.down.moved&&e.pointerType!=='mouse'){F.tx+=p.x-F.down.x;F.ty+=p.y-F.down.y;F.down.x=p.x;F.down.y=p.y}}});
fc.addEventListener('pointerup',e=>{const p=fieldLocal(e);const d=F.down;F.down=null;if(!d||d.moved)return;
  if(Math.hypot(p.x-F.lx,p.y-F.ly)<60)swing(p.x,p.y);else{F.tx=p.x;F.ty=p.y}});
function swing(x,y){if(F.net)return;F.net={x,y,t:performance.now()};sfx('swish');
  let best=null,bd=1e9;for(const b of F.bugs){const d=Math.hypot(b.x-x,b.y-y);if(d<bd){bd=d;best=b}}
  const reach=34+(best?SPECIES[best.sp].len*.6:0);
  if(best&&bd<reach){setTimeout(()=>caught(best),260);return}
  for(const b of F.bugs){const d=Math.hypot(b.x-x,b.y-y);if(d<110){const a=Math.random()*6.28,r=rr(120,220);b.x=clamp(b.x+Math.cos(a)*r,30,F.W-30);b.y=clamp(b.y+Math.sin(a)*r,fieldGroundY(),F.H-30);b.voice.hush(rr(3,6))}
    else if(d<170)b.voice.hush(rr(1.5,3))}}
let lastCaught=null;
// 名前の番号は、今いる同じ種類の虫で使われていない一番小さい番号（全部逃がせばまた1号から）
function nextName(sp){const base=SPECIES[sp].name,used=new Set(S.bugs.map(b=>b.name));let i=1;while(used.has(base+i+'号'))i++;return base+i+'号'}
function caught(fb){const i=F.bugs.indexOf(fb);if(i<0)return;F.bugs.splice(i,1);fb.voice.stop();sfx('catch');F.respawn.push(performance.now()+rr(6000,12000));
  const n=(S.seen[fb.sp]||0)+1;S.seen[fb.sp]=n;
  const bug={id:S.nextId++,sp:fb.sp,pitch:fb.ind.pitch,rate:fb.ind.rate,name:nextName(fb.sp),garden:inGarden().length<GARDEN_MAX,...freeSpot(),mute:false};
  S.bugs.push(bug);save();lastCaught=bug;
  document.getElementById('catchT').textContent=(n===1?'はじめての ':'')+SPECIES[fb.sp].name+'をつかまえた！';
  document.getElementById('catchP').textContent=`「${bug.name}」 ${traits(bug)}。`+(bug.garden?'庭に放しました。':'庭がいっぱいなので控えの虫かごに入れました。');
  document.getElementById('catchM').classList.add('on');thumb(document.getElementById('catchC'),fb.sp,1);renderBench();}
document.getElementById('catchMore').onclick=()=>document.getElementById('catchM').classList.remove('on');
document.getElementById('catchGo').onclick=()=>{document.getElementById('catchM').classList.remove('on');show('garden')};

function drawField(now,dt){
  const{c,W,H}=fitCanvas(fc);if(Math.abs(W-F.W)>2||Math.abs(H-F.H)>2){F.W=W;F.H=H;buildBlades();F.bugs.forEach(b=>{b.x=clamp(b.x,30,W-30);b.y=clamp(b.y,fieldGroundY(),H-30)})}
  const A=AREAS[S.area],moon=moonInfo(),at=ac.currentTime;
  // 灯りの移動（速度に上限）
  const dx=F.tx-F.lx,dy=F.ty-F.ly,dist=Math.hypot(dx,dy),maxStep=420*dt,step=Math.min(dist,maxStep);
  if(dist>0.1){F.lx+=dx/dist*step;F.ly+=dy/dist*step}F.lx=clamp(F.lx,0,W);F.ly=clamp(F.ly,0,H);
  F.speed=F.speed*.8+(step/Math.max(dt,.001))*.2;
  if(F.net&&now-F.net.t>300)F.net=null;
  // 描く（art.js）
  paintField(c,W,H,now,{area:S.area,moon,scenery:{blades:F.blades,trees:F.trees},lx:F.lx,ly:F.ly,net:F.net,
    bugs:F.bugs.map(b=>({key:b.sp,x:b.x,y:b.y,sing:b.voice.singing(at)}))});
  // 音の空間化・驚いて黙る
  for(const b of F.bugs){const d=Math.hypot(b.x-F.lx,b.y-F.ly),sp=SPECIES[b.sp];
    const lim=sp.shy?150:220,rad=sp.shy?190:140;if(F.speed>lim&&d<rad&&at>b.voice.silentUntil)b.voice.hush(rr(2.5,5));
    const gain=Math.pow(clamp(1-d/(W*.95),0,1),2)*1.1+.015;
    b.voice.out.gain.setTargetAtTime(gain,at,.05);b.voice.pan.pan.setTargetAtTime(clamp((b.x-F.lx)/(W*.45),-1,1)*.9,at,.05);b.voice.send.gain.setTargetAtTime(.25+.4*clamp(d/W,0,1),at,.1)}
  // 補充
  F.respawn=F.respawn.filter(t=>{if(now>t){spawnBug();return false}return true});
  document.getElementById('fstat').textContent=`${A.name}　今夜は${moon.name}`;
}
function renderAreas(){const el=document.getElementById('areas');el.innerHTML='';for(const k in AREAS){const b=document.createElement('button');b.textContent=AREAS[k].name;b.dataset.area=k;b.className=k===S.area?'on':'';
  b.onclick=()=>{S.area=k;save();renderAreas();if(F.active)enterField()};el.appendChild(b)}}

// ───────── 庭 ─────────
const gc=document.getElementById('gc');
const G={voices:new Map(),drag:null,W:0,H:0,sel:null};
function freeSpot(){let best=null,bd=-1;for(let i=0;i<30;i++){const x=rr(.12,.88),y=rr(.3,.92);const d=Math.min(9,...inGarden().map(b=>Math.hypot(b.x-x,(b.y-y)*.8)));if(d>bd){bd=d;best={x,y}}}return best}
function applyPos(b){const v=G.voices.get(b.id);if(!v||!ac)return;const now=ac.currentTime,near=b.y;
  v.pan.pan.setTargetAtTime(clamp((b.x-.5)*1.8,-1,1),now,.05);v.out.gain.setTargetAtTime(.25+.75*Math.pow(near,1.3),now,.05);v.send.gain.setTargetAtTime(.12+.7*(1-near),now,.05)}
const PAIR_R=.25,pairDist=(a,b)=>Math.hypot(a.x-b.x,(a.y-b.y)*.8);
function partnersOf(b){if(b.mute)return[];const out=[];for(const o of inGarden())if(o!==b&&o.sp===b.sp&&!o.mute&&pairDist(o,b)<PAIR_R){const v=G.voices.get(o.id);if(v&&!v.dead)out.push(v)}return out}
function syncGarden(){ // 庭にいる虫と声を一致させる
  if(!ac)return;const ids=new Set(inGarden().map(b=>b.id));
  for(const[id,v]of G.voices)if(!ids.has(id)){v.stop();G.voices.delete(id)}
  for(const b of inGarden())if(!G.voices.has(b.id)){const v=new Voice(b.sp,b,gardenBus);v.partners=()=>partnersOf(b);G.voices.set(b.id,v);if(b.mute)v.setMuted(true);applyPos(b)}}
function stopGarden(){for(const v of G.voices.values())v.stop();G.voices.clear()}
function gLocal(e){const r=gc.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
const gTop=()=>clamp(artGroundY(GARDEN_ART,GARDEN_GROUND,G.W,G.H,artPosX()),16,G.H*.6);
function toPx(b){return{x:24+b.x*(G.W-48),y:gTop()+b.y*(G.H-gTop()-24)}}
function fromPx(x,y){return{x:clamp((x-24)/(G.W-48),0,1),y:clamp((y-gTop())/(G.H-gTop()-24),0,1)}}
gc.addEventListener('pointerdown',e=>{const p=gLocal(e);let hit=null,hd=1e9;for(const b of inGarden()){const q=toPx(b),d=Math.hypot(q.x-p.x,q.y-p.y);if(d<Math.max(26,SPECIES[b.sp].len)&&d<hd){hd=d;hit=b}}
  if(hit){G.drag={b:hit,sx:p.x,sy:p.y,moved:false};gc.setPointerCapture(e.pointerId)}});
gc.addEventListener('pointermove',e=>{if(!G.drag)return;const p=gLocal(e);if(Math.hypot(p.x-G.drag.sx,p.y-G.drag.sy)>6)G.drag.moved=true;G.drag.px=p.x;G.drag.py=p.y;if(G.drag.moved){Object.assign(G.drag.b,fromPx(p.x,p.y));applyPos(G.drag.b)}});
gc.addEventListener('pointerup',()=>{const d=G.drag;G.drag=null;if(!d)return;
  if(d.moved&&overCage(d)){d.b.garden=false;save();syncGarden();renderBench();toast(`${d.b.name}を控えの虫かごへ`);return}
  if(d.moved)save();else openBug(d.b)});
gc.addEventListener('pointercancel',()=>{G.drag=null});
// ドラッグ中だけ中央下に出る「控えの虫かご」
const cagePos=()=>({x:G.W/2,y:G.H-46});
function overCage(d){if(d.px==null)return false;const c=cagePos();return Math.hypot(d.px-c.x,d.py-c.y)<46}
function drawGarden(now){
  const{c,W,H}=fitCanvas(gc);G.W=W;G.H=H;const top=gTop();
  const rl=ac?rainLvl:RAIN_T[S.settings.weather];
  const at=ac?ac.currentTime:0;const bugs=inGarden().slice().sort((a,b)=>a.y-b.y);
  const sing=new Map(bugs.map(b=>{const v=G.voices.get(b.id);return[b.id,!!(v&&playing&&v.singing(at))]}));
  const pairs=[];
  for(let i=0;i<bugs.length;i++)for(let j=i+1;j<bugs.length;j++){const a=bugs[i],b=bugs[j];if(a.sp!==b.sp||a.mute||b.mute||pairDist(a,b)>=PAIR_R)continue;
    pairs.push({p:toPx(a),q:toPx(b),on:sing.get(a.id)||sing.get(b.id)})}
  const d=G.drag,dragging=!!(d&&d.moved);
  // 描く（art.js）
  paintGarden(c,W,H,now,{top,rain:rl,moon:moonInfo(),dragging,pairs,
    bugs:bugs.map(b=>{const q=toPx(b);return{key:b.sp,x:q.x,y:q.y,ny:b.y,mute:b.mute,sing:sing.get(b.id),name:b.name}}),
    cage:dragging?{...cagePos(),on:overCage(d)}:null});
  document.getElementById('gempty').style.display=bugs.length?'none':'flex';
  document.getElementById('gstat').textContent=bugs.length?`庭の虫 ${bugs.length}／${GARDEN_MAX}${S.settings.weather==='light'?'　小雨':''}`:'';
}
function openBug(b){G.sel=b;const sp=SPECIES[b.sp];document.getElementById('renameRow').classList.remove('on');{const f=document.getElementById('bugFree');clearTimeout(f._t);f.classList.remove('armed');f.textContent='逃がす'}document.getElementById('bugT').textContent=b.name;
  document.getElementById('bugP').textContent=`${sp.name}（${sp.voice}）・${traits(b)}`;
  document.getElementById('bugMute').textContent=b.mute?'鳴かせる':'休ませる';document.getElementById('bugM').classList.add('on');thumb(document.getElementById('bugC'),b.sp,.8)}
const closeBug=()=>{document.getElementById('bugM').classList.remove('on');G.sel=null};
document.getElementById('bugClose').onclick=closeBug;
document.getElementById('bugRename').onclick=()=>{const row=document.getElementById('renameRow'),inp=document.getElementById('bugNameIn');row.classList.add('on');inp.value=G.sel.name;inp.focus();inp.select()};
function applyName(){const b=G.sel,n=document.getElementById('bugNameIn').value.trim();if(b&&n){b.name=n.slice(0,12);save();renderBench();openBug(b)}}
document.getElementById('bugNameOk').onclick=applyName;
document.getElementById('bugNameIn').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing&&e.keyCode!==229)applyName()});
document.getElementById('bugMute').onclick=()=>{const b=G.sel;b.mute=!b.mute;const v=G.voices.get(b.id);if(v){v.setMuted(b.mute);applyPos(b)}save();closeBug()};
document.getElementById('bugBench').onclick=()=>{G.sel.garden=false;save();syncGarden();renderBench();closeBug()};
// 確認はブラウザのダイアログを使わず、ボタンを2回押す形にする（ダイアログが出ない環境があるため）
function armButton(btn,label,act){if(btn.classList.contains('armed')){act();return}
  btn.classList.add('armed');const orig=btn.textContent;btn.textContent=label;
  clearTimeout(btn._t);btn._t=setTimeout(()=>{btn.classList.remove('armed');btn.textContent=orig},4000)}
document.getElementById('clearGarden').onclick=e=>{if(!inGarden().length){toast('庭に虫がいません');return}
  armButton(e.currentTarget,'もう一度押すと、庭の虫をぜんぶ控えへ',()=>{const n=inGarden().length;inGarden().forEach(b=>b.garden=false);save();syncGarden();renderBench();toast(`${n}匹を控えの虫かごへ移しました`)})};
document.getElementById('freeAll').onclick=e=>{const n=S.bugs.length;if(!n){toast('逃がす虫がいません');return}
  armButton(e.currentTarget,`もう一度押すと${n}匹を逃がします`,()=>{S.bugs=[];save();syncGarden();renderBench();toast(`${n}匹を野に逃がしました。バイバイ！`)})};
function release(b){S.bugs=S.bugs.filter(x=>x!==b);save();syncGarden();renderBench();toast(`${b.name}を野に逃がしました。バイバイ！`)}
let toastT;function toast(m){const el=document.getElementById('toast');el.textContent=m;el.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('on'),2500)}
document.getElementById('bugFree').onclick=e=>armButton(e.currentTarget,'もう一度押すと逃がします',()=>{release(G.sel);closeBug()});
function renderBench(){const el=document.getElementById('bench');const list=S.bugs.filter(b=>!b.garden);el.innerHTML='';
  document.getElementById('benchH').textContent=`控えの虫かご（${list.length}）`;
  if(!list.length){el.innerHTML='<p class="hint">庭がいっぱいのときや、休ませたい虫はここに入ります。</p>';return}
  const full=inGarden().length>=GARDEN_MAX;
  for(const b of list){const r=document.createElement('div');r.className='row';const cv=document.createElement('canvas');r.appendChild(cv);
    const nm=document.createElement('div');nm.className='nm';nm.innerHTML=`${b.name}<small>${SPECIES[b.sp].name}・${traits(b)}</small>`;r.appendChild(nm);
    const go=document.createElement('button');go.className='btn pri';go.textContent='庭に出す';go.disabled=full;go.onclick=()=>{b.garden=true;Object.assign(b,freeSpot());save();syncGarden();renderBench()};r.appendChild(go);
    const fr=document.createElement('button');fr.className='btn warn';fr.textContent='逃がす';fr.onclick=()=>armButton(fr,'もう一度押す',()=>release(b));r.appendChild(fr);
    el.appendChild(r);requestAnimationFrame(()=>thumb(cv,b.sp,0))}}

// ───────── 設定 ─────────
function bindCtrl(id,fmt,apply){const el=document.getElementById(id),lb=document.getElementById(id+'L');el.value=S.settings[id];lb.textContent=fmt(+el.value);
  el.oninput=()=>{S.settings[id]=+el.value;lb.textContent=fmt(+el.value);apply&&ac&&apply(+el.value);save()}}
bindCtrl('temp',v=>`${v}℃（${v<19?'ゆっくり':v<25?'ふつう':'はやい'}）`);
bindCtrl('depth',v=>v<.3?'浅い':v<.9?'ふつう':'深い',v=>reverbIn.gain.setTargetAtTime(v,ac.currentTime,.1));
bindCtrl('wind',v=>v===0?'なし':Math.round(v*100)+'%',v=>windGain.gain.setTargetAtTime(v*.5,ac.currentTime,.2));
bindCtrl('soft',v=>v<.3?'くっきり':v<.75?'まるい':'とてもまるい',v=>setSoft(v,ac.currentTime));
bindCtrl('vol',v=>Math.round(v*100)+'%',v=>{if(playing)master.gain.setTargetAtTime(v,ac.currentTime,.05)});
let timerEnd=0;
document.getElementById('timer').onchange=e=>{const m=+e.target.value;timerEnd=m?Date.now()+m*60000:0;if(m&&!playing)togglePlay()};
function togglePlay(){if(!ac)return;playing=!playing;if(playing){ac.resume();master.gain.setTargetAtTime(S.settings.vol,ac.currentTime,.3)}
  else{master.gain.setTargetAtTime(0,ac.currentTime,.3);setTimeout(()=>{if(!playing)ac.suspend()},1200)}
  document.getElementById('playBtn').textContent=playing?'一時停止':'再生'}
document.getElementById('playBtn').onclick=togglePlay;

// ───────── 図鑑 ─────────
let preview=null,previewBtn=null;
// 図鑑の「声を聞く」：その虫の声だけが聞こえるよう、庭の虫・雨・風を小さくする
function duck(on){const t=ac.currentTime,lv=on?.03:1;gardenBus.gain.setTargetAtTime(lv,t,.08);gardenRev.gain.setTargetAtTime(lv,t,.08);rainRev.gain.setTargetAtTime(lv,t,.08);revOut.gain.setTargetAtTime(on?.03:1,t,.06);/* 響きの余韻も絞る */rainBus.gain.setTargetAtTime(on?.03:(tab==='field'?0:1),t,.08);windGain.gain.setTargetAtTime(S.settings.wind*.5*(on?.1:1),t,.08)}
function endPreview(v){if(preview!==v)return;v.stop();preview=null;duck(false);
  if(previewBtn){previewBtn.textContent='声を聞く';previewBtn.classList.remove('pri');previewBtn=null}
  if(!playing){master.gain.setTargetAtTime(0,ac.currentTime,.2);setTimeout(()=>{if(!playing&&!preview)ac.suspend()},800)}}
function playPreview(k,btn){if(!ac)return;if(preview)endPreview(preview);
  if(!playing){ac.resume();master.gain.setTargetAtTime(S.settings.vol,ac.currentTime,.05)} // 一時停止中でも聞けるように
  duck(true);const v=new Voice(k,{pitch:1,rate:1},previewBus);v.out.gain.value=1.5;v.send.gain.value=0;preview=v;/* 試聴は響きなしのはっきりした声で */previewBtn=btn;btn.textContent='聞いています…';btn.classList.add('pri');
  let t=ac.currentTime+.25;const until=t+4; // 短い声の虫は4秒ほどくり返す
  do{v.nextT=t;t+=Math.max(.2,v.sp.phrase(v,t,tempo()))}while(t<until&&v.lastEnd<until-1.5);
  setTimeout(()=>endPreview(v),(v.lastEnd-ac.currentTime)*1000+500)}
function renderZukan(){const el=document.getElementById('zgrid');el.innerHTML='';let found=0;
  for(const k of SP_KEYS){const sp=SPECIES[k],n=S.seen[k]||0;if(n)found++;
    const cd=document.createElement('div');cd.className='card'+(n?'':' unk');const cv=document.createElement('canvas');cd.appendChild(cv);
    cd.insertAdjacentHTML('beforeend',n?`<div class="t">${sp.name}</div><div class="v">${sp.voice}</div><div class="d">${sp.desc}</div>`:`<div class="t">？？？</div><div class="v">？？？</div><div class="d">まだ出会っていない虫。${Object.keys(AREAS).filter(a=>AREAS[a].w[k]).map(a=>AREAS[a].name).join('、')}で声がするらしい。</div>`);
    const f=document.createElement('div');f.className='f';f.innerHTML=`<span>つかまえた数 ${n}</span>`;
    if(n){const b=document.createElement('button');b.className='btn';b.textContent='声を聞く';b.onclick=()=>playPreview(k,b);f.appendChild(b)}
    cd.appendChild(f);el.appendChild(cd);
    requestAnimationFrame(()=>{if(n)thumb(cv,k,0);else drawSilhouette(cv,k)})}
  document.getElementById('zukanStat').textContent=`見つけた種類 ${found}／${SP_KEYS.length}　・　つかまえた虫 ${S.bugs.length}匹（庭 ${inGarden().length}）`}

// ───────── 画面切り替えとループ ─────────
let tab='';
function show(t){if(t===tab)return;const prev=tab;tab=t;
  document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.tab===t));document.querySelectorAll('section').forEach(s=>s.classList.toggle('on',s.id===t));
  if(!ac)return;
  rainBus.gain.setTargetAtTime(t==='field'?0:1,ac.currentTime,.3);
  if(t==='field'){stopGarden();requestAnimationFrame(enterField)}
  else{if(prev==='field'||!prev)leaveField();syncGarden()}
  if(t==='zukan')renderZukan();if(t==='garden')renderBench()}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>show(b.dataset.tab));

function tick(){if(!ac||!playing)return;const h=ac.currentTime+.35;
  rainTick();
  if(tab==='field')F.bugs.forEach(b=>b.voice.schedule(h));else G.voices.forEach(v=>v.schedule(h));
  if(timerEnd&&Date.now()>timerEnd){timerEnd=0;document.getElementById('timer').value='0';master.gain.setTargetAtTime(0,ac.currentTime,4);setTimeout(()=>{if(!timerEnd&&playing)togglePlay()},15000)}}
let lastF=performance.now();
function loop(now){const dt=Math.min(.1,(now-lastF)/1000);lastF=now;
  if(tab==='field'&&F.active)drawField(now,dt);if(tab==='garden')drawGarden(now);
  const tl=document.getElementById('timerL');tl.textContent=timerEnd?`あと${Math.ceil((timerEnd-Date.now())/60000)}分で静かになります`:'';
  requestAnimationFrame(loop)}

document.getElementById('startBtn').onclick=()=>{initAudio();document.getElementById('start').style.display='none';renderAreas();
  const t=inGarden().length?'garden':'field';tab='';show(t);requestAnimationFrame(loop)};
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&ac&&playing&&ac.state!=='running')ac.resume()});
document.addEventListener('pointerdown',()=>{if(ac&&playing&&ac.state==='suspended')ac.resume()});
if(!SELFTEST&&'serviceWorker' in navigator&&location.protocol.startsWith('http'))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
