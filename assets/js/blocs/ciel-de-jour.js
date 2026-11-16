/* Bloc « ciel-de-jour » : de la lumière du Soleil au bleu du ciel, en suivant le rayon.
   Quatre étapes, chacune multiplie le spectre précédent par un facteur réel :
   1. Soleil : spectre hors atmosphère (ASTM G173, 300 à 750 nm)
   2. couche d'ozone : transmission exp(−τ(λ)), bandes de Hartley-Huggins (UV) et de Chappuis (visible) — 300 unités Dobson, Soleil au zénith
   3. atmosphère : diffusion de Rayleigh, section efficace de l'air σ(λ) (Bodhaine et al. 1999)
   4. œil : sensibilité ȳ(λ) (Wyman et al. 2013). La couleur affichée est toujours calculée avec les trois courbes de l'œil (CIE 1931), sans adaptation. */
Labo.defineBloc('ciel-de-jour',{
  titre:'Pourquoi le ciel est bleu, et pas violet',
  mount(el){
    const L=Labo, C=L.C, D=window.Diff;
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas style="aspect-ratio:460/440" aria-label="Un rayon du Soleil traverse la couche d’ozone puis l’atmosphère, est diffusé vers l’œil ; en dessous, le spectre de la lumière à chaque étape et la couleur correspondante, comparée à celle d’un ciel clair"></canvas></div>'+
      '<div class="lc"><div class="seg" role="group" aria-label="Étape"><button type="button" data-s="1" aria-pressed="true">1. Soleil</button><button type="button" data-s="2" aria-pressed="false">2. Ozone</button><button type="button" data-s="3" aria-pressed="false">3. Atmosphère</button><button type="button" data-s="4" aria-pressed="false">4. Œil</button></div>'+
      '<button type="button" data-a="next" class="primary">Étape suivante ▸</button>'+
      '<button type="button" data-a="ideal" aria-pressed="false">Soleil idéalisé : parfaitement blanc</button></div>'+
      '<div class="caption" aria-live="polite"><b></b><span></span></div>'+
      '<div class="infobar"></div><div class="infobox" hidden></div></div>';
    const INFO={
      chaine:['Comment lire ce graphique','Le rayon part du Soleil (en haut à gauche) et traverse, dans l’ordre, la couche d’ozone, puis l’air bas, où il est diffusé vers ton œil. À chaque étape, on multiplie le spectre (l’intensité pour chaque longueur d’onde) par ce que fait cette étape. La flèche sous le dessin montre où on en est ; le graphique dessous montre le spectre à cet endroit, la pastille la couleur qui lui correspond. La partie grisée à gauche est l’ultraviolet : invisible, mais bien présent dans la lumière du Soleil.'],
      soleil:['Le spectre du Soleil n’est pas plat','Le Soleil émet comme un corps à environ 5 770 K, avec un maximum vers 500 nm, plus faible dans le violet et dans le rouge (courbe de référence ASTM G173, hors atmosphère). Il est creusé de raies sombres (raies de Fraunhofer), dues aux atomes de sa surface. Il émet aussi de l’ultraviolet, en quantité notable. À 410 nm, il émet environ 20 % de moins qu’à 470 nm : il y a un peu moins de violet à diffuser, le bleu gagne un peu. Mais l’effet est modéré : le Soleil seul n’explique pas pourquoi le ciel est bleu et non violet.'],
      ozone:['Qu’est-ce que la couche d’ozone ?','C’est une région de la haute atmosphère, entre 15 et 35 km d’altitude (au-dessus de la plupart des nuages et des avions de ligne), où l’on trouve la plus grande partie de l’ozone O₃, molécule faite de trois atomes d’oxygène. Il y en a très peu : si on la ramenait à la pression du sol, la couche ferait environ 3 mm d’épaisseur (300 unités Dobson). Mais l’ozone absorbe fortement l’ultraviolet entre 200 et 310 nm (bande de Hartley, le rayonnement UV-B et UV-C, dangereux pour la peau et l’ADN). Sans elle, la vie à la surface serait très différente. La lumière visible, elle, passe presque entièrement : ce n’est pas ce qui colore le ciel de jour.'],
      ozeffet:['Ce que l’ozone change, et ne change pas','Dans l’ultraviolet, l’effet est radical : à 300 nm il ne passe que 4 % de la lumière, et presque rien en dessous de 290 nm. Dans le visible, l’ozone absorbe faiblement dans la bande de Chappuis, vers 600 nm : environ 4 % de la lumière orange à la verticale. Cela retire un peu de rouge-orange et rend le ciel très légèrement plus bleu. Retiens : pour la couleur du ciel de jour, l’ozone est un effet de second ordre ; il devient important au crépuscule, quand le trajet dans l’ozone est long (étape suivante).'],
      iono:['Et l’ionosphère ?','L’ionosphère est une région bien plus haute, de 60 à 1 000 km environ, où le rayonnement très énergétique du Soleil (rayons X et ultraviolet extrême, longueurs d’onde sous 100 nm) arrache des électrons aux atomes et aux molécules : c’est ce qui la rend ionisée. Elle absorbe donc des rayonnements bien plus courts que ceux du graphique. Plus bas, l’oxygène O₂ absorbe entre 120 et 200 nm, puis l’ozone prend le relais jusqu’à 310 nm. Résultat : tout ce qui est sous 290 nm environ n’atteint jamais le sol. L’ionosphère n’intervient pas dans la couleur du ciel (elle n’absorbe pas le visible), mais elle réfléchit les ondes radio courtes, d’où les liaisons radio lointaines.'],
      diffusion:['Ce que fait l’atmosphère : elle diffuse, plus le bleu que le rouge','On multiplie chaque barre par la section efficace de diffusion d’une molécule d’air, σ(λ), qui croît comme 1/λ⁴. Tout ce qui est diffusé vers ton œil est de la lumière du ciel. Remarque : le plus diffusé est l’ultraviolet proche (330 à 380 nm), qui est invisible. L’œil ne le voit pas : c’est l’étape suivante.'],
      oeil:['Pourquoi pas violet ? L’œil','La diffusion est bien plus forte pour le violet (410 nm) que pour le bleu (470 nm). Mais l’œil est très peu sensible au violet : sa sensibilité y est plus de 30 fois plus faible qu’à 470 nm (courbe standard ȳ de l’œil). Elle est nulle dans l’ultraviolet. Le résultat est un mélange où le bleu domine nettement, pâli par le vert et le rouge qu’on reçoit aussi en petite quantité. C’est surtout un fait de notre vision : le ciel serait violet pour une créature dont l’œil serait plus sensible à 400 nm. Et ce n’est pas qu’une question d’intensité : les cônes bleus sont rares et absents du centre de l’œil (voir la page « L’œil et les cônes »).'],
      pale:['Pourquoi le ciel est bleu pâle, pas bleu pur','Le ciel contient toutes les couleurs, mais en proportions inégales : il y a plus de bleu, mais aussi du vert et un peu de rouge. Leur mélange donne un bleu clair. C’est aussi pour ça que le ciel est plus pâle vers l’horizon : la lumière y a traversé plus d’air, donc diffusé plusieurs fois, et se rapproche du blanc.'],
      reel:['La pastille « ciel clair réel »','C’est un bleu de ciel clair typique, donné à titre indicatif : le ciel réel varie avec l’heure, l’humidité, la pollution et la direction où l’on regarde, et sa couleur affichée dépend de ton écran et du réglage du blanc. Compare la pastille calculée avec le ciel que tu vois par la fenêtre : elle doit être du même bleu clair, un peu plus saturée (l’œil, adapté à la lumière ambiante, corrige un peu).'],
      simplif:['Ce qui est simplifié','Soleil au zénith, regard vers le zénith : la lumière traverse l’ozone une fois. Diffusion simple d’une seule molécule (en réalité la lumière peut être diffusée plusieurs fois, surtout vers l’horizon), sans aérosols ni vapeur d’eau. L’ordre des étapes est choisi pour la clarté : ozone et diffusion agissent en réalité en même temps, mais leurs effets se multiplient et l’ordre ne change pas le résultat. Ozone à 300 DU, bandes d’absorption arrondies (valeurs de la littérature, forme simplifiée). Les bandes de l’oxygène et de la vapeur d’eau ne sont pas incluses. Le dessin n’est pas à l’échelle (l’ozone est à 25 km, l’air dense à moins de 10 km). La couleur est calculée avec l’observateur CIE 1931 (ajustement de Wyman), sans adaptation de l’œil ; la clarté est normalisée.']
    };
    const KEYS=()=>({1:['chaine','soleil','simplif'],2:['ozone','ozeffet','iono','simplif'],3:['diffusion','pale','simplif'],4:['oeil','pale','reel','simplif']})[step];
    const W=460,H=440,V=L.setup(el.querySelector('canvas'),W,H);
    let step=1, ideal=false, t=0; const infobar=el.querySelector('.infobar'), box=el.querySelector('.infobox');
    const setInfo=()=>L.infoBar(infobar,box,KEYS(),INFO);
    const sunN=l=>ideal?1:D.sun(l), Toz=l=>Math.exp(-D.tauO3(l)), sig=l=>D.sigmaAir(l)/D.sigmaAir(550), fd=l=>1-Math.exp(-D.tauR(l)), eye=l=>D.eye(l);
    const S=[null,l=>sunN(l),l=>sunN(l)*Toz(l),l=>sunN(l)*Toz(l)*fd(l),l=>sunN(l)*Toz(l)*fd(l)*eye(l)];
    const REF=[100,155,232];   // bleu d'un ciel clair, indicatif
    const go=n=>{ step=Math.max(1,Math.min(4,n)); el.querySelectorAll('[data-s]').forEach(c=>c.setAttribute('aria-pressed',+c.dataset.s===step)); setInfo(); cap(); };
    el.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>go(+b.dataset.s));
    el.querySelector('[data-a="next"]').onclick=()=>go(step===4?1:step+1);
    el.querySelector('[data-a="ideal"]').onclick=e=>{ ideal=!ideal; e.currentTarget.setAttribute('aria-pressed',ideal); e.currentTarget.textContent=ideal?'Soleil idéalisé : parfaitement blanc (activé)':'Soleil idéalisé : parfaitement blanc'; cap(); };
    const fr=(v,d)=>v.toFixed(d).replace('.',',');
    function cap(){ const b=el.querySelector('.caption b'), s=el.querySelector('.caption span');
      if(step===1){ b.textContent='1. Le Soleil, avant l’atmosphère'; s.textContent=ideal?'Soleil idéalisé : autant d’énergie à chaque longueur d’onde, ultraviolet compris. Désactive le bouton pour utiliser le vrai spectre.':'Le spectre du Soleil hors atmosphère : plus faible dans le violet et le rouge, avec de l’ultraviolet (zone grisée) que l’œil ne voit pas.'; }
      else if(step===2){ b.textContent='2. La couche d’ozone retire l’ultraviolet'; s.textContent='L’ozone absorbe presque tout l’ultraviolet sous 310 nm, et à peine 4 % de l’orange vers 600 nm : le visible est presque intact, donc la couleur de la lumière change très peu.'; }
      else if(step===3){ b.textContent='3. L’atmosphère diffuse : le plus court est le plus diffusé'; s.textContent='Chaque barre est la part de la lumière arrivante qui est diffusée : 1 − exp(−τ), avec τ en 1/λ⁴ (épaisseur optique de l’air). Même échelle que l’étape précédente (pointillés) : on ne peut pas diffuser plus de lumière qu’il n’en arrive. La couleur calculée est déjà un bleu clair.'; }
      else { b.textContent='4. L’œil : le violet et l’ultraviolet comptent presque pour rien'; s.textContent='L’œil capte le violet à 410 nm avec '+fr(D.eye(410)/D.eye(470)*100,0)+' % de la sensibilité qu’il a pour le bleu à 470 nm, et pas du tout l’ultraviolet. Reste un bleu clair : la couleur du ciel.'; } }
    setInfo(); cap();
    // géométrie de la scène (côté vue, pas à l'échelle)
    const SUN=[48,12], P=[330,112], EYE=[330,152], BAND={iono:[24,38],ozone:[60,80],air:[100,152]};
    const rayY=xx=>SUN[1]+(xx-SUN[0])*(P[1]-SUN[1])/(P[0]-SUN[0]), rayX=yy=>SUN[0]+(yy-SUN[1])*(P[0]-SUN[0])/(P[1]-SUN[1]);
    const MARK=[null,[66,14],[rayX(70)+18,58],[P[0]+14,P[1]-14],[EYE[0]+18,EYE[1]-6]];
    function eyeGlyph(x,cx,cy,ring){ x.beginPath(); x.moveTo(cx-13,cy); x.quadraticCurveTo(cx,cy-12,cx+13,cy); x.quadraticCurveTo(cx,cy+12,cx-13,cy); x.fillStyle='#E8EEF4'; x.fill(); x.beginPath(); x.arc(cx,cy,5,0,7); x.fillStyle='#2A5BD7'; x.fill(); x.beginPath(); x.arc(cx,cy,2.2,0,7); x.fillStyle='#0A0F14'; x.fill();
      if(ring){ x.beginPath(); x.arc(cx,cy,19,0,7); x.strokeStyle='#FFE08A'; x.lineWidth=1.4; x.stroke(); } }
    L.onFrame(dt=>{
      if(!L.reduce) t+=dt;
      const x=V.ctx; V.base(); L.bgLab(x,W,H);
      const col=k=>D.rgbStr(D.color(S[k])), c1=col(1), c2=col(2), c3=col(3), cc=[null,c1,c2,c3,c3][step];
      /* ---- scène ---- */
      // couches
      const lay=(b,fill,stroke,act)=>{ x.fillStyle=fill; x.fillRect(0,b[0],W,b[1]-b[0]); L.line(x,0,b[0],W,b[0],stroke,act?1.8:.8); L.line(x,0,b[1],W,b[1],stroke,act?1.8:.8); };
      lay(BAND.iono,'rgba(80,200,200,.08)','rgba(120,220,220,.55)',false); L.txt(x,'ionosphère · 60 à 1 000 km',W-8,(BAND.iono[0]+BAND.iono[1])/2,'right','#7FD6D6');
      lay(BAND.ozone,'rgba(161,147,255,.2)','rgba(161,147,255,.8)',step===2); L.txt(x,'couche d’ozone · 15 à 35 km',W-8,(BAND.ozone[0]+BAND.ozone[1])/2,'right','#B7ABFF');
      const ga=x.createLinearGradient(0,BAND.air[0],0,BAND.air[1]); ga.addColorStop(0,'rgba(90,169,255,.03)'); ga.addColorStop(1,'rgba(90,169,255,.30)'); x.fillStyle=ga; x.fillRect(0,BAND.air[0],W,BAND.air[1]-BAND.air[0]);
      if(step===3){ L.line(x,0,BAND.air[0],W,BAND.air[0],'#FFE08A',1.4); }
      L.txt(x,'air dense · surtout sous 10 km',8,BAND.air[0]+12,'left','#8FB8FF');
      x.fillStyle='#0B1218'; x.fillRect(0,BAND.air[1],W,172-BAND.air[1]); L.line(x,0,BAND.air[1],W,BAND.air[1],'rgba(232,238,244,.35)',1);
      // Soleil
      L.glow(x,SUN[0],SUN[1],34,D.rgbStr(D.color(S[1])),.55); L.sph(x,SUN[0],SUN[1],8,D.rgbStr(D.color(S[1]).map(v=>Math.min(255,v+20))),1);
      L.txt(x,'Soleil',SUN[0]-2,SUN[1]+22,'center',C.ink);
      // rayon : couleur selon l'endroit du trajet
      const oy0=BAND.ozone[0], oy1=BAND.ozone[1], ox0=rayX(oy0), ox1=rayX(oy1);
      L.beam(x,SUN[0]+8,SUN[1]+3,ox0,oy0,1.2,c1);
      { const g=x.createLinearGradient(ox0,oy0,ox1,oy1); g.addColorStop(0,c1); g.addColorStop(1,c2); L.beam(x,ox0,oy0,ox1,oy1,1.2,c1); L.beam(x,(ox0+ox1)/2,(oy0+oy1)/2,ox1,oy1,.9,c2); }
      L.beam(x,ox1,oy1,P[0],P[1],1.2,c2);
      // diffusion en P : rayons vers toutes les directions (faibles) et vers l'œil (fort)
      for(let k=0;k<12;k++){ const a=k/12*2*Math.PI+.2; if(Math.abs(Math.cos(a-Math.PI/2))>.97) continue; const e=L.rgba(c3,.28); x.beginPath(); x.moveTo(P[0]+Math.cos(a)*5,P[1]+Math.sin(a)*5); x.lineTo(P[0]+Math.cos(a)*(22+6*(k%2)),P[1]+Math.sin(a)*(22+6*(k%2))); x.strokeStyle=e; x.lineWidth=1.2; x.stroke(); }
      L.beam(x,P[0],P[1]+3,EYE[0],EYE[1]-14,1.8,c3);
      L.glow(x,P[0],P[1],14,c3,.5);
      // impulsions qui avancent le long du trajet
      const segs=[[SUN[0]+8,SUN[1]+3,ox0,oy0,c1],[ox0,oy0,ox1,oy1,c2],[ox1,oy1,P[0],P[1],c2],[P[0],P[1]+3,EYE[0],EYE[1]-14,c3]], lens=segs.map(s=>Math.hypot(s[2]-s[0],s[3]-s[1])), tot=lens.reduce((a,b)=>a+b,0);
      for(let k=0;k<4;k++){ let d=((t*70+k*tot/4)%tot), i=0; while(d>lens[i]){ d-=lens[i]; i++; } const sg=segs[i], f=d/lens[i]; x.beginPath(); x.arc(sg[0]+(sg[2]-sg[0])*f,sg[1]+(sg[3]-sg[1])*f,2.8,0,7); x.fillStyle=L.rgba(sg[4],.95); x.fill(); }
      // œil
      eyeGlyph(x,EYE[0],EYE[1]-8,step===4); L.txt(x,'œil',EYE[0],EYE[1]+10,'center',C.ink);
      // pastille d'étape et flèche vers le spectre
      for(let k=1;k<=4;k++){ const m=MARK[k], on=k===step; x.beginPath(); x.arc(m[0],m[1],8,0,7); x.fillStyle=on?'#FFE08A':'rgba(10,15,20,.85)'; x.fill(); x.strokeStyle=on?'#FFE08A':'rgba(232,238,244,.5)'; x.lineWidth=1.2; x.stroke(); L.txt(x,String(k),m[0],m[1]+.5,'center',on?'#0A0F14':C.ink,true); }
      { const m=MARK[step], ax=Math.max(24,Math.min(W-24,m[0])), bob=Math.sin(t*5)*1.5; x.beginPath(); x.moveTo(ax-7,166+bob); x.lineTo(ax+7,166+bob); x.lineTo(ax,176+bob); x.closePath(); x.fillStyle='#FFE08A'; x.fill(); L.line(x,m[0],m[1]+9,ax,166,'rgba(255,224,138,.35)',1,[2,3]); }
      L.txt(x,'dessin pas à l’échelle',8,164,'left',C.muted);
      /* ---- spectre ---- */
      const X0=40,X1=326,Y0=210,Y1=352, px=l=>X0+(l-300)/450*(X1-X0), f=S[step], ghost=step>1?S[step-1]:null;
      const nrm=g=>{ let m=1e-300; for(let l=300;l<=750;l+=2) m=Math.max(m,g(l)); return m; };
      const m1=nrm(S[1]), m=m1, hOf=(g,mm,l)=>g(l)/mm*(Y1-Y0-8)*.74;
      L.txt(x,['','Spectre du Soleil, hors atmosphère','Après la couche d’ozone','Lumière diffusée par l’air','Ce que l’œil retient de la lumière diffusée'][step],X0,Y0-14,'left',C.ink,true);
      // zone ultraviolette
      x.fillStyle='rgba(150,130,210,.10)'; x.fillRect(px(300),Y0-4,px(380)-px(300),Y1-Y0+4); L.txt(x,'ultraviolet',(px(300)+px(380))/2,Y0+6,'center','#B7ABFF'); L.txt(x,'(invisible)',(px(300)+px(380))/2,Y0+18,'center','#B7ABFF');
      L.line(x,X0,Y1,X1,Y1,'rgba(232,238,244,.35)',1);
      if(step===2){ for(let l=300;l<750;l+=2){ const h1=hOf(S[1],m1,l), h2=hOf(S[2],m1,l); x.fillStyle='rgba(232,238,244,.13)'; x.fillRect(px(l),Y1-h1,(X1-X0)/450*2+.5,h1-h2); } }
      for(let l=300;l<750;l+=2){ const h=Math.max(0,hOf(f,m,l)); x.fillStyle=l<380?'rgba(170,150,230,.55)':L.rgba(D.rgbStr(D.pure(l)),.65); x.fillRect(px(l),Y1-h,(X1-X0)/450*2+.5,h); }
      if(ghost&&step>2){ x.beginPath(); for(let l=300;l<=750;l+=3){ const X=px(l),Y=Y1-ghost(l)/m1*(Y1-Y0-8)*.74; l===300?x.moveTo(X,Y):x.lineTo(X,Y); } x.strokeStyle='rgba(232,238,244,.35)'; x.lineWidth=1.2; x.setLineDash([3,3]); x.stroke(); x.setLineDash([]); }
      x.beginPath(); for(let l=300;l<=750;l+=2){ const X=px(l), Y=Y1-Math.max(0,hOf(f,m,l)); l===300?x.moveTo(X,Y):x.lineTo(X,Y); } x.strokeStyle='#E8EEF4'; x.lineWidth=1.8; x.stroke();
      if(step>2) L.txt(x,'pointillés : étape précédente, même échelle',X1,Y1+27,'right',C.muted); else if(step===2) L.txt(x,'en gris clair : ce que l’ozone a retiré',X1,Y1+27,'right',C.muted);
      [300,400,500,600,700].forEach(l=>{ L.line(x,px(l),Y1,px(l),Y1+4,C.muted,1); L.txt(x,String(l),px(l),Y1+13,'center'); }); L.txt(x,'nm',X1+10,Y1+13,'left',C.muted);
      // pastilles de couleur
      const SW=[['Soleil',c1],['après l’ozone',c2],['lumière diffusée',c3],['ciel clair réel',D.rgbStr(REF)]], sx=350, sw=96;
      SW.forEach((s,i)=>{ const y=Y0+i*42-8, on=(i===0&&step===1)||(i===1&&step===2)||(i===2&&step>=3); L.rr(x,sx,y,sw,24,7,s[1],on?'#FFE08A':'rgba(232,238,244,.25)',on?2:1); L.txt(x,s[0],sx,y+33,'left',on?C.ink:C.muted); });
      // lectures chiffrées
      const rd=[];
      if(step===1){ rd.push('Soleil : maximum vers 500 nm, moins de violet et de rouge.'); rd.push('La couleur calculée de la lumière brute du Soleil est presque blanche.'); }
      else if(step===2){ rd.push('Transmission de l’ozone : 300 nm → '+fr(Toz(300)*100,0)+' % · 310 nm → '+fr(Toz(310)*100,0)+' % · 320 nm → '+fr(Toz(320)*100,0)+' %'); rd.push('Visible : 450 nm → '+fr(Toz(450)*100,1)+' % · orange 600 nm → '+fr(Toz(600)*100,0)+' % · 650 nm → '+fr(Toz(650)*100,0)+' %'); }
      else if(step===3){ rd.push('Part diffusée : 400 nm → '+fr(fd(400)*100,0)+' % · 450 nm → '+fr(fd(450)*100,0)+' % · 650 nm → '+fr(fd(650)*100,1)+' %'); rd.push('Le maximum diffusé est à '+(()=>{ let b=300,mv=0; for(let l=300;l<=750;l++){ const v=f(l); if(v>mv){ mv=v; b=l; } } return b; })()+' nm, '+((()=>{ let b=300,mv=0; for(let l=300;l<=750;l++){ const v=f(l); if(v>mv){ mv=v; b=l; } } return b; })()<380?'dans l’ultraviolet : invisible.':'dans le visible.')); }
      else { rd.push('Sensibilité de l’œil : 410 nm → '+fr(D.eye(410)/D.eye(470)*100,0)+' % de celle à 470 nm · 300–380 nm → 0 %'); rd.push('Pastille « lumière diffusée » = couleur du ciel calculée ; compare avec la suivante.'); }
      rd.forEach((s,i)=>L.txt(x,s,12,Y1+48+i*16,'left',i?C.muted:C.ink));
      L.vignette(x,W,H); },V.cv);
  }
});
