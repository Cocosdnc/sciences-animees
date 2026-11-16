/* Bloc « molecule-secouee » : une molécule d'azote N₂ dans une onde lumineuse.
   Niveau 1 : la molécule dessinée avec sa vraie géométrie ; son nuage d'électrons est poussé par le champ électrique, le dipôle induit rayonne.
   Niveau 2 : modèle de l'oscillateur (Lorentz) avec résonance dans l'ultraviolet : puissance rayonnée ∝ ω⁴.
   Niveau 3 : mesures réelles pour l'air (Bodhaine 1999). */
Labo.defineBloc('molecule-secouee',{
  titre:'Une molécule d’air secouée par la lumière',
  mount(el){
    const L=Labo, C=L.C, D=window.Diff;
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas style="aspect-ratio:400/320" aria-label="Une molécule d’azote dans une onde lumineuse : son nuage d’électrons oscille et réémet de la lumière dans toutes les directions sauf l’axe du champ"></canvas></div>'+
      '<div class="lc"><div class="seg" role="group" aria-label="Niveau de réalisme"><button type="button" data-n="1" aria-pressed="true">1. Induit</button><button type="button" data-n="2" aria-pressed="false">2. Secouée</button><button type="button" data-n="3" aria-pressed="false">3. Oscillateur</button><button type="button" data-n="4" aria-pressed="false">4. Mesures</button></div>'+
      '<label class="slider" data-w><span>Longueur d’onde</span><input type="range" min="380" max="750" step="1" value="450" data-k="lam"><strong></strong></label>'+
      '<label class="slider" data-e><span>Champ électrique (statique)</span><input type="range" min="-100" max="100" step="1" value="60" data-k="E"><strong></strong></label>'+
      '<label class="slider" data-e><span>Orientation de la molécule</span><input type="range" min="0" max="90" step="1" value="35" data-k="a"><strong></strong></label></div>'+
      '<div class="caption" aria-live="polite"><b></b><span></span></div>'+
      '<div class="infobar"></div><div class="infobox" hidden></div></div>';
    const INFO={
      induit:['Comment un dipôle se crée','Une molécule de diazote est neutre : sa charge positive (les noyaux) et sa charge négative (le nuage d’électrons) sont centrées au même endroit. Dans un champ électrique, le nuage, léger, est poussé dans un sens, et les noyaux, 1 800 fois plus lourds, à peine dans l’autre. Les centres des deux charges se décalent : on a un dipôle, de moment p, qui n’existait pas avant. Plus le champ est fort, plus le décalage est grand : p = α·E. Le coefficient α est la polarisabilité. Quand le champ s’inverse, le décalage s’inverse aussi : c’est cette oscillation qui, avec la lumière, rayonne.'],
      tordue:['La molécule est-elle « tordue » ?','Pas vraiment : la liaison entre les deux atomes ne change presque pas de longueur et les noyaux bougent à peine. Ce qui se déforme, c’est le nuage d’électrons, qui est tiré d’un côté. Cette déformation, ce léger « étirement » du nuage, est ce qui crée le dipôle. Elle est réelle et mesurable : c’est elle qui explique pourquoi les molécules ont une polarisabilité.'],
      quoi:['De quoi est faite une molécule d’air','L’air est à 78 % du diazote N₂ et à 21 % du dioxygène O₂. Chaque molécule est formée de deux atomes séparés d’environ 0,11 nm, entourés d’un nuage d’électrons. Elle est neutre, mais ses charges peuvent se décaler : le nuage, léger, bouge bien plus facilement que les noyaux, plus lourds de plus de 1 800 fois.'],
      secoue:['Pourquoi la lumière la secoue','Une onde lumineuse est un champ électrique qui change de sens des centaines de billions de fois par seconde. Ce champ pousse le nuage d’électrons (charge −) dans un sens et les noyaux (charge +) dans l’autre : la molécule devient un petit dipôle qui oscille à la même fréquence que la lumière. On dit que le dipôle est induit, car il n’existait pas avant la lumière.'],
      reemet:['Pourquoi elle réémet de la lumière','Une charge qui oscille rayonne : c’est le principe de toute antenne. La molécule émet une onde de même fréquence que celle qui l’a secouée, dans toutes les directions, sauf dans l’axe de vibration (dans cet axe, un dipôle n’émet rien). La lumière n’est pas absorbée : elle est déviée. C’est ça, la diffusion de Rayleigh. La lumière diffusée est polarisée : à 90° de la direction du Soleil, elle l’est presque totalement.'],
      omega4:['Pourquoi ω⁴, donc 1/λ⁴','Deux effets s’ajoutent. Plus la fréquence est élevée, plus le dipôle accélère fort et chaque oscillation rayonne : la puissance émise par une charge qui oscille croît comme ω⁴ (si l’amplitude du dipôle est fixée). En plus, la réponse de la molécule dépend peu de la fréquence dans le visible, car sa résonance est loin, dans l’ultraviolet. Résultat : la puissance diffusée varie comme ω⁴, soit 1/λ⁴. Le bleu (450 nm) est diffusé environ 4,4 fois plus que le rouge (650 nm).'],
      uv:['La résonance dans l’ultraviolet','Un nuage d’électrons a une fréquence propre, comme une balançoire. Pour N₂ et O₂, elle est vers 100 nm, dans l’ultraviolet. Dans le visible, on est loin de cette résonance : le dipôle induit est presque indépendant de la couleur, il croît seulement un peu vers le bleu. C’est pourquoi la loi en 1/λ⁴ est si bien respectée, avec un exposant mesuré de 4,08 au lieu de 4.'],
      orient:['Orientation : pourquoi le dipôle n’est pas toujours dans l’axe du champ','Les molécules N₂ et O₂ ne sont pas des sphères : elles sont plus faciles à polariser le long de la liaison que de travers. C’est visible au niveau 1 : quand la molécule est penchée, le dipôle induit (flèche orange) n’est pas parallèle au champ, il est tiré vers l’axe de la molécule. Le dipôle induit n’est donc pas toujours exactement dans l’axe du champ, et la lumière diffusée est un peu moins polarisée que pour une sphère parfaite. Cet effet, mesuré, est résumé par le facteur de King (1,048 pour l’air), qui augmente de 4,8 % la diffusion. Il y a aussi une petite fraction de diffusion Raman : la molécule échange de l’énergie de rotation avec la lumière, qui change légèrement de couleur. Cela ne modifie pas le tableau d’ensemble. Dans le modèle simple, la molécule est supposée sphérique.'],
      mesure:['Les valeurs mesurées','À 550 nm, une molécule d’air diffuse une surface équivalente de 4,5·10⁻³¹ m² (Bodhaine et al., 1999) : c’est environ 10¹¹ fois moins que la surface de la molécule vue de face (≈ 10⁻¹⁹ m²). Une molécule d’air est donc un très mauvais obstacle, et la lumière traverse l’air presque sans être arrêtée. La diffusion vient de l’indice de réfraction n de l’air (1,000278 à 550 nm) : plus l’air est dense, plus il diffuse. Le calcul tient compte de la variation de n avec la couleur, ce qui donne 1/λ⁴·⁰⁸.'],
      simplif:['Ce qui est simplifié','Échelle : sur le dessin, la molécule mesure 40 pixels et la longueur d’onde 150 : en vrai la molécule est 5 000 fois plus petite que 550 nm. Le déplacement du nuage est exagéré environ 10⁷ à 10⁸ fois (en vrai, dans la lumière du Soleil, il est de l’ordre de 10⁻¹⁸ m, des milliers de fois plus petit qu’un noyau). Les rythmes sont ralentis environ 10¹³ fois. Niveau 1 : la molécule est supposée sphérique pour le calcul du rayonnement (voir « Orientation »). Niveau 2 : un seul oscillateur de résonance 100 nm, alors que l’air en a plusieurs.']
    };
    const KEYS=()=>({1:['induit','tordue','orient','simplif'],2:['secoue','reemet','orient','simplif'],3:['secoue','reemet','omega4','uv','simplif'],4:['mesure','omega4','orient','simplif']})[lvl];
    const W=400,H=320,V=L.setup(el.querySelector('canvas'),W,H), inp=el.querySelector('[data-k="lam"]'), out=el.querySelector('[data-w] strong'), inE=el.querySelector('[data-k="E"]'), inA=el.querySelector('[data-k="a"]');
    let lvl=1,Ef=.6,ang=35,lam=450,t=0,rings=[]; const infobar=el.querySelector('.infobar'), box=el.querySelector('.infobox');
    const setInfo=()=>L.infoBar(infobar,box,KEYS(),INFO);
    const capt=()=>{ const b=el.querySelector('.caption b'),s=el.querySelector('.caption span');
      if(lvl===1){ b.textContent='Un champ électrique déforme le nuage d’électrons'; s.textContent='Les noyaux (+) restent presque en place, le nuage (−) se décale dans le sens opposé au champ : les deux centres de charge ne coïncident plus, c’est un dipôle induit. Règle le champ et l’orientation de la molécule.'; }
      else if(lvl===2){ b.textContent='La molécule N₂ secouée'; s.textContent='Le champ électrique de la lumière pousse le nuage d’électrons d’un côté et les noyaux de l’autre. La molécule devient un dipôle qui oscille et rayonne, surtout perpendiculairement au champ. Change la couleur : la fréquence change.'; }
      else if(lvl===3){ b.textContent='Le modèle de l’oscillateur : pourquoi plus de bleu'; s.textContent='L’amplitude du dipôle (courbe bleue) reste presque la même dans tout le visible, car la résonance est loin dans l’ultraviolet. La puissance rayonnée (courbe orange) croît comme ω⁴.'; }
      else { b.textContent='Mesures réelles pour l’air'; s.textContent='Section efficace de diffusion par molécule d’air (Bodhaine 1999), calculée avec l’indice de réfraction réel de l’air. Écart avec une loi 1/λ⁴ parfaite : une pente de 4,08.'; } };
    el.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{ lvl=+b.dataset.n; el.querySelectorAll('[data-n]').forEach(c=>c.setAttribute('aria-pressed',c===b)); setInfo(); capt(); showCtl(); });
    inp.addEventListener('input',()=>{ lam=+inp.value; rings=[]; }); inE.addEventListener('input',()=>{ Ef=inE.value/100; }); inA.addEventListener('input',()=>{ ang=+inA.value; });
    const showCtl=()=>{ el.querySelector('[data-w]').style.display=lvl===1?'none':''; el.querySelectorAll('[data-e]').forEach(n=>n.style.display=lvl===1?'':'none'); };
    setInfo(); capt(); showCtl();
    const colA=()=>D.rgbStr(D.pure(lam));
    function plot(x,X0,Y0,X1,Y1,ys,cols,labs,note){ // cadre + courbes (ys: fonctions de λ), marqueur de λ
      L.rr(x,X0,Y0,X1-X0,Y1-Y0,8,'rgba(255,255,255,.035)','rgba(232,238,244,.14)',1);
      const px=l=>X0+10+(l-380)/370*(X1-X0-20);
      ys.forEach((f,j)=>{ let mx=0; for(let l=380;l<=750;l+=5) mx=Math.max(mx,f(l)); x.beginPath(); for(let l=380;l<=750;l+=5){ const Y=Y1-12-(f(l)/mx)*(Y1-Y0-34); l===380?x.moveTo(px(l),Y):x.lineTo(px(l),Y); } x.strokeStyle=cols[j]; x.lineWidth=2; x.stroke();
        const Yc=Y1-12-(f(lam)/mx)*(Y1-Y0-34); x.beginPath(); x.arc(px(lam),Yc,4,0,7); x.fillStyle=cols[j]; x.fill(); });
      L.line(x,px(lam),Y0+8,px(lam),Y1-8,'rgba(232,238,244,.25)',1,[3,3]);
      labs.forEach((s,j)=>L.txt(x,s,X0+8,Y0+12+j*13,'left',cols[j])); if(note) L.txt(x,note,X1-6,Y1-5,'right',C.muted); }
    // Niveau 1 : champ statique vertical (dirigé vers le haut si Ef>0), molécule inclinée de ang° par rapport au champ
    const AP=2.38, AT=1.45;   // polarisabilités de N₂ le long de la liaison et en travers, en Å³ (valeurs de la littérature, moyenne ≈ 1,76)
    function drawStatic(x){
      const cx=235, cy=150, th=ang*Math.PI/180, ux=Math.sin(th), uy=-Math.cos(th);   // axe de la molécule (angle ang avec la verticale, donc avec E)
      const E=Ef, Epar=E*Math.cos(th), Eperp=E*Math.sin(th);
      // dipôle : composante le long de l'axe α∥·E∥, perpendiculaire α⊥·E⊥ (vecteurs dans le plan du dessin, y vers le bas)
      const vx=-Math.cos(th), vy=-Math.sin(th);   // perpendiculaire à l'axe
      let px=AP*Epar*ux+AT*Eperp*0, py=AP*Epar*uy;
      // E_perp est la projection de E sur vx,vy : E = (0,-E) ; E·v = E*sin(th)
      px=AP*Epar*ux+AT*(E*Math.sin(th))*vx; py=AP*Epar*uy+AT*(E*Math.sin(th))*vy;   // p en unités de Å³·E
      const S=24, shx=-px*S/2.4, shy=-py*S/2.4;   // le nuage se décale à l'opposé de p
      // champ
      for(let k=0;k<5;k++){ const X=40+k*18; const dir=E>=0?-1:1; if(Math.abs(E)>.03) L.arrow(x,X,cy+dir*-50*Math.abs(E)-0,X,cy+dir*50*Math.abs(E),'#FFE08A',1.6); }
      L.tag(x,'champ électrique E',40,18,'left','#FFE08A'); L.txt(x,E>=0?'dirigé vers le haut':E<0?'dirigé vers le bas':'',40,34,'left','#FFE08A');
      // nuage (centre décalé), noyaux
      const dN=36, n1=[cx-ux*dN,cy-uy*dN], n2=[cx+ux*dN,cy+uy*dN];
      x.save(); x.translate(cx+shx,cy+shy); x.rotate(th); x.globalCompositeOperation='lighter';
      const g=x.createRadialGradient(0,0,0,0,0,78); g.addColorStop(0,'rgba(255,150,140,.55)'); g.addColorStop(1,'rgba(255,150,140,0)'); x.scale(1,.62); x.fillStyle=g; x.beginPath(); x.arc(0,0,78,0,7); x.fill(); x.restore();
      [n1,n2].forEach(n=>{ L.glow(x,n[0],n[1],9,'#FFFFFF',.35); L.sph(x,n[0],n[1],8,'#EEF3F8'); L.txt(x,'+',n[0],n[1],'center','#7A1010',true); });
      L.tag(x,'nuage (−), poussé à l’opposé',cx+shx-6,cy+shy+(shy>=0?-70:70),'center','#FF9C94');
      L.tag(x,'noyaux (+), presque immobiles',cx,cy+(uy<0?58:-58)*1+0,'center',C.muted);
      // forces
      const F=16*Math.abs(E); if(Math.abs(E)>.03){ const d=E>=0?-1:1; L.arrow(x,n2[0],n2[1],n2[0],n2[1]+d*F,'#FFE08A',1.8); L.arrow(x,n1[0],n1[1],n1[0],n1[1]+d*F,'#FFE08A',1.8); L.arrow(x,cx+shx,cy+shy,cx+shx,cy+shy-d*F*1.3,'#FF9C94',2); }
      // moment dipolaire p (du centre − vers le centre +) : flèche orange partant du centre du nuage
      const pmag=Math.hypot(px,py); if(pmag>.05){ const L2=pmag*S/2.4*1.2+12, dx=px/pmag, dy=py/pmag; L.arrow(x,cx+shx,cy+shy,cx+shx+dx*L2,cy+shy+dy*L2,'#FF9F43',3); L.tag(x,'dipôle induit p',cx+shx+dx*L2+(dx>=0?8:-8),cy+shy+dy*L2,dx>=0?'left':'right','#FF9F43'); }
      // axe de la molécule (pointillés)
      L.line(x,cx-ux*70,cy-uy*70,cx+ux*70,cy+uy*70,'rgba(232,238,244,.25)',1,[4,4]);
      // lectures
      const pm=pmag*1e0, angle=pmag>.05?Math.abs(Math.atan2(px*0+(-1)*E>=0?0:0,1)):0;
      const pe=Math.hypot(px,py), cosφ=pmag>.05?Math.abs((py*(-Math.sign(E||1)))/pmag):1, phi=Math.acos(Math.min(1,cosφ))*180/Math.PI;
      L.txt(x,'champ : '+(Math.abs(E)*100).toFixed(0)+' % du champ maximal',8,H-62,'left',C.ink);
      L.txt(x,'α le long de la liaison : 2,38 Å³ · en travers : 1,45 Å³',8,H-46,'left',C.muted);
      L.txt(x,'p = α·E : le dipôle grandit avec le champ',8,H-30,'left','#FF9F43');
      L.txt(x,'angle entre p et E : '+phi.toFixed(0)+'°'+(ang>0&&ang<90&&Math.abs(E)>.03?'  (≠ 0 : p n’est pas parallèle à E)':''),8,H-14,'left','#FF9F43',true); }
    L.onFrame(dt=>{
      out.textContent=lam+' nm'; if(!L.reduce) t+=dt;
      const x=V.ctx; V.base(); L.bgLab(x,W,H);
      if(lvl===1){ drawStatic(x); L.vignette(x,W,H); return; }
      const cx=lvl===2?168:110, cy=lvl===2?168:128, f=550/lam, wl=150*lam/550, col=colA(), sp=2*Math.PI*f*.45;
      const phase=t*sp, E=Math.cos(phase);   // champ au niveau de la molécule
      // ondes incidentes : champ vertical qui avance vers la droite
      [-58,-28,28,58].forEach(yy=>{ x.beginPath(); for(let X=6;X<=cx-34;X+=2){ const a=Math.cos(2*Math.PI*(X-cx)/wl+phase)*16; X===6?x.moveTo(X,cy+yy-a):x.lineTo(X,cy+yy-a); }
        x.strokeStyle=L.rgba(col,.55); x.lineWidth=1.4; x.stroke(); });
      L.arrow(x,10,cy,44,cy,col,1.6); L.tag(x,'lumière incidente',8,cy-92,'left',col); L.tag(x,'champ électrique ↕',8,cy-76,'left',C.muted);
      // fronts d'onde réémis : intensité en cos² de l'angle avec la direction de propagation… ici maximale perpendiculairement à l'axe vertical du champ
      if(!L.reduce){ if(rings.length===0||rings[rings.length-1]>wl*.9) rings.push(0); for(let i=0;i<rings.length;i++) rings[i]+=dt*sp*wl/(2*Math.PI); rings=rings.filter(r=>r<290); }
      rings.forEach(r=>{ const fade=1-r/290; for(let a=0;a<72;a++){ const a0=a/72*2*Math.PI, a1=(a+1)/72*2*Math.PI, am=(a0+a1)/2, s2=Math.pow(Math.cos(am),2); // am=0 : vers la droite, perpendiculaire au champ : maximum ; am=±90° : dans l'axe du champ : zéro
          x.beginPath(); x.arc(cx,cy,r+20,a0,a1); x.strokeStyle=L.rgba(col,.85*fade*s2); x.lineWidth=2; x.stroke(); } });
      // molécule N₂
      const dy=-E*7, d=22;
      L.glow(x,cx,cy,50,col,.12);
      // nuage : deux lobes + enveloppe commune, décalé du champ
      x.save(); x.globalCompositeOperation='lighter';
      [[-d,0],[d,0],[0,0]].forEach(([ox,oy],i)=>{ const g=x.createRadialGradient(cx+ox,cy+oy+dy,0,cx+ox,cy+oy+dy,i<2?28:34); g.addColorStop(0,'rgba(255,170,160,.55)'); g.addColorStop(1,'rgba(255,170,160,0)'); x.fillStyle=g; x.beginPath(); x.arc(cx+ox,cy+oy+dy,i<2?28:34,0,7); x.fill(); }); x.restore();
      [-d,d].forEach(ox=>{ L.glow(x,cx+ox,cy,9,'#FFFFFF',.35); L.sph(x,cx+ox,cy,6,'#EEF3F8'); });
      L.line(x,cx-d+6,cy-2,cx+d-6,cy-2,'rgba(232,238,244,.5)',1.4); L.line(x,cx-d+6,cy+2,cx+d-6,cy+2,'rgba(232,238,244,.5)',1.4); L.line(x,cx-d+6,cy,cx+d-6,cy,'rgba(232,238,244,.5)',1.4);
      L.tag(x,'deux noyaux N',cx,cy+56,'center',C.muted);
      if(Math.abs(dy)>1.5){ L.arrow(x,cx+58,cy-dy*1.3,cx+58,cy+dy*1.3,'#FFB547',2.2); }
      L.tag(x,'dipôle induit',cx+66,cy-4,'left','#FFB547');
      L.tag(x,'nuage d’électrons (−)',cx,cy-52+dy*.6,'center','#FF9C94');
      // échelle
      L.line(x,12,H-20,12+wl,H-20,col,2); L.line(x,12,H-25,12,H-15,col,1.5); L.line(x,12+wl,H-25,12+wl,H-15,col,1.5); L.txt(x,'longueur d’onde '+lam+' nm (dessinée)',12+wl+8,H-20,'left',col);
      L.txt(x,'molécule : 0,11 nm, 5 000 fois plus petite que ça',12,H-6,'left',C.muted);
      if(lvl===3){ const al=l=>1/(1-Math.pow(100/l,2)); plot(x,214,18,392,150,[l=>al(l),l=>Math.pow(1/l,4)*al(l)*al(l)],['#5AA9FF','#FF9F43'],['amplitude du dipôle','puissance rayonnée ∝ ω⁴'],'380 → 750 nm'); }
      if(lvl===4){ plot(x,214,18,392,150,[l=>D.sigmaAir(l)],['#FF9F43'],['σ mesurée de l’air'],'380 → 750 nm');
        const s=l=>D.sigmaAir(l); L.txt(x,'à 450 nm : '+(s(450)*1e31).toFixed(2).replace('.',',')+' ×10⁻³¹ m²',214,166,'left',C.ink); L.txt(x,'à 550 nm : '+(s(550)*1e31).toFixed(2).replace('.',',')+' ×10⁻³¹ m²',214,180,'left',C.ink); L.txt(x,'à 650 nm : '+(s(650)*1e31).toFixed(2).replace('.',',')+' ×10⁻³¹ m²',214,194,'left',C.ink);
        L.txt(x,'bleu / rouge = '+(s(450)/s(650)).toFixed(1).replace('.',','),214,212,'left','#FF9F43',true); L.txt(x,'à '+lam+' nm : '+(s(lam)*1e31).toFixed(2).replace('.',',')+' ×10⁻³¹ m²',214,228,'left',col); }
      L.vignette(x,W,H); },V.cv);
  }
});
