/* Bloc « diffusion-mie » : de Rayleigh à Mie, selon la taille de la particule.
   Calcul exact de la diffusion d'une sphère homogène (théorie de Mie, algorithme de Bohren & Huffman 1983),
   moyenné sur ±15 % de rayon pour imiter une vraie population de gouttes (sinon, des oscillations artificielles apparaissent).
   Paramètre de taille x = 2πr/λ. Lumière incidente : spectre du Soleil (ASTM G173). */
Labo.defineBloc('diffusion-mie',{
  titre:'Gouttes, poussières, nuages : quand la particule grossit',
  mount(el){
    const L=Labo, C=L.C, D=window.Diff;
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas style="aspect-ratio:400/340" aria-label="Diffusion de la lumière par une sphère de rayon réglable : spectre diffusé, diagramme angulaire et couleur résultante"></canvas></div>'+
      '<div class="lc"><label class="slider"><span>Rayon de la particule</span><input type="range" min="0" max="1000" step="1" value="40"><strong></strong></label>'+
      '<label class="slider"><span>Matière</span><select></select></label>'+
      '<div class="seg" role="group" aria-label="Exemples"><button type="button" data-r="1.5e-10">Molécule d’air</button><button type="button" data-r="1e-7">Fumée fine</button><button type="button" data-r="1e-5">Goutte de nuage</button><button type="button" data-r="1e-3">Goutte de pluie</button></div></div>'+
      '<div class="caption" aria-live="polite"><b></b><span></span></div>'+
      '<div class="infobar"></div><div class="infobox" hidden></div></div>';
    const INFO={
      x:['Le paramètre de taille','Ce qui compte, ce n’est pas la taille seule, mais sa comparaison avec la longueur d’onde : x = 2πr/λ. Quand x est très petit (particule bien plus petite que λ), c’est la diffusion de Rayleigh : en 1/λ⁴, bleue, à peu près la même vers l’avant et vers l’arrière. Quand x est de l’ordre de 1, c’est le régime de Mie : la dépendance en couleur s’affaiblit, et la lumière part surtout vers l’avant. Quand x est grand (≥ 20), l’optique géométrique prend le relais : toutes les couleurs sont diffusées pareil.'],
      blanc:['Pourquoi les nuages sont blancs','Les gouttes d’un nuage ont un rayon de 5 à 20 µm, soit x de l’ordre de 60 à 250 à 550 nm : bien au-delà du régime de Rayleigh. Elles diffusent toutes les couleurs à peu près pareil, donc la lumière blanche du Soleil reste blanche. Si les nuages étaient faits de gouttes de 20 nm, ils seraient bleus mais très peu visibles. Le brouillard et la brume fine d’aérosols (0,1 à 0,5 µm) donnent un bleu pâle quand on les voit devant un fond sombre.'],
      avant:['Pourquoi vers l’avant ?','Une particule petite est secouée uniformément, comme une molécule : elle rayonne autant vers l’avant que vers l’arrière. Une grosse particule a plusieurs parties qui sont secouées avec des décalages différents. Vers l’avant, leurs rayonnements s’additionnent en phase (ils se renforcent). Dans les autres directions, ils se décalent et s’annulent en partie. Plus la particule est grosse, plus le lobe vers l’avant est étroit et intense. C’est aussi ce qui donne le halo laiteux autour du Soleil derrière un voile de brume.'],
      couleurs:['Quand le bleu n’est plus le plus diffusé','Pour des particules de quelques dixièmes de micromètre, la dépendance en couleur n’est plus régulière, et l’exposant de la loi tombe sous 4, voire sous 0 (le rouge devient plus diffusé que le bleu). Avec des particules d’environ 0,5 à 1 µm de taille très homogène, la Lune et le Soleil ont déjà été vus bleus : on l’a observé après de grands feux de forêt et des éruptions volcaniques. C’est un cas où le calcul de Mie donne l’inverse de la règle de Rayleigh.'],
      simplif:['Ce qui est simplifié','Sphères homogènes et lisses, lumière non polarisée, diffusion simple d’une particule isolée (pas de diffusion multiple, qui est pourtant essentielle pour la clarté d’un nuage épais). Indices de réfraction pris constants dans le visible (eau 1,333 ; glace 1,31 ; sulfates 1,43 ; poussière 1,55 + 0,003i ; suie 1,75 + 0,45i : valeurs usuelles de la littérature). Le résultat est moyenné sur ±15 % de rayon. Au-delà de x ≈ 1 500, le calcul complet est remplacé par la limite géométrique (diffusion plate, blanche) et le diagramme angulaire n’est pas tracé : le lobe avant est alors plus étroit que 1°.']
    };
    L.infoBar(el.querySelector('.infobar'),el.querySelector('.infobox'),['x','blanc','avant','couleurs','simplif'],INFO);
    const sel=el.querySelector('select'); Object.keys(D.materials).forEach(k=>{ const o=document.createElement('option'); o.value=k; o.textContent=D.materials[k].nom; sel.appendChild(o); });
    const inp=el.querySelector('input'), out=el.querySelector('.slider strong');
    const W=400,H=340,V=L.setup(el.querySelector('canvas'),W,H);
    const rOf=s=>Math.pow(10,-10.3+(s/1000)*7.3), sOf=r=>Math.round((Math.log10(r)+10.3)/7.3*1000);
    let r=rOf(40), dirty=true, R=null;
    inp.addEventListener('input',()=>{ r=rOf(+inp.value); dirty=true; });
    sel.onchange=()=>{ dirty=true; };
    el.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{ r=+b.dataset.r; inp.value=sOf(r); dirty=true; });
    const fmtR=v=>v<1e-9?(v*1e9).toFixed(2).replace('.',',')+' nm':v<1e-6?(v*1e9).toFixed(v<1e-8?1:0).replace('.',',')+' nm':v<1e-3?(v*1e6).toFixed(v<1e-5?2:1).replace('.',',')+' µm':(v*1e3).toFixed(2).replace('.',',')+' mm';
    function compute(){
      const m=D.materials[sel.value].m, LS=[]; for(let l=380;l<=750;l+=10) LS.push(l);
      const xo=2*Math.PI*r/550e-9, geom=2*Math.PI*r/380e-9>1500;
      const fac=xo>.5?[.85,.92,1,1.08,1.15]:[1];
      const sig=LS.map(l=>{ if(geom) return 2.0*Math.PI*r*r; let s=0; fac.forEach(f=>{ const rr=r*f; s+=D.mie(2*Math.PI*rr/(l*1e-9),m).qsca*Math.PI*rr*rr; }); return s/fac.length; });
      let ang=null; if(!geom){ const a=D.mie(xo,m,91); ang=a.S1.map((s1,j)=>{ const s2=a.S2[j]; return (s1[0]*s1[0]+s1[1]*s1[1]+s2[0]*s2[0]+s2[1]*s2[1])/2; }); }
      const sg=l=>{ const i=(l-380)/10, k=Math.min(LS.length-2,Math.floor(i)), f=i-k; return sig[k]*(1-f)+sig[k+1]*f; };
      const sun=D.color(l=>D.sun(l)*Math.max(sg(l),0)), n=Math.log(Math.max(sg(450),1e-300)/Math.max(sg(650),1e-300))/Math.log(650/450);
      R={LS,sig,ang,geom,xo,col:sun,n,sg}; dirty=false; }
    function cap(){ const b=el.querySelector('.caption b'),s=el.querySelector('.caption span'), x=R.xo;
      if(x<.1){ b.textContent='Régime de Rayleigh : bleu, loi en 1/λ⁴'; s.textContent='La particule est bien plus petite que la longueur d’onde. Diffusion identique vers l’avant et vers l’arrière, bien plus forte pour le bleu : exposant mesuré ≈ '+R.n.toFixed(1).replace('.',',')+'.'; }
      else if(x<1.5){ b.textContent='Régime intermédiaire : le bleu domine de moins en moins'; s.textContent='La particule a la taille de la longueur d’onde (x ≈ '+x.toFixed(1).replace('.',',')+'). Le lobe vers l’avant grandit, l’exposant de la loi tombe à ≈ '+R.n.toFixed(1).replace('.',',')+'.'; }
      else if(x<30){ b.textContent='Régime de Mie : presque toutes les couleurs, surtout vers l’avant'; s.textContent='x ≈ '+x.toFixed(0)+'. La diffusion dépend peu de la couleur, la lumière part en avant. Voilà la brume, le brouillard et la couleur laiteuse des nuages minces.'; }
      else { b.textContent='Grosse particule : blanc, comme un nuage'; s.textContent='x ≈ '+x.toFixed(0)+(R.geom?' (au-delà de 1 500 : limite géométrique)':'')+'. Toutes les couleurs sont diffusées pareil : la lumière du Soleil reste blanche. Voilà pourquoi les nuages et la pluie sont blancs et gris.'; } }
    L.onFrame(()=>{
      if(dirty) compute(); const x=V.ctx; V.base(); L.bgLab(x,W,H); cap();
      out.textContent=fmtR(r)+' · x = '+(R.xo<10?R.xo.toFixed(R.xo<.1?4:2):R.xo.toFixed(0)).replace('.',',');
      // spectre diffusé
      const X0=34,X1=230,Y0=40,Y1=172, px=l=>X0+(l-380)/370*(X1-X0);
      L.line(x,X0,Y1,X1,Y1,'rgba(232,238,244,.35)',1); L.txt(x,'intensité diffusée (lumière solaire)',X0,Y0-18,'left',C.ink,true);
      let mx=1e-300; for(let l=380;l<=750;l+=5) mx=Math.max(mx,R.sg(l)*D.sun(l)); const hy=l=>R.sg(l)*D.sun(l)/mx*(Y1-Y0-6);
      for(let l=380;l<750;l+=2){ const hh=hy(l); x.fillStyle=L.rgba(D.rgbStr(D.pure(l)),.6); x.fillRect(px(l),Y1-hh,(X1-X0)/370*2+.5,hh); }
      x.beginPath(); for(let l=380;l<=750;l+=4){ l===380?x.moveTo(px(l),Y1-hy(l)):x.lineTo(px(l),Y1-hy(l)); } x.strokeStyle='#E8EEF4'; x.lineWidth=1.8; x.stroke();
      [400,500,600,700].forEach(l=>{ L.line(x,px(l),Y1,px(l),Y1+4,C.muted,1); L.txt(x,String(l),px(l),Y1+13,'center'); }); L.txt(x,'nm',X1,Y1+13,'right',C.muted);
      // diagramme angulaire (échelle racine pour garder le lobe arrière visible)
      const cx=318,cy=106,rad=72; L.txt(x,'directions de diffusion',cx,Y0-18,'center',C.ink,true);
      x.strokeStyle='rgba(232,238,244,.2)'; x.lineWidth=1; x.beginPath(); x.arc(cx,cy,rad,0,7); x.stroke(); L.line(x,cx-rad-6,cy,cx+rad+6,cy,'rgba(232,238,244,.18)',1,[3,3]);
      L.arrow(x,cx-rad-34,cy,cx-rad-8,cy,'#FFE08A',1.6); L.txt(x,'lumière',cx-rad-34,cy-12,'left','#FFE08A');
      if(R.ang){ let m2=0; R.ang.forEach(v=>m2=Math.max(m2,v)); x.beginPath(); for(let j=0;j<91;j++){ const th=j/90*Math.PI, rr=Math.sqrt(R.ang[j]/m2)*rad; const X=cx+rr*Math.cos(th), Y=cy-rr*Math.sin(th); j?x.lineTo(X,Y):x.moveTo(X,Y); }
        for(let j=90;j>=0;j--){ const th=j/90*Math.PI, rr=Math.sqrt(R.ang[j]/m2)*rad; x.lineTo(cx+rr*Math.cos(th),cy+rr*Math.sin(th)); } x.closePath(); x.fillStyle='rgba(255,224,138,.3)'; x.fill(); x.strokeStyle='#FFE08A'; x.lineWidth=1.6; x.stroke(); L.txt(x,'avant →',cx+rad-2,cy+rad+14,'right',C.muted); L.txt(x,'← arrière',cx-rad+2,cy+rad+14,'left',C.muted); }
      else { L.txt(x,'lobe avant plus étroit que 1°',cx,cy,'center',C.muted); }
      // couleur
      L.rr(x,34,220,100,60,10,D.rgbStr(R.col),'rgba(232,238,244,.25)',1); L.txt(x,'couleur de la lumière diffusée',34,293,'left',C.ink);
      L.txt(x,'exposant : intensité ∝ 1/λ^'+R.n.toFixed(1).replace('.',','),34,312,'left','#FF9F43',true);
      L.txt(x,'(Rayleigh : 4 ; blanc : 0)',34,326,'left',C.muted);
      const refs=[[1.5e-10,'molécule d’air'],[1e-7,'fumée fine'],[1e-5,'gouttelette de nuage'],[1e-3,'goutte de pluie']];
      L.txt(x,'repères :',170,226,'left',C.muted); refs.forEach(([v,s],i)=>L.txt(x,fmtR(v)+' : '+s,170,242+i*14,'left',Math.abs(Math.log10(r/v))<.3?C.ink:C.muted));
      L.txt(x,'Rayleigh ≈ jusqu’à λ/10 = 55 nm',170,306,'left','#8FB8FF');
      L.vignette(x,W,H); },V.cv);
  }
});
