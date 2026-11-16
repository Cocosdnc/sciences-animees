/* Bloc « molecule-secouee » : une molécule d'azote N₂ dans une onde lumineuse.
   Niveau 1 : la molécule est secouée par le champ de la lumière (nuage d'électrons et noyaux dans des sens opposés).
              On règle la couleur et l'orientation de la molécule : le dipôle induit n'est pas toujours parallèle au champ,
              et la lumière rayonnée dépend de l'orientation (polarisabilité de N₂ : 2,38 Å³ le long de la liaison, 1,45 Å³ en travers).
   Niveau 2 : deux dipôles de même amplitude, l'un rouge, l'autre à la couleur choisie : l'accélération croît comme ω², la puissance comme ω⁴.
   Niveau 3 : mesures réelles pour l'air (Bodhaine 1999). */
Labo.defineBloc('molecule-secouee',{
  titre:'Une molécule d’air secouée par la lumière',
  mount(el){
    const L=Labo, C=L.C, D=window.Diff;
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas style="aspect-ratio:460/340" aria-label="Une molécule d’azote dans une onde lumineuse : son nuage d’électrons et ses noyaux oscillent en sens opposés et la molécule réémet de la lumière ; l’intensité dépend de l’orientation de la molécule"></canvas></div>'+
      '<div class="lc"><div class="seg" role="group" aria-label="Niveau"><button type="button" data-n="1" aria-pressed="true">1. Secouée</button><button type="button" data-n="2" aria-pressed="false">2. Pourquoi plus de bleu</button><button type="button" data-n="3" aria-pressed="false">3. Mesures</button></div>'+
      '<label class="slider"><span>Longueur d’onde</span><input type="range" min="380" max="750" step="1" value="450" data-k="lam"><strong></strong></label>'+
      '<label class="slider" data-o><span>Orientation de la molécule</span><input type="range" min="0" max="180" step="1" value="35" data-k="a"><strong></strong></label>'+
      '<button type="button" data-o data-a="rot" aria-pressed="false">Faire tourner la molécule</button></div>'+
      '<div class="caption" aria-live="polite"><b></b><span></span></div>'+
      '<div class="infobar"></div><div class="infobox" hidden></div></div>';
    const INFO={
      induit:['Comment un dipôle se crée','Une molécule de diazote est neutre : sa charge positive (les noyaux) et sa charge négative (le nuage d’électrons) sont centrées au même endroit. Dans le champ électrique de la lumière, le nuage, léger, est poussé dans le sens opposé au champ, les noyaux dans l’autre sens. Les centres des deux charges se décalent : la molécule devient un dipôle, de moment p, qui n’existait pas avant. Plus le champ est fort, plus le décalage est grand : p = α·E, où α est la polarisabilité. Quand le champ s’inverse, le décalage s’inverse aussi : le dipôle oscille à la fréquence de la lumière.'],
      noyaux:['Les noyaux bougent-ils aussi ?','Oui, dans l’autre sens : le champ pousse les charges positives avec la même force que les négatives. Mais un noyau d’azote est environ 25 000 fois plus lourd qu’un électron et porte 7 charges : il accélère environ 4 000 fois moins. À la fréquence de la lumière (5·10¹⁴ oscillations par seconde), il a à peine le temps de bouger. C’est donc le nuage qui fait presque tout le dipôle. Sur le dessin, le déplacement des noyaux est exagéré pour qu’on le voie.'],
      reemet:['Pourquoi elle réémet de la lumière','Une charge qui oscille rayonne : c’est le principe de toute antenne. La molécule émet une onde de même fréquence que celle qui l’a secouée, dans toutes les directions sauf dans l’axe du dipôle (dans cet axe, un dipôle n’émet rien) : le diagramme de rayonnement est un « huit » autour du dipôle. La lumière n’est pas absorbée, elle est déviée. C’est ça, la diffusion de Rayleigh.'],
      orient:['Pourquoi l’orientation compte','N₂ n’est pas une sphère : son nuage est plus facile à déformer le long de la liaison (α∥ = 2,38 Å³) qu’en travers (α⊥ = 1,45 Å³). Si le champ est incliné par rapport à la liaison, le nuage est donc plus poussé selon la liaison que selon le travers, et le dipôle n’est pas parallèle au champ : il est tiré vers l’axe de la molécule. Résultat sur la lumière rayonnée : la puissance dépend de l’orientation, 2,7 fois plus forte quand la liaison est parallèle au champ que quand elle est perpendiculaire (2,38²/1,45²). Dans l’air, les molécules sont orientées au hasard : l’effet moyen est le « facteur de King » (1,048 pour l’air), une augmentation de 4,8 % de la diffusion. Il y a aussi une petite fraction de diffusion Raman : la molécule échange de l’énergie de rotation avec la lumière, qui change légèrement de couleur.'],
      omega4:['Pourquoi ω⁴, donc 1/λ⁴','Deux étapes. 1. Le dipôle a presque la même amplitude pour toutes les couleurs du visible (sa résonance est loin, dans l’ultraviolet). 2. Une charge qui oscille plus vite est plus fortement accélérée : l’accélération est ω²·(amplitude). Or le champ rayonné est proportionnel à l’accélération de la charge, et la puissance au carré de ce champ : P ∝ (ω²)² = ω⁴. Le bleu à 450 nm oscille 1,44 fois plus vite que le rouge à 650 nm : sa puissance est 1,44⁴ ≈ 4,3 fois plus grande.'],
      accel:['Lire l’animation','Pour chaque couleur, la courbe blanche est le déplacement du nuage, avec la même amplitude pour les deux. La courbe colorée est l’accélération : c’est le déplacement multiplié par −ω². La plus rapide a une courbe d’accélération bien plus haute. La barre de droite est la puissance rayonnée, proportionnelle au carré de l’accélération (moyennée sur une oscillation). Le calcul tient compte de la petite variation réelle de l’amplitude avec la couleur.'],
      uv:['La résonance dans l’ultraviolet','Un nuage d’électrons a une fréquence propre, comme une balançoire. Pour N₂ et O₂, elle est vers 100 nm, dans l’ultraviolet. Dans le visible, on est loin de cette résonance : le dipôle induit est presque indépendant de la couleur, il croît seulement un peu vers le bleu (+2,7 % entre 650 et 450 nm). C’est pourquoi la loi en 1/λ⁴ est si bien respectée, avec un exposant mesuré de 4,08 au lieu de 4.'],
      mesure:['Les valeurs mesurées','À 550 nm, une molécule d’air diffuse une surface équivalente de 4,5·10⁻³¹ m² (Bodhaine et al., 1999) : c’est environ 10¹² fois moins que la surface de la molécule vue de face (≈ 10⁻¹⁹ m²). Une molécule d’air est donc un très mauvais obstacle, et la lumière traverse l’air presque sans être arrêtée. La diffusion vient de l’indice de réfraction n de l’air (1,000278 à 550 nm) : plus l’air est dense, plus il diffuse. Le calcul tient compte de la variation de n avec la couleur, ce qui donne 1/λ⁴·⁰⁸.'],
      simplif1:['Ce qui est simplifié','Échelle : sur le dessin, la liaison mesure environ 36 pixels et la longueur d’onde 100 à 200 : en vrai la molécule est 5 000 fois plus petite que 550 nm. Le déplacement du nuage est exagéré environ 10⁹ fois (en vrai, dans la lumière du Soleil, il est de l’ordre de 10⁻¹⁹ m), celui des noyaux davantage encore. Les rythmes sont ralentis environ 10¹³ fois. La molécule est dans le plan du dessin ; en trois dimensions, l’idée est la même. La luminosité des ondes émises suit la puissance réelle, avec une courbe d’affichage adoucie.'],
      simplif2:['Ce qui est simplifié','Un seul oscillateur de résonance 100 nm, alors que l’air en a plusieurs. Le déplacement est dessiné avec la même amplitude pour toutes les couleurs, ce qui est la situation de départ ; la correction due à la résonance est ajoutée dans le calcul de la puissance, pas dans le dessin. Les rythmes sont ralentis environ 10¹⁴ fois.'],
      simplif3:['Ce qui est simplifié','La section efficace est calculée avec l’indice de réfraction de l’air standard (15 °C, 1 013 hPa), le facteur de King de 1,048 et la formule de Bodhaine et al. (1999). Pas de dépendance à l’humidité ni au CO₂.']
    };
    const KEYS=()=>({1:['induit','noyaux','reemet','orient','simplif1'],2:['omega4','accel','uv','simplif2'],3:['mesure','omega4','simplif3']})[lvl];
    const W=460,H=340,V=L.setup(el.querySelector('canvas'),W,H), inp=el.querySelector('[data-k="lam"]'), out=el.querySelector('.slider strong'), inA=el.querySelector('[data-k="a"]'), outA=el.querySelector('[data-o].slider strong'), rotB=el.querySelector('[data-a="rot"]');
    let lvl=1, ang=35, lam=450, t=0, rings=[], rot=false; const infobar=el.querySelector('.infobar'), box=el.querySelector('.infobox');
    const AP=2.38, AT=1.45;   // polarisabilités de N₂ le long de la liaison et en travers (Å³, littérature)
    const setInfo=()=>L.infoBar(infobar,box,KEYS(),INFO);
    const showCtl=()=>el.querySelectorAll('[data-o]').forEach(n=>n.style.display=lvl===1?'':'none');
    const pOr=a=>{ const c=Math.cos(a*Math.PI/180), s=Math.sin(a*Math.PI/180); return {px:s*c*(AP-AT), py:-(AP*c*c+AT*s*s), P:(AP*AP*c*c+AT*AT*s*s)/(AP*AP)}; }; // dipôle (en Å³·E), puissance relative
    const f1=l=>Math.pow(550/l,4)/Math.pow(550/380,4);   // puissance relative selon la couleur, 1 à 380 nm
    const alpha=l=>1/(1-Math.pow(100/l,2));
    const capt=()=>{ const b=el.querySelector('.caption b'),s=el.querySelector('.caption span');
      if(lvl===1){ const o=pOr(ang), psi=Math.acos(Math.min(1,-o.py/Math.hypot(o.px,o.py)))*180/Math.PI;
        b.textContent='La molécule secouée : le dipôle suit le champ, pas toujours dans son axe'; s.textContent='Nuage (−) et noyaux (+) bougent en sens opposés, le dipôle p (flèche orange) oscille et rayonne dans les directions perpendiculaires à p. Change l’orientation : la lumière rayonnée est '+(o.P*100).toFixed(0)+' % du maximum à cette orientation, et p fait '+psi.toFixed(0)+'° avec le champ.'; }
      else if(lvl===2){ b.textContent='Même dipôle, couleur plus rapide : bien plus de lumière rayonnée'; s.textContent='Les deux dipôles ont le même déplacement. Plus ça oscille vite, plus l’accélération (courbe colorée) est grande, et le rayonnement croît comme son carré : ω⁴.'; }
      else { b.textContent='Mesures réelles pour l’air'; s.textContent='Section efficace de diffusion par molécule d’air (Bodhaine 1999), calculée avec l’indice de réfraction réel de l’air. Écart avec une loi 1/λ⁴ parfaite : une pente de 4,08.'; } };
    el.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{ lvl=+b.dataset.n; el.querySelectorAll('[data-n]').forEach(c=>c.setAttribute('aria-pressed',c===b)); rings=[]; setInfo(); capt(); showCtl(); });
    inp.addEventListener('input',()=>{ lam=+inp.value; rings=[]; capt(); }); inA.addEventListener('input',()=>{ ang=+inA.value; rot=false; rotB.setAttribute('aria-pressed',false); capt(); });
    rotB.onclick=()=>{ rot=!rot; rotB.setAttribute('aria-pressed',rot); };
    setInfo(); capt(); showCtl();
    const colA=()=>D.rgbStr(D.pure(lam));
    const fr=v=>String(v.toFixed(2)).replace('.',',');
    /* ---------- niveau 1 ---------- */
    function molecule(x,cx,cy,deg,sE,sN,col){
      const th=deg*Math.PI/180, ux=Math.sin(th), uy=-Math.cos(th), dN=17;
      x.save(); x.translate(cx+sE[0],cy+sE[1]); x.rotate(th); x.globalCompositeOperation='lighter'; x.scale(1,.62);
      const g=x.createRadialGradient(0,0,0,0,0,50); g.addColorStop(0,'rgba(255,150,140,.6)'); g.addColorStop(1,'rgba(255,150,140,0)'); x.fillStyle=g; x.beginPath(); x.arc(0,0,50,0,7); x.fill(); x.restore();
      const n1=[cx+sN[0]-ux*dN,cy+sN[1]-uy*dN], n2=[cx+sN[0]+ux*dN,cy+sN[1]+uy*dN];
      for(let k=-1;k<=1;k++){ const vx=-uy*k*2.2, vy=ux*k*2.2; L.line(x,n1[0]+vx,n1[1]+vy,n2[0]+vx,n2[1]+vy,'rgba(232,238,244,.45)',1.1); }
      [n1,n2].forEach(n=>{ L.glow(x,n[0],n[1],10,'#FFFFFF',.4); L.sph(x,n[0],n[1],7,'#EEF3F8'); L.txt(x,'+',n[0],n[1],'center','#7A1010',true); });
    }
    function drawShake(x){
      const cx=150, cy=176, f=550/lam, wl=150*lam/550, col=colA(), sp=2*Math.PI*f*.45, phase=t*sp, E=Math.cos(phase);
      const o=pOr(ang), pm=Math.hypot(o.px,o.py), dirx=o.px/pm, diry=o.py/pm;   // direction de p (en Å³·E ; E>0 vers le haut)
      x.save(); x.beginPath(); x.rect(0,0,272,H); x.clip();
      // onde incidente : champ vertical qui avance vers la droite
      [-62,-34,34,62].forEach(yy=>{ x.beginPath(); for(let X=6;X<=cx-46;X+=2){ const a=Math.cos(2*Math.PI*(X-cx)/wl+phase)*14; X===6?x.moveTo(X,cy+yy-a):x.lineTo(X,cy+yy-a); }
        x.strokeStyle=L.rgba(col,.55); x.lineWidth=1.4; x.stroke(); });
      L.arrow(x,8,cy,38,cy,col,1.6); L.tag(x,'lumière incidente',8,28,'left',col); L.tag(x,'champ E ↕ (vertical)',8,46,'left','#FFE08A');
      // ondes réémises : pas dans l'axe de p, intensité ∝ puissance (couleur × orientation)
      const bright=Math.pow(Math.max(.05,o.P*f1(lam)),.55);
      if(!L.reduce){ if(rings.length===0||rings[rings.length-1]>wl*.9) rings.push(0); for(let i=0;i<rings.length;i++) rings[i]+=dt0*sp*wl/(2*Math.PI); rings=rings.filter(r=>r<260); }
      const axis=Math.atan2(diry,dirx);   // direction de l'axe du dipôle (repère du dessin, y vers le bas)
      rings.forEach(r=>{ const fade=1-r/260; for(let a=0;a<72;a++){ const a0=a/72*2*Math.PI, a1=(a+1)/72*2*Math.PI, am=(a0+a1)/2, s2=Math.pow(Math.sin(am-axis),2);
          x.beginPath(); x.arc(cx,cy,r+24,a0,a1); x.strokeStyle=L.rgba(col,.95*fade*s2*bright); x.lineWidth=2.2; x.stroke(); } });
      // déplacements (exagérés) : nuage à l'opposé de p, noyaux dans le sens de p mais bien moins
      const amp=E*pm/AP, sE=[-dirx*amp*13,-diry*amp*13], sN=[dirx*amp*2.4,diry*amp*2.4];
      L.glow(x,cx,cy,52,col,.08+.1*bright);
      molecule(x,cx,cy,ang,sE,sN,col);
      // axe de la molécule (pointillés) et angle avec le champ
      const th=ang*Math.PI/180, ux=Math.sin(th), uy=-Math.cos(th); L.line(x,cx-ux*66,cy-uy*66,cx+ux*66,cy+uy*66,'rgba(232,238,244,.28)',1,[4,4]); L.line(x,cx,cy-66,cx,cy-40,'rgba(255,224,138,.5)',1,[2,3]);
      // flèche du dipôle p(t)
      const Lp=E*pm*13+0; if(Math.abs(E)>.04){ const sx=Math.sign(E); L.arrow(x,cx,cy,cx+dirx*sx*Math.abs(Lp)*1.7,cy+diry*sx*Math.abs(Lp)*1.7,'#FF9F43',3); }
      L.tag(x,'dipôle induit p',cx+(dirx>=0?10:-10),cy+(diry<0?-74:74),dirx>=0?'left':'right','#FF9F43');
      x.restore();
      // étiquettes sous la molécule
      L.tag(x,'nuage (−)',12,H-62,'left','#FF9C94'); L.tag(x,'noyaux (+) : bougent beaucoup moins',12,H-42,'left',C.ink);
      L.txt(x,'orientation : '+ang+'° entre la liaison et le champ',8,H-14,'left',C.muted);
      // panneau de droite : diagramme de rayonnement et puissance selon l'orientation
      const pcx=368, pcy=88, R=50, ps=Math.PI/2-axis;
      L.txt(x,'lumière rayonnée',284,14,'left',C.ink,true); L.txt(x,'dans le plan du dessin',284,27,'left',C.muted);
      x.beginPath(); x.arc(pcx,pcy,R,0,7); x.strokeStyle='rgba(232,238,244,.2)'; x.setLineDash([3,3]); x.stroke(); x.setLineDash([]);
      L.line(x,pcx-R-4,pcy,pcx+R+4,pcy,'rgba(232,238,244,.12)',1); L.line(x,pcx,pcy-R-4,pcx,pcy+R+4,'rgba(232,238,244,.12)',1);
      x.beginPath(); for(let a=0;a<=360;a+=3){ const r=R*o.P*Math.pow(Math.sin((a*Math.PI/180)-axis),2), X=pcx+r*Math.cos(a*Math.PI/180), Y=pcy+r*Math.sin(a*Math.PI/180); a?x.lineTo(X,Y):x.moveTo(X,Y); } x.closePath();
      x.fillStyle=L.rgba(col,.35); x.fill(); x.strokeStyle=col; x.lineWidth=1.8; x.stroke();
      L.line(x,pcx-Math.cos(axis)*R,pcy-Math.sin(axis)*R,pcx+Math.cos(axis)*R,pcy+Math.sin(axis)*R,'#FF9F43',1,[3,3]);
      L.txt(x,'cercle : maximum possible',pcx,pcy+R+13,'center',C.muted); L.txt(x,'trait orange : axe de p',pcx,pcy+R+26,'center','#FF9F43');
      // courbe de la puissance selon l'angle liaison-champ
      const gx0=294, gx1=440, gy0=212, gy1=262, gX=a=>gx0+a/180*(gx1-gx0), gY=v=>gy1-v*(gy1-gy0-4);
      L.txt(x,'puissance et orientation',284,gy0-12,'left',C.ink,true);
      L.line(x,gx0,gy1,gx1,gy1,'rgba(232,238,244,.35)',1); L.line(x,gx0,gy0,gx0,gy1,'rgba(232,238,244,.35)',1);
      x.beginPath(); for(let a=0;a<=180;a+=3){ const v=pOr(a).P; a?x.lineTo(gX(a),gY(v)):x.moveTo(gX(a),gY(v)); } x.strokeStyle='#E8EEF4'; x.lineWidth=1.8; x.stroke();
      x.beginPath(); x.arc(gX(ang),gY(o.P),4.5,0,7); x.fillStyle=col; x.fill(); x.strokeStyle='#fff'; x.lineWidth=1; x.stroke();
      [0,90,180].forEach(a=>{ L.line(x,gX(a),gy1,gX(a),gy1+4,C.muted,1); L.txt(x,a+'°',gX(a),gy1+13,'center'); }); L.txt(x,'angle liaison–champ',gx1,gy1+26,'right',C.muted);
      const tot=o.P*f1(lam);
      L.txt(x,'orientation : '+(o.P*100).toFixed(0)+' %',284,gy1+46,'left',col,true); L.txt(x,'couleur : '+(f1(lam)*100).toFixed(0)+' % (380 nm = 100 %)',284,gy1+60,'left',C.muted);
      L.txt(x,'total : '+(tot*100).toFixed(0)+' % du maximum',284,gy1+74,'left',C.ink,true);
    }
    /* ---------- niveau 2 : même dipôle, deux couleurs ---------- */
    function drawOsc(x){
      const lanes=[{l:lam,name:'couleur choisie : '+lam+' nm',col:colA()},{l:650,name:'référence : rouge, 650 nm',col:D.rgbStr(D.pure(650))}];
      const bx0=352, bw=100, pmax=Math.pow(650/380,4)*Math.pow(alpha(380)/alpha(650),2);
      lanes.forEach((ln,i)=>{
        const y0=14+i*150, w=2*Math.PI*.7*(650/ln.l), A=11, Aa=10*Math.pow(650/ln.l,2), tp=t*w;
        const P=Math.pow(650/ln.l,4)*Math.pow(alpha(ln.l)/alpha(650),2);
        x.fillStyle='rgba(255,255,255,.03)'; x.fillRect(4,y0,W-8,138);
        L.txt(x,ln.name,12,y0+11,'left',ln.col,true);
        // dipôle : nuage qui oscille autour du noyau
        const dx=36, dy=y0+78, off=A*Math.cos(tp);
        L.glow(x,dx,dy+off,34*Math.min(1.4,Math.sqrt(P)*.55+.3),ln.col,.18+.2*Math.min(1,P/4));
        L.sph(x,dx,dy,6,'#EEF3F8'); L.txt(x,'+',dx,dy,'center','#7A1010',true);
        x.save(); x.globalCompositeOperation='lighter'; const g=x.createRadialGradient(dx,dy+off,0,dx,dy+off,26); g.addColorStop(0,'rgba(255,150,140,.7)'); g.addColorStop(1,'rgba(255,150,140,0)'); x.fillStyle=g; x.beginPath(); x.arc(dx,dy+off,26,0,7); x.fill(); x.restore();
        L.line(x,dx-22,dy-A,dx+22,dy-A,'rgba(232,238,244,.2)',1,[2,3]); L.line(x,dx-22,dy+A,dx+22,dy+A,'rgba(232,238,244,.2)',1,[2,3]);
        L.txt(x,'même amplitude',10,y0+128,'left',C.muted);
        // courbes
        const tx0=92, tx1=330, v=64, ty1=y0+46, ty2=y0+106;
        L.txt(x,'déplacement du nuage',tx0,y0+27,'left',C.muted); L.txt(x,'accélération a = −ω²·x : × '+fr(Math.pow(650/ln.l,2)),tx0,y0+64,'left',ln.col);
        L.line(x,tx0,ty1,tx1,ty1,'rgba(232,238,244,.15)',1); L.line(x,tx0,ty2,tx1,ty2,'rgba(232,238,244,.15)',1);
        x.beginPath(); for(let X=tx0;X<=tx1;X+=2){ const tt=t-(tx1-X)/v, Y=ty1-A*Math.cos(w*tt); X===tx0?x.moveTo(X,Y):x.lineTo(X,Y); } x.strokeStyle='rgba(232,238,244,.8)'; x.lineWidth=1.4; x.stroke();
        x.beginPath(); for(let X=tx0;X<=tx1;X+=2){ const tt=t-(tx1-X)/v, Y=ty2+Aa*Math.cos(w*tt); X===tx0?x.moveTo(X,Y):x.lineTo(X,Y); } x.strokeStyle=ln.col; x.lineWidth=2.2; x.stroke();
        // barre de puissance
        L.txt(x,'puissance rayonnée',bx0,y0+11,'left',C.ink,true); L.txt(x,'∝ a² ∝ ω⁴',bx0,y0+25,'left',C.muted);
        L.rr(x,bx0,y0+40,bw,16,4,'rgba(255,255,255,.06)'); L.rr(x,bx0,y0+40,Math.max(3,bw*P/pmax),16,4,ln.col);
        L.txt(x,'× '+fr(P),bx0,y0+72,'left',ln.col,true); L.txt(x,'(rouge = 1)',bx0,y0+86,'left',C.muted);
      });
      const r=Math.pow(650/lam,4)*Math.pow(alpha(lam)/alpha(650),2);
      L.txt(x,'à '+lam+' nm : fréquence × '+fr(650/lam)+', accélération × '+fr(Math.pow(650/lam,2))+', puissance × '+fr(r),12,H-26,'left',C.ink,true);
      L.txt(x,'dont × '+fr(Math.pow(alpha(lam)/alpha(650),2))+' vient de la petite hausse réelle de l’amplitude (résonance UV)',12,H-10,'left',C.muted);
    }
    /* ---------- niveau 3 : mesures ---------- */
    function drawMes(x){
      const col=colA(), s=l=>D.sigmaAir(l), X0=42,X1=440,Y0=44,Y1=190, px=l=>X0+(l-380)/370*(X1-X0);
      let mx=0; for(let l=380;l<=750;l+=5) mx=Math.max(mx,s(l)); const py=v=>Y1-v/mx*(Y1-Y0-6);
      L.txt(x,'section efficace de diffusion d’une molécule d’air',X0,20,'left',C.ink,true);
      L.line(x,X0,Y1,X1,Y1,'rgba(232,238,244,.35)',1); L.line(x,X0,Y0,X0,Y1,'rgba(232,238,244,.35)',1);
      for(let l=380;l<750;l+=2){ x.fillStyle=L.rgba(D.rgbStr(D.pure(l)),.55); x.fillRect(px(l),py(s(l)),(X1-X0)/370*2+.5,Y1-py(s(l))); }
      x.beginPath(); for(let l=380;l<=750;l+=5){ const X=px(l),Y=py(s(l)); l===380?x.moveTo(X,Y):x.lineTo(X,Y); } x.strokeStyle='#E8EEF4'; x.lineWidth=2; x.stroke();
      L.line(x,px(lam),Y0-4,px(lam),Y1,'rgba(232,238,244,.4)',1,[3,3]); x.beginPath(); x.arc(px(lam),py(s(lam)),5,0,7); x.fillStyle=col; x.fill(); x.strokeStyle='#fff'; x.stroke();
      [400,500,600,700].forEach(l=>{ L.line(x,px(l),Y1,px(l),Y1+4,C.muted,1); L.txt(x,l+' nm',px(l),Y1+13,'center'); });
      const f=l=>(s(l)*1e31).toFixed(2).replace('.',',')+' ×10⁻³¹ m²';
      L.txt(x,'à 450 nm : '+f(450),X0,Y1+38,'left',C.ink); L.txt(x,'à 550 nm : '+f(550),X0,Y1+54,'left',C.ink); L.txt(x,'à 650 nm : '+f(650),X0,Y1+70,'left',C.ink);
      L.txt(x,'bleu / rouge = '+(s(450)/s(650)).toFixed(1).replace('.',','),X1,Y1+38,'right','#FF9F43',true);
      L.txt(x,'à '+lam+' nm : '+f(lam),X1,Y1+54,'right',col,true); L.txt(x,'loi en 1/λ⁴·⁰⁸',X1,Y1+70,'right',C.muted);
    }
    let dt0=0, capT=0;
    L.onFrame(dt=>{
      dt0=dt; out.textContent=lam+' nm'; if(outA) outA.textContent=ang+'°';
      if(!L.reduce) t+=dt; capT+=dt; if(rot&&!L.reduce){ ang=(ang+dt*22)%180; inA.value=Math.round(ang); outA.textContent=Math.round(ang)+'°'; if(capT>.4){ capT=0; capt(); } }
      const x=V.ctx; V.base(); L.bgLab(x,W,H);
      if(lvl===1) drawShake(x); else if(lvl===2) drawOsc(x); else drawMes(x);
      L.vignette(x,W,H); },V.cv);
  }
});
