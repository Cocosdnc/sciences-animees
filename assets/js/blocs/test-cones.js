/* Bloc « test-cones » : on voit moins bien les détails en bleu qu'en vert ou en rouge.
   Quatre zones de fines rayures (bleu, vert, rouge, violet) sur fond noir, à luminosité égale. Finesse réglée à 2 px au départ :
   on s'éloigne de l'écran et on note la zone dont les rayures se fondent en premier.
   Luminosité : le calcul de luminance (0,2126 R + 0,7152 G + 0,0722 B, valeurs linéaires) égalise le flux « utile » à l'œil, mais le bleu pur
   paraît quand même plus clair que cela (les couleurs très saturées paraissent plus lumineuses : effet Helmholtz-Kohlrausch). Le curseur
   « clarté du bleu » permet donc d'ajuster à l'œil jusqu'à ce que les quatre zones paraissent aussi claires.
   Dessous : simulation de l'image reçue par la rétine. Cause simulée : l'aberration chromatique longitudinale de l'œil (modèle de Thibos, Ye, Zhang et Bradley 1992 :
   D(λ) = 1,7312 − 633,46/(λ − 214,10) dioptries ; mise au point sur 555 nm ; diamètre du flou = pupille × |D(λ) − D(555)|).
   Chaque primaire de l'écran (R 615, V 535, B 460 nm) est floutée séparément, puis les trois sont additionnées.
   Non simulé : l'échantillonnage par les cônes (S rares, absents du centre de la fovéa), la lumière diffusée dans l'œil. */
Labo.defineBloc('test-cones',{
  titre:'Test des rayures : quelle couleur perd ses rayures en premier ?',
  mount(el){
    const L=Labo, C=L.C;
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas style="aspect-ratio:440/352" aria-label="Quatre zones de rayures fines, bleue, verte, rouge et violette, sur fond noir, et dessous la simulation de l’image reçue par la rétine"></canvas></div>'+
      '<div class="lc"><label class="slider"><span>Finesse des rayures</span><input type="range" min="1" max="8" step="1" value="2" data-k="s"><strong></strong></label>'+
      '<label class="slider"><span>Clarté du bleu</span><input type="range" min="20" max="100" step="2" value="60" data-k="b"><strong></strong></label>'+
      '<label class="slider"><span>Pupille</span><input type="range" min="2" max="7" step="0.5" value="4" data-k="p"><strong></strong></label></div>'+
      '<div class="caption" aria-live="polite"><b></b><span></span></div>'+
      '<div class="infobar"></div><div class="infobox" hidden></div></div>';
    const INFO={
      proto:['Comment faire le test','Garde la finesse à 2 pixels. Assieds-toi à environ un demi-mètre de l’écran, dans une pièce peu éclairée : tu vois les rayures des quatre zones. Puis éloigne-toi lentement (ou fais reculer ton fauteuil) : à un moment, une des zones devient une surface unie. Laquelle perd ses rayures en premier ? Normalement, c’est le bleu, puis le violet, alors que les rayures vertes et rouges restent visibles plus loin. Tu peux aussi, sans bouger, affiner les rayures avec le curseur. Les quatre zones ont la même taille et la même forme : seule la couleur change.'],
      egal:['Même luminosité : le curseur « clarté du bleu »','Les quatre zones ont la même luminosité calculée (la luminance, qui tient compte de la sensibilité des cônes). Mais un bleu pur d’écran paraît en pratique plus clair que cela : les couleurs très saturées paraissent plus lumineuses (effet Helmholtz-Kohlrausch), et dans une pièce sombre le bleu gagne encore en clarté apparente. Le curseur « clarté du bleu » baisse le bleu pour que les quatre zones paraissent aussi claires à ton œil. Règle-le en plissant les yeux : quand les quatre zones te semblent aussi claires, c’est la bonne valeur. Le résultat du test, lui, ne dépend presque pas de ce réglage : si le bleu perd ses rayures en premier, ce n’est pas parce qu’il est plus sombre.'],
      pourquoi:['Pourquoi le bleu est plus flou','Première cause, la plus forte : l’aberration chromatique de la lentille. Comme une lentille de verre, le cristallin dévie plus le bleu que le rouge. L’œil fait la mise au point sur le vert-jaune (555 nm) : le bleu (460 nm) se focalise un peu devant la rétine, d’environ 0,7 dioptrie. Avec une pupille de 4 mm, cela fait une tache floue d’environ 10 minutes d’arc pour le bleu, contre moins de 2 pour le vert : c’est ce que montre la ligne du bas. Deuxième cause : les cônes S, qui captent le bleu, sont rares (5 à 10 %) et absents du centre de la fovéa : même une image bleue parfaitement nette serait échantillonnée grossièrement. Troisième cause : le cerveau fabrique les contours avec les cônes L et M surtout. Ces causes s’additionnent.'],
      violet:['Et le violet ?','Le violet de l’écran (R 176, V 0, B 255) est un mélange de rouge et de bleu : sa partie bleue est floue, sa partie rouge est plus nette. Les rayures violettes tiennent donc un peu plus longtemps que les bleues, mais moins que les vertes. Sur la simulation, le violet montre des franges de couleur : la composante bleue et la composante rouge ne sont pas floutées de la même façon.'],
      simplif:['Ce qui est simplifié','Le flou est calculé avec le modèle d’aberration chromatique de Thibos et coll. (1992) pour un œil moyen, mise au point à 555 nm, sans autres défauts de l’œil (astigmatisme, aberrations d’ordre supérieur). Chaque couleur primaire de l’écran est traitée comme une longueur d’onde unique (R 615, V 535, B 460 nm), alors que ce sont des bandes. Un pixel d’écran vaut environ 1,5 minute d’arc à un mètre : un pixel de rayure vaut 1,5′ à un mètre, 3′ à 50 cm. La simulation est un calcul, pas une image à regarder : ton propre œil la floute une seconde fois. On ne simule pas l’échantillonnage par les cônes, ni la lumière diffusée dans l’œil. La luminance utilise les coefficients sRGB standard ; ton écran, sa luminosité et la pièce où tu es changent l’apparence.']
    };
    L.infoBar(el.querySelector('.infobar'),el.querySelector('.infobox'),['proto','egal','pourquoi','violet','simplif'],INFO);
    const W=440,H=352,V=L.setup(el.querySelector('canvas'),W,H);
    const PW=98, GAP=12, SC=1.5;
    let det=2, bleuK=.6, pup=4, dirty=true;
    const LAMS=[615,535,460];   // R, V, B de l'écran
    const lin=u=>{ u/=255; return u<=.04045?u/12.92:Math.pow((u+.055)/1.055,2.4); }, srgb=v=>Math.round(255*(v<=.0031308?12.92*v:1.055*Math.pow(v,1/2.4)-.055));
    const lum=c=>.2126*lin(c[0])+.7152*lin(c[1])+.0722*lin(c[2]);
    const BASE=[[0,0,255],[0,255,0],[255,0,0],[176,0,255]], NAME=['bleu','vert','rouge','violet'];
    const bleuY=lum([0,0,255]);
    const couleurs=()=>BASE.map((c,i)=>{ const k=Math.min(1,bleuY/Math.max(lum(c),1e-6))*(i===0?bleuK:1); return c.map(v=>srgb(lin(v)*k)); });
    const D=l=>1.7312-633.46/(l-214.10);
    const ARC=l=>Math.abs(D(l)-D(555))*pup*1e-3*(180/Math.PI)*60;              // minutes d'arc
    const blurPx=l=>ARC(l)/SC;
    const mk=()=>{ const c=document.createElement('canvas'); c.width=PW; c.height=PW; return c; };
    const lay=mk(), tiny=document.createElement('canvas');
    const hasF=(()=>{ try{ return 'filter' in document.createElement('canvas').getContext('2d'); }catch(e){ return false; } })();
    const rows=[0,1,2,3].map(()=>({A:mk(),B:mk()}));
    function rayures(g,k,w){ const q=Math.round(255*w), col='rgb('+(k===0?q:0)+','+(k===1?q:0)+','+(k===2?q:0)+')';
      g.globalCompositeOperation='source-over'; g.fillStyle='#000'; g.fillRect(0,0,PW,PW); g.fillStyle=col; for(let X=0;X<PW;X+=2*det) g.fillRect(X,0,det,PW); }
    function blurTo(dst,src,f){ if(f<1.2){ dst.drawImage(src,0,0); return; }
      if(hasF){ dst.save(); dst.filter='blur('+(f*.5).toFixed(2)+'px)'; dst.drawImage(src,0,0); dst.restore(); return; }
      const n=Math.max(6,Math.round(PW/f)); tiny.width=n; tiny.height=n; const tg=tiny.getContext('2d'); tg.imageSmoothingEnabled=true; tg.drawImage(src,0,0,n,n);
      dst.imageSmoothingEnabled=true; dst.drawImage(tiny,0,0,PW,PW); }
    function rendre(){ const P=couleurs(), l0=lay.getContext('2d');
      P.forEach((c,i)=>{ const a=rows[i].A.getContext('2d'), b=rows[i].B.getContext('2d');
        [a,b].forEach(g=>{ g.globalCompositeOperation='source-over'; g.fillStyle='#000'; g.fillRect(0,0,PW,PW); g.globalCompositeOperation='lighter'; });
        for(let k=0;k<3;k++){ if(c[k]<=1) continue; rayures(l0,k,c[k]/255); a.drawImage(lay,0,0); blurTo(b,lay,blurPx(LAMS[k])); } });
      dirty=false; }
    el.querySelector('[data-k="s"]').addEventListener('input',e=>{ det=+e.target.value; dirty=true; cap(); });
    el.querySelector('[data-k="b"]').addEventListener('input',e=>{ bleuK=+e.target.value/100; dirty=true; cap(); });
    el.querySelector('[data-k="p"]').addEventListener('input',e=>{ pup=+e.target.value; dirty=true; cap(); });
    const fr=(v,d)=>v.toFixed(d).replace('.',',');
    function cap(){ const b=el.querySelector('.caption b'), s=el.querySelector('.caption span');
      el.querySelector('[data-k="s"]').parentNode.querySelector('strong').textContent=det+' px';
      el.querySelector('[data-k="b"]').parentNode.querySelector('strong').textContent=Math.round(bleuK*100)+' %';
      el.querySelector('[data-k="p"]').parentNode.querySelector('strong').textContent=fr(pup,1)+' mm';
      b.textContent='Éloigne-toi : quelle zone perd ses rayures en premier ?';
      s.textContent='Rayures de '+det+' px, soit '+fr(det*SC,1)+'′ par bande à 1 m, '+fr(det*SC*2,1)+'′ par période. Flou de la rétine : bleu '+fr(ARC(460),1)+'′ · vert '+fr(ARC(535),1)+'′ · rouge '+fr(ARC(615),1)+'′. Le bleu est le premier à devenir uni : son flou est plus grand que la largeur de ses bandes dès que tu t’éloignes un peu.'; }
    cap();
    L.onFrame(()=>{
      const x=V.ctx; V.base(); x.fillStyle='#000'; x.fillRect(0,0,W,H); if(dirty) rendre();
      const P=couleurs(), X0=(W-(4*PW+3*GAP))/2, Y1=34, Y2=214;
      L.txt(x,'SUR L’ÉCRAN',X0,14,'left','#E8EEF4',true); L.txt(x,'DANS L’ŒIL (simulation de la rétine)',X0,Y2-26,'left','#E8EEF4',true);
      rows.forEach((r,i)=>{ const X=X0+i*(PW+GAP); x.drawImage(r.A,X,Y1); x.drawImage(r.B,X,Y2);
        x.strokeStyle='rgba(255,255,255,.16)'; x.strokeRect(X+.5,Y1+.5,PW-1,PW-1); x.strokeRect(X+.5,Y2+.5,PW-1,PW-1);
        L.txt(x,NAME[i],X+PW/2,Y1+PW+14,'center','#E8EEF4',true);
        L.txt(x,'luminosité '+fr(lum(P[i])*100,1)+' %',X+PW/2,Y2+PW+14,'center','#93A1B0'); });
      },V.cv);
  }
});
