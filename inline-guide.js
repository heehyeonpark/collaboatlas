let inlineStage=0;
const inlineStageRoutes=['define','ideate','evaluate','deliver'];
function inlineStageButtonLinks(html,side=false){return html.replace(/<a href="#(define|ideate|evaluate|deliver)"([^>]*)>([\s\S]*?)<\/a>/g,(all,name,attrs,body)=>{let i=inlineStageRoutes.indexOf(name),cls=side?'side-inline-stage':(attrs.match(/class="([^"]*)"/)||[])[1]||'';return `<button type="button" data-inline-stage="${i}" class="${cls} ${inlineStage===i?'selected':''}" aria-expanded="${inlineStage===i}" aria-controls="inline-stage-panel">${body.replace(' ↗','')}${side||attrs.includes('class=')?'':'<span class="inline-chevron" aria-hidden="true">'+(inlineStage===i?'−':'＋')+'</span>'}</button>`})}
const navigationBeforeInline=renderNavigation;
renderNavigation=function(){let html=navigationBeforeInline();return appSection()==='guide'?inlineStageButtonLinks(html,true):html};
const guideBeforeInline=guideView;
function inlineStageContent(i){let full=guideBeforeInline(i),start=full.indexOf('<div class="compact-guide">');return `<div class="inline-panel-heading"><span>AXIS ${axis} / ${FIELDS[axis].en}</span><h2>0${i+1}. ${STAGES[i].en}<small>${STAGES[i].ko}</small></h2><p>${STAGES[i].decision}</p></div>`+inlineStageButtonLinks(full.slice(start))}
const fieldsBeforeInline=fieldsView;
fieldsView=function(){let html=inlineStageButtonLinks(fieldsBeforeInline());let p=html.indexOf('<p class="source-note">안내는');const panel=`<section id="inline-stage-panel" class="inline-stage-panel" tabindex="-1" aria-label="선택한 단계의 협업 안내" ${inlineStage===null?'hidden':''}>${inlineStage===null?'':inlineStageContent(inlineStage)}</section>`;return p>=0?html.slice(0,p)+panel+html.slice(p):html+panel};
function chooseInlineStage(i){if(!Number.isInteger(i)||i<0||i>3)return;inlineStage=i;selectedStage=i;selectedAI=map07Proposal(axis,i).ai[0];selectedHuman=map07Proposal(axis,i).human[0];route='fields';if(location.hash!=='#fields')history.replaceState(null,'','#fields');render()}
document.addEventListener('click',e=>{let b=e.target.closest('[data-inline-stage]');if(!b)return;e.preventDefault();chooseInlineStage(Number(b.dataset.inlineStage))});
const renderBeforeInline=render;
render=function(){if(route==='fields'&&inlineStage===null){inlineStage=0;selectedStage=0;selectedAI=map07Proposal(axis,0).ai[0];selectedHuman=map07Proposal(axis,0).human[0]}let s=inlineStageRoutes.indexOf(route);if(s>=0){inlineStage=s;selectedStage=s;route='fields';history.replaceState(null,'','#fields')}renderBeforeInline()};
if(typeof chips!=='undefined'&&Object.keys(chips).length)render();
