/* Bloc « nuage-probabilite » : où trouve-t-on l'électron ? Des points qui s'accumulent dessinent un nuage.
   États 1s, 2s, 2p de l'atome d'hydrogène (formes exactes), vus en coupe dans un plan passant par le noyau.
   Unités : rayon de Bohr a₀ = 0,0529 nm. Aucune notion de signe ici : on ne montre que ce qui se mesure. */
Labo.defineBloc('nuage-probabilite',{
  titre:'Où trouve-t-on l’électron ?',
  mount(el){
    const L=Labo, C=L.C, A0=.0529;
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas style="aspect-ratio:400/260" aria-label="Coupe d’un atome d’hydrogène : des points, chacun un endroit où l’électron a été trouvé, dessinent un nuage autour du noyau"></canvas></div>'+
      '<div class="lc"><div class="seg" role="group" aria-label="État de l’électron"><button type="button" data-o="1s" aria-pressed="true">1s</button><button type="button" data-o="2s" aria-pressed="false">2s</button><button type="button" data-o="2p" aria-pressed="false">2p</button></div>'+
      '<button type="button" data-a="map" aria-pressed="false">Carte de probabilité</button><button type="button" data-a="zero" aria-pressed="false">Montrer les zéros</button>'+
      '<button type="button" data-a="more">+ 500 points</button><button type="button" data-a="clear">Vider</button></div>'+
      '<div class="caption" aria-live="polite"><b></b><span></span></div>'+
      '<div class="infobar"></div><div class="infobox" hidden></div></div>';
    const INFO={
      points:['Que représente un point ?','Chaque point est un endroit où l’on a trouvé l’électron en le cherchant. Un seul point ne dit presque rien : l’électron peut apparaître presque n’importe où dans le nuage. C’est l’accumulation de milliers de points qui dessine une forme précise, toujours la même pour un même état de l’atome. C’est ce que l’expérience mesure : on ne suit jamais l’électron comme une bille, on ne connaît que cette forme.'],
      zero:['Un zéro, ce n’est pas un trou','Dans une zone à zéro, on ne trouve jamais l’électron, alors qu’on peut le trouver de chaque côté. Ce n’est ni un mur ni un vide : son onde y passe par zéro avant de repartir de l’autre côté, comme une corde de guitare qui a un point immobile. Plus un état a de zéros, plus son onde est courte et ondule, donc plus il a d’énergie.'],
      psi:['Et la fonction d’onde ?','C’est l’outil mathématique dont le carré donne cette carte. Seule la carte se mesure. Le signe de cette fonction (plus ou moins) n’a aucun sens physique pour un atome seul : on pourrait tout inverser sans changer un seul point. Il ne devient utile que plus bas, quand deux atomes se rapprochent et que leurs ondes se rencontrent.'],
      exact:['Ce qui est exact, ce qui est simplifié','Les points suivent exactement la probabilité de l’atome d’hydrogène (états 1s, 2s et 2p), dans une tranche mince de 0,8 a₀ autour du plan du dessin. Simplifié : un seul électron, noyau supposé immobile, rythme d’apparition des points arbitraire. Pour les autres atomes les formes sont voisines, avec d’autres tailles.']
    };
    L.infoBar(el.querySelector('.infobar'),el.querySelector('.infobox'),['points','zero','psi','exact'],INFO);
    const W=400,H=260,CX=200,CY=130, V=L.setup(el.querySelector('canvas'),W,H);
    const r3=(x,y,z)=>Math.sqrt(x*x+y*y+z*z);
    const ORB={
      '1s':{rho:(x,y,z)=>Math.exp(-2*r3(x,y,z)), max:1, px:38,
        t:'1s : un nuage sans aucun zéro', d:'Les points sont les plus serrés près du noyau et s’espacent vers l’extérieur, sans jamais s’arrêter net. Aucun endroit où l’électron ne va jamais. Le nuage mesure quelques dixièmes de nanomètre.'},
      '2s':{rho:(x,y,z)=>{ const r=r3(x,y,z); return (2-r)*(2-r)*Math.exp(-r); }, max:4, px:19,
        t:'2s : un zéro en forme de sphère', d:'Même forme générale, mais une couche de points au centre, une autre bien plus loin, et entre les deux un cercle (une sphère dans l’espace) où l’électron n’est jamais, à 2 a₀ = 0,106 nm du noyau. Un zéro de plus que 1s : l’onde est plus courte, l’énergie plus haute.'},
      '2p':{rho:(x,y,z)=>{ const r=r3(x,y,z); return z*z*Math.exp(-r); }, max:.55, px:19,
        t:'2p : un zéro en forme de plan', d:'Deux lobes, un en haut, un en bas, et entre eux un plan où l’électron n’est jamais, qui passe par le noyau. Lui aussi a un zéro, comme 2s, mais plat au lieu de sphérique. Il y a trois orientations possibles (x, y, z).'}
    };
    let orb='1s', pts=[], showMap=false, showZero=false, acc=0, mapImg=null;
    const NMAX=1600;
    function sample(o){ const O=ORB[o], hx=CX/O.px, hz=CY/O.px;
      for(let k=0;k<6000;k++){ const x=(Math.random()*2-1)*hx, z=(Math.random()*2-1)*hz, y=(Math.random()*2-1)*.4;
        if(Math.random()*O.max<O.rho(x,y,z)) return {x,z}; } return null; }
    function add(n){ for(let i=0;i<n;i++){ const p=sample(orb); if(p) pts.push(p); } if(pts.length>NMAX) pts.splice(0,pts.length-NMAX); }
    function buildMap(){ const O=ORB[orb], w=200,h=130, off=document.createElement('canvas'); off.width=w; off.height=h; const c=off.getContext('2d'), im=c.createImageData(w,h);
      for(let j=0;j<h;j++) for(let i=0;i<w;i++){ const x=(i*2+1-CX)/O.px, z=(CY-(j*2+1))/O.px, v=Math.pow(Math.min(1,O.rho(x,0,z)/O.max),.38), k=(j*w+i)*4;
        im.data[k]=255*v; im.data[k+1]=120*v; im.data[k+2]=105*v; im.data[k+3]=255; }
      c.putImageData(im,0,0); mapImg=off; }
    function setOrb(o){ orb=o; pts=[]; add(450); buildMap(); const O=ORB[o];
      el.querySelector('.caption b').textContent=O.t; el.querySelector('.caption span').textContent=O.d;
      el.querySelectorAll('[data-o]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.o===o)); }
    el.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>setOrb(b.dataset.o));
    el.querySelector('[data-a="map"]').onclick=e=>{ showMap=!showMap; e.currentTarget.setAttribute('aria-pressed',showMap); };
    el.querySelector('[data-a="zero"]').onclick=e=>{ showZero=!showZero; e.currentTarget.setAttribute('aria-pressed',showZero); };
    el.querySelector('[data-a="more"]').onclick=()=>add(500);
    el.querySelector('[data-a="clear"]').onclick=()=>{ pts=[]; };
    setOrb('1s');
    L.onFrame(dt=>{
      if(!L.reduce){ acc+=dt*28; const n=Math.floor(acc); acc-=n; add(n); }
      const x=V.ctx, O=ORB[orb]; V.base(); L.bgLab(x,W,H);
      if(showMap&&mapImg){ x.save(); x.imageSmoothingEnabled=true; x.globalAlpha=.9; x.drawImage(mapImg,0,0,W,H); x.restore(); }
      L.glow(x,CX,CY,16,'#FFFFFF',.3);
      x.fillStyle=showMap?'rgba(255,255,255,.35)':'#FF9C94';
      x.beginPath(); for(const p of pts){ const px=CX+p.x*O.px, py=CY-p.z*O.px; x.moveTo(px+1.5,py); x.arc(px,py,1.5,0,7); } x.fill();
      if(showZero){
        if(orb==='2s'){ x.beginPath(); x.arc(CX,CY,2*O.px,0,7); x.strokeStyle='#6FB6FF'; x.lineWidth=1.6; x.setLineDash([5,4]); x.stroke(); x.setLineDash([]); L.tag(x,'zéro : l’électron n’y est jamais',CX+2*O.px*.7+6,CY-2*O.px*.7-4,'left','#6FB6FF'); }
        else if(orb==='2p'){ L.line(x,0,CY,W,CY,'#6FB6FF',1.6,[5,4]); L.tag(x,'zéro : un plan, l’électron n’y est jamais',W-8,CY-14,'right','#6FB6FF'); }
        else L.tag(x,'1s : aucun zéro',CX+30,CY-30,'left','#6FB6FF'); }
      x.beginPath(); x.arc(CX,CY,2.4,0,7); x.fillStyle='#fff'; x.fill();
      L.tag(x,'noyau',CX+8,CY+13,'left',C.ink);
      const sb=.1/A0*O.px; L.line(x,14,H-18,14+sb,H-18,C.ink,1.5); L.tag(x,'0,1 nm',14,H-30,'left',C.ink);
      L.tag(x,pts.length+' points',W-8,16,'right',C.muted);
      L.vignette(x,W,H); }, V.cv);
  }
});
