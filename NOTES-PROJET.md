# Duat — notes de reprise du projet

Ce document résume tout ce qu'il faut savoir pour reprendre le développement de l'app Duat dans une nouvelle conversation.
Dernière mise à jour : 28/11/2026.

## Liens

- **App sur GitHub Pages :** https://stfrantic82.github.io/Duat/ (dépôt `StFrantic82/Duat`, branche `main`, racine)
- **Artifact claude.ai :** https://claude.ai/artifact/43yjU9BUXGpgjMhJm5STJe
  - slug `18b5ddb1-2365-470c-a016-5f1447603d8f`
  - dernière version publiée : `1795657339-8d69` (à vérifier avec `get_artifact` avant de republier)

## Règle permanente de l'auteur

**Les 2 versions (artifact claude.ai ET GitHub) doivent toujours être mises à jour en même temps**, avec les mêmes fichiers. Les deux liens sont donnés à chaque mise à jour.

Méthode suivie :
1. Modifier, puis tester en local (`python3 -m http.server 8765` + Playwright).
2. Publier les fichiers modifiés sur l'artifact (`publish_files`, `mode: patch`, `base_version` = version en ligne).
3. Copier les mêmes fichiers dans le clone du dépôt, faire un commit (auteur `StFrantic82 <StFrantic82@users.noreply.github.com>`) et un push sur `main`.
4. Vérifier que les fichiers sont identiques des deux côtés.
5. Augmenter le paramètre anti-cache `?v=N` dans `index.html` à chaque version (actuellement **v=46**).

## Structure de l'app (site statique)

| Fichier | Rôle |
|---|---|
| `index.html` | page d'accueil égyptienne : stèle, Gardiens sur les côtés, choix du nombre de joueurs, des personnages et du niveau des IA, crédits |
| `engine.js` | moteur de règles et IA (`window.DUAT`) |
| `ui.js` | interface de jeu, traductions FR/EN/IT (`T.fr/en/it`), règles, catalogue « Le matériel », écran de fin, zoom au survol (`window.DuatUI`) |
| `stats.js` | statistiques, simulations entre IA, onglet d'entraînement de l'IA, tri des tableaux par clic sur l'en-tête |
| `tuto.js` | tutoriel guidé en 3 langues (partie à 2 joueurs, graine fixe 20261125, IA en Facile) |
| `style.css` | styles |
| `assets/` | images : `a1–a60.jpg` (illustrations recadrées), `cards/c1–c60.jpg` (vrais visuels complets, utilisés dans les stats), `c1–c5.jpg` (personnages classiques), `n1–n6.jpg` (personnages recommandés), `g1a/b–g8a/b` (Gardiens), `board23/45.jpg`, icônes `i*.png`, jetons `t*.png`, marqueurs Ba `ba_*.png`, `cranio.png` (logo de l'éditeur) |

Stockage local du navigateur :
- `duat_stats_v2` : statistiques, 5 000 parties au maximum ;
- `duat_ai_w_v2` (+ `_new`) : réglages appris de l'IA, par groupe de personnages ;
- préférences : langue, groupe de personnages, niveau des IA.

## Crédits

Un jeu de **Johannes Goupy & Matthieu Verdier**, édité par **Cranio Creations**. Le logo a été découpé sur la couverture de Minikin City et apparaît sur la page d'accueil.

## Règles telles qu'implémentées

- **Placement d'une carte, 4 directions :**
  - ◀ gauche : côté gauche + scoring ;
  - ▶ droite : côté droit + scoring ;
  - ▲ haut : les deux cartouches, pas de scoring ;
  - ▼ bas : scoring seul, compté sur **tout le jeu**.
- **Coût de la direction :** la direction imposée est gratuite, une direction adjacente coûte 1 scarabée, la direction opposée 2.
- **Scoring par moitié :** une carte posée à gauche compte la moitié gauche (cartouche gauche du personnage, cartes posées à gauche, cartouches gauches des cartes posées en haut). La droite est symétrique.
- **Rivière :**
  - coûts 0,0,1,2 à 2–3 joueurs ; 0,0,1,1,2 à 4 joueurs ; 0,0,1,1,2,2 à 5 joueurs (le 6e emplacement ne sert qu'à 5 joueurs) ;
  - quand une carte est prise, les cartes à sa droite glissent aussitôt vers la gauche ;
  - on ne remplit la rivière qu'en fin de manche, et la carte restante reçoit 1 scarabée.
- **Scarabées :** 1 au départ (personnages classiques), 2 PV chacun en fin de partie, pas de prise gratuite obligatoire.
- **Gardiens :**
  - 2 révélés au départ, puis 1 par manche ;
  - seuls ceux des portes franchies sont revendicables ;
  - 7 PV chacun (on garde 7 : tests faits à 4, 5 et 6 PV, voir l'historique plus bas).
- **Cœurs et Ammit :**
  - un joueur dont l'écart de cœurs atteint 3 ou plus est dévoré et éliminé ;
  - dans les stats, il est compté comme dévoré mais exclu des moyennes de PV.
- **Égalité :** le plus de cœurs (noirs + blancs) l'emporte, sinon victoire partagée.
- **Balance :**
  - les cartes Balance rapportent toujours leurs PV ;
  - chaque ⚖ visible (cartes 4–6, ⚖ des cartes 7–19 et 58–60, jeton Râ Balance) donne +5 PV seulement si l'écart final est 0 ;
  - un ⚖ caché par une carte posée en haut ne compte pas.
- **Dieux :**
  - Anubis : +1 scarabée par icône ;
  - Horus : pour chaque paire, piocher une carte et la jouer dans la direction imposée ;
  - Râ : choisir un jeton parmi 7 (R1, R2, R3, CN, CB, BAL, SC2).
- **Jetons Râ :**
  - ressource, cœur **et Balance** se posent à gauche ou à droite du personnage et ne comptent que pour cette moitié ;
  - seul SC2 (« 1 scarabée + 2 PV ») n'a pas de côté ;
  - le +5 PV de la Balance à écart 0 compte quel que soit le côté.
- **Cartes 54–60 (nouvelles) :**
  - « X PV / set 🌾🏺📜 » compte les sets complets Agriculture + Artisanat + Connaissance ;
  - « X PV / ⚖ » compte les ⚖ visibles du même côté (cartes et jeton Balance), ou de tout le jeu si la carte est posée en bas.

## Données (dans `engine.js`)

- `RAW_CARDS` : 60 cartes au format `"id|gauche|scoring|droite"`. Les données suivent l'Excel de l'auteur.
- Codes des icônes :
  - R1 Agriculture, R2 Artisanat, R3 Connaissance ;
  - CN ❤ noir (toujours à gauche), CB ❤ blanc (toujours à droite) ;
  - D1 Anubis, D2 Horus, D3 Râ ;
  - SC scarabée ;
  - SET et BAL sont des cibles de scoring.
- Cartes ajoutées le 25/11 :

| # | Gauche | Scoring | Droite |
|---|---|---|---|
| 54 | SC D2 | 9 PV / Anubis | R1 |
| 55 | CN | 9 PV / Horus | SC D3 |
| 56 | R2 SC | 9 PV / Râ | D1 |
| 57 | R2 | 7 PV / set R1+R2+R3 | R3 |
| 58 | R1 R2 | 3 PV / ⚖ (⚖) | CB |
| 59 | CN | 4 PV / ⚖ (⚖) | R3 |
| 60 | — | 5 PV / ⚖ (⚖) | — |

- Totaux du paquet : 7 icônes de chaque dieu (maximum fixé par l'auteur), 24 ❤ noirs pour 24 ❤ blancs.
- **Personnages classiques** (5) :
  1. `L:CN CN / R:R1`
  2. `L:R2 / R:CB CB`
  3. `L:CN / R:R3`
  4. `L:R1 / R:CB`
  5. `L:R3 / R:R2`
- **Personnages recommandés** (6, identifiants 11–16, images `n1–n6`) :
  - 1 à 3 ❤ noirs ou blancs chacun ;
  - distribués au hasard, avec des scarabées de départ selon la place : 1, 2, 2, 2, 3 ;
  - au choix sur la page d'accueil.

## IA

- **Niveau Facile :**
  - heuristique `evalPlace` avec des poids entraînables (`DEFAULT_W`, `DEFAULT_W_NEW`) ;
  - fonction « danger d'Ammit » qui lui fait éviter d'être dévorée.
- **Niveaux Avancé et Expert (`mcChoose`) :**
  - pour les meilleurs coups candidats, l'IA joue la fin de la partie dans sa tête (pioche rebattue, tous les joueurs en IA Facile) et garde le meilleur résultat moyen ;
  - même méthode pour revendiquer un Gardien (`mcClaim`) ;
  - réglages dans `LEVELS` : Avancé `{K:5,B:40,min:1,max:12,beta:8}`, Expert `{K:8,B:250,min:8,max:40,beta:8}`.
- **Force mesurée contre l'IA Facile** (égalité ≈ 43 %) : Avancé ≈ 58–60 %, Expert ≈ 74–76 % de victoires.
- **Où chaque niveau sert :**
  - page d'accueil : choix du niveau, Expert par défaut ;
  - **stats : simulations toujours en IA Expert** (choix de l'auteur, c'est elle qui sert aux réglages du jeu), filtre par niveau, Expert par défaut ;
  - tutoriel : Facile.
- **Onglet « Entraîner l'IA » :** un challenger aux poids modifiés affronte l'IA actuelle et la remplace s'il gagne nettement mieux.

## Analyses d'équilibrage (simulations)

- Les Gardiens font environ 13 % du score. Les gagnants en prennent environ 2,3 contre 1,3 pour les perdants, même quand ils valent 4 PV : on les garde à **7 PV**.
- Scorer sur les cœurs rapporte plus, mais l'auteur le veut ainsi (risque / récompense avec Ammit). L'IA est très prudente : environ 0,5 % de joueurs dévorés.
- Les cartes 1–3 (sans scoring, riches en icônes) gagnent beaucoup, surtout posées en haut. La carte 3 est peut-être trop forte.
- Le scoring Connaissance (31–34) est faible : il n'y a que 20 icônes Connaissance dans le paquet.
- Le joueur qui commence la 1re manche gagne environ 45 % des parties, pour environ 29 % attendus. C'est l'avantage le plus marqué, en partie corrigé par les personnages recommandés.
- **Cartes 54–60, à surveiller :**
  - 57 (set) est un peu faible (environ 22 %, pour une moyenne d'environ 28 %) : pourrait passer à 8 PV ;
  - les cartes Dieu 54–56 valent surtout posées en bas.

## Points en attente / idées

- Écart image / Excel : carte 49, 16 PV par paire ou par triple de Connaissance ? L'app suit l'Excel.
- Verso des tuiles Dieu, second pouvoir, et « Creuser la rivière » : pas encore implémentés.
- Idées de scoring proposées mais non retenues pour l'instant :
  - 4 PV par paire ❤ noir + ❤ blanc ;
  - X PV par Gardien ;
  - 2 PV par type d'icône différent ;
  - X PV par carte posée en haut ;
  - Balance graduée (15 PV à écart 0, 8 PV à écart 1) ;
  - 12 PV à écart exactement 2 ;
  - X PV par Gardien non revendiqué.
- Option : utiliser les vrais visuels (`assets/cards/`) aussi dans le jeu et le catalogue (pour l'instant, seulement dans les stats).

## Tests (scripts recréables)

Tests Playwright sur `http://localhost:8765/index.html` :
- partie complète ;
- 300 simulations dans les stats ;
- parcours en italien ;
- onglet d'entraînement ;
- tutoriel dans chaque langue.

Vérifier chaque fois qu'il n'y a aucune erreur JavaScript (`pageerror`).
