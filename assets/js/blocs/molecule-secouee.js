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
      '<div class="lc"><div class="seg" role="group" aria-label="Niveau de réalisme"><button type="button" data-n="1" aria-pressed="true">1. La molécule</button><button type="button" data-n="2" aria-pressed="false">2. L’oscillateur</button><button type="button" data-n="3" aria-pressed="false">3. Les mesures</button></div>'+
      '<label class="slider"><span>Longueur d’onde</span><input type="range" min="380" max="750" step="1" value="450"><strong></strong></label></div>'+
      '<div class="caption" aria-live="polite"><b></b><span></span></div>'+
      '<div class="infobar"></div><div class="infobox" hidden></div></div>';
    const INFO={
      quoi:['De quoi est faite une molécule d’air','L’air est à 78 % du diazote N₂ et à 21 % du dioxygène O₂. Chaque molécule est formée de deux atomes séparés d’environ 0,11 nm, entourés d’un nuage d’électrons. Elle est neutre, mais ses charges peuvent se décaler : le nuage, léger, bouge bien plus facilement que les noyaux, plus lourds de plus de 1 800 fois.'],
      secoue:['Pourquoi la lumière la secoue','Une onde lumineuse est un champ électrique qui change de sens des centaines de billions de fois par seconde. Ce champ pousse le nuage d’électrons (charge −) dans un sens et les noyaux (charge +) dans l’autre : la molécule devient un petit dipôle qui oscille à la même fréquence que la lumière. On dit que le dipôle est induit, car il n’existait pas avant la lumière.'],
      reemet:['Pourquoi elle réémet de la lumière','Une charge qui oscille rayonne : c’est le principe de toute antenne. La molécule émet une onde de même fréquence que celle qui l’a secouée, dans toutes les directions, sauf dans l’axe de vibration (dans cet axe, un dipôle n’émet rien). La lumière n’est pas absorbée : elle est déviée. C’est ça, la diffusion de Rayleigh. La lumière diffusée est polarisée : à 90° de la direction du Soleil, elle l’est presque totalement.'],
      omega4:['Pourquoi ω⁴, donc 1/λ⁴','Deux effets s’ajoutent. Plus la fréquence est élevée, plus le dipôle accélère fort et chaque oscillation rayonne : la puissance émise par une charge qui oscille croît comme ω⁴ (si l’amplitude du dipôle est fixée). En plus, la réponse de la molécule dépend peu de la fréquence dans le visible, car sa résonance est loin, dans l’ultraviolet. Résultat : la puissance diffusée varie comme ω⁴, soit 1/λ⁴. Le bleu (450 nm) est diffusé environ 4,4 fois plus que le rouge (650 nm).'],
      uv:['La résonance dans l’ultraviolet','Un nuage d’électrons a une fréquence propre, comme une balançoire. Pour N₂ et O₂, elle est vers 100 nm, dans l’ultraviolet. Dans le visible, on est loin de cette résonance : le dipôle induit est presque indépendant de la couleur, il croît seulement un peu vers le bleu. C’est pourquoi la loi en 1/λ⁴ est si bien respectée, avec un exposant mesuré de 4,08 au lieu de 4.'],
      orient:['Orientation et molécule « signée »','Les molécules N₂ et O₂ ne sont pas des sphères : elles sont plus faciles à polariser le long de la liaison que de travers. Le dipôle induit n’est donc pas toujours exactement dans l’axe du champ, et la lumière diffusée est un peu moins polarisée que pour une sphère parfaite. Cet effet, mesuré, est résumé par le facteur de King (1,048 pour l’air), qui augmente de 4,8 % la diffusion. Il y a aussi une petite fraction de diffusion Raman : la molécule échange de l’énergie de rotation avec la lumière, qui change légèrement de couleur. Cela ne modifie pas le tableau d’ensemble. Dans le modèle simple, la molécule est supposée sphérique.'],
      mesure:['Les valeurs mesurées','À 550 nm, une molécule d’air diffuse une surface équivalente de 4,5·10⁻³¹ m² (Bodhaine et al., 1999) : c’est environ 10¹¹ fois moins que la surface de la molécule vue de face (≈ 10⁻¹⁹ m²). Une molécule d’air est donc un très mauvais obstacle, et la lumière traverse l’air presque sans être arrêtée. La diffusion vient de l’indice de réfraction n de l’air (1,000278 à 550 nm) : plus l’air est dense, plus il diffuse. Le calcul tient compte de la variation de n avec la couleur, ce qui donne 1/λ⁴·⁰⁸.'],
      simplif:['Ce qui est simplifié','Échelle : sur le dessin, la molécule mesure 40 pixels et la longueur d’onde 150 : en vrai la molécule est 5 000 fois plus petite que 550 nm. Le déplacement du nuage est exagéré environ 10⁷ à 10⁸ fois (en vrai, dans la lumière du Soleil, il est de l’ordre de 10⁻¹⁸ m, des milliers de fois plus petit qu’un noyau). Les rythmes sont ralentis environ 10¹³ fois. Niveau 1 : la molécule est supposée sphérique pour le calcul du rayonnement (voir « Orientation »). Niveau 2 : un seul oscillateur de résonance 100 nm, alors que l’air en a plusieurs.']
    };
    const KEYS=()=>({1:['quoi','secoue','reemet','orient','simplif'],2:['secoue','reemet','omega4','uv','simplif'],3:['mesure','omega4','orient','simplif']})[lvl];
    const W=400,H=320,V=L.setup(el.querySelector('canvas'),W,H), inp=el.querySelector('input'), out=el.querySelector('.slider strong');
    let lvl=1,lam=450,t=0,rings=[]; const infobar=el.querySelector('.infobar'), box=el.querySelector('.infobox');
    const setInfo=()=>L.infoBar(infobar,box,KEYS(),INFO);
    const capt=()=>{ const b=el.querySelector('.caption b'),s=el.querySelector('.caption span');
      if(lvl===1){ b.textContent='La molécule N₂ secouée'; s.textContent='Le champ électrique de la lumière pousse le nuage d’électrons d’un côté et les noyaux de l’autre. La molécule devient un dipôle qui oscille et rayonne, surtout perpendiculairement au champ. Change la couleur : la fréquence change.'; }
      else if(lvl===2){ b.textContent='Le modèle de l’oscillateur : pourquoi plus de bleu'; s.textContent='L’amplitude du dipôle (courbe bleue) reste presque la même dans tout le visible, car la résonance est loin dans l’ultraviolet. La puissance rayonnée (courbe orange) croît comme ω⁴.'; }
      else { b.textContent='Mesures réelles pour l’air'; s.textContent='Section efficace de diffusion par molécule d’air (Bodhaine 1999), calculée avec l’indice de réfraction réel de l’air. Écart avec une loi 1/λ⁴ parfaite : une pente de 4,08.'; } };
    el.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{ lvl=+b.dataset.n; el.querySelectorAll('[data-n]').forEach(c=>c.setAttribute('aria-pressed',c===b)); setInfo(); capt(); });
    inp.addEventListener('input',()=>{ lam=+inp.value; rings=[]; });
    setInfo(); capt();
    const colA=()=>D.rgbStr(D.pure(lam));
    function plot(x,X0,Y0,X1,Y1,ys,cols,labs,note){ // cadre + courbes (ys: fonctions de λ), marqueur de λ
      L.rr(x,X0,Y0,X1-X0,Y1-Y0,8,'rgba(255,255,255,.035)','rgba(232,238,244,.14)',1);
      const px=l=>X0+10+(l-380)/370*(X1-X0-20);
      ys.forEach((f,j)=>{ let mx=0; for(let l=380;l<=750;l+=5) mx=Math.max(mx,f(l)); x.beginPath(); for(let l=380;l<=750;l+=5){ const Y=Y1-12-(f(l)/mx)*(Y1-Y0-34); l===380?x.moveTo(px(l),Y):x.lineTo(px(l),Y); } x.strokeStyle=cols[j]; x.lineWidth=2; x.stroke();
        const Yc=Y1-12-(f(lam)/mx)*(Y1-Y0-34); x.beginPath(); x.arc(px(lam),Yc,4,0,7); x.fillStyle=cols[j]; x.fill(); });
      L.line(x,px(lam),Y0+8,px(lam),Y1-8,'rgba(232,238,244,.25)',1,[3,3]);
      labs.forEach((s,j)=>L.txt(x,s,X0+8,Y0+12+j*13,'left',cols[j])); if(note) L.txt(x,note,X1-6,Y1-5,'right',C.muted); }
    L.onFrame(dt=>{
      out.textContent=lam+' nm'; if(!L.reduce) t+=dt;
      const x=V.ctx; V.base(); L.bgLab(x,W,H);
      const cx=lvl===1?168:110, cy=lvl===1?168:128, f=550/lam, wl=150*lam/550, col=colA(), sp=2*Math.PI*f*.45;
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
      if(lvl===2){ const al=l=>1/(1-Math.pow(100/l,2)); plot(x,214,18,392,150,[l=>al(l),l=>Math.pow(1/l,4)*al(l)*al(l)],['#5AA9FF','#FF9F43'],['amplitude du dipôle','puissance rayonnée ∝ ω⁴'],'380 → 750 nm'); }
      if(lvl===3){ plot(x,214,18,392,150,[l=>D.sigmaAir(l)],['#FF9F43'],['σ mesurée de l’air'],'380 → 750 nm');
        const s=l=>D.sigmaAir(l); L.txt(x,'à 450 nm : '+(s(450)*1e31).toFixed(2).replace('.',',')+' ×10⁻³¹ m²',214,166,'left',C.ink); L.txt(x,'à 550 nm : '+(s(550)*1e31).toFixed(2).replace('.',',')+' ×10⁻³¹ m²',214,180,'left',C.ink); L.txt(x,'à 650 nm : '+(s(650)*1e31).toFixed(2).replace('.',',')+' ×10⁻³¹ m²',214,194,'left',C.ink);
        L.txt(x,'bleu / rouge = '+(s(450)/s(650)).toFixed(1).replace('.',','),214,212,'left','#FF9F43',true); L.txt(x,'à '+lam+' nm : '+(s(lam)*1e31).toFixed(2).replace('.',',')+' ×10⁻³¹ m²',214,228,'left',col); }
      L.vignette(x,W,H); },V.cv);
  }
});
