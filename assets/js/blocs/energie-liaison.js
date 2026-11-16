/* Bloc « energie-liaison » : pourquoi l'énergie baisse (liante) ou monte (antiliante), et où part l'énergie.
   Modèle exact le plus simple : un électron, deux protons (ion H₂⁺), ondes 1s combinées (méthode LCAO).
   Énergies en eV, comptées à partir de deux atomes séparés. a₀ = 0,0529 nm. Les noyaux obéissent à la
   mécanique de Newton dans le potentiel créé par l'électron (approximation de Born-Oppenheimer). */
Labo.defineBloc('energie-liaison',{
  titre:'Pourquoi l’énergie baisse, et où elle part',
  mount(el){
    const L=Labo, C=L.C, A0=.0529, EH=27.211, RED='#FF8A80', BLU='#6FB6FF';
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas style="aspect-ratio:400/330" aria-label="Courbes d’énergie de la liante et de l’antiliante en fonction de la distance entre noyaux, et deux noyaux qui oscillent ou s’éloignent"></canvas></div>'+
      '<div class="lc"><div class="seg" role="group" aria-label="Orbitale"><button type="button" data-m="1" aria-pressed="true">Liante</button><button type="button" data-m="-1" aria-pressed="false">Antiliante</button></div>'+
      '<button type="button" data-a="go" class="primary">Lâcher les atomes</button>'+
      '<button type="button" data-a="brake" aria-pressed="false">Un troisième corps emporte l’énergie</button>'+
      '<button type="button" data-a="T" aria-pressed="false">Montrer l’agitation de l’électron</button></div>'+
      '<div class="caption" aria-live="polite"><b></b><span></span></div>'+
      '<div class="infobar"></div><div class="infobox" hidden></div></div>';
    const INFO={
      energie:['Où part l’énergie ?','Elle ne disparaît pas : l’énergie de l’électron baisse quand les atomes se rapprochent, et la différence devient de l’énergie de mouvement des noyaux (la barre verte). Sans rien d’autre, ils dépassent la bonne distance, repartent, et la molécule se redivise : l’énergie totale reste la même, comme une bille qui roule dans un bol sans frottement. Pour que la liaison tienne, il faut évacuer cette énergie : par un choc avec une troisième particule ou une paroi, ou par un photon. Pour H₂ le photon est presque impossible, et dans l’espace H₂ se forme surtout à la surface de grains de poussière.'],
      photon:['Pourquoi pas un photon ?','Pour émettre de l’infrarouge en vibrant, une molécule doit avoir un moment dipolaire électrique qui change pendant la vibration. H₂, N₂ et O₂ sont symétriques : leur dipôle reste nul, donc pas de photon. La lumière visible les secoue quand même, car son champ crée un dipôle dans leur nuage : c’est la diffusion de Rayleigh.'],
      agitation:['Pourquoi la liante baisse','Étalée sur les deux atomes, l’onde est plus longue : l’électron est moins serré, donc moins agité. Les tirets montrent l’énergie d’agitation (énergie cinétique) : pour la liante elle baisse de plus de 3 eV vers 0,13 nm, et pour l’antiliante, dont l’onde est coupée par un zéro, elle monte beaucoup. Ce n’est pas toute l’histoire : en s’étalant, l’électron s’éloigne des noyaux et est moins attiré, ce qui remonte l’énergie totale. Le bilan donne ici −1,8 eV. C’est l’analyse de Ruedenberg (1962) pour H₂⁺ et H₂.'],
      deuxe:['Et avec deux électrons ?','Pour H₂, les deux électrons vont dans la liante (spins opposés) et la liaison vaut environ 4,5 eV, plus que pour H₂⁺ car chaque électron attire l’autre vers les noyaux. Pour He₂, quatre électrons : deux dans la liante, deux dans l’antiliante, qui monte plus que la liante ne descend. Pas de liaison.'],
      exact:['Ce qui est exact, ce qui est simplifié','Courbes calculées avec les ondes 1s de l’hydrogène combinées (méthode LCAO) pour un seul électron : creux de 1,8 eV à 0,13 nm. Le calcul exact donne 2,8 eV à 0,106 nm : le modèle est correct mais approché. Simplifié aussi : le frottement qui représente l’énergie emportée est continu, alors qu’un vrai choc est ponctuel ; le mouvement des noyaux est ralenti d’environ 10¹⁴ fois.']
    };
    L.infoBar(el.querySelector('.infobar'),el.querySelector('.infobox'),['energie','photon','agitation','deuxe','exact'],INFO);
    const W=400,H=330, V=L.setup(el.querySelector('canvas'),W,H);
    const S=R=>Math.exp(-R)*(1+R+R*R/3);
    const Ha=(R,s)=>{ const j=(1-(1+R)*Math.exp(-2*R))/R, k=(1+R)*Math.exp(-R); return -.5+1/R-(j+s*k)/(1+s*S(R)); };   // hartree
    const Ta=(R,s)=>{ const K=(1+R)*Math.exp(-R); return (.5+s*(K-S(R)/2))/(1+s*S(R)); };
    const Ee=(R,s)=>(Ha(R,s)+.5)*EH, Te=(R,s)=>(Ta(R,s)-.5)*EH;   // eV, depuis deux atomes séparés
    const MU=918.076, TS=450;   // masse réduite des deux protons (u.a.) ; unités atomiques de temps par seconde affichée
    // repère du graphique
    const GX0=44, GX1=392, GY0=18, GY1=174, RMIN=.5, RMAX=8, EMIN=-3.5, EMAX=7;
    const gx=R=>GX0+(R-RMIN)/(RMAX-RMIN)*(GX1-GX0), gy=E=>GY1-(E-EMIN)/(EMAX-EMIN)*(GY1-GY0);
    let s=1, R=7, v=0, run=false, brake=false, showT=false, t=0;
    const state=()=>{ const V0=Ee(R,s), K=.5*MU*v*v*EH; return {V0,K,E:V0+K}; };
    const caption=()=>{ const b=el.querySelector('.caption b'), c=el.querySelector('.caption span'), st=state();
      const fmt=x=>x.toFixed(2).replace('.',',').replace('-','−');
      if(s>0){
        if(!run&&R===7){ b.textContent='Liante : le creux de l’énergie'; c.textContent='Plus les noyaux se rapprochent, plus l’énergie baisse, jusqu’à un creux de 1,8 eV vers 0,13 nm. Lâche les atomes et regarde où va cette énergie.'; }
        else if(brake&&Math.abs(v)<4e-5&&Math.abs(R-2.49)<.12){ b.textContent='La liaison tient'; c.textContent='Le troisième corps a emporté l’énergie : les noyaux restent à 0,13 nm. Pour casser la liaison, il faudra rendre ces 1,8 eV (modèle simple ; 4,5 eV pour H₂).'; }
        else if(brake){ b.textContent='L’énergie part dans le troisième corps'; c.textContent='L’énergie totale (trait horizontal) baisse à chaque frottement : les noyaux oscillent de moins en moins, puis se posent au fond du creux.'; }
        else { b.textContent='L’énergie ne disparaît pas'; c.textContent='L’électron perd de l’énergie, les noyaux la gagnent (barre verte) : ils accélèrent, dépassent le fond, puis repartent. Sans rien pour évacuer l’énergie totale (ligne pointillée), la molécule se redivise.'; } }
      else { b.textContent='Antiliante : l’énergie monte'; c.textContent=run?'L’électron n’a rien à gagner à rapprocher les noyaux : l’énergie baisse quand ils s’éloignent. Ils se repoussent et partent chacun de leur côté.':'À toutes les distances, l’énergie est au-dessus de celle de deux atomes séparés. Lâche les atomes : ils se repoussent.'; } };
    el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{ s=+b.dataset.m; el.querySelectorAll('[data-m]').forEach(c=>c.setAttribute('aria-pressed',c===b)); run=false; R=s>0?7:2.2; v=0; caption(); });
    el.querySelector('[data-a="go"]').onclick=()=>{ R=s>0?7:2.2; v=0; run=true; caption(); };
    el.querySelector('[data-a="brake"]').onclick=e=>{ brake=!brake; e.currentTarget.setAttribute('aria-pressed',brake); caption(); };
    el.querySelector('[data-a="T"]').onclick=e=>{ showT=!showT; e.currentTarget.setAttribute('aria-pressed',showT); };
    // densité 1D le long de l'axe, pour le petit nuage du bas
    const off=document.createElement('canvas'); off.width=160; off.height=22; const oc=off.getContext('2d'), im=oc.createImageData(160,22);
    const BXC=200, BYC=262, BPX=22;
    function cloud(){ const col=s<0?[111,182,255]:[255,138,128], Rr=Math.min(R,10), nrm=1/(2*(1+s*S(Rr)));
      for(let j=0;j<22;j++) for(let i=0;i<160;i++){ const x=(i*2.5-200)/BPX, z=(j-11)*2.5/BPX;
        const a=Math.exp(-Math.hypot(x+Rr/2,z)), b=Math.exp(-Math.hypot(x-Rr/2,z)), d=(a+s*b)*(a+s*b)*nrm*2, q=Math.pow(Math.min(1,d/1.3),.55), k=(j*160+i)*4;
        im.data[k]=col[0]*q; im.data[k+1]=col[1]*q; im.data[k+2]=col[2]*q; im.data[k+3]=255; }
      oc.putImageData(im,0,0); }
    caption();
    L.onFrame(dt=>{
      t+=dt;
      if(run){ const n=10, h=Math.min(dt,.05)*TS/n, f=r=>-(Ha(r+1e-3,s)-Ha(r-1e-3,s))/2e-3/MU;
        for(let i=0;i<n;i++){ v+=f(R)*h/2; if(brake) v*=Math.exp(-.0015*h); R+=v*h; if(R<.45){ R=.45; v=Math.abs(v); } v+=f(R)*h/2; }
        if(R>14){ R=14; v=0; run=false; }
        if(brake&&s>0&&Math.abs(v)<4e-5&&Math.abs(R-2.49)<.12){ run=false; v=0; }
        caption(); }
      const x=V.ctx; V.base(); L.bgLab(x,W,H);
      // axes
      L.line(x,GX0,GY1,GX1,GY1,'rgba(232,238,244,.3)',1); L.line(x,GX0,GY0,GX0,GY1,'rgba(232,238,244,.3)',1);
      [.05,.1,.2,.3,.4].forEach(nm=>{ const X=gx(nm/A0); L.line(x,X,GY1,X,GY1+4,C.muted,1); L.txt(x,String(nm).replace('.',','),X,GY1+13,'center'); });
      L.txt(x,'distance entre les noyaux (nm)',(GX0+GX1)/2,GY1+26,'center');
      [-2,0,2,4,6].forEach(E=>{ L.line(x,GX0-3,gy(E),GX0,gy(E),C.muted,1); L.txt(x,String(E).replace('-','−'),GX0-6,gy(E),'right'); });
      L.txt(x,'énergie (eV)',GX0+4,GY0-6,'left',C.ink,true);
      L.line(x,GX0,gy(0),GX1,gy(0),'rgba(232,238,244,.45)',1,[4,4]); L.tag(x,'deux atomes séparés',GX1,gy(0)-11,'right',C.muted);
      const plot=(fn,col,lw,dash)=>{ x.beginPath(); let on=false; for(let i=0;i<=200;i++){ const r=RMIN+(RMAX-RMIN)*i/200, e=fn(r); if(e>EMAX+.5){ on=false; continue; } const X=gx(r), Y=Math.max(GY0,gy(e)); on?x.lineTo(X,Y):x.moveTo(X,Y); on=true; }
        x.strokeStyle=col; x.lineWidth=lw; x.setLineDash(dash||[]); x.stroke(); x.setLineDash([]); };
      plot(r=>Ee(r,1),RED,s>0?2.6:1.3); plot(r=>Ee(r,-1),BLU,s<0?2.6:1.3);
      if(showT){ plot(r=>Te(r,s),s>0?'#FFB4AC':'#A8D2FF',1.6,[4,3]); L.tag(x,'agitation de l’électron (tirets)',GX1,gy(Te(5,s))-(s>0?0:0)+(s>0?16:-16),'right',C.ink); }
      L.tag(x,'liante',gx(5.6),gy(Ee(5.6,1))+16,'center',RED); L.tag(x,'antiliante',gx(4.6),gy(Ee(4.6,-1))-14,'center',BLU);
      // état courant
      const st=state(), Rc=Math.min(R,RMAX), X=gx(Rc), Yv=Math.min(GY1,Math.max(GY0,gy(st.V0)));
      if(run||R!==7&&R!==2.2){ L.line(x,GX0,gy(st.E),GX1,gy(st.E),'rgba(120,230,150,.7)',1.2,[5,4]); }
      L.glow(x,X,Yv,12,s>0?RED:BLU,.5); x.beginPath(); x.arc(X,Yv,4.5,0,7); x.fillStyle='#fff'; x.fill();
      // les noyaux et le nuage
      cloud(); x.save(); x.imageSmoothingEnabled=true; x.globalAlpha=.95; x.drawImage(off,BXC-200,BYC-27,400,55); x.restore();
      for(const q of [-1,1]){ const nx=BXC+q*Math.min(R,10)/2*BPX; L.sph(x,nx,BYC,5.5,'#E8EEF4'); }
      L.txt(x,'les deux noyaux et le nuage de l’électron',8,BYC-38,'left',C.ink,true);
      // barres d'énergie
      const bw=v=>Math.min(1,Math.abs(v)/6)*150;
      L.txt(x,'énergie de mouvement des noyaux',8,H-34,'left',C.muted);
      x.fillStyle='rgba(120,230,150,.85)'; x.fillRect(8,H-24,bw(st.K),9);
      L.txt(x,st.K.toFixed(2).replace('.',',')+' eV',12+bw(st.K),H-19,'left',C.ink);
      L.txt(x,'énergie totale : '+st.E.toFixed(2).replace('.',',').replace('-','−')+' eV',W-8,H-19,'right',C.ink);
      L.vignette(x,W,H); }, V.cv);
  }
});
