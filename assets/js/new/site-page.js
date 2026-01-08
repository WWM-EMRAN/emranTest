
const SitePage={
 init(){
  const q=new URLSearchParams(location.search);
  const s=q.get('section'),id=q.get('id');
  if(!s||!id) return;
  const d=SiteCore.get(s);
  if(!d) return;
  const it=d.items.find(x=>x.id===id);
  if(!it) return;
  const c=document.getElementById('page_details');
  SiteCore.append(c,SiteCore.el('h1',{text:it.title}));
 }
};
