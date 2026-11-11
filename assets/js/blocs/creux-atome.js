/* Bloc « creux-atome » : pourquoi l'électron ne tombe pas sur le noyau et n'est pas arraché.
   Modèle : atome d'hydrogène, énergie totale = agitation (13,6/r²) + attraction (−27,2/r), r en rayons de Bohr. */
Labo.defineBloc('creux-atome',{
  titre:'Le creux de l’atome',
  mount(el){
    const L=Labo, C=L.C;
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas style="aspect-ratio:400/250" aria-label="Nuage de l’électron autour d’un noyau, dont la taille change, et courbe de son énergie en fonction de la taille"></canvas></div>'+
      '<div class="lc"><button type="button" data-a="far">Lâcher l’électron loin</button><button type="button" data-a="near">Le coller contre le noyau</button>'+
      '<label class="slider"><span>Taille du nuage</span><input type="range" min="20" max="400" step="1" value="100"><strong>0,053 nm</strong></label></div>'+
      '<div class="caption"><b>Le creux de l’atome</b><span>L’attraction du noyau (bleu) gagne quand le nuage est grand, l’agitation de l’onde (orange) quand il est petit. Le total (blanc) a un creux : 0,053 nm pour l’hydrogène. L’électron y reste, comme une bille au fond d’un bol. Pour l’en sortir, il faut 13,6 eV d’un coup, 500 fois plus que l’agitation thermique à 20 °C.</span></div>'+
      '<div class="infobar"></div><div class="infobox" hidden></div></div>';
    const INFO={
      tombe:['Pourquoi il ne tombe pas sur le noyau','L’électron est une onde. La serrer dans un petit espace raccourcit ses ondulations, et une onde plus serrée transporte plus d’énergie de mouvement. Diviser la taille par 2 multiplie cette énergie par 4, alors que l’attraction ne gagne qu’un facteur 2. En dessous d’une certaine taille, se rapprocher coûte plus qu’il ne rapporte.'],
      agite:['L’agitation, ce n’est pas de la chaleur','C’est l’énergie de mouvement qui vient du simple fait d’être une onde enfermée (principe d’incertitude de Heisenberg). Elle existe même au zéro absolu.'],
      rayonne:['Pourquoi il ne rayonne pas en permanence','Au fond du creux, le nuage est immobile : sa forme ne change pas dans le temps. Rien n’oscille, donc pas d’antenne et pas de lumière émise. L’atome ne rayonne que pendant une transition entre deux formes.'],
      arrache:['Pourquoi il n’est pas arraché','Il faut 13,6 eV d’un coup pour l’hydrogène. L’agitation thermique à 20 °C ne fournit qu’environ 0,025 eV par choc, la lumière visible de 1,7 à 3 eV. Une flamme très chaude, un arc électrique ou des UV, eux, peuvent y arriver.'],
      rutherford:['Le modèle planétaire était faux','Un électron qui tournerait comme une planète serait une charge qui oscille : il rayonnerait, perdrait son énergie et s’écraserait sur le noyau en environ 10⁻¹¹ s. Ce paradoxe a mené à la mécanique quantique (Bohr 1913, Schrödinger 1926).'],
      simplif:['Ce qui est simplifié','Le calcul utilise une estimation simple de l’énergie d’une onde de taille r. Elle donne exactement la bonne taille (rayon de Bohr) et la bonne énergie (−13,6 eV) pour l’hydrogène. Pour les autres atomes, les autres électrons modifient le creux.']
    };
    L.infoBar(el.querySelector('.infobar'),el.querySelector('.infobox'),['tombe','agite','rayonne','arrache','rutherford','simplif'],INFO);
    const V=L.setup(el.querySelector('canvas'),400,250), inp=el.querySelector('input'), out=el.querySelector('.slider strong');
    const HP=[]; for(let k=0;k<1800;k++){ const r=-.5*Math.log(Math.random()*Math.random()*Math.random()+1e-9), a=Math.random()*Math.PI*2, u=2*Math.random()-1; HP.push([r*Math.sqrt(1-u*u)*Math.cos(a),r*Math.sqrt(1-u*u)*Math.sin(a)]); }
    const EK=r=>13.6/(r*r), EV=r=>-27.2/r, ET=r=>EK(r)+EV(r);
    let wr=3.5, wv=0, drag=false;
    el.querySelector('[data-a="far"]').onclick=()=>{ wr=3.6; wv=0; };
    el.querySelector('[data-a="near"]').onclick=()=>{ wr=.28; wv=0; };
    inp.addEventListener('input',()=>{ drag=true; wr=inp.value/100; wv=0; });
    inp.addEventListener('change',()=>{ drag=false; });
    L.onFrame(dt=>{
      if(!drag){ const h=.001, F=-(ET(wr+h)-ET(wr-h))/(2*h); wv+=(L.clamp(F,-60,60)*.45-1.7*wv)*dt; wr=L.clamp(wr+wv*dt,.2,4); if(wr<=.2||wr>=4) wv=0; inp.value=Math.round(wr*100); }
      out.textContent=(wr*.0529).toFixed(3).replace('.',',')+' nm';
      const x=V.ctx; V.base(); L.bgLab(x,400,250);
      const cx=112, cy=112, sc=26*wr, jig=.5+2.4/(wr*wr);
      x.save(); x.beginPath(); x.rect(0,0,230,212); x.clip();
      x.save(); x.globalCompositeOperation='lighter'; x.fillStyle='rgba(255,140,128,.32)'; x.beginPath();
      for(const p of HP){ const X=cx+p[0]*sc+(Math.random()-.5)*jig, Y=cy+p[1]*sc+(Math.random()-.5)*jig; x.rect(X-.7,Y-.7,1.4,1.4); } x.fill(); x.restore();
      L.glow(x,cx,cy,10,'#FFFFFF',.5); L.sph(x,cx,cy,3,'#F2F6FA'); x.restore();
      L.tag(x,'noyau',cx,cy+18,'center');
      const bs=1.6, bx=150, by=[220,232,244];
      [[EK(wr),'#FF9F43','agitation'],[EV(wr),'#5AA9FF','attraction'],[ET(wr),'#E8EEF4','total']].forEach(([v,col,lab],i)=>{ const w=L.clamp(v*bs,-100,100); x.fillStyle=col; x.fillRect(Math.min(bx,bx+w),by[i]-3,Math.abs(w),6); L.txt(x,lab,8,by[i],'left',col); });
      L.line(x,bx,214,bx,250,'rgba(232,238,244,.4)',1); L.txt(x,'0',bx,209,'center');
      L.rr(x,238,10,158,232,10,'rgba(255,255,255,.035)','rgba(232,238,244,.12)',1); L.txt(x,'Énergie (eV)',317,22,'center',C.ink,true);
      const X0=248,X1=388,Y0=226,Yt=36, mx=r=>X0+(r-.2)/3.8*(X1-X0), my=e=>Y0-(L.clamp(e,-30,30)+30)/60*(Y0-Yt);
      L.line(x,X0,my(0),X1,my(0),'rgba(232,238,244,.35)',1,[3,3]); L.txt(x,'0 : électron arraché',X1,my(0)+10,'right');
      [[EK,'#FF9F43'],[EV,'#5AA9FF'],[ET,'#E8EEF4']].forEach(([f,col])=>{ x.beginPath(); let st=false; for(let r=.2;r<=4;r+=.02){ const e=f(r); if(e>30||e<-30){ st=false; continue; } const X=mx(r),Y=my(e); st?x.lineTo(X,Y):x.moveTo(X,Y); st=true; } x.strokeStyle=col; x.lineWidth=col==='#E8EEF4'?2:1.3; x.stroke(); });
      L.line(x,mx(1),my(-13.6),mx(1),my(0),C.hole,1,[2,2]); L.txt(x,'13,6 eV',mx(1)+4,my(-10),'left',C.hole);
      L.txt(x,'taille du nuage →',X1,Y0+10,'right');
      const bxx=mx(wr), byy=my(ET(wr)); L.glow(x,bxx,byy-5,14,'#FFFFFF',.35); L.sph(x,bxx,byy-5,5,'#E8EEF4');
      if(wr<.6) L.tag(x,'Trop serré : l’onde s’agite',8,20,'left','#FF9F43');
      else if(wr>2.2) L.tag(x,'Trop loin : le noyau le rappelle',8,20,'left','#5AA9FF');
      else if(Math.abs(wr-1)<.12&&Math.abs(wv)<.1) L.tag(x,'Au fond du creux : l’atome',8,20,'left',C.ink);
    },el);
  }
});
