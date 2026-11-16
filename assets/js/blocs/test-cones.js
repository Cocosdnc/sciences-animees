/* Bloc « test-cones » : une boule blanche sur fond noir, éclairée par une lumière de couleur au choix.
   Aucune simulation : on observe directement sur son écran ce que l'on voit. Toutes les couleurs ont la même luminance
   (0,2126 R + 0,7152 G + 0,0722 B, valeurs linéaires), le bleu pur étant la référence (le plus sombre des trois primaires).
   Le bleu est encore abaissé à 60 % : un bleu saturé paraît plus clair que sa luminance (effet Helmholtz-Kohlrausch). */
Labo.defineBloc('test-cones',{
  titre:'Test : une boule blanche éclairée en bleu, en vert, en rouge',
  mount(el){
    const L=Labo;
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas style="aspect-ratio:2/1" aria-label="Une boule blanche sur fond noir, éclairée par une lumière colorée"></canvas></div>'+
      '<div class="lc"><div class="seg" style="flex-wrap:wrap" role="group" aria-label="Couleur de l’éclairage"><button type="button" data-c="0" aria-pressed="true">Bleu</button><button type="button" data-c="1" aria-pressed="false">Vert</button><button type="button" data-c="2" aria-pressed="false">Rouge</button><button type="button" data-c="3" aria-pressed="false">Jaune</button><button type="button" data-c="4" aria-pressed="false">Cyan</button><button type="button" data-c="5" aria-pressed="false">Magenta</button><button type="button" data-c="6" aria-pressed="false">Blanc</button></div></div>'+
      '<div class="caption" aria-live="polite"><b></b><span></span></div></div>';
    const W=840,H=420,V=L.setup(el.querySelector('canvas'),W,H);
    const lin=u=>{ u/=255; return u<=.04045?u/12.92:Math.pow((u+.055)/1.055,2.4); }, srgb=v=>Math.round(255*(v<=.0031308?12.92*v:1.055*Math.pow(v,1/2.4)-.055));
    const lum=c=>.2126*lin(c[0])+.7152*lin(c[1])+.0722*lin(c[2]);
    const COL=[[0,0,255],[0,255,0],[255,0,0],[255,255,0],[0,255,255],[255,0,255],[255,255,255]];
    const NAME=['bleue','verte','rouge','jaune','cyan','magenta','blanche'];
    const bleuY=lum([0,0,255]);
    let ci=0;
    const couleur=()=>{ const c=COL[ci], k=Math.min(1,bleuY/lum(c))*(ci===0?.6:1); return c.map(v=>srgb(lin(v)*k)); };
    el.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{ ci=+b.dataset.c; el.querySelectorAll('[data-c]').forEach(c=>c.setAttribute('aria-pressed',c===b)); cap(); });
    function cap(){ el.querySelector('.caption b').textContent='Boule blanche, lumière '+NAME[ci];
      el.querySelector('.caption span').textContent='Même luminosité pour toutes les couleurs. Regarde le relief de la boule : le côté qui s’assombrit, son bord. Passe d’une couleur à l’autre sans bouger.'; }
    cap();
    L.onFrame(()=>{
      const x=V.ctx; V.base(); x.fillStyle='#000'; x.fillRect(0,0,W,H);
      const c=couleur(), v=f=>'rgb('+c.map(u=>Math.round(u*f)).join(',')+')';
      const cx=W/2, cy=H/2, r=140, g=x.createRadialGradient(cx-45,cy-50,10,cx,cy,r);
      g.addColorStop(0,v(1)); g.addColorStop(.55,v(.8)); g.addColorStop(.9,v(.3)); g.addColorStop(1,v(.12));
      x.fillStyle=g; x.beginPath(); x.arc(cx,cy,r,0,7); x.fill();
    },V.cv);
  }
});
