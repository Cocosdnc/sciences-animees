/* Bloc « test-cones » : une boule blanche réaliste, posée sur un sol, sur fond noir, éclairée par une lampe de couleur au choix.
   Rendu par lancer de rayons, une fois par taille d'écran : boule mate légèrement brillante (diffusion de Lambert + reflet de Blinn-Phong),
   lampe ponctuelle de petite taille (ombre portée avec une pénombre étroite), projecteur dont la lumière s'éteint loin de la boule,
   lumière renvoyée par le sol sous la boule, occlusion au point de contact. Le rendu donne une radiance « par unité de lumière »,
   multipliée ensuite par la couleur de la lampe : changer de couleur ne change que la couleur, pas la scène.
   Luminosité : toutes les couleurs ont la même luminance (0,2126 R + 0,7152 G + 0,0722 B, valeurs linéaires), celle du bleu pur de l'écran,
   le plus sombre des primaires ; le bleu est abaissé à 45 % car un bleu saturé paraît plus clair que sa luminance (effet Helmholtz-Kohlrausch).
   Un léger tramage évite les marches d'escalier dans les dégradés sombres. */
Labo.defineBloc('test-cones',{
  titre:'Test : une boule blanche éclairée en bleu, en vert, en rouge',
  mount(el){
    const L=Labo;
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas style="aspect-ratio:2/1;background:#000" aria-label="Une boule blanche posée sur un sol, sur fond noir, éclairée par une lampe colorée"></canvas></div>'+
      '<div class="lc"><div class="seg" style="flex-wrap:wrap" role="group" aria-label="Couleur de la lampe"><button type="button" data-c="0" aria-pressed="true">Bleu</button><button type="button" data-c="1" aria-pressed="false">Vert</button><button type="button" data-c="2" aria-pressed="false">Rouge</button><button type="button" data-c="3" aria-pressed="false">Jaune</button><button type="button" data-c="4" aria-pressed="false">Cyan</button><button type="button" data-c="5" aria-pressed="false">Magenta</button><button type="button" data-c="6" aria-pressed="false">Blanc</button></div></div>'+
      '<div class="caption" aria-live="polite"><b></b><span></span></div></div>';
    const W=840,H=420,V=L.setup(el.querySelector('canvas'),W,H), cv=V.cv, ctx=V.ctx;
    const lin=u=>{ u/=255; return u<=.04045?u/12.92:Math.pow((u+.055)/1.055,2.4); };
    const lum=c=>.2126*lin(c[0])+.7152*lin(c[1])+.0722*lin(c[2]);
    const COL=[[0,0,255],[0,255,0],[255,0,0],[255,255,0],[0,255,255],[255,0,255],[255,255,255]];
    const NAME=['bleue','verte','rouge','jaune','cyan','magenta','blanche'];
    const bleuY=lum([0,0,255]);
    const lampe=i=>{ const c=COL[i], k=bleuY/lum(c)*(i===0?.45:1); return c.map(v=>lin(v)*k); };   // couleur linéaire de la lampe
    let ci=0, rad=null, rw=0, rh=0, dirty=true;

    /* ---------- la scène (unités : rayon de la boule = 1) ---------- */
    const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]], dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2], nrm=a=>{ const l=Math.hypot(a[0],a[1],a[2]); return [a[0]/l,a[1]/l,a[2]/l]; };
    const EXPO=1.45;                         // exposition : le côté éclairé de la boule atteint le maximum de l'écran
    const S=[0,1,0], R=1;                    // boule posée sur le sol y = 0
    const LP=[-2.6,4.6,-1.8], LR=.22;        // lampe : position et rayon (petit : ombre assez nette)
    const SPOT=nrm(sub([0.4,0,0.4],LP));     // axe du projecteur
    const CAM=[0,1.55,-6.2], TGT=[0,.85,0], FOV=26*Math.PI/180;
    const fw=nrm(sub(TGT,CAM)), rt=nrm([fw[2],0,-fw[0]]), up=[fw[1]*rt[2]-fw[2]*rt[1],fw[2]*rt[0]-fw[0]*rt[2],fw[0]*rt[1]-fw[1]*rt[0]];
    const sstep=(a,b,x)=>{ const t=Math.max(0,Math.min(1,(x-a)/(b-a))); return t*t*(3-2*t); };
    const spot=d=>sstep(.86,.96,dot(d,SPOT));                       // cône du projecteur, bord doux
    const E0=(()=>{ const P=[-.5,1.6,-.6], d=sub(P,LP); return 1/dot(d,d); })(); // normalisation : ≈1 sur le haut de la boule
    function hitSphere(o,d){ const oc=sub(o,S), b=dot(oc,d), c=dot(oc,oc)-R*R, h=b*b-c; if(h<0) return -1; const t=-b-Math.sqrt(h); return t>1e-4?t:-1; }
    /* fraction de la lampe (disque vu depuis P) non cachée par la boule */
    function visible(P){ const tl=sub(LP,P), dl=Math.hypot(...tl), ts=sub(S,P), ds=Math.hypot(...ts);
      if(ds>=dl) return 1; const aL=Math.asin(Math.min(1,LR/dl)), aS=Math.asin(Math.min(1,R/ds)), th=Math.acos(Math.max(-1,Math.min(1,dot(tl,ts)/(dl*ds))));
      if(th>=aS+aL) return 1; if(th<=aS-aL) return 0; return sstep(0,1,(th-(aS-aL))/(2*aL)); }
    function eclairement(P,n){ const tl=sub(LP,P), d2=dot(tl,tl), l=nrm(tl), c=dot(n,l); return c<=0?0:c/d2/E0*spot([-l[0],-l[1],-l[2]]); }
    function trace(d){
      const t=hitSphere(CAM,d);
      if(t>0){ const P=[CAM[0]+d[0]*t,CAM[1]+d[1]*t,CAM[2]+d[2]*t], n=nrm(sub(P,S)), v=[-d[0],-d[1],-d[2]], l=nrm(sub(LP,P));
        const dif=.88*eclairement(P,n);
        const h=nrm([l[0]+v[0],l[1]+v[1],l[2]+v[2]]), nh=Math.max(0,dot(n,h)), tl=sub(LP,P), att=1/dot(tl,tl)/E0;
        const spec=dot(n,l)>0?(.55*Math.pow(nh,90)+.08*Math.pow(nh,12))*att*spot([-l[0],-l[1],-l[2]]):0;
        const P0=[P[0],0,P[2]], rebond=.4*eclairement(P0,[0,1,0])*visible(P0)*.30*Math.max(0,-n[1]);   // sol éclairé sous la boule
        const fres=.03*Math.pow(1-Math.max(0,dot(n,v)),4);
        return EXPO*(dif+spec+.88*rebond+fres+.012*(.5+.5*n[1])); }
      if(d[1]<0){ const tp=-CAM[1]/d[1], P=[CAM[0]+d[0]*tp,0,CAM[2]+d[2]*tp], toS=sub(S,P), dc2=dot(toS,toS);
        const ao=1-.85*Math.max(0,toS[1]/Math.sqrt(dc2))*R*R/dc2;          // occlusion près du point de contact
        return EXPO*.4*(eclairement(P,[0,1,0])*visible(P)+.012*ao)*ao; }
      return 0; }
    function calcul(w,h){ const out=new Float32Array(w*h), tf=Math.tan(FOV/2), asp=w/h, SS=[[.25,.25],[.75,.25],[.25,.75],[.75,.75]];
      for(let j=0;j<h;j++) for(let i=0;i<w;i++){ let s=0;
        for(const o of SS){ const u=(2*(i+o[0])/w-1)*tf*asp, vv=(1-2*(j+o[1])/h)*tf; s+=trace(nrm([fw[0]+u*rt[0]+vv*up[0],fw[1]+u*rt[1]+vv*up[1],fw[2]+u*rt[2]+vv*up[2]])); }
        out[j*w+i]=s/4; }
      return out; }
    const enc=v=>255*(v<=.0031308?12.92*v:1.055*Math.pow(v,1/2.4)-.055);
    let img=null, noise=null;
    function dessiner(){ const w=cv.width, h=cv.height;
      if(!rad||rw!==w||rh!==h){ rad=calcul(w,h); rw=w; rh=h; img=ctx.createImageData(w,h); noise=new Float32Array(w*h); for(let k=0;k<w*h;k++) noise[k]=Math.random()-.5; }
      const c=lampe(ci), p=img.data;
      for(let k=0,n=w*h;k<n;k++){ const r=rad[k], q=4*k, z=noise[k];
        p[q]=Math.max(0,Math.min(255,enc(Math.min(1,r*c[0]))+z)); p[q+1]=Math.max(0,Math.min(255,enc(Math.min(1,r*c[1]))+z)); p[q+2]=Math.max(0,Math.min(255,enc(Math.min(1,r*c[2]))+z)); p[q+3]=255; }
      ctx.setTransform(1,0,0,1,0,0); ctx.putImageData(img,0,0); dirty=false; }

    el.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{ ci=+b.dataset.c; el.querySelectorAll('[data-c]').forEach(c=>c.setAttribute('aria-pressed',c===b)); dirty=true; cap(); });
    function cap(){ el.querySelector('.caption b').textContent='Boule blanche, lampe '+NAME[ci];
      el.querySelector('.caption span').textContent='Même luminosité pour toutes les couleurs. Regarde le reflet, le contour de la boule et le bord de son ombre, puis change de couleur sans bouger : en quelle couleur sont-ils les plus nets ?'; }
    cap();
    L.onFrame(()=>{ if(dirty||rw!==cv.width||rh!==cv.height) dessiner(); },cv);
  }
});
