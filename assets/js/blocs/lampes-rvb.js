/* Bloc « lampes-rvb » : trois lampes (rouge, verte, bleue) éclairent un mur ; là où les lumières se superposent, elles s'ajoutent.
   Rouge + vert = jaune, vert + bleu = cyan, rouge + bleu = magenta, les trois = blanc : c'est la synthèse additive.
   Sous le mur : le spectre de ce qui est allumé (trois pics étroits, aucune longueur d'onde « jaune » ni « blanche »). */
Labo.defineBloc('lampes-rvb',{
  titre:'Trois lampes qui donnent du blanc',
  mount(el){
    const L=Labo, C=L.C;
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas style="aspect-ratio:400/350" aria-label="Trois lampes, rouge, verte et bleue, éclairent un mur ; leurs taches de lumière se superposent : jaune, cyan, magenta, et blanc au centre. En dessous, le spectre de la lumière allumée."></canvas></div>'+
      '<div class="lc"><div class="seg" role="group" aria-label="Lampes allumées">'+
        '<button type="button" data-l="0" aria-pressed="true">Rouge</button><button type="button" data-l="1" aria-pressed="true">Vert</button><button type="button" data-l="2" aria-pressed="true">Bleu</button></div>'+
      '<label class="slider"><span>Écart entre les lampes</span><input type="range" min="0" max="100" step="1" value="70"><strong></strong></label>'+
      '<button type="button" data-a="auto" aria-pressed="true">Mouvement automatique</button></div>'+
      '<div class="caption" aria-live="polite"><b></b><span></span></div>'+
      '<div class="infobar"></div><div class="infobox" hidden></div></div>';
    const INFO={
      add:['Pourquoi les lumières s’ajoutent','Une lumière transporte de l’énergie. Quand deux lampes éclairent le même endroit, le mur reçoit l’énergie des deux : c’est plus de lumière, jamais moins. On appelle ça la synthèse additive. C’est ce que font les pixels de ton écran : chacun est fait de trois minuscules lampes, rouge, verte et bleue.'],
      oeil:['Pourquoi trois lampes suffisent','Ton œil a trois sortes de capteurs, les cônes, sensibles surtout au rouge, au vert et au bleu. Il ne mesure pas le spectre, il ne garde que trois nombres : combien chaque sorte de cône est excitée. Rouge + vert excitent les cônes « rouge » et « vert » comme le ferait une vraie lumière jaune : l’œil ne peut pas faire la différence. C’est pour ça qu’on voit du jaune alors que le spectre dessiné en bas ne contient aucune longueur d’onde jaune.'],
      blanc:['Ce blanc est-il la lumière du Soleil ?','Pour l’œil, oui, ou presque. Pour un instrument, non : le Soleil émet un spectre continu qui couvre tout le visible, ces trois lampes n’en émettent que trois bandes étroites. Deux lumières de spectres différents qui donnent la même impression de couleur s’appellent des métamères. Un prisme ou une goutte de pluie fait la différence : la lumière du Soleil donne tout l’arc-en-ciel, celle des trois lampes seulement trois bandes.'],
      peinture:['Pourquoi ce n’est pas comme mélanger des peintures','Mélanger des peintures, c’est le contraire : chaque pigment absorbe une partie de la lumière, donc le mélange est plus sombre (bleu + jaune de peinture font du vert foncé, pas du blanc). Les lampes, elles, ajoutent de la lumière. Les deux règles s’appellent synthèse additive (lumières) et soustractive (pigments, filtres).'],
      simplif:['Ce qui est simplifié','Les couleurs de la tache sont celles que ton écran sait produire (il simule déjà un rouge, un vert et un bleu) : la superposition est calculée en ajoutant les trois couleurs, comme le ferait de la vraie lumière. Les spectres du bas sont des pics gaussiens de 25 nm de largeur autour de 625, 530 et 460 nm, valeurs typiques de lampes ou de pixels. Les formes des faisceaux et du mur sont dessinées sans calcul d’éclairement.']
    };
    L.infoBar(el.querySelector('.infobar'),el.querySelector('.infobox'),['add','oeil','blanc','peinture','simplif'],INFO);
    const W=400,H=350,V=L.setup(el.querySelector('canvas'),W,H), inp=el.querySelector('input'), out=el.querySelector('.slider strong');
    const COL=['#FF0000','#00FF00','#0000FF'], NOM=['rouge','verte','bleue'], LAM=[625,530,460], CT=['#FF6A5E','#5BE08A','#6FA8FF'];
    const on=[true,true,true]; let sp=.7, auto=true, t=0;
    el.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{ const i=+b.dataset.l; on[i]=!on[i]; b.setAttribute('aria-pressed',on[i]); });
    inp.addEventListener('input',()=>{ sp=inp.value/100; auto=false; abtn.setAttribute('aria-pressed',false); });
    const abtn=el.querySelector('[data-a="auto"]'); abtn.onclick=()=>{ auto=!auto; abtn.setAttribute('aria-pressed',auto); };
    const NAMES={'100':'rouge','010':'vert','001':'bleu','110':'jaune','011':'cyan','101':'magenta','111':'blanc','000':'noir'};
    function cap(){ const k=on.map(v=>v?1:0).join(''), b=el.querySelector('.caption b'), s=el.querySelector('.caption span'), n=on.filter(Boolean).length;
      if(n===0){ b.textContent='Tout est éteint : pas de lumière, noir'; s.textContent='Allume une lampe. Il n’y a rien à voir sans lumière.'; }
      else if(n===1){ b.textContent='Une seule lampe : une tache '+NAMES[k]; s.textContent='Sa lumière est une couleur presque pure. Allume-en une deuxième et rapproche les lampes.'; }
      else if(n===2){ const cb={'110':['rouge + vert = jaune','Il n’y a aucune lumière jaune dans le spectre du bas : seulement du rouge et du vert. L’œil les reçoit ensemble et y voit du jaune.'],'011':['vert + bleu = cyan','Le cyan est ici la somme du vert et du bleu : deux bandes, rien entre les deux.'],'101':['rouge + bleu = magenta','Le magenta n’existe pas dans l’arc-en-ciel : aucune longueur d’onde ne le donne seule. Il vient toujours d’un mélange de rouge et de bleu.']}[k];
        b.textContent=cb[0]; s.textContent=cb[1]; }
      else { b.textContent='Les trois ensemble, superposées : du blanc'; s.textContent='Rouge + vert + bleu stimulent les trois sortes de cônes de l’œil comme le fait la lumière du Soleil : on voit du blanc. Écarte les lampes pour retrouver chaque couleur seule.'; } }
    L.onFrame(dt=>{
      if(!L.reduce) t+=dt;
      if(auto){ sp=.5+.45*Math.sin(t*.6); inp.value=Math.round(sp*100); }
      out.textContent=Math.round(sp*100)+' %'; cap();
      const x=V.ctx; V.base(); L.bgLab(x,W,H);
      // mur
      const WX0=14, WX1=W-14, WY0=66, WY1=238; L.rr(x,WX0,WY0,WX1-WX0,WY1-WY0,10,'#1A1F26','rgba(232,238,244,.16)',1);
      // position des taches (le centre du triangle est fixe ; sp règle l'écart)
      const cx=W/2, cy=136, R=52, d=12+sp*44;
      const P=[[cx-d*.95,cy-d*.5],[cx+d*.95,cy-d*.5],[cx,cy+d*.95]];
      x.save(); x.beginPath(); x.rect(WX0+1,WY0+1,WX1-WX0-2,WY1-WY0-2); x.clip();
      x.globalCompositeOperation='lighter';
      P.forEach((p,i)=>{ if(!on[i]) return; const g=x.createRadialGradient(p[0],p[1],0,p[0],p[1],R); g.addColorStop(0,L.rgba(COL[i],.92)); g.addColorStop(.78,L.rgba(COL[i],.92)); g.addColorStop(1,L.rgba(COL[i],0)); x.fillStyle=g; x.beginPath(); x.arc(p[0],p[1],R,0,7); x.fill(); });
      x.restore();
      // lampes et faisceaux
      const LP=[[cx-d*.95,26],[cx+d*.95,26],[cx,26]];
      P.forEach((p,i)=>{ const lx=LP[i][0], ly=LP[i][1];
        if(on[i]){ x.save(); x.globalCompositeOperation='lighter'; x.beginPath(); x.moveTo(lx-5,ly+8); x.lineTo(lx+5,ly+8); x.lineTo(p[0]+R*.9,Math.max(WY0,p[1]-R*.2)); x.lineTo(p[0]-R*.9,Math.max(WY0,p[1]-R*.2)); x.closePath(); x.fillStyle=L.rgba(COL[i],.07); x.fill(); x.restore(); }
        L.rr(x,lx-12,ly-8,24,18,5,on[i]?CT[i]:'#2A323C','rgba(0,0,0,.4)',1); if(on[i]) L.glow(x,lx,ly+10,22,COL[i],.7);
        L.txt(x,NOM[i],lx,ly-20,'center',on[i]?CT[i]:C.muted); });
      // noms des mélanges
      const mid=(a,b)=>[(P[a][0]+P[b][0])/2,(P[a][1]+P[b][1])/2];
      if(sp<.9){ if(on[0]&&on[1]&&!on[2]){ const m=mid(0,1); L.tag(x,'jaune',m[0],m[1]-26,'center','#FFE97A'); }
        if(on[1]&&on[2]&&!on[0]){ const m=mid(1,2); L.tag(x,'cyan',m[0]+14,m[1]+14,'center','#7FF3FF'); }
        if(on[0]&&on[2]&&!on[1]){ const m=mid(0,2); L.tag(x,'magenta',m[0]-14,m[1]+14,'center','#FF8CF0'); } }
      if(on[0]&&on[1]&&on[2]&&sp<.75){ L.tag(x,'blanc',cx,cy-2,'center','#FFFFFF'); }
      // spectre de ce qui est allumé
      const X0=34,X1=W-20,Y0=268,Y1=316, px=l=>X0+(l-380)/370*(X1-X0), SG=11;
      L.line(x,X0,Y1,X1,Y1,'rgba(232,238,244,.35)',1);
      const fs=(l,i)=>Math.exp(-.5*Math.pow((l-LAM[i])/SG,2));
      for(let l=380;l<750;l+=2){ let tot=0; for(let i=0;i<3;i++) if(on[i]) tot+=fs(l,i); if(tot<.003) continue; const hh=Math.min(1,tot)*(Y1-Y0-4);
        x.fillStyle=L.rgba(Diff_pure(l),.7); x.fillRect(px(l),Y1-hh,(X1-X0)/370*2+.5,hh); }
      [400,500,600,700].forEach(l=>{ L.line(x,px(l),Y1,px(l),Y1+4,C.muted,1); L.txt(x,String(l),px(l),Y1+13,'center'); });
      L.txt(x,'spectre de la lumière allumée (nm)',X0,Y0-10,'left',C.ink,true);
      L.txt(x,'aucune longueur d’onde jaune ni « blanche » : seulement trois bandes',X1,Y1+28,'right',C.muted);
      L.vignette(x,W,H); },V.cv);
    function Diff_pure(l){ const D=window.Diff; return D?D.rgbStr(D.pure(l)):'#FFFFFF'; }
  }
});
