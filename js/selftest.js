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
  await check('英語で起動：最初の画面と上のボタンに日本語が残っていない',()=>{
    if(LANG!=='en')return '英語で起動していない（?lang=en が効いていない）';
    const jp=/[ぁ-んァ-ヶ一-龠]/,bad=document.body.innerText.split('\n').filter(l=>jp.test(l)&&l.trim()!==t('lang.switch'));
    return !bad.length||'日本語のまま: '+bad.slice(0,4).map(l=>'「'+l.trim().slice(0,20)+'」').join(' ')});
  setLang('ja'); // ここからの項目は日本語で確かめる（英語は最後にまとめて）
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
  await check('動画：声の切れ目で録り始めて止め、音つきの動画ができ、縦長のキャンバスも片づく',async()=>{
    if(!REC_TYPE)return '録画に対応していない';S.bugs.forEach(b=>b.garden=true);syncGarden();
    const n0=document.querySelectorAll('canvas').length,p=startRec(1.5,2.5),ok0=await until(()=>REC&&REC.started,2600);
    const r0=REC,blob=await p,len=ac.currentTime-r0.t0; /* 録り始め→止め終わりまで（最後のフェード込み） */
    const au=recDest.stream.getAudioTracks().length,left=document.querySelectorAll('canvas').length-n0;
    return (ok0&&blob.size>10000&&/^video\//.test(blob.type)&&au>0&&left===0&&!REC&&len>=1.4&&len<=2.9)||`始まり${ok0}・長さ${len.toFixed(2)}秒・大きさ${blob.size}・種類${blob.type}・音${au}・残ったキャンバス${left}`});
  await check('動画：録画中に押すと中止でき、次の録画もできる',async()=>{
    if(!REC_TYPE)return '録画に対応していない';let err='';const p=startRec(3,4).catch(e=>{err=e.message});await wait(400);stopRec(true);await p;
    const blob=await startRec(1,1.5);return (err==='cancelled'&&blob.size>0&&!REC)||`中止:${err}・次の録画${blob.size}`});
  await check('図鑑：「声を聞く」の間は庭と響きが小さくなり、終わると戻る',async()=>{
    S.bugs.forEach(b=>b.garden=true);syncGarden();show('zukan');await wait(300);const btn=document.querySelector('.card .btn');if(!btn)return '声を聞くボタンがない';btn.click();await wait(400);
    const during=[gardenBus.gain.value,revOut.gain.value];if(!preview||during.some(v=>v>.1))return '小さくならない: '+during.map(v=>v.toFixed(2));
    await until(()=>!preview,9000);await until(()=>gardenBus.gain.value>.9&&revOut.gain.value>.9,3000);const after=[gardenBus.gain.value,revOut.gain.value];return after.every(v=>v>.9)||'戻らない: '+after.map(v=>v.toFixed(2))});
  await check('天気：小雨で雨音が鳴り、晴れで止む',async()=>{show('garden');setWeather('light');await wait(2500);const on=rainLvl;setWeather('clear');await wait(3000);return (on>.2&&rainLvl<on)||`小雨${on.toFixed(2)}→晴れ${rainLvl.toFixed(2)}`});
  await check('すべて逃がす：2回押しで全部いなくなり、「バイバイ！」が出る',async()=>{const b=document.getElementById('freeAll');b.click();const mid=S.bugs.length;b.click();await wait(100);
    return (mid>0&&S.bugs.length===0&&document.getElementById('toast').textContent.includes('バイバイ！'))||`途中${mid}匹・最後${S.bugs.length}匹`});
  await check('描画：各画面を数フレーム描いてもエラーが出ない',async()=>{for(const t of['field','garden','zukan']){show(t);await wait(400)}return true});
  await check('英語表示：3つの画面と虫の詳細に日本語が残っておらず、辞書の抜けもない',async()=>{
    setLang('en');S.seen={emma:1,kantan:1};S.bugs=[];
    for(const[id,sp,g]of[[951,'emma',true],[952,'kantan',true],[953,'suzumushi',false]])S.bugs.push({id,sp,pitch:1,rate:1,name:nextName(sp),garden:g,x:.3+id%3*.2,y:.6,mute:false});
    const jp=/[ぁ-んァ-ヶ一-龠]/,found=new Set();const scan=where=>{document.getElementById('toast').textContent=''; /* 前の項目のお知らせは除く。「日本語」は日本語に戻すボタンなので正しい */
      for(const line of document.body.innerText.split('\n'))if(jp.test(line)&&line.trim()!==t('lang.switch'))found.add(where+'「'+line.trim().slice(0,30)+'」')};
    for(const tb of['field','garden','zukan']){show(tb);syncGarden();renderBench();if(tb==='zukan')renderZukan();await wait(500);scan(tb)}
    show('garden');await wait(200);openBug(S.bugs[0]);await wait(100);scan('虫の詳細');closeBug();
    const names=S.bugs.map(b=>b.name).join(', ');setLang('ja');
    const miss=[...i18nMissing];
    if(!/#1$/.test(S.bugs[0].name))return '英語の名前の付け方が違う: '+names;
    return (!found.size&&!miss.length)||[...found].slice(0,5).join(' / ')+(miss.length?' ／辞書の抜け: '+miss.join(', '):'')});
  results.push({name:'エラーが1つも出ていない',ok:errors.length===0,detail:errors.slice(0,5).join(' / ')});
  try{localStorage.removeItem(KEY)}catch(e){}
  fetch('/__selftest',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({results,ua:navigator.userAgent})});
});
