/* Bloc « liante-antiliante » : deux atomes d'hydrogène rapprochés.
   Trois images du même électron : (0) on additionne les probabilités, (+) on additionne les ondes en phase,
   (−) on additionne les ondes en opposition. La différence entre les trois, c'est tout ce que fait le « signe ».
   Ondes 1s de l'hydrogène (méthode LCAO), en coupe dans un plan contenant les deux noyaux. a₀ = 0,0529 nm. */
Labo.defineBloc('liante-antiliante',{
  titre:'Liante et antiliante : où est l’électron entre deux atomes ?',
  mount(el){
    const L=Labo, C=L.C, A0=.0529, RED='#FF8A80', BLU='#6FB6FF', GLD='#E3B341';
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas style="aspect-ratio:400/330" aria-label="Coupe de deux atomes d’hydrogène : points de présence de l’électron, et en dessous la probabilité le long de la liaison pour trois façons de combiner les atomes"></canvas></div>'+
      '<div class="lc"><div class="seg" role="group" aria-label="Façon de combiner les deux atomes"><button type="button" data-m="0" aria-pressed="false">Somme des probabilités</button><button type="button" data-m="1" aria-pressed="true">Ondes en phase : liante</button><button type="button" data-m="-1" aria-pressed="false">Ondes en opposition : antiliante</button></div>'+
      '<button type="button" data-a="map" aria-pressed="false">Carte de probabilité</button>'+
      '<label class="slider"><span>Distance entre les noyaux</span><input type="range" min="5" max="70" step="1" value="30"><strong></strong></label></div>'+
      '<div class="caption" aria-live="polite"><b></b><span></span></div>'+
      '<div class="infobar"></div><div class="infobox" hidden></div></div>';
    const INFO={
      somme:['Pourquoi additionner des ondes, pas des probabilités ?','La première image ajoute simplement la probabilité de chaque atome : c’est ce qu’on obtiendrait si l’électron était une petite bille qui peut être sur l’un ou l’autre. Les deux autres ajoutent les ondes avant de calculer la probabilité, comme pour les électrons de Davisson et Germer : ce sont les ondes qui s’additionnent, et c’est de là que viennent les franges. Au milieu des noyaux, avec les mêmes ondes de départ, on trouve 1 en additionnant les probabilités, 2 avec des ondes en phase, 0 avec des ondes en opposition.'],
      signe:['« En phase », « en opposition » : ça veut dire quoi ?','Une onde seule n’a pas de signe qu’on puisse mesurer. Ce qui compte, c’est la comparaison entre les deux ondes qui se rencontrent : elles montent et descendent ensemble (en phase, elles se renforcent) ou l’une monte quand l’autre descend (en opposition, elles s’annulent). C’est ce décalage qui change le nuage, et on le voit : la différence entre les trois images, c’est tout. On ne dessine ici que ce qu’on pourrait mesurer, la probabilité.'],
      zero:['Le plan à zéro','En opposition, les deux ondes s’annulent exactement au milieu : sur un plan perpendiculaire à la liaison, l’électron n’est jamais. Son onde est coupée en deux zones plus petites, donc plus courtes. Plus courte, c’est plus d’énergie : voir le bloc suivant.'],
      places:['Deux électrons par orbitale','Chaque orbitale accueille au plus deux électrons, de spins opposés (principe de Pauli). Pour H₂, les deux électrons vont dans la liante : il y a liaison. Pour He₂, quatre électrons remplissent aussi l’antiliante, dont l’effet annule celui de la liante : pas de liaison.'],
      exact:['Ce qui est exact, ce qui est simplifié','Les nuages sont calculés, pas dessinés : ondes 1s de l’hydrogène centrées sur deux noyaux, additionnées ou soustraites (méthode LCAO), en coupe dans un plan contenant les deux noyaux. Simplifié : les deux atomes gardent leur onde 1s inchangée (en vrai, elle se contracte un peu quand ils se rapprochent), et les profils du bas ne sont pas renormalisés, pour que les trois restent comparables.']
    };
    L.infoBar(el.querySelector('.infobar'),el.querySelector('.infobox'),['somme','signe','zero','places','exact'],INFO);
    const W=400,H=330, V=L.setup(el.querySelector('canvas'),W,H), inp=el.querySelector('input'), out=el.querySelector('.slider strong');
    const MX=200, MY=92, PX=26, BX=200, BY=318, BH=100;   // carte (en haut) et profils (en bas)
    let mode=1, R=3, showMap=false, pts=[], acc=0, mapImg=null, mapKey='';
    const NMAX=1500;
    const dens=(x,z,m,R)=>{ const a=Math.exp(-Math.hypot(x+R/2,z)), b=Math.exp(-Math.hypot(x-R/2,z));
      return m===0?a*a+b*b:(a+m*b)*(a+m*b); };
    function sample(){ const hx=MX/PX, hz=MY/PX;
      for(let k=0;k<8000;k++){ const x=(Math.random()*2-1)*hx, z=(Math.random()*2-1)*hz;
        if(Math.random()*4.2<dens(x,z,mode,R)) return {x,z}; } return null; }
    function add(n){ for(let i=0;i<n;i++){ const p=sample(); if(p) pts.push(p); } if(pts.length>NMAX) pts.splice(0,pts.length-NMAX); }
    function buildMap(){ const key=mode+'|'+R.toFixed(2); if(key===mapKey) return; mapKey=key; const w=200,h=92, off=document.createElement('canvas'); off.width=w; off.height=h; const c=off.getContext('2d'), im=c.createImageData(w,h);
      for(let j=0;j<h;j++) for(let i=0;i<w;i++){ const x=(i*2+1-MX)/PX, z=(MY-(j*2+1))/PX, v=Math.pow(Math.min(1,dens(x,z,mode,R)/1.6),.5), k=(j*w+i)*4;
        const col=mode<0?[111,182,255]:[255,138,128]; im.data[k]=col[0]*v; im.data[k+1]=col[1]*v; im.data[k+2]=col[2]*v; im.data[k+3]=255; }
      c.putImageData(im,0,0); mapImg=off; }
    const cap=()=>{ const b=el.querySelector('.caption b'), s=el.querySelector('.caption span'), far=R>5;
      if(mode===0){ b.textContent='Somme des probabilités';
        s.textContent='Si l’électron était une bille qui peut être sur l’un ou l’autre atome, on additionnerait les probabilités : deux nuages qui se recouvrent, sans rien de particulier entre les noyaux.'; }
      else if(mode>0){ b.textContent='Ondes en phase : liante';
        s.textContent=far?'Les atomes sont loin : les deux ondes se recouvrent à peine, les images se ressemblent. Rapproche-les.':'Entre les noyaux, les deux ondes se renforcent : la probabilité y est le double de la simple somme (courbe rouge au-dessus de la dorée). L’électron est étalé sur les deux atomes, sans aucun zéro.'; }
      else { b.textContent='Ondes en opposition : antiliante';
        s.textContent=far?'Les atomes sont loin : les deux ondes se recouvrent à peine, les images se ressemblent. Rapproche-les.':'Les deux ondes s’annulent exactement au milieu : un plan à zéro où l’électron n’est jamais (la courbe bleue touche zéro). Le nuage est repoussé vers l’extérieur et l’onde est coupée en deux zones.'; } };
    const refill=()=>{ pts=[]; add(500); mapKey=''; cap(); };
    el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{ mode=+b.dataset.m; el.querySelectorAll('[data-m]').forEach(c=>c.setAttribute('aria-pressed',c===b)); refill(); });
    el.querySelector('[data-a="map"]').onclick=e=>{ showMap=!showMap; e.currentTarget.setAttribute('aria-pressed',showMap); };
    inp.addEventListener('input',()=>{ R=inp.value/10; refill(); });
    R=inp.value/10; refill();
    const prof=(m,R,x)=>{ const a=Math.exp(-Math.abs(x+R/2)), b=Math.exp(-Math.abs(x-R/2)); return m===0?a*a+b*b:(a+m*b)*(a+m*b); };
    L.onFrame(dt=>{
      if(!L.reduce){ acc+=dt*30; const n=Math.floor(acc); acc-=n; add(n); }
      out.textContent=(R*A0).toFixed(2).replace('.',',')+' nm';
      const x=V.ctx; V.base(); L.bgLab(x,W,H);
      if(showMap){ buildMap(); x.save(); x.imageSmoothingEnabled=true; x.globalAlpha=.9; x.drawImage(mapImg,0,0,W,MY*2); x.restore(); }
      x.save(); x.beginPath(); x.rect(0,0,W,MY*2); x.clip();
      x.fillStyle=showMap?'rgba(255,255,255,.4)':(mode<0?BLU:mode>0?'#FF9C94':GLD);
      x.beginPath(); for(const p of pts){ const px=MX+p.x*PX, py=MY-p.z*PX; x.moveTo(px+1.4,py); x.arc(px,py,1.4,0,7); } x.fill();
      for(const s of [-1,1]){ L.glow(x,MX+s*R/2*PX,MY,12,'#FFFFFF',.35); x.beginPath(); x.arc(MX+s*R/2*PX,MY,2.6,0,7); x.fillStyle='#fff'; x.fill(); }
      if(mode<0&&R<=5){ L.line(x,MX,6,MX,MY*2-6,BLU,1.4,[5,4]); L.tag(x,'plan à zéro',MX+6,16,'left',BLU); }
      x.restore();
      L.tag(x,'noyau',MX-R/2*PX-4,MY+16,'right',C.ink); L.tag(x,'noyau',MX+R/2*PX+4,MY+16,'left',C.ink);
      L.txt(x,'Probabilité le long de la liaison',8,MY*2+14,'left',C.ink,true);
      // profils
      let top=0; for(let i=0;i<=360;i++){ const v=prof(1,R,(i-180)/PX*1); if(v>top) top=v; }
      const Y=v=>BY-v/top*BH, XX=i=>BX+(i-180);
      L.line(x,6,BY,W-6,BY,'rgba(232,238,244,.3)',1);
      const curve=(m,col,lw,dash,fill)=>{ x.beginPath(); for(let i=0;i<=360;i++){ const v=prof(m,R,(i-180)/PX); i?x.lineTo(XX(i),Y(v)):x.moveTo(XX(i),Y(v)); }
        if(fill){ x.save(); x.lineTo(XX(360),BY); x.lineTo(XX(0),BY); x.closePath(); x.fillStyle=L.rgba(col,.18); x.fill(); x.restore(); x.beginPath(); for(let i=0;i<=360;i++){ const v=prof(m,R,(i-180)/PX); i?x.lineTo(XX(i),Y(v)):x.moveTo(XX(i),Y(v)); } }
        x.strokeStyle=col; x.lineWidth=lw; x.setLineDash(dash||[]); x.stroke(); x.setLineDash([]); };
      curve(0,GLD,mode===0?2.4:1.4,[5,4],mode===0);
      curve(1,RED,mode>0?2.4:1.2,null,mode>0);
      curve(-1,BLU,mode<0?2.4:1.2,null,mode<0);
      L.line(x,BX,BY,BX,BY-BH+8,'rgba(232,238,244,.25)',1,[2,3]);
      const mid=prof(0,R,0);
      [[GLD,mid,'1'],[RED,prof(1,R,0),'2'],[BLU,prof(-1,R,0),'0']].forEach(([c,v,t])=>{ x.beginPath(); x.arc(BX,Y(v),3,0,7); x.fillStyle=c; x.fill(); });
      L.tag(x,'au milieu, par rapport à la somme :',W-8,MY*2+14,'right',C.muted);
      L.tag(x,'somme des probabilités : 1',W-8,MY*2+38,'right',GLD);
      L.tag(x,'ondes en phase : 2',W-8,MY*2+60,'right',RED);
      L.tag(x,'ondes en opposition : 0',W-8,MY*2+82,'right',BLU);
      L.vignette(x,W,H); }, V.cv);
  }
});
