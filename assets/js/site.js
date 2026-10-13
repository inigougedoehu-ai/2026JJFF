(function(){
  const D = window.JJFF_DATA;
  const $ = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => [...el.querySelectorAll(s)];

  const icons = {
    calendar:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/></svg>',
    mic:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15a4 4 0 0 0 4-4V7a4 4 0 0 0-8 0v4a4 4 0 0 0 4 4ZM5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/></svg>',
    slides:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v12H4zM8 20l4-4 4 4M8 9l2 2 4-4 2 2"/></svg>',
    folder:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h7l2 2h9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z"/></svg>',
    lock:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V7a5 5 0 0 1 10 0v3M5 10h14v10H5z"/></svg>',
    external:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5h5v5M19 5l-8 8M18 13v6H5V6h6"/></svg>',
    arrow:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>'
  };

  function icon(name){ return icons[name] || icons.arrow; }
  function esc(s=''){ return String(s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  function usableLink(href){ return !!href && href !== '#'; }

  function initGlobal(){
    $$('[data-edition]').forEach(el=>el.textContent=D.meta.edition);
    $$('[data-dates]').forEach(el=>el.textContent=D.meta.dates);
    $$('[data-location]').forEach(el=>el.textContent=D.meta.location);
    $$('[data-updated]').forEach(el=>el.textContent=D.meta.updated);
    $$('[data-council-logo]').forEach(el=>{ if(window.JJFF_COUNCIL_LOGO) el.src=window.JJFF_COUNCIL_LOGO; });
    const current = location.pathname.split('/').pop() || 'index.html';
    $$('.nav-link').forEach(a=>{ const target=(a.getAttribute('href')||'').split('#')[0]; if(target===current || (current===''&&target==='index.html')) a.classList.add('active'); });
    const btn=$('.menu-button'), nav=$('.nav-links');
    if(btn&&nav) btn.addEventListener('click',()=>{ const open=nav.classList.toggle('open'); btn.setAttribute('aria-expanded',String(open)); });
  }

  function renderQuickLinks(){ const el=$('#quick-links'); if(!el)return; el.innerHTML=D.quickLinks.map(x=>`<a class="quick-card tone-${x.tone}" href="${x.href}"><span class="quick-icon">${icon(x.icon)}</span><span>${esc(x.label)}</span><span class="quick-arrow">${icon('arrow')}</span></a>`).join(''); }
  function renderNotices(){ const el=$('#notices'); if(!el)return; el.innerHTML=D.notices.map(n=>`<article class="notice ${n.type}"><span class="notice-symbol">${n.type==='locked'?icon('lock'):'i'}</span><div><strong>${esc(n.title)}</strong><p>${esc(n.text)}</p></div></article>`).join(''); }
  function nextSession(){ const now=new Date(); const sessions=D.schedule.map(s=>({...s,dt:new Date(`${s.date}T${s.start}:00`)})); return sessions.find(s=>s.dt>=now)||sessions[sessions.length-1]; }
  function renderNext(){ const el=$('#next-session'); if(!el)return; const s=nextSession(); el.innerHTML=`<div class="eyebrow">Próxima actividad</div><div class="next-time">${esc(s.start)}</div><div class="next-title">${esc(s.title)}</div>${s.speaker?`<div class="next-meta">${esc(s.speaker)}</div>`:''}<a href="horario.html" class="text-link">Ver horario ${icon('arrow')}</a>`; }

  const dayNames={"2026-10-23":"Viernes 23","2026-10-24":"Sábado 24","2026-10-25":"Domingo 25"};
  function eventBadge(type){ const labels={formacion:'Formación',descanso:'Pausa',logistica:'Logística',traslado:'Traslado',institucional:'Institucional',convivencia:'Convivencia'}; return labels[type]||type; }
  function renderSchedule(){
    const el=$('#schedule'); if(!el)return; const filter=$('#schedule-filter');
    const draw=(type='all')=>{ const days=[...new Set(D.schedule.map(x=>x.date))]; el.innerHTML=days.map(day=>{ const items=D.schedule.filter(x=>x.date===day&&(type==='all'||x.type===type)); if(!items.length)return''; return `<section class="day-block"><div class="day-heading"><span>${dayNames[day]}</span><span class="day-line"></span></div><div class="timeline">${items.map(s=>`<article class="timeline-item type-${s.type}"><div class="time"><strong>${esc(s.start)}</strong><span>${esc(s.end)}</span></div><div class="timeline-dot"></div><div class="event-card"><div class="event-top"><span class="badge">${eventBadge(s.type)}</span>${s.place?`<span class="place">${esc(s.place)}</span>`:''}</div><h3>${esc(s.title)}</h3>${s.speaker?`<p class="speaker">${esc(s.speaker)}</p>`:''}</div></article>`).join('')}</div></section>`; }).join(''); };
    draw(); if(filter)filter.addEventListener('change',()=>draw(filter.value));
  }
  function resourceButton(label,href,provider){ if(!usableLink(href))return `<span class="resource-btn disabled" title="Enlace pendiente"><span>${esc(label)}</span><small>Pendiente</small></span>`; return `<a class="resource-btn" href="${esc(href)}" target="_blank" rel="noopener"><span>${esc(label)}</span><small>${esc(provider)}</small>${icon('external')}</a>`; }
  function renderTalks(){ const el=$('#talks'); if(!el)return; const search=$('#talk-search'); const draw=(q='')=>{ q=q.toLowerCase().trim(); const list=D.talks.filter(t=>!q||`${t.title} ${t.speaker} ${t.date}`.toLowerCase().includes(q)); el.innerHTML=list.map(t=>`<article class="talk-card"><div class="talk-meta"><span>${esc(t.date)}</span><span>${esc(t.time)}</span></div><h3>${esc(t.title)}</h3><p class="speaker">${esc(t.speaker)}</p><div class="talk-actions">${resourceButton('Canva',t.canva,'Canva')}${resourceButton('Materiales',t.materials,'OneDrive')}</div></article>`).join('')||'<div class="empty">No hay resultados.</div>'; }; draw(); if(search)search.addEventListener('input',()=>draw(search.value)); }
  function renderResources(){ const el=$('#resources'); if(!el)return; el.innerHTML=D.resources.map(g=>`<section class="resource-group"><div class="section-kicker">${esc(g.group)}</div><div class="resource-list">${g.items.map(i=>`<article class="resource-row"><div class="resource-main"><div class="resource-title"><h3>${esc(i.title)}</h3>${i.access==='restricted'?`<span class="lock-badge">${icon('lock')} Restringido</span>`:`<span class="public-badge">Público</span>`}</div><p>${esc(i.description)}</p></div>${usableLink(i.href)?`<a class="open-link" href="${esc(i.href)}" ${i.href.startsWith('http')?'target="_blank" rel="noopener"':''}>Abrir ${icon(i.href.startsWith('http')?'external':'arrow')}</a>`:`<span class="open-link muted">Pendiente</span>`}</article>`).join('')}</div></section>`).join(''); }
  function renderPresentationRules(){ const el=$('#presentation-rules'); if(!el)return; el.innerHTML=D.presentationRules.map((r,i)=>`<article class="rule-card"><span class="rule-num">0${i+1}</span><div><h3>${esc(r.title)}</h3><p>${esc(r.text)}</p></div></article>`).join(''); }
  function renderPresentationLinks(){ const el=$('#presentation-links'); if(!el)return; el.innerHTML=D.talks.map(t=>`<article class="presentation-row"><div><div class="mini-meta">${esc(t.date)} · ${esc(t.time)}</div><h3>${esc(t.title)}</h3><p>${esc(t.speaker)}</p></div>${resourceButton('Abrir Canva',t.canva,'Canva')}</article>`).join(''); }
  initGlobal(); renderQuickLinks(); renderNotices(); renderNext(); renderSchedule(); renderTalks(); renderResources(); renderPresentationRules(); renderPresentationLinks();
})();
