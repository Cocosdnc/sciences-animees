# Structure du site (fichier généré)

> Généré par `node tools/structure.mjs` à partir de `data/catalogue.js`, `data/notions.js` et des pages. **Ne pas modifier à la main** : relancer la commande après chaque ajout.
> Règles et marche à suivre : voir `CLAUDE.md` (racine) et `docs/CONVENTIONS.md`.

## Animations
### Dans la diode laser  (`diode-laser`)
- Domaine : physique · niveaux : collège, lycée, supérieur · ajout : 2026-11-11
- Dossier : `animations/physique/diode-laser/index.html`
- Sections (ancres utilisables dans `notions.js`) : `#scope` Du pointeur aux atomes · `#atome-liaisons` Pourquoi un électron tient, et pourquoi les atomes se lient · `#couleur` Le dosage des atomes règle la couleur · `#blanc` La LED blanche : du bleu et de la poudre jaune
- Modèles utilisés : aucun

### Atome et liaisons  (`atome-et-liaisons`)
- Domaine : physique · niveaux : lycée, supérieur · ajout : 2026-11-16
- Dossier : `animations/physique/atome-et-liaisons/index.html`
- Sections (ancres utilisables dans `notions.js`) : `#atomeseul` Pourquoi l'électron tient autour du noyau · `#liaison` Au cœur d'une liaison Ga–P, en 3D
- Modèles utilisés : `nuage-probabilite`, `liante-antiliante`, `energie-liaison`, `corde-orbitale`

### Les nombres quantiques : n, l, m et le spin  (`nombres-quantiques`)
- Domaine : physique · niveaux : lycée, supérieur · ajout : 2026-11-19
- Dossier : `animations/physique/nombres-quantiques/index.html`
- Sections (ancres utilisables dans `notions.js`) : `#adresse-intro` Une adresse en quatre nombres · `#niveau-n` n : la couche, donc l'énergie · `#forme-l` l : la forme du nuage · `#orientation-m` m : vers où pointe la forme · `#spin` Le spin : deux orientations, et rien d'autre · `#adresse` Les cases d'une couche, électron par électron
- Modèles utilisés : `corde-vibrante`

### Combien de temps met la lumière ?  (`vitesse-lumiere`)
- Domaine : physique · niveaux : collège · ajout : 2026-11-11
- Dossier : `animations/physique/vitesse-lumiere/index.html`
- Sections (ancres utilisables dans `notions.js`) : aucune
- Modèles utilisés : aucun

### Ciel et diffusion : pourquoi le ciel est bleu  (`ciel-et-diffusion`)
- Domaine : physique · niveaux : lycée, supérieur · ajout : 2026-11-16
- Dossier : `animations/physique/ciel-et-diffusion/index.html`
- Sections (ancres utilisables dans `notions.js`) : `#blanc` La lumière blanche est un mélange de couleurs · `#molecule` Une molécule d'air, secouée par la lumière · `#lambda` Et si ce n'était pas de l'air ? · `#jour` Le ciel de jour · `#soir` Le coucher de soleil · `#mie` Quand les particules grossissent : gouttes, poussières, nuages · `#arc` L'arc-en-ciel : pourquoi la pluie colore et pas le nuage · `#apps` Ce que ça explique, et les limites
- Modèles utilisés : `lumiere-blanche`, `lampes-rvb`, `molecule-secouee`, `diffusion-lambda`, `ciel-de-jour`, `densite-atmosphere`, `coucher-de-soleil`, `onde-particule`, `diffusion-mie`, `arc-en-ciel`

### L’œil et les cônes : pourquoi le bleu est moins net  (`oeil-cones`)
- Domaine : biologie · niveaux : collège, lycée · ajout : 2026-11-17
- Dossier : `animations/biologie/oeil-cones/index.html`
- Sections (ancres utilisables dans `notions.js`) : `#images` L'œil et la rétine, en vrai · `#cones` Trois sortes de cônes · `#test` Le test de la boule blanche · `#pourquoi` Pourquoi le bleu est moins net
- Modèles utilisés : `cones-sensibilite`, `test-cones`

### Que se passe-t-il quand on touche un objet ?  (`toucher-atomes`)
- Domaine : physique · niveaux : collège, lycée, supérieur · ajout : 2026-11-12
- Dossier : `animations/physique/toucher-atomes/index.html`
- Sections (ancres utilisables dans `notions.js`) : `#vide` Un noyau minuscule dans un grand nuage · `#deux-atomes` Deux atomes qui s’approchent · `#antiliante` Pourquoi deux nuages pleins se repoussent · `#couche-incomplete` Et si la dernière couche n’est pas pleine ? · `#surfaces` Ton doigt appuie sur l’objet · `#retenir` Alors, est-ce qu’on touche vraiment ?
- Modèles utilisés : `liante-antiliante`, `energie-liaison`

### Coller deux métaux, est-ce faire un alliage ?  (`alliage`)
- Domaine : chimie · niveaux : collège, lycée, supérieur · ajout : 2026-11-12
- Dossier : `animations/chimie/alliage/index.html`
- Sections (ancres utilisables dans `notions.js`) : `#froid` Presser deux blocs à froid · `#chauffer` Chauffer : les atomes sautent de trou en trou · `#fondre` Comment on fait vraiment : fondre, mélanger, refroidir · `#retenir` Coller, souder, allier
- Modèles utilisés : aucun

## Modèles réutilisables (blocs)
| id | titre | domaines | fichier | utilisé par |
|---|---|---|---|---|
| `creux-atome` | Le creux de l’atome | physique, chimie | `assets/js/blocs/creux-atome.js` | — |
| `corde-vibrante` | La corde vibrante | physique, chimie | `assets/js/blocs/corde-vibrante.js` | `nombres-quantiques` |
| `nuage-probabilite` | Où trouve-t-on l’électron ? | chimie, physique | `assets/js/blocs/nuage-probabilite.js` | `atome-et-liaisons` |
| `liante-antiliante` | Liante et antiliante : où est l’électron entre deux atomes ? | chimie, physique | `assets/js/blocs/liante-antiliante.js` | `atome-et-liaisons`, `toucher-atomes` |
| `energie-liaison` | Pourquoi l’énergie baisse, et où elle part | chimie, physique | `assets/js/blocs/energie-liaison.js` | `atome-et-liaisons`, `toucher-atomes` |
| `corde-orbitale` | De la corde à l’orbitale | physique, chimie | `assets/js/blocs/corde-orbitale.js` | `atome-et-liaisons` |
| `pendules-couples` | Deux pendules couplés, un électron partagé | physique, chimie | `assets/js/blocs/pendules-couples.js` | — |
| `lumiere-blanche` | La lumière blanche contient toutes les couleurs | physique | `assets/js/blocs/lumiere-blanche.js` | `ciel-et-diffusion` |
| `lampes-rvb` | Trois lampes qui donnent du blanc | physique | `assets/js/blocs/lampes-rvb.js` | `ciel-et-diffusion` |
| `molecule-secouee` | Une molécule d’air secouée par la lumière | physique, chimie | `assets/js/blocs/molecule-secouee.js` | `ciel-et-diffusion` |
| `diffusion-lambda` | Et pour une autre molécule ? | physique, chimie | `assets/js/blocs/diffusion-lambda.js` | `ciel-et-diffusion` |
| `ciel-de-jour` | Pourquoi le ciel est bleu, et pas violet | physique | `assets/js/blocs/ciel-de-jour.js` | `ciel-et-diffusion` |
| `densite-atmosphere` | Combien d’air un rayon traverse-t-il ? | physique | `assets/js/blocs/densite-atmosphere.js` | `ciel-et-diffusion` |
| `coucher-de-soleil` | Le coucher de soleil | physique | `assets/js/blocs/coucher-de-soleil.js` | `ciel-et-diffusion` |
| `diffusion-mie` | Gouttes, poussières, nuages : quand la particule grossit | physique | `assets/js/blocs/diffusion-mie.js` | `ciel-et-diffusion` |
| `onde-particule` | L’onde et la particule : le champ se construit sous tes yeux | physique | `assets/js/blocs/onde-particule.js` | `ciel-et-diffusion` |
| `arc-en-ciel` | L’arc-en-ciel : une goutte de pluie, une goutte de nuage | physique | `assets/js/blocs/arc-en-ciel.js` | `ciel-et-diffusion` |
| `cones-sensibilite` | Les trois sortes de cônes | biologie, physique | `assets/js/blocs/cones-sensibilite.js` | `oeil-cones` |
| `test-cones` | Test : une boule blanche éclairée en bleu, en vert, en rouge | biologie, physique | `assets/js/blocs/test-cones.js` | `oeil-cones` |

## Carte des notions (domaine › thème › sous-thème › notion)
### Physique (`physique`)
- `lumiere` Lumière — 22 ressources
  - `propagation` Propagation de la lumière — 1 ressource
    - `vitesse-lumiere` Vitesse de la lumière — 1 ressource
  - `emission-lumiere` Émission de lumière — 3 ressources
    - `emission` Émission spontanée et stimulée — 2 ressources
    - `fluorescence` Absorber puis réémettre — 1 ressource
  - `couleur-spectre` Couleur et spectre — 2 ressources
    - `longueur-onde` Longueur d’onde, énergie et couleur — 1 ressource
    - `synthese-additive` Synthèse additive — 1 ressource · 1 application
  - `diffusion-lumiere` Diffusion de la lumière — 14 ressources
    - `rayleigh` Diffusion de Rayleigh — 4 ressources
    - `ciel-couleur` La couleur du ciel — 2 ressources
    - `coucher-soleil` Le coucher de soleil — 3 ressources
    - `mie` Diffusion de Mie — 3 ressources
    - `arc-en-ciel` L’arc-en-ciel — 2 ressources
    - `applications-diffusion` Applications — application
  - `applications-lumiere` Applications — application
    - `led` LED — application · 1 application
    - `laser` Laser — application
    - `led-blanche` LED blanche — application
- `ondes` Ondes — 3 ressources
  - `onde-stationnaire` Ondes stationnaires — 2 ressources
  - `oscillateurs-couples` Oscillateurs couplés — 1 ressource
  - `interferences` Interférences — **à venir** · 2 applications
- `electricite` Électricité — 5 ressources
  - `tension-acceleration` Tension et accélération des électrons — 1 ressource
  - `semi-conducteurs` Semi-conducteurs — 3 ressources
    - `dopage` Dopage n et p — 1 ressource
    - `jonction-pn` Jonction p-n — 1 ressource
    - `bandes` Bandes d’énergie et gap — 1 ressource · 1 application
  - `applications-electricite` Applications — application
    - `diode` Diodes électroluminescentes et laser — application
    - `tube-cathodique` Canon à électrons — application
- `forces-contact` Forces et contact — 5 ressources
  - `contact-atomes` Pourquoi deux objets se touchent sans se traverser — 2 ressources
  - `adhesion` Coller ou se repousser — 2 ressources
  - `surface-reelle` Surface de contact réelle — 1 ressource
- `atome-liaisons` Atome et liaisons — 26 ressources
  - `dualite` Onde ou particule — 2 ressources
    - `electron-onde` L’électron est une onde — 1 ressource
    - `de-broglie` Longueur d’onde de de Broglie — 1 ressource
  - `atome-quantique` L’atome quantique — 5 ressources
    - `creux` Pourquoi l’électron ne tombe pas — 2 ressources
    - `couches` Couches et orbitales — 2 ressources
    - `pauli` Principe de Pauli — 1 ressource · 2 applications
  - `nombres-quantiques` Les nombres quantiques — 6 ressources
    - `nq-n` n : la couche et l’énergie — 2 ressources
    - `nq-l` l : la forme du nuage — 1 ressource
    - `nq-m` m : l’orientation et l’effet Zeeman — 1 ressource
    - `nq-spin` Le spin et l’expérience de Stern et Gerlach — 1 ressource
    - `nq-adresse` L’adresse complète d’un électron — 1 ressource
  - `structure-atome` Structure de l’atome — 3 ressources
    - `noyau-nuage` Noyau et nuage électronique — 2 ressources
    - `valence` Électrons de valence — 1 ressource
  - `liaison-chimique` Liaison chimique — 8 ressources
    - `covalente` Liaison covalente — 2 ressources
    - `orbitales-mol` Orbitales liantes et antiliantes — 4 ressources
    - `octet` La règle des 8 — 1 ressource
    - `van-der-waals` Forces de van der Waals — 1 ressource
  - `applications-atome` Applications — application
    - `atome-lumiere-diode` La lumière des LED et du laser — application

### Chimie (`chimie`)
- `solides` Solides et cristaux — 4 ressources
  - `cristaux` Cristaux et réseaux — **à venir** · 1 application
  - `alliage-metal` Fabriquer un alliage — 2 ressources
  - `diffusion-solide` Diffusion dans les solides — 1 ressource
  - `alliages` Alliages III-V et couleur — 1 ressource

### Biologie (`biologie`)
- `vision` La vision — 3 ressources
  - `cones` Les cônes et la couleur — 3 ressources · 1 application
- `sens` Les sens — **à venir**
  - `toucher` Le toucher — **à venir** · 1 application

### Terre et Univers (`terre-univers`)
- `systeme-solaire` Système solaire — **à venir**
  - `distances` Distances dans le système solaire — **à venir** · 1 application
- `etoiles` Étoiles — **à venir**
  - `spectres-etoiles` La lumière des étoiles — **à venir**

### Mathématiques (`maths`)
- `fonctions` Fonctions — **à venir**
  - `sinus` Fonctions sinus et ondes — **à venir**
  - `exponentielle` Exponentielle — **à venir**

## Feuille de route : notions sans explication (« à venir »)
- `interferences` Interférences (sous `ondes`) : Des ondes qui se renforcent ou s’annulent selon leur décalage.
- `cristaux` Cristaux et réseaux (sous `solides`) : Un empilement régulier d’atomes.
- `toucher` Le toucher (sous `sens`) : Des capteurs sous la peau détectent sa déformation quand elle appuie sur un objet.
- `distances` Distances dans le système solaire (sous `systeme-solaire`) : 384 400 km jusqu’à la Lune, 150 millions de km jusqu’au Soleil.
- `spectres-etoiles` La lumière des étoiles (sous `etoiles`) : Raies et couleurs : la composition et la température des étoiles.
- `sinus` Fonctions sinus et ondes (sous `fonctions`) : La forme de toutes les ondes, et leurs additions.
- `exponentielle` Exponentielle (sous `fonctions`) : Ce qui décroît en gardant la même proportion : nuages électroniques, absorption.

_8 animations · 19 modèles · 77 notions · 53 liens._
