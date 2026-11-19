/* Vignettes des cartes de l'accueil : une petite illustration par animation, qui montre ce qu'on va y voir.
   Une entrée par identifiant d'animation du catalogue. SVG 300 × 120, fond sombre transparent (le dégradé de la carte reste visible),
   sujet placé plutôt au centre et à droite : le texte « signe » de la carte est en bas à gauche.
   Couleurs : mêmes conventions que le reste du site (voir docs/CONVENTIONS.md, « Dessin »). */
window.VIGNETTES={
/* LED/laser : jonction p-n, électrons et trous qui se rencontrent, faisceau rouge qui sort vers la droite */
'diode-laser':`<svg viewBox="0 0 300 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs><linearGradient id="vl1" x1="0" x2="1"><stop offset="0" stop-color="#FF3D33" stop-opacity=".95"/><stop offset="1" stop-color="#FF3D33" stop-opacity="0"/></linearGradient>
<radialGradient id="vl2"><stop offset="0" stop-color="#FF8A80"/><stop offset="1" stop-color="#FF3D33" stop-opacity="0"/></radialGradient></defs>
<rect x="60" y="34" width="62" height="44" rx="4" fill="#7E6BFF" fill-opacity=".55" stroke="#9D8FFF"/>
<rect x="122" y="34" width="12" height="44" fill="#FF3D33" fill-opacity=".6"/>
<rect x="134" y="34" width="62" height="44" rx="4" fill="#2FBF94" fill-opacity=".5" stroke="#4DDDB1"/>
<circle cx="128" cy="56" r="20" fill="url(#vl2)"/>
<g fill="#FF8A80"><circle cx="164" cy="46" r="3.4"/><circle cx="178" cy="62" r="3.4"/><circle cx="150" cy="68" r="3.4"/></g>
<g fill="none" stroke="#FFC857" stroke-width="2"><circle cx="90" cy="48" r="3.4"/><circle cx="102" cy="64" r="3.4"/><circle cx="80" cy="68" r="3.4"/></g>
<path d="M196 56 H300" stroke="url(#vl1)" stroke-width="7" stroke-linecap="round"/>
<path d="M204 56 q6 -12 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0" fill="none" stroke="#FFD0CC" stroke-width="1.6"/></svg>`,

/* Atome et liaisons : deux nuages d'électrons qui se recouvrent, avec leurs noyaux */
'atome-et-liaisons':`<svg viewBox="0 0 300 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs><radialGradient id="va1"><stop offset="0" stop-color="#7E6BFF" stop-opacity=".95"/><stop offset=".55" stop-color="#7E6BFF" stop-opacity=".35"/><stop offset="1" stop-color="#7E6BFF" stop-opacity="0"/></radialGradient>
<radialGradient id="va2"><stop offset="0" stop-color="#2FBF94" stop-opacity=".95"/><stop offset=".55" stop-color="#2FBF94" stop-opacity=".35"/><stop offset="1" stop-color="#2FBF94" stop-opacity="0"/></radialGradient></defs>
<circle cx="125" cy="58" r="46" fill="url(#va1)"/><circle cx="185" cy="58" r="46" fill="url(#va2)" style="mix-blend-mode:screen"/>
<ellipse cx="155" cy="58" rx="22" ry="34" fill="#FFF" fill-opacity=".10"/>
<circle cx="125" cy="58" r="3.6" fill="#fff"/><circle cx="185" cy="58" r="3.6" fill="#fff"/>
<path d="M130 58 H180" stroke="#fff" stroke-opacity=".5" stroke-dasharray="3 4"/></svg>`,

/* Vitesse de la lumière : Terre, Lune, impulsion de lumière qui voyage */
'vitesse-lumiere':`<svg viewBox="0 0 300 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs><radialGradient id="vv1" cx=".35" cy=".3"><stop offset="0" stop-color="#8FD0FF"/><stop offset=".6" stop-color="#2E78C8"/><stop offset="1" stop-color="#0F2F5C"/></radialGradient>
<radialGradient id="vv2" cx=".35" cy=".3"><stop offset="0" stop-color="#F3F3EE"/><stop offset="1" stop-color="#7A7C80"/></radialGradient>
<linearGradient id="vv3" x1="0" x2="1"><stop offset="0" stop-color="#FF3D33" stop-opacity="0"/><stop offset="1" stop-color="#FF3D33"/></linearGradient></defs>
<circle cx="86" cy="62" r="26" fill="url(#vv1)"/><circle cx="262" cy="62" r="9" fill="url(#vv2)"/>
<path d="M114 62 H252" stroke="#fff" stroke-opacity=".3" stroke-dasharray="2 5"/>
<rect x="150" y="59" width="44" height="6" rx="3" fill="url(#vv3)"/><circle cx="196" cy="62" r="4.2" fill="#FF8A80"/>
<path d="M200 36 q0 -10 10 -10" fill="none" stroke="#fff" stroke-opacity=".0"/></svg>`,

/* Ciel et diffusion : le Soleil, un rayon blanc qui traverse l'air, du bleu dans le ciel et du rouge à l'horizon */
'ciel-et-diffusion':`<svg viewBox="0 0 300 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs><linearGradient id="vc1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1B4B9A"/><stop offset=".6" stop-color="#5AA9FF"/><stop offset="1" stop-color="#FFB16B"/></linearGradient>
<radialGradient id="vc2"><stop offset="0" stop-color="#FFF3C4"/><stop offset=".4" stop-color="#FFD166" stop-opacity=".7"/><stop offset="1" stop-color="#FFD166" stop-opacity="0"/></radialGradient></defs>
<rect x="0" y="0" width="300" height="120" fill="url(#vc1)" fill-opacity=".55"/>
<circle cx="70" cy="96" r="38" fill="url(#vc2)"/><circle cx="70" cy="96" r="12" fill="#FFF3C4"/>
<path d="M82 92 L190 40" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
<path d="M82 92 L150 62 L170 100" stroke="#8FC4FF" stroke-width="1.6" fill="none"/><path d="M110 78 L136 36" stroke="#8FC4FF" stroke-width="1.6"/>
<g fill="#fff"><circle cx="110" cy="78" r="2.6"/><circle cx="150" cy="62" r="2.6"/><circle cx="170" cy="52" r="2.6"/></g>
<path d="M0 108 Q80 100 150 108 T300 106 V120 H0 Z" fill="#0B1118" fill-opacity=".9"/>
<g fill="#8FC4FF"><circle cx="230" cy="30" r="1.6"/><circle cx="262" cy="52" r="1.6"/><circle cx="246" cy="74" r="1.6"/></g></svg>`,

/* L'œil et les cônes : œil, cristallin, mosaïque de cônes rouges, verts, bleus (les bleus sont rares) */
'oeil-cones':`<svg viewBox="0 0 300 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs><radialGradient id="vo1" cx=".5" cy=".5"><stop offset="0" stop-color="#1A2330"/><stop offset="1" stop-color="#0B1118"/></radialGradient></defs>
<path d="M30 60 Q150 -22 270 60 Q150 142 30 60 Z" fill="url(#vo1)" stroke="#9DB4CC" stroke-width="1.6" stroke-opacity=".7"/>
<circle cx="150" cy="60" r="27" fill="#2E4A6B" fill-opacity=".9" stroke="#8FB8FF" stroke-opacity=".7"/><circle cx="150" cy="60" r="12" fill="#06090D"/>
<circle cx="144" cy="54" r="4" fill="#fff" fill-opacity=".7"/>
<g>
<circle cx="205" cy="38" r="4.4" fill="#FF6B6B"/><circle cx="218" cy="46" r="4.4" fill="#4DDD8C"/><circle cx="231" cy="38" r="4.4" fill="#FF6B6B"/>
<circle cx="212" cy="58" r="4.4" fill="#4DDD8C"/><circle cx="225" cy="66" r="4.4" fill="#FF6B6B"/><circle cx="238" cy="58" r="4.4" fill="#4DDD8C"/>
<circle cx="205" cy="78" r="4.4" fill="#4DDD8C"/><circle cx="218" cy="86" r="4.4" fill="#5C7CFF"/><circle cx="231" cy="78" r="4.4" fill="#FF6B6B"/>
</g></svg>`,

/* Toucher des atomes : deux nuages qui se repoussent juste avant de se toucher */
'toucher-atomes':`<svg viewBox="0 0 300 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs><radialGradient id="vt1"><stop offset="0" stop-color="#FF8A80" stop-opacity=".9"/><stop offset=".6" stop-color="#FF3D33" stop-opacity=".35"/><stop offset="1" stop-color="#FF3D33" stop-opacity="0"/></radialGradient></defs>
<circle cx="116" cy="60" r="40" fill="url(#vt1)"/><circle cx="184" cy="60" r="40" fill="url(#vt1)"/>
<circle cx="116" cy="60" r="3.4" fill="#fff"/><circle cx="184" cy="60" r="3.4" fill="#fff"/>
<g stroke="#FFC857" stroke-width="2.2" stroke-linecap="round" fill="none"><path d="M140 60 H126"/><path d="M126 54 l-6 6 l6 6"/><path d="M160 60 H174"/><path d="M174 54 l6 6 l-6 6"/></g>
<path d="M116 108 H184" stroke="#fff" stroke-opacity=".5"/><path d="M116 103 v10 M184 103 v10" stroke="#fff" stroke-opacity=".5"/></svg>`,

/* Alliage : réseau d'atomes de deux tailles, un atome étranger qui déforme le réseau */
'alliage':`<svg viewBox="0 0 300 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs><radialGradient id="vg1" cx=".35" cy=".3"><stop offset="0" stop-color="#E8EEF4"/><stop offset="1" stop-color="#6D7F94"/></radialGradient>
<radialGradient id="vg2" cx=".35" cy=".3"><stop offset="0" stop-color="#FFD9A0"/><stop offset="1" stop-color="#D2822E"/></radialGradient></defs>
<g fill="url(#vg1)">
<circle cx="110" cy="26" r="11"/><circle cx="140" cy="26" r="11"/><circle cx="170" cy="26" r="11"/><circle cx="200" cy="26" r="11"/>
<circle cx="110" cy="58" r="11"/><circle cx="140" cy="58" r="11"/><circle cx="200" cy="58" r="11"/><circle cx="230" cy="58" r="11"/>
<circle cx="125" cy="92" r="11"/><circle cx="155" cy="92" r="11"/><circle cx="185" cy="92" r="11"/><circle cx="215" cy="92" r="11"/>
<circle cx="230" cy="26" r="11"/><circle cx="95" cy="92" r="11"/></g>
<circle cx="172" cy="58" r="15" fill="url(#vg2)" stroke="#FFD9A0" stroke-opacity=".6"/>
<g fill="none" stroke="#FFC857" stroke-opacity=".6" stroke-width="1.4"><path d="M156 42 l-6 -8"/><path d="M190 76 l6 8"/></g></svg>`,
/* nombres quantiques : une orbitale p (lobes rouge et bleu) et la plaque de Stern et Gerlach avec ses deux taches */
'nombres-quantiques':`<svg viewBox="0 0 300 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs><radialGradient id="nq1"><stop offset="0" stop-color="#FF8A80"/><stop offset="1" stop-color="#FF3D33" stop-opacity=".15"/></radialGradient>
<radialGradient id="nq2"><stop offset="0" stop-color="#6FB6FF"/><stop offset="1" stop-color="#5AA9FF" stop-opacity=".15"/></radialGradient></defs>
<ellipse cx="140" cy="36" rx="17" ry="25" fill="url(#nq1)" stroke="#FF8A80"/>
<ellipse cx="140" cy="84" rx="17" ry="25" fill="url(#nq2)" stroke="#6FB6FF"/>
<circle cx="140" cy="60" r="3" fill="#fff"/>
<path d="M172 60 H236" stroke="#9AA6B2" stroke-width="1.4" stroke-dasharray="3 3"/>
<path d="M200 60 L236 30 M200 60 L236 90" stroke="#E3B341" stroke-opacity=".6" stroke-width="1.2" fill="none"/>
<rect x="240" y="14" width="7" height="92" rx="2" fill="#6E7883"/>
<circle cx="244" cy="30" r="5" fill="#E8EEF4"/><circle cx="244" cy="90" r="5" fill="#E8EEF4"/>
<g fill="#E8EEF4" fill-opacity=".7"><circle cx="262" cy="28" r="1.6"/><circle cx="268" cy="32" r="1.6"/><circle cx="264" cy="88" r="1.6"/><circle cx="270" cy="92" r="1.6"/></g></svg>`
};
