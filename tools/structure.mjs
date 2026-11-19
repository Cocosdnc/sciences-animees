// Génère docs/STRUCTURE.md : plan complet du site, lisible d'un coup par une IA (ou une personne).
// Usage : node tools/structure.mjs   (à relancer après chaque ajout de page, de modèle ou de notion)
import fs from 'node:fs'; import vm from 'node:vm'; import path from 'node:path';
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const load=f=>{ const c={window:{}}; vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),c); return c.window; };
const K=load('data/catalogue.js').CATALOGUE, N=load('data/notions.js').NOTIONS;
const strip=s=>s.replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
const out=[]; const p=s=>out.push(s);

p('# Structure du site (fichier généré)');
p('');
p('> Généré par `node tools/structure.mjs` à partir de `data/catalogue.js`, `data/notions.js` et des pages. **Ne pas modifier à la main** : relancer la commande après chaque ajout.');
p('> Règles et marche à suivre : voir `CLAUDE.md` (racine) et `docs/CONVENTIONS.md`.');
p('');

/* ---------- animations ---------- */
p('## Animations');
const usedBy={};
for(const a of K.animations){
  const html=fs.readFileSync(path.join(root,a.chemin,'index.html'),'utf8');
  const secs=[]; const parts=html.split(/<section\b/).slice(1);
  for(const part of parts){ const id=(part.match(/^[^>]*\bid="([^"]+)"/)||[])[1]; const h2=(part.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)||[])[1]; if(id) secs.push({id,titre:h2?strip(h2):''}); }
  const blocsUtilises=new Set([...(a.blocs||[]),...[...html.matchAll(/data-bloc="([^"]+)"/g)].map(m=>m[1])]);
  blocsUtilises.forEach(b=>(usedBy[b]=usedBy[b]||[]).push(a.id));
  p(`### ${a.titre}  (\`${a.id}\`)`);
  p(`- Domaine : ${a.domaine} · niveaux : ${a.niveaux.join(', ')} · ajout : ${a.ajout}`);
  p(`- Dossier : \`${a.chemin}index.html\``);
  p(`- Sections (ancres utilisables dans \`notions.js\`) : ${secs.length?secs.map(s=>`\`#${s.id}\`${s.titre?' '+s.titre:''}`).join(' · '):'aucune'}`);
  p(`- Modèles utilisés : ${blocsUtilises.size?[...blocsUtilises].map(b=>`\`${b}\``).join(', '):'aucun'}`);
  p('');
}

/* ---------- blocs ---------- */
p('## Modèles réutilisables (blocs)');
p('| id | titre | domaines | fichier | utilisé par |'); p('|---|---|---|---|---|');
for(const b of K.blocs||[]) p(`| \`${b.id}\` | ${b.titre} | ${b.domaines.join(', ')} | \`${b.script}\` | ${(usedBy[b.id]||[]).map(x=>`\`${x}\``).join(', ')||'—'} |`);
p('');

/* ---------- carte des notions ---------- */
const kids={}; N.noeuds.forEach(n=>(kids[n.parent]=kids[n.parent]||[]).push(n));
const nbRes=n=>(n.ressources||[]).length+(kids[n.id]||[]).reduce((s,c)=>s+nbRes(c),0);
const aVenir=[];
function walk(id,depth){
  for(const n of kids[id]||[]){
    const feuille=!(kids[n.id]||[]).length, r=nbRes(n), app=(n.applications||[]).length;
    const etat=n.application?'application':(r?`${r} ressource${r>1?'s':''}`:'**à venir**');
    if(!n.application&&!r&&feuille) aVenir.push(n);
    p(`${'  '.repeat(depth)}- \`${n.id}\` ${n.titre} — ${etat}${app?` · ${app} application${app>1?'s':''}`:''}`);
    walk(n.id,depth+1);
  }
}
p('## Carte des notions (domaine › thème › sous-thème › notion)');
for(const d of K.domaines){ p(`### ${d.nom} (\`${d.id}\`)`); walk(d.id,0); p(''); }

p('## Feuille de route : notions sans explication (« à venir »)');
if(aVenir.length) aVenir.forEach(n=>p(`- \`${n.id}\` ${n.titre} (sous \`${n.parent}\`) : ${n.resume||''}`)); else p('Aucune.');
p('');
p(`_${K.animations.length} animations · ${(K.blocs||[]).length} modèles · ${N.noeuds.length} notions · ${N.liens.length} liens._`);

fs.writeFileSync(path.join(root,'docs/STRUCTURE.md'),out.join('\n')+'\n');
console.log(`docs/STRUCTURE.md écrit (${K.animations.length} animations, ${(K.blocs||[]).length} modèles, ${N.noeuds.length} notions).`);
