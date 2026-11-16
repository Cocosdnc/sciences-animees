/* Bloc « diffusion-lambda » : la diffusion de Rayleigh d'une molécule quelconque.
   Section efficace d'une molécule isotrope de polarisabilité α' : σ = 128π⁵α'²/(3λ⁴).
   Les polarisabilités (en Å³) viennent de tables de référence (CRC Handbook of Chemistry and Physics, valeurs statiques arrondies). */
Labo.defineBloc('diffusion-lambda',{
  titre:'Et pour une autre molécule ?',
  mount(el){
    const L=Labo, C=L.C, D=window.Diff;
    const MOL=[['H₂ (dihydrogène)',.79,.29],['He (hélium)',.205,.26],['Ne (néon)',.395,.275],['N₂ (diazote)',1.74,.364],['O₂ (dioxygène)',1.58,.346],['Ar (argon)',1.64,.34],['H₂O (vapeur d’eau)',1.45,.265],['CO (monoxyde de carbone)',1.95,.38],['NH₃ (ammoniac)',2.26,.26],['CO₂ (dioxyde de carbone)',2.91,.33],['CH₄ (méthane)',2.59,.38],['Kr (krypton)',2.48,.36],['Xe (xénon)',4.04,.396],['C₂H₆ (éthane)',4.47,.44],['SF₆ (hexafluorure de soufre)',6.54,.55],['C₆H₆ (benzène)',10.3,.585]];
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas style="aspect-ratio:400/320" aria-label="Intensité diffusée en fonction de la longueur d’onde pour une molécule choisie, et couleur de la lumière diffusée"></canvas></div>'+
      '<div class="lc"><label class="slider"><span>Molécule</span><select></select></label>'+
      '<label class="slider"><span>Ou ta propre polarisabilité</span><input type="range" min="1" max="200" step="1" value="17"><strong></strong></label></div>'+
      '<div class="caption" aria-live="polite"><b></b><span></span></div>'+
      '<div class="infobar"></div><div class="infobox" hidden></div></div>';
    const INFO={
      alpha:['La polarisabilité : ce qui compte','C’est la facilité avec laquelle le champ électrique de la lumière décale le nuage d’électrons, donc crée un dipôle. Elle s’exprime en volume (Å³ : 1 Å³ = 10⁻³⁰ m³). Plus elle est grande, plus le dipôle induit est grand. Les gros nuages mous (benzène, SF₆) ont une grande polarisabilité, les petits nuages serrés (He, H₂) une petite.'],
      carre:['Pourquoi elle compte au carré','La puissance rayonnée est proportionnelle au carré du dipôle, et le dipôle est proportionnel à α. Doubler α multiplie donc la diffusion par 4. Une molécule de benzène (α = 10,3 Å³) diffuse environ 35 fois plus qu’une molécule de diazote (1,74 Å³). La dépendance en 1/λ⁴, elle, ne change pas : toutes les molécules de la liste diffusent plus le bleu que le rouge, exactement dans le même rapport.'],
      h2:['Et H₂ ? Plus gros, donc plus de diffusion ?','Au contraire : H₂ est parmi les plus petites molécules de la liste (0,29 nm), et sa polarisabilité (0,79 Å³) est plus de deux fois plus petite que celle de N₂. Il diffuse environ 5 fois moins que N₂. Une diffusion forte ne vient donc pas de « grosses molécules » mais de molécules très polarisables. Et elle reste de type Rayleigh (en 1/λ⁴), car toutes ces molécules sont minuscules devant la longueur d’onde. Pour que la diffusion change de nature, il faut des particules d’environ 1/10 de longueur d’onde, soit une cinquantaine de nanomètres : des milliers de fois plus gros qu’une molécule. Ce sont les gouttes et les poussières, étudiées dans la dernière partie.'],
      limite:['Jusqu’où la loi Rayleigh vaut-elle ?','Tant que la particule est petite devant la longueur d’onde : en pratique, jusqu’à un rayon d’environ λ/10, soit 40 à 70 nm pour la lumière visible. Au-delà, la particule n’est plus « vue » comme un point par l’onde : le champ n’est plus uniforme sur elle, et il faut le calcul complet de Mie.'],
      simplif:['Ce qui est simplifié','La formule σ = 128π⁵α′²/(3λ⁴) suppose une molécule sphérique (isotrope) et une polarisabilité indépendante de la couleur. Pour l’air, le calcul réel (page précédente) donne σ(550 nm) = 4,5·10⁻³¹ m², contre 4,3 ici avec α = 1,74 Å³ : l’écart (5 %) vient de l’anisotropie de la molécule et de la variation de α avec la couleur. Les polarisabilités sont des valeurs de tables, arrondies. Les tailles des molécules sont des diamètres cinétiques approchés.']
    };
    L.infoBar(el.querySelector('.infobar'),el.querySelector('.infobox'),['alpha','carre','h2','limite','simplif'],INFO);
    const sel=el.querySelector('select'); MOL.forEach((m,i)=>{ const o=document.createElement('option'); o.value=i; o.textContent=m[0]+' · α = '+String(m[1]).replace('.',',')+' Å³'; sel.appendChild(o); });
    const o2=document.createElement('option'); o2.value='c'; o2.textContent='Autre : régler la polarisabilité'; sel.appendChild(o2); sel.value=3;
    const inp=el.querySelector('input'), out=el.querySelector('.slider strong'); inp.disabled=true;
    const W=400,H=320,V=L.setup(el.querySelector('canvas'),W,H);
    let a=1.74, nm='N₂ (diazote)', size=.364;
    const upd=()=>{ if(sel.value==='c'){ inp.disabled=false; a=inp.value/10; nm='Molécule personnalisée'; size=0; } else { inp.disabled=true; const m=MOL[+sel.value]; a=m[1]; nm=m[0]; size=m[2]; inp.value=Math.round(a*10); }
      out.textContent=String(a.toFixed(2)).replace('.',',')+' Å³'; cap(); };
    sel.onchange=upd; inp.addEventListener('input',()=>{ if(sel.value==='c') upd(); });
    const fmt=v=>(v*1e31).toFixed(2).replace('.',',');
    function cap(){ const b=el.querySelector('.caption b'),s=el.querySelector('.caption span'), r=a/1.74;
      b.textContent=nm+' : '+(r<.95?r.toFixed(2).replace('.',',')+' fois ':r>1.05?r.toFixed(r<10?1:0).replace('.',',')+' fois ':'autant que ')+(r<.95?'moins que N₂':r>1.05?'plus que N₂':'N₂');
      s.textContent='Même courbe en 1/λ⁴ pour toutes les molécules : seule la hauteur change, comme α². La couleur de la lumière diffusée reste donc la même : bleu clair.'; }
    upd();
    L.onFrame(()=>{
      const x=V.ctx; V.base(); L.bgLab(x,W,H);
      const S=l=>D.sigmaPol(a,l), s550=S(550), ref=D.sigmaPol(1.74,450);
      const X0=44,X1=388,Y0=26,Y1=178, px=l=>X0+(l-380)/370*(X1-X0), ymax=Math.max(ref*1.05,S(380)*1.02), py=v=>Y1-v/ymax*(Y1-Y0);
      L.line(x,X0,Y1,X1,Y1,'rgba(232,238,244,.35)',1); L.line(x,X0,Y0,X0,Y1,'rgba(232,238,244,.35)',1);
      for(let l=380;l<750;l+=2){ x.fillStyle=L.rgba(D.rgbStr(D.pure(l)),.5); x.fillRect(px(l),py(S(l)),(X1-X0)/370*2+.5,Y1-py(S(l))); }
      x.beginPath(); for(let l=380;l<=750;l+=5){ const X=px(l),Y=py(S(l)); l===380?x.moveTo(X,Y):x.lineTo(X,Y); } x.strokeStyle='#E8EEF4'; x.lineWidth=2; x.stroke();
      // référence N₂
      x.beginPath(); for(let l=380;l<=750;l+=5){ const X=px(l),Y=py(D.sigmaPol(1.74,l)); l===380?x.moveTo(X,Y):x.lineTo(X,Y); } x.setLineDash([4,4]); x.strokeStyle='rgba(232,238,244,.45)'; x.lineWidth=1.2; x.stroke(); x.setLineDash([]);
      L.txt(x,'diazote N₂ (référence)',X1-4,py(D.sigmaPol(1.74,720))-8,'right','rgba(232,238,244,.7)');
      [400,500,600,700].forEach(l=>{ L.line(x,px(l),Y1,px(l),Y1+4,C.muted,1); L.txt(x,l+' nm',px(l),Y1+13,'center'); });
      L.txt(x,'intensité diffusée par molécule',X0+4,Y0-10,'left',C.ink,true);
      L.tag(x,'bleu 450 nm : '+(S(450)/S(650)).toFixed(1).replace('.',',')+' × le rouge 650 nm',X1,Y0+8,'right','#8FB8FF');
      // couleur de la lumière diffusée (lumière incidente blanche idéale)
      const c1=D.color(l=>S(l)), c2=D.color(l=>S(l)*D.sun(l));
      L.rr(x,X0,228,150,56,8,D.rgbStr(c1),'rgba(232,238,244,.2)',1); L.txt(x,'Soleil idéalisé blanc',X0,297,'left',C.muted);
      L.rr(x,X0+170,228,150,56,8,D.rgbStr(c2),'rgba(232,238,244,.2)',1); L.txt(x,'Soleil réel',X0+170,297,'left',C.muted);
      L.txt(x,'σ à 550 nm : '+fmt(s550)+' ×10⁻³¹ m²',X1,Y1+30,'right',C.ink); L.txt(x,'couleur de la lumière diffusée :',X0,218,'left',C.muted);
      if(size){ L.txt(x,'taille : '+String(size).replace('.',',')+' nm, soit '+(size/550).toFixed(4).replace('.',',')+' × λ (550 nm)',X0,312,'left',C.muted); }
      L.vignette(x,W,H); },V.cv);
  }
});
