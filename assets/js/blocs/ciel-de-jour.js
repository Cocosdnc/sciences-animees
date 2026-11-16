/* Bloc « ciel-de-jour » : de la lumière blanche au bleu du ciel, étape par étape.
   Chaque étape multiplie le spectre précédent par un facteur réel :
   1/λ⁴ (diffusion) · spectre du Soleil (ASTM G173) · ozone (bande de Chappuis) · sensibilité de l'œil.
   La pastille de couleur est toujours calculée avec les trois courbes de sensibilité de l'œil (observateur CIE 1931), sans adaptation. */
Labo.defineBloc('ciel-de-jour',{
  titre:'Pourquoi le ciel est bleu, et pas violet',
  mount(el){
    const L=Labo, C=L.C, D=window.Diff;
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas style="aspect-ratio:400/330" aria-label="Spectre de la lumière du ciel, construit étape par étape, avec la couleur qui en résulte"></canvas></div>'+
      '<div class="lc"><div class="seg" role="group" aria-label="Étape"><button type="button" data-s="1" aria-pressed="true">1. Diffusion en 1/λ⁴</button><button type="button" data-s="2" aria-pressed="false">2. × Soleil</button><button type="button" data-s="3" aria-pressed="false">3. × ozone</button><button type="button" data-s="4" aria-pressed="false">4. × œil</button></div>'+
      '<button type="button" data-a="ideal" aria-pressed="false">Soleil idéalisé : parfaitement blanc</button></div>'+
      '<div class="caption" aria-live="polite"><b></b><span></span></div>'+
      '<div class="infobar"></div><div class="infobox" hidden></div></div>';
    const INFO={
      chaine:['Comment lire ce graphique','On part d’une lumière parfaitement blanche et on lui applique, une par une, les opérations réelles qu’elle subit. À chaque étape, la courbe est le spectre de la lumière (l’intensité pour chaque longueur d’onde), normalisé à son maximum. La pastille donne la couleur qui correspond à ce spectre. Les courbes pâles sont celles des étapes précédentes.'],
      soleil:['Le spectre du Soleil n’est pas plat','Le Soleil émet comme un corps à environ 5 770 K, avec un maximum vers 500 nm, plus faible dans le violet et dans le rouge (courbe de référence ASTM G173, hors atmosphère). Il est creusé de raies sombres (raies de Fraunhofer), dues aux atomes de sa surface. À 410 nm, il émet environ 20 % de moins qu’à 470 nm, et dans le rouge aussi moins que dans le bleu. Il y a donc un peu moins de violet à diffuser : le bleu gagne un peu. Mais l’effet est modéré : la couleur calculée change peu (compare les pastilles des étapes 1 et 2), et le Soleil seul n’explique pas pourquoi le ciel est bleu et non violet.'],
      ozone:['L’ozone enlève un peu de jaune-orange','La couche d’ozone absorbe faiblement dans la bande de Chappuis, vers 600 nm : environ 4 % de la lumière orange à la verticale. Cela retire un peu de rouge-orange et rend le ciel légèrement plus bleu. Ici, l’ozone est pris à 300 unités Dobson (valeur moyenne) avec une forme de bande simplifiée.'],
      oeil:['Pourquoi pas violet ? L’œil','La diffusion est bien plus forte pour le violet (400 nm) que pour le bleu (470 nm). Mais l’œil est très peu sensible au violet : sa sensibilité y est plus de 30 fois plus faible qu’à 470 nm (valeur des courbes standard). Le résultat, c’est un mélange où le bleu domine nettement, pâli par le vert et le rouge qu’on reçoit aussi en petite quantité. Le ciel serait violet pour une créature dont l’œil serait plus sensible à 400 nm, ou si le Soleil émettait beaucoup plus de violet. C’est surtout un fait de notre vision. Et ce n’est pas qu’une question d’intensité : les cônes bleus, rares et absents du centre de l’œil, ne fabriquent presque pas les détails (voir la page « L’œil et les cônes »).'],
      pale:['Pourquoi le ciel est bleu pâle, pas bleu pur','Le ciel contient toutes les couleurs, mais en proportions inégales : il y a plus de bleu, mais aussi du vert et un peu de rouge. Leur mélange donne un bleu clair. C’est aussi pour ça que le ciel est plus pâle vers l’horizon : la lumière y a traversé plus d’air, donc diffusé plusieurs fois, et se rapproche du blanc.'],
      simplif:['Ce qui est simplifié','Diffusion simple d’une seule molécule (en réalité la lumière peut être diffusée plusieurs fois, surtout vers l’horizon). Sans aérosols ni vapeur d’eau. Ozone à 300 DU avec une bande gaussienne autour de 602 nm, section efficace de pic 5·10⁻²¹ cm². Les bandes d’absorption de l’oxygène et de la vapeur d’eau ne sont pas incluses. La couleur est calculée avec l’observateur CIE 1931 (ajustement de Wyman), sans adaptation de l’œil au ciel ambiant : sur un écran, le ciel réel paraît un peu moins saturé. La clarté est normalisée.']
    };
    L.infoBar(el.querySelector('.infobar'),el.querySelector('.infobox'),['chaine','soleil','ozone','oeil','pale','simplif'],INFO);
    const W=400,H=330,V=L.setup(el.querySelector('canvas'),W,H);
    let step=1, ideal=false;
    const f1=l=>Math.pow(550/l,4), sunN=l=>ideal?1:D.sun(l)/D.sun(550), oz=l=>Math.exp(-D.tauO3(l)*1.5);
    const S=[null,f1,l=>f1(l)*sunN(l),l=>f1(l)*sunN(l)*oz(l),l=>f1(l)*sunN(l)*oz(l)*D.eye(l)];
    el.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{ step=+b.dataset.s; el.querySelectorAll('[data-s]').forEach(c=>c.setAttribute('aria-pressed',c===b)); cap(); });
    el.querySelector('[data-a="ideal"]').onclick=e=>{ ideal=!ideal; e.currentTarget.setAttribute('aria-pressed',ideal); e.currentTarget.textContent=ideal?'Soleil idéalisé : parfaitement blanc (activé)':'Soleil idéalisé : parfaitement blanc'; cap(); };
    function cap(){ const b=el.querySelector('.caption b'), s=el.querySelector('.caption span'), sp=S[step];
      const r=(sp(450)/sp(650)).toFixed(1).replace('.',','), v=(D.eye(410)/D.eye(470)*100);
      if(step===1){ b.textContent='1. Lumière blanche diffusée : plus de bleu et de violet'; s.textContent='Un air qui diffuse en 1/λ⁴ une lumière parfaitement blanche renvoie le violet en plus grande quantité. Le bleu (450 nm) est '+r+' fois plus fort que le rouge (650 nm). La couleur calculée est déjà un bleu clair, pas du violet.'; }
      else if(step===2){ b.textContent=ideal?'2. Soleil idéalisé blanc : rien ne change':'2. × Spectre du Soleil : un peu plus de bleu'; s.textContent=ideal?'Avec un Soleil parfaitement blanc, cette étape ne change rien. Désactive le bouton pour utiliser le vrai spectre solaire.':'Le Soleil émet moins de violet que de bleu : la courbe baisse vers 400 nm. L’effet sur la couleur est faible, mais il va dans le sens du bleu.'; }
      else if(step===3){ b.textContent='3. × Ozone : un peu de rouge-orange en moins'; s.textContent='La couche d’ozone absorbe vers 600 nm : environ 4 % à la verticale. Petit effet, qui renforce un peu le bleu.'; }
      else { b.textContent='4. × Sensibilité de l’œil : le violet disparaît presque'; s.textContent='L’œil capte le violet à 410 nm avec '+v.toFixed(0)+' % de la sensibilité qu’il a pour le bleu à 470 nm. Même très diffusé, le violet pèse peu : le ciel paraît bleu.'; } }
    cap();
    L.onFrame(()=>{
      const x=V.ctx; V.base(); L.bgLab(x,W,H);
      const X0=36,X1=388,Y0=38,Y1=198, px=l=>X0+(l-380)/370*(X1-X0);
      L.line(x,X0,Y1,X1,Y1,'rgba(232,238,244,.35)',1); L.line(x,X0,Y0,X0,Y1,'rgba(232,238,244,.35)',1);
      const nrm=f=>{ let m=0; for(let l=380;l<=750;l+=2) m=Math.max(m,f(l)); return m; };
      // courbes pâles des étapes précédentes
      for(let k=1;k<step;k++){ const f=S[k], m=nrm(f); x.beginPath(); for(let l=380;l<=750;l+=3){ const X=px(l), Y=Y1-f(l)/m*(Y1-Y0-14); l===380?x.moveTo(X,Y):x.lineTo(X,Y); } x.strokeStyle='rgba(232,238,244,.3)'; x.lineWidth=1.3; x.setLineDash([3,3]); x.stroke(); x.setLineDash([]); }
      const f=S[step], m=nrm(f);
      for(let l=380;l<750;l+=2){ const h=f(l)/m*(Y1-Y0-14); x.fillStyle=L.rgba(D.rgbStr(D.pure(l)),.55); x.fillRect(px(l),Y1-h,(X1-X0)/370*2+.5,h); }
      x.beginPath(); for(let l=380;l<=750;l+=2){ const X=px(l), Y=Y1-f(l)/m*(Y1-Y0-14); l===380?x.moveTo(X,Y):x.lineTo(X,Y); } x.strokeStyle='#E8EEF4'; x.lineWidth=2; x.stroke();
      [400,450,500,550,600,650,700].forEach(l=>{ L.line(x,px(l),Y1,px(l),Y1+4,C.muted,1); L.txt(x,String(l),px(l),Y1+13,'center'); });
      L.txt(x,'longueur d’onde (nm)',X1,Y1+26,'right',C.muted);
      L.txt(x,['','Intensité diffusée','Intensité diffusée','Intensité diffusée, après l’ozone','Intensité perçue par l’œil'][step],X0,Y0-14,'left',C.ink,true);
      // pastilles
      const col=step===4?D.color(S[3]):D.color(S[step]);
      L.rr(x,X0,236,100,64,10,D.rgbStr(col),'rgba(232,238,244,.25)',1); L.txt(x,'couleur du ciel',X0,311,'left',C.ink);
      const sc=D.color(l=>ideal?1:D.sun(l));
      L.rr(x,X0+130,236,100,64,10,D.rgbStr(sc),'rgba(232,238,244,.25)',1); L.txt(x,ideal?'Soleil idéalisé':'Soleil, sans atmosphère',X0+130,311,'left',C.ink);
      const f1v=D.color(S[1]);
      L.rr(x,X0+260,236,92,64,10,D.rgbStr(f1v),'rgba(232,238,244,.25)',1); L.txt(x,'étape 1 seule',X0+260,311,'left',C.muted);
      L.txt(x,'Pastilles calculées avec la sensibilité de l’œil.',X0,326,'left',C.muted);
      L.vignette(x,W,H); },V.cv);
  }
});
