
(()=>{const box=document.querySelector('#map-tip-card'),sel='.plate-map .m07c [data-map-field],.plate-map .m07c [data-kidp-label]';
function hide(){box.hidden=true}
function show(el,x,y){const a=el.dataset.mapField,d=MAP07_DOMAINS.find(d=>d.name===el.dataset.kidpLabel);if(!a&&!d)return;
box.querySelector('b').textContent=a?(el.classList.contains('order-region')?'Buchanan · ':'Axis '+a+' · ')+FIELDS[a].ko:d.name;
box.querySelector('p').textContent=a?FIELDS[a].focus+'?':(d.name==='융합'?'여러 분야를 통합하는 디자인. ':d.name==='디자인 일반'?'전략·정책 디자인 등을 포괄합니다. ':'')+'분류 대응 · '+(d.label||d.axes.join(' · '));
box.querySelector('small').textContent=a?FIELDS[a].boundary:'KIDP 9개 분야 · 그림 2-2의 분류 대응';
box.hidden=false;box.style.left=Math.max(6,Math.min(x+14,innerWidth-box.offsetWidth-8))+'px';box.style.top=Math.max(6,Math.min(y+15,innerHeight-box.offsetHeight-8))+'px'}
const target=e=>e.target.closest?.(sel);
document.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const el=target(e);if(el)show(el,e.clientX,e.clientY);else hide()});
document.addEventListener('pointerdown',e=>{const el=target(e);if(el)show(el,e.clientX,e.clientY);else hide()});
document.addEventListener('focusin',e=>{const el=target(e);if(!el){hide();return}let r=el.getBoundingClientRect();show(el,r.left+r.width/2,r.top+r.height/2)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')hide()});
window.addEventListener('scroll',hide,true);window.addEventListener('hashchange',hide);})();