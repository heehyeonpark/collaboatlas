
(()=>{const dlg=document.querySelector('#sitemap-panel'), trigger=document.querySelector('#sitemap-open'),sections=[
['Atlas','atlas','전체 지도'],['SBRT','model','단계별 역할 전환 모델','sbrt'],['Guide','fields','협업 가이드'],['Log','record','내 협업 기록']];
trigger.onclick=()=>{const current=['define','ideate','evaluate','deliver'].includes(route)?'fields':route;
dlg.querySelector('nav').innerHTML=[...new Set(sections.map(s=>s[0]))].map(g=>'<section><h3>'+g+'</h3>'+sections.map(([group,r,name,panel],i)=>{if(group!==g)return '';const here=r===current&&(!panel||researchPanel===panel);return '<a href="#'+r+'" data-dest="'+i+'" '+(here?'aria-current="page"':'')+'>'+name+(here?'<small>현재 위치</small>':'')+'</a>'}).join('')+'</section>').join('');dlg.showModal()};
dlg.querySelector('nav').onclick=e=>{const a=e.target.closest('[data-dest]');if(!a)return;e.preventDefault();const [,r,,panel]=sections[Number(a.dataset.dest)];if(!canLeaveDraft())return;draftDirty=false;dlg.close();if(panel){researchPanel=panel;if(panel==='sbrt'){modelField='all';modelStage=-1}}navigate(r);main.focus()};
dlg.addEventListener('click',e=>{if(e.target===dlg){const b=dlg.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dlg.close()}});
})();