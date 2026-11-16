/* Bloc « lumiere-blanche » : la lumière blanche est la somme de toutes les couleurs, chacune étant une onde de longueur d'onde différente.
   On additionne vraiment les ondes (le trait blanc est la somme calculée des ondes colorées). */
Labo.defineBloc('lumiere-blanche',{
  titre:'La lumière blanche contient toutes les couleurs',
  mount(el){
    const L=Labo, C=L.C, D=window.Diff;
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas style="aspect-ratio:400/260" aria-label="Des ondes de couleurs différentes qui, additionnées, donnent une onde blanche ; une barre montre le spectre des longueurs d’onde"></canvas></div>'+
      '<div class="lc"><button type="button" data-a="sep" aria-pressed="false">Séparer les couleurs</button></div>'+
      '<div class="caption" aria-live="polite"><b></b><span></span></div>'+
      '<div class="infobar"></div><div class="infobox" hidden></div></div>';
    const INFO={
      lambda:['La longueur d’onde, c’est la couleur','Une lumière est une onde qui se répète dans l’espace. La longueur d’onde λ est la distance entre deux crêtes : environ 400 nm pour le violet, 550 nm pour le vert, 700 nm pour le rouge (1 nm = un millionième de millimètre). C’est elle, et elle seule, qui fait la couleur d’une lumière pure. La suite de la page repose sur ce fait.'],
      blanc:['Pourquoi le Soleil paraît blanc','Le Soleil émet toutes les longueurs d’onde du visible, à des intensités voisines (on verra qu’elles ne sont pas parfaitement égales). Notre œil, qui a trois types de capteurs, les reçoit toutes en même temps et l’interprète comme du blanc. Un prisme ou une goutte de pluie sépare les couleurs, car chaque longueur d’onde est déviée différemment : c’est l’arc-en-ciel.'],
      somme:['Ce que montre le trait blanc','Chaque onde colorée est dessinée avec sa vraie forme sinusoïdale. Le trait blanc est leur somme, calculée point par point. Quand les couleurs sont superposées, la somme est une onde compliquée qui ne se répète pas : c’est l’aspect d’une lumière blanche, faite de trains d’ondes courts.'],
      simplif:['Ce qui est simplifié','Les longueurs d’onde sont dessinées avec des distances arbitraires : à l’échelle de la page, une longueur d’onde de 550 nm mesurerait moins d’un millième de millimètre. Seul le rapport entre les couleurs est respecté (700 nm est 1,75 fois plus long que 400 nm). Le rythme de l’animation est ralenti environ 10¹³ fois : en vrai, la lumière visible oscille 5·10¹⁴ fois par seconde. Sept couleurs suffisent ici pour le dessin ; le spectre réel est continu.']
    };
    L.infoBar(el.querySelector('.infobar'),el.querySelector('.infobox'),['lambda','blanc','somme','simplif'],INFO);
    const W=400,H=260,V=L.setup(el.querySelector('canvas'),W,H);
    const LAM=[410,450,490,530,570,610,660], COL=LAM.map(l=>D.rgbStr(D.pure(l)));
    let sep=0,target=0,t=0; const btn=el.querySelector('[data-a="sep"]');
    btn.onclick=()=>{ target=target?0:1; btn.setAttribute('aria-pressed',!!target); btn.textContent=target?'Remélanger les couleurs':'Séparer les couleurs'; cap(); };
    function cap(){ const b=el.querySelector('.caption b'), s=el.querySelector('.caption span');
      if(target){ b.textContent='Chaque couleur est une onde de longueur d’onde différente'; s.textContent='Le violet a la longueur d’onde la plus courte (environ 400 nm), le rouge la plus longue (environ 700 nm). Toutes avancent à la même vitesse, mais elles ne se répètent pas à la même distance.'; }
      else { b.textContent='Lumière blanche : toutes les ondes ensemble'; s.textContent='La lumière du Soleil est la somme d’ondes de toutes les longueurs d’onde du visible. Le trait blanc est leur somme.'; } }
    cap();
    L.onFrame(dt=>{
      if(!L.reduce) t+=dt; sep+=(target-sep)*Math.min(1,dt*5);
      const x=V.ctx; V.base(); L.bgLab(x,W,H);
      const X0=14,X1=W-14,cy0=112, ys=LAM.map((_,i)=>cy0+(i-3)*sep*26-0), A=L.lerp(9,10,sep)*(1-.35*sep);
      const pxl=l=>l*.26, sum=new Array(X1-X0+1).fill(0);
      LAM.forEach((l,i)=>{ x.beginPath();
        for(let k=0;k<=X1-X0;k++){ const X=X0+k, y=Math.sin(2*Math.PI*(k/pxl(l)-t*.5*(550/l)*.9)); sum[k]+=y; const Y=ys[i]+y*A*(1-.55*(1-sep)); k?x.lineTo(X,Y):x.moveTo(X,Y); }
        x.strokeStyle=COL[i]; x.globalAlpha=.25+.75*sep; x.lineWidth=1.5; x.stroke(); x.globalAlpha=1;
        if(sep>.5) L.tag(x,LAM[i]+' nm',X1,ys[i]-10,'right',COL[i]); });
      if(sep<.97){ x.beginPath(); for(let k=0;k<=X1-X0;k++){ const Y=cy0+sum[k]*2.3*(1-sep*.5); k?x.lineTo(X0+k,Y):x.moveTo(X0+k,Y); }
        x.strokeStyle='rgba(255,255,255,'+(1-sep)+')'; x.lineWidth=2.4; x.stroke(); if(sep<.3) L.tag(x,'somme de toutes les ondes = lumière blanche',X0,22,'left','#FFFFFF'); }
      // barre de spectre
      const by=216,bh=16,bx0=24,bx1=W-24; for(let l=380;l<=750;l+=2){ const px=bx0+(l-380)/370*(bx1-bx0); x.fillStyle=D.rgbStr(D.pure(l)); x.fillRect(px,by,(bx1-bx0)/370*2+.6,bh); }
      [400,500,600,700].forEach(l=>{ const px=bx0+(l-380)/370*(bx1-bx0); L.line(x,px,by+bh,px,by+bh+4,C.muted,1); L.txt(x,l+' nm',px,by+bh+13,'center'); });
      L.txt(x,'longueur d’onde →',bx1,by-8,'right',C.muted);
      L.vignette(x,W,H); },V.cv);
  }
});
