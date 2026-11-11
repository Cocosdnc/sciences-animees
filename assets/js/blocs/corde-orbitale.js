/* Bloc « corde-orbitale » : ce qu'est une orbitale, en montant d'une dimension à la fois.
   1D : corde attachée aux deux bouts · 2D : membrane de tambour · 3D : onde de l'électron autour du noyau.
   Mêmes ondes stationnaires dans les trois cas : 0 nœud, puis 1 nœud de deux sortes (rond ou droit).
   Formes calculées : sin(nπx) pour la corde, fonctions de Bessel pour la membrane, orbitales de l'hydrogène en 3D. */
Labo.defineBloc('corde-orbitale',{
  titre:'De la corde à l’orbitale',
  mount(el){
    const L=Labo, C=L.C, POS='#FF8A80', NEG='#6FB6FF';
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas aria-label="Onde stationnaire sur une corde, sur une membrane ou autour d’un noyau, avec ses nœuds"></canvas></div>'+
      '<div class="lc"><div class="seg" role="group" aria-label="Dimension" data-g="dim"><button type="button" data-v="1" aria-pressed="true">1D · corde</button><button type="button" data-v="2" aria-pressed="false">2D · membrane</button><button type="button" data-v="3" aria-pressed="false">3D · autour du noyau</button></div>'+
      '<div class="seg" role="group" aria-label="Forme de l’onde" data-g="mode"><button type="button" data-v="0" aria-pressed="true"></button><button type="button" data-v="1" aria-pressed="false"></button><button type="button" data-v="2" aria-pressed="false"></button></div></div>'+
      '<div class="caption"><b></b><span></span></div>'+
      '<div class="infobar"></div><div class="infobox" hidden></div></div>';
    const INFO={
      orbitale:['Une orbitale, c’est quoi ?','La forme de l’onde stationnaire de l’électron autour du noyau. Comme une corde ou une peau de tambour, cette onde enfermée ne peut prendre que certaines formes. Chaque forme possible s’appelle une orbitale : 1s, 2s, 2p…'],
      noeud:['Les nœuds','Les endroits où l’onde vaut toujours zéro. Sur une corde, ce sont des points ; sur une membrane, des lignes ou des cercles ; autour du noyau, des sphères ou des plans. Là, l’électron n’est jamais.'],
      couleur:['Rouge et bleu','Le signe de l’onde : rouge quand elle est d’un côté de zéro, bleu de l’autre. Sur la corde et la membrane, c’est le haut et le bas. Un nœud sépare toujours une zone rouge d’une zone bleue.'],
      nuage:['Pourquoi un nuage en 3D ?','L’onde de l’électron n’est pas une matière qui bouge. Sa valeur en un point, mise au carré, donne la probabilité de trouver l’électron à cet endroit. On dessine donc des points là où il a des chances d’être : plus c’est dense, plus il y est souvent.'],
      energie:['Plus de nœuds, plus d’énergie','Une onde avec plus de nœuds est plus « serrée » : elle vibre plus vite sur la corde et la membrane, et elle a plus d’énergie autour du noyau. C’est ce qui range les orbitales en couches : 0 nœud = couche 1, 1 nœud = couche 2.'],
      nom:['Les noms 1s, 2s, 2p','Le chiffre donne la couche (le nombre de nœuds + 1). La lettre donne la forme : s = ronde, sans nœud plan ; p = un nœud plan, deux lobes ; d = deux nœuds plans, quatre lobes.'],
      limite:['Ce qui est comparable, ce qui ne l’est pas','La corde, la membrane et l’électron obéissent à des équations de la même famille (ondes stationnaires) : les formes et les nœuds se correspondent vraiment. Mais la corde déplace de la matière, alors que l’onde de l’électron est une amplitude de probabilité. Et l’électron n’est pas attaché sur un bord : c’est l’attraction du noyau qui l’enferme.']
    };
    L.infoBar(el.querySelector('.infobar'),el.querySelector('.infobox'),['orbitale','noeud','couleur','nuage','energie','nom','limite'],INFO);
    const V=L.setup(el.querySelector('canvas'),400,270);
    const LAB={1:['Aucun nœud','1 nœud','2 nœuds'],2:['Aucun nœud','1 nœud en cercle','1 nœud en ligne'],3:['1s · aucun nœud','2s · nœud en sphère','2p · nœud en plan']};
    const TXT={
      '1-0':['Corde : la forme la plus simple','La corde est attachée aux deux bouts. Elle monte (rouge) puis descend (bleu) d’un seul tenant : aucun point immobile entre les bouts. C’est la vibration la plus lente.'],
      '1-1':['Corde : un nœud au milieu','Une moitié monte pendant que l’autre descend. Au milieu, un point ne bouge jamais : un nœud. Cette forme vibre deux fois plus vite.'],
      '1-2':['Corde : deux nœuds','Trois parties alternent rouge et bleu. Chaque nœud de plus rend l’onde plus serrée et plus rapide. Il n’existe pas de forme entre deux : c’est un, deux, trois ventres, jamais deux et demi.'],
      '2-0':['Membrane : aucun nœud','Une peau de tambour attachée sur un cercle. Toute la surface monte puis descend ensemble. C’est la note la plus grave.'],
      '2-1':['Membrane : un nœud en cercle','Le centre monte pendant que l’anneau extérieur descend. Entre les deux, un cercle ne bouge jamais. En 2D, un nœud n’est plus un point : c’est une ligne, ici fermée en cercle.'],
      '2-2':['Membrane : un nœud en ligne droite','Une moitié monte, l’autre descend, séparées par un diamètre immobile. Ce nœud droit peut être tourné dans n’importe quelle direction : il y a donc plusieurs façons d’avoir « un nœud en ligne ».'],
      '3-0':['Orbitale 1s : aucun nœud','Même idée en 3D, autour du noyau. L’onde de l’électron est d’un seul signe partout : une boule, dense au centre. On dessine le carré de l’onde : là où il y a beaucoup de points, l’électron est souvent. C’est la forme d’énergie la plus basse : la couche 1.'],
      '3-1':['Orbitale 2s : un nœud en forme de sphère','Le cercle de la membrane devient une sphère : une boule intérieure rouge, une coquille vide (le nœud), puis une couronne bleue. L’électron n’est jamais sur cette sphère. Un nœud de plus : couche 2, énergie plus haute.'],
      '3-2':['Orbitale 2p : un nœud en forme de plan','Le diamètre de la membrane devient un plan qui coupe l’atome en deux : un lobe rouge d’un côté, un lobe bleu de l’autre, et rien sur le plan. Ce plan peut être orienté de trois façons (x, y, z) : il y a donc trois orbitales 2p. Avec la 2s, ça fait les 4 cases de la couche 2.']
    };
    let dim=1, mode=0, t=0, yaw=.6;
    const segD=el.querySelector('[data-g="dim"]'), segM=el.querySelector('[data-g="mode"]');
    function upd(){ segD.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.v===dim));
      segM.querySelectorAll('button').forEach((b,i)=>{ b.textContent=LAB[dim][i]; b.setAttribute('aria-pressed',i===mode); });
      const T=TXT[dim+'-'+mode]; el.querySelector('.caption b').textContent=T[0]; el.querySelector('.caption span').textContent=T[1]; }
    segD.querySelectorAll('button').forEach(b=>b.onclick=()=>{ dim=+b.dataset.v; upd(); });
    segM.querySelectorAll('button').forEach(b=>b.onclick=()=>{ mode=+b.dataset.v; upd(); });
    upd();
    /* fonctions de Bessel (série, suffisante jusqu'à x ≈ 8) */
    function J(m,x){ let s=0, f=1; for(let k=0;k<18;k++){ let d=1; for(let i=1;i<=k;i++) d*=i; let e=1; for(let i=1;i<=k+m;i++) e*=i; s+=(k%2?-1:1)*Math.pow(x/2,2*k+m)/(d*e); } return s; }
    const MEM=[{f:(r,a)=>J(0,2.4048*r),w:2.405},{f:(r,a)=>J(0,5.5201*r),w:5.520},{f:(r,a)=>J(1,3.8317*r)*Math.cos(a)/.582,w:3.832}];
    /* nuages 3D : orbitales de l'hydrogène */
    const ORB=[{f:(x,y,z,r)=>Math.exp(-r),L:5},{f:(x,y,z,r)=>(2-r)*Math.exp(-r/2),L:13},{f:(x,y,z,r)=>z*Math.exp(-r/2),L:13}];
    const PTS=ORB.map(o=>{ const f=(x,y,z)=>o.f(x,y,z,Math.sqrt(x*x+y*y+z*z)+1e-6); let mx=0;
      for(let i=0;i<30000;i++){ const x=(Math.random()*2-1)*o.L,y=(Math.random()*2-1)*o.L,z=(Math.random()*2-1)*o.L, v=f(x,y,z); mx=Math.max(mx,v*v); }
      mx*=1.3; const out=[]; let n=0; while(out.length<2400&&n<1200000){ n++; const x=(Math.random()*2-1)*o.L,y=(Math.random()*2-1)*o.L,z=(Math.random()*2-1)*o.L, v=f(x,y,z); if(Math.random()*mx<v*v) out.push([x/o.L,y/o.L,z/o.L,v>0]); } return out; });
    const sgn=v=>v>=0?POS:NEG;
    L.onFrame(dt=>{ t+=dt; const x=V.ctx; V.base(); L.bgLab(x,400,270);
      if(dim===1){ const n=mode+1, X0=40, X1=360, Y=135, w=2*Math.PI*.55*n, A=70*Math.cos(w*t);
        [X0,X1].forEach(px=>{ x.fillStyle=L.lg(x,px-6,0,px+6,0,[[0,'#5E6873'],[.5,'#D3DAE0'],[1,'#5E6873']]); x.fillRect(px-5,Y-60,10,120); });
        L.line(x,X0,Y,X1,Y,'rgba(232,238,244,.15)',1,[3,4]);
        let prev=null; for(let i=0;i<=240;i++){ const u=i/240, v=Math.sin(n*Math.PI*u)*A, X=X0+u*(X1-X0), Yv=Y-v; if(prev){ L.line(x,prev[0],prev[1],X,Yv,sgn(prev[2]+v),3); } prev=[X,Yv,v]; }
        for(let k=1;k<n;k++){ const X=X0+k/n*(X1-X0); L.glow(x,X,Y,12,'#FFFFFF',.4); L.sph(x,X,Y,4,'#E8EEF4'); L.tag(x,'nœud',X,Y+22,'center'); }
        L.tag(x,'Corde attachée aux deux bouts',8,18,'left'); L.tag(x,n===1?'la vibration la plus lente':'vibre '+n+' fois plus vite que la plus simple',392,252,'right',C.muted); }
      else if(dim===2){ const M=MEM[mode], w=2*Math.PI*.22*M.w, ph=Math.cos(w*t), cx=200, cy=150, R=150, sq=.42, H=55;
        const P=(r,a,h)=>[cx+r*Math.cos(a)*R, cy+r*Math.sin(a)*R*sq-h*H];
        x.beginPath(); x.ellipse(cx,cy,R,R*sq,0,0,7); x.strokeStyle='#C9D2DB'; x.lineWidth=2.5; x.stroke();
        const NR=16, NA=48;
        for(let i=1;i<=NR;i++){ const r=i/NR; for(let j=0;j<NA;j++){ const a0=j/NA*2*Math.PI, a1=(j+1)/NA*2*Math.PI, h0=M.f(r,a0)*ph, h1=M.f(r,a1)*ph, p0=P(r,a0,h0), p1=P(r,a1,h1), hm=(h0+h1)/2;
          x.globalAlpha=.25+.75*Math.min(1,Math.abs(hm)*1.4); L.line(x,p0[0],p0[1],p1[0],p1[1],sgn(hm),1.4); } }
        for(let j=0;j<NA;j+=2){ const a=j/NA*2*Math.PI; for(let i=0;i<NR;i++){ const r0=i/NR, r1=(i+1)/NR, h0=M.f(r0,a)*ph, h1=M.f(r1,a)*ph, p0=P(r0,a,h0), p1=P(r1,a,h1), hm=(h0+h1)/2;
          x.globalAlpha=.2+.6*Math.min(1,Math.abs(hm)*1.4); L.line(x,p0[0],p0[1],p1[0],p1[1],sgn(hm),1); } }
        x.globalAlpha=1;
        if(mode===1){ x.beginPath(); x.ellipse(cx,cy,R*.4357,R*.4357*sq,0,0,7); x.strokeStyle='#FFFFFF'; x.lineWidth=2; x.setLineDash([5,4]); x.stroke(); x.setLineDash([]); L.tag(x,'nœud : cercle immobile',cx,cy+R*sq+20,'center'); }
        if(mode===2){ L.line(x,cx,cy-R*sq,cx,cy+R*sq,'#FFFFFF',2,[5,4]); L.tag(x,'nœud : diamètre immobile',cx,cy+R*sq+20,'center'); }
        L.tag(x,'Peau de tambour attachée sur un cercle',8,18,'left'); }
      else { if(!L.reduce) yaw+=dt*.35; const pts=PTS[mode], c=Math.cos(yaw), s=Math.sin(yaw), cp=Math.cos(.35), sp=Math.sin(.35), CX=200, CY=140, U=115;
        const B=[[],[]];
        for(const p of pts){ let X=c*p[0]+s*p[1], Z=-s*p[0]+c*p[1]; const Y=cp*p[2]-sp*Z; Z=sp*p[2]+cp*Z; const f=3/(3+Z); B[p[3]?1:0].push([CX+X*U*f,CY-Y*U*f,f]); }
        x.save(); x.globalCompositeOperation='lighter';
        [['255,138,128',B[1]],['111,182,255',B[0]]].forEach(([col,Lp])=>{ x.fillStyle='rgba('+col+',.5)'; x.beginPath(); for(const q of Lp){ const r=1.6*q[2]; x.rect(q[0]-r/2,q[1]-r/2,r,r); } x.fill(); }); x.restore();
        if(mode===1){ x.beginPath(); x.arc(CX,CY,U*2/13,0,7); x.strokeStyle='#FFFFFF'; x.lineWidth=1.6; x.setLineDash([4,4]); x.stroke(); x.setLineDash([]); L.tag(x,'pointillés : nœud en sphère, l\u2019électron n\u2019y est jamais',8,232,'left'); }
        if(mode===2){ x.beginPath(); x.ellipse(CX,CY,U*.95,U*.95*sp,0,0,7); x.strokeStyle='rgba(255,255,255,.8)'; x.lineWidth=1.4; x.setLineDash([4,4]); x.stroke(); x.setLineDash([]); L.tag(x,'pointillés : nœud en plan, l\u2019électron n\u2019y est jamais',8,232,'left'); }
        L.glow(x,CX,CY,8,'#FFFFFF',.6); L.sph(x,CX,CY,2.6,'#F2F6FA');
        L.tag(x,'Onde de l’électron autour du noyau (nuage = probabilité)',8,18,'left');
        L.tag(x,mode===0?'taille réelle ×1':'taille réelle ×4 (remise à l’échelle)',392,252,'right',C.muted); }
      L.vignette(x,400,270); },el);
  }
});
