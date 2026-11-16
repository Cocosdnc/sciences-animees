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
     themes:['lumière','laser','LED','électricité','semi-conducteur','atome','électron','émission stimulée','onde','couleur'],
     resume:'Du pointeur aux atomes : couches p et n, émission stimulée, couleur des LED et LED blanche. L’atome et la liaison ont leur propre page.',
     chemin:'animations/physique/diode-laser/', signe:'650 nm', ajout:'2026-11-11'},
    {id:'atome-et-liaisons', titre:'Atome et liaisons', domaine:'physique', niveaux:['lycée','supérieur'],
     themes:['atome','électron','onde','Davisson et Germer','de Broglie','orbitale','couches','principe de Pauli','liaison','liante','antiliante','noyau','nuage électronique'],
     resume:'Pourquoi l’électron tient autour du noyau et pourquoi il y a des couches, puis pourquoi deux atomes se lient : orbitales liantes et antiliantes, liaison Ga–P en 3D. Né de la diode laser.',
     chemin:'animations/physique/atome-et-liaisons/', signe:'0,053 nm', ajout:'2026-11-16',
     blocs:['nuage-probabilite','liante-antiliante','energie-liaison','corde-orbitale']},
    {id:'vitesse-lumiere', titre:'Combien de temps met la lumière ?', domaine:'physique', niveaux:['collège'],
     themes:['lumière','vitesse de la lumière','propagation','Terre','Lune','Soleil','système solaire','distance'],
     resume:'Un rayon lumineux qui fait le tour de la Terre (7,5 tours en 1 s), qui va de la Lune à la Terre (1,3 s) et du Soleil à la Terre (8 min 20 s), en temps réel ou accéléré.',
     chemin:'animations/physique/vitesse-lumiere/', signe:'8 min 20 s', ajout:'2026-11-11'},
    {id:'ciel-et-diffusion', titre:'Ciel et diffusion : pourquoi le ciel est bleu', domaine:'physique', niveaux:['lycée','supérieur'],
     themes:['lumière','diffusion','Rayleigh','Mie','longueur d\u2019onde','ciel','coucher de soleil','nuage','atmosphère','spectre','couleur','ozone','1/λ⁴'],
     resume:'Pourquoi le ciel est bleu le jour (et pas violet), rouge au coucher du Soleil, et pourquoi les nuages sont blancs : la molécule d\u2019air secouée par la lumière, la loi en 1/λ⁴, le vrai spectre du Soleil, l\u2019ozone, l\u2019œil, puis la diffusion de Mie par les gouttes.',
     chemin:'animations/physique/ciel-et-diffusion/', signe:'1/λ⁴', ajout:'2026-11-16',
     blocs:['lumiere-blanche','lampes-rvb','molecule-secouee','diffusion-lambda','ciel-de-jour','densite-atmosphere','coucher-de-soleil','onde-particule','diffusion-mie','arc-en-ciel']},
    {id:'oeil-cones', titre:'L’œil et les cônes : pourquoi le bleu est moins net', domaine:'biologie', niveaux:['collège','lycée'],
     themes:['vision','œil','cônes','rétine','couleur','sensibilité','fovéa','bleu','luminosité','acuité'],
     resume:'Trois sortes de cônes, dont les cônes bleus sont rares (5 à 10 %) et absents du centre de la fovéa : un test de boules et de rayures montre qu\u2019on voit le bleu moins nettement que le vert, même à luminosité égale.',
     chemin:'animations/biologie/oeil-cones/', signe:'5-10 %', ajout:'2026-11-17',
     blocs:['cones-sensibilite','test-cones']},
    {id:'toucher-atomes', titre:'Que se passe-t-il quand on touche un objet ?', domaine:'physique', niveaux:['collège','lycée','supérieur'],
     themes:['atome','noyau','nuage électronique','électron','contact','force','toucher','principe de Pauli','van der Waals','répulsion','surface','matière'],
     resume:'Ton doigt sur une table, vu au niveau des atomes : un noyau 60 000 fois plus petit que son nuage, deux nuages qui se repoussent parce que les places sont déjà prises, et une peau qui ne touche l\u2019objet que par quelques bosses.',
     chemin:'animations/physique/toucher-atomes/', signe:'0,38 nm', ajout:'2026-11-12',
     blocs:['liante-antiliante','energie-liaison']},
    {id:'alliage', titre:'Coller deux métaux, est-ce faire un alliage ?', domaine:'chimie', niveaux:['collège','lycée','supérieur'],
     themes:['alliage','métal','cuivre','nickel','diffusion','lacune','température','fusion','soudure à froid','oxyde','cristal','mélange'],
     resume:'Presser du cuivre contre du nickel ne les mélange pas : oxyde à l\u2019air, soudure à froid dans le vide, atomes qui sautent de trou en trou quand on chauffe, et fusion pour faire un vrai alliage.',
     chemin:'animations/chimie/alliage/', signe:'256 kJ/mol', ajout:'2026-11-12'}
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
    {id:'nuage-probabilite', titre:'Où trouve-t-on l\u2019électron ?', domaines:['chimie','physique'], niveaux:['lycée','supérieur'],
     themes:['orbitale','nuage électronique','probabilité','zéro','nœud','1s','2s','2p','atome'], resume:'Des points, chacun un endroit où l\u2019électron a été trouvé, dessinent le nuage de l\u2019atome d\u2019hydrogène (1s, 2s, 2p), avec ses zéros.',
     script:'assets/js/blocs/nuage-probabilite.js'},
    {id:'liante-antiliante', titre:'Liante et antiliante : où est l\u2019électron entre deux atomes ?', domaines:['chimie','physique'], niveaux:['lycée','supérieur'],
     themes:['liaison','molécule','orbitale','liante','antiliante','probabilité','interférence','phase'], resume:'Deux atomes qui se rapprochent : somme des probabilités, ondes en phase (le nuage se concentre entre les noyaux) ou en opposition (un plan à zéro au milieu).',
     script:'assets/js/blocs/liante-antiliante.js'},
    {id:'energie-liaison', titre:'Pourquoi l\u2019énergie baisse, et où elle part', domaines:['chimie','physique'], niveaux:['lycée','supérieur'],
     themes:['liaison','énergie','liante','antiliante','H2+','énergie cinétique','photon','troisième corps'], resume:'Courbes d\u2019énergie de H₂⁺ : l\u2019électron étalé est moins agité, l\u2019énergie baisse ; les noyaux la gagnent, et il faut un choc ou un photon pour l\u2019évacuer.',
     script:'assets/js/blocs/energie-liaison.js'},
    {id:'corde-orbitale', titre:'De la corde à l\u2019orbitale', domaines:['physique','chimie'], niveaux:['lycée','supérieur'],
     themes:['orbitale','onde stationnaire','nœud','corde','membrane','tambour','atome','couches'], resume:'Ce qu\u2019est une orbitale : la même onde stationnaire sur une corde (1D), une membrane (2D), puis autour du noyau (3D), avec 0 ou 1 nœud.',
     script:'assets/js/blocs/corde-orbitale.js'},
    {id:'pendules-couples', titre:'Deux pendules couplés, un électron partagé', domaines:['physique','chimie'], niveaux:['collège','lycée','supérieur'],
     themes:['pendule','oscillateur','couplage','battements','phase','orbitale','liaison','onde','électron'], resume:'Deux pendules reliés par un ressort balancent ensemble ou à contretemps : les mêmes équations qu\u2019un électron partagé entre deux atomes, en orbitale liante ou antiliante.',
     script:'assets/js/blocs/pendules-couples.js'},
    {id:'lumiere-blanche', titre:'La lumière blanche contient toutes les couleurs', domaines:['physique'], niveaux:['collège', 'lycée'],
     themes:['lumière', 'couleur', 'longueur d\\u2019onde', 'spectre', 'onde', 'blanc'], resume:'Des ondes de couleurs différentes, additionnées, donnent la lumière blanche ; chaque couleur est une longueur d\u2019onde.',
     script:'assets/js/blocs/lumiere-blanche.js'},
    {id:'lampes-rvb', titre:'Trois lampes qui donnent du blanc', domaines:['physique'], niveaux:['collège', 'lycée'],
     themes:['synthèse additive', 'couleur', 'rouge vert bleu', 'blanc', 'lumière', 'cônes'], resume:'Trois lampes, rouge, verte et bleue, éclairent un mur : leurs lumières s\u2019ajoutent. Jaune, cyan, magenta, et blanc au centre. Le spectre montre qu\u2019aucune longueur d\u2019onde jaune n\u2019est présente.',
     script:'assets/js/blocs/lampes-rvb.js'},
    {id:'molecule-secouee', titre:'Une molécule d\u2019air secouée par la lumière', domaines:['physique', 'chimie'], niveaux:['lycée', 'supérieur'],
     themes:['diffusion', 'Rayleigh', 'molécule', 'dipôle', 'polarisabilité', 'diazote', 'ciel'], resume:'N₂ dans une onde lumineuse : le nuage d\u2019électrons et les noyaux oscillent en sens opposés, la molécule réémet de la lumière selon son orientation. Trois niveaux : molécule secouée, oscillateur animé (ω⁴), mesures réelles.',
     script:'assets/js/blocs/molecule-secouee.js'},
    {id:'diffusion-lambda', titre:'Et pour une autre molécule ?', domaines:['physique', 'chimie'], niveaux:['lycée', 'supérieur'],
     themes:['diffusion', 'Rayleigh', 'polarisabilité', 'molécule', '1/λ⁴'], resume:'Entrée (spectre du Soleil réel ou blanc), molécule (multiplie par σ ∝ α²/λ⁴), sortie (spectre diffusé et couleur de leur superposition). 16 molécules au choix.',
     script:'assets/js/blocs/diffusion-lambda.js'},
    {id:'ciel-de-jour', titre:'Pourquoi le ciel est bleu, et pas violet', domaines:['physique'], niveaux:['lycée', 'supérieur'],
     themes:['ciel', 'diffusion', 'spectre du Soleil', 'ozone', 'œil', 'couleur'], resume:'Suivre un rayon : spectre du Soleil (ASTM G173, UV compris), couche d\u2019ozone, diffusion par l\u2019air, sensibilité de l\u2019œil ; la couleur obtenue est comparée à celle d\u2019un ciel clair.',
     script:'assets/js/blocs/ciel-de-jour.js'},
    {id:'densite-atmosphere', titre:'Combien d\u2019air un rayon traverse-t-il ?', domaines:['physique'], niveaux:['lycée', 'supérieur'],
     themes:['atmosphère', 'gaz parfait', 'densité', 'exponentielle', 'masse d\u2019air', 'intégrale', 'coucher de soleil'], resume:'La densit\u00e9 de l\u2019air d\u00e9cro\u00eet en exponentielle (H\u2248 8,4 km). L\u2019aire sous la courbe, \u00e0 la verticale puis le long d\u2019un rayon oblique, donne la masse d\u2019air : 1 au z\u00e9nith, 5,5 \u00e0 10\u00b0, 34,5 \u00e0 l\u2019horizon.',
     script:'assets/js/blocs/densite-atmosphere.js'},
    {id:'coucher-de-soleil', titre:'Le coucher de soleil', domaines:['physique'], niveaux:['lycée', 'supérieur'],
     themes:['coucher de soleil', 'masse d\\u2019air', 'exponentielle', 'ozone', 'diffusion', 'ciel'], resume:'Le Soleil descend : la lumière traverse jusqu\u2019à 38 fois plus d\u2019air et perd son bleu. Spectre calculé avec la vraie épaisseur optique de l\u2019atmosphère.',
     script:'assets/js/blocs/coucher-de-soleil.js'},
    {id:'diffusion-mie', titre:'Gouttes, poussières, nuages : quand la particule grossit', domaines:['physique'], niveaux:['lycée', 'supérieur'],
     themes:['Mie', 'diffusion', 'nuage', 'goutte', 'aérosol', 'taille', 'brouillard'], resume:'Calcul de Mie en direct, du rayon 0,1 nm à 1 mm : Rayleigh, régime intermédiaire, nuages blancs, avec diagramme angulaire.',
     script:'assets/js/blocs/diffusion-mie.js'},
    {id:'onde-particule', titre:'L’onde et la particule : le champ se construit sous tes yeux', domaines:['physique'], niveaux:['lycée', 'supérieur'],
     themes:['champ électrique', 'champ magnétique', 'Mie', 'diffusion', 'particule', 'goutte', 'dipôle', 'onde'], resume:'Une onde de 550 nm arrive sur une particule dont on fait varier la taille, de la molécule d’air à la goutte de nuage : carte exacte du champ E ou B (diffusé ou total), diagramme de la lumière diffusée et couleur obtenue.',
     script:'assets/js/blocs/onde-particule.js'},
    {id:'arc-en-ciel', titre:'L’arc-en-ciel : une goutte de pluie, une goutte de nuage', domaines:['physique'], niveaux:['lycée', 'supérieur'],
     themes:['arc-en-ciel', 'réfraction', 'Descartes', 'dispersion', 'goutte', 'nuage', 'diffraction', 'arc de brouillard'], resume:'Le trajet d’un rayon dans une goutte de pluie (deux réfractions, une réflexion), l’angle de sortie qui passe par un maximum, les arcs obtenus avec des gouttes de pluie (arc net et coloré) et de nuage (arc blanc et flou, calcul de Mie).',
     script:'assets/js/blocs/arc-en-ciel.js'},
    {id:'cones-sensibilite', titre:'Les trois sortes de cônes', domaines:['biologie','physique'], niveaux:['collège','lycée'],
     themes:['vision','cônes','rétine','sensibilité','couleur','fovéa','longueur d\u2019onde'], resume:'Courbes de sensibilité des cônes L, M et S, et rétine cône par cône : les cônes bleus sont rares et absents du centre de la fovéa.',
     script:'assets/js/blocs/cones-sensibilite.js'},
    {id:'test-cones', titre:'Test : voit-on aussi bien le bleu que le vert ?', domaines:['biologie','physique'], niveaux:['collège','lycée'],
     themes:['vision','cônes','couleur','luminosité','acuité','bleu'], resume:'Boules et rayures de couleurs sur fond noir, avec réglage « même luminosité » : le bleu reste plus difficile à voir dans les détails fins.',
     script:'assets/js/blocs/test-cones.js'}
  ]
};
