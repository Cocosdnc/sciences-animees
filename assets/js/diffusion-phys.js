/* Physique de la diffusion de la lumière : calculs partagés par la page « Ciel et diffusion » et le bloc « diffusion-lambda ».
   Longueurs d'onde en nm. Tout est calculé, rien n'est dessiné à la main.
   Sources :
   - Section efficace de l'air : Bodhaine et al. 1999 (J. Atmos. Oceanic Technol. 16, 1854), indice de l'air de Peck-Reeder / Bodhaine, facteur de King 1,048.
   - Épaisseur optique de Rayleigh au niveau de la mer : Bucholtz 1995 (Appl. Opt. 34, 2765) / Hansen & Travis 1974.
   - Spectre solaire : ASTM G173-03 (assets/js/data-astm-g173.js).
   - Vision des couleurs : ajustement analytique de Wyman, Sloan & Shirley 2013 (observateur CIE 1931).
   - Masse d'air : Kasten & Young 1989.
   - Mie : algorithme de Bohren & Huffman 1983 (BHMIE), recalculé ici en JavaScript.
   - Ozone (bande de Chappuis) : forme gaussienne approchée autour de 600 nm, section efficace de pic ≈ 5·10⁻²¹ cm² (valeur de la littérature, forme simplifiée). */
(function(root){
const D={};
const PI=Math.PI;
/* ---------- couleur ---------- */
const g=(l,mu,s1,s2)=>{ const t=(l-mu)/(l<mu?s1:s2); return Math.exp(-.5*t*t); };
D.xbar=l=>1.056*g(l,599.8,37.9,31)+.362*g(l,442,16,26.7)-.065*g(l,501.1,20.4,26.2);
D.ybar=l=>.821*g(l,568.8,46.9,40.5)+.286*g(l,530.9,16.3,31.1);
D.zbar=l=>1.217*g(l,437,11.8,36)+.681*g(l,459,26,13.8);
D.LMIN=380; D.LMAX=750;
const gam=u=>{ u=Math.max(0,Math.min(1,u)); return u<=.0031308?12.92*u:1.055*Math.pow(u,1/2.4)-.055; };
/* Spectre -> [r,g,b] (0..255). S(l) est une fonction de la longueur d'onde (énergie par nm).
   Pas d'adaptation de l'œil : on voit la couleur « brute ». La clarté est normalisée (le canal le plus fort vaut 1). */
D.color=(S,keepY)=>{
  let X=0,Y=0,Z=0; for(let l=D.LMIN;l<=D.LMAX;l+=5){ const s=Math.max(0,S(l)); X+=s*D.xbar(l); Y+=s*D.ybar(l); Z+=s*D.zbar(l); }
  let r=3.2406*X-1.5372*Y-.4986*Z, gg=-.9689*X+1.8758*Y+.0415*Z, b=.0557*X-.204*Y+1.057*Z;
  const m=Math.max(r,gg,b,1e-30); r=Math.max(0,r/m); gg=Math.max(0,gg/m); b=Math.max(0,b/m);
  return [Math.round(255*gam(r)),Math.round(255*gam(gg)),Math.round(255*gam(b))];
};
D.rgbStr=c=>'#'+c.map(v=>('0'+Math.max(0,Math.min(255,v)).toString(16)).slice(-2)).join('');
/* couleur d'une longueur d'onde pure, pour dessiner (saturée, lisible) */
D.pure=l=>{ const c=D.color(x=>Math.abs(x-l)<2.6?1:0); return c.map(v=>Math.round(v+(255-v)*.22)); };
/* ---------- air ---------- */
D.N_AIR=2.5469e19;           // molécules par cm³ à 288,15 K et 1013,25 hPa
D.nAir=l=>{ const s2=1/((l/1000)*(l/1000)); return 1+1e-8*(8060.51+2480990/(132.274-s2)+17455.7/(39.32957-s2)); };
/* section efficace de diffusion d'une molécule d'air, en m² */
D.sigmaAir=l=>{ const n=D.nAir(l), lc=l*1e-7, N=D.N_AIR, F=1.048;
  return 24*PI**3*(n*n-1)**2/(lc**4*N*N*(n*n+2)**2)*F*1e-4; };
/* section efficace d'une molécule isotrope de polarisabilité alpha' (volume, en Å³), sans dispersion de l'indice : σ = 128π⁵α'²/(3λ⁴) */
D.sigmaPol=(alphaA3,l)=>{ const a=alphaA3*1e-30, lm=l*1e-9; return 128*PI**5*a*a/(3*lm**4); };
/* épaisseur optique de Rayleigh d'une atmosphère entière à la verticale (niveau de la mer) */
D.tauR=l=>{ const u=l/1000; return .008569*u**-4*(1+.0113*u**-2+.00013*u**-4); };
/* ozone : 300 unités Dobson = 8,06·10¹⁸ molécules/cm² ; bande de Chappuis, pic 5·10⁻²¹ cm² vers 600 nm */
D.tauO3=l=>{ const t=(l-602)/58; return 8.06e18*5.0e-21*Math.exp(-.5*t*t); };
/* masse d'air (Kasten & Young 1989), z = angle zénithal en degrés */
D.airmass=z=>1/(Math.cos(z*PI/180)+.50572*Math.pow(96.07995-z,-1.6364));
/* ---------- soleil ---------- */
D.sun=l=>{ const A=root.ASTMG173; if(!A) return 1; const i=(l-A.l0)/A.dl, k=Math.max(0,Math.min(A.ext.length-2,Math.floor(i))), f=i-k; return A.ext[k]*(1-f)+A.ext[k+1]*f; };
D.eye=l=>D.ybar(l);
/* ---------- Mie (Bohren & Huffman, BHMIE) ---------- */
/* complexes en paires [re,im] */
const cm=(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]];
const cd=(a,b)=>{ const d=b[0]*b[0]+b[1]*b[1]; return [(a[0]*b[0]+a[1]*b[1])/d,(a[1]*b[0]-a[0]*b[1])/d]; };
/* Qsca et Qext pour une sphère de paramètre de taille x et d'indice m=[n,k] ; si nang>0, renvoie aussi S1,S2 pour nang angles de 0 à 180° */
D.mie=(x,m,nang)=>{
  nang=nang||0;
  const nstop=Math.floor(x+4*Math.pow(x,1/3)+2), y=[m[0]*x,m[1]*x], nmx=Math.floor(Math.max(nstop,Math.hypot(y[0],y[1]))+15);
  const d=new Array(nmx+1); d[nmx]=[0,0];
  for(let n=nmx;n>=1;n--){ const t=cd([n,0],y), den=[t[0]+d[n][0],t[1]+d[n][1]], inv=cd([1,0],den); d[n-1]=[t[0]-inv[0],t[1]-inv[1]]; }
  const amu=[],pi0=[],pi1=[],S1=[],S2=[],ang=[];
  for(let j=0;j<nang;j++){ const th=j*PI/(nang-1); amu.push(Math.cos(th)); pi0.push(0); pi1.push(1); ang.push(th); S1.push([0,0]); S2.push([0,0]); }
  let psi0=Math.cos(x), psi1=Math.sin(x), chi0=-Math.sin(x), chi1=Math.cos(x), xi1=[psi1,-chi1], qs=0, qe=0;
  for(let n=1;n<=nstop;n++){
    const fn=(2*n+1)/(n*(n+1)), psi=(2*n-1)*psi1/x-psi0, chi=(2*n-1)*chi1/x-chi0, xi=[psi,-chi];
    const dm=cd(d[n],m), ta=[dm[0]+n/x,dm[1]], dmm=cm(m,d[n]), tb=[dmm[0]+n/x,dmm[1]];
    const ca=cm(ta,xi), cb=cm(tb,xi);
    const a=cd([ta[0]*psi-psi1,ta[1]*psi],[ca[0]-xi1[0],ca[1]-xi1[1]]);
    const b=cd([tb[0]*psi-psi1,tb[1]*psi],[cb[0]-xi1[0],cb[1]-xi1[1]]);
    qs+=(2*n+1)*(a[0]*a[0]+a[1]*a[1]+b[0]*b[0]+b[1]*b[1]); qe+=(2*n+1)*(a[0]+b[0]);
    for(let j=0;j<nang;j++){
      const mu=amu[j], p1=pi1[j], tau=n*mu*p1-(n+1)*pi0[j];
      S1[j][0]+=fn*(a[0]*p1+b[0]*tau); S1[j][1]+=fn*(a[1]*p1+b[1]*tau);
      S2[j][0]+=fn*(a[0]*tau+b[0]*p1); S2[j][1]+=fn*(a[1]*tau+b[1]*p1);
      pi1[j]=((2*n+1)*mu*p1-(n+1)*pi0[j])/n; pi0[j]=p1;
    }
    psi0=psi1; psi1=psi; chi0=chi1; chi1=chi; xi1=[psi1,-chi1];
  }
  return {qsca:2/(x*x)*qs,qext:2/(x*x)*qe,S1,S2,ang};
};
D.materials={
  eau:{nom:'Eau liquide (gouttelette de nuage)',m:[1.333,0]},
  glace:{nom:'Glace (cristal arrondi)',m:[1.31,0]},
  sulfate:{nom:'Acide sulfurique / sulfates (aérosol)',m:[1.43,0]},
  poussiere:{nom:'Poussière minérale (désert)',m:[1.55,0.003]},
  suie:{nom:'Suie (fumée)',m:[1.75,0.45]}
};
if(typeof module!=='undefined'&&module.exports) module.exports=D; else root.Diff=D;
})(typeof window!=='undefined'?window:globalThis);
