// Vérifie le catalogue : champs obligatoires, identifiants uniques, fichiers présents.
// Usage : node tools/verifier.mjs
import fs from 'node:fs'; import vm from 'node:vm'; import path from 'node:path';
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const ctx={window:{}}; vm.runInNewContext(fs.readFileSync(path.join(root,'data/catalogue.js'),'utf8'),ctx);
const K=ctx.window.CATALOGUE; const err=[]; const ok=m=>console.log('  ✓ '+m);
const doms=new Set(K.domaines.map(d=>d.id)), NIV=['collège','lycée','supérieur'];
const ids=new Set();
for(const a of K.animations){
  for(const f of ['id','titre','domaine','niveaux','themes','resume','chemin','ajout']) if(!a[f]) err.push(`animation ${a.id||'?'} : champ « ${f} » manquant`);
  if(ids.has(a.id)) err.push(`identifiant en double : ${a.id}`); ids.add(a.id);
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
