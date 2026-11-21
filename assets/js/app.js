/* Sciences animées en app : chargé par toutes les pages (voir tools/verifier.mjs).
   - Enregistre le service worker (sw.js, à la racine) : site installable et lisible hors ligne.
   - Une fois par jour, lui demande de rafraîchir la réserve hors ligne (nouvelles animations).
   - Affiche les éléments [data-installer] quand le navigateur propose l'installation
     (Android, Chrome, Edge), et [data-installer-ios] sur iPhone/iPad dans Safari.
   Rien ne se passe en ouvrant les fichiers en local (file://) : le site marche comme avant. */
(function () {
  var script = document.currentScript;
  if (!script) return;
  var racine = new URL('../../', script.src);
  var installee = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  if (installee) document.documentElement.classList.add('app-installee');

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    navigator.serviceWorker.register(new URL('sw.js', racine), { scope: racine.pathname }).then(function () {
      if (!navigator.serviceWorker.controller) return; // premier passage : l'installation remplit déjà la réserve
      try {
        var cle = 'sciences-animees:reserve', maintenant = Date.now();
        if (maintenant - (+localStorage.getItem(cle) || 0) < 864e5) return;
        localStorage.setItem(cle, String(maintenant));
      } catch (e) { return; }
      navigator.serviceWorker.ready.then(function (reg) { if (reg.active) reg.active.postMessage('actualiser'); });
    }).catch(function () {});
  }

  var proposition = null;
  function montrer(sel, oui) {
    document.querySelectorAll(sel).forEach(function (el) { el.hidden = !oui; });
  }
  addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    proposition = e;
    montrer('[data-installer]', true);
  });
  addEventListener('appinstalled', function () {
    proposition = null;
    montrer('[data-installer]', false);
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-installer]');
    if (!b || !proposition) return;
    proposition.prompt();
    proposition.userChoice.finally(function () {
      proposition = null;
      montrer('[data-installer]', false);
    });
  });
  var ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (ios && !installee) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { montrer('[data-installer-ios]', true); });
    else montrer('[data-installer-ios]', true);
  }
})();
