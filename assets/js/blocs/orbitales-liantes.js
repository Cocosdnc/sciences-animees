/* Bloc « orbitales-liantes » : orbitale liante et antiliante obtenues en additionnant les ondes de deux atomes.
   Modèle exact le plus simple : un électron et deux noyaux (ion H₂⁺), ondes 1s, combinaison linéaire (méthode LCAO).
   Unités : rayon de Bohr a₀ = 0,053 nm ; énergies en eV. */
Labo.defineBloc('orbitales-liantes',{
  titre:'Orbitale liante, orbitale antiliante',
  mount(el){
    const L=Labo, C=L.C, POS='#FF8A80', NEG='#6FB6FF';
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas style="aspect-ratio:400/300" aria-label="Ondes de deux atomes, leur somme le long de la liaison, le nuage obtenu et la courbe d’énergie"></canvas></div>'+
      '<div class="lc"><div class="seg" role="group" aria-label="Façon d’additionner les ondes"><button type="button" data-m="1" aria-pressed="true">Ondes en phase : liante</button><button type="button" data-m="-1" aria-pressed="false">En opposition : antiliante</button></div>'+
      '<button type="button" data-a="go">Rapprocher les atomes</button><button type="button" data-a="pot" aria-pressed="false">Montrer l’attraction des noyaux</button>'+
      '<label class="slider"><span>Distance entre les noyaux</span><input type="range" min="10" max="70" step="1" value="60"><strong></strong></label></div>'+
      '<div class="caption"><b></b><span></span></div>'+
      '<div class="infobar"></div><div class="infobox" hidden></div></div>';
    const INFO={
      orbitale:['Qu’est-ce qu’une orbitale ?','C’est la forme de l’onde de l’électron. En chaque point, l’onde a une valeur, positive ou négative (rouge ou bleu). Son carré donne la probabilité de trouver l’électron à cet endroit : c’est le nuage. Une orbitale « de liaison » est simplement l’onde d’un électron partagé par deux noyaux.'],
      somme:['Pourquoi additionner les ondes ?','Quand l’électron est proche des deux noyaux, son onde ressemble près de chacun à l’onde de l’atome seul. La façon la plus simple de construire l’onde commune est d’additionner les deux ondes atomiques. Une onde peut s’ajouter avec le même signe ou avec le signe inverse : ça donne exactement deux résultats, l’orbitale liante et l’orbitale antiliante.'],
      signe:['Le signe de l’onde','Une onde monte et descend. Rouge = au-dessus de zéro, bleu = en dessous. Le signe ne se voit pas directement (le nuage, c’est le carré, toujours positif), mais il décide de ce qui arrive quand deux ondes se rencontrent : même signe, elles se renforcent ; signes opposés, elles s’annulent.'],
      noeud:['Le nœud','Dans l’orbitale antiliante, l’onde passe de rouge à bleu au milieu : elle vaut exactement zéro sur un plan entre les deux noyaux. L’électron n’y est jamais. Or c’est justement là qu’il serait le plus attiré.'],
      energie:['Pourquoi l’une lie et l’autre pas','Active « Montrer l’attraction des noyaux » : le creux le plus profond est entre les deux noyaux, là où l’électron est attiré par les deux. L’orbitale liante met beaucoup de nuage dans ce creux : énergie plus basse que l’atome seul, les atomes restent ensemble. L’antiliante vide cette zone : énergie plus haute, les atomes se repoussent.'],
      oscille:['Pourquoi la courbe oscille mais pas le nuage','Une onde stationnaire change de signe en permanence : la courbe du haut monte et descend partout en même temps. Le nuage, lui, est le carré de l’onde : il reste immobile. Seule la forme compte pour la liaison.'],
      exact:['Ce qui est exact, ce qui est simplifié','Les courbes et le nuage sont calculés, pas dessinés à la main : ondes 1s de l’hydrogène, additionnées, puis normalisées. Les énergies sont celles du calcul classique de l’ion H₂⁺ (un électron, deux protons). Le calcul exact donne une liaison un peu plus forte (2,8 eV au lieu d’environ 1,8 eV). Pour Ga–P, les ondes de départ sont des orbitales sp³, mais le principe est le même.'],
      cristal:['Et dans le cristal ?','Dans un cristal, chaque atome a 4 voisins et des milliards de liaisons se couplent. Les orbitales liantes de tout le cristal forment l’étage bas (bande de valence), les antiliantes l’étage haut (bande de conduction). L’écart entre les deux, c’est le gap : 1,9 eV dans la zone active de la diode.']
    };
    L.infoBar(el.querySelector('.infobar'),el.querySelector('.infobox'),['orbitale','somme','signe','noeud','energie','exact','cristal'],INFO);
    const V=L.setup(el.querySelector('canvas'),400,300), inp=el.querySelector('input'), out=el.querySelector('.slider strong');
    let sg=1, R=6, Rt=6, pot=false, t=0, cacheKey='', img=null;
    const EH=27.211;
    const S=R=>Math.exp(-R)*(1+R+R*R/3);
    const Epm=(R,s)=>{ const j=(1-(1+R)*Math.exp(-2*R))/R, k=(1+R)*Math.exp(-R); return (-.5+1/R-(j+s*k)/(1+s*S(R)))*EH; };
    const ref=-.5*EH;
    const psi=(x,y,R,s)=>{ const a=Math.exp(-Math.hypot(x+R/2,y)), b=Math.exp(-Math.hypot(x-R/2,y)); return (a+s*b)/Math.sqrt(2*Math.PI*(1+s*S(R))); };
    const phiA=(x,R)=>Math.exp(-Math.abs(x+R/2))/Math.sqrt(2*Math.PI*(1+sg*S(R))), phiB=(x,R)=>sg*Math.exp(-Math.abs(x-R/2))/Math.sqrt(2*Math.PI*(1+sg*S(R)));
    const cap=()=>{ const b=el.querySelector('.caption b'), s=el.querySelector('.caption span'), dE=Epm(R,sg)-ref, near=R<3.6;
      if(sg>0){ b.textContent='Liante : les deux ondes ont le même signe';
        s.textContent=near?'Entre les noyaux, les deux ondes rouges s’additionnent : l’onde commune (trait épais) s’y renforce, et le nuage se concentre entre les deux noyaux. L’électron passe beaucoup de temps là où il est attiré par les deux : son énergie est '+Math.abs(dE).toFixed(1).replace('.',',')+' eV plus basse que dans l’atome seul. Les atomes restent liés.':'Loin l’un de l’autre, chaque atome garde son onde. Rapproche-les et regarde ce que devient leur somme entre les deux noyaux.'; }
      else { b.textContent='Antiliante : les deux ondes ont des signes opposés';
        s.textContent=near?'Entre les noyaux, l’onde rouge et l’onde bleue s’annulent : l’onde commune passe par zéro au milieu (un nœud), et le nuage est repoussé vers l’extérieur. L’électron évite la zone la plus attractive : son énergie est '+(dE>0?dE.toFixed(1).replace('.',',')+' eV plus haute':'à peine plus basse')+' que dans l’atome seul. Les atomes se repoussent.':'Loin l’un de l’autre, le signe ne change rien. Rapproche-les : là où elles se chevauchent, les deux ondes vont s’annuler.'; } };
    el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{ sg=+b.dataset.m; el.querySelectorAll('[data-m]').forEach(c=>c.setAttribute('aria-pressed',c===b)); cap(); });
    el.querySelector('[data-a="go"]').onclick=()=>{ R=6.5; Rt=sg>0?2.5:2.5; };
    el.querySelector('[data-a="pot"]').onclick=e=>{ pot=!pot; e.currentTarget.setAttribute('aria-pressed',pot); };
    inp.addEventListener('input',()=>{ R=Rt=inp.value/10; cap(); });
    const off=document.createElement('canvas'); off.width=140; off.height=40; const ox=off.getContext('2d'), id=ox.createImageData(140,40);
    const PX=28, CX=145, Y1=100, Y2=210;
    const sx=x=>CX+x*PX;
    L.onFrame(dt=>{ t+=dt;
      if(Math.abs(R-Rt)>.005){ R+=(Rt-R)*Math.min(1,dt*1.4); inp.value=Math.round(R*10); cap(); }
      out.textContent=(R*.0529).toFixed(2).replace('.',',')+' nm';
      const x=V.ctx; V.base(); L.bgLab(x,400,300);
      const os=1;
      x.save(); x.beginPath(); x.rect(0,0,290,300); x.clip();
      L.txt(x,'L’onde le long de la liaison',8,14,'left',C.ink,true);
      L.line(x,6,Y1,284,Y1,'rgba(232,238,244,.3)',1);
      if(pot){ x.beginPath(); for(let i=0;i<=280;i++){ const xx=(i-139)/PX, v=-1/Math.max(.15,Math.abs(xx+R/2))-1/Math.max(.15,Math.abs(xx-R/2)); const yy=Y1+L.clamp(-v*10,0,40)+2; i?x.lineTo(5+i,yy):x.moveTo(5+i,yy); }
        x.strokeStyle='rgba(90,169,255,.75)'; x.setLineDash([4,3]); x.lineWidth=1.3; x.stroke(); x.setLineDash([]);
        L.tag(x,'tirets bleus : attraction des noyaux (plus bas = plus attiré)',284,46,'right',C.blue); }
      const AMP=110;
      [[phiA,POS],[phiB,sg>0?POS:NEG]].forEach(([f,col])=>{ x.beginPath(); for(let i=0;i<=280;i++){ const xx=(i-140)/PX, v=f(xx,R)*os; const yy=Y1-v*AMP; i?x.lineTo(5+i,yy):x.moveTo(5+i,yy); } x.strokeStyle=L.rgba(col,.55); x.setLineDash([3,3]); x.lineWidth=1.2; x.stroke(); x.setLineDash([]); });
      let prev=null; for(let i=0;i<=280;i++){ const xx=(i-140)/PX, v=(phiA(xx,R)+phiB(xx,R))*os, X=5+i, Yv=Y1-v*AMP;
        if(prev){ x.beginPath(); x.moveTo(prev[0],prev[1]); x.lineTo(X,Yv); x.strokeStyle=v>=0?POS:NEG; x.lineWidth=2.6; x.stroke(); } prev=[X,Yv]; }
      [-1,1].forEach(sd=>{ const X=sx(sd*R/2); L.glow(x,X,Y1,10,'#FFFFFF',.5); L.sph(x,X,Y1,3,'#F2F6FA'); });
      L.txt(x,'pointillés : onde de chaque atome · trait épais : leur somme',8,30,'left',C.muted);
      if(sg<0&&R<4.2){ L.line(x,CX,Y1-50,CX,Y2+40,'rgba(111,182,255,.5)',1,[2,3]); L.tag(x,'nœud : l’onde vaut zéro, l’électron n’y est jamais',CX,284,'center',NEG); }
      const key=sg+'|'+R.toFixed(3);
      if(key!==cacheKey){ cacheKey=key; let mx=0; const vals=new Float32Array(140*40);
        for(let j=0;j<40;j++) for(let i=0;i<140;i++){ const xx=(i-69.5)*2/PX, yy=(j-19.5)*2/PX, v=psi(xx,yy,R,sg); vals[j*140+i]=v*v; mx=Math.max(mx,v*v); }
        const D=id.data;
        for(let k=0;k<vals.length;k++){ const a0=Math.min(1,vals[k]/Math.max(mx,1e-9)), a=Math.floor(Math.pow(a0,.8)*6)/6; D[k*4]=255; D[k*4+1]=Math.round(140+80*a); D[k*4+2]=Math.round(128+90*a); D[k*4+3]=Math.round(255*Math.pow(a,.7)); }
        ox.putImageData(id,0,0); }
      L.txt(x,'Le nuage (probabilité de présence), vu en coupe',8,Y2-50,'left',C.ink,true); L.txt(x,'chaque teinte = même probabilité',282,Y2-36,'right',C.muted);
      x.save(); x.globalCompositeOperation='lighter'; x.imageSmoothingEnabled=true; x.drawImage(off,CX-140,Y2-40,280,80); x.restore();
      [-1,1].forEach(sd=>{ const X=sx(sd*R/2); L.sph(x,X,Y2,2.6,'#F2F6FA'); });
      if(R<4.2&&sg>0) L.tag(x,'nuage gonflé entre les noyaux',CX,Y2+56,'center',POS); else if(R<4.2) L.tag(x,'nuage vidé au milieu, repoussé vers l’extérieur',CX,Y2+56,'center',NEG);
      x.restore();
      L.rr(x,294,8,102,284,10,'rgba(255,255,255,.035)','rgba(232,238,244,.12)',1);
      L.txt(x,'Énergie (eV)',345,22,'center',C.ink,true);
      const X0=302,X1=390,Ytop=40,Ybot=250, mxR=r=>X0+(r-1)/(7-1)*(X1-X0);
      const yE=e=>Ybot-(L.clamp(e-ref,-4,8)+4)/12*(Ybot-Ytop);
      L.line(x,X0,yE(ref),X1,yE(ref),'rgba(232,238,244,.35)',1,[3,3]); L.txt(x,'atome seul',X1,yE(ref)-8,'right');
      [[1,POS],[-1,NEG]].forEach(([s2,col])=>{ x.beginPath(); let st=false; for(let r=1;r<=7;r+=.05){ const e=Epm(r,s2); if(e-ref>8){ st=false; continue; } const X=mxR(r),Y=yE(e); st?x.lineTo(X,Y):x.moveTo(X,Y); st=true; }
        x.strokeStyle=col; x.globalAlpha=s2===sg?1:.35; x.lineWidth=s2===sg?2:1.2; x.stroke(); x.globalAlpha=1; });
      L.txt(x,'antiliante',X0,yE(Epm(1.6,-1))-2,'left',NEG); L.txt(x,'liante',mxR(4),yE(Epm(4,1))+14,'left',POS);
      const bX=mxR(L.clamp(R,1,7)), bY=yE(Epm(R,sg)); L.glow(x,bX,bY,12,'#FFFFFF',.35); L.sph(x,bX,bY,4.5,'#E8EEF4');
      L.line(x,X0,Ybot+8,X1,Ybot+8,C.muted,.8); L.txt(x,'distance →',X1,Ybot+20,'right');
      L.txt(x,'bas = stable',345,Ybot+34,'center',C.muted);
    },el);
    cap();
  }
});
