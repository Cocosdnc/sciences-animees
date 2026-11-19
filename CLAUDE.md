# Sciences animées : mode d'emploi pour l'IA

Site statique (HTML/CSS/JS, **aucune étape de construction**) d'animations scientifiques interactives, en français.
Publié par GitHub Pages depuis `main` : https://cocosdnc.github.io/sciences-animees/

## À lire en premier
1. `docs/STRUCTURE.md` : plan complet et à jour (animations et leurs ancres, modèles, arbre des notions, notions « à venir »). **Ne pas explorer le dépôt à la main : tout est là.**
2. `docs/CONVENTIONS.md` : règles de pédagogie, de dessin et d'écriture (à respecter).
3. `README.md` : organisation des dossiers.

## Règles du propriétaire
- **Toujours pousser chaque modification sur `main`** (pas de branche de travail), avec un message de commit clair en français.
- Écrire en français simple, tutoiement dans les consignes, pas de remplissage.
- Expliquer le *pourquoi*, donner les vrais chiffres avec unités, dire honnêtement ce qui est simplifié, citer des sources.
- Une animation ne compte comme « explication » d'une notion que si elle l'explique vraiment (sinon : `applications`).
- Rappeler que l'onde de l'électron est une onde de probabilité, et que son signe négatif n'est pas une probabilité négative (le carré donne la probabilité).
- Animations les plus réalistes possible, le moins de simplifications. Ne jamais casser `retouche.js` ni `.github/workflows/retouche.yml` (correction du site depuis le site).

## Carte rapide
| Je veux… | Je touche à… |
|---|---|
| ajouter une animation | `animations/<domaine>/<id>/index.html` (copier `animations/_modele/`), `data/catalogue.js`, `assets/js/vignettes.js`, `data/notions.js` |
| ajouter un modèle réutilisable | `assets/js/blocs/<id>.js` (`Labo.defineBloc('<id>',{titre,mount(el){…}})`) + entrée `blocs` de `data/catalogue.js` |
| ajouter une notion à la carte | `data/notions.js` (`noeuds` + `liens`) |
| changer les styles communs | `assets/css/base.css` (jetons de couleur en tête) |
| changer les outils de dessin | `assets/js/labo.js` (`window.Labo`) |

## Ajouter une animation : marche à suivre
1. Copier `animations/_modele/` vers `animations/<domaine>/<id>/` (domaines : `physique`, `chimie`, `biologie`, `terre-univers`, `maths`).
2. Une `<section id="ancre">` par idée (l'ancre sert à la carte des notions). Panneau = `.panel` avec `.view` (canevas), `.lc` (réglages), `.caption`, puis `.infobar` + `.infobox` (boutons « i » : notions nouvelles, **ce qui est simplifié**, sources). `Labo.mountBlocs()` range la colonne « Comprendre » à gauche.
3. `data/catalogue.js` : entrée `animations` (id, titre, domaine, niveaux, themes, resume, chemin, signe, ajout, blocs).
4. `assets/js/vignettes.js` : une vignette SVG 300×120 (clé = id). Le vérificateur refuse une animation sans vignette.
5. `data/notions.js` : rattacher aux notions (`ressources` = explique, `applications` = utilise). Format `{type:'animation',id,ancre,titre}`. Une même ressource ne peut pas être à la fois explication et application.
6. `node tools/verifier.mjs` (doit afficher « Catalogue valide » et « Carte valide »), puis `node tools/structure.mjs` pour régénérer `docs/STRUCTURE.md`.
7. Relire avec la liste de `docs/CONVENTIONS.md`, commit, **push sur `main`**.

## Outils de dessin (`Labo`, dans `assets/js/labo.js`)
`Labo.setup(idCanevas,W,H)` → `{ctx,base()}` (appeler `V.base()` à chaque image) · `Labo.onFrame(dt=>…, V.cv)` (boucle, ne calcule rien hors écran) · `bgLab`, `vignette` (fond et vignettage) · `sph`, `glow`, `elec` (sphères, halos, électron) · `line`, `arrow`, `poly`, `rr`, `wave`, `beam` · `txt`, `tag`, `lead` (étiquettes) · `infoBar(barre,boite,clés,INFO)` · `mountBlocs()` · `Labo.reduce` (respecter « réduire les animations ») · `Labo.C` (couleurs).

## Couleurs fixes (ne pas en changer le sens)
électron libre rouge lumineux `#FF4A40` · électron de liaison rose pâle · trou anneau ambre `#FFB547` · onde positive `#FF8A80` · onde négative `#6FB6FF` · noyau point blanc · couche p violet, n vert, zone active rouge.

## Pièges connus
- Le dépôt GitHub est `Cocosdnc/sciences-animees` (pas `science-animation`). Compte personnel `cocosdnc`, pas `neocodeconsulting-gif`.
- Les ancres de `notions.js` doivent exister dans la page (`id="…"`), sinon `verifier.mjs` échoue.
- Les accents dans `catalogue.js` : utiliser `’` pour l'apostrophe typographique dans les chaînes entre apostrophes.
- Largeur téléphone 390 px : rien ne doit déborder horizontalement.
- Pas d'installation de paquets : tout tient en JS/CSS natifs, polices via Google Fonts.

## Chantiers en cours
- Aucun. Dernier ajout : page `nombres-quantiques` (n, l, m, spin / Stern et Gerlach). Idées pour la suite : orbitales f, structure fine et couplage spin-orbite, règles de Hund et de Klechkowski (ordre de remplissage), tableau périodique interactif relié aux cases.
