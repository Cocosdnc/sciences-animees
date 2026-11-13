/* Bloc « pendules-couples » : deux pendules reliés par un ressort, et l'électron partagé entre deux atomes.
   Les deux systèmes obéissent aux mêmes équations (système à deux états) :
   chaque pendule ↔ l'amplitude de l'onde de l'électron sur un atome ; le ressort ↔ le couplage entre les deux.
   Calcul : c(t) = aL·e^(−iωL t)·(1,1)/√2 + aA·e^(−iωA t)·(1,−1)/√2 ; angle de chaque pendule = partie réelle,
   onde de l'électron = Re(c1)·φA + Re(c2)·φB, nuage = |c1·φA + c2·φB|². */
Labo.defineBloc('pendules-couples',{
  titre:'Deux pendules couplés, un électron partagé',
  mount(el){
    const L=Labo, C=L.C, POS='#FF8A80', NEG='#6FB6FF';
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas style="aspect-ratio:400/320" aria-label="Deux pendules reliés par un ressort et, en dessous, l’onde d’un électron partagé entre deux atomes qui suit les mêmes équations"></canvas></div>'+
      '<div class="lc"><div class="seg" role="group" aria-label="Façon de lancer"><button type="button" data-m="L" aria-pressed="true">En phase</button><button type="button" data-m="A" aria-pressed="false">En opposition</button><button type="button" data-m="S" aria-pressed="false">Un seul lancé</button></div></div>'+
      '<div class="caption"><b></b><span></span></div>'+
      '<div class="infobar"></div><div class="infobox" hidden></div></div>';
    const INFO={
      meme:['Pas qu’une image : les mêmes équations','Les équations de deux pendules reliés par un ressort et celles d’un électron partagé entre deux atomes ont la même forme : c’est le « système à deux états » du cours de Feynman (tome 3, chapitres 8 à 10). Chaque pendule correspond à l’onde de l’électron sur un atome. Le ressort correspond au recouvrement des deux ondes, qui permet à l’électron de passer d’un atome à l’autre.'],
      contretemps:['Rouge et bleu : ensemble ou à contretemps','Un pendule n’est ni positif ni négatif : il est tantôt à gauche, tantôt à droite. Ce qui compte, c’est si les deux vont dans le même sens ou en sens opposé. Pour l’électron, rouge et bleu veulent dire exactement ça : les deux moitiés de son onde battent ensemble, ou à contretemps. Ce n’est pas une propriété de l’électron lui-même : c’est la forme de son nuage, électron entre les noyaux ou chassé du milieu.'],
      energie:['Pourquoi l’opposition coûte plus','Pendules : en opposition, le ressort est étiré puis comprimé à chaque balancement. Il stocke de l’énergie en plus et rappelle plus fort : ça oscille plus vite. Électron : l’onde qui change de signe au milieu ondule davantage et évite la zone où les deux noyaux l’attirent. Pour une onde quantique, énergie et fréquence vont ensemble (E = h × f) : plus rapide veut dire plus d’énergie.'],
      seul:['Un électron qui passe d’un atome à l’autre','Lance un seul pendule : son mouvement passe peu à peu à l’autre, puis revient. Ce mouvement est la somme des deux façons de balancer, qui se décalent peu à peu. Un électron posé sur un seul atome fait pareil : il passe sur l’autre atome et revient. Plus les deux énergies (liante et antiliante) sont écartées, plus ce va-et-vient est rapide : dans une molécule, environ un million de milliards de fois par seconde.'],
      nuage:['Pourquoi le nuage ne bouge pas','En phase ou en opposition, l’onde de l’électron oscille, mais son carré, le nuage, reste immobile : c’est un état stable. C’est pour ça qu’on peut dessiner une orbitale avec une forme fixe. Le nuage ne bouge que dans le cas « un seul lancé », qui mélange les deux états.'],
      limites:['Où l’image s’arrête','Un pendule a une position à chaque instant ; l’électron n’en a pas. Ce qui oscille, c’est son onde de probabilité, et ce qu’on mesure, c’est son carré : le nuage. Les pendules sont très ralentis et l’écart entre leurs deux fréquences est choisi pour qu’on le voie à l’œil.']
    };
    L.infoBar(el.querySelector('.infobar'),el.querySelector('.infobox'),['meme','contretemps','energie','seul','nuage','limites'],INFO);
    const V=L.setup(el.querySelector('canvas'),400,320), b=el.querySelector('.caption b'), s=el.querySelector('.caption span');
    const FL=.55, FA=.72, WL=2*Math.PI*FL, WA=2*Math.PI*FA, R2=Math.SQRT1_2;
    let m='L', aL=1, aA=0, t=0;
    const TXT={
      L:['En phase : la façon la plus calme',
         'Les deux pendules balancent ensemble : le ressort ne travaille presque pas, c’est le balancement le plus lent, le moins coûteux en énergie. En dessous, l’électron fait pareil : les deux moitiés de son onde battent ensemble. Au milieu, elles s’additionnent : le nuage s’accumule entre les noyaux, là où les deux l’attirent. C’est l’orbitale liante.'],
      A:['En opposition : la façon la plus agitée',
         'Les pendules balancent l’un contre l’autre : le ressort est étiré et comprimé sans arrêt, ça oscille plus vite, avec plus d’énergie. L’électron fait pareil : les deux moitiés de son onde battent à contretemps. Au milieu, elles s’annulent toujours : un nœud, et le nuage est chassé vers l’extérieur. C’est l’orbitale antiliante.'],
      S:['Un seul lancé : le mouvement passe de l’un à l’autre',
         'Le pendule de gauche donne peu à peu son mouvement à celui de droite, puis le récupère : ce sont des battements, le mélange des deux façons de balancer. Pour l’électron, c’est un électron posé sur un seul atome : son nuage passe sur l’autre atome, puis revient.']
    };
    const cap=()=>{ b.textContent=TXT[m][0]; s.textContent=TXT[m][1]; };
    el.querySelectorAll('[data-m]').forEach(bt=>bt.onclick=()=>{ m=bt.dataset.m; t=0; aL=m==='A'?0:(m==='L'?1:R2); aA=m==='L'?0:(m==='A'?1:R2);
      el.querySelectorAll('[data-m]').forEach(c=>c.setAttribute('aria-pressed',c===bt)); cap(); });
    cap();
    const XA=140, XB=260, PY=26, LEN=112, TH=.32, YW=232, AMPW=38, SIG=30;
    const phi=(x,x0)=>Math.exp(-Math.abs(x-x0)/SIG);
    function spring(x,x1,y1,x2,y2){ const n=10, dx=(x2-x1)/n, dy=(y2-y1)/n, len=Math.hypot(x2-x1,y2-y1), nx=-(y2-y1)/len*5, ny=(x2-x1)/len*5;
      x.beginPath(); x.moveTo(x1,y1); for(let i=1;i<n;i++){ const sgn=i%2?1:-1; x.lineTo(x1+dx*i+nx*sgn,y1+dy*i+ny*sgn); } x.lineTo(x2,y2); x.strokeStyle=C.gold; x.lineWidth=1.6; x.stroke(); }
    L.onFrame(dt=>{ t+=dt;
      /* amplitudes complexes sur chaque atome */
      const cLr=aL*Math.cos(WL*t), cLi=-aL*Math.sin(WL*t), cAr=aA*Math.cos(WA*t), cAi=-aA*Math.sin(WA*t);
      const c1r=R2*(cLr+cAr), c1i=R2*(cLi+cAi), c2r=R2*(cLr-cAr), c2i=R2*(cLi-cAi);
      const x=V.ctx; V.base(); L.bgLab(x,400,320);
      /* --- pendules --- */
      L.line(x,XA-60,PY,XB+60,PY,'#8A96A3',4);
      const bob=(px,th)=>[px+LEN*Math.sin(th*TH),PY+LEN*Math.cos(th*TH)];
      const [x1,y1]=bob(XA,c1r), [x2,y2]=bob(XB,c2r), f=.55;
      spring(x,XA+(x1-XA)*f,PY+(y1-PY)*f,XB+(x2-XB)*f,PY+(y2-PY)*f);
      [[XA,x1,y1,c1r],[XB,x2,y2,c2r]].forEach(([px,bx,by,v])=>{ L.line(x,px,PY,bx,by,C.ink,1.6); const col=Math.abs(v)<.08?'#C9D1D9':(v>0?POS:NEG); L.glow(x,bx,by,18,col,.3); L.sph(x,bx,by,10,col); });
      L.tag(x,'pendule A',XA-62,PY+16,'left',C.muted); L.tag(x,'pendule B',XB+62,PY+16,'right',C.muted);
      L.txt(x,'ressort',W2(x1,x2),PY+(y1-PY)*f-10,'center',C.gold);
      const freq=m==='L'?FL:(m==='A'?FA:null);
      L.txt(x,freq?('fréquence : '+freq.toFixed(2).replace('.',',')+' Hz'+(m==='A'?' (plus rapide)':' (plus lent)')):'battements : '+(FA-FL).toFixed(2).replace('.',',')+' Hz',200,PY+LEN+30,'center',C.ink);
      L.line(x,12,172,388,172,'rgba(232,238,244,.12)',1,[3,4]);
      L.txt(x,'mêmes équations ↓',200,180,'center',C.muted);
      /* --- électron --- */
      L.txt(x,'L’onde de l’électron partagé entre deux atomes',10,196,'left',C.ink,true);
      /* nuage : carré de l'onde (couleur rose), en bande */
      for(let X=14;X<=386;X+=2){ const pa=phi(X,XA), pb=phi(X,XB), re=c1r*pa+c2r*pb, im=c1i*pa+c2i*pb, d=re*re+im*im;
        x.fillStyle='rgba(255,140,128,'+Math.min(.85,d*.9).toFixed(3)+')'; x.fillRect(X-1,YW+50,2,16); }
      L.txt(x,'nuage = carré de l’onde',386,YW+80,'right',C.muted);
      /* onde (valeur réelle à cet instant), colorée selon le signe */
      L.line(x,14,YW,386,YW,'rgba(232,238,244,.25)',1);
      let prev=null;
      for(let X=14;X<=386;X+=2){ const v=c1r*phi(X,XA)+c2r*phi(X,XB), Y=YW-v*AMPW;
        if(prev){ x.beginPath(); x.moveTo(prev[0],prev[1]); x.lineTo(X,Y); x.strokeStyle=v>=0?POS:NEG; x.lineWidth=2.6; x.stroke(); } prev=[X,Y]; }
      [XA,XB].forEach(X=>{ L.glow(x,X,YW,8,'#FFFFFF',.5); L.sph(x,X,YW,2.6,'#F2F6FA'); });
      L.txt(x,'noyau A',XA,YW+30,'center',C.muted); L.txt(x,'noyau B',XB,YW+30,'center',C.muted);
      if(m==='A'){ L.line(x,200,YW-40,200,YW+40,'rgba(111,182,255,.5)',1,[2,3]); L.tag(x,'nœud',206,YW-24,'left',NEG); }
      if(m==='L') L.tag(x,'renforcé au milieu',200,YW+40,'center',POS);
      L.vignette(x,400,320);
    },el);
    function W2(a,c){ return (a+c)/2; }
  }
});
