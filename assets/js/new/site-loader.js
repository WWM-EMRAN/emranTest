
document.addEventListener('DOMContentLoaded',async()=>{
 const BASE='./assets/data/';
 const FILES=['site.json','personal_information.json','academic_information.json','projects.json'];
 await SiteCore.preloadAll(BASE,FILES);
 const p=location.pathname.toLowerCase();
 if(p.endsWith('index.html')||p.endsWith('/')) SiteIndex.init();
 else if(p.includes('section-details')) SiteSection.init();
 else if(p.includes('page-details')) SitePage.init();
 else if(p.includes('curriculum-vitae')) SiteCV.init();
});
