/* Bloc « arc-en-ciel » : pourquoi une goutte de pluie donne un arc coloré, et un nuage seulement du blanc.
   1. Une goutte de pluie sphérique (1 mm) : lois de Descartes (n·sin i = sin r), une réflexion interne, dispersion n(λ) = 1,3238 + 3140/λ².
      Angle de sortie (mesuré depuis le point opposé au Soleil) α = 4r − 2i : il passe par un maximum, où les rayons s'accumulent.
   2. L'intensité par angle est calculée par l'optique géométrique (densité de rayons, facteurs de Fresnel), avec un flou gaussien qui représente
      la diffraction (largeur ∝ (λ/r)^(2/3)), puis converties en couleur avec le spectre du Soleil.
   3. Les gouttes d'un nuage (10 µm) : calcul exact de Mie (moyenné sur ±25 % de rayon), à la place de l'optique géométrique, qui n'y est plus valable. */
Labo.defineBloc('arc-en-ciel',{
  titre:'L’arc-en-ciel : une goutte de pluie, une goutte de nuage',
  mount(el){
    const L=Labo, C=L.C, D=window.Diff, W=460, H=516, PI=Math.PI, rad=v=>v*PI/180, deg=v=>v*180/PI;
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas style="aspect-ratio:'+W+'/'+H+'" aria-label="Trajet d’un rayon de Soleil dans une goutte de pluie, angle de sortie selon la hauteur du rayon, et arcs obtenus avec des gouttes de pluie et des gouttes de nuage"></canvas></div>'+
      '<div class="lc"><label class="slider"><span>Hauteur du rayon</span><input type="range" min="0" max="100" step="1" value="86" data-k="b"><strong data-o="b"></strong></label>'+
      '<label class="slider"><span>Couleur</span><input type="range" min="400" max="700" step="5" value="650" data-k="l"><strong data-o="l"></strong></label></div>'+
      '<div class="caption" aria-live="polite"><b></b><span></span></div>'+
      '<div class="infobar"></div><div class="infobox" hidden></div></div>';
    const INFO={
      descartes:['La goutte : deux réfractions et un miroir','Le rayon arrive sur la goutte et se courbe en y entrant (loi de Descartes : sin i = n·sin r, avec n = 1,33 pour l’eau). Il atteint le fond de la goutte, où une partie de la lumière est réfléchie, comme sur un miroir. Il revient vers la surface, où il se courbe de nouveau en sortant. Au total, il ressort presque en sens inverse : c’est pour cela qu’on voit l’arc-en-ciel avec le Soleil dans le dos. Chaque rayon est dévié d’un angle qui dépend de sa hauteur (celui qui passe par le centre revient droit sur lui-même).'],
      angle:['Pourquoi un angle précis : l’accumulation','Regarde la courbe à droite : l’angle de sortie augmente avec la hauteur du rayon, passe par un maximum (42,3° pour le rouge), puis redescend. Près du maximum, une grande plage de hauteurs de rayons donne presque le même angle : ces rayons sortent presque parallèles et leurs lumières s’additionnent dans une même direction. Ailleurs, les rayons sont éparpillés. L’intensité dans une direction est proportionnelle au nombre de rayons qui y arrivent, ce qui diverge à l’angle maximal. Au-delà de cet angle (plus de 42,3° pour le rouge), la lumière directe de l’arc disparaît : c’est la bande sombre d’Alexandre, au-dessus de l’arc principal.'],
      couleurs:['Pourquoi les couleurs sont séparées','L’indice de l’eau dépend de la couleur (n = 1,331 à 650 nm, 1,342 à 420 nm, d’après n ≈ 1,3238 + 3140/λ²). La déviation, donc l’angle maximal, change donc un peu : 42,3° à 650 nm et 40,8° à 420 nm (les valeurs mesurées de l’arc-en-ciel sont de l’ordre de 42° pour le rouge et 40,5° pour le violet). Chaque couleur a son propre arc, un peu plus petit pour le bleu : le rouge est à l’extérieur, le violet à l’intérieur, l’arc-en-ciel fait environ 2° de large en tout (le diamètre apparent du Soleil est de 0,5° : les couleurs ne se recouvrent presque pas).'],
      nuage:['Pourquoi pas d’arc-en-ciel dans un nuage ?','Deux raisons. D’abord la taille : une goutte de nuage (10 µm de rayon) est 100 fois plus petite qu’une goutte de pluie. À cette taille, le faisceau sortant se disperse par diffraction sur plusieurs degrés, bien plus que les 2° qui séparent le rouge du violet : les couleurs se recouvrent, et leur somme est du blanc. Il reste un arc blanc, large et pâle, appelé arc de brouillard (on peut le voir dans le brouillard, à contre-jour). Ensuite, un vrai nuage contient énormément de gouttes, et la lumière rebondit plusieurs fois entre elles avant de sortir : tout angle est mélangé avec les autres, ce qui efface même l’arc de brouillard et donne un blanc uniforme.'],
      simplif:['Ce qui est simplifié','Gouttes parfaitement sphériques (les grosses gouttes de pluie sont aplaties, ce qui élargit l’arc vers le bas et le fait disparaître au sommet pour les grosses gouttes). Un seul rayon de goutte (1 mm) : en réalité il y a un mélange de tailles. La diffraction est représentée par un flou gaussien de largeur ∝ (λ/r)^(2/3) à la place de la fonction d’Airy : on n’a donc pas les arcs surnuméraires (les fines franges roses et vertes sous l’arc principal). On ne calcule que l’arc principal (une réflexion), pas l’arc secondaire (53°), ni la polarisation (la lumière de l’arc est fortement polarisée). La réflexion directe sur la goutte est ajoutée en fond. Le calcul du nuage est exact (théorie de Mie) mais pour une taille moyenne de 10 µm, avec une dispersion de ±25 % (une vraie population de gouttes n’a jamais une taille unique).']
    };
    L.infoBar(el.querySelector('.infobar'),el.querySelector('.infobox'),['descartes','angle','couleurs','nuage','simplif'],INFO);
    const V=L.setup(el.querySelector('canvas'),W,H), inb=el.querySelector('[data-k="b"]'), inl=el.querySelector('[data-k="l"]'), ob=el.querySelector('[data-o="b"]'), ol=el.querySelector('[data-o="l"]');
    const fr=(v,d)=>v.toFixed(d).replace('.',',');
    let b=.86, lam=650, t=0;
    const upd=()=>{ b=+inb.value/100; lam=+inl.value; ob.textContent='b = '+fr(b,2); ol.textContent=lam+' nm  (n = '+fr(D.nEau(lam),4)+')'; cap(); };
    inb.addEventListener('input',upd); inl.addEventListener('input',upd);
    const fres=(i,n)=>{ const r=Math.asin(Math.min(1,Math.sin(i)/n)), ci=Math.cos(i), cr=Math.cos(r), rs=(ci-n*cr)/(ci+n*cr), rp=(n*ci-cr)/(n*ci+cr); return (rs*rs+rp*rp)/2; };
    const alphaB=(bb,n)=>{ const i=Math.asin(bb), r=Math.asin(bb/n); return deg(4*r-2*i); };
    const alphaMax=n=>{ const ci=Math.sqrt((n*n-1)/3), i=Math.acos(ci), r=Math.asin(Math.sin(i)/n); return deg(4*r-2*i); };
    function cap(){ const n=D.nEau(lam), a=alphaB(Math.min(b,.9999),n), am=alphaMax(n); const bb=el.querySelector('.caption b'), ss=el.querySelector('.caption span');
      bb.textContent='Rayon à la hauteur '+fr(b,2)+' : il sort à '+fr(a,1)+'° du point opposé au Soleil';
      ss.textContent='Pour cette couleur, l’angle maximal est '+fr(am,1)+'°. Les rayons dont la hauteur est proche de 0,86 sortent presque parallèles : leur lumière s’accumule dans cette direction. Change la couleur : le maximum se déplace.'; }
    upd();
    /* ---- calcul des deux arcs (une fois) ---- */
    const A0=34, A1=46, NA=121, LS=[]; for(let l=400;l<=700;l+=20) LS.push(l);
    const alphas=[]; for(let k=0;k<NA;k++) alphas.push(A0+(A1-A0)*k/(NA-1));
    function pluie(){ const S=LS.map(l=>{ const n=D.nEau(l), sg=.2*Math.pow(l/550,2/3), out=[]; // sg en degrés
        const NB=1600, tab=[]; for(let q=1;q<NB;q++){ const bb=q/NB, i=Math.asin(bb), R=fres(i,n); tab.push([bb, alphaB(bb,n), (1-R)*(1-R)*R, 2*deg(i), R]); }
        for(const a of alphas){ let s=0; for(const [bb,al,w,ae,Rr] of tab){ const u=(a-al)/sg; if(Math.abs(u)<5) s+=bb*w*Math.exp(-.5*u*u)/(sg*2.5066); const v=(a-ae)/1.5; if(Math.abs(v)<4) s+=bb*Rr*Math.exp(-.5*v*v)/(1.5*2.5066)*.25; } out.push(s/Math.sin(rad(a))/NB); } return out; }); return S; }
    function nuage(){ const th=alphas.map(a=>rad(180-a)), r0=10e-6, fac=[.75,.8,.85,.9,.95,1,1.05,1.1,1.15,1.2,1.25]; return LS.map(l=>{ const out=new Array(NA).fill(0); fac.forEach(f=>{ const x=2*PI*r0*f/(l*1e-9), res=D.mie(x,[D.nEau(l),0],th); res.S1.forEach((s1,j)=>{ const s2=res.S2[j]; out[j]+=(s1[0]*s1[0]+s1[1]*s1[1]+s2[0]*s2[0]+s2[1]*s2[1])/2/(x*x)/fac.length; }); }); return out; }); }
    function bande(S){ const cols=[], Y=[]; for(let k=0;k<NA;k++){ const f=l=>{ const i=(l-400)/20, q=Math.min(LS.length-2,Math.max(0,Math.floor(i))), u=i-q; return (S[q][k]*(1-u)+S[q+1][k]*u)*D.sun(l); }; cols.push(D.color(f)); let y=0; for(let l=400;l<=700;l+=20) y+=f(l)*D.ybar(l); Y.push(y); }
      const ym=Math.max(...Y), srt=Y.slice().sort((a,b)=>a-b), med=srt[Math.floor(NA/2)]; let lo=0,hi=NA-1; const pk=Y.indexOf(ym); while(lo<NA-1&&Y[lo]<ym/2) lo++; hi=pk; while(hi<NA-1&&Y[hi]>=ym/2) hi++; let l2=pk; while(l2>0&&Y[l2]>=ym/2) l2--;
      return {cols,Y,ym,cont:ym/Math.max(med,1e-30),fwhm:(hi-l2)*(A1-A0)/(NA-1),pk:alphas[pk]}; }
    let RP=null, RN=null; try{ RP=bande(pluie()); RN=bande(nuage()); }catch(e){ console.error(e); }
    /* ---- trajet d'un rayon dans la goutte (repère écran, y vers le bas) ---- */
    const CX=138, CY=128, RD=86;
    function trajet(bb,n){ const i=Math.asin(bb), P=[[CX-RD*Math.cos(i),CY-RD*bb]], dirs=[]; let d=[1,0]; const out=[];
      const refr=(d,N,eta)=>{ const c=-(N[0]*d[0]+N[1]*d[1]), k=1-eta*eta*(1-c*c); if(k<0) return null; const f=eta*c-Math.sqrt(k); return [eta*d[0]+f*N[0],eta*d[1]+f*N[1]]; };
      let N=[(P[0][0]-CX)/RD,(P[0][1]-CY)/RD]; d=refr(d,N,1/n);
      for(let step=0;step<2;step++){ const p=P[P.length-1], s=-2*((d[0])*(p[0]-CX)+(d[1])*(p[1]-CY)); const q=[p[0]+s*d[0],p[1]+s*d[1]]; P.push(q); const no=[(q[0]-CX)/RD,(q[1]-CY)/RD]; if(step===0){ const dn=d[0]*no[0]+d[1]*no[1]; d=[d[0]-2*dn*no[0],d[1]-2*dn*no[1]]; } else { d=refr(d,[-no[0],-no[1]],n); } }
      return {P,d}; }
    L.onFrame(dt=>{
      if(!L.reduce) t+=dt*.55; const x=V.ctx; V.base(); L.bgLab(x,W,H);
      const n=D.nEau(lam), col=D.rgbStr(D.pure(lam)), PX=10;
      L.txt(x,'UNE GOUTTE DE PLUIE (1 mm), VUE DE CÔTÉ',PX,12,'left',C.ink,true);
      /* goutte + faisceau */
      x.save(); x.beginPath(); x.rect(PX,22,272,212); x.clip(); x.fillStyle='rgba(90,169,255,.12)'; x.beginPath(); x.arc(CX,CY,RD,0,7); x.fill(); x.strokeStyle='rgba(180,215,255,.8)'; x.lineWidth=1.4; x.stroke();
      const ray=(bb,hi)=>{ const tr=trajet(bb,n), P=tr.P, a0=[PX,CY-RD*bb]; const ex=P[2], ext=[ex[0]+tr.d[0]*260,ex[1]+tr.d[1]*260];
        x.beginPath(); x.moveTo(a0[0],a0[1]); [P[0],P[1],P[2]].forEach(p=>x.lineTo(p[0],p[1])); x.lineTo(ext[0],ext[1]); x.strokeStyle=hi?col:'rgba(255,255,255,.22)'; x.lineWidth=hi?2.4:1; x.stroke(); return tr; };
      for(let q=-9;q<=9;q++){ if(q===0) continue; const bb=q/10*.95; if(bb<0){ /* symétrique : trait simple, miroir vertical */ x.save(); x.translate(0,2*CY); x.scale(1,-1); ray(-bb,false); x.restore(); } else ray(bb,false); }
      ray(0.0001,false); const tr=ray(Math.min(b,.9999),true), P=tr.P;
      // impulsion lumineuse qui parcourt le rayon sélectionné
      const seg=[[PX,CY-RD*Math.min(b,.9999)],P[0],P[1],P[2],[P[2][0]+tr.d[0]*160,P[2][1]+tr.d[1]*160]], len=seg.slice(1).map((p,k)=>Math.hypot(p[0]-seg[k][0],p[1]-seg[k][1])), tot=len.reduce((a,c)=>a+c,0);
      for(let k=0;k<3;k++){ let u=((t+k/3)%1)*tot, q=0; while(q<len.length-1&&u>len[q]){ u-=len[q]; q++; } const f=u/len[q], px=seg[q][0]+(seg[q+1][0]-seg[q][0])*f, py=seg[q][1]+(seg[q+1][1]-seg[q][1])*f; x.beginPath(); x.arc(px,py,3.6,0,7); x.fillStyle='#fff'; x.fill(); x.beginPath(); x.arc(px,py,7,0,7); x.fillStyle=col+'55'; x.fill(); }
      // marques : entrée, fond, sortie
      L.tag(x,'entrée',P[0][0]-4,P[0][1]-14,'right','#fff'); L.tag(x,'fond : réflexion',P[1][0]-10,P[1][1]+4,'right','#fff'); L.tag(x,'sortie',P[2][0]+8,P[2][1]+(P[2][1]<CY?-12:12),'left','#fff');
      x.restore();
      L.arrow(x,PX+4,224,PX+46,224,'#FFD166',1.8); L.txt(x,'lumière du Soleil',PX+52,224,'left','#FFD166');
      /* courbe α(b) */
      const X0=322, X1=444, Y0=196, Y1=50, pxb=v=>X0+v*(X1-X0), pya=a=>Y0-(a/45)*(Y0-Y1);
      L.txt(x,'angle de sortie selon b',X0-40,34,'left',C.muted);
      L.line(x,X0,Y0,X1,Y0,'rgba(232,238,244,.4)',1); L.line(x,X0,Y0,X0,Y1-6,'rgba(232,238,244,.4)',1);
      [[650,'#FF6B6B'],[420,'#B58CFF']].forEach(([l,cc])=>{ const nn=D.nEau(l); x.beginPath(); for(let q=0;q<=200;q++){ const bb=q/200*.999, X=pxb(bb), Y=pya(alphaB(bb,nn)); q?x.lineTo(X,Y):x.moveTo(X,Y); } x.strokeStyle=cc; x.lineWidth=1.6; x.stroke(); const am=alphaMax(nn); x.setLineDash([3,3]); x.beginPath(); x.moveTo(X0,pya(am)); x.lineTo(X1,pya(am)); x.strokeStyle=cc+'aa'; x.lineWidth=1; x.stroke(); x.setLineDash([]); L.txt(x,fr(am,1)+'°',X0-4,pya(am)+(l===650?-5:6),'right',cc); });
      x.beginPath(); for(let q=0;q<=200;q++){ const bb=q/200*.999, X=pxb(bb), Y=pya(alphaB(bb,n)); q?x.lineTo(X,Y):x.moveTo(X,Y); } x.strokeStyle=col; x.lineWidth=2.2; x.stroke();
      const bs=Math.min(b,.999); x.beginPath(); x.arc(pxb(bs),pya(alphaB(bs,n)),4.5,0,7); x.fillStyle='#fff'; x.fill(); x.strokeStyle=col; x.lineWidth=2; x.stroke();
      [0,.5,1].forEach(v=>{ L.line(x,pxb(v),Y0,pxb(v),Y0+4,C.muted,1); L.txt(x,fr(v,1).replace(',0','').replace('0,5','0,5'),pxb(v),Y0+14,'center'); }); L.txt(x,'hauteur b du rayon',X1,Y0+27,'right',C.muted);
      L.txt(x,'rouge',X1,pya(alphaMax(D.nEau(650)))-10,'right','#FF6B6B'); L.txt(x,'violet',X1,pya(alphaMax(D.nEau(420)))+12,'right','#B58CFF');
      /* arcs */
      const AY=262; L.txt(x,'CE QUE TU VOIS DANS LE CIEL, LE SOLEIL DANS LE DOS',PX,AY-2,'left',C.ink,true);
      const panel=(px0,R,titre,sous)=>{ const w=215,h=130,py0=AY+12, cx=px0+w/2, cy=py0+h-4; x.save(); x.beginPath(); x.rect(px0,py0,w,h); x.clip(); const g=x.createLinearGradient(0,py0,0,py0+h); g.addColorStop(0,'#0f2742'); g.addColorStop(1,'#1d3550'); x.fillStyle=g; x.fillRect(px0,py0,w,h);
        if(R){ for(let k=0;k<NA;k++){ const a=alphas[k], rr=10+(a-A0)*8, c=R.cols[k], br=Math.pow(R.Y[k]/R.ym,.4), mix=v=>Math.round(15+(v-15)*br); x.beginPath(); x.arc(cx,cy,rr,PI,2*PI); x.strokeStyle='rgb('+mix(c[0])+','+mix(c[1])+','+mix(c[2])+')'; x.lineWidth=8*(A1-A0)/(NA-1)+.8; x.stroke(); } }
        x.restore(); x.strokeStyle='rgba(255,255,255,.25)'; x.lineWidth=1; x.strokeRect(px0+.5,py0+.5,w-1,h-1);
        L.txt(x,titre,px0,py0+h+14,'left',C.ink,true); L.txt(x,sous,px0,py0+h+30,'left',C.muted); };
      panel(PX,RP,'Gouttes de pluie (1 mm)',RP?'arc net, large de '+fr(RP.fwhm,1)+'°':'');
      panel(235,RN,'Gouttes de nuage (10 µm)',RN?'arc flou, large de '+fr(RN.fwhm,1)+'° (arc blanc)':'');
      L.txt(x,'Angle mesuré depuis le point opposé au Soleil : de 34° (intérieur) à 46° (extérieur).',PX,AY+196,'left',C.muted);
      L.txt(x,'Pluie : rouge dehors, violet dedans, bande sombre au-delà.',PX,AY+212,'left',C.ink); L.txt(x,'Nuage : toutes les couleurs se recouvrent, donc du blanc.',PX,AY+228,'left',C.ink);
      L.vignette(x,W,H); },V.cv);
  }
});
