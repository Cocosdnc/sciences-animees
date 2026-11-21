// Vérifie le catalogue : champs obligatoires, identifiants uniques, fichiers présents.
// Usage : node tools/verifier.mjs
import fs from 'node:fs'; import vm from 'node:vm'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const ctx={window:{}}; vm.runInNewContext(fs.readFileSync(path.join(root,'data/catalogue.js'),'utf8'),ctx);
const VG={window:{}}; vm.runInNewContext(fs.readFileSync(path.join(root,'assets/js/vignettes.js'),'utf8'),VG);
const K=ctx.window.CATALOGUE; const err=[]; const ok=m=>console.log('  ✓ '+m);
const doms=new Set(K.domaines.map(d=>d.id)), NIV=['collège','lycée','supérieur'];
const ids=new Set();
for(const a of K.animations){
  for(const f of ['id','titre','domaine','niveaux','themes','resume','chemin','ajout']) if(!a[f]) err.push(`animation ${a.id||'?'} : champ « ${f} » manquant`);
  if(ids.has(a.id)) err.push(`identifiant en double : ${a.id}`); ids.add(a.id);
  if(!(VG.window.VIGNETTES||{})[a.id]) err.push(`${a.id} : vignette manquante dans assets/js/vignettes.js`);
  if(!doms.has(a.domaine)) err.push(`${a.id} : domaine inconnu « ${a.domaine} »`);
  (a.niveaux||[]).forEach(n=>{ if(!NIV.includes(n)) err.push(`${a.id} : niveau inconnu « ${n} »`); });
  if(!fs.existsSync(path.join(root,a.chemin,'index.html'))) err.push(`${a.id} : ${a.chemin}index.html introuvable`); else ok(`${a.id} → ${a.chemin}`);
  (a.blocs||[]).forEach(b=>{ if(!(K.blocs||[]).some(x=>x.id===b)) err.push(`${a.id} : bloc « ${b} » absent du catalogue`); });
}
for(const b of K.blocs||[]){
  if(ids.has(b.id)) err.push(`identifiant en double : ${b.id}`); ids.add(b.id);
  b.domaines.forEach(d=>{ if(!doms.has(d)) err.push(`bloc ${b.id} : domaine inconnu « ${d} »`); });
  const f=path.join(root,b.script); if(!fs.existsSync(f)) err.push(`bloc ${b.id} : ${b.script} introuvable`);
  else if(!fs.readFileSync(f,'utf8').includes(`defineBloc('${b.id}'`)) err.push(`bloc ${b.id} : ${b.script} ne déclare pas defineBloc('${b.id}')`); else ok(`bloc ${b.id}`);
}
if(err.length){ console.error('\n'+err.map(e=>'  ✗ '+e).join('\n')); process.exit(1); } else console.log('\nCatalogue valide.');

// Carte des notions
const ctx2={window:{}}; vm.runInNewContext(fs.readFileSync(path.join(root,'data/notions.js'),'utf8'),ctx2);
const NO=ctx2.window.NOTIONS, nids=new Set(K.domaines.map(d=>d.id)), err2=[];
for(const n of NO.noeuds){ if(nids.has(n.id)) err2.push(`notion en double : ${n.id}`); nids.add(n.id); }
for(const n of NO.noeuds){ if(!nids.has(n.parent)) err2.push(`notion ${n.id} : parent inconnu « ${n.parent} »`);
  for(const r of [...(n.ressources||[]),...(n.applications||[])]){ if(r.type==='animation'&&!K.animations.some(a=>a.id===r.id)) err2.push(`notion ${n.id} : animation « ${r.id} » inconnue`);
    if(r.type==='bloc'&&!(K.blocs||[]).some(b=>b.id===r.id)) err2.push(`notion ${n.id} : bloc « ${r.id} » inconnu`);
    if(r.type==='animation'&&r.ancre){ const a=K.animations.find(a=>a.id===r.id); const html=fs.readFileSync(path.join(root,a.chemin,'index.html'),'utf8'); if(!html.includes(`id="${r.ancre}"`)) err2.push(`notion ${n.id} : section #${r.ancre} absente de ${a.chemin}`); } } }
for(const [a,b] of NO.liens){ if(!nids.has(a)||!nids.has(b)) err2.push(`lien ${a} ↔ ${b} : notion inconnue`); }
for(const n of NO.noeuds){ for(const r of n.applications||[]) if((n.ressources||[]).some(x=>x.id===r.id&&x.ancre===r.ancre)) err2.push(`notion ${n.id} : la même ressource est à la fois explication et application`); }
if(err2.length){ console.error(err2.map(e=>'  ✗ '+e).join('\n')); process.exit(1); } else console.log(`Carte valide : ${NO.noeuds.length} notions, ${NO.liens.length} liens.`);

// App installable : chaque page doit charger le manifeste et assets/js/app.js (chemins relatifs justes).
const pages=[], err3=[];
(function walk(d){ for(const e of fs.readdirSync(d,{withFileTypes:true})){ if(e.name.startsWith('.')||e.name==='node_modules') continue;
  const p=path.join(d,e.name); if(e.isDirectory()) walk(p); else if(e.name.endsWith('.html')) pages.push(p); } })(root);
for(const p of pages){ const html=fs.readFileSync(p,'utf8'), rel=path.relative(root,p).split(path.sep).join('/');
  let pre=path.relative(path.dirname(p),root).split(path.sep).join('/'); pre=pre?pre+'/':'';
  for(const f of ['manifest.webmanifest','assets/js/app.js']) if(!html.includes(`"${pre}${f}"`)) err3.push(`${rel} : ne charge pas ${pre}${f} (copier les 5 lignes « app » d’une autre page, avant </head>)`); }
for(const f of ['manifest.webmanifest','sw.js','assets/js/app.js','assets/app/icone-192.png','assets/app/icone-512.png','assets/app/icone-masquable-512.png','assets/app/icone-180.png','assets/app/icone.svg'])
  if(!fs.existsSync(path.join(root,f))) err3.push(`${f} introuvable`);
if(err3.length){ console.error(err3.map(e=>'  ✗ '+e).join('\n')); process.exit(1); } else console.log(`App valide : ${pages.length} pages installables et lisibles hors ligne.`);
