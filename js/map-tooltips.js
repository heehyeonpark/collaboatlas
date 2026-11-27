/* 원형 지도 롤오버 설명.
   두 방식을 비교할 수 있다: 기본은 유리 카드(커서 방향으로 원 바깥에 뜸), 주소에 ?tip=hub를 붙이면 가운데 원 설명판. */
(()=>{
const box=document.querySelector('#map-tip-card'),sel='.plate-map .m07c [data-map-field],.plate-map .m07c [data-kidp-label]';
const MODE=(new URLSearchParams(location.search).get('tip')||'glass')==='hub'?'hub':'glass';
document.documentElement.dataset.tipMode=MODE;
const line=document.createElement('div');line.id='map-tip-line';line.hidden=true;document.body.appendChild(line);
const BUCH={A:['SYMBOL','기호'],B:['THINGS','사물'],C:['ACTIONS','활동과 서비스'],D:['ENVIRONMENTS','시스템과 환경']};
const BUCH_NOTE={A:'첫째 영역. 본 연구는 Axis A 기호·의미 중심에 대응시켰습니다.',B:'둘째 영역. 본 연구는 Axis B 사물·인공물 중심에 대응시켰습니다.',
 C:'셋째 영역. 행동과 상호작용은 Axis C, 조직된 서비스는 Axis D에 대응시켰습니다.',D:'넷째 영역. 셋째 영역의 조직된 서비스와 함께 Axis D에 대응시켰습니다.'};
const AXIS_LINE={A:'의미 전달과 해석의 관점에서 디자인 문제를 봅니다.',B:'형태와 기능, 물리적 구성의 관점에서 문제를 봅니다.',
 C:'행동과 상호작용의 흐름을 중심으로 문제를 봅니다.',D:'관계와 운영, 복합적인 맥락에서 문제를 봅니다.'};
const nameOf=n=>n.replace(/\s/g,'');
function content(el){
 const a=el.dataset.mapField,d=MAP07_DOMAINS.find(x=>x.name===el.dataset.kidpLabel);
 if(a&&el.classList.contains('order-region'))return{kind:a,hubTag:BUCH[a][0],hubTitle:BUCH[a][1],title:BUCH[a][0]+' · '+BUCH[a][1],tag:'Buchanan(1992)',body:BUCH_NOTE[a],note:'네 영역은 같은 크기로 두어 위계를 뜻하지 않습니다 (2.2.3)'};
 if(a)return{kind:a,hubTag:'AXIS '+a,hubTitle:FIELDS[a].ko,title:'AXIS '+a+' · '+FIELDS[a].ko,tag:'AXIS '+a,body:AXIS_LINE[a],note:'누르면 이 분야의 가이드로 이동합니다'};
 if(!d)return null;
 const tag=d.label||d.axes.join(' · '),kind=d.axes[0];
 if(d.name==='융합')return{kind,title:'융합디자인',tag,body:'여러 분야를 통합하는 디자인. 네 축 모두에 걸치며 본 연구는 주로 Axis D에 대응시켰습니다.',note:'KIDP(2019) 9개 분야 · 2.2.3'};
 if(d.name==='디자인 일반')return{kind,title:'디자인일반',tag,body:'전략·정책 디자인 등. 네 축 모두에 걸치며 본 연구는 주로 Axis D에 대응시켰습니다.',note:'KIDP(2019) 9개 분야 · 2.2.3'};
 const main='Axis '+d.axes[0]+' '+FIELDS[d.axes[0]].ko,more=d.axes.slice(1).map(x=>'Axis '+x).join(', ');
 return{kind,title:nameOf(d.name),tag,body:'주로 '+main+'에 대응'+(more?', '+more+(d.label&&d.label.includes('일부')?'에 일부 걸칩니다.':'에도 걸칩니다.'):'시켰습니다.'),note:'KIDP(2019) 9개 분야 · 그림 2-2'};
}
/* 원의 중심과 바깥 반지름(화면 좌표): 네 축 색 띠를 합친 상자 */
function circleOf(el){const g=el.closest('.m07c');if(!g)return null;let L=1e9,T=1e9,R=-1e9,B=-1e9;
 g.querySelectorAll('.m07c-axis-arc').forEach(p=>{const r=p.getBoundingClientRect();L=Math.min(L,r.left);T=Math.min(T,r.top);R=Math.max(R,r.right);B=Math.max(B,r.bottom)});
 if(R<L)return null;return{x:(L+R)/2,y:(T+B)/2,r:Math.max(R-L,B-T)/2,g}}
/* 유리 카드: 커서가 있는 방향으로, 원 바깥 사분면에 놓는다(모서리가 원 밖이면 상자 전체가 원 밖) */
let lastKey='';
function showGlass(el,x,y){const c=content(el);if(!c)return;const C=circleOf(el);
 const key=c.title;if(key!==lastKey){box.querySelector('b').textContent=c.title;box.querySelector('p').textContent=c.body;box.querySelector('small').textContent=c.note;box.style.setProperty('--tone',FIELDS[c.kind]?.color||'var(--ink)');lastKey=key;box.classList.remove('in');void box.offsetWidth}
 box.hidden=false;const w=box.offsetWidth,h=box.offsetHeight;let left=x+14,top=y+15,ax=x,ay=y;
 if(C){let dx=x-C.x,dy=y-C.y,len=Math.hypot(dx,dy)||1;dx/=len;dy/=len;const gap=14;ax=C.x+dx*(C.r+gap);ay=C.y+dy*(C.r+gap);
  left=dx>=0?ax:ax-w;top=dy>=0?ay:ay-h}
 left=Math.max(8,Math.min(left,innerWidth-w-8));top=Math.max(8,Math.min(top,innerHeight-h-8));
 box.style.left=left+'px';box.style.top=top+'px';box.classList.add('in');
 if(C){const L=Math.hypot(ax-x,ay-y);line.hidden=false;line.style.left=x+'px';line.style.top=y+'px';line.style.width=L+'px';line.style.transform='rotate('+Math.atan2(ay-y,ax-x)+'rad)'}}
/* 가운데 설명판: 원 안에는 이름과 축 표기만, 긴 문장은 원 아래 캡션 자리 */
let hubOn=null;
function showHub(el){const c=content(el);if(!c)return;const C=circleOf(el);if(!C)return;const g=C.g;
 if(hubOn&&hubOn!==g)clearHub();hubOn=g;g.classList.add('hub-on');
 const t=g.querySelector('.m07c-hub-title'),s=g.querySelector('.m07c-hub-tag');
 t.textContent=c.hubTitle||c.title;t.style.fontSize='';s.textContent=c.hubTag||c.tag;
 try{const max=118,len=t.getComputedTextLength();if(len>max)t.style.fontSize=(17*max/len).toFixed(1)+'px'}catch(e){}
 g.querySelector('.m07c-cap-1').textContent=c.body;g.querySelector('.m07c-cap-2').textContent=c.note;
 g.style.setProperty('--hub-tone',FIELDS[c.kind]?.color||'var(--ink)')}
function clearHub(){if(!hubOn)return;const g=hubOn;g.classList.remove('hub-on');
 const c1=g.querySelector('.m07c-cap-1'),c2=g.querySelector('.m07c-cap-2');c1.textContent=c1.dataset.default;c2.textContent=c2.dataset.default;hubOn=null}
function hide(){box.hidden=true;box.classList.remove('in');line.hidden=true;lastKey='';clearHub()}
function show(el,x,y){if(MODE==='hub')showHub(el);else showGlass(el,x,y)}
const target=e=>e.target.closest?.(sel);
document.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const el=target(e);if(el)show(el,e.clientX,e.clientY);else hide()});
document.addEventListener('pointerdown',e=>{const el=target(e);if(el)show(el,e.clientX,e.clientY);else hide()});
document.addEventListener('focusin',e=>{const el=target(e);if(!el){hide();return}const r=el.getBoundingClientRect();show(el,r.left+r.width/2,r.top+r.height/2)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')hide()});
window.addEventListener('scroll',hide,true);window.addEventListener('hashchange',hide);
})();
