/* CollaboAtlas 모션 (11/28): 기존 렌더링은 그대로 두고 그 위에 얹는다. 이 파일만 빼면 이전 동작으로 돌아간다.
   1 포커스: 분야·패널·분류 칸에 올리면 관련 없는 부분이 옅어진다.
   2 전환: 단계·실제/이상을 바꾸면 같은 사람의 점이 새 칸으로 미끄러지고, 단계 바 표시가 옆으로 미끄러진다.
     (점의 이동은 같은 사람의 배치 비교이며 권장 경로가 아니다.)
   3 첫 진입: 원이 중심에서 바깥으로 펼쳐지고, 이어서 점이 내려앉는다(페이지를 열 때 한 번).
   4 대기 모드: 주소에 ?kiosk가 있을 때만. 30초 동안 입력이 없으면 단계를 6초마다 넘기고, 한 바퀴마다 실제/이상을 바꾼다. */
(()=>{
const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE='cubic-bezier(.2,.8,.2,1)';
let entered=false,stageInd=null;

/* ---------- 2. 전환: 점과 단계 표시 ---------- */
function dotPositions(){const m=new Map();document.querySelectorAll('.field-inset circle[data-pid]').forEach(c=>{const r=c.getBoundingClientRect();m.set(c.dataset.pid,{x:r.left+r.width/2,y:r.top+r.height/2})});return m}
function slideDots(before){if(still||!before.size)return;
 const svg=document.querySelector('.exhibition-plate');if(!svg)return;const k=svg.getScreenCTM()?.a||1;let i=0;
 document.querySelectorAll('.field-inset circle[data-pid]').forEach(c=>{const o=before.get(c.dataset.pid);if(!o)return;const r=c.getBoundingClientRect(),dx=(o.x-(r.left+r.width/2))/k,dy=(o.y-(r.top+r.height/2))/k;
  if(Math.abs(dx)<.5&&Math.abs(dy)<.5)return;
  c.animate([{transform:`translate(${dx}px,${dy}px)`},{transform:'translate(0,0)'}],{duration:720,delay:(i++%3)*60,easing:EASE,fill:'backwards'});
  c.animate([{r:3.8},{r:6},{r:3.8}],{duration:720,delay:(i%3)*60,easing:'ease-in-out'})});
 document.querySelectorAll('.field-inset .inset-pair tspan+tspan, .field-inset .inset-ko:last-of-type').forEach(t=>t.animate([{opacity:.15},{opacity:1}],{duration:500,easing:'ease-out'}))}
function placeStage(prev){const bar=document.querySelector('.ex-stages');if(!bar)return;const on=bar.querySelector('button[aria-pressed="true"]');if(!on)return;
 const col=getComputedStyle(on).backgroundColor;let ind=bar.querySelector('.ex-stage-ind');if(!ind){ind=document.createElement('i');ind.className='ex-stage-ind';bar.prepend(ind)}
 ind.style.background=col;bar.classList.add('has-ind');const b=bar.getBoundingClientRect(),r=on.getBoundingClientRect(),next={left:r.left-b.left,width:r.width};
 if(prev&&!still){ind.animate([{left:prev.left+'px',width:prev.width+'px'},{left:next.left+'px',width:next.width+'px'}],{duration:480,easing:EASE})}
 ind.style.left=next.left+'px';ind.style.width=next.width+'px';stageInd=next}

/* ---------- 3. 첫 진입 ---------- */
function enter(){if(entered||still)return;const svg=document.querySelector('.exhibition-plate');const g=svg?.querySelector('.m07c');if(!g)return;entered=true;
 const NS='http://www.w3.org/2000/svg',id='m07c-reveal',defs=svg.querySelector('defs')||svg.insertBefore(document.createElementNS(NS,'defs'),svg.firstChild);
 const cp=document.createElementNS(NS,'clipPath');cp.id=id;const c=document.createElementNS(NS,'circle');c.setAttribute('cx',870);c.setAttribute('cy',625);c.setAttribute('r',0);cp.appendChild(c);defs.appendChild(cp);
 g.setAttribute('clip-path',`url(#${id})`);const t0=performance.now(),D=1250;
 (function step(now){const p=Math.max(0,Math.min(1,(now-t0)/D)),e=1-Math.pow(1-p,3);c.setAttribute('r',(e*470).toFixed(1));if(p<1)requestAnimationFrame(step);else{g.removeAttribute('clip-path');cp.remove()}})(t0);
 svg.querySelectorAll('.field-inset').forEach((f,i)=>f.animate([{opacity:0},{opacity:1}],{duration:600,delay:700+i*110,easing:EASE,fill:'backwards'}));
 svg.querySelectorAll('.field-inset circle[data-pid]').forEach((d,i)=>d.animate([{opacity:0,transform:'translateY(-22px)'},{opacity:1,transform:'none'}],{duration:620,delay:1150+i*55,easing:'cubic-bezier(.3,1.4,.5,1)',fill:'backwards'}))}

/* ---------- render 감싸기 ---------- */
const base=render;
render=function(){const atlasBefore=!!document.querySelector('.ex-final .exhibition-plate'),before=atlasBefore?dotPositions():new Map(),prev=stageInd;
 base.apply(this,arguments);
 if(!document.querySelector('.ex-final .exhibition-plate')){stageInd=null;return}
 placeStage(atlasBefore?prev:null);if(atlasBefore)slideDots(before);else enter();bindFocus()};

/* ---------- 1. 포커스 ---------- */
function axesOf(el){if(el.dataset.hot)return el.dataset.hot.split(' ');if(el.dataset.mapField)return[el.dataset.mapField];return[]}
function bindFocus(){const svg=document.querySelector('.exhibition-plate');if(!svg||svg.dataset.focusBound)return;svg.dataset.focusBound='1';
 const items=[...svg.querySelectorAll('[data-map-field],[data-hot]')];
 const set=src=>{if(!src){svg.removeAttribute('data-focus');items.forEach(x=>x.classList.remove('dim'));return}
  const F=axesOf(src),all=F.length===4,kidp=src.hasAttribute('data-kidp-label');svg.setAttribute('data-focus',F.join(''));
  items.forEach(x=>{let keep;if(x===src||all)keep=true;else if(x.hasAttribute('data-kidp-label'))keep=!kidp&&axesOf(x).includes(F[0])||x.classList.contains('m07c-all');else keep=F.includes(x.dataset.mapField);x.classList.toggle('dim',!keep)})};
 svg.addEventListener('pointerover',e=>{const el=e.target.closest('[data-map-field],[data-hot]');set(el&&svg.contains(el)?el:null)});
 svg.addEventListener('pointerleave',()=>set(null));svg.addEventListener('focusin',e=>{const el=e.target.closest('[data-map-field],[data-hot]');if(el)set(el)});svg.addEventListener('focusout',()=>set(null))}

/* ---------- 4. 대기 모드(?kiosk) ---------- */
if(new URLSearchParams(location.search).has('kiosk')){let idle=null,tick=null;const WAIT=30000,STEP=6000;
 const badge=document.createElement('div');badge.id='kiosk-badge';badge.textContent='AUTO · 단계별 배치가 자동으로 넘어갑니다';badge.hidden=true;document.body.appendChild(badge);
 const stop=()=>{clearInterval(tick);tick=null;badge.hidden=true;clearTimeout(idle);idle=setTimeout(start,WAIT)};
 const start=()=>{if(route!=='atlas'){stop();return}badge.hidden=false;tick=setInterval(()=>{if(route!=='atlas'){stop();return}exStep=(exStep+1)%4;if(exStep===0)exState=exState==='actual'?'ideal':'actual';render()},STEP)};
 ['pointerdown','keydown','wheel','touchstart'].forEach(ev=>addEventListener(ev,stop,{passive:true}));addEventListener('pointermove',e=>{if(e.movementX||e.movementY)stop()},{passive:true});stop()}

/* 첫 화면이 이미 그려져 있으면 바로 연출 */
if(document.querySelector('.ex-final .exhibition-plate')){placeStage(null);enter();bindFocus()}
})();
