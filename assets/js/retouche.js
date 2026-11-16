/* Retouche depuis le site : clic droit › « Demander une modification ici ».
   Repère la page, l'étape, le modèle (bloc) et le texte visés, permet de tracer une zone et de dicter la demande (reconnaissance vocale du navigateur, gratuite).
   L'envoi ouvre une « issue » GitHub pré-remplie (aucune clé n'est stockée dans le site) ; l'action GitHub .github/workflows/retouche.yml fait faire la modification à Claude.
   Aucun secret ici : le site est public. */
(function(){
  if(window.__retouche) return; window.__retouche=true;
  const REPO='Cocosdnc/sciences-animees';
  const css=`
  #rt-menu{position:fixed;z-index:99999;background:#10171F;color:#E8EEF4;border:1px solid #25313D;border-radius:10px;padding:4px;box-shadow:0 8px 28px rgba(0,0,0,.5);font:14px/1.3 "IBM Plex Sans","Segoe UI",sans-serif;min-width:230px}
  #rt-menu button{all:unset;display:block;width:100%;box-sizing:border-box;padding:10px 12px;border-radius:7px;cursor:pointer}
  #rt-menu button:hover,#rt-menu button:focus-visible{background:#1d2a36}
  #rt-panel{position:fixed;z-index:99999;right:12px;bottom:12px;width:min(420px,calc(100vw - 24px));max-height:calc(100vh - 24px);overflow:auto;background:#10171F;color:#E8EEF4;border:1px solid #3a4a5a;border-radius:14px;padding:14px;box-shadow:0 12px 40px rgba(0,0,0,.6);font:14px/1.45 "IBM Plex Sans","Segoe UI",sans-serif}
  #rt-panel h3{margin:0 0 8px;font:700 16px "Archivo","Helvetica Neue",sans-serif}
  #rt-panel .ctx{background:#16202A;border-radius:8px;padding:8px 10px;font-size:13px;color:#93A1B0;margin-bottom:10px;word-break:break-word}
  #rt-panel .ctx b{color:#E8EEF4;font-weight:500}
  #rt-panel textarea{width:100%;box-sizing:border-box;min-height:90px;background:#05080B;color:#E8EEF4;border:1px solid #25313D;border-radius:8px;padding:8px;font:inherit;resize:vertical}
  #rt-panel .row{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
  #rt-panel button{font:500 14px "IBM Plex Sans",sans-serif;color:#E8EEF4;background:#16202A;border:1px solid #25313D;border-radius:8px;padding:9px 12px;cursor:pointer}
  #rt-panel button:hover{border-color:#93A1B0}
  #rt-panel button.go{background:#FF3D33;border-color:#FF3D33;color:#fff}
  #rt-panel button[aria-pressed="true"]{background:#E8EEF4;color:#090D12}
  #rt-panel .msg{font-size:12.5px;color:#93A1B0;margin-top:8px}
  #rt-zone{position:fixed;inset:0;z-index:99998;cursor:crosshair;background:rgba(0,0,0,.25);touch-action:none}
  #rt-box{position:fixed;border:2px dashed #FF3D33;background:rgba(255,61,51,.12);z-index:99998;pointer-events:none}
  #rt-hint{position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:99999;background:#10171F;color:#E8EEF4;border:1px solid #3a4a5a;border-radius:8px;padding:8px 12px;font:14px "IBM Plex Sans",sans-serif}`;
  const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
  const txt=(e,n)=>((e&&e.textContent)||'').replace(/\s+/g,' ').trim().slice(0,n||160);
  function contextOf(el){
    const bloc=el&&el.closest&&el.closest('[data-bloc]'), sec=el&&el.closest&&el.closest('section[id]');
    const h=sec&&sec.querySelector('h2'), cv=el&&el.closest&&el.closest('canvas');
    const near=el&&el.closest&&el.closest('button,.caption,.note,p,li,h1,h2,h3,label,.info,.infobox');
    return {page:location.pathname.replace(/^\/sciences-animees/,'')+location.hash, titre:document.title,
      etape:sec?(sec.id+(h?' — '+txt(h,80):'')):'', bloc:bloc?bloc.dataset.bloc:'', canvas:!!cv,
      element:near?txt(near,200):'', selection:String(window.getSelection?window.getSelection():'').trim().slice(0,400), largeur:innerWidth+'×'+innerHeight};
  }
  let menu=null, panel=null, ctx=null, rec=null, zone=null;
  const kill=n=>{ if(n&&n.parentNode) n.parentNode.removeChild(n); };
  function closeMenu(){ kill(menu); menu=null; }
  function closePanel(){ if(rec){ try{rec.stop();}catch(e){} rec=null; } kill(panel); panel=null; }
  addEventListener('contextmenu',e=>{
    if(panel&&panel.contains(e.target)) return;
    if(e.target.closest&&e.target.closest('input,textarea,select')) return;
    e.preventDefault(); closeMenu(); ctx=contextOf(e.target); ctx.x=e.clientX; ctx.y=e.clientY; zone=null;
    menu=document.createElement('div'); menu.id='rt-menu'; menu.setAttribute('role','menu');
    menu.innerHTML='<button type="button" role="menuitem">✏️ Demander une modification ici…</button>';
    document.body.appendChild(menu); const r=menu.getBoundingClientRect();
    menu.style.left=Math.min(e.clientX,innerWidth-r.width-8)+'px'; menu.style.top=Math.min(e.clientY,innerHeight-r.height-8)+'px';
    menu.firstChild.onclick=()=>{ closeMenu(); openPanel(); }; menu.firstChild.focus();
  });
  addEventListener('click',e=>{ if(menu&&!menu.contains(e.target)) closeMenu(); });
  addEventListener('keydown',e=>{ if(e.key==='Escape'){ closeMenu(); } });
  function ctxHtml(){ const c=ctx, z=zone;
    const row=(k,v)=>v?'<div><b>'+k+' :</b> '+String(v).replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]))+'</div>':'';
    return row('Page',c.page)+row('Étape',c.etape)+row('Modèle',c.bloc)+row('Élément',c.element)+row('Texte sélectionné',c.selection)+(z?row('Zone tracée',z.desc):''); }
  function openPanel(){
    closePanel(); panel=document.createElement('div'); panel.id='rt-panel'; panel.setAttribute('role','dialog'); panel.setAttribute('aria-label','Demander une modification');
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    panel.innerHTML='<h3>Demander une modification</h3><div class="ctx"></div>'+
      '<textarea placeholder="Dis ou écris ce qu’il faut changer (ex. : « cette phrase n’est pas claire, reformule-la »)" aria-label="Demande de modification"></textarea>'+
      '<div class="row">'+(SR?'<button type="button" data-a="mic" aria-pressed="false">🎤 Dicter</button>':'')+'<button type="button" data-a="zone">▭ Tracer une zone</button><button type="button" data-a="go" class="go">Envoyer à Claude</button><button type="button" data-a="copy">Copier</button><button type="button" data-a="x">Fermer</button></div>'+
      '<div class="msg">L’envoi ouvre une demande GitHub pré-remplie : il suffit d’appuyer sur « Submit new issue ». Claude fait ensuite la modification et la publie.'+(SR?'':' La dictée n’est pas disponible dans ce navigateur : utilise le micro du clavier de ton téléphone ou de ton ordinateur.')+'</div>';
    document.body.appendChild(panel); const ta=panel.querySelector('textarea'), cx=panel.querySelector('.ctx'), msg=panel.querySelector('.msg');
    const refresh=()=>{ cx.innerHTML=ctxHtml(); }; refresh(); ta.focus();
    const body=()=>{ const c=ctx; return '## Demande de modification (depuis le site)\n\n'+(ta.value.trim()||'(à préciser)')+'\n\n## Contexte\n\n'+
      '- Page : `'+c.page+'` ('+c.titre+')\n'+(c.etape?'- Étape : '+c.etape+'\n':'')+(c.bloc?'- Modèle (bloc) : `'+c.bloc+'` → fichier `assets/js/blocs/'+c.bloc+'.js`\n':'')+
      (c.element?'- Élément visé : « '+c.element+' »\n':'')+(c.selection?'- Texte sélectionné : « '+c.selection+' »\n':'')+(zone?'- Zone tracée : '+zone.desc+'\n':'')+
      '- Fenêtre : '+c.largeur+' px\n- Page source : `'+(c.page.split('#')[0].replace(/^\/+/,'')||'index.html')+'` (ou le `index.html` du dossier)\n'; };
    panel.onclick=e=>{ const a=e.target.dataset&&e.target.dataset.a; if(!a) return;
      if(a==='x') closePanel();
      else if(a==='copy'){ const t=body(); (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>{ msg.textContent='Copié. Colle-le où tu veux (par exemple dans une conversation avec Claude).'; },()=>{ ta.value=t; msg.textContent='Copie impossible automatiquement : le texte est dans la zone ci-dessus.'; }); }
      else if(a==='go'){ let b=body(); if(b.length>6000) b=b.slice(0,6000)+'\n…(tronqué)';
        const u='https://github.com/'+REPO+'/issues/new?labels='+encodeURIComponent('retouche')+'&title='+encodeURIComponent('Retouche : '+(ta.value.trim().slice(0,60)||ctx.page))+'&body='+encodeURIComponent(b);
        window.open(u,'_blank','noopener'); msg.textContent='Demande ouverte dans un nouvel onglet : appuie sur « Submit new issue » pour l’envoyer.'; }
      else if(a==='zone'){ panel.style.display='none'; pickZone(z=>{ panel.style.display=''; if(z){ zone=z; refresh(); } }); }
      else if(a==='mic'){ const btn=e.target;
        if(rec){ try{rec.stop();}catch(er){} return; }
        rec=new SR(); rec.lang='fr-FR'; rec.continuous=true; rec.interimResults=false; const base=ta.value;
        rec.onresult=ev=>{ let s=''; for(let i=0;i<ev.results.length;i++) s+=ev.results[i][0].transcript+' '; ta.value=(base?base.trim()+' ':'')+s.trim(); };
        rec.onerror=ev=>{ msg.textContent='Dictée impossible ('+ev.error+'). Autorise le micro pour ce site, puis réessaie.'; };
        rec.onend=()=>{ rec=null; btn.setAttribute('aria-pressed',false); btn.textContent='🎤 Dicter'; };
        try{ rec.start(); btn.setAttribute('aria-pressed',true); btn.textContent='⏹ Arrêter la dictée'; }catch(er){ rec=null; } } };
  }
  function pickZone(done){
    const ov=document.createElement('div'); ov.id='rt-zone'; const box=document.createElement('div'); box.id='rt-box'; box.style.display='none';
    const hint=document.createElement('div'); hint.id='rt-hint'; hint.textContent='Trace un rectangle sur la partie à modifier (Échap pour annuler)';
    document.body.append(ov,box,hint); let x0,y0,drag=false;
    const end=r=>{ kill(ov); kill(box); kill(hint); removeEventListener('keydown',esc); done(r); };
    const esc=e=>{ if(e.key==='Escape') end(null); }; addEventListener('keydown',esc);
    ov.onpointerdown=e=>{ drag=true; x0=e.clientX; y0=e.clientY; box.style.display='block'; ov.setPointerCapture(e.pointerId); };
    ov.onpointermove=e=>{ if(!drag) return; const l=Math.min(x0,e.clientX), t=Math.min(y0,e.clientY); Object.assign(box.style,{left:l+'px',top:t+'px',width:Math.abs(e.clientX-x0)+'px',height:Math.abs(e.clientY-y0)+'px'}); };
    ov.onpointerup=e=>{ drag=false; const l=Math.min(x0,e.clientX), t=Math.min(y0,e.clientY), w=Math.abs(e.clientX-x0), h=Math.abs(e.clientY-y0);
      if(w<6||h<6){ end(null); return; }
      ov.style.display='none'; box.style.display='none'; const pts=[[l+w/2,t+h/2],[l+8,t+8],[l+w-8,t+8],[l+8,t+h-8],[l+w-8,t+h-8]], seen=new Set(), found=[];
      pts.forEach(p=>document.elementsFromPoint(p[0],p[1]).forEach(el=>{ if(['HTML','BODY'].includes(el.tagName)||el.id&&el.id.startsWith('rt-')) return; const b=el.closest('[data-bloc]'); if(b&&!seen.has('b'+b.dataset.bloc)){ seen.add('b'+b.dataset.bloc); found.push('modèle `'+b.dataset.bloc+'`'); }
        const s=el.closest('section[id]'); if(s&&!seen.has('s'+s.id)){ seen.add('s'+s.id); found.push('étape `'+s.id+'`'); }
        if(/^(H1|H2|H3|P|LI|BUTTON|LABEL)$/.test(el.tagName)&&txt(el,80)&&!seen.has(txt(el,40))){ seen.add(txt(el,40)); found.push('« '+txt(el,80)+' »'); } }));
      ctx.etape=ctx.etape||''; const zc=found.slice(0,6).join(' ; ');
      end({desc:Math.round(l)+','+Math.round(t)+' '+Math.round(w)+'×'+Math.round(h)+' px (+ défilement '+Math.round(scrollY)+' px)'+(zc?' — contient : '+zc:'')}); };
  }
})();
