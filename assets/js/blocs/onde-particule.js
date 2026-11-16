/* Bloc « onde-particule » : le champ électrique (ou magnétique) autour d'une particule, pour une onde incidente fixe (λ = 550 nm).
   On ne fait varier que la taille de la particule. Calcul exact (théorie de Mie, champ proche, Bohren & Huffman 1983 §4.4)
   dans le plan qui contient E et la direction de propagation. L'onde arrive de la gauche, E est vertical.
   Sortie : diagramme angulaire de la lumière diffusée, part envoyée vers l'avant, couleur de la lumière diffusée du Soleil. */
Labo.defineBloc('onde-particule',{
  titre:'L’onde et la particule : le champ se construit sous tes yeux',
  mount(el){
    const L=Labo, C=L.C, D=window.Diff, LAM=550, W=460, H=548;
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas style="aspect-ratio:'+W+'/'+H+'" aria-label="Champ électrique ou magnétique autour d’une particule éclairée par une onde plane, diagramme de la lumière diffusée et couleur diffusée"></canvas></div>'+
      '<div class="lc"><label class="slider"><span>Taille de la particule</span><input type="range" min="0" max="1000" step="1" value="500"><strong></strong></label>'+
      '<div class="seg" style="flex-wrap:wrap" role="group" aria-label="Exemples"><button type="button" data-r="1.5e-10">Molécule d’air</button><button type="button" data-r="1e-7">Poussière fine</button><button type="button" data-r="1e-6">Poussière 1 µm</button><button type="button" data-r="1e-5">Goutte de nuage</button><button type="button" data-r="1e-3">Goutte de pluie</button></div>'+
      '<div class="seg" role="group" aria-label="Champ affiché"><button type="button" data-ch="E" aria-pressed="true">Champ E</button><button type="button" data-ch="B" aria-pressed="false">Champ B</button></div>'+
      '<div class="seg" style="flex-wrap:wrap" role="group" aria-label="Ce qu’on voit"><button type="button" data-v="diff" aria-pressed="true">Diffusé seul</button><button type="button" data-v="tot" aria-pressed="false">Total (incident + diffusé)</button></div></div>'+
      '<div class="caption" aria-live="polite"><b></b><span></span></div>'+
      '<div class="infobar"></div><div class="infobox" hidden></div></div>';
    const INFO={
      champ:['Ce que montre la carte','Chaque pixel donne la valeur du champ à cet endroit, à un instant : rouge quand il pointe vers le haut, bleu vers le bas (E est vertical dans l’onde incidente). L’onde plane arrive de la gauche, et on voit ses bandes avancer. Le champ magnétique B est toujours perpendiculaire à E et à la direction de propagation : il sort du plan ou y entre, et le signe rouge ou bleu dit dans quel sens. Dans une onde qui voyage librement, E et B oscillent en phase, avec la même amplitude (en unités où c = 1). Autour d’une particule, ce n’est plus vrai de près : c’est ce qui fait que E et B ne donnent pas la même image.'],
      diffuse:['Le champ « diffusé »','La particule ne crée pas la lumière : elle est traversée par l’onde incidente, ses charges se mettent à osciller, et ce mouvement fabrique une deuxième onde, la diffusée. Le champ total est la somme (incident + diffusé). Pour une toute petite particule, le champ diffusé est des milliards de fois plus faible que l’incident : on l’agrandit automatiquement pour le rendre visible, et le facteur est indiqué. Le motif est celui d’un dipôle qui oscille : des anneaux qui s’éloignent, nuls dans l’axe du dipôle (vertical), maximaux sur les côtés.'],
      taille:['Pourquoi la taille change tout','Ce qui compte est la taille par rapport à la longueur d’onde (550 nm ici, soit 5 500 fois le diamètre d’un atome). Une molécule (0,3 nm) est minuscule : le champ de l’onde y est le même partout, au même instant, donc toutes ses charges bougent ensemble : un seul dipôle. Une poussière de 0,1 µm commence à sentir que l’onde change d’un bord à l’autre. Une goutte de nuage (10 µm, 114 fois plus grande que λ) contient des dizaines de longueurs d’onde : l’onde y est réfractée, ralentie (indice 1,33), réfléchie sur la paroi, et le champ diffusé part presque tout vers l’avant.'],
      sortie:['Comment lire la sortie','Le diagramme en bas à gauche donne l’intensité diffusée dans chaque direction (lumière non polarisée), l’onde arrivant par la gauche. Une petite particule envoie autant vers l’avant que vers l’arrière (forme en deux lobes égaux). Une grosse particule envoie surtout vers l’avant, dans un faisceau étroit (échelle logarithmique, sinon on ne verrait rien ailleurs). La pastille de couleur est la lumière diffusée si la particule est éclairée par le Soleil : bleue pour les molécules, de plus en plus blanche quand la taille augmente, car toutes les couleurs sont diffusées pareil.'],
      pluie:['Et la goutte de pluie ?','Elle fait environ 1 mm de rayon, soit x ≈ 11 000 : le calcul exact du champ y demanderait des milliers de termes par pixel. On affiche donc ici la plus grosse particule calculable (x = 250, rayon 22 µm) : on y voit déjà le motif qui s’installe, un faisceau avant, et des rayons qui rebondissent dans la goutte. Pour une vraie goutte de pluie, ces rayons sont si nets qu’on peut les suivre un à un avec les lois de Descartes : c’est ce que fait le bloc suivant, pour comprendre l’arc-en-ciel.'],
      simplif:['Ce qui est simplifié','Sphère homogène, lisse, d’indice réel (sans absorption : une vraie poussière ou de la suie absorbent). Onde plane de longueur d’onde 550 nm, polarisée verticalement ; pas de variation avec la couleur sur la carte (la couleur n’intervient que dans la pastille). Une molécule d’air est représentée par une petite sphère d’indice 1,0003 : à cette taille, seule compte la polarisabilité totale, pas la forme (voir l’étape 2 pour la vraie N₂, qui n’est pas sphérique). Carte dans le plan qui contient E et la direction de propagation. Le diagramme polaire est calculé pour de la lumière non polarisée. Pour la couleur diffusée, on moyenne sur ±10 % de rayon (sinon des oscillations artificielles apparaissent, car une population réelle de particules n’a jamais une taille unique).']
    };
    L.infoBar(el.querySelector('.infobar'),el.querySelector('.infobox'),['champ','diffuse','taille','sortie','pluie','simplif'],INFO);
    const V=L.setup(el.querySelector('canvas'),W,H), inp=el.querySelector('input'), out=el.querySelector('.slider strong');
    const XMIN=.001, XMAX=250, MAXR=XMAX*LAM*1e-9/(2*Math.PI);
    const xOf=s=>XMIN*Math.pow(XMAX/XMIN,s/1000), sOf=x=>Math.round(1000*Math.log(x/XMIN)/Math.log(XMAX/XMIN));
    const mOf=r=>r<1e-9?1.0003:r<2e-6?1.55:D.nEau(LAM);
    let rReel=xOf(500)*LAM*1e-9/(2*Math.PI), x=2*Math.PI*rReel/(LAM*1e-9), m=mOf(rReel), chan='E', view='diff', phi=0, job=null, F=null, R=null, gain=1, plus=false;
    const fr=(v,d)=>v.toFixed(d).replace('.',',');
    const fmtR=v=>v<1e-9?fr(v*1e9,2)+' nm':v<1e-7?fr(v*1e9,0)+' nm':v<1e-6?fr(v*1e9,0)+' nm':v<1e-3?fr(v*1e6,v<1e-5?1:0)+' µm':fr(v*1e3,1)+' mm';
    const GW=176, GH=116, PX=10, PY=24, PW=440, PHt=290;
    const off=document.createElement('canvas'); off.width=GW; off.height=GH; const oc=off.getContext('2d'), img=oc.createImageData(GW,GH);
    function setSize(rr){ rReel=rr; plus=rr>MAXR*1.001; const rc=Math.min(rr,MAXR); x=2*Math.PI*rc/(LAM*1e-9); m=mOf(rReel); out.textContent=(plus?'≈ ':'')+fmtR(rr)+'   (x = '+(plus?'11 400':x<1?fr(x,3):x<10?fr(x,1):Math.round(x))+')'; startJob(); }
    inp.addEventListener('input',()=>setSize(Math.min(MAXR,xOf(+inp.value)*LAM*1e-9/(2*Math.PI))));
    el.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{ const r=+b.dataset.r; inp.value=Math.min(1000,sOf(2*Math.PI*r/(LAM*1e-9))); setSize(r); });
    el.querySelectorAll('[data-ch]').forEach(b=>b.onclick=()=>{ chan=b.dataset.ch; el.querySelectorAll('[data-ch]').forEach(c=>c.setAttribute('aria-pressed',c===b)); });
    el.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{ view=b.dataset.v; el.querySelectorAll('[data-v]').forEach(c=>c.setAttribute('aria-pressed',c===b)); });
    /* ---- calcul du champ (par morceaux, pour ne pas figer la page) ---- */
    function startJob(){
      const Wk=Math.max(12,1.7*x), du=2*Wk/GW, pts=[];
      for(let j=0;j<GH;j++) for(let i=0;i<GW;i++) pts.push([(GH/2-(j+.5))*du,(i+.5-GW/2)*du]);   // [X (vertical, E), Z (propagation)]
      job={x,m,Wk,du,pts,k:0,res:new Float32Array(GW*GH*12)}; F=null; computeSortie();
    }
    function step(){
      if(!job) return; const j=job, n=Math.min(j.pts.length-j.k, x>60?900:2500), sl=j.pts.slice(j.k,j.k+n), o=D.mieChamp(j.x,j.m,sl);
      for(let q=0;q<n;q++){ const r=o[q], b=(j.k+q)*12; for(let c=0;c<6;c++){ j.res[b+2*c]=r[c][0]; j.res[b+2*c+1]=r[c][1]; } }
      j.k+=n; if(j.k>=j.pts.length){ // gain pour le champ diffusé : percentile 90 de |E_x diffusé| loin de la particule
        const v=[]; for(let q=0;q<j.pts.length;q++){ const p=j.pts[q], rho=Math.hypot(p[0],p[1]); if(rho>Math.max(1.3*j.x,6)){ const b=q*12; v.push(Math.hypot(j.res[b],j.res[b+1])); } }
        v.sort((a,b)=>a-b); const ref=v[Math.floor(v.length*.9)]||1; F=j; F.gE=ref; let hb=[]; for(let q=0;q<j.pts.length;q++){ const p=j.pts[q], rho=Math.hypot(p[0],p[1]); if(rho>Math.max(1.3*j.x,6)){ const b=q*12; hb.push(Math.hypot(j.res[b+4],j.res[b+5])); } } hb.sort((a,b)=>a-b); F.gB=hb[Math.floor(hb.length*.9)]||1; job=null; cap(); } }
    /* ---- sortie : diagramme angulaire, vers l'avant, couleur ---- */
    function computeSortie(){
      const N=181, th=[]; for(let i=0;i<N;i++) th.push(Math.PI*i/(N-1)); let I;
      if(x<.05) I=th.map(t=>1+Math.cos(t)*Math.cos(t)); else { const a=D.mie(x,[m,0],th); I=a.S1.map((s1,j)=>{ const s2=a.S2[j]; return (s1[0]*s1[0]+s1[1]*s1[1]+s2[0]*s2[0]+s2[1]*s2[1])/2; }); }
      let tot=0,av=0; for(let i=1;i<N;i++){ const w=(I[i]+I[i-1])/2*Math.sin((th[i]+th[i-1])/2); tot+=w; if(th[i]<=Math.PI/2+1e-9) av+=w; }
      const LS=[]; for(let l=380;l<=750;l+=10) LS.push(l);
      const fac=x>.5?[.9,1,1.1]:[1], rc=Math.min(rReel,MAXR);
      const sig=LS.map(l=>{ if(x<.05) return Math.pow(l,-4); let s=0; fac.forEach(f=>{ const rr=rc*f; s+=D.mie(2*Math.PI*rr/(l*1e-9),[m,0]).qsca*rr*rr; }); return s/fac.length; });
      const sg=l=>{ const i=(l-380)/10, k=Math.min(LS.length-2,Math.floor(i)), f=i-k; return sig[k]*(1-f)+sig[k+1]*f; };
      R={th,I,Imax:Math.max(...I),avant:av/tot,col:D.color(l=>D.sun(l)*Math.max(sg(l),0)),n:Math.log(Math.max(sg(450),1e-300)/Math.max(sg(650),1e-300))/Math.log(650/450),log:x>=.8}; cap(); }
    function cap(){ const b=el.querySelector('.caption b'), s=el.querySelector('.caption span'); if(!R){ return; }
      const regime=x<.1?'bien plus petite que la longueur d’onde : un seul dipôle qui oscille':x<3?'comparable à la longueur d’onde : l’onde change d’un bord à l’autre de la particule':'bien plus grande que la longueur d’onde : l’onde est réfractée et réfléchie comme dans une lentille';
      b.textContent='Particule '+(plus?'de pluie (affichée : rayon 22 µm)':'de rayon '+fmtR(rReel))+' : '+regime;
      s.textContent=(F?'':'Calcul en cours… ')+'Part de la lumière diffusée vers l’avant : '+Math.round(R.avant*100)+' %. Couleur de la lumière du Soleil diffusée : '+(R.n>2.5?'très bleue (exposant '+fr(R.n,1)+')':R.n>1?'bleutée (exposant '+fr(R.n,1)+')':'presque blanche (exposant '+fr(Math.abs(R.n)<.05?0:R.n,1)+')')+'.'; }
    setSize(rReel);
    /* ---- dessin ---- */
    function coul(v){ // v dans [-1,1] : rouge (+), bleu (−), fond sombre
      const a=Math.min(1,Math.abs(v)); return v>=0?[12+a*230,14+a*70-a*a*20,20+a*40]:[12+a*40,16+a*95,24+a*230]; }
    L.onFrame(dt=>{
      if(!L.reduce) phi+=dt*2.4; if(job) step();
      const x2=V.ctx; V.base(); L.bgLab(x2,W,H);
      L.txt(x2,'Onde incidente de 550 nm (lumière verte), vue dans le plan de E et de la propagation',PX,12,'left',C.muted);
      // carte
      x2.fillStyle='#0b1016'; x2.fillRect(PX,PY,PW,PHt);
      if(F){ const data=img.data, c=Math.cos(phi), s=Math.sin(phi), res=F.res, tot=view==='tot';
        let k0, g; if(chan==='E'){ k0=tot?6:0; g=tot?1/1.6:1/(F.gE*2.2); } else { k0=tot?10:4; g=tot?1/1.6:1/(F.gB*2.2); }
        for(let q=0;q<GW*GH;q++){ const b=q*12+k0*1; // Ex : indices 0,1 (diff) ou 6,7 (tot) ; Hy : 4,5 (diff) ou 10,11 (tot)
          const re=res[b], im=res[b+1], v=(re*c+im*s)*g, col=coul(v); data[q*4]=col[0]; data[q*4+1]=col[1]; data[q*4+2]=col[2]; data[q*4+3]=255; }
        oc.putImageData(img,0,0); x2.save(); x2.beginPath(); x2.rect(PX,PY,PW,PHt); x2.clip(); x2.imageSmoothingEnabled=true; x2.imageSmoothingQuality='high'; x2.drawImage(off,PX,PY,PW,PHt);
        const ppu=PW/(2*F.Wk), cx=PX+PW/2, cy=PY+PHt/2;
        // particule
        const rp=Math.max(F.x*ppu,2.6); x2.beginPath(); x2.arc(cx,cy,rp,0,7); x2.fillStyle=F.x*ppu<4?'#fff':'rgba(255,255,255,.06)'; x2.fill(); x2.strokeStyle='rgba(255,255,255,.9)'; x2.lineWidth=1.4; x2.stroke();
        // flèches de E (champ total, vecteurs) sur une grille grossière
        if(chan==='E'&&tot){ for(let gy=0;gy<5;gy++) for(let gx=0;gx<10;gx++){ const px0=PX+22+gx*(PW-44)/9, py0=PY+26+gy*(PHt-52)/4, i=Math.min(GW-1,Math.max(0,Math.floor((px0-PX)/PW*GW))), j=Math.min(GH-1,Math.max(0,Math.floor((py0-PY)/PHt*GH))), b=(j*GW+i)*12;
            if(Math.hypot(px0-cx,py0-cy)<rp+6) continue; const ex=(res[b+6]*c+res[b+7]*s), ez=(res[b+8]*c+res[b+9]*s), L0=13; const vx=ez*L0, vy=-ex*L0; const mag=Math.hypot(vx,vy); if(mag<1.5) continue; const kk=Math.min(1,16/mag);
            L.arrow(x2,px0-vx*kk/2,py0-vy*kk/2,px0+vx*kk/2,py0+vy*kk/2,'rgba(255,255,255,.55)',1); } }
        x2.restore();
        // échelle λ
        const lp=2*Math.PI*ppu; L.line(x2,PX+12,PY+PHt-14,PX+12+lp,PY+PHt-14,'#fff',2); L.line(x2,PX+12,PY+PHt-18,PX+12,PY+PHt-10,'#fff',1.5); L.line(x2,PX+12+lp,PY+PHt-18,PX+12+lp,PY+PHt-10,'#fff',1.5); L.tag(x2,'λ = 550 nm',PX+12+lp+8,PY+PHt-14,'left','#fff');
        if(F.x*ppu<4) L.tag(x2,'la particule est bien trop petite pour être dessinée',cx,cy+22,'center','#fff');
        L.arrow(x2,PX+10,PY+16,PX+58,PY+16,'#FFD166',2); L.tag(x2,'onde incidente',PX+64,PY+16,'left','#FFD166'); L.arrow(x2,PX+PW-26,PY+PHt-26,PX+PW-26,PY+PHt-62,'#fff',1.6); L.tag(x2,'E',PX+PW-34,PY+PHt-44,'right','#fff');
        const gg=1/(chan==='E'?F.gE:F.gB), gtxt=gg<5?'':' · agrandi ×'+(gg<1e3?String(Math.round(gg)):'10'+String(Math.round(Math.log10(gg))).replace(/\d/g,d=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[d]));
        L.tag(x2,(chan==='E'?'Champ E':'Champ B')+(tot?' total':' diffusé'+gtxt),PX+PW-8,PY+12,'right','#fff');
      } else { L.txt(x2,'calcul du champ…',PX+PW/2,PY+PHt/2,'center',C.muted); }
      // légende de couleur
      L.txt(x2,chan==='E'?'vers le haut':'sens +',PX+PW-150,PY+PHt+14,'left','#F0A8A0'); L.txt(x2,chan==='E'?'vers le bas':'sens −',PX+PW-70,PY+PHt+14,'left','#8FB8FF');
      L.txt(x2,chan==='E'?'Sens du champ électrique :':'Champ B, perpendiculaire au plan :',PX,PY+PHt+14,'left',C.muted);
      /* ---- sortie ---- */
      const oy=PY+PHt+36; L.txt(x2,'SORTIE : lumière diffusée par la particule',PX,oy,'left',C.ink,true);
      if(R){ const cx=112, cy=oy+92, Rm=62; L.line(x2,cx-Rm-8,cy,cx+Rm+8,cy,'rgba(232,238,244,.2)',1); L.line(x2,cx,cy-Rm-6,cx,cy+Rm+6,'rgba(232,238,244,.2)',1);
        if(R.log) [1,2,3].forEach(k=>{ x2.beginPath(); x2.arc(cx,cy,Rm*k/4,0,7); x2.strokeStyle='rgba(232,238,244,.1)'; x2.lineWidth=1; x2.stroke(); });
        const rad=v=>R.log?Rm*Math.max(0,(Math.log10(v/R.Imax)+4)/4):Rm*v/R.Imax; // 0° = vers l'avant = droite
        for(const sg of [1,-1]){ x2.beginPath(); R.th.forEach((t,i)=>{ const r=rad(R.I[i]), X=cx+r*Math.cos(t),Y=cy-sg*r*Math.sin(t); i?x2.lineTo(X,Y):x2.moveTo(X,Y); }); if(sg===1){ x2.strokeStyle='#FFD166'; x2.lineWidth=2; x2.stroke(); } else { x2.stroke(); } }
        x2.beginPath(); R.th.forEach((t,i)=>{ const r=rad(R.I[i]); x2.lineTo(cx+r*Math.cos(t),cy-r*Math.sin(t)); }); R.th.slice().reverse().forEach((t,i)=>{ const r=rad(R.I[R.I.length-1-i]); x2.lineTo(cx+r*Math.cos(t),cy+r*Math.sin(t)); }); x2.closePath(); x2.fillStyle='rgba(255,209,102,.16)'; x2.fill();
        L.arrow(x2,cx-Rm-4,cy+Rm+14,cx-Rm+32,cy+Rm+14,'#FFD166',1.5); L.txt(x2,'onde',cx-Rm-4,cy+Rm+26,'left','#FFD166');
        
        L.txt(x2,'intensité diffusée selon la direction',PX,oy+16,'left',C.muted);
        // chiffres + pastille
        const tx=222, ty=oy+24; L.txt(x2,'vers l’avant : '+Math.round(R.avant*100)+' %',tx,ty,'left',C.ink,true); L.txt(x2,'vers l’arrière : '+(100-Math.round(R.avant*100))+' %',tx,ty+17,'left',C.ink,true);
        L.txt(x2,'Couleur de la lumière du Soleil diffusée',tx,ty+44,'left',C.muted); x2.fillStyle=D.rgbStr(R.col); x2.beginPath(); x2.roundRect?x2.roundRect(tx,ty+54,70,38,8):x2.rect(tx,ty+54,70,38); x2.fill(); x2.strokeStyle='rgba(255,255,255,.35)'; x2.lineWidth=1; x2.stroke();
        L.txt(x2,R.n>2.5?'bleue : le bleu domine':R.n>1?'bleutée':'blanche : toutes les couleurs',tx+80,ty+66,'left',C.ink); L.txt(x2,'exposant n de 1/λⁿ : '+fr(Math.abs(R.n)<.05?0:R.n,1),tx+80,ty+82,'left',C.muted);
        L.txt(x2,'(4 pour une molécule, 0 pour une goutte)',tx,ty+104,'left',C.muted); L.txt(x2,'Diagramme : '+(R.log?'échelle log. (4 décades)':'échelle linéaire'),tx,ty+122,'left',C.muted); }
      L.vignette(x2,W,H); },V.cv);
  }
});
