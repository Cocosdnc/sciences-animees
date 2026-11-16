/* Bloc « test-cones » : une boule blanche et son ombre, éclairées par une lumière de couleur au choix (bleu, vert, rouge...).
   Scène : un mur faiblement éclairé, une boule, et son ombre portée avec une pénombre douce tout autour. En bleu, on distingue moins bien l'ombre.
   À gauche : la scène telle que l'écran l'affiche. À droite : simulation de l'image reçue par la rétine.
   Luminosité : toutes les couleurs sont ramenées à la luminance du bleu pur de l'écran (0,2126 R + 0,7152 G + 0,0722 B, valeurs linéaires). Le bleu pur
   paraît pourtant plus clair que cela (couleurs saturées : effet Helmholtz-Kohlrausch) : le curseur « clarté du bleu » permet d'ajuster à l'œil.
   Cause simulée : l'aberration chromatique longitudinale de l'œil (modèle de Thibos, Ye, Zhang et Bradley 1992 :
   D(λ) = 1,7312 − 633,46/(λ − 214,10) dioptries ; mise au point sur 555 nm ; diamètre du flou = pupille × |D(λ) − D(555)|).
   Chaque primaire de l'écran (R 615, V 535, B 460 nm) est floutée séparément, puis les trois sont additionnées.
   Non simulé : l'échantillonnage par les cônes (S rares, absents du centre de la fovéa), la lumière diffusée dans l'œil. */
Labo.defineBloc('test-cones',{
  titre:'Test : une boule blanche et son ombre, éclairées en bleu, en vert, en rouge',
  mount(el){
    const L=Labo, C=L.C;
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas style="aspect-ratio:440/320" aria-label="Une boule blanche et son ombre éclairées par une lumière colorée : à gauche l’image de l’écran, à droite la simulation de l’image reçue par la rétine"></canvas></div>'+
      '<div class="lc"><div class="seg" style="flex-wrap:wrap" role="group" aria-label="Couleur de l’éclairage"><button type="button" data-c="0" aria-pressed="true">Bleu</button><button type="button" data-c="1" aria-pressed="false">Vert</button><button type="button" data-c="2" aria-pressed="false">Rouge</button><button type="button" data-c="3" aria-pressed="false">Jaune</button><button type="button" data-c="4" aria-pressed="false">Blanc</button></div>'+
      '<label class="slider"><span>Clarté du bleu</span><input type="range" min="20" max="100" step="2" value="60" data-k="b"><strong></strong></label>'+
      '<label class="slider"><span>Pupille</span><input type="range" min="2" max="7" step="0.5" value="4" data-k="p"><strong></strong></label></div>'+
      '<div class="caption" aria-live="polite"><b></b><span></span></div>'+
      '<div class="infobar"></div><div class="infobox" hidden></div></div>';
    const INFO={
      proto:['Comment faire le test','Mets-toi à environ un mètre de l’écran, dans une pièce peu éclairée, et regarde la boule de gauche : elle est blanche, éclairée par une lumière de la couleur choisie. Derrière elle, une ombre se découpe sur le mur, avec un bord qui s’adoucit tout autour (la pénombre). Choisis « Bleu » : l’ombre se distingue mal du mur, son bord est flou et la boule semble entourée d’une petite aura. Passe à « Vert » puis « Rouge », sans bouger : l’ombre et son bord sont beaucoup plus nets. Les scènes sont identiques et de même luminosité : seule la couleur change.'],
      egal:['Même luminosité : le curseur « clarté du bleu »','Toutes les couleurs sont réglées à la même luminosité calculée (la luminance, qui tient compte de la sensibilité des cônes) : l’ombre ne change donc pas de contraste en passant du bleu au vert. Mais un bleu pur d’écran paraît en pratique plus clair que cela : les couleurs très saturées paraissent plus lumineuses (effet Helmholtz-Kohlrausch), et dans une pièce sombre le bleu gagne encore en clarté apparente. Le curseur « clarté du bleu » baisse le bleu pour qu’il paraisse aussi clair que le vert ou le rouge à ton œil. Règle-le en plissant les yeux. Le résultat du test ne dépend presque pas de ce réglage : si l’ombre est moins nette en bleu, ce n’est pas parce que le bleu est plus sombre.'],
      pourquoi:['Pourquoi le bleu est plus flou','Première cause, la plus forte : l’aberration chromatique de la lentille. Comme une lentille de verre, le cristallin dévie plus le bleu que le rouge. L’œil fait la mise au point sur le vert-jaune (555 nm) : le bleu (460 nm) se focalise un peu devant la rétine, d’environ 0,7 dioptrie. Avec une pupille de 4 mm, cela fait une tache floue d’environ 10 minutes d’arc pour le bleu, contre moins de 2 pour le vert : c’est ce que montre l’image de droite. Deuxième cause : les cônes S, qui captent le bleu, sont rares (5 à 10 %) et absents du centre de la fovéa : même une image bleue parfaitement nette serait échantillonnée grossièrement. Troisième cause : le cerveau fabrique les contours avec les cônes L et M surtout. Ces causes s’additionnent.'],
      aura:['L’aura autour de la boule','Chaque point lumineux bleu est étalé en une tache sur la rétine. Le bord net de la boule devient un dégradé, d’où l’impression d’une petite aura. Et l’ombre, dont le bord est un contraste faible, se mélange avec le mur : la frontière disparaît presque. Avec une grande pupille (en lumière faible), l’étalement est encore plus grand : essaie de la régler à 7 mm. Une petite pupille (en pleine lumière) l’atténue.'],
      simplif:['Ce qui est simplifié','Le flou est calculé avec le modèle d’aberration chromatique de Thibos et coll. (1992) pour un œil moyen, mise au point à 555 nm, sans autres défauts de l’œil (astigmatisme, aberrations d’ordre supérieur). Chaque couleur primaire de l’écran est traitée comme une longueur d’onde unique (R 615, V 535, B 460 nm), alors que ce sont des bandes. Un pixel d’écran vaut environ 1,5 minute d’arc à un mètre. L’image de droite est un calcul, pas une image à regarder : ton propre œil la floute une seconde fois. On ne simule pas l’échantillonnage par les cônes, ni la lumière diffusée dans l’œil. La luminance utilise les coefficients sRGB standard ; ton écran, sa luminosité et la pièce où tu es changent l’apparence.']
    };
    L.infoBar(el.querySelector('.infobar'),el.querySelector('.infobox'),['proto','egal','pourquoi','aura','simplif'],INFO);
    const W=440,H=320,V=L.setup(el.querySelector('canvas'),W,H);
    const PAN=200, SC=1.5;
    let ci=0, bleuK=.6, pup=4, dirty=true;
    const LAMS=[615,535,460];   // R, V, B de l'écran
    const lin=u=>{ u/=255; return u<=.04045?u/12.92:Math.pow((u+.055)/1.055,2.4); }, srgb=v=>Math.round(255*(v<=.0031308?12.92*v:1.055*Math.pow(v,1/2.4)-.055));
    const lum=c=>.2126*lin(c[0])+.7152*lin(c[1])+.0722*lin(c[2]);
    const COL=[[0,0,255],[0,255,0],[255,0,0],[255,255,0],[255,255,255]], NAME=['bleue','verte','rouge','jaune','blanche'];
    const bleuY=lum([0,0,255]);
    const couleur=()=>{ const c=COL[ci], k=Math.min(1,bleuY/Math.max(lum(c),1e-6))*(ci===0?bleuK:1); return c.map(v=>srgb(lin(v)*k)); };
    const D=l=>1.7312-633.46/(l-214.10);
    const ARC=l=>Math.abs(D(l)-D(555))*pup*1e-3*(180/Math.PI)*60;              // minutes d'arc
    const blurPx=l=>ARC(l)/SC;
    const mk=()=>{ const c=document.createElement('canvas'); c.width=PAN; c.height=PAN; return c; };
    const lay=mk(), A=mk(), B=mk(), tiny=document.createElement('canvas');
    const hasF=(()=>{ try{ return 'filter' in document.createElement('canvas').getContext('2d'); }catch(e){ return false; } })();
    /* scène dans un seul canal : mur peu éclairé, ombre portée avec pénombre, boule blanche ombrée */
    function scene(g,k,w){ const v=(i,a)=>{ const q=Math.round(255*Math.max(0,Math.min(1,i*w))); return 'rgba('+(k===0?q:0)+','+(k===1?q:0)+','+(k===2?q:0)+','+(a===undefined?1:a)+')'; };
      g.globalCompositeOperation='source-over'; g.fillStyle='#000'; g.fillRect(0,0,PAN,PAN);
      g.fillStyle=v(.32); g.fillRect(0,0,PAN,PAN);                                  // mur
      // ombre portée : pénombre large, puis ombre plus dense au centre
      const sh=(cx,cy,rx,ry,i)=>{ g.save(); g.translate(cx,cy); g.rotate(-.35); g.scale(1,ry/rx); const gr=g.createRadialGradient(0,0,rx*.8,0,0,rx); gr.addColorStop(0,v(i)); gr.addColorStop(1,v(.32)); g.fillStyle=gr; g.beginPath(); g.arc(0,0,rx,0,7); g.fill(); g.restore(); };
      sh(128,132,82,54,.02);
      const cx=88,cy=90,r=56, gr=g.createRadialGradient(cx-20,cy-22,6,cx,cy,r); gr.addColorStop(0,v(1)); gr.addColorStop(.6,v(.85)); gr.addColorStop(1,v(.4));
      g.fillStyle=gr; g.beginPath(); g.arc(cx,cy,r,0,7); g.fill(); }
    function blurTo(dst,src,f){ if(f<1.2){ dst.drawImage(src,0,0); return; }
      if(hasF){ dst.save(); dst.filter='blur('+(f*.5).toFixed(2)+'px)'; dst.drawImage(src,0,0); dst.restore(); return; }
      const n=Math.max(8,Math.round(PAN/f)); tiny.width=n; tiny.height=n; const tg=tiny.getContext('2d'); tg.imageSmoothingEnabled=true; tg.drawImage(src,0,0,n,n);
      dst.imageSmoothingEnabled=true; dst.drawImage(tiny,0,0,PAN,PAN); }
    function rendre(){ const c=couleur(), wk=c.map(v=>v/255), a=A.getContext('2d'), b=B.getContext('2d'), l0=lay.getContext('2d');
      [a,b].forEach(g=>{ g.globalCompositeOperation='source-over'; g.fillStyle='#000'; g.fillRect(0,0,PAN,PAN); g.globalCompositeOperation='lighter'; });
      for(let k=0;k<3;k++){ if(wk[k]<=0.004) continue; scene(l0,k,wk[k]); a.drawImage(lay,0,0); blurTo(b,lay,blurPx(LAMS[k])); }
      dirty=false; }
    el.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{ ci=+b.dataset.c; el.querySelectorAll('[data-c]').forEach(c=>c.setAttribute('aria-pressed',c===b)); dirty=true; cap(); });
    el.querySelector('[data-k="b"]').addEventListener('input',e=>{ bleuK=+e.target.value/100; dirty=true; cap(); });
    el.querySelector('[data-k="p"]').addEventListener('input',e=>{ pup=+e.target.value; dirty=true; cap(); });
    const fr=(v,d)=>v.toFixed(d).replace('.',',');
    function cap(){ const b=el.querySelector('.caption b'), s=el.querySelector('.caption span'), c=COL[ci], used=[0,1,2].filter(k=>c[k]>0), mx=Math.max(...used.map(k=>ARC(LAMS[k])));
      el.querySelector('[data-k="b"]').parentNode.querySelector('strong').textContent=Math.round(bleuK*100)+' %';
      el.querySelector('[data-k="p"]').parentNode.querySelector('strong').textContent=fr(pup,1)+' mm';
      b.textContent='Lumière '+NAME[ci]+' : l’ombre est '+(mx>6?'mal distinguée du mur':mx>3?'un peu estompée':'bien nette');
      s.textContent='Flou de la rétine pour cette lumière : jusqu’à '+fr(mx,1)+' minutes d’arc (bleu '+fr(ARC(460),1)+'′, vert '+fr(ARC(535),1)+'′, rouge '+fr(ARC(615),1)+'′). Compare en passant d’une couleur à l’autre sans bouger : en bleu, le bord de l’ombre se fond dans le mur.'; }
    cap();
    L.onFrame(()=>{
      const x=V.ctx; V.base(); x.fillStyle='#000'; x.fillRect(0,0,W,H); if(dirty) rendre();
      const X1=10, X2=230, Y=44;
      x.drawImage(A,X1,Y); x.drawImage(B,X2,Y);
      x.strokeStyle='rgba(255,255,255,.18)'; x.strokeRect(X1+.5,Y+.5,PAN-1,PAN-1); x.strokeRect(X2+.5,Y+.5,PAN-1,PAN-1);
      L.txt(x,'SUR L’ÉCRAN',X1,16,'left','#E8EEF4',true); L.txt(x,'boule blanche, lumière '+NAME[ci],X1,31,'left','#93A1B0');
      L.txt(x,'DANS L’ŒIL',X2,16,'left','#E8EEF4',true); L.txt(x,'simulation de l’image sur la rétine',X2,31,'left','#93A1B0');
      L.txt(x,'luminosité de la lumière : '+fr(lum(couleur())*100,1)+' % du blanc de l’écran',X1,Y+PAN+18,'left','#93A1B0');
      L.txt(x,'1 pixel ≈ 1,5 minute d’arc (1′ = un soixantième de degré)',X1,Y+PAN+36,'left','#93A1B0');
      },V.cv);
  }
});
