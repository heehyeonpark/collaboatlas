// 이전 판(v03)의 오프라인 캐시를 정리하고 스스로 해제한다.
// 새 판은 서비스워커를 쓰지 않으므로, 예전에 사이트를 연 기기에서 옛 화면이 남지 않게 한다.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil((async()=>{
  for(const k of await caches.keys())await caches.delete(k);
  await self.registration.unregister();
  for(const c of await self.clients.matchAll({type:'window'}))c.navigate(c.url);
})()));
