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
D.pure=l=>{ const L2=Math.min(l,660), c=D.color(x=>Math.abs(x-L2)<2.6?1:0).map(v=>Math.round(v+(255-v)*.22));
  if(l<=660) return c; const f=Math.max(.25,1-(l-660)/100*.75); return c.map(v=>Math.round(v*f)); };   // au-delà de 660 nm l'ajustement CIE donne des teintes fausses : on garde le rouge et on l'assombrit
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
/* ozone : 300 unités Dobson = 8,06·10¹⁸ molécules/cm².
   Section efficace σ(λ) en cm² : bandes de Hartley-Huggins dans l'ultraviolet (valeurs arrondies de la littérature, 293 K),
   bande de Chappuis dans le visible (gaussienne autour de 602 nm, pic 5·10⁻²¹ cm², forme simplifiée). */
const O3UV=[[300,3.9e-19],[305,1.9e-19],[310,1.0e-19],[320,1.6e-20],[330,3e-21],[340,5e-22],[350,1e-22],[360,2e-23],[370,4e-24],[380,1e-24]];
D.sigO3=l=>{ let s=0; if(l<=300) s=O3UV[0][1]; else if(l<380){ let k=0; while(k<O3UV.length-2&&l>O3UV[k+1][0]) k++; const a=O3UV[k], b=O3UV[k+1], f=(l-a[0])/(b[0]-a[0]); s=Math.exp(Math.log(a[1])*(1-f)+Math.log(b[1])*f); }
  const t=(l-602)/58; return s+5.0e-21*Math.exp(-.5*t*t); };
D.NO3=8.06e18;
D.tauO3=l=>D.NO3*D.sigO3(l);
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
  const thetas=Array.isArray(nang)?nang:null; nang=thetas?thetas.length:(nang||0);
  const nstop=Math.floor(x+4*Math.pow(x,1/3)+2), y=[m[0]*x,m[1]*x], nmx=Math.floor(Math.max(nstop,Math.hypot(y[0],y[1]))+15);
  const d=new Array(nmx+1); d[nmx]=[0,0];
  for(let n=nmx;n>=1;n--){ const t=cd([n,0],y), den=[t[0]+d[n][0],t[1]+d[n][1]], inv=cd([1,0],den); d[n-1]=[t[0]-inv[0],t[1]-inv[1]]; }
  const amu=[],pi0=[],pi1=[],S1=[],S2=[],ang=[];
  for(let j=0;j<nang;j++){ const th=thetas?thetas[j]:j*PI/(nang-1); amu.push(Math.cos(th)); pi0.push(0); pi1.push(1); ang.push(th); S1.push([0,0]); S2.push([0,0]); }
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
/* ---------- atmosphère : gaz parfait en équilibre dans la pesanteur ---------- */
/* dp/dz = −ρg et p = ρkT/m  ⇒  ρ(z) = ρ₀·exp(−z/H), avec H = kT/(m·g) */
D.ATM={ T:288.15, m:28.97*1.66054e-27, g:9.80665, rho0:1.225, R:6371, ztop:120 };
D.ATM.H=1.380649e-23*D.ATM.T/(D.ATM.m*D.ATM.g)/1000;   // hauteur d'échelle en km (≈ 8,4)
D.rhoRel=z=>Math.exp(-z/D.ATM.H);
/* Quantité d'air traversée par un rayon qui part du sol vers le Soleil, à la hauteur h (degrés), Terre sphérique de rayon R.
   Renvoie la masse d'air m = (∫ρ ds oblique)/(∫ρ dz vertical), et les échantillons (s en km, ρ/ρ₀) pour tracer l'aire. */
D.trajet=h=>{
  const A=D.ATM, sh=Math.sin(Math.max(h,0)*PI/180), H=A.H, s=[0], r=[1]; let S=0, area=0, prev=1;
  while(true){ const ds=Math.max(H/20,.02*S), S2=S+ds, z=Math.sqrt(A.R*A.R+S2*S2+2*A.R*S2*sh)-A.R;
    if(z>A.ztop) break; const rr=Math.exp(-z/H); area+=(prev+rr)/2*ds; S=S2; prev=rr; s.push(S); r.push(rr); }
  return {m:area/(H*(1-Math.exp(-A.ztop/H))), s, r, L:S, aire:area};
};
/* ---------- indice de l'eau (dispersion), pour l'arc-en-ciel : n ≈ 1,3238 + 3140/λ² (λ en nm), ajusté sur les raies C, D, F ---------- */
D.nEau=l=>1.3238+3140/(l*l);
/* ---------- Champ électromagnétique autour d'une sphère (Mie exact, Bohren & Huffman 1983, §4.4) ----------
   Onde plane polarisée selon x qui avance vers +z, sphère de rayon a, indice réel m, x = 2πa/λ.
   On calcule le champ dans le plan xz (celui qui contient E et la direction de propagation). Unités : le champ incident vaut 1.
   Convention e^{−iωt}. Le champ magnétique est donné multiplié par c (même amplitude que E pour l'onde plane).
   pts : tableau de [X, Z] en unités de k⁻¹ (distance × 2π/λ). Renvoie, pour chaque point, [Ex_diff, Ez_diff, Hy_diff, Ex_tot, Ez_tot, Hy_tot] en [re,im]. */
function jSeq(N,z){ // j_0..j_N de z réel > 0
  const j=new Array(N+1), c=Math.cos(z), sn=Math.sin(z);
  if(z>N||z>=N*.8&&N<4){ j[0]=sn/z; if(N>=1) j[1]=sn/(z*z)-c/z; for(let n=2;n<=N;n++) j[n]=(2*n-1)/z*j[n-1]-j[n-2]; return j; }
  if(z<1){ let f=1; for(let n=0;n<=N;n++){ if(n>0) f*=z/(2*n+1); const z2=z*z; j[n]=f*(1-z2/(2*(2*n+3))*(1-z2/(4*(2*n+5))*(1-z2/(6*(2*n+7))))); } return j; }
  const M=N+Math.ceil(z)+25, f=new Array(M+2).fill(0); f[M]=1e-200; let sc=0;
  for(let n=M;n>=1;n--){ f[n-1]=(2*n+1)/z*f[n]-f[n+1]; if(Math.abs(f[n-1])>1e150){ for(let q=n-1;q<=M;q++) f[q]*=1e-150; } }
  const j0=sn/z, j1=sn/(z*z)-c/z, k=Math.abs(j0)>=Math.abs(j1)?f[0]/j0:f[1]/j1;
  for(let n=0;n<=N;n++) j[n]=f[n]/k; return j;
}
function ySeq(N,z){ const y=new Array(N+1), c=Math.cos(z), sn=Math.sin(z); y[0]=-c/z; if(N>=1) y[1]=-c/(z*z)-sn/z; for(let n=2;n<=N;n++) y[n]=(2*n-1)/z*y[n-1]-y[n-2]; return y; }
D.mieCoef=(x,m)=>{
  const N=Math.max(3,Math.floor(x+4*Math.pow(x,1/3)+2)), jx=jSeq(N,x), yx=ySeq(N,x), jm=jSeq(N,m*x), a=[],b=[],c=[],d=[];
  const jm1=(j,z,n)=>n===0?Math.cos(z)/z:j[n-1];            // j_{-1}(z) = cos z / z
  const ym1=(y,z,n)=>n===0?Math.sin(z)/z:y[n-1];            // y_{-1}(z) = sin z / z
  for(let n=1;n<=N;n++){
    const px=x*jx[n], dpx=x*jm1(jx,x,n)-n*jx[n], cx=x*yx[n], dcx=x*ym1(yx,x,n)-n*yx[n];
    const pm=m*x*jm[n], dpm=m*x*jm1(jm,m*x,n)-n*jm[n];
    const Na=m*pm*dpx-px*dpm, Ya=m*pm*dcx-cx*dpm, Nb=pm*dpx-m*px*dpm, Yb=pm*dcx-m*cx*dpm;
    const Da=Na*Na+Ya*Ya, Db=Nb*Nb+Yb*Yb;
    a.push([Na*Na/Da,-Na*Ya/Da]);                 // Na/(Na+iYa)
    b.push([Nb*Nb/Db,-Nb*Yb/Db]);                 // Nb/(Nb+iYb)
    c.push([m*Yb/Db,m*Nb/Db]);                    // i·m/(Nb+iYb)
    d.push([m*Ya/Da,m*Na/Da]);                    // i·m/(Na+iYa)
  }
  return {N,a,b,c,d};
};
D.mieChamp=(x,m,pts)=>{
  const C=D.mieCoef(x,m), N=C.N, out=[];
  const En=[]; { let re=1, im=0; for(let n=1;n<=N;n++){ // i^n
      const t=re; re=-im; im=t; const f=(2*n+1)/(n*(n+1)); En.push([re*f,im*f]); } }
  const mul=(p,q)=>[p[0]*q[0]-p[1]*q[1],p[0]*q[1]+p[1]*q[0]];
  for(const [X,Z] of pts){
    const rho=Math.max(Math.hypot(X,Z),1e-4), s=X/rho, mu=Z/rho, inside=rho<x;
    const pi=new Array(N+1), ta=new Array(N+1); pi[0]=0; pi[1]=1; ta[1]=mu; for(let n=2;n<=N;n++){ pi[n]=((2*n-1)*mu*pi[n-1]-n*pi[n-2])/(n-1); ta[n]=n*mu*pi[n]-(n+1)*pi[n-1]; }
    let Er=[0,0], Et=[0,0], Hp=[0,0];
    if(!inside){
      const j=jSeq(N,rho), y=ySeq(N,rho);
      for(let n=1;n<=N;n++){
        const zr=j[n], zi=y[n], jn1=n===1?Math.sin(rho)/rho:j[n-1], yn1=n===1?-Math.cos(rho)/rho:y[n-1];   // h_{n−1}
        const dr=jn1-n*zr/rho, di=yn1-n*zi/rho;            // [ρ h_n]'/ρ = h_{n−1} − n h_n/ρ
        const e=En[n-1], a=C.a[n-1], b=C.b[n-1], nn=n*(n+1);
        // E_r = i a n(n+1) sinθ π_n h_n/ρ
        let t=mul(mul(e,a),[zr*s*pi[n]*nn/rho,zi*s*pi[n]*nn/rho]); Er[0]+=-t[1]; Er[1]+=t[0];
        // E_θ = i a τ_n [ρh]'/ρ − b π_n h_n
        t=mul(mul(e,a),[dr*ta[n],di*ta[n]]); Et[0]+=-t[1]; Et[1]+=t[0];
        t=mul(mul(e,b),[zr*pi[n],zi*pi[n]]); Et[0]-=t[0]; Et[1]-=t[1];
        // H_φ = i b π_n [ρh]'/ρ − a τ_n h_n
        t=mul(mul(e,b),[dr*pi[n],di*pi[n]]); Hp[0]+=-t[1]; Hp[1]+=t[0];
        t=mul(mul(e,a),[zr*ta[n],zi*ta[n]]); Hp[0]-=t[0]; Hp[1]-=t[1];
      }
    } else {
      const z=m*rho, j=jSeq(N,z);
      for(let n=1;n<=N;n++){
        const jn1=n===1?Math.sin(z)/z:j[n-1], dj=jn1-n*j[n]/z, e=En[n-1], c=C.c[n-1], d=C.d[n-1], nn=n*(n+1);
        // E_r = −i d n(n+1) sinθ π_n j_n/ρ₁
        let t=mul(mul(e,d),[j[n]*s*pi[n]*nn/z,0]); Er[0]+=t[1]; Er[1]+=-t[0];
        // E_θ = c π_n j_n − i d τ_n [ρ₁ j]'/ρ₁
        t=mul(mul(e,c),[j[n]*pi[n],0]); Et[0]+=t[0]; Et[1]+=t[1];
        t=mul(mul(e,d),[dj*ta[n],0]); Et[0]+=t[1]; Et[1]+=-t[0];
        // H_φ(·c) = −m [ −d τ_n j_n + i c π_n [ρ₁ j]'/ρ₁ ]
        t=mul(mul(e,d),[j[n]*ta[n],0]); Hp[0]+=m*t[0]; Hp[1]+=m*t[1];
        t=mul(mul(e,c),[dj*pi[n],0]); Hp[0]+=m*t[1]; Hp[1]+=-m*t[0];
      }
    }
    // composantes cartésiennes (plan xz, φ = 0) : e_r = (sinθ, cosθ), e_θ = (cosθ, −sinθ)
    const Ex=[Er[0]*s+Et[0]*mu, Er[1]*s+Et[1]*mu], Ez=[Er[0]*mu-Et[0]*s, Er[1]*mu-Et[1]*s];
    const ph=[Math.cos(Z),Math.sin(Z)];              // onde incidente e^{ikz}
    if(inside) out.push([Ex,Ez,Hp,Ex,Ez,Hp]);
    else out.push([Ex,Ez,Hp,[Ex[0]+ph[0],Ex[1]+ph[1]],[Ez[0],Ez[1]],[Hp[0]+ph[0],Hp[1]+ph[1]]]);
  }
  return out;
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
