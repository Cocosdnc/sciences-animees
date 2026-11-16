/* Bloc « test-cones » : on voit moins bien le bleu que le vert, même sur fond noir.
   Quatre boules et quatre réseaux de rayures, de couleurs différentes, sur fond noir.
   Mode 1 : même réglage d'écran (255) pour chaque couleur ; le bleu a alors une luminosité bien plus faible (7 % contre 72 % pour le vert).
   Mode 2 : on égalise la luminosité (celle du bleu pur) : si le bleu reste plus difficile à voir dans les détails, ce n'est plus une question d'intensité. */
Labo.defineBloc('test-cones',{
  titre:'Test : voit-on aussi bien le bleu que le vert ?',
  mount(el){
    const L=Labo, C=L.C;
    el.innerHTML='<div class="panel">'+
      '<div class="view"><canvas style="aspect-ratio:400/340" aria-label="Quatre boules de couleurs différentes sur fond noir, et dessous quatre réseaux de fines rayures"></canvas></div>'+
      '<div class="lc"><div class="seg" role="group" aria-label="Réglage des couleurs"><button type="button" data-m="0" aria-pressed="true">Même réglage d’écran</button><button type="button" data-m="1" aria-pressed="false">Même luminosité</button></div>'+
      '<label class="slider"><span>Taille de la boule</span><input type="range" min="4" max="40" step="1" value="26" data-k="r"><strong></strong></label>'+
      '<label class="slider"><span>Finesse des rayures</span><input type="range" min="1" max="8" step="1" value="3" data-k="s"><strong></strong></label>'+
      '<label class="slider"><span>Quatrième couleur</span><input type="color" value="#B000FF" data-k="c"></label></div>'+
      '<div class="caption" aria-live="polite"><b></b><span></span></div>'+
      '<div class="infobar"></div><div class="infobox" hidden></div></div>';
    const INFO={
      proto:['Comment faire le test','Mets-toi à environ un mètre de l’écran, dans une pièce peu éclairée. Réduis la taille de la boule jusqu’à voir celle qui disparaît en premier, puis affine les rayures jusqu’à ne plus distinguer les rayures de chaque couleur. Tu verras en général le vert et le jaune résister plus longtemps que le bleu.'],
      egal:['Pourquoi « même luminosité » change tout','En réglage identique (255), le bleu pur d’un écran émet beaucoup moins de lumière « utile » : sa luminosité, au sens de la vision, n’est que de 7 % de celle du blanc, contre 72 % pour le vert. Ici, difficile de savoir si on voit mal le bleu parce qu’il est plus sombre ou parce qu’il est bleu. En mode « même luminosité », on baisse le vert, le rouge et la quatrième couleur pour qu’ils aient exactement la luminosité du bleu : si le bleu reste difficile à voir dans les détails fins, ce n’est donc plus à cause de l’intensité.'],
      pourquoi:['Pourquoi le bleu paraît moins net','Les cônes S, qui captent le bleu, sont 5 à 10 % seulement des cônes et absents du centre de la fovéa : l’image bleue est échantillonnée grossièrement. Le cerveau fabrique la netteté à partir des cônes L et M, qui ne répondent presque pas au bleu. Enfin, la lentille de l’œil focalise mal le bleu : il y a une aberration chromatique, et l’image bleue est un peu floue sur la rétine. C’est un effet de finesse de détail, pas seulement d’intensité.'],
      ecran:['Ce qui est simplifié','Les couleurs sont celles de ton écran : son bleu pur est vers 460 nm et n’est pas une longueur d’onde unique. La luminosité est calculée avec les coefficients standard sRGB (0,2126 R + 0,7152 G + 0,0722 B, en valeurs linéaires). Ton écran, sa luminosité et la pièce où tu es changent ce que tu vois ; ce test illustre un effet général, il n’est pas un examen de la vue. Les rayures sont de vrais pixels : si elles sont plus fines que 2 pixels de ton écran, leur rendu dépend de l’écran.']
    };
    L.infoBar(el.querySelector('.infobar'),el.querySelector('.infobox'),['proto','egal','pourquoi','ecran'],INFO);
    const W=400,H=340,V=L.setup(el.querySelector('canvas'),W,H);
    let mode=0, r=26, s=3, custom='#B000FF';
    const lin=u=>{ u/=255; return u<=.04045?u/12.92:Math.pow((u+.055)/1.055,2.4); }, srgb=v=>Math.round(255*(v<=.0031308?12.92*v:1.055*Math.pow(v,1/2.4)-.055));
    const lum=c=>.2126*lin(c[0])+.7152*lin(c[1])+.0722*lin(c[2]);
    const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
    const bleuY=lum([0,0,255]);
    const palette=()=>{ const base=[[0,0,255],[0,255,0],[255,0,0],hex(custom)]; return base.map(c=>{ if(mode===0) return c; const k=Math.min(1,bleuY/Math.max(lum(c),1e-6)); return [srgb(lin(c[0])*k),srgb(lin(c[1])*k),srgb(lin(c[2])*k)]; }); };
    const NAMES=['bleu','vert','rouge','autre'];
    el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{ mode=+b.dataset.m; el.querySelectorAll('[data-m]').forEach(c=>c.setAttribute('aria-pressed',c===b)); cap(); });
    el.querySelector('[data-k="r"]').addEventListener('input',e=>{ r=+e.target.value; });
    el.querySelector('[data-k="s"]').addEventListener('input',e=>{ s=+e.target.value; });
    el.querySelector('[data-k="c"]').addEventListener('input',e=>{ custom=e.target.value; });
    function cap(){ const b=el.querySelector('.caption b'), c=el.querySelector('.caption span');
      if(mode===0){ b.textContent='Même réglage d’écran : le bleu est beaucoup plus sombre'; c.textContent='Le bleu pur de l’écran a une luminosité de 7 %, le vert de 72 %. Rapetisse la boule et affine les rayures : le bleu disparaît en premier. Mais ici, c’est en partie une question d’intensité.'; }
      else { b.textContent='Même luminosité : le bleu reste plus difficile à voir dans les détails'; c.textContent='Les quatre couleurs ont maintenant la même luminosité. Si le bleu paraît encore moins net quand les rayures sont fines, ce n’est plus une question d’intensité : c’est le manque de cônes bleus et le flou du bleu dans l’œil.'; } }
    cap();
    L.onFrame(()=>{
      const x=V.ctx; V.base(); x.fillStyle='#000'; x.fillRect(0,0,W,H);
      el.querySelector('[data-k="r"]').parentNode.querySelector('strong').textContent=r+' px';
      el.querySelector('[data-k="s"]').parentNode.querySelector('strong').textContent=s+' px';
      const P=palette(), cw=W/4;
      P.forEach((c,i)=>{ const col='rgb('+c[0]+','+c[1]+','+c[2]+')', cx=cw*i+cw/2;
        x.fillStyle=col; x.beginPath(); x.arc(cx,86,r,0,7); x.fill();
        x.save(); x.beginPath(); x.rect(cx-cw/2+8,176,cw-16,100); x.clip(); x.fillStyle=col; for(let X=cx-cw/2+8;X<cx+cw/2-8;X+=2*s) x.fillRect(X,176,s,100); x.restore();
        L.txt(x,NAMES[i],cx,300,'center','#E8EEF4',true); L.txt(x,'luminosité '+Math.round(lum(c)/Math.max(lum([255,255,255]),1e-6)*100)+' %',cx,316,'center','#93A1B0'); });
      L.txt(x,'boules',6,14,'left','#93A1B0'); L.txt(x,'rayures de '+s+' px',6,166,'left','#93A1B0');
      },V.cv);
  }
});
