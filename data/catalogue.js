/* Catalogue du site : c'est le seul fichier à modifier pour ajouter une animation à l'accueil.
   Champs d'une animation :
   - id       : identifiant court, sans espace (sert aussi de nom de dossier)
   - titre    : nom affiché
   - domaine  : un des id de « domaines » ci-dessous
   - niveaux  : parmi "collège", "lycée", "supérieur"
   - themes   : mots-clés pour la recherche
   - resume   : une ou deux phrases
   - chemin   : dossier de l'animation, relatif à la racine du site, terminé par /
   - signe    : un détail typique affiché sur la carte (une valeur, une unité…)
   - ajout    : date d'ajout (AAAA-MM-JJ)
*/
window.CATALOGUE={
  site:{nom:'Sciences animées', devise:'Des animations pour voir comment le monde fonctionne, du pointeur laser jusqu’aux atomes.'},
  domaines:[
    {id:'physique', nom:'Physique', couleur:'#FF3D33', resume:'Lumière, électricité, mouvement, ondes, énergie, atomes.'},
    {id:'chimie', nom:'Chimie', couleur:'#3FD4A8', resume:'Molécules, réactions, liaisons, solutions, états de la matière.'},
    {id:'biologie', nom:'Biologie', couleur:'#9BE564', resume:'Cellules, corps humain, génétique, écosystèmes.'},
    {id:'terre-univers', nom:'Terre et Univers', couleur:'#5AA9FF', resume:'Planètes, étoiles, climat, roches, volcans, saisons.'},
    {id:'maths', nom:'Mathématiques', couleur:'#E3B341', resume:'Géométrie, fonctions, probabilités, nombres.'}
  ],
  animations:[
    {id:'diode-laser', titre:'Dans la diode laser', domaine:'physique', niveaux:['collège','lycée','supérieur'],
     themes:['lumière','laser','LED','électricité','semi-conducteur','atome','électron','émission stimulée','onde','orbitale','liaison','couleur'],
     resume:'Du pointeur aux atomes : couches p et n, émission stimulée, onde de l’électron (Davisson et Germer), orbitales, liaison Ga–P, couleur des LED et LED blanche.',
     chemin:'animations/physique/diode-laser/', signe:'650 nm', ajout:'2026-11-11',
     blocs:['orbitales-liantes','corde-orbitale']},
    {id:'led-et-laser', titre:'LED et laser', domaine:'physique', niveaux:['collège','lycée'],
     themes:['lumière','LED','laser','diode','pointeur','émission stimulée','photon','jonction p-n'],
     resume:'Même jonction, deux destins pour la lumière : la LED l\u2019émet au hasard, le laser la recopie entre deux miroirs. Le pointeur en coupe, la puce en mille-feuille, et l\u2019émission stimulée en animation.',
     chemin:'animations/physique/led-et-laser/', signe:'LED · laser', ajout:'2026-11-11'},
    {id:'lumiere-tour-de-la-terre', titre:'Combien de fois la lumière fait-elle le tour de la Terre en 1 seconde ?', domaine:'physique', niveaux:['collège'],
     themes:['lumière','vitesse de la lumière','propagation','Terre','distance'],
     resume:'Un rayon lumineux lancé à ras de la Terre, en temps réel ou au ralenti : 300 000 km en une seconde, soit 7,5 tours.',
     chemin:'animations/physique/lumiere-tour-de-la-terre/', signe:'7,5 tours', ajout:'2026-11-11'},
    {id:'lumiere-soleil-lune-terre', titre:'Combien de temps met la lumière pour arriver sur Terre ?', domaine:'physique', niveaux:['collège'],
     themes:['lumière','vitesse de la lumière','propagation','Lune','Soleil','système solaire','distance'],
     resume:'De la Lune (1,3 s) et du Soleil (8 min 20 s) jusqu\u2019à la Terre, en temps réel ou accéléré, avec la Terre et la Lune à l\u2019échelle.',
     chemin:'animations/physique/lumiere-soleil-lune-terre/', signe:'8 min 20 s', ajout:'2026-11-11'},
    {id:'toucher-atomes', titre:'Que se passe-t-il quand on touche un objet ?', domaine:'physique', niveaux:['collège','lycée','supérieur'],
     themes:['atome','noyau','nuage électronique','électron','contact','force','toucher','principe de Pauli','van der Waals','répulsion','surface','matière'],
     resume:'Ton doigt sur une table, vu au niveau des atomes : un noyau 60 000 fois plus petit que son nuage, deux nuages qui se repoussent parce que les places sont déjà prises, et une peau qui ne touche l\u2019objet que par quelques bosses.',
     chemin:'animations/physique/toucher-atomes/', signe:'0,38 nm', ajout:'2026-11-12',
     blocs:['orbitales-liantes']}
  ],
  /* Blocs : modèles réutilisables, insérables dans n'importe quelle page avec <div data-bloc="id"></div>.
     - domaines : tous les domaines où le bloc sert (il apparaît dans chacun)
     - script   : fichier du bloc, relatif à la racine du site */
  blocs:[
    {id:'creux-atome', titre:'Le creux de l\u2019atome', domaines:['physique','chimie'], niveaux:['lycée','supérieur'],
     themes:['atome','électron','énergie','ionisation','Bohr','onde'], resume:'Pourquoi l\u2019électron ne tombe pas sur le noyau et n\u2019est pas arraché : attraction contre agitation de l\u2019onde.',
     script:'assets/js/blocs/creux-atome.js'},
    {id:'corde-vibrante', titre:'La corde vibrante', domaines:['physique','chimie'], niveaux:['collège','lycée','supérieur'],
     themes:['onde','son','musique','harmonique','résonance','onde stationnaire','couches électroniques'], resume:'Une corde attachée ne vibre que sur certaines notes : nœuds, ventres, harmoniques, résonance. Même idée que les couches de l\u2019atome.',
     script:'assets/js/blocs/corde-vibrante.js'},
    {id:'orbitales-liantes', titre:'Orbitale liante, orbitale antiliante', domaines:['chimie','physique'], niveaux:['lycée','supérieur'],
     themes:['liaison','molécule','orbitale','onde','énergie','semi-conducteur'], resume:'On additionne les ondes de deux atomes : en phase, le nuage se concentre entre les noyaux et lie ; en opposition, il s\u2019en écarte et repousse.',
     script:'assets/js/blocs/orbitales-liantes.js'},
    {id:'corde-orbitale', titre:'De la corde à l\u2019orbitale', domaines:['physique','chimie'], niveaux:['lycée','supérieur'],
     themes:['orbitale','onde stationnaire','nœud','corde','membrane','tambour','atome','couches'], resume:'Ce qu\u2019est une orbitale : la même onde stationnaire sur une corde (1D), une membrane (2D), puis autour du noyau (3D), avec 0 ou 1 nœud.',
     script:'assets/js/blocs/corde-orbitale.js'}
  ]
};
