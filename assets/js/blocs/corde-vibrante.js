/* Bloc « corde-vibrante » : ondes stationnaires sur une corde fixée aux deux bouts.
   Réutilisable pour le son (instruments), les ondes, et comme analogie des couches électroniques. */
Labo.defineBloc('corde-vibrante',{
  titre:'La corde vibrante',
  mount(el){
    const L=Labo, C=L.C;
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas style="aspect-ratio:400/200" aria-label="Corde fixée aux deux bouts qui vibre, avec ses nœuds et ses ventres"></canvas></div>'+
      '<div class="lc"><div class="seg" role="group" aria-label="Mode d’excitation"><button type="button" data-m="mode" aria-pressed="true">Modes propres</button><button type="button" data-m="force" aria-pressed="false">Secouer à une fréquence au choix</button></div>'+
      '<label class="slider" data-r="n"><span>Mode</span><input type="range" min="1" max="6" step="1" value="2"><strong>2</strong></label>'+
      '<label class="slider" data-r="f" hidden><span>Fréquence imposée</span><input type="range" min="50" max="650" step="1" value="150"><strong></strong></label></div>'+
      '<div class="caption"><b></b><span></span></div>'+
      '<div class="infobar"></div><div class="infobox" hidden></div></div>';
    const INFO={
      noeud:['Nœud','Point de la corde qui ne bouge jamais. Les deux bouts attachés sont forcément des nœuds.'],
      ventre:['Ventre','Point où la corde bouge le plus, à mi-chemin entre deux nœuds.'],
      entier:['Pourquoi seulement certaines notes ?','L’onde fait des allers-retours entre les deux bouts. Elle ne se renforce que si, après un aller-retour, elle retombe exactement en phase avec elle-même : il faut un nombre entier de demi-ondes sur la longueur. Sinon, les allers-retours se contrarient et l’onde s’éteint.'],
      harmo:['Harmoniques','Le mode 1 donne la note fondamentale. Le mode 2 vibre deux fois plus vite (l’octave), le mode 3 trois fois plus vite, etc. Une vraie corde de guitare vibre dans plusieurs modes à la fois : c’est ce qui fait son timbre.'],
      atome:['Le lien avec l’atome','L’électron autour du noyau est une onde enfermée, comme la corde. Il ne peut donc vibrer que de certaines façons, avec 0, 1, 2… nœuds. Chaque nœud de plus coûte de l’énergie : ce sont les couches électroniques.']
    };
    L.infoBar(el.querySelector('.infobar'),el.querySelector('.infobox'),['noeud','ventre','entier','harmo','atome'],INFO);
    const V=L.setup(el.querySelector('canvas'),400,200), rn=el.querySelector('[data-r="n"]'), rf=el.querySelector('[data-r="f"]');
    const F1=110; let mode='mode', n=2, f=150, t=0;
    const cap=()=>{ const b=el.querySelector('.caption b'), s=el.querySelector('.caption span');
      if(mode==='mode'){ b.textContent='Mode '+n+' : '+n+' ventre'+(n>1?'s':'')+', '+(n+1)+' nœuds · '+(n*F1)+' Hz';
        s.textContent='Une corde attachée aux deux bouts ne vibre durablement que si un nombre entier de demi-ondes y tient. Chaque mode a un nœud de plus que le précédent et une fréquence plus haute : '+F1+' Hz, '+(2*F1)+' Hz, '+(3*F1)+' Hz…'; }
      else { b.textContent='Secouée à '+f+' Hz'; s.textContent='On secoue un bout à la fréquence choisie. La corde reste presque immobile, sauf quand la fréquence tombe sur un mode propre ('+F1+', '+(2*F1)+', '+(3*F1)+' Hz…) : là, elle se met à vibrer fort. C’est la résonance.'; } };
    el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{ mode=b.dataset.m; el.querySelectorAll('[data-m]').forEach(c=>c.setAttribute('aria-pressed',c===b)); rn.hidden=mode!=='mode'; rf.hidden=mode==='mode'; cap(); });
    rn.querySelector('input').oninput=e=>{ n=+e.target.value; rn.querySelector('strong').textContent=n; cap(); };
    rf.querySelector('input').oninput=e=>{ f=+e.target.value; rf.querySelector('strong').textContent=f+' Hz'; cap(); };
    rf.querySelector('strong').textContent=f+' Hz'; cap();
    const X0=30, X1=370, Y=96;
    L.onFrame(dt=>{ t+=dt; const x=V.ctx; V.base(); L.bgLab(x,400,200);
      [X0,X1].forEach(px=>{ x.fillStyle=L.lg(x,px-6,0,px+6,0,[[0,'#5E6873'],[.5,'#D3DAE0'],[1,'#5E6873']]); x.fillRect(px-5,Y-40,10,80); });
      let shape, amp;
      if(mode==='mode'){ shape=u=>Math.sin(n*Math.PI*u); amp=42*Math.cos(2*Math.PI*1.2*t*Math.sqrt(n)); }
      else { const k=Math.PI*f/F1, den=Math.sin(k), d=Math.sign(den||1)*Math.sqrt(den*den+.012); shape=u=>.06*Math.sin(k*u)/d; amp=40*Math.cos(2*Math.PI*1.2*t); }
      for(let pass=0;pass<2;pass++){ x.beginPath(); for(let i=0;i<=200;i++){ const u=i/200, X=X0+u*(X1-X0), yy=Y-amp*shape(u)*(pass?1:-1); i?x.lineTo(X,yy):x.moveTo(X,yy); }
        x.strokeStyle=pass?'#E8EEF4':'rgba(232,238,244,.12)'; x.lineWidth=pass?2:1.5; x.stroke(); }
      if(mode==='mode'){ for(let k=0;k<=n;k++){ const X=X0+k/n*(X1-X0); L.glow(x,X,Y,10,C.blue,.5); L.sph(x,X,Y,3.2,C.blue); }
        for(let k=0;k<n;k++){ const X=X0+(k+.5)/n*(X1-X0); L.txt(x,'ventre',X,Y+56,'center',C.hole); }
        L.txt(x,'nœuds (bleu) : la corde n’y bouge jamais',X0,186,'left',C.blue); }
      else { L.txt(x,'bout secoué',X1,Y+56,'right',C.hole); const bars=[1,2,3,4,5]; bars.forEach(m=>{ const X=X0+(m*F1-50)/600*(X1-X0); L.line(x,X,176,X,170,C.muted,1); L.txt(x,m*F1+'',X,186,'center'); });
        const fx=X0+(f-50)/600*(X1-X0); L.poly(x,[fx,168,fx-5,160,fx+5,160],C.laser); L.txt(x,'modes propres (Hz) :',X0,160,'left'); }
      L.vignette(x,400,200); },el);
  }
});
