/* ============================================================
   art.js — 見た目（Codex 担当）
   虫の絵の形と色、場所ごとの配色、背景・草・灯り・庭の描き方。
   音・動き・保存は app.js（Claude Code 担当）なので、ここからは変えない。

   ここで使ってよい「つなぎ目」（Claude Code が用意している部品）：
     drawArtMoon(c, img, rect, ART_MOON[場所], moon, hide)  … 絵の満月を今夜の形に欠けさせる。背景を描いた直後に必ず呼ぶ
     ART_MOON / HORIZON / GARDEN_GROUND（art-fit.js）       … 絵に合わせて Claude Code が測る値。ここでは読むだけ
     coverRect, fitCanvas, seeded, clamp（util.js）
     t('キー')（i18n.js）                                  … 画面に書く文字は必ずこれで（日本語・英語の辞書から引く）
   ============================================================ */

// ───────── 虫の見た目（絵がないときの形と色、大きさ） ─────────
// len：体の長さ（大きさの基準）、wd：体の幅の比率、ant：触角の長さ
const SPECIES_LOOK={
  suzumushi:{color:'#221d16',wing:'#b8ad86',len:18,wd:.55,ant:1.7},
  emma:{color:'#3a2a1c',wing:'#5a4430',len:24,wd:.5,ant:1.4},
  matsumushi:{color:'#8a7550',wing:'#b39c6c',len:20,wd:.5,ant:1.5},
  kantan:{color:'#b8d59a',wing:'#dcebc4',len:16,wd:.32,ant:1.8},
  kutsuwa:{color:'#4f8a3c',wing:'#6fae55',len:30,wd:.55,ant:1.6},
  umaoi:{color:'#5fa84a',wing:'#86c56c',len:24,wd:.32,ant:2.2},
  kanetataki:{color:'#6b5040',wing:'#8a6b52',len:10,wd:.45,ant:1.2},
  kusahibari:{color:'#a88a58',wing:'#d8c08a',len:8,wd:.45,ant:1.9},
  tsuzure:{color:'#4a3a2a',wing:'#6b5640',len:17,wd:.5,ant:1.5},
  kirigirisu:{color:'#6c8a3e',wing:'#8aa85a',len:34,wd:.45,ant:1.8},
  aomatsu:{color:'#5aa04a',wing:'#8cc870',len:22,wd:.45,ant:1.6},
  kumasuzu:{color:'#15130f',wing:'#2a2620',len:8,wd:.5,ant:1.6},
  tsuyumushi:{color:'#7cc060',wing:'#a8d88c',len:22,wd:.3,ant:2.4},
  kayakiri:{color:'#4f7a36',wing:'#6e9a50',len:36,wd:.45,ant:1.7},
};
for(const k in SPECIES_LOOK)SPECIES_LOOK[k].key=k;

// ───────── 探す画面の場所ごとの見た目 ─────────
// art：背景画像（assets/fields/）、grass：手前に描く草の量、sky/ground/blade：絵が読み込まれる前の色と草の色
const AREA_LOOK={
  kusamura:{art:'autumn-meadow-v2.jpg',grass:1,sky:['#2b1c34','#493047'],ground:['#747844','#4a4f2c'],blade:['#2f3a25','#7e7a43','#d18a2e']},
  kawara:{art:'river-susuki-v2.jpg',grass:.55,sky:['#032449','#074a73'],ground:['#15577a','#073d5f'],blade:['#6aaab4','#d9bf76','#3f8794'],susuki:true},
  hayashi:{art:'woodland-edge-v2.jpg',grass:.4,sky:['#061c16','#123728'],ground:['#48613a','#1f3a27'],blade:['#31583c','#788b55','#d76c2d'],trees:true},
  kouen:{art:'city-park-v2.jpg',grass:.12,sky:['#2a1e3d','#4d3763'],ground:['#819177','#4a615a'],blade:['#627a72','#93a388','#f27f69'],trees:true},
};

// ───────── 画像の読み込み ─────────
// 読み込めたら 'izayoi:artload' を知らせる（app.js が図鑑や草を描き直す）
const artLoaded=(kind,key)=>document.dispatchEvent(new CustomEvent('izayoi:artload',{detail:{kind,key}}));
const BUG_ART={};
for(const k in SPECIES_LOOK){const img=new Image();img.onload=()=>artLoaded('bug',k);img.src=`assets/insects/${k}.png`;BUG_ART[k]=img}
const GARDEN_ART=new Image();GARDEN_ART.src='assets/garden.jpg';
const AREA_ART={};
for(const k in AREA_LOOK){const img=new Image();img.onload=()=>artLoaded('area',k);img.src=`assets/fields/${AREA_LOOK[k].art}`;AREA_ART[k]=img}

// 背景の切り抜き位置（横方向）。スマホでは絵の右寄り（月のある側）を見せる。
// CSS の #gstage / #start の background-position（スマホ時65%）とそろえること
const artPosX=()=>innerWidth<=480?.65:.5;

// ───────── 虫 ─────────
function drawBug(c,sp,x,y,s,alpha=1,glow=0){
  c.save();c.translate(x,y);c.scale(s,s);c.globalAlpha=alpha;const L=sp.len,Wd=L*sp.wd;
  if(glow>0){const g=c.createRadialGradient(0,0,0,0,0,L*1.4);g.addColorStop(0,`rgba(240,201,106,${.35*glow})`);g.addColorStop(1,'rgba(240,201,106,0)');c.fillStyle=g;c.beginPath();c.arc(0,0,L*1.4,0,7);c.fill()}
  const art=BUG_ART[sp.key];
  if(art&&art.complete&&art.naturalWidth){
    c.globalAlpha=alpha;
    const w=L*3.25,h=w*art.naturalHeight/art.naturalWidth;
    c.drawImage(art,-w*.42,-h*.58,w,h);
    c.restore();return;
  }
  c.strokeStyle=sp.color;c.lineWidth=Math.max(.8,L/18);c.lineCap='round';
  for(const m of[-1,1]){c.beginPath();c.moveTo(-L*.05,0);c.lineTo(-L*.35,m*Wd*.9);c.lineTo(-L*.75,m*Wd*.55);c.moveTo(L*.12,0);c.lineTo(L*.2,m*Wd*.8);c.moveTo(L*.28,0);c.lineTo(L*.42,m*Wd*.75);c.stroke();
    c.beginPath();c.moveTo(L*.55,m*Wd*.1);c.quadraticCurveTo(L*(.7+sp.ant*.3),m*Wd*.9,L*(.5+sp.ant*.55),m*Wd*1.5);c.lineWidth=Math.max(.6,L/30);c.stroke();c.lineWidth=Math.max(.8,L/18)}
  c.fillStyle=sp.color;c.beginPath();c.ellipse(0,0,L*.5,Wd*.5,0,0,7);c.fill();
  c.globalAlpha=alpha*.85;c.fillStyle=sp.wing;c.beginPath();c.ellipse(-L*.1,0,L*.38,Wd*.4,0,0,7);c.fill();
  c.globalAlpha=alpha;c.fillStyle=sp.color;c.beginPath();c.arc(L*.45,0,Wd*.36,0,7);c.fill();
  c.restore();
}
// 図鑑・控え・つかまえた画面の小さな絵
function thumb(cv,key,glow=.6){const{c,W,H}=fitCanvas(cv);c.clearRect(0,0,W,H);const sp=SPECIES_LOOK[key];const s=Math.min(W,H*1.6)/(sp.len*2.6);drawBug(c,sp,W/2-sp.len*s*.1,H/2,s,1,glow)}
// 図鑑の「まだ出会っていない虫」の影
function drawSilhouette(cv,key){const sp=SPECIES_LOOK[key];const{c,W,H}=fitCanvas(cv);c.clearRect(0,0,W,H);const s=Math.min(W,H*1.6)/(sp.len*2.6);c.filter='brightness(0)';drawBug(c,{...sp,color:'#060810',wing:'#060810'},W/2,H/2,s,.9,0);c.filter='none'}

// 背景の絵が読み込まれる前に使う、描いた月
function drawMoon(c,x,y,r,m,alpha=1){c.save();c.globalAlpha=alpha;
  const g=c.createRadialGradient(x,y,0,x,y,r*6);g.addColorStop(0,`rgba(244,236,208,${.22*m.illum})`);g.addColorStop(1,'rgba(244,236,208,0)');c.fillStyle=g;c.fillRect(x-r*6,y-r*6,r*12,r*12);
  c.fillStyle='rgba(60,64,84,.55)';c.beginPath();c.arc(x,y,r,0,7);c.fill();
  const waxing=m.p<.5,k=Math.cos(2*Math.PI*m.p);c.fillStyle='#f4ecd0';c.beginPath();
  c.arc(x,y,r,-Math.PI/2,Math.PI/2,!waxing);c.ellipse(x,y,r*Math.abs(k),r,0,Math.PI/2,-Math.PI/2,waxing?k>0:k<=0);c.fill();c.restore()}

// ───────── 探す画面 ─────────
// 手前の草と、絵がないときの木。groundY（虫が出る一番上の高さ）より下に生やす
function buildFieldScenery(area,W,H,groundY){const A=AREA_LOOK[area],rnd=seeded(area.length*977+13),blades=[];const n=Math.round(W*H/3900*A.grass);
  for(let i=0;i<n;i++){const y=groundY+rnd()*(H*1.03-groundY);blades.push({x:rnd()*W,y,h:(16+rnd()*38)*(.6+y/H),lean:(rnd()-.5)*.72,ph:rnd()*6.28,col:A.blade[Math.floor(rnd()*A.blade.length)],plume:A.susuki&&rnd()<.2})}
  blades.sort((a,b)=>a.y-b.y);
  const trees=[];if(A.trees){const r2=seeded(7);for(let x=-20;x<W+40;x+=24+r2()*30)trees.push({x,h:H*(.18+r2()*.14),w:30+r2()*40})}
  return{blades,trees}}

/* 探す画面を1枚描く。v の中身（app.js が毎フレーム用意する）：
   area, moon（今夜の月）, scenery（buildFieldScenery の結果）, lx/ly（灯りの位置）,
   bugs:[{key,x,y,sing（いま鳴いているか）}], net:{x,y,t}|null（網をふった場所と時刻） */
function paintField(c,W,H,now,v){
  const A=AREA_LOOK[v.area],moon=v.moon,vis=85+50*moon.illum;
  // 場所ごとの切り絵背景。読み込み前だけ色面を表示する
  let g;const bg=AREA_ART[v.area];
  if(bg&&bg.complete&&bg.naturalWidth){
    const rect=coverRect(bg,W,H,artPosX());c.drawImage(bg,rect.x,rect.y,rect.w,rect.h);drawArtMoon(c,bg,rect,ART_MOON[v.area],moon);
  }else{
    c.fillStyle=A.sky[0];c.fillRect(0,0,W,H*.3);
    c.fillStyle=A.sky[1];c.beginPath();c.moveTo(0,H*.25);c.quadraticCurveTo(W*.48,H*.18,W,H*.26);c.lineTo(W,H*.31);c.lineTo(0,H*.31);c.closePath();c.fill();
    drawMoon(c,W*.82,H*.1,11,moon);
    for(const t of v.scenery.trees){c.fillStyle='#08272c';c.beginPath();c.ellipse(t.x,H*.3-t.h*.45,t.w*.72,t.h*.58,0,0,7);c.fill();c.fillRect(t.x-4,H*.3-t.h*.2,8,t.h*.2)}
    c.fillStyle=A.ground[1];c.fillRect(0,H*.28,W,H);
    c.fillStyle=A.ground[0];c.beginPath();c.moveTo(0,H*.42);c.quadraticCurveTo(W*.52,H*.29,W,H*.4);c.lineTo(W,H);c.lineTo(0,H);c.closePath();c.fill();
  }
  // 草
  const ts=now/1000;c.lineCap='round';
  for(const b of v.scenery.blades){const sway=Math.sin(ts*.75+b.ph+b.x*.01)*2.4,tx=b.x+b.lean*b.h+sway,ty=b.y-b.h,w=Math.max(1.6,b.h*.055);c.fillStyle=b.col;c.beginPath();c.moveTo(b.x-w,b.y);c.quadraticCurveTo(b.x+b.lean*b.h*.35-w,b.y-b.h*.55,tx,ty);c.quadraticCurveTo(b.x+b.lean*b.h*.35+w,b.y-b.h*.55,b.x+w,b.y);c.closePath();c.fill();
    if(b.plume){c.strokeStyle='#d8aa4c';c.lineWidth=5;c.beginPath();c.moveTo(tx,ty);c.lineTo(tx+5,ty-12);c.stroke()}}
  // 虫（灯りの中でだけ見える。満月ほど遠くまで見える）
  for(const b of v.bugs){const d=Math.hypot(b.x-v.lx,b.y-v.ly),sp=SPECIES_LOOK[b.key];if(d<vis)drawBug(c,sp,b.x,b.y,sp.len<14?1.3:1,clamp((vis-d)/45,0,1),0)}
  // 暗がり
  g=c.createRadialGradient(v.lx,v.ly,10,v.lx,v.ly,150);g.addColorStop(0,'rgba(255,220,150,.05)');g.addColorStop(.38,'rgba(3,19,22,.18)');g.addColorStop(1,`rgba(2,13,18,${.76-.14*moon.illum})`);c.fillStyle=g;c.fillRect(0,0,W,H);
  // 目の光と声の波紋（ヒント）
  for(const b of v.bugs){const d=Math.hypot(b.x-v.lx,b.y-v.ly);
    if(d<120&&b.sing){const a=clamp((120-d)/60,0,1)*.9;c.fillStyle=`rgba(255,240,190,${a*(.6+.4*Math.sin(now/60))})`;c.beginPath();c.arc(b.x+SPECIES_LOOK[b.key].len*.5,b.y-1,1.6,0,7);c.fill()}
    if(d<200&&b.sing){const ph=(now/700)%1;c.strokeStyle=`rgba(240,201,106,${(1-ph)*clamp((200-d)/200,0,1)*.25})`;c.lineWidth=1;c.beginPath();c.arc(b.x,b.y,8+ph*22,0,7);c.stroke()}}
  // 灯り
  c.fillStyle='rgba(255,214,140,.95)';c.beginPath();c.arc(v.lx,v.ly,4,0,7);c.fill();
  c.strokeStyle='rgba(255,214,140,.35)';c.lineWidth=1;c.beginPath();c.arc(v.lx,v.ly,60,0,7);c.stroke();
  // 網（ふってから0.3秒）
  if(v.net){const p=(now-v.net.t)/300;if(p<=1){c.strokeStyle=`rgba(230,230,220,${1-p})`;c.lineWidth=2;c.beginPath();c.arc(v.net.x,v.net.y,14+p*22,0,7);c.stroke()}}
}

// ───────── 庭 ─────────
/* 庭を1枚描く。v の中身（app.js が毎フレーム用意する）：
   top（虫を置ける一番上の高さ）, rain（雨の強さ 0〜1）, moon, dragging（虫をドラッグ中か）,
   pairs:[{p:{x,y},q:{x,y},on}]（掛け合っている2匹）, bugs:[{key,x,y,ny（0=奥〜1=手前）,mute,sing,name}]（奥から順）,
   cage:{x,y,on}|null（ドラッグ中だけ出る虫かご） */
function paintGarden(c,W,H,now,v){
  const top=v.top,rl=v.rain;
  c.clearRect(0,0,W,H);
  if(GARDEN_ART.complete&&GARDEN_ART.naturalWidth){ // 庭の絵（CSS背景と同じ位置）に今夜の月を重ねる
    const rect=coverRect(GARDEN_ART,W,H,artPosX(),.5);c.drawImage(GARDEN_ART,rect.x,rect.y,rect.w,rect.h);drawArtMoon(c,GARDEN_ART,rect,ART_MOON.garden,v.moon,rl*.92)}
  c.fillStyle='rgba(242,237,223,.62)';c.font='11px sans-serif';c.textAlign='center';c.fillText(t('garden.back'),W/2,top+14);if(!v.dragging)c.fillText(t('garden.front'),W/2,H-8);
  c.textAlign='left';c.fillText(t('garden.left'),8,(top+H)/2);c.textAlign='right';c.fillText(t('garden.right'),W-8,(top+H)/2);
  // 掛け合っている仲間を点線でつなぐ
  c.setLineDash([2,5]);c.lineWidth=1;
  for(const{p,q,on}of v.pairs){c.strokeStyle=`rgba(240,201,106,${on?.45:.15})`;c.beginPath();c.moveTo(p.x,p.y);c.quadraticCurveTo((p.x+q.x)/2,Math.min(p.y,q.y)-20,q.x,q.y);c.stroke()}
  c.setLineDash([]);
  for(const b of v.bugs){const sp=SPECIES_LOOK[b.key];
    const s=(.75+.55*b.ny)*(sp.len<14?1.5:1);drawBug(c,sp,b.x,b.y,s,b.mute?.45:1,b.sing?1:0);
    if(b.sing){const ph=(now/600)%1;c.strokeStyle=`rgba(240,201,106,${(1-ph)*.35})`;c.lineWidth=1;c.beginPath();c.arc(b.x,b.y,sp.len*s*.6+ph*16,0,7);c.stroke()}
    c.fillStyle=b.mute?'rgba(200,200,210,.35)':'rgba(230,230,220,.6)';c.font='10px sans-serif';c.textAlign='center';c.fillText(b.name+(b.mute?t('bug.restMark'):''),b.x,b.y+sp.len*s*.5+12)}
  if(rl>.02){ // 雲・雨すじ・水はね
    c.globalAlpha=1;c.fillStyle=`rgba(16,20,30,${rl*.45})`;c.fillRect(0,0,W,H);
    const t=now/1000,n=Math.round(140*rl);c.strokeStyle=`rgba(175,190,215,${.18+.12*rl})`;c.lineWidth=1;c.beginPath();
    for(let i=0;i<n;i++){const r1=(i*.6180339)%1,r2=(i*.7548776)%1,sp=520+r2*260,len=10+r2*10;
      const y=((r2*H+t*sp)%(H+40))-20,x=((r1*W*1.2+y*.18)%(W+20))-10;c.moveTo(x,y);c.lineTo(x-len*.18,y-len)}c.stroke();
    const m=Math.round(22*rl);for(let k=0;k<m;k++){const cyc=t*1.6+k*.37,cell=Math.floor(cyc),age=cyc-cell,hh=Math.sin(cell*12.9898+k*78.233)*43758.5453,r=hh-Math.floor(hh);
      const x=r*W,y=top+((r*7.13)%1)*(H-top);c.strokeStyle=`rgba(190,205,225,${(1-age)*.35})`;c.beginPath();c.ellipse(x,y,2+age*9,(2+age*9)*.35,0,0,7);c.stroke()}}
  c.globalAlpha=1;
  if(v.cage)paintCage(c,v.cage);
}
// ドラッグ中だけ中央下に出る「控えの虫かご」。on：虫が重なっている
function paintCage(c,{x,y,on}){const r=on?34:28;
  c.save();c.fillStyle=on?'rgba(220,166,64,.9)':'rgba(6,31,37,.72)';c.strokeStyle=on?'#f7edcf':'rgba(247,237,207,.6)';c.lineWidth=1.5;
  c.beginPath();c.arc(x,y,r,0,7);c.fill();c.stroke();
  const w=r*.9,h=r*.7,x0=x-w/2,y0=y-h/2+2;c.strokeStyle=on?'#061f25':'#f7edcf';c.lineWidth=1.4;c.beginPath();
  c.moveTo(x0,y0);c.lineTo(x0+w,y0);c.lineTo(x0+w,y0+h);c.lineTo(x0,y0+h);c.closePath();
  for(let i=1;i<5;i++){c.moveTo(x0+w*i/5,y0);c.lineTo(x0+w*i/5,y0+h)}
  c.moveTo(x-w*.25,y0);c.quadraticCurveTo(x,y0-h*.45,x+w*.25,y0);c.stroke();
  c.fillStyle='rgba(247,237,207,.85)';c.font='11px sans-serif';c.textAlign='center';c.fillText(t(on?'cage.drop':'cage.label'),x,y-r-8);c.restore()}
