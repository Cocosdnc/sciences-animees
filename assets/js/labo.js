/* Sciences animées — boîte à outils commune (script classique : marche aussi en ouvrant le fichier en local).
   Tout est rangé dans window.Labo. Coordonnées « logiques » : chaque canevas a sa largeur W et hauteur H,
   et Labo.setup s'occupe de la netteté (écrans haute densité) et du redimensionnement. */
(function(){
const C={bg:'#090D12',surface:'#10171F',ink:'#E8EEF4',muted:'#93A1B0',line:'#25313D',laser:'#FF3D33',gold:'#E3B341',
  p:'#A193FF',n:'#3FD4A8',hole:'#FFB547',blue:'#5AA9FF',metal:'#9AA6B2'};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

function setup(id,W,H){ const cv=typeof id==='string'?document.getElementById(id):id, ctx=cv.getContext('2d');
  function fit(){ const host=cv.parentElement, avail=(host&&host.clientWidth)||cv.clientWidth||W, maxH=Math.max(240,window.innerHeight-190), w=Math.max(200,Math.min(avail,maxH*W/H)), d=Math.min(2,window.devicePixelRatio||1);
    cv.style.width=w+'px'; cv.style.marginInline='auto'; cv.width=Math.round(w*d); cv.height=Math.round(w*H/W*d); }
  fit(); addEventListener('resize',fit);
  return {cv,ctx,W,H,base(){ ctx.setTransform(cv.width/W,0,0,cv.height/H,0,0); }}; }
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), ease=t=>t*t*(3-2*t), lerp=(a,b,t)=>a+(b-a)*t;
function hx(c){ c=c.replace('#',''); return [0,2,4].map(i=>parseInt(c.substr(i,2),16)); }
function mix(c,t,a){ const A=hx(c),B=hx(t); return 'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*a)).join(',')+')'; }
const dk=(c,a)=>mix(c,'#000000',a), lt=(c,a)=>mix(c,'#ffffff',a);
function rgba(c,a){ const A=hx(c); return 'rgba('+A[0]+','+A[1]+','+A[2]+','+a+')'; }
function lg(x,x0,y0,x1,y1,st){ const g=x.createLinearGradient(x0,y0,x1,y1); st.forEach(s=>g.addColorStop(s[0],s[1])); return g; }

/* sphère éclairée (atomes, billes) */
function sph(x,cx,cy,r,col,a){ const g=x.createRadialGradient(cx-r*.35,cy-r*.42,r*.06,cx,cy,r); g.addColorStop(0,lt(col,.8)); g.addColorStop(.35,col); g.addColorStop(1,dk(col,.62));
  x.save(); if(a!==undefined) x.globalAlpha*=a; x.beginPath(); x.arc(cx,cy,r,0,7); x.fillStyle=g; x.fill(); x.restore(); }
/* halo lumineux additif */
function glow(x,cx,cy,r,col,a){ if(r<=0||a<=0) return; x.save(); x.globalCompositeOperation='lighter'; const g=x.createRadialGradient(cx,cy,0,cx,cy,r);
  g.addColorStop(0,rgba(col,a)); g.addColorStop(1,rgba(col,0)); x.fillStyle=g; x.beginPath(); x.arc(cx,cy,r,0,7); x.fill(); x.restore(); }
const elec=(x,cx,cy,r)=>{ glow(x,cx,cy,r*4.2,C.laser,.6); sph(x,cx,cy,r,'#FF4A40'); };
function poly(x,p,f,s,lw){ x.beginPath(); x.moveTo(p[0],p[1]); for(let i=2;i<p.length;i+=2) x.lineTo(p[i],p[i+1]); x.closePath();
  if(f){x.fillStyle=f;x.fill();} if(s){x.strokeStyle=s;x.lineWidth=lw||1;x.stroke();} }
function line(x,a,b,c,d,col,lw,dash){ x.beginPath(); x.setLineDash(dash||[]); x.moveTo(a,b); x.lineTo(c,d); x.strokeStyle=col; x.lineWidth=lw||1; x.stroke(); x.setLineDash([]); }
function arrow(x,a,b,c,d,col,lw){ line(x,a,b,c,d,col,lw); const an=Math.atan2(d-b,c-a); x.beginPath(); x.moveTo(c,d);
  x.lineTo(c-7*Math.cos(an-.45),d-7*Math.sin(an-.45)); x.moveTo(c,d); x.lineTo(c-7*Math.cos(an+.45),d-7*Math.sin(an+.45)); x.strokeStyle=col; x.lineWidth=lw||1; x.stroke(); }
function rr(x,a,b,w,h,r,fill,stroke,lw){ x.beginPath(); x.moveTo(a+r,b); x.arcTo(a+w,b,a+w,b+h,r); x.arcTo(a+w,b+h,a,b+h,r); x.arcTo(a,b+h,a,b,r); x.arcTo(a,b,a+w,b,r); x.closePath();
  if(fill){x.fillStyle=fill;x.fill();} if(stroke){x.strokeStyle=stroke;x.lineWidth=lw||1;x.stroke();} }
function txt(x,s,px,py,al,col,bold){ x.font=(bold?'500 ':'')+'11px "IBM Plex Sans","Segoe UI",sans-serif'; x.textAlign=al||'left'; x.textBaseline='middle'; x.fillStyle=col||C.muted; x.fillText(s,px,py); }
/* étiquette sur fond sombre, lisible par-dessus le dessin */
function tag(x,s,px,py,al,col){ x.font='500 11px "IBM Plex Sans","Segoe UI",sans-serif'; const w=x.measureText(s).width+10; const lx=al==='right'?px-w:al==='center'?px-w/2:px;
  rr(x,lx,py-9,w,18,4,'rgba(5,8,11,.72)'); txt(x,s,lx+5,py,'left',col||C.ink); }
function lead(x,a,b,c,d){ line(x,a,b,c,d,'rgba(232,238,244,.45)',.7,[3,3]); x.beginPath(); x.arc(a,b,1.8,0,7); x.fillStyle='rgba(232,238,244,.8)'; x.fill(); }
function beam(x,x0,y0,x1,y1,w,col){ col=col||C.laser; x.save(); x.globalCompositeOperation='lighter'; x.lineCap='round';
  [[w*7,.06],[w*3.4,.16],[w*1.6,.45],[w*.6,.95]].forEach(([lw,a],k)=>{ x.strokeStyle=k===3?rgba('#FFFFFF',a*.8):rgba(col,a); x.lineWidth=lw; x.beginPath(); x.moveTo(x0,y0); x.lineTo(x1,y1); x.stroke(); }); x.restore(); }
/* paquet d'onde le long d'une direction (ux,uy) */
function wave(x,px,py,ux,uy,len,amp,ph,col,lw,a){ x.save(); x.globalCompositeOperation='lighter'; x.globalAlpha=a===undefined?1:a; x.lineCap='round';
  [[lw*3.2,.22],[lw,1]].forEach(([w,al])=>{ x.beginPath(); for(let s=0;s<=len;s++){ const e=Math.sin(Math.PI*s/len), wv=amp*e*Math.sin(s*.55-ph); const X=px-ux*s-uy*wv, Y=py-uy*s+ux*wv; s?x.lineTo(X,Y):x.moveTo(X,Y); }
    x.strokeStyle=rgba(col,al); x.lineWidth=w; x.stroke(); }); x.restore(); }
function vignette(x,W,H){ const g=x.createRadialGradient(W/2,H/2,Math.min(W,H)*.35,W/2,H/2,Math.max(W,H)*.7); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(0,0,0,.55)'); x.fillStyle=g; x.fillRect(0,0,W,H); }
function bgLab(x,W,H){ x.fillStyle=lg(x,0,0,0,H,[[0,'#0E151D'],[1,'#06090D']]); x.fillRect(0,0,W,H); }

/* boutons « i » : l'explication s'ouvre juste sous le bouton cliqué */
function infoBar(bar,box,keys,INFO){
  if(bar.contains(box)) bar.after(box);
  bar.innerHTML=''; box.hidden=true; let cur=null;
  keys.forEach(k=>{ const b=document.createElement('button'); b.className='info'; b.type='button';
    b.innerHTML='<span class="i" aria-hidden="true">i</span>'; b.appendChild(document.createTextNode(INFO[k][0])); b.setAttribute('aria-expanded',false);
    b.onclick=()=>{ const all=bar.querySelectorAll('button.info');
      if(cur===k){ cur=null; box.hidden=true; b.setAttribute('aria-expanded',false); return; }
      cur=k; box.innerHTML='<b></b><span></span>'; box.firstChild.textContent=INFO[k][0]; box.lastChild.textContent=INFO[k][1];
      b.after(box); box.hidden=false; all.forEach(c=>c.setAttribute('aria-expanded',c===b)); };
    bar.appendChild(b); });
}
/* place la colonne « Comprendre » (infobar + infobox) à gauche de chaque panneau */
function mountSides(root){ (root||document).querySelectorAll('.panel').forEach(p=>{ if(p.classList.contains('has-side')) return;
  const bar=p.querySelector(':scope > .infobar'); if(!bar) return; const box=p.querySelector(':scope > .infobox');
  const side=document.createElement('div'); side.className='side'; const h=document.createElement('div'); h.className='sidehead'; h.textContent='Comprendre';
  side.append(h,bar); if(box) side.append(box); const main=document.createElement('div'); main.className='main';
  while(p.firstChild) main.appendChild(p.firstChild); p.append(side,main); p.classList.add('has-side'); }); }

/* boucle d'animation commune : Labo.loop(dt => { ... }) */
function loop(fn){ let last=performance.now(); function f(now){ const dt=Math.min(.05,(now-last)/1000); last=now; fn(dt); requestAnimationFrame(f); } requestAnimationFrame(f); }

/* une seule horloge pour toute la page ; un bloc hors de l'écran ne calcule rien */
const frames=[]; let ticking=false;
function onFrame(fn,el){ const it={fn,vis:!el}; frames.push(it);
  if(el&&'IntersectionObserver' in window) new IntersectionObserver(es=>{ it.vis=es[0].isIntersecting; },{rootMargin:'200px'}).observe(el); else it.vis=true;
  if(!ticking){ ticking=true; loop(dt=>frames.forEach(f=>{ if(f.vis) f.fn(dt); })); } }

/* ===== Blocs réutilisables =====
   Un bloc est un modèle autonome (son HTML, son canevas, ses boutons « i »).
   Il se déclare dans assets/js/blocs/<id>.js avec Labo.defineBloc('<id>', { titre, mount(el, options) }),
   et s'insère dans n'importe quelle page avec <div data-bloc="<id>"></div>, puis Labo.mountBlocs(). */
const BLOCS={};
function defineBloc(id,def){ BLOCS[id]=def; }
function mountBlocs(root){ (root||document).querySelectorAll('[data-bloc]').forEach(el=>{ if(el.dataset.monte) return; const id=el.dataset.bloc, def=BLOCS[id];
    if(!def){ el.innerHTML='<p class="note">Bloc introuvable : <code></code>. Vérifie que son script est chargé.</p>'; el.querySelector('code').textContent=id; return; }
    el.dataset.monte='1'; def.mount(el,Object.assign({},el.dataset)); });
  mountSides(root); }

window.Labo={C,reduce,setup,clamp,ease,lerp,mix,dk,lt,rgba,lg,sph,glow,elec,poly,line,arrow,rr,txt,tag,lead,beam,wave,vignette,bgLab,infoBar,mountSides,loop,onFrame,defineBloc,mountBlocs,blocs:BLOCS};
})();
