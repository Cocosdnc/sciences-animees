/* Bloc « densite-atmosphere » : pourquoi un rayon rasant traverse jusqu'à ~38 fois plus d'air qu'un rayon vertical.
   1. Gaz parfait dans la pesanteur : ρ(z) = ρ₀·exp(−z/H), H = kT/(mg) ≈ 8,4 km (calculé dans Diff.ATM).
   2. La diffusion est proportionnelle à la quantité d'air traversée : on intègre la densité le long du rayon.
   3. Rapport des deux intégrales = masse d'air m (Terre sphérique de rayon 6 371 km, atmosphère jusqu'à 120 km, sans réfraction).
   Le dessin du haut est à l'échelle (0,34 px par km), sans exagération verticale. */
Labo.defineBloc('densite-atmosphere',{
  titre:'Combien d’air un rayon traverse-t-il ?',
  mount(el){
    const L=Labo, C=L.C, D=window.Diff, A=D.ATM;
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas style="aspect-ratio:460/500" aria-label="Un rayon du Soleil traverse l’atmosphère, dessinée à l’échelle ; en dessous, la densité de l’air en fonction de l’altitude (verticale) et le long du rayon, avec l’aire sous chaque courbe"></canvas></div>'+
      '<div class="lc"><label class="slider"><span>Hauteur du Soleil</span><input type="range" min="0" max="90" step="0.5" value="10"><strong></strong></label>'+
      '<div class="seg" role="group" aria-label="Exemples"><button type="button" data-h="90">Zénith</button><button type="button" data-h="30">30°</button><button type="button" data-h="10">10°</button><button type="button" data-h="0">Horizon</button></div></div>'+
      '<div class="caption" aria-live="polite"><b></b><span></span></div>'+
      '<div class="infobar"></div><div class="infobox" hidden></div></div>';
    const INFO={
      gaz:['Pourquoi la densité baisse comme une exponentielle','Une couche d’air d’épaisseur dz porte le poids de tout l’air au-dessus d’elle : quand on monte de dz, la pression baisse de dp = −ρ·g·dz. Pour un gaz parfait, p = ρ·k·T/m, donc ρ = p·m/(k·T) : la densité est proportionnelle à la pression. En remplaçant : dp/dz = −(m·g/k·T)·p. Une grandeur dont la variation est proportionnelle à elle-même est une exponentielle : p(z) = p₀·exp(−z/H), avec H = k·T/(m·g). Avec T = 288 K, m = 29 u (masse moyenne d’une molécule d’air) et g = 9,81 m/s², on trouve H = 8,4 km. Tous les 5,8 km (H·ln 2), la densité est divisée par 2 ; à 8,8 km, au sommet de l’Everest, il reste environ 35 % de la densité du sol.'],
      ecrase:['La couche équivalente : l’atmosphère « écrasée »','L’aire sous la courbe de densité est la quantité totale d’air au-dessus de toi. Elle vaut ρ₀·H. C’est exactement ce qu’on aurait si tout l’air était écrasé en une couche de densité constante (celle du sol) et de hauteur H = 8,4 km : le rectangle en pointillés a la même aire que la courbe. Numériquement, ρ₀·H = 1,225 kg/m³ × 8 430 m ≈ 10 300 kg d’air au-dessus de chaque mètre carré, soit la pression au sol (1 013 hPa) divisée par g : c’est le poids d’une colonne d’air.'],
      integrale:['Pourquoi on calcule une intégrale','Une molécule d’air diffuse une petite fraction de la lumière qui la touche. Sur un trajet, la lumière en perd donc une fraction proportionnelle au nombre de molécules rencontrées, c’est-à-dire à l’intégrale de la densité le long du rayon. À la verticale, on intègre ρ(z) de 0 à l’infini : ρ₀·H. Le long d’un rayon incliné, on intègre ρ(s) pour s = distance parcourue : la hauteur au-dessus du sol dépend de s, comme z(s) = √((R + s·sin h)² + (s·cos h)²) − R, avec R = 6 371 km le rayon de la Terre. Le rapport des deux intégrales s’appelle la masse d’air, m.'],
      masse:['Pourquoi pas simplement 1/sin h ?','Pour un Soleil assez haut, la masse d’air vaut à peu près 1/sin(h) (la couche est vue de biais) : 2 à 30°, 5,8 à 10°. Mais cette formule donnerait l’infini à l’horizon. En réalité la Terre est ronde : plus le rayon est rasant, plus il monte lentement au-dessus du sol parce que le sol « tombe » sous le rayon, et il sort de l’atmosphère à environ 1 000 km. Le calcul avec Terre sphérique donne ici 34,5 à l’horizon. Les tables de Kasten et Young (1989), qui incluent aussi la réfraction (l’air courbe un peu le rayon vers le sol, ce qui augmente légèrement le trajet dans l’air dense), donnent 38. C’est cette valeur qu’on utilise pour le coucher du Soleil.'],
      simplif:['Ce qui est simplifié','Température constante de 15 °C partout (en réalité elle baisse jusqu’à 11 km d’altitude, puis remonte, ce qui change un peu H selon l’altitude). Atmosphère coupée à 120 km (au-dessus, il n’y a presque plus d’air). Pas de réfraction : le rayon est une droite. Dessin du haut à l’échelle (0,34 px par km) : l’atmosphère dense est une pellicule de quelques pixels. À gauche l’axe vertical est l’altitude (comme dans le dessin) ; à droite l’abscisse est la distance parcourue sur le rayon, avec une échelle fixe de 0 à 800 km : la colonne verticale y est tracée en bleu, sur le même axe, pour comparer les quantités d’air. Les échelles des deux graphes diffèrent (km d’altitude à gauche, km de trajet à droite).']
    };
    L.infoBar(el.querySelector('.infobar'),el.querySelector('.infobox'),['gaz','ecrase','integrale','masse','simplif'],INFO);
    const W=460,H=500,V=L.setup(el.querySelector('canvas'),W,H), inp=el.querySelector('input'), out=el.querySelector('.slider strong');
    let h=10, tr=D.trajet(h), t=0;
    const upd=()=>{ h=+inp.value; tr=D.trajet(Math.max(h,0)); out.textContent=h.toFixed(1).replace('.',',')+'°'; cap(); };
    inp.addEventListener('input',upd); el.querySelectorAll('[data-h]').forEach(b=>b.onclick=()=>{ inp.value=b.dataset.h; upd(); });
    const fr=(v,d)=>v.toFixed(d).replace('.',',');
    const fmt=v=>Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g,' ');
    function cap(){ const b=el.querySelector('.caption b'), s=el.querySelector('.caption span'), m=tr.m;
      b.textContent='Soleil à '+fr(h,1)+'° : le rayon traverse '+fr(m,m<10?2:1)+' fois plus d’air que le rayon vertical';
      s.textContent='C’est le rapport des deux aires colorées : l’aire sous la courbe orange (le long du rayon) divisée par l’aire sous la courbe bleue (à la verticale). Dans le dessin du haut, le rayon oblique reste longtemps dans l’air dense, juste au-dessus du sol.'; }
    upd();
    // dessin à l'échelle : repère local, x horizontal, observateur en O
    const K=.34, O=[22,86];
    const ground=d=>O[1]+K*(A.R-Math.sqrt(A.R*A.R-d*d));
    const kmToPx=(d,z)=>{ // point à la distance horizontale d (km, le long du sol) et à l'altitude z, repère du sol courbe : on tourne autour du centre de la Terre
      const r=A.R+z, ang=d/A.R; return [O[0]+K*r*Math.sin(ang), O[1]+K*(A.R-r*Math.cos(ang))]; };
    L.onFrame(dt=>{
      if(!L.reduce) t+=dt;
      const x=V.ctx; V.base(); L.bgLab(x,W,H);
      /* ---- dessin à l'échelle ---- */
      L.txt(x,'à l’échelle : l’atmosphère est une pellicule (120 km sur 6 371 km de rayon terrestre)',10,12,'left',C.ink,true);
      x.save(); x.beginPath(); x.rect(0,22,W,130); x.clip();
      for(let z=0;z<=118;z+=1.5){ const rho=D.rhoRel(z); x.beginPath(); for(let d=-10;d<=1060;d+=14){ const p=kmToPx(d,z); d===-10?x.moveTo(p[0],p[1]):x.lineTo(p[0],p[1]); } x.strokeStyle='rgba(90,169,255,'+(0.10+0.7*rho)+')'; x.lineWidth=K*1.6+.2; x.stroke(); }
      // sol
      x.beginPath(); x.moveTo(0,H); for(let d=-24/K;d<=1070;d+=14){ const X=O[0]+K*d; x.lineTo(X,ground(d)+0); } x.lineTo(W,H); x.closePath(); x.fillStyle='#0B1218'; x.fill();
      x.beginPath(); for(let d=-24/K;d<=1070;d+=14){ const X=O[0]+K*d,Y=ground(d); d===-24/K?x.moveTo(X,Y):x.lineTo(X,Y); } x.strokeStyle='rgba(232,238,244,.5)'; x.lineWidth=1; x.stroke();
      // rayon vertical
      const top=kmToPx(0,A.ztop); L.line(x,O[0],O[1],top[0],top[1],'#5AA9FF',2); L.txt(x,'vertical',O[0]+6,O[1]-24,'left','#5AA9FF');
      // rayon incliné : la droite part de O avec l'angle h ; on trace point par point jusqu'à la sortie
      const sh=Math.sin(Math.max(h,0)*Math.PI/180), ch=Math.cos(Math.max(h,0)*Math.PI/180);
      x.beginPath(); let last=null; for(let s=0;s<=tr.L+1;s+=Math.max(.5,tr.L/200)){ const X=O[0]+K*s*ch, Y=O[1]-K*s*sh; s?x.lineTo(X,Y):x.moveTo(X,Y); last=[X,Y]; } x.strokeStyle='#FF9F43'; x.lineWidth=2; x.stroke();
      if(last){ L.arrow(x,last[0],last[1],last[0]+ch*16,last[1]-sh*16,'#FF9F43',2); L.txt(x,'vers le Soleil',Math.min(W-70,last[0]+ch*16+4),last[1]-sh*16-6,'left','#FF9F43'); }
      x.restore();
      L.tag(x,'toi',O[0]-2,O[1]+14,'left',C.ink); x.beginPath(); x.arc(O[0],O[1],3,0,7); x.fillStyle='#fff'; x.fill();
      L.txt(x,'longueur du rayon dans l’atmosphère : '+fmt(tr.L)+' km (vertical : 120 km)',10,150,'left',C.muted);
      /* ---- courbes ---- */
      const PY0=200, PY1=326, pcol=[ '#5AA9FF','#FF9F43' ], GRID='rgba(232,238,244,.35)', WH='rgba(232,238,244,.85)';
      // A : à la verticale. Altitude en ordonnée (comme dans le dessin), densité en abscisse.
      { const X0=42,X1=212, zmax=40, px=r=>X0+r*(X1-X0), py=z=>PY1-z/zmax*(PY1-PY0-6);
        L.txt(x,'À LA VERTICALE',10,PY0-30,'left',pcol[0],true); L.txt(x,'altitude selon la densité de l’air',10,PY0-16,'left',C.ink);
        L.line(x,X0,PY1,X1,PY1,GRID,1); L.line(x,X0,PY0-2,X0,PY1,GRID,1);
        x.beginPath(); x.moveTo(px(0),py(0)); for(let z=0;z<=zmax;z+=.4) x.lineTo(px(D.rhoRel(z)),py(z)); x.lineTo(px(0),py(zmax)); x.closePath(); x.fillStyle='rgba(90,169,255,.28)'; x.fill();
        x.beginPath(); for(let z=0;z<=zmax;z+=.4){ const X=px(D.rhoRel(z)),Y=py(z); z?x.lineTo(X,Y):x.moveTo(X,Y); } x.strokeStyle='#5AA9FF'; x.lineWidth=2; x.stroke();
        x.setLineDash([4,3]); x.strokeStyle='rgba(232,238,244,.7)'; x.lineWidth=1.2; x.strokeRect(px(0),py(A.H),px(1)-px(0),py(0)-py(A.H)); x.setLineDash([]);
        L.txt(x,'même aire : couche de',X1,py(30),'right',WH); L.txt(x,'densité constante, '+fr(A.H,1)+' km',X1,py(30)+13,'right',WH);
        x.beginPath(); x.arc(px(Math.exp(-1)),py(A.H),3.5,0,7); x.fillStyle='#fff'; x.fill(); L.tag(x,'à H : 37 %',px(Math.exp(-1))+8,py(A.H)-12,'left','#8FB8FF');
        [0,.25,.5,.75,1].forEach(v=>{ L.line(x,px(v),PY1,px(v),PY1+4,C.muted,1); L.txt(x,fr(v,2).replace(',00','').replace(',50',',5'),px(v),PY1+13,'center'); }); L.txt(x,'densité ρ/ρ₀',X1,PY1+26,'right',C.muted);
        [0,10,20,30,40].forEach(z=>{ L.line(x,X0-4,py(z),X0,py(z),C.muted,1); L.txt(x,String(z),X0-7,py(z),'right'); }); L.txt(x,'altitude (km)',X0+30,PY0+2,'left',C.muted);
      }
      // B : le long du rayon. Échelle fixe (0 à 800 km), la même quelle que soit la hauteur du Soleil.
      { const X0=262,X1=440, smax=800, px=s=>X0+s/smax*(X1-X0), py=r=>PY1-r*(PY1-PY0-6);
        L.txt(x,'LE LONG DU RAYON',250,PY0-30,'left',pcol[1],true); L.txt(x,'densité de l’air selon la distance',250,PY0-16,'left',C.ink);
        L.line(x,X0,PY1,X1,PY1,GRID,1); L.line(x,X0,PY0-2,X0,PY1,GRID,1);
        x.save(); x.beginPath(); x.rect(X0,PY0-6,X1-X0+2,PY1-PY0+8); x.clip();
        x.beginPath(); x.moveTo(px(0),py(0)); tr.s.forEach((s,i)=>x.lineTo(px(s),py(tr.r[i]))); x.lineTo(px(tr.L),py(0)); x.closePath(); x.fillStyle='rgba(255,159,67,.28)'; x.fill();
        x.beginPath(); tr.s.forEach((s,i)=>{ const X=px(s),Y=py(tr.r[i]); i?x.lineTo(X,Y):x.moveTo(X,Y); }); x.strokeStyle='#FF9F43'; x.lineWidth=2; x.stroke();
        // pour comparaison : la même colonne verticale, tracée sur le même axe (distance = altitude)
        x.beginPath(); x.moveTo(px(0),py(0)); for(let z=0;z<=120;z+=.5) x.lineTo(px(z),py(D.rhoRel(z))); x.lineTo(px(120),py(0)); x.closePath(); x.fillStyle='rgba(90,169,255,.55)'; x.fill();
        x.beginPath(); for(let z=0;z<=120;z+=.5){ const X=px(z),Y=py(D.rhoRel(z)); z?x.lineTo(X,Y):x.moveTo(X,Y); } x.strokeStyle='#5AA9FF'; x.lineWidth=1.6; x.stroke();
        x.restore();
        L.txt(x,'bleu : la colonne verticale,',px(150),py(.62),'left','#8FB8FF'); L.txt(x,'sur le même axe',px(150),py(.62)+13,'left','#8FB8FF');
        [0,200,400,600,800].forEach(v=>{ L.line(x,px(v),PY1,px(v),PY1+4,C.muted,1); L.txt(x,String(v),px(v),PY1+13,'center'); }); L.txt(x,'distance sur le rayon (km), échelle fixe',X1,PY1+26,'right',C.muted);
        L.txt(x,'1',X0-5,py(1)+2,'right',C.muted); L.txt(x,'ρ/ρ₀ (1 = densité au sol)',X0+30,PY0+2,'left',C.muted);
        L.txt(x,tr.L>smax?'(le rayon continue au-delà de 800 km)':'',X1,PY0+30,'right',C.muted);
      }
      /* ---- chiffres ---- */
      const Av=A.rho0*A.H*1000, ky=PY1+48;
      L.txt(x,'Gaz parfait en équilibre dans la pesanteur :',10,ky,'left',C.muted); L.txt(x,'ρ(z) = ρ₀ · exp(−z/H),   H = k·T / (m·g) = '+fr(A.H,2)+' km',10,ky+16,'left',C.ink,true);
      L.txt(x,'Air au-dessus de toi, à la verticale :  ρ₀·H = '+fr(A.rho0,3)+' kg/m³ × '+fmt(A.H*1000)+' m = '+fmt(Av)+' kg/m²',10,ky+38,'left',pcol[0]);
      L.txt(x,'Air le long du rayon à '+fr(h,1)+'° :  '+fmt(Av*tr.m)+' kg/m²',10,ky+54,'left',pcol[1]);
      L.txt(x,'masse d’air  m = aire oblique ÷ aire verticale = '+fr(tr.m,tr.m<10?2:1),10,ky+76,'left',C.ink,true);
      const kyv=D.airmass(Math.min(90,90-h)); L.txt(x,'(avec la réfraction, tables de Kasten et Young : '+fr(kyv,tr.m<10?2:1)+'  ·  plan parallèle 1/sin h : '+(h<1?'∞':fr(1/Math.sin(h*Math.PI/180),1))+')',10,ky+92,'left',C.muted);
      L.vignette(x,W,H); },V.cv);
  }
});
