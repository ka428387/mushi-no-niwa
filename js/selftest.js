'use strict';
/* selftest.js — 自動テスト（Claude Code 担当）。tools/check.py が ?selftest で開く */
if(SELFTEST)addEventListener('load',async()=>{
  const errors=[],results=[],wait=ms=>new Promise(r=>setTimeout(r,ms));
  addEventListener('error',e=>errors.push(String(e.message||e.error)));
  addEventListener('unhandledrejection',e=>errors.push('promise: '+String(e.reason)));
  const check=async(name,fn)=>{try{const r=await fn();results.push({name,ok:r===true||r===undefined,detail:typeof r==='string'?r:String(r)})}catch(e){results.push({name,ok:false,detail:String(e&&e.stack||e)})}};
  const until=async(fn,ms=5000)=>{const t=Date.now();while(Date.now()-t<ms){if(fn())return true;await wait(100)}return false};
  const imgOk=img=>img&&img.complete&&img.naturalWidth>0;
  gc.setPointerCapture=fc.setPointerCapture=()=>{}; // 合成したポインター操作でも動くように
  await check('はじめる：音が動き出す',async()=>{document.getElementById('startBtn').click();return await until(()=>ac&&ac.state==='running'&&ac.currentTime>.2,4000)||'AudioContextが動かない'});
  await check('画像：背景・虫・庭・ロゴがすべて読み込める',async()=>{
    const all=[GARDEN_ART,...Object.values(AREA_ART),...Object.values(BUG_ART),...document.images];
    await until(()=>all.every(imgOk),8000);const bad=all.filter(i=>!imgOk(i)).map(i=>i.src.split('/').slice(-2).join('/'));return bad.length?'読み込めない: '+bad.join(', '):true});
  await check('探す：4つの場所で虫が地平線より下に出る',async()=>{show('field');await wait(400);
    for(const k of Object.keys(AREAS)){S.area=k;renderAreas();enterField();await wait(150);for(let i=0;i<30;i++)spawnBug();
      const gy=fieldGroundY();const bad=F.bugs.filter(b=>!(b.y>=gy-.5&&b.y<=F.H&&b.x>=0&&b.x<=F.W));if(!F.bugs.length||bad.length)return `${k}: ${bad.length}匹が範囲外`}
    S.area='kusamura';renderAreas();enterField();return true});
  await check('探す：つかまえると庭に入り、1号から名前がつく',async()=>{await wait(200);const b=F.bugs[0];caught(b);document.getElementById('catchMore').click();
    const g=S.bugs[0];return (S.bugs.length===1&&g.garden&&/1号$/.test(g.name))||JSON.stringify(S.bugs.map(x=>x.name))});
  await check('月：今夜の月の名前が出て、庭と4場所の月の位置がそろっている',()=>{const m=moonInfo();if(!m.name)return '名前なし';
    const ms=[...Object.keys(AREAS),'garden'].map(k=>ART_MOON[k]),spread=f=>Math.max(...ms.map(f))-Math.min(...ms.map(f));
    return (spread(m=>m.x)<.003&&spread(m=>m.y)<.003&&spread(m=>m.r)<.002)||'位置が不ぞろい: '+ms.map(m=>m.x+','+m.y+' r'+m.r).join(' / ')});
  await check('庭：近くに置いた同じ種類の2匹が交互に鳴く',async()=>{
    S.bugs=[{id:901,sp:'suzumushi',pitch:1,rate:1,name:'テストA',garden:true,x:.45,y:.6,mute:false},{id:902,sp:'suzumushi',pitch:1.02,rate:.97,name:'テストB',garden:true,x:.55,y:.62,mute:false}];
    show('garden');syncGarden();const log={901:[],902:[]};const t0=ac.currentTime+.3;for(const v of G.voices.values())v.nextT=t0; /* わざと同じ瞬間に鳴き始めさせる */
    for(const[id,v]of G.voices){const o=v.tone.bind(v);v.tone=(...a)=>{o(...a);log[id].push(v.marks.at(-1).slice())}}
    await wait(7000);const ph=a=>{const out=[];for(const m of a){const l=out.at(-1);if(l&&m[0]-l[1]<.35)l[1]=m[1];else out.push(m.slice())}return out};
    const A=ph(log[901]),B=ph(log[902]);let ov=0;for(const a of A)for(const b of B)if(a[0]<b[1]-.01&&b[0]<a[1]-.01)ov++;
    return (A.length>0&&B.length>0&&ov===0)||`Aの鳴き${A.length}回・Bの鳴き${B.length}回・重なり${ov}回`});
  await check('庭：ドラッグで中央下の虫かごへ運ぶと控えに移る',async()=>{
    const b=S.bugs[0],r=gc.getBoundingClientRect(),p=toPx(b),c=cagePos(),ev=(t,x,y)=>gc.dispatchEvent(new PointerEvent(t,{bubbles:true,clientX:r.left+x,clientY:r.top+y,pointerId:7,pointerType:'mouse'}));
    ev('pointerdown',p.x,p.y);ev('pointermove',(p.x+c.x)/2,(p.y+c.y)/2);ev('pointermove',c.x,c.y);ev('pointerup',c.x,c.y);await wait(100);
    return (!b.garden&&!G.voices.has(b.id))||'控えに移らなかった'});
  await check('図鑑：「声を聞く」の間は庭と響きが小さくなり、終わると戻る',async()=>{
    S.bugs.forEach(b=>b.garden=true);syncGarden();show('zukan');await wait(300);const btn=document.querySelector('.card .btn');if(!btn)return '声を聞くボタンがない';btn.click();await wait(400);
    const during=[gardenBus.gain.value,revOut.gain.value];if(!preview||during.some(v=>v>.1))return '小さくならない: '+during.map(v=>v.toFixed(2));
    await until(()=>!preview,9000);await wait(500);const after=[gardenBus.gain.value,revOut.gain.value];return after.every(v=>v>.9)||'戻らない: '+after.map(v=>v.toFixed(2))});
  await check('天気：小雨で雨音が鳴り、晴れで止む',async()=>{show('garden');setWeather('light');await wait(2500);const on=rainLvl;setWeather('clear');await wait(3000);return (on>.2&&rainLvl<on)||`小雨${on.toFixed(2)}→晴れ${rainLvl.toFixed(2)}`});
  await check('ぜんぶ逃がす：2回押しで全部いなくなり、「バイバイ！」が出る',async()=>{const b=document.getElementById('freeAll');b.click();const mid=S.bugs.length;b.click();await wait(100);
    return (mid>0&&S.bugs.length===0&&document.getElementById('toast').textContent.includes('バイバイ！'))||`途中${mid}匹・最後${S.bugs.length}匹`});
  await check('描画：各画面を数フレーム描いてもエラーが出ない',async()=>{for(const t of['field','garden','zukan']){show(t);await wait(400)}return true});
  results.push({name:'エラーが1つも出ていない',ok:errors.length===0,detail:errors.slice(0,5).join(' / ')});
  try{localStorage.removeItem(KEY)}catch(e){}
  fetch('/__selftest',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({results,ua:navigator.userAgent})});
});
