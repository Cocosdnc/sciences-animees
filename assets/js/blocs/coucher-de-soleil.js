/* Bloc « coucher-de-soleil » : pourquoi le Soleil devient orange puis rouge près de l'horizon.
   La lumière directe est affaiblie par exp(−τ·m) : τ = épaisseur optique verticale (Rayleigh + ozone), m = masse d'air (Kasten & Young 1989).
   Les couleurs du ciel sont calculées pour le zénith ; celle de l'horizon est une estimation (voir « Ce qui est simplifié »). */
Labo.defineBloc('coucher-de-soleil',{
  titre:'Le coucher de soleil',
  mount(el){
    const L=Labo, C=L.C, D=window.Diff;
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas style="aspect-ratio:400/340" aria-label="Un paysage avec le Soleil à une hauteur réglable ; en dessous, le spectre de la lumière directe après la traversée de l’atmosphère"></canvas></div>'+
      '<div class="lc"><label class="slider"><span>Hauteur du Soleil</span><input type="range" min="-30" max="900" step="1" value="900"><strong></strong></label>'+
      '<button type="button" data-a="set">Lancer le coucher</button></div>'+
      '<div class="caption" aria-live="polite"><b></b><span></span></div>'+
      '<div class="infobar"></div><div class="infobox" hidden></div></div>';
    const INFO={
      masse:['La masse d’air','C’est l’épaisseur d’air traversée, comparée à celle qu’on traverse quand le Soleil est au zénith. Soleil haut : 1. À 30° au-dessus de l’horizon : 2. À 10° : environ 5,6. Soleil à l’horizon : environ 38 (formule de Kasten et Young).'],
      expo:['Pourquoi c’est une exponentielle','Quand une lumière traverse de l’air, à chaque couche traversée, une même fraction de la lumière de chaque couleur est diffusée hors du faisceau. Cela donne une transmission en exp(−τ·m), où τ dépend de la couleur : environ 0,22 à 450 nm et 0,05 à 650 nm pour toute l’atmosphère verticale (Bucholtz). Doubler la masse d’air élève la transmission au carré : le bleu s’éteint beaucoup plus vite que le rouge. À m = 38, il reste moins de 0,1 % du bleu et environ 5 % du rouge (ozone compris).'],
      oppose:['La lumière bleue, elle, va ailleurs','Ce qui est retiré du faisceau n’est pas perdu : il est diffusé dans toutes les directions, ce qui éclaire le ciel au-dessus de nous (et du côté opposé au Soleil, le ciel reste bleu). Le Soleil couchant est donc rouge, le ciel loin de lui reste bleu. Au coucher, le bleu qui nous est enlevé éclaire le ciel de gens situés plus à l’ouest, pour qui c’est encore le jour.'],
      ozone:['L’heure bleue','Quand le Soleil passe sous l’horizon, la lumière qui éclaire le haut du ciel a traversé la couche d’ozone, loin au-dessus de nous, sur un long trajet. Elle perd son orange (bande de Chappuis) et le ciel devient bleu profond. C’est l’heure bleue, un peu après le coucher. Ce rôle de l’ozone a été identifié par Hulburt en 1953.'],
      pasdu:['Pourquoi pas le violet ?','La lumière violette est la plus vite éteinte (elle est diffusée encore plus que le bleu), et l’œil y est très peu sensible. Au coucher, le violet et le bleu ont presque disparu du faisceau direct.'],
      simplif:['Ce qui est simplifié','Atmosphère à 1 013 hPa et sans aérosols ni nuages. Dans la réalité, poussières et fumées rendent les couchers plus rouges ou plus orangés. La couleur du ciel au zénith est calculée en diffusion simple avec un trajet dans l’ozone qui croît avec la masse d’air (facteur 1 + m/3, estimation). La couleur de l’horizon est une estimation : mélange de la couleur du disque et de celle du zénith. La luminosité du ciel quand le Soleil descend sous l’horizon est une courbe d’allure, pas un calcul. La réfraction qui aplatit le Soleil à l’horizon n’est pas dessinée. Le disque solaire est dessiné avec une taille exagérée.']
    };
    L.infoBar(el.querySelector('.infobar'),el.querySelector('.infobox'),['masse','expo','oppose','ozone','pasdu','simplif'],INFO);
    const W=400,H=340,V=L.setup(el.querySelector('canvas'),W,H), inp=el.querySelector('input'), out=el.querySelector('.slider strong');
    let h=90, auto=false; const btn=el.querySelector('[data-a="set"]');
    btn.onclick=()=>{ h=60; auto=true; inp.value=h*10; };
    inp.addEventListener('input',()=>{ auto=false; h=inp.value/10; });
    const mix=(a,b,k)=>a.map((v,i)=>Math.round(v*(1-k)+b[i]*k));
    const trans=(l,m)=>Math.exp(-(D.tauR(l)+D.tauO3(l))*m);
    function cap(m){ const b=el.querySelector('.caption b'), s=el.querySelector('.caption span');
      if(h>=40){ b.textContent='Soleil haut : la lumière directe est presque blanche'; s.textContent='La lumière traverse peu d’air (masse d’air '+m.toFixed(1).replace('.',',')+') : elle perd un peu de bleu, qu’elle donne au ciel.'; }
      else if(h>=10){ b.textContent='Le Soleil descend : le bleu est de plus en plus retiré du faisceau'; s.textContent='Masse d’air '+m.toFixed(1).replace('.',',')+'. La lumière directe se teinte de jaune puis d’orange : le bleu a été diffusé ailleurs.'; }
      else if(h>=3){ b.textContent='Soleil très bas : un disque orange'; s.textContent='Masse d’air '+m.toFixed(1).replace('.',',')+'. Le bleu et le vert sont presque tous retirés du faisceau direct : il reste de l’orange et du rouge.'; }
      else if(h>=0){ b.textContent='Soleil à l’horizon : masse d’air '+m.toFixed(0)+', un disque rouge'; s.textContent='La lumière traverse près de 40 fois plus d’air que Soleil au zénith : il ne reste presque rien du bleu (moins de 0,1 %) mais environ 5 % du rouge.'; }
      else { b.textContent='Soleil sous l’horizon : l’heure bleue'; s.textContent='Le haut du ciel n’est éclairé que par de la lumière qui a traversé l’ozone sur un long trajet : elle perd son orange, le ciel est bleu profond.'; } }
    L.onFrame(dt=>{
      if(auto&&!L.reduce){ h-=dt*7*(h>5?1:.45); if(h<=-3){ h=-3; auto=false; } inp.value=Math.round(h*10); } else if(auto){ h=-3; auto=false; inp.value=-30; }
      const z=Math.min(89.9,90-Math.max(h,0)), m=D.airmass(z), mo=h<0?D.airmass(89.9)*(1+(-h)/3):m;
      out.textContent=h.toFixed(1).replace('.',',')+'°'; cap(m);
      const disc=D.color(l=>D.sun(l)*trans(l,m)), zen=D.color(l=>D.sun(l)*Math.pow(550/l,4)*Math.exp(-D.tauO3(l)*(1+mo/3)));
      const horiz=mix(disc,zen,.2), bright=Math.max(.04,Math.min(1,(h+8)/14));
      const dim=c=>c.map(v=>Math.round(v*bright)), zenD=dim(zen), horD=dim(horiz);
      const x=V.ctx; V.base(); L.bgLab(x,W,H);
      const HY=172; // ligne d'horizon
      const g=x.createLinearGradient(0,0,0,HY); g.addColorStop(0,D.rgbStr(zenD)); g.addColorStop(.7,D.rgbStr(mix(zenD,horD,.55))); g.addColorStop(1,D.rgbStr(horD)); x.fillStyle=g; x.fillRect(0,0,W,HY);
      // sol
      x.fillStyle='#0B1218'; x.fillRect(0,HY,W,H-HY-0); const gg=x.createLinearGradient(0,HY,0,HY+30); gg.addColorStop(0,L.rgba(D.rgbStr(horD),.25)); gg.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle=gg; x.fillRect(0,HY,W,30);
      // soleil : position de 90° (haut) à 0° (horizon) sur l'arc
      const sy=HY-Math.max(h,-6)/90*(HY-26), sx=210+Math.max(0,90-h)*.35;
      if(h>-6){ L.glow(x,sx,sy,46,D.rgbStr(disc),.5*bright+.1); x.save(); x.beginPath(); x.rect(0,0,W,HY); x.clip(); x.beginPath(); x.arc(sx,sy,12,0,7); x.fillStyle=D.rgbStr(disc); x.fill(); x.restore(); }
      L.tag(x,'zénith',8,16,'left','#FFFFFFAA'); L.tag(x,'horizon',8,HY-14,'left','#FFFFFFAA');
      // spectre de la lumière directe
      const X0=36,X1=388,Y0=206,Y1=304, px=l=>X0+(l-380)/370*(X1-X0); L.line(x,X0,Y1,X1,Y1,'rgba(232,238,244,.35)',1);
      let mx=0; for(let l=380;l<=750;l+=3) mx=Math.max(mx,D.sun(l)); const sy2=v=>Y1-v/mx*(Y1-Y0-8);
      for(let l=380;l<750;l+=2){ const hh=D.sun(l)*trans(l,m)/mx*(Y1-Y0-8); x.fillStyle=L.rgba(D.rgbStr(D.pure(l)),.6); x.fillRect(px(l),Y1-hh,(X1-X0)/370*2+.5,hh); }
      x.beginPath(); for(let l=380;l<=750;l+=3){ l===380?x.moveTo(px(l),sy2(D.sun(l))):x.lineTo(px(l),sy2(D.sun(l))); } x.strokeStyle='rgba(232,238,244,.45)'; x.lineWidth=1.2; x.setLineDash([4,4]); x.stroke(); x.setLineDash([]);
      [400,500,600,700].forEach(l=>{ L.line(x,px(l),Y1,px(l),Y1+4,C.muted,1); L.txt(x,String(l),px(l),Y1+13,'center'); });
      L.txt(x,'lumière du Soleil qui arrive jusqu’à toi (pointillés : sans atmosphère)',X0,Y0-6,'left',C.ink,true);
      const t=l=>trans(l,m); L.tag(x,'masse d’air '+m.toFixed(1).replace('.',',')+' · bleu 450 nm : '+(t(450)*100).toFixed(t(450)<.1?1:0).replace('.',',')+' % · rouge 650 nm : '+(t(650)*100).toFixed(0)+' %',X1,Y1+26,'right','#E8EEF4');
      L.vignette(x,W,H); },V.cv);
  }
});
