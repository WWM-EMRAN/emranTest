
const SiteCV={
 init(){
  const c=document.getElementById('cv-root');
  const d=SiteCore.get('academic_information');
  if(!c||!d) return;
  d.items.forEach(i=>c.appendChild(SiteCore.el('div',{text:i.degree||i.title})));
 }
};
