
window.SiteCore=(function(){
const mem={data:{},loaded:false,promise:null};
async function preloadAll(base,files){
 if(mem.promise) return mem.promise;
 mem.promise=Promise.all(files.map(async f=>{
  const r=await fetch(base+f);
  if(!r.ok) throw new Error(f);
  mem.data[f.replace(/\.json$/,'')]=await r.json();
 })).then(()=>mem.loaded=true);
 return mem.promise;
}
const get=k=>mem.data[k]||null;
const el=(t,o={})=>{const n=document.createElement(t);if(o.class)n.className=o.class;if(o.text)n.textContent=o.text;return n;};
const append=(p,...c)=>{c.filter(Boolean).forEach(x=>p.appendChild(x));return p;};
const card=({title,subtitle,body})=>{const c=el('div',{class:'card-basic card-media'});
 if(title) append(c,el('h4',{class:'card-title',text:title}));
 if(subtitle) append(c,el('div',{class:'card-subtitle',text:subtitle}));
 if(body) append(c,body); return c;};
return{preloadAll,get,el,append,card};
})();
