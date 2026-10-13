(function(){
  const OWNER='inigougedoehu-ai', REPO='2026JJFF', BRANCH='main', PATH='assets/js/data.js';
  const API=`https://api.github.com/repos/${OWNER}/${REPO}`;
  const $=(s)=>document.querySelector(s);
  const esc=(s='')=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const token=()=>$('#github-token').value.trim();
  const headers=()=>({'Accept':'application/vnd.github+json','Authorization':`Bearer ${token()}`,'X-GitHub-Api-Version':'2022-11-28'});
  function encodeBase64Utf8(str){ const bytes=new TextEncoder().encode(str); let binary=''; bytes.forEach(b=>binary+=String.fromCharCode(b)); return btoa(binary); }
  function setStatus(el,msg,type=''){ el.textContent=msg; el.className=(el.id==='save-status'?'save-status':'admin-status')+(type?' '+type:''); }
  function input(value,cls,placeholder='https://…'){ return `<input class="admin-input ${cls}" value="${esc(value==='#'?'':value||'')}" placeholder="${placeholder}">`; }
  function render(){
    $('#admin-talks').innerHTML=window.JJFF_DATA.talks.map((t,i)=>`<div class="admin-row" data-talk="${i}"><div class="admin-row-title"><strong>${esc(t.title)}</strong><small>${esc(t.speaker)} · ${esc(t.date)} ${esc(t.time)}</small></div><label><span>Canva</span>${input(t.canva,'talk-canva')}</label><label><span>Materiales</span>${input(t.materials,'talk-materials')}</label></div>`).join('');
    let rows=[]; window.JJFF_DATA.resources.forEach((g,gi)=>g.items.forEach((r,ri)=>rows.push(`<div class="admin-row" data-resource-group="${gi}" data-resource="${ri}"><div class="admin-row-title"><strong>${esc(r.title)}</strong><small>${esc(g.group)} · ${esc(r.provider)}</small></div><label><span>Enlace</span>${input(r.href,'resource-href')}</label><label><span>Proveedor</span>${input(r.provider,'resource-provider','OneDrive / Canva / Web JJFF')}</label></div>`))); $('#admin-resources').innerHTML=rows.join('');
    $('#admin-status-text').value=window.JJFF_DATA.meta.status||''; $('#admin-updated-text').value=window.JJFF_DATA.meta.updated||'';
  }
  function collect(){
    document.querySelectorAll('[data-talk]').forEach(row=>{ const i=+row.dataset.talk; const c=row.querySelector('.talk-canva').value.trim(); const m=row.querySelector('.talk-materials').value.trim(); window.JJFF_DATA.talks[i].canva=c||'#'; window.JJFF_DATA.talks[i].materials=m||'#'; });
    document.querySelectorAll('[data-resource]').forEach(row=>{ const gi=+row.dataset.resourceGroup, ri=+row.dataset.resource; const h=row.querySelector('.resource-href').value.trim(), p=row.querySelector('.resource-provider').value.trim(); window.JJFF_DATA.resources[gi].items[ri].href=h||'#'; window.JJFF_DATA.resources[gi].items[ri].provider=p||window.JJFF_DATA.resources[gi].items[ri].provider; });
    window.JJFF_DATA.meta.status=$('#admin-status-text').value.trim(); window.JJFF_DATA.meta.updated=$('#admin-updated-text').value.trim();
  }
  async function check(){
    if(!token()){ setStatus($('#auth-status'),'Introduce el token.','error'); return false; }
    setStatus($('#auth-status'),'Comprobando…');
    try{ const r=await fetch(API,{headers:headers()}); if(!r.ok)throw new Error(`GitHub ha respondido ${r.status}`); const data=await r.json(); if(!data.permissions?.push)throw new Error('El token no tiene permiso de escritura en este repositorio.'); setStatus($('#auth-status'),'Acceso correcto.','ok'); return true; }catch(e){ setStatus($('#auth-status'),e.message,'error'); return false; }
  }
  async function save(){
    if(!(await check()))return; collect(); setStatus($('#save-status'),'Guardando…');
    try{
      const current=await fetch(`${API}/contents/${PATH}?ref=${BRANCH}`,{headers:headers()}); if(!current.ok)throw new Error(`No se pudo leer ${PATH} (${current.status}).`); const currentData=await current.json();
      const content='window.JJFF_DATA = '+JSON.stringify(window.JJFF_DATA,null,2)+';\n';
      const body={message:'Actualizar enlaces JJFF desde administración',content:encodeBase64Utf8(content),sha:currentData.sha,branch:BRANCH};
      const r=await fetch(`${API}/contents/${PATH}`,{method:'PUT',headers:{...headers(),'Content-Type':'application/json'},body:JSON.stringify(body)}); if(!r.ok){ const err=await r.json().catch(()=>({})); throw new Error(err.message||`GitHub ha respondido ${r.status}`); }
      setStatus($('#save-status'),'Cambios guardados. GitHub Pages puede tardar uno o dos minutos en actualizarse.','ok');
    }catch(e){ setStatus($('#save-status'),e.message,'error'); }
  }
  $('#test-token').addEventListener('click',check); $('#save-admin').addEventListener('click',save); render();
})();
