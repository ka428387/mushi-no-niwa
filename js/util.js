/* util.js — 両方で使う小さな道具（Claude Code 担当。Codex は使ってよい） */
const rr=(a,b)=>a+Math.random()*(b-a), ri=(a,b)=>Math.floor(rr(a,b+1)), clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function seeded(seed){return()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646}}
function fitCanvas(cv){const r=cv.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);const w=Math.max(1,Math.round(r.width*dpr)),h=Math.max(1,Math.round(r.height*dpr));
  if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h}const c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);return{c,W:r.width,H:r.height}}
const hexRgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const rgba=(h,a)=>`rgba(${hexRgb(h).join(',')},${a})`;
const mixHex=(h1,h2,t)=>{const a=hexRgb(h1),b=hexRgb(h2);return`rgb(${a.map((v,i)=>Math.round(v+(b[i]-v)*t)).join(',')})`};
function coverRect(img,W,H,px=.5,py=.5){const s=Math.max(W/img.naturalWidth,H/img.naturalHeight),w=img.naturalWidth*s,h=img.naturalHeight*s;return{x:(W-w)*px,y:(H-h)*py,w,h}}
