# Sciences animées

Des animations interactives pour comprendre les sciences : physique, chimie, biologie, Terre et Univers, mathématiques.
Chaque animation montre le mécanisme réel, explique le *pourquoi*, et dit toujours ce qui est simplifié.

Site statique, sans étape de construction : il s'héberge tel quel sur GitHub Pages et s'ouvre aussi en local en double-cliquant sur `index.html`.

## Organisation

```
index.html                    Accueil : domaines, catalogue filtrable, modèles
data/catalogue.js             LE fichier à modifier pour ajouter une animation ou un modèle
assets/css/base.css           Styles communs (couleurs, panneaux, boutons, colonne « Comprendre »)
assets/js/labo.js             Outils communs : dessin sur canevas, boutons « i », horloge, blocs
assets/js/blocs/<id>.js       Modèles réutilisables (un fichier par modèle)
blocs/                        Galerie des modèles ; voir.html#<id> affiche un modèle seul
animations/<domaine>/<id>/    Une animation = un dossier avec son index.html
animations/_modele/           Point de départ à copier pour une nouvelle animation
docs/CONVENTIONS.md           Règles de conception (pédagogie, dessin, écriture)
tools/verifier.mjs            Vérifie le catalogue (node tools/verifier.mjs)
```

## Animations et modèles (blocs)

- Une **animation** est une page qui raconte un sujet de bout en bout (exemple : *Dans la diode laser*).
- Un **modèle** (bloc) est une brique autonome qui explique une idée et sert dans plusieurs sujets ou domaines :
  le creux de l'atome, la corde vibrante, les orbitales liantes et antiliantes…

Insérer un modèle dans n'importe quelle page :

```html
<div data-bloc="orbitales-liantes"></div>
<script src="../../../assets/js/labo.js"></script>
<script src="../../../assets/js/blocs/orbitales-liantes.js"></script>
<script>Labo.mountBlocs();</script>
```

## Ajouter une animation

1. Copier `animations/_modele/` vers `animations/<domaine>/<id>/`.
2. Écrire la page (une section = une idée ; réutiliser les modèles existants quand c'est possible).
3. Ajouter une entrée dans `data/catalogue.js` (champs décrits en tête du fichier).
4. Lancer `node tools/verifier.mjs`.
5. Relire avec la liste de `docs/CONVENTIONS.md`.

## Ajouter un modèle

1. Créer `assets/js/blocs/<id>.js` avec `Labo.defineBloc('<id>', { titre, mount(el){ … } })` (voir les blocs existants).
2. L'ajouter à la liste `blocs` de `data/catalogue.js`, avec tous les domaines où il sert.

## Voir le site en local

Double-cliquer sur `index.html` suffit. Pour un rendu identique au site en ligne :

```
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000.

## Publication

GitHub Pages, branche `main`, dossier racine. Le fichier `.nojekyll` évite tout traitement par Jekyll.
