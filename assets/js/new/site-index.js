
const SiteIndex={
 init(){
  const d=SiteCore.get('personal_information');
  const h=document.getElementById('index-hero');
  if(d&&h) SiteCore.append(h,SiteCore.el('h1',{text:d.name,class:'u-text-accent'}));
 }
};
