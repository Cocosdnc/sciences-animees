/* Bloc « cones-sensibilite » : les trois sortes de cônes de l'œil.
   Courbes : sensibilités spectrales des cônes L, M, S obtenues à partir de l'ajustement de Wyman (2013) des fonctions colorimétriques CIE 1931,
   par la transformation de Hunt-Pointer-Estevez (approximation classique des « fondamentales » des cônes ; le pic de S tombe vers 445 nm au lieu de ≈ 420 nm).
   Mosaïque : tirage aléatoire des types de cônes avec les proportions typiques (L ≈ 60 %, M ≈ 33 %, S ≈ 7 %) ; aucun cône S au centre de la fovéa. */
Labo.defineBloc('cones-sensibilite',{
  titre:'Les trois sortes de cônes',
  mount(el){
    const L=Labo, C=L.C, D=window.Diff;
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas style="aspect-ratio:400/330" aria-label="Sensibilité spectrale des cônes L, M et S, ou mosaïque de cônes de la rétine"></canvas></div>'+
      '<div class="lc"><div class="seg" role="group" aria-label="Vue"><button type="button" data-v="c" aria-pressed="true">Courbes de sensibilité</button><button type="button" data-v="m" aria-pressed="false">La rétine, cône par cône</button></div></div>'+
      '<div class="caption" aria-live="polite"><b></b><span></span></div>'+
      '<div class="infobar"></div><div class="infobox" hidden></div></div>';
    const INFO={
      trois:['Trois sortes de cônes','Les cônes sont les cellules de la rétine qui voient la couleur à la lumière du jour. Il y en a trois sortes, selon la pigment qu’ils contiennent : S (courtes longueurs d’onde, bleu-violet), M (moyennes, vert) et L (grandes, jaune-rouge). Aucun ne voit « une couleur » : chacun mesure seulement combien de lumière il reçoit, avec sa propre sensibilité. La couleur est reconstruite par le cerveau en comparant les trois signaux.'],
      rare:['Les cônes S sont rares','Environ 5 à 10 % des cônes seulement sont de type S (valeur variable selon les personnes et la zone de la rétine, d’après les comptages sur rétines humaines de Curcio et coll. 1991 et Hofer et coll. 2005). Les L et M se partagent le reste, dans un rapport qui varie beaucoup d’une personne à l’autre. De plus, le centre même de la fovéa (environ 0,35° autour du point que tu fixes), là où la vision est la plus fine, ne contient aucun cône S. Pourquoi si peu ? Les cônes S sont le système ancien des mammifères ; chez les primates de l’Ancien Monde, c’est l’ajout du cône L (pour repérer les fruits mûrs et les jeunes feuilles dans le feuillage) qui a multiplié les cônes L et M. Et comme la lentille défocalise le bleu, échantillonner finement une image bleue floue ne servirait à rien (détails dans la page « L’œil et les cônes »).'],
      lum:['Pourquoi le violet paraît sombre','La « luminosité » d’une lumière, ce qui permet de distinguer les détails et les contours, est fabriquée par le cerveau à partir des cônes L et M seulement ; les cônes S y contribuent très peu. La courbe blanche, appelée efficacité lumineuse, est à peu près la somme des courbes L et M. Elle est très faible dans le bleu-violet, non parce que le violet serait « moins fort », mais parce que le circuit de la luminosité et des détails ne l’écoute presque pas.'],
      detail:['Et la finesse des détails ?','Trois raisons s’additionnent : les cônes S sont rares et espacés (donc l’échantillonnage de l’image est grossier), ils sont absents du centre de la fovéa, et la lentille de l’œil ne focalise pas le bleu au même endroit que le rouge (aberration chromatique : environ 1 à 2 dioptries d’écart entre le violet et le rouge), si bien que l’image bleue est floue sur la rétine. Le cristallin jaunit en plus avec l’âge et absorbe le bleu.'],
      simplif:['Ce qui est simplifié','Les courbes viennent d’une transformation classique (Hunt-Pointer-Estevez) appliquée à l’ajustement analytique de Wyman : elles sont proches des vraies courbes de cônes mais pas exactes (le pic de S est vers 445 nm au lieu de 420 nm environ). Chaque courbe est normalisée à 1 : en réalité, les trois types n’ont pas la même sensibilité absolue. La mosaïque est un tirage aléatoire avec des proportions typiques ; une vraie mosaïque est plus irrégulière et varie d’une personne à l’autre. L’échelle de distance est approximative.']
    };
    L.infoBar(el.querySelector('.infobar'),el.querySelector('.infobox'),['trois','rare','lum','detail','simplif'],INFO);
    const W=400,H=330,V=L.setup(el.querySelector('canvas'),W,H);
    let view='c', rnd=(function(){ let a=123456789; return ()=>{ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; })(), cones=[];
    const LMS=l=>{ const X=D.xbar(l),Y=D.ybar(l),Z=D.zbar(l); return [Math.max(0,.4002*X+.7076*Y-.0808*Z),Math.max(0,-.2263*X+1.1653*Y+.0457*Z),Math.max(0,.9182*Z)]; };
    const pk=[0,0,0]; for(let l=380;l<=750;l+=2){ const v=LMS(l); for(let i=0;i<3;i++) pk[i]=Math.max(pk[i],v[i]); }
    const norm=(l,i)=>LMS(l)[i]/pk[i];
    const COL=['#FF7A6B','#5FD08A','#6FA8FF'], NAME=['L (rouge)','M (vert)','S (bleu)'];
    // mosaïque : positions en nid d'abeille, type tiré une fois ; le type S est refusé au centre (rayon < zone sans S)
    function build(){ cones=[[],[]]; const R=3.6; for(let k=0;k<2;k++) for(let j=0;j*R*1.75<186;j++) for(let i=0;i*R*2<190;i++){ const x=i*R*2+(j%2?R:0)+(rnd()-.5)*.8, y=j*R*1.75+(rnd()-.5)*.8; let u=rnd(), ty=u<.60?0:u<.93?1:2; if(k===0&&ty===2) ty=rnd()<.65?0:1; cones[k].push({x,y,t:ty}); } }
    build();
    el.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{ view=b.dataset.v; el.querySelectorAll('[data-v]').forEach(c=>c.setAttribute('aria-pressed',c===b)); cap(); });
    function cap(){ const b=el.querySelector('.caption b'), s=el.querySelector('.caption span');
      if(view==='c'){ b.textContent='Trois courbes de sensibilité, très larges et qui se recouvrent'; s.textContent='Aucun cône n’est « bleu » ou « rouge » : chacun répond à tout un intervalle de couleurs. La courbe blanche (efficacité lumineuse) est celle de la luminosité et des détails : très basse dans le bleu-violet.'; }
      else { b.textContent='À gauche, aucun cône bleu ; à droite, quelques-uns, espacés'; s.textContent='Chaque point est un cône. Les cônes S (bleus) sont rares : environ 5 à 10 % seulement, et absents du tout centre. Les trois types sont mélangés sans ordre.'; } }
    cap();
    L.onFrame(()=>{
      const x=V.ctx; V.base(); L.bgLab(x,W,H);
      if(view==='c'){
        const X0=34,X1=388,Y0=30,Y1=232, px=l=>X0+(l-380)/370*(X1-X0), py=v=>Y1-v*(Y1-Y0);
        L.line(x,X0,Y1,X1,Y1,'rgba(232,238,244,.35)',1); L.line(x,X0,Y0,X0,Y1,'rgba(232,238,244,.35)',1);
        for(let i=0;i<3;i++){ x.beginPath(); for(let l=380;l<=750;l+=3){ const X=px(l),Y=py(norm(l,i)); l===380?x.moveTo(X,Y):x.lineTo(X,Y); } x.strokeStyle=COL[i]; x.lineWidth=2.4; x.stroke(); }
        // efficacité lumineuse
        let mv=0; for(let l=380;l<=750;l+=2) mv=Math.max(mv,D.ybar(l));
        x.beginPath(); for(let l=380;l<=750;l+=3){ const X=px(l),Y=py(D.ybar(l)/mv); l===380?x.moveTo(X,Y):x.lineTo(X,Y); } x.setLineDash([5,4]); x.strokeStyle='#FFFFFF'; x.lineWidth=1.8; x.stroke(); x.setLineDash([]);
        for(let l=380;l<750;l+=2){ x.fillStyle=L.rgba(D.rgbStr(D.pure(l)),.9); x.fillRect(px(l),Y1+2,(X1-X0)/370*2+.5,8); }
        [400,450,500,550,600,650,700].forEach(l=>{ L.line(x,px(l),Y1+10,px(l),Y1+14,C.muted,1); L.txt(x,String(l),px(l),Y1+24,'center'); }); L.txt(x,'longueur d’onde (nm)',X1,Y1+38,'right',C.muted);
        L.txt(x,'sensibilité relative de chaque type de cône',X0,Y0-12,'left',C.ink,true);
        NAME.forEach((n,i)=>{ L.txt(x,n,X0+8+i*100,Y1+56,'left',COL[i],true); }); L.txt(x,'- - - efficacité lumineuse (luminosité)',X0+8,Y1+74,'left','#FFFFFF');
        const v410=D.ybar(410)/mv, v450=D.ybar(450)/mv; L.txt(x,'luminosité à 450 nm : '+(v450*100).toFixed(0)+' % · à 410 nm : '+(v410*100).toFixed(1).replace('.',',')+' %',X0+8,Y1+90,'left',C.muted);
      } else {
        const P=[[105,160,'centre de la fovéa : 0 % S',false],[295,160,'à 2° du centre : ≈ 7 % S',true]];
        P.forEach(([cx,cy,lab,s],k)=>{ x.save(); x.beginPath(); x.arc(cx,cy,92,0,7); x.clip(); x.fillStyle='#07090D'; x.fillRect(cx-92,cy-92,184,184);
          cones[k].forEach(c=>{ x.beginPath(); x.arc(cx-92+c.x,cy-92+c.y,2.2,0,7); x.fillStyle=COL[c.t]; x.fill(); });
          x.restore(); x.beginPath(); x.arc(cx,cy,92,0,7); x.strokeStyle='rgba(232,238,244,.3)'; x.lineWidth=1.2; x.stroke(); L.txt(x,lab,cx,cy+110,'center',C.ink); });
        L.tag(x,'rouge : L · vert : M · bleu : S',W/2,H-10,'center',C.muted);
      }
      L.vignette(x,W,H); },V.cv);
  }
});
