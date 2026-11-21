/* Sciences animées en app : le service worker.
   - Tout le site est mis en réserve pour marcher hors ligne. La liste des pages est lue dans
     data/catalogue.js (champs « chemin » et « script »), puis chaque page donne ses propres
     fichiers (src et href) : rien à tenir à jour à la main quand on ajoute une animation.
   - En ligne, le réseau passe toujours en premier : chaque push sur main est visible tout de suite.
     Sans réseau (ou s'il traîne plus de 3,5 s), on sert la réserve.
   - Les polices Google sont gardées une fois pour toutes (elles ne changent pas).
   Changer NUMERO seulement si l'on modifie ce fichier en profondeur : les anciennes réserves sont effacées. */
const NUMERO = 1;
const RESERVE = 'sciences-animees-v' + NUMERO;
const POLICES = 'sciences-animees-polices-v' + NUMERO;
const RACINE = new URL('./', self.location).href;
const POLICES_HOTES = ['fonts.googleapis.com', 'fonts.gstatic.com'];
const SOCLE = ['./', 'carte.html', 'blocs/', 'blocs/voir.html', 'manifest.webmanifest', 'data/catalogue.js', 'data/notions.js'];

const absolue = p => new URL(p, RACINE).href;
const duSite = u => u.startsWith(RACINE);
const police = u => POLICES_HOTES.includes(new URL(u).hostname);

/** Adresses (src, href, url()) citées par une page ou une feuille de style, ramenées au site et aux polices. */
function citees(texte, base) {
  const out = new Set();
  for (const m of texte.matchAll(/\b(?:src|href)\s*=\s*["']([^"'#]+)|url\(\s*["']?([^"')]+)/g)) {
    try {
      const u = new URL(m[1] || m[2], base);
      u.hash = '';
      if (duSite(u.href) || police(u.href)) out.add(u.href);
    } catch (e) { /* adresse invalide : ignorée */ }
  }
  return out;
}

/** Remplit (ou rafraîchit) la réserve hors ligne. Ne lève jamais d'erreur : un fichier manquant est simplement sauté. */
async function remplir() {
  const reserve = await caches.open(RESERVE), polices = await caches.open(POLICES);
  const pages = new Set(SOCLE.map(absolue));
  try {
    const cat = await (await fetch(absolue('data/catalogue.js'), { cache: 'no-cache' })).text();
    for (const m of cat.matchAll(/\b(?:chemin|script)\s*:\s*'([^']+)'/g)) pages.add(absolue(m[1]));
  } catch (e) { /* hors ligne : on garde ce qu'on a */ }

  const vus = new Set();
  const garder = async url => {
    if (vus.has(url)) return '';
    vus.add(url);
    try {
      const p = police(url);
      if (p && (await polices.match(url))) return '';
      const rep = await fetch(url, { cache: p ? 'default' : 'no-cache' });
      if (!rep.ok) return '';
      const type = rep.headers.get('content-type') || '';
      const texte = /html|css/.test(type) ? await rep.clone().text() : '';
      await (p ? polices : reserve).put(url, rep);
      return texte;
    } catch (e) { return ''; }
  };

  // Les pages, puis ce qu'elles citent, puis ce que citent les feuilles de style (polices).
  let vague = [...pages];
  for (let tour = 0; tour < 3 && vague.length; tour++) {
    const suite = new Set();
    await Promise.all(vague.map(async url => {
      const texte = await garder(url);
      if (texte) for (const c of citees(texte, url)) if (!vus.has(c) && (tour < 1 || /\.css|fonts\./.test(c))) suite.add(c);
    }));
    vague = [...suite];
  }
}

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(remplir());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('sciences-animees-') && k !== RESERVE && k !== POLICES) await caches.delete(k);
    await self.clients.claim();
  })());
});

// Demandé par assets/js/app.js une fois par jour : prendre les nouvelles animations.
self.addEventListener('message', e => {
  if (e.data === 'actualiser') e.waitUntil(remplir());
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  if (police(r.url)) return e.respondWith(reserveDabord(r));
  if (duSite(r.url)) return e.respondWith(reseauDabord(e));
});

async function reserveDabord(r) {
  const polices = await caches.open(POLICES);
  const vu = await polices.match(r, { ignoreVary: true });
  if (vu) return vu;
  const rep = await fetch(r);
  if (rep.ok || rep.type === 'opaque') polices.put(r, rep.clone());
  return rep;
}

async function reseauDabord(e) {
  const r = e.request;
  const reserve = await caches.open(RESERVE);
  const garde = await reserve.match(r, { ignoreVary: true });
  const reseau = fetch(r, { cache: 'no-cache' }).then(rep => {
    if (rep.ok && rep.type === 'basic') e.waitUntil(reserve.put(r.url, rep.clone()));
    return rep;
  });
  e.waitUntil(reseau.catch(() => {}));
  if (!garde) return reseau.catch(() => horsLigne(r));
  const lent = new Promise(ok => setTimeout(() => ok(garde), 3500));
  return Promise.race([reseau.catch(() => garde), lent]);
}

function horsLigne(r) {
  if (r.mode !== 'navigate') return Response.error();
  const accueil = absolue('./');
  return new Response(
    '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>Hors ligne · Sciences animées</title></head>' +
    '<body style="margin:0;padding:32px 20px;background:#090D12;color:#E8EEF4;font:16px/1.6 system-ui,sans-serif">' +
    '<h1 style="font-size:22px">Pas de réseau</h1>' +
    '<p>Cette page n’a pas encore été mise en réserve sur cet appareil. Elle le sera à la prochaine connexion.</p>' +
    '<p><a style="color:#FF3D33" href="' + accueil + '">Retour à l’accueil</a></p></body></html>',
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
}
