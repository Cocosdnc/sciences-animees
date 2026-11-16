/* Bloc « diffusion-lambda » : ce que fait une molécule à une lumière, de l'entrée à la sortie.
   Entrée : spectre de la lumière envoyée (Soleil réel ASTM G173, ou Soleil idéalisé parfaitement blanc).
   Molécule : multiplie chaque longueur d'onde par sa section efficace de diffusion σ = 128π⁵α'²/(3λ⁴) (α' = polarisabilité, en Å³).
   Sortie : spectre diffusé ; la superposition de toutes ces longueurs d'onde donne la couleur de la lumière diffusée (calculée avec les trois courbes de l'œil).
   Les polarisabilités viennent de tables de référence (CRC Handbook of Chemistry and Physics, valeurs statiques arrondies). */
Labo.defineBloc('diffusion-lambda',{
  titre:'Et pour une autre molécule ?',
  mount(el){
    const L=Labo, C=L.C, D=window.Diff;
    const MOL=[['H₂ (dihydrogène)',.79,.29],['He (hélium)',.205,.26],['Ne (néon)',.395,.275],['N₂ (diazote)',1.74,.364],['O₂ (dioxygène)',1.58,.346],['Ar (argon)',1.64,.34],['H₂O (vapeur d’eau)',1.45,.265],['CO (monoxyde de carbone)',1.95,.38],['NH₃ (ammoniac)',2.26,.26],['CO₂ (dioxyde de carbone)',2.91,.33],['CH₄ (méthane)',2.59,.38],['Kr (krypton)',2.48,.36],['Xe (xénon)',4.04,.396],['C₂H₆ (éthane)',4.47,.44],['SF₆ (hexafluorure de soufre)',6.54,.55],['C₆H₆ (benzène)',10.3,.585]];
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas style="aspect-ratio:440/452" aria-label="Entrée : le spectre de la lumière envoyée ; la molécule multiplie chaque longueur d’onde par sa section efficace ; sortie : le spectre diffusé et la couleur que donne leur superposition"></canvas></div>'+
      '<div class="lc"><div class="seg" role="group" aria-label="Lumière en entrée"><button type="button" data-i="reel" aria-pressed="true">Soleil réel</button><button type="button" data-i="blanc" aria-pressed="false">Soleil idéalisé, parfaitement blanc</button></div>'+
      '<label class="slider"><span>Molécule</span><select></select></label>'+
      '<label class="slider"><span>Ou ta propre polarisabilité</span><input type="range" min="1" max="200" step="1" value="17"><strong></strong></label></div>'+
      '<div class="caption" aria-live="polite"><b></b><span></span></div>'+
      '<div class="infobar"></div><div class="infobox" hidden></div></div>';
    const INFO={
      entree:['Ce qui entre : le spectre de la lumière','Un spectre dit combien il y a de lumière à chaque longueur d’onde. Le Soleil réel est presque, mais pas tout à fait, plat dans le visible : il émet un peu moins de violet que de bleu-vert (courbe ASTM G173, hors atmosphère). Le « Soleil idéalisé » est un cas d’école : exactement autant d’énergie à chaque longueur d’onde, donc parfaitement blanc. Compare les deux : la différence de couleur en sortie est faible, la molécule fait presque tout.'],
      alpha:['La polarisabilité : ce qui compte','C’est la facilité avec laquelle le champ électrique de la lumière décale le nuage d’électrons, donc crée un dipôle. Elle s’exprime en volume (Å³ : 1 Å³ = 10⁻³⁰ m³). Plus elle est grande, plus le dipôle induit est grand. Les gros nuages mous (benzène, SF₆) ont une grande polarisabilité, les petits nuages serrés (He, H₂) une petite.'],
      carre:['Ce que fait la molécule : multiplier par σ(λ)','Pour chaque longueur d’onde, la molécule diffuse une fraction de la lumière égale à σ(λ), proportionnelle à α²/λ⁴. La puissance rayonnée est proportionnelle au carré du dipôle, donc à α². Doubler α multiplie la diffusion par 4 : le benzène (α = 10,3 Å³) diffuse environ 35 fois plus que le diazote (1,74 Å³). La dépendance en 1/λ⁴, elle, ne change pas : toutes les molécules de la liste ont la même forme de courbe, exactement dans le même rapport entre bleu et rouge. C’est pourquoi la couleur diffusée est la même pour toutes.'],
      couleur:['Comment on obtient la couleur de sortie','La lumière diffusée contient toutes les longueurs d’onde en même temps, chacune avec son intensité (les barres). Ton œil les reçoit ensemble : ses trois types de cônes additionnent, chacun à sa façon, toute la lumière qu’ils reçoivent. La pastille est calculée ainsi, avec les trois courbes de sensibilité de l’œil (observateur CIE 1931), puis l’intensité totale est normalisée : seul compte le rapport entre les couleurs, pas la quantité de lumière.'],
      h2:['Et H₂ ? Plus petit, donc plus de diffusion ?','Au contraire : H₂ est parmi les plus petites molécules de la liste (0,29 nm), et sa polarisabilité (0,79 Å³) est plus de deux fois plus petite que celle de N₂. Il diffuse environ 5 fois moins que N₂. Une diffusion forte ne vient donc pas de « grosses molécules » mais de molécules très polarisables. Et elle reste de type Rayleigh (en 1/λ⁴), car toutes ces molécules sont minuscules devant la longueur d’onde. Pour que la diffusion change de nature, il faut des particules d’environ 1/10 de longueur d’onde, soit une cinquantaine de nanomètres : des milliers de fois plus gros qu’une molécule. Ce sont les gouttes et les poussières, étudiées dans la dernière partie.'],
      limite:['Jusqu’où la loi Rayleigh vaut-elle ?','Tant que la particule est petite devant la longueur d’onde : en pratique, jusqu’à un rayon d’environ λ/10, soit 40 à 70 nm pour la lumière visible. Au-delà, la particule n’est plus « vue » comme un point par l’onde : le champ n’est plus uniforme sur elle, et il faut le calcul complet de Mie.'],
      simplif:['Ce qui est simplifié','La formule σ = 128π⁵α′²/(3λ⁴) suppose une molécule sphérique (isotrope) et une polarisabilité indépendante de la couleur. Pour l’air, le calcul réel (étape précédente) donne σ(550 nm) = 4,5·10⁻³¹ m², contre 4,3 ici avec α = 1,74 Å³ : l’écart (5 %) vient de l’anisotropie de la molécule et de la variation de α avec la couleur. Les polarisabilités sont des valeurs de tables, arrondies. Les tailles des molécules sont des diamètres cinétiques approchés. Le calcul de couleur ne simule pas l’adaptation de l’œil.']
    };
    L.infoBar(el.querySelector('.infobar'),el.querySelector('.infobox'),['entree','alpha','carre','couleur','h2','limite','simplif'],INFO);
    const sel=el.querySelector('select'); MOL.forEach((m,i)=>{ const o=document.createElement('option'); o.value=i; o.textContent=m[0]+' · α = '+String(m[1]).replace('.',',')+' Å³'; sel.appendChild(o); });
    const o2=document.createElement('option'); o2.value='c'; o2.textContent='Autre : régler la polarisabilité'; sel.appendChild(o2); sel.value=3;
    const inp=el.querySelector('input'), out=el.querySelector('.slider strong'); inp.disabled=true;
    const W=440,H=452,V=L.setup(el.querySelector('canvas'),W,H);
    let a=1.74, nm='N₂ (diazote)', size=.364, real=true, t=0, dirty=true, R=null;
    el.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{ real=b.dataset.i==='reel'; el.querySelectorAll('[data-i]').forEach(c=>c.setAttribute('aria-pressed',c===b)); dirty=true; cap(); });
    const upd=()=>{ if(sel.value==='c'){ inp.disabled=false; a=inp.value/10; nm='Molécule personnalisée'; size=0; } else { inp.disabled=true; const m=MOL[+sel.value]; a=m[1]; nm=m[0]; size=m[2]; inp.value=Math.round(a*10); }
      out.textContent=String(a.toFixed(2)).replace('.',',')+' Å³'; dirty=true; cap(); };
    sel.onchange=upd; inp.addEventListener('input',()=>{ if(sel.value==='c') upd(); });
    const fr=(v,d)=>v.toFixed(d).replace('.',',');
    function cap(){ const b=el.querySelector('.caption b'),s=el.querySelector('.caption span'), r=a/1.74;
      b.textContent=nm+' : '+(r<.95?fr(r,2)+' fois ':r>1.05?fr(r,r<10?1:0)+' fois ':'autant que ')+(r<.95?'moins que N₂':r>1.05?'plus que N₂':'N₂')+' (à α² près : ×'+fr(r*r,r*r<10?2:0)+')';
      s.textContent='La molécule multiplie chaque barre d’entrée par une courbe en 1/λ⁴ : le bleu ressort. Les barres de sortie sont tracées à leur propre échelle ; l’intensité totale diffusée est indiquée en bas. Toutes les molécules donnent la même couleur : seule l’intensité change.'; }
    function compute(){ const S=l=>D.sigmaPol(a,l), I=l=>real?D.sun(l):1; R={S,I,ci:D.color(I),co:D.color(l=>S(l)*I(l))}; dirty=false; }
    upd();
    L.onFrame(dt=>{
      if(!L.reduce) t+=dt; if(dirty) compute();
      const x=V.ctx; V.base(); L.bgLab(x,W,H); const S=R.S, I=R.I;
      const norm=f=>{ let m=0; for(let l=380;l<=750;l+=3) m=Math.max(m,f(l)); return m; };
      const bars=(X0,X1,Y0,Y1,f,m)=>{ const px=l=>X0+(l-380)/370*(X1-X0); L.line(x,X0,Y1,X1,Y1,'rgba(232,238,244,.35)',1);
        for(let l=380;l<750;l+=2){ const h=f(l)/m*(Y1-Y0-4); x.fillStyle=L.rgba(D.rgbStr(D.pure(l)),.62); x.fillRect(px(l),Y1-h,(X1-X0)/370*2+.5,h); }
        x.beginPath(); for(let l=380;l<=750;l+=3){ const X=px(l),Y=Y1-f(l)/m*(Y1-Y0-4); l===380?x.moveTo(X,Y):x.lineTo(X,Y); } x.strokeStyle='#E8EEF4'; x.lineWidth=1.6; x.stroke();
        [400,500,600,700].forEach(l=>{ L.line(x,px(l),Y1,px(l),Y1+4,C.muted,1); L.txt(x,String(l),px(l),Y1+13,'center'); }); return px; };
      const swatch=(X,Y,w,h,c,lab)=>{ L.rr(x,X,Y,w,h,10,D.rgbStr(c),'rgba(232,238,244,.3)',1); L.txt(x,lab,X+w/2,Y+h+13,'center',C.ink); };
      // ENTRÉE
      L.txt(x,'ENTRÉE',12,14,'left',C.laser,true); L.txt(x,real?'spectre du Soleil, hors atmosphère':'Soleil idéalisé : autant de lumière à chaque longueur d’onde',64,14,'left',C.ink);
      bars(40,310,32,128,I,norm(I)); L.txt(x,'longueur d’onde (nm)',310,152,'right',C.muted);
      swatch(334,44,86,56,R.ci,'couleur de l’entrée');
      // MOLÉCULE
      const my=186; L.line(x,12,my-18,W-12,my-18,'rgba(232,238,244,.12)',1); L.txt(x,'MOLÉCULE',12,my,'left',C.laser,true);
      const rad=7+Math.min(6,Math.sqrt(a)*2.2); L.glow(x,120,my+2,rad*2.8,'#FF9C94',.35); L.sph(x,120,my+2,rad,'#FF8A80',.9); L.txt(x,nm.split(' ')[0],120,my+rad+14,'center',C.ink);
      L.txt(x,'multiplie chaque barre',170,my-8,'left',C.ink); L.txt(x,'par σ(λ) ∝ α²/λ⁴',170,my+6,'left',C.ink); L.txt(x,'α = '+fr(a,2)+' Å³',170,my+22,'left','#FF9F43',true);
      // petite courbe σ(λ) : le « filtre »
      { const X0=330, X1=420, Y0=my-14, Y1=my+20, m=norm(S); x.beginPath(); for(let l=380;l<=750;l+=5){ const X=X0+(l-380)/370*(X1-X0), Y=Y1-S(l)/m*(Y1-Y0); l===380?x.moveTo(X,Y):x.lineTo(X,Y); } x.strokeStyle='#FF9F43'; x.lineWidth=1.8; x.stroke(); L.line(x,X0,Y1,X1,Y1,'rgba(232,238,244,.3)',1); L.txt(x,'σ(λ)',X1+0,Y0-2,'right','#FF9F43'); }
      // flèches
      L.arrow(x,60,152,60,my-24,C.muted,1.4);
      // SORTIE
      L.line(x,12,my+36,W-12,my+36,'rgba(232,238,244,.12)',1);
      L.txt(x,'SORTIE',12,my+50,'left',C.laser,true); L.txt(x,'lumière diffusée : entrée × σ(λ)',64,my+50,'left',C.ink);
      const OY0=my+64, OY1=my+176, F=l=>S(l)*I(l), mo=norm(F), px=bars(40,310,OY0,OY1,F,mo);
      swatch(334,OY0+36,86,56,R.co,'couleur diffusée');
      // la superposition : des points colorés, un par longueur d'onde, convergent vers la pastille
      const tg=[334+43,OY0+64]; let tot=0; const LS=[]; for(let l=400;l<=720;l+=40){ LS.push(l); tot+=F(l); }
      LS.forEach((l,i)=>{ const sx=px(l), sy=OY1-F(l)/mo*(OY1-OY0-4), share=F(l)/tot, u=((t*.45+i/LS.length)%1), e=L.ease(u), col=D.rgbStr(D.pure(l));
        x.beginPath(); x.moveTo(sx,sy); x.quadraticCurveTo(sx,OY0+64,tg[0]-43,tg[1]); x.strokeStyle=L.rgba(col,Math.min(.6,.14+1.5*share)); x.lineWidth=.8; x.stroke();
        const bx=(1-e)*(1-e)*sx+2*(1-e)*e*sx+e*e*(tg[0]-43), by=(1-e)*(1-e)*sy+2*(1-e)*e*(OY0+64)+e*e*tg[1]; x.beginPath(); x.arc(bx,by,1.5+Math.sqrt(share)*5,0,7); x.fillStyle=L.rgba(col,.9); x.fill(); });
      L.txt(x,'on additionne toutes',334+43,OY0+122,'center',C.muted); L.txt(x,'les longueurs d’onde',334+43,OY0+135,'center',C.muted);
      // lectures
      const ry=OY1+44, s550=S(550), tot2=D.sigmaPol(a,550)/D.sigmaPol(1.74,550);
      L.txt(x,'σ à 550 nm : '+(s550*1e31).toFixed(2).replace('.',',')+' ×10⁻³¹ m²   ·   bleu 450 nm / rouge 650 nm = '+fr(S(450)/S(650),1),12,ry,'left',C.ink);
      L.txt(x,'intensité diffusée : '+(tot2<10?fr(tot2,2):fr(tot2,0))+' × celle de N₂'+(size?'   ·   taille : '+fr(size,3)+' nm = '+fr(size/550,4)+' × λ (550 nm)':''),12,ry+16,'left',C.muted);
      L.vignette(x,W,H); },V.cv);
  }
});
