# Conventions de conception

Ces règles viennent des retours faits pendant la création de la première animation (*Dans la diode laser*).

## Pédagogie

- **Expliquer le pourquoi, pas seulement le comment.** Ne pas se contenter d'énoncer une règle (« 2 électrons par case ») : montrer d'où elle vient, ou dire honnêtement qu'elle est fondamentale.
- **Une idée par animation ou par étape.** Les étapes avancent avec un bouton « Suivant », pas toutes en même temps.
- **Partir de l'objet réel**, puis zoomer : du pointeur au boîtier, à la puce, aux couches, aux atomes.
- **Méfiance envers les analogies.** Elles sont souvent fausses en physique. Préférer montrer le modèle réel (additionner deux ondes plutôt que « deux personnes qui se tiennent la main »). Si une analogie est utilisée, dire où elle s'arrête.
- **Toujours dire ce qui est simplifié** : échelle, vitesse ralentie, formes approchées, cas particulier. Un bouton « i » « Ce qui est simplifié » par animation au minimum.
- **Donner les vrais chiffres** avec leurs unités (0,24 nm, 1,9 eV, 650 nm, 4 400 km/s) et la même valeur partout.
- **Citer les sources** sous chaque animation qui s'appuie sur des modèles de recherche.
- **Être honnête sur l'histoire** : distinguer ce que l'expérience d'origine a fait de ce que l'animation montre (exemple : Davisson et Germer envoyaient un flux continu ; les électrons « un par un », c'est Tonomura en 1989).

## Dessin

- **Orientation cohérente d'une vue à l'autre** : si le faisceau part vers la droite dans le pointeur, il part vers la droite dans le boîtier, la puce et les couches. Même empilement partout (couche p en haut).
- **Mêmes couleurs pour les mêmes objets sur tout le site** :
  électron libre = rouge lumineux ; électron d'une liaison = rose pâle ; trou = anneau ambre ;
  onde positive = rouge clair `#FF8A80`, onde négative = bleu `#6FB6FF` ; noyau = petit point blanc ;
  couche p = violet, couche n = vert, zone active = rouge.
- **Relief** : sphères éclairées (`Labo.sph`), halos (`Labo.glow`), vignettage. Pas de dessin plat quand l'objet est en volume.
- **Étiquettes lisibles** sur fond sombre (`Labo.tag`), jamais par-dessus un objet important ; lignes de rappel en pointillés (`Labo.lead`).
- **Échelle indiquée** quand elle compte (« ≈ 0,3 mm », « ≈ 0,25 nm entre deux atomes »).

## Ergonomie

- **Colonne « Comprendre » à gauche** de chaque animation : une liste de boutons « i », l'explication s'ouvre juste sous le bouton cliqué. Sur téléphone, la colonne passe sous l'animation (géré automatiquement par `Labo.mountSides`).
- **Réglages sous l'image**, regroupés dans un bandeau (`.lc`) ; une légende (`.caption`) qui se met à jour.
- **Marche au doigt** : glisser pour tourner une vue 3D, curseurs larges, pas de survol obligatoire.
- **Respecter « réduire les animations »** (`Labo.reduce`).
- **Largeur téléphone** (390 px) : rien ne déborde horizontalement.

## Écriture

- Français simple, phrases courtes, tutoiement dans les consignes.
- Pas de remplissage, pas de « il est important de noter ».
- Les termes techniques sont définis au premier usage, ou dans un bouton « i ».

## Liste de relecture avant publication

- [ ] L'animation tourne sans erreur dans la console, en local et une fois publiée.
- [ ] Elle s'affiche correctement sur téléphone.
- [ ] Chaque étape a une légende qui dit quoi regarder.
- [ ] Les boutons « i » couvrent : chaque notion nouvelle, ce qui est simplifié, les sources.
- [ ] Orientation et couleurs conformes aux conventions.
- [ ] Entrée ajoutée dans `data/catalogue.js` et `node tools/verifier.mjs` passe.
