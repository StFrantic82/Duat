// Duat — statistiques de parties (stockées dans ce navigateur) + simulations entre IA
{
const D = window.DUAT, U = window.DuatUI;
const KEY = "duat_stats_v1", MAX = 5000;
const IT = {
"Effets des cartes":"Effetti delle carte","Balance":"Bilancia","Gardiens":"Guardiani","Scarabées restants":"Scarabei rimasti","Jeton Râ « 2 PV »":"Gettone Ra «2 PV»","Total":"Totale",
"Ramassés sur la rivière":"Raccolti sul fiume","Symboles Scarabée des cartes":"Simboli Scarabeo delle carte","Anubis":"Anubi","Jeton Râ « 1 Scarabée »":"Gettone Ra «1 Scarabeo»",
"Dépensés : cartes":"Spesi: carte","Dépensés : changement de direction":"Spesi: cambio di direzione","Dépensés : Gardiens":"Spesi: Guardiani","Restants en fin de partie":"Rimasti a fine partita",
"Prises gratuites forcées (rien de payable)":"Prese gratuite forzate (nulla di pagabile)","Scarabées gagnés grâce à Anubis":"Scarabei ottenuti grazie ad Anubi","Cartes piochées grâce à Horus":"Carte pescate grazie a Horus",
"Jetons Râ obtenus":"Gettoni Ra ottenuti","Manches jouées en premier":"Round giocati per primo","◀ Gauche":"◀ Sinistra","Droite ▶":"Destra ▶","▲ Haut":"▲ Sopra","▼ Bas":"▼ Sotto",
"Tous":"Tutti","Gagnants":"Vincitori","Perdants":"Perdenti","parties":"partite","PV moyens par joueur":"PV medi per giocatore","PV moyens du gagnant":"PV medi del vincitore",
"PV d'écart entre le 1er et le 2e":"PV di scarto tra 1° e 2°","des joueurs dévorés par Ammout":"dei giocatori divorati da Ammit","des joueurs parfaitement équilibrés":"dei giocatori in perfetto equilibrio",
"prises gratuites forcées par joueur":"prese gratuite forzate per giocatore","cartes restant dans la pioche":"carte rimaste nel mazzo",
"Référence : taux de victoire attendu si tout est équilibré":"Riferimento: percentuale di vittoria attesa se tutto è bilanciato","En vert au-dessus, en rouge en dessous.":"In verde sopra, in rosso sotto.",
"Parties où tout le monde a été dévoré":"Partite in cui sono stati divorati tutti","Les joueurs dévorés sont éliminés : ils comptent dans « dévorés » mais sont exclus de toutes les moyennes de PV.":"I giocatori divorati sono eliminati: contano tra i «divorati» ma sono esclusi da tutte le medie di PV.","Par nombre de joueurs":"Per numero di giocatori","Joueurs":"Giocatori","Parties":"Partite","PV moyens":"PV medi","PV du gagnant":"PV del vincitore",
"Place de départ":"Posto di partenza","Place au 1er tour":"Posto al 1° round","Victoires":"Vittorie","Attendu":"Atteso","Personnages de départ":"Personaggi iniziali","Bandeaux":"Cartigli","Dévorés":"Divorati","Équilibrés":"In equilibrio",
"D'où viennent les points":"Da dove vengono i punti","Jugement d'Osiris":"Giudizio di Osiride","Écart des cœurs":"Scarto dei cuori","dévoré":"divorato","équilibré":"in equilibrio","Moyennes par joueur":"Medie per giocatore","gagnants":"vincitori",
"Directions de pose":"Direzioni di posa","Part des poses":"Quota delle pose","Cartes / joueur":"Carte / giocatore","PV moyens d'une carte":"PV medi di una carta",
"« PV moyens d'une carte » : points rapportés en fin de partie par l'effet de scoring des cartes posées dans cette direction (0 en haut, où le scoring est caché).":"«PV medi di una carta»: punti ottenuti a fine partita dall'effetto di punteggio delle carte posate in quella direzione (0 sopra, dove il punteggio è nascosto).",
"Économie des scarabées (par joueur et par partie)":"Economia degli scarabei (per giocatore e per partita)",
"Chaque joueur commence avec 1 scarabée. Une « prise gratuite forcée » arrive quand aucune carte n'est payable : à surveiller, c'est une règle provisoire du prototype.":"Ogni giocatore inizia con 1 scarabeo. Una «presa gratuita forzata» avviene quando nessuna carta è pagabile: da tenere d'occhio, è una regola provvisoria del prototipo.",
"Dieux et ordre du tour":"Dei e ordine di turno","Condition":"Requisito","En jeu":"In gioco","Revendiqué":"Reclamato","Manche":"Round","Scarabées payés":"Scarabei pagati","Victoires du preneur":"Vittorie di chi lo prende",
"Gardiens revendiqués par joueur":"Guardiani reclamati per giocatore","perdants":"perdenti","« Revendiqué » : part des parties où ce Gardien était en jeu.":"«Reclamato»: quota delle partite in cui questo Guardiano era in gioco.",
"Jetons Râ":"Gettoni Ra","Pris (parties)":"Preso (partite)","Posé à gauche":"Posato a sinistra","Emplacements de la rivière":"Spazi del fiume","Plateau · emplacement":"Plancia · spazio","Coût":"Costo","Cartes prises":"Carte prese",
"PV moyens de la carte":"PV medi della carta","gratuit":"gratis","Rythme et effet boule de neige":"Ritmo ed effetto valanga","Score après la manche":"Punteggio dopo il round",
"des parties gagnées par le joueur seul en tête après la manche 4":"delle partite vinte dal giocatore da solo in testa dopo il round 4","de remontées (le leader de mi-partie ne gagne pas)":"di rimonte (il leader a metà partita non vince)",
"Écart final 1er – 2e":"Scarto finale 1° – 2°","Le score par manche est un score provisoire (comme si la partie s'arrêtait là, Jugement compris).":"Il punteggio per round è provvisorio (come se la partita finisse lì, Giudizio compreso).",
"Cartes Vie":"Carte Vita","Trier par":"Ordina per","Popularité":"Popolarità","PV produits":"PV prodotti","Min. joueurs":"Min. giocatori","Carte":"Carta","Prise par":"Presa da","Écart":"Scarto","Direction choisie":"Direzione scelta",
"« Prise par » : part des joueurs ayant posé la carte. « Victoires » : taux de victoire de ces joueurs ; « Écart » : en points de % par rapport à la référence. « PV produits » : points rapportés en moyenne par son scoring. Une carte peut gagner souvent parce qu'elle arrive chez un joueur déjà en tête : à lire comme une tendance.":"«Presa da»: quota di giocatori che hanno posato la carta. «Vittorie»: percentuale di vittoria di questi giocatori; «Scarto»: in punti % rispetto al riferimento. «PV prodotti»: punti medi ottenuti dal suo punteggio. Una carta può vincere spesso perché arriva a un giocatore già in testa: da leggere come una tendenza.",
"Simuler des parties entre IA":"Simula partite tra IA","parties à":"partite a","2 à 5":"da 2 a 5","joueurs":"giocatori","Lancer":"Avvia","Arrêter":"Ferma","Vos parties":"Le tue partite","victoires":"vittorie","meilleur score":"punteggio migliore","moyenne":"media",
"Toutes":"Tutte","Avec vous":"Con te","Simulations IA":"Simulazioni IA","Aucune partie enregistrée pour ces filtres. Jouez une partie ou lancez des simulations ci-dessus.":"Nessuna partita registrata per questi filtri. Gioca una partita o avvia delle simulazioni qui sopra.",
"Copier les données (JSON)":"Copia i dati (JSON)","Confirmer l'effacement":"Conferma la cancellazione","Effacer":"Cancella",
"Chaque partie terminée sur cet appareil est enregistrée dans ce navigateur (5 000 au maximum). Les simulations utilisent les IA du prototype : elles montrent des tendances, pas le jeu de vrais joueurs.":"Ogni partita terminata su questo dispositivo viene salvata in questo browser (5.000 al massimo). Le simulazioni usano le IA del prototipo: mostrano tendenze, non il gioco di giocatori reali.",
"Démarrage…":"Avvio…","Scarabées restants en fin de partie : répartition":"Scarabei rimasti a fine partita: distribuzione","Maximum observé":"Massimo osservato","Chaque joueur commence avec 1 scarabée. Chaque scarabée restant rapporte 2 PV en fin de partie.":"Ogni giocatore inizia con 1 scarabeo. Ogni scarabeo rimasto vale 2 PV a fine partita.","Victoires partagées":"Vittorie condivise","Terminé":"Finito","Données copiées":"Dati copiati","Copie impossible ici":"Copia impossibile qui","Effacer les statistiques":"Cancella le statistiche","Statistiques effacées":"Statistiche cancellate","Statistiques":"Statistiche","Fermer":"Chiudi","er":"º","e":"º"
};
const EN = () => U.lang() === "en", L = (fr, en) => EN() ? en : U.lang() === "it" ? (IT[fr] !== undefined ? IT[fr] : fr) : fr;
const pct = (a, b) => b ? Math.round(100 * a / b) : 0;
const avg = (arr, f) => arr.length ? arr.reduce((a, x) => a + f(x), 0) / arr.length : null;
const f1 = v => v === null || v === undefined || isNaN(v) ? "—" : (Math.round(v * 10) / 10).toFixed(1);
const bar = (v, max, col) => `<span class="sbar"><i style="width:${Math.max(0, Math.min(100, 100 * v / (max || 1)))}%;background:${col || "var(--turq)"}"></i></span>`;
const dcol = d => d > 0.04 ? "#2e8b3e" : d < -0.04 ? "#c0392b" : "";
const wl = (w, l) => w !== null && l !== null && f1(w) !== f1(l) ? (w > l ? "#2e8b3e" : "#c0392b") : "";
const $ = s => document.querySelector(s);

let mem = null;
function load() { if (mem) return mem; try { mem = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { mem = []; } return mem; }
function save() { try { localStorage.setItem(KEY, JSON.stringify(load().slice(-MAX))); } catch (e) { try { mem = mem.slice(-Math.floor(MAX / 2)); localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e2) { } } }
const S = { batch: false, add(rec) { load().push(rec); if (mem.length > MAX) mem = mem.slice(-MAX); if (!S.batch) save(); }, all: () => load(), clear() { mem = []; save(); } };
window.DuatStats = S;

/* ---------- simulations ---------- */
let running = false, stopReq = false;
async function simulate(n, np, onProgress) {
  running = true; stopReq = false; S.batch = true;
  for (let k = 0; k < n && !stopReq; k++) {
    const N = np === "mix" ? 2 + (k % 4) : +np;
    try { const G = await D.simGame(N, (Math.random() * 2 ** 32) >>> 0); S.add(D.summary(G, true)); } catch (e) { console.warn("sim", e); }
    if (k % 10 === 9) { onProgress(k + 1, n); await new Promise(r => setTimeout(r, 0)); }
  }
  S.batch = false; save(); running = false; onProgress(n, n, true);
}

/* ---------- calculs ---------- */
function compute(f) {
  const G = load().filter(g => (f.src === "all" || (f.src === "sim" ? g.sim : !g.sim)) && (f.n === "all" || g.n === +f.n));
  const r = { games: G.length }; if (!G.length) return r;
  const P = []; G.forEach(g => g.players.forEach(p => P.push(Object.assign({ g }, p))));
  const W = P.filter(p => p.win), Lo = P.filter(p => !p.win);
  // Les joueurs dévorés sont éliminés : comptés comme dévorés, mais exclus de toutes les moyennes de PV
  const PS = P.filter(p => !p.dev), LoS = Lo.filter(p => !p.dev);
  r.players = P.length; r.baseWin = W.length / P.length;
  r.noWinner = pct(G.filter(g => !g.players.some(p => p.win)).length, G.length);
  r.shared = pct(G.filter(g => g.players.filter(p => p.win).length > 1).length, G.length);
  // vue d'ensemble
  const margins = G.map(g => { const s = g.players.filter(p => !p.dev).map(p => p.total).sort((a, b) => b - a); return s.length > 1 ? s[0] - s[1] : null; }).filter(x => x !== null);
  r.over = { avg: avg(PS, p => p.total), win: avg(W, p => p.total), margin: avg(margins, x => x), dev: pct(P.filter(p => p.dev).length, P.length), bal: pct(P.filter(p => p.diff === 0).length, P.length),
    free: avg(P, p => p.free), deck: avg(G, g => g.deckLeft), byN: [2, 3, 4, 5].map(n => { const x = PS.filter(p => p.g.n === n); return { n, games: G.filter(g => g.n === n).length, avg: avg(x, p => p.total), win: avg(x.filter(p => p.win), p => p.total) }; }) };
  // places et personnages
  r.seats = [0, 1, 2, 3, 4].map(s => { const x = P.filter(p => p.seat === s); return x.length ? { s, n: x.length, w: x.filter(p => p.win).length / x.length, exp: avg(x, p => 1 / p.g.n), avg: avg(x.filter(p => !p.dev), p => p.total), dev: pct(x.filter(p => p.dev).length, x.length) } : null; }).filter(Boolean);
  r.chars = [1, 2, 3, 4, 5].map(c => { const x = P.filter(p => p.char === c); return x.length ? { c, n: x.length, w: x.filter(p => p.win).length / x.length, exp: avg(x, p => 1 / p.g.n), avg: avg(x.filter(p => !p.dev), p => p.total), dev: pct(x.filter(p => p.dev).length, x.length), bal: pct(x.filter(p => p.diff === 0).length, x.length) } : null; }).filter(Boolean);
  // composition du score
  r.comp = [["cards", L("Effets des cartes", "Card effects")], ["bal", L("Balance", "Balance")], ["guard", L("Gardiens", "Guardians")], ["scar", L("Scarabées restants", "Scarabs left")], ["ra", L("Jeton Râ « 2 PV »", "Ra token “2 VP”")], ["total", L("Total", "Total")]]
    .map(([k, l]) => ({ k, l, all: avg(PS, p => p[k]), win: avg(W, p => p[k]), lose: avg(LoS, p => p[k]) }));
  // jugement
  r.judge = [0, 1, 2, 3].map(d => { const x = P.filter(p => d < 3 ? p.diff === d : p.diff >= 3); return { d, p: pct(x.length, P.length), w: x.length ? x.filter(p => p.win).length / x.length : null, avg: avg(x, p => p.total), n: x.length }; });
  r.hearts = { CN: avg(P, p => p.CN), CB: avg(P, p => p.CB), BAL: avg(P, p => p.BAL), balW: avg(W, p => p.BAL) };
  // directions
  const DIRS = ["L", "R", "U", "D"];
  r.dirs = DIRS.map(d => { const tk = [], tkS = []; P.forEach(p => p.takes.forEach(t => { if (t.side === d) { tk.push(t); if (!p.dev) tkS.push(t); } }));
    const tot = P.reduce((a, p) => a + p.takes.length, 0);
    return { d, all: avg(P, p => p.dirs[d]), win: avg(W, p => p.dirs[d]), lose: avg(Lo, p => p.dirs[d]), share: pct(tk.length, tot), pv: avg(tkS, t => t.pv) }; });
  // économie des scarabées
  const E = k => ({ all: avg(P, p => p.eco[k]), win: avg(W, p => p.eco[k]), lose: avg(Lo, p => p.eco[k]) });
  r.eco = [["gRiver", L("Ramassés sur la rivière", "Collected from the river"), 1], ["gCard", L("Symboles Scarabée des cartes", "Scarab symbols on cards"), 1], ["gAnubis", L("Anubis", "Anubis"), 1], ["gSc2", L("Jeton Râ « 1 Scarabée »", "Ra token “1 scarab”"), 1],
    ["cardCost", L("Dépensés : cartes", "Spent: cards"), 0], ["dirCost", L("Dépensés : changement de direction", "Spent: direction change"), 0], ["guardCost", L("Dépensés : Gardiens", "Spent: Guardians"), 0]].map(([k, l, g]) => Object.assign({ k, l, g }, E(k)));
  r.eco.push({ k: "left", l: L("Restants en fin de partie", "Left at game end"), all: avg(P, p => p.scLeft), win: avg(W, p => p.scLeft), lose: avg(Lo, p => p.scLeft) });
  // répartition des scarabées restants
  r.scDist = [0, 1, 2, 3, 4, 5].map(k => { const x = P.filter(p => k < 5 ? p.scLeft === k : p.scLeft >= 5); return { k, p: pct(x.length, P.length), n: x.length, w: x.length ? x.filter(p => p.win).length / x.length : null, avg: avg(x.filter(p => !p.dev), p => p.total) }; });
  r.scMax = P.reduce((m, p) => Math.max(m, p.scLeft), 0);
  // dieux
  const tokN = p => p.tokens.length;
  r.gods = [[L("Scarabées gagnés grâce à Anubis", "Scarabs gained from Anubis"), p => p.eco.gAnubis], [L("Cartes piochées grâce à Horus", "Cards drawn from Horus"), p => p.horus], [L("Jetons Râ obtenus", "Ra tokens obtained"), tokN], [L("Manches jouées en premier", "Rounds played first"), p => p.first]]
    .map(([l, fn]) => ({ l, all: avg(P, fn), win: avg(W, fn), lose: avg(Lo, fn) }));
  // gardiens
  r.guards = D.GUARDIANS.map(gd => { const gs = G.filter(g => g.gates.includes(gd.id)); const cl = []; gs.forEach(g => g.players.forEach(p => p.claims.forEach(c => { if (c.gid === gd.id) cl.push(Object.assign({ win: p.win }, c)); })));
    return { gd, present: pct(gs.length, G.length), claimed: pct(cl.length, gs.length), round: avg(cl, c => c.round), cost: avg(cl, c => c.cost), w: cl.length ? cl.filter(c => c.win).length / cl.length : null, gate: avg(gs, g => g.gates.indexOf(gd.id) + 1) }; });
  r.guardPer = avg(P, p => p.claims.length); r.guardW = avg(W, p => p.claims.length); r.guardL = avg(Lo, p => p.claims.length);
  // jetons Râ
  r.ra = D.RA_TOKENS.map(k => { const x = P.filter(p => p.tokens.some(t => t.startsWith(k) && (k !== "R1" && k !== "R2" && k !== "R3" || t.length === 3))); const left = P.filter(p => p.tokens.includes(k + "L")).length, right = P.filter(p => p.tokens.includes(k + "R")).length;
    return { k, taken: pct(x.length, G.length), w: x.length ? x.filter(p => p.win).length / x.length : null, half: D.HALF_TOKENS.includes(k) && (left + right) ? pct(left, left + right) : null }; });
  // rivière
  const slotT = {}; P.forEach(p => p.takes.forEach(t => { if (t.slot < 0) return; const key = (p.g.n <= 3 ? "B" : "A") + t.slot; const o = slotT[key] || (slotT[key] = { key, n: 0, w: 0, pv: 0, pn: 0, cost: t.cost }); o.n++; if (p.win) o.w++; if (!p.dev) { o.pv += t.pv; o.pn++; } }));
  r.slots = Object.values(slotT).sort((a, b) => a.key.localeCompare(b.key)).map(o => Object.assign(o, { wr: o.w / o.n, pvA: o.pn ? o.pv / o.pn : null }));
  // rythme : score moyen par manche, boule de neige
  r.pace = Array.from({ length: 8 }, (_, k) => ({ k: k + 1, all: avg(PS, p => (p.g.hist[k] || [])[p.i] || 0), win: avg(W, p => (p.g.hist[k] || [])[p.i] || 0), lose: avg(LoS, p => (p.g.hist[k] || [])[p.i] || 0) }));
  let lead = 0, leadW = 0; G.forEach(g => { const h = g.hist[3]; if (!h) return; const mx = Math.max(...h); if (h.filter(v => v === mx).length !== 1) return; lead++; const wi = g.players.findIndex(p => p.win); if (wi >= 0 && h[wi] === mx) leadW++; });
  r.snow = { lead, leadW: pct(leadW, lead), comeback: lead ? 100 - pct(leadW, lead) : 0, margin: [[0, 5], [6, 15], [16, 30], [31, 999]].map(([a, b]) => ({ a, b, p: pct(margins.filter(m => m >= a && m <= b).length, margins.length) })) };
  // cartes
  const C = {}; P.forEach(p => { const seen = new Set(); p.takes.forEach(t => { const c = C[t.id] || (C[t.id] = { id: t.id, players: 0, wins: 0, takes: 0, pv: 0, round: 0, dir: { L: 0, R: 0, U: 0, D: 0 }, horus: 0, pn: 0 }); c.takes++; if (!p.dev) { c.pv += t.pv; c.pn++; } c.round += t.round; c.dir[t.side]++; if (t.horus) c.horus++; if (!seen.has(t.id)) { seen.add(t.id); c.players++; if (p.win) c.wins++; } }); });
  r.cards = Object.values(C).map(c => Object.assign(c, { rate: c.players / P.length, wr: c.wins / c.players, delta: c.wins / c.players - r.baseWin, pvA: c.pn ? c.pv / c.pn : 0, roundA: c.round / c.takes }));
  // humains
  const H = load().filter(g => !g.sim).map(g => g.players.find(p => p.human)).filter(Boolean);
  r.me = { n: H.length, w: H.filter(p => p.win).length, best: H.filter(p => !p.dev).reduce((m, p) => Math.max(m, p.total), 0), avg: avg(H.filter(p => !p.dev), p => p.total), dev: H.filter(p => p.dev).length };
  return r;
}

/* ---------- affichage ---------- */
let filt = { src: "all", n: "all", sort: "wr", minG: 10 }, simN = 200, simP = "mix", confirmClear = false, msg = "";
const seg = (key, opts) => `<div class="sseg">${opts.map(([v, l]) => `<button type="button" data-f="${key}" data-v="${v}" aria-pressed="${String(filt[key]) === String(v)}">${l}</button>`).join("")}</div>`;
const DIRL = () => ({ L: L("◀ Gauche", "◀ Left"), R: L("Droite ▶", "Right ▶"), U: L("▲ Haut", "▲ Top"), D: L("▼ Bas", "▼ Bottom") });
const th3 = () => `<th>${L("Tous", "All")}</th><th>${L("Gagnants", "Winners")}</th><th>${L("Perdants", "Losers")}</th>`;
const row3 = (label, o) => `<tr><td>${label}</td><td><b>${f1(o.all)}</b></td><td style="color:${wl(o.win, o.lose)}">${f1(o.win)}</td><td>${f1(o.lose)}</td></tr>`;
const wcell = (w, base, n) => w === null ? "—" : `<b style="color:${dcol(w - base)}">${Math.round(w * 100)}%</b>${n !== undefined ? ` <small>(${n})</small>` : ""}`;

function body(r) {
  const ic = U.ic, base = r.baseWin, DL = DIRL();
  const cards = r.cards.filter(c => c.players >= filt.minG).sort({ wr: (a, b) => b.wr - a.wr, rate: (a, b) => b.rate - a.rate, pv: (a, b) => b.pvA - a.pvA, id: (a, b) => a.id - b.id }[filt.sort]);
  const maxRate = Math.max(0.01, ...cards.map(c => c.rate));
  const charImg = c => `<img class="sthumb" src="assets/c${c}.jpg" alt="">`;
  return `
  <div class="sgrid">
    <div class="scard"><b>${r.games}</b><span>${L("parties", "games")}</span></div>
    <div class="scard"><b>${f1(r.over.avg)}</b><span>${L("PV moyens par joueur", "average VP per player")}</span></div>
    <div class="scard"><b>${f1(r.over.win)}</b><span>${L("PV moyens du gagnant", "winner's average VP")}</span></div>
    <div class="scard"><b>${f1(r.over.margin)}</b><span>${L("PV d'écart entre le 1er et le 2e", "VP gap between 1st and 2nd")}</span></div>
    <div class="scard ${r.over.dev > 15 ? "hot" : ""}"><b>${r.over.dev}%</b><span>${L("des joueurs dévorés par Ammout", "of players devoured by Ammit")}</span></div>
    <div class="scard"><b>${r.over.bal}%</b><span>${L("des joueurs parfaitement équilibrés", "of players perfectly balanced")}</span></div>
    <div class="scard"><b>${f1(r.over.deck)}</b><span>${L("cartes restant dans la pioche", "cards left in the deck")}</span></div>
  </div>
  <p class="snote">${L("Référence : taux de victoire attendu si tout est équilibré", "Reference: expected win rate if everything is balanced")} = <b>${Math.round(base * 100)}%</b>. ${L("En vert au-dessus, en rouge en dessous.", "Green above, red below.")} ${L("Les joueurs dévorés sont éliminés : ils comptent dans « dévorés » mais sont exclus de toutes les moyennes de PV.", "Devoured players are eliminated: they count as “devoured” but are excluded from all VP averages.")}${r.noWinner ? ` ${L("Parties où tout le monde a été dévoré", "Games where everyone was devoured")} : ${r.noWinner}%.` : ""}${r.shared ? ` ${L("Victoires partagées", "Shared victories")} : ${r.shared}%.` : ""}</p>

  <h3>${L("Par nombre de joueurs", "By player count")}</h3>
  <table class="stab"><tr><th>${L("Joueurs", "Players")}</th><th>${L("Parties", "Games")}</th><th>${L("PV moyens", "Average VP")}</th><th>${L("PV du gagnant", "Winner VP")}</th></tr>
  ${r.over.byN.filter(x => x.games).map(x => `<tr><td><b>${x.n}</b></td><td>${x.games}</td><td>${f1(x.avg)}</td><td>${f1(x.win)}</td></tr>`).join("")}</table>

  <h3>${L("Place de départ", "Starting seat")}</h3>
  <table class="stab"><tr><th>${L("Place au 1er tour", "Seat in round 1")}</th><th>${L("Victoires", "Wins")}</th><th>${L("Attendu", "Expected")}</th><th>${L("PV moyens", "Average VP")}</th><th>${L("Dévorés", "Devoured")}</th></tr>
  ${r.seats.map(s => `<tr><td><b>${s.s + 1}${L(s.s ? "e" : "er", ["st", "nd", "rd", "th", "th"][s.s])}</b></td><td>${bar(s.w, 1, "#2f62c4")} ${wcell(s.w, s.exp, s.n)}</td><td>${Math.round(s.exp * 100)}%</td><td>${f1(s.avg)}</td><td>${s.dev}%</td></tr>`).join("")}</table>

  <h3>${L("Personnages de départ", "Starting characters")}</h3>
  <table class="stab"><tr><th></th><th>${L("Bandeaux", "Banners")}</th><th>${L("Victoires", "Wins")}</th><th>${L("PV moyens", "Average VP")}</th><th>${L("Dévorés", "Devoured")}</th><th>${L("Équilibrés", "Balanced")}</th></tr>
  ${r.chars.map(c => { const ch = D.CHARS[c.c - 1]; return `<tr><td>${charImg(c.c)} <b>${c.c}</b></td><td>${ch.L.map(k => ic(k)).join("")} | ${ch.R.map(k => ic(k)).join("")}</td><td>${wcell(c.w, c.exp, c.n)}</td><td>${f1(c.avg)}</td><td>${c.dev}%</td><td>${c.bal}%</td></tr>`; }).join("")}</table>

  <h3>${L("D'où viennent les points", "Where points come from")}</h3>
  <table class="stab"><tr><th></th>${th3()}</tr>${r.comp.map(c => row3(c.k === "total" ? `<b>${c.l}</b>` : c.l, c)).join("")}</table>

  <h3>${L("Jugement d'Osiris", "Judgment of Osiris")}</h3>
  <table class="stab"><tr><th>${L("Écart des cœurs", "Heart gap")}</th><th>${L("Joueurs", "Players")}</th><th>${L("Victoires", "Wins")}</th><th>${L("PV moyens", "Average VP")}</th></tr>
  ${r.judge.map(j => `<tr><td><b>${j.d === 3 ? "3+ · " + L("dévoré", "devoured") : j.d === 0 ? "0 · " + L("équilibré", "balanced") : j.d}</b></td><td>${bar(j.p, 100, j.d === 3 ? "#c0392b" : j.d === 0 ? "var(--turq)" : "#c9a45c")} ${j.p}%</td><td>${wcell(j.w, base, j.n)}</td><td>${j.d === 3 ? "—" : f1(j.avg)}</td></tr>`).join("")}</table>
  <p class="snote">${L("Moyennes par joueur", "Per-player averages")} : ${ic("CN")} ${f1(r.hearts.CN)} · ${ic("CB")} ${f1(r.hearts.CB)} · ${ic("BAL")} ${f1(r.hearts.BAL)} (${L("gagnants", "winners")} ${f1(r.hearts.balW)}).</p>

  <h3>${L("Directions de pose", "Placement directions")}</h3>
  <table class="stab"><tr><th></th><th>${L("Part des poses", "Share of placements")}</th><th>${L("Cartes / joueur", "Cards / player")}</th><th>${L("Gagnants", "Winners")}</th><th>${L("Perdants", "Losers")}</th><th>${L("PV moyens d'une carte", "Avg VP per card")}</th></tr>
  ${r.dirs.map(d => `<tr><td><b>${DL[d.d]}</b></td><td>${bar(d.share, 100, "#7a4fa0")} ${d.share}%</td><td><b>${f1(d.all)}</b></td><td style="color:${wl(d.win, d.lose)}">${f1(d.win)}</td><td>${f1(d.lose)}</td><td>${f1(d.pv)}</td></tr>`).join("")}</table>
  <p class="snote">${L("« PV moyens d'une carte » : points rapportés en fin de partie par l'effet de scoring des cartes posées dans cette direction (0 en haut, où le scoring est caché).", "“Avg VP per card”: end-game points from the scoring effect of cards placed in that direction (0 on top, where scoring is hidden).")}</p>

  <h3>${L("Économie des scarabées (par joueur et par partie)", "Scarab economy (per player per game)")}</h3>
  <table class="stab"><tr><th></th>${th3()}</tr>${r.eco.map(e => row3(`${ic("SC")} ${e.g ? "+ " : e.k === "left" || e.k === "free" ? "" : "− "}${e.l}`, e)).join("")}</table>
  <p class="snote">${L("Chaque joueur commence avec 1 scarabée. Chaque scarabée restant rapporte 2 PV en fin de partie.", "Each player starts with 1 scarab. Each remaining scarab is worth 2 VP at game end.")}</p>

  <h4>${L("Scarabées restants en fin de partie : répartition", "Scarabs left at game end: distribution")}</h4>
  <table class="stab"><tr><th>${ic("SC")}</th><th>${L("Joueurs", "Players")}</th><th>${L("Victoires", "Wins")}</th><th>${L("PV moyens", "Average VP")}</th></tr>
  ${r.scDist.map(d => `<tr><td><b>${d.k < 5 ? d.k : "5+"}</b></td><td>${bar(d.p, 100, "var(--turq)")} ${d.p}%</td><td>${d.n ? wcell(d.w, base, d.n) : "—"}</td><td>${f1(d.avg)}</td></tr>`).join("")}</table>
  <p class="snote">${L("Maximum observé", "Highest observed")} : ${r.scMax}.</p>
  <h3>${L("Dieux et ordre du tour", "Gods and turn order")}</h3>
  <table class="stab"><tr><th></th>${th3()}</tr>${r.gods.map(g => row3(g.l, g)).join("")}</table>

  <h3>${L("Gardiens", "Guardians")}</h3>
  <table class="stab"><tr><th></th><th>${L("Condition", "Requirement")}</th><th>${L("En jeu", "In play")}</th><th>${L("Revendiqué", "Claimed")}</th><th>${L("Manche", "Round")}</th><th>${L("Scarabées payés", "Scarabs paid")}</th><th>${L("Victoires du preneur", "Claimer wins")}</th></tr>
  ${r.guards.map(g => `<tr><td><img class="sthumb g" src="assets/g${g.gd.id}a.jpg" alt=""></td><td>${g.gd.need} × ${ic(g.gd.key)}</td><td>${g.present}%</td><td>${bar(g.claimed, 100, "#e3a21a")} ${g.claimed}%</td><td>${f1(g.round)}</td><td>${f1(g.cost)}</td><td>${wcell(g.w, base)}</td></tr>`).join("")}</table>
  <p class="snote">${L("Gardiens revendiqués par joueur", "Guardians claimed per player")} : <b>${f1(r.guardPer)}</b> (${L("gagnants", "winners")} ${f1(r.guardW)}, ${L("perdants", "losers")} ${f1(r.guardL)}). ${L("« Revendiqué » : part des parties où ce Gardien était en jeu.", "“Claimed”: share of games where this Guardian was in play.")}</p>

  <h3>${L("Jetons Râ", "Ra tokens")}</h3>
  <table class="stab"><tr><th></th><th>${L("Pris (parties)", "Taken (games)")}</th><th>${L("Victoires du preneur", "Taker wins")}</th><th>${L("Posé à gauche", "Placed left")}</th></tr>
  ${r.ra.map(x => `<tr><td><img class="sthumb t" src="assets/${U.raImg(x.k)}.png" alt=""> ${U.gname(x.k)}</td><td>${bar(x.taken, 100, "#e3a21a")} ${x.taken}%</td><td>${wcell(x.w, base)}</td><td>${x.half === null ? "—" : x.half + "%"}</td></tr>`).join("")}</table>

  <h3>${L("Emplacements de la rivière", "River slots")}</h3>
  <table class="stab"><tr><th>${L("Plateau · emplacement", "Board · slot")}</th><th>${L("Coût", "Cost")}</th><th>${L("Cartes prises", "Cards taken")}</th><th>${L("Victoires", "Wins")}</th><th>${L("PV moyens de la carte", "Card avg VP")}</th></tr>
  ${r.slots.map(o => `<tr><td>${o.key[0] === "B" ? "2–3 p." : "4–5 p."} · ${+o.key.slice(1) + 1}</td><td>${o.cost ? Array(o.cost).fill(ic("SC")).join("") : L("gratuit", "free")}</td><td>${o.n}</td><td>${wcell(o.wr, base)}</td><td>${f1(o.pvA)}</td></tr>`).join("")}</table>

  <h3>${L("Rythme et effet boule de neige", "Pace and snowball effect")}</h3>
  <table class="stab"><tr><th>${L("Score après la manche", "Score after round")}</th>${th3()}</tr>${r.pace.map(p => row3(`<b>${p.k}</b>`, p)).join("")}</table>
  <div class="sgrid"><div class="scard"><b>${r.snow.leadW}%</b><span>${L("des parties gagnées par le joueur seul en tête après la manche 4", "of games won by the sole leader after round 4")}</span></div>
    <div class="scard"><b>${r.snow.comeback}%</b><span>${L("de remontées (le leader de mi-partie ne gagne pas)", "comebacks (the mid-game leader doesn't win)")}</span></div></div>
  <table class="stab"><tr><th>${L("Écart final 1er – 2e", "Final gap 1st – 2nd")}</th><th></th></tr>${r.snow.margin.map(m => `<tr><td>${m.b > 900 ? m.a + "+" : m.a + "–" + m.b} PV</td><td>${bar(m.p, 100, "#7a4fa0")} ${m.p}%</td></tr>`).join("")}</table>
  <p class="snote">${L("Le score par manche est un score provisoire (comme si la partie s'arrêtait là, Jugement compris).", "The per-round score is provisional (as if the game ended then, Judgment included).")}</p>

  <h3>${L("Cartes Vie", "Life cards")}</h3>
  <div class="sfilters"><span>${L("Trier par", "Sort by")} :</span>${seg("sort", [["wr", L("Victoires", "Wins")], ["rate", L("Popularité", "Popularity")], ["pv", L("PV produits", "VP produced")], ["id", "N°"]])}
   <span>${L("Min. joueurs", "Min. players")} :</span>${seg("minG", [[1, "1"], [10, "10"], [30, "30"], [100, "100"]])}</div>
  <div class="scroll"><table class="stab cardsT"><tr><th>${L("Carte", "Card")}</th><th>${L("Prise par", "Taken by")}</th><th>${L("Victoires", "Wins")}</th><th>${L("Écart", "Gap")}</th><th>${L("PV produits", "VP produced")}</th><th>${L("Direction choisie", "Direction chosen")}</th><th>${L("Manche", "Round")}</th></tr>
  ${cards.map(c => { const tot = c.dir.L + c.dir.R + c.dir.U + c.dir.D; return `<tr><td><div class="cthumb">${U.cardHTML(c.id)}<b>${c.id}</b></div></td><td>${bar(c.rate, maxRate, "#4a7fb5")} ${Math.round(c.rate * 100)}% <small>(${c.players})</small></td><td>${wcell(c.wr, base)}</td><td style="color:${dcol(c.delta)}">${c.delta > 0 ? "+" : ""}${Math.round(c.delta * 100)}</td><td><b>${f1(c.pvA)}</b></td>
    <td><span class="dirbar">${["L", "R", "U", "D"].map(d => c.dir[d] ? `<i class="d${d}" style="width:${100 * c.dir[d] / tot}%" title="${DL[d]} ${pct(c.dir[d], tot)}%"></i>` : "").join("")}</span><small>${["L", "R", "U", "D"].filter(d => c.dir[d]).map(d => DL[d].replace(/[^▲▼◀▶]/g, "") + pct(c.dir[d], tot)).join(" ")}</small></td><td>${f1(c.roundA)}</td></tr>`; }).join("")}</table></div>
  <p class="snote">${L("« Prise par » : part des joueurs ayant posé la carte. « Victoires » : taux de victoire de ces joueurs ; « Écart » : en points de % par rapport à la référence. « PV produits » : points rapportés en moyenne par son scoring. Une carte peut gagner souvent parce qu'elle arrive chez un joueur déjà en tête : à lire comme une tendance.", "“Taken by”: share of players who placed the card. “Wins”: win rate of those players; “Gap”: in % points vs the reference. “VP produced”: average points from its scoring. A card may win often because it lands with a player already ahead: read it as a trend.")}</p>`;
}
function render() {
  const B = $("#statsBody"); if (!B) return;
  const r = compute(filt);
  const me = r.me || compute({ src: "all", n: "all" }).me || { n: 0 };
  const hdr = `<div class="simbox"><b>${L("Simuler des parties entre IA", "Simulate AI games")}</b>
     <label><input type="number" id="simN" min="1" max="5000" value="${simN}"> ${L("parties à", "games with")}</label>
     <div class="sseg">${[["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["mix", L("2 à 5", "2 to 5")]].map(([v, l]) => `<button type="button" data-sp="${v}" aria-pressed="${simP === v}">${l}</button>`).join("")}</div> ${L("joueurs", "players")}
     <button type="button" class="primary" id="simGo" ${running ? "disabled" : ""}>${L("Lancer", "Run")}</button><button type="button" id="simStop" ${running ? "" : "disabled"}>${L("Arrêter", "Stop")}</button>
     <span class="simprog" id="simProg">${msg}</span>
     <button type="button" data-act="clear" class="clearTop ${confirmClear ? "danger" : ""}">${confirmClear ? L("Confirmer l'effacement", "Confirm reset") : "🗑 " + L("Effacer les statistiques", "Reset statistics")}</button></div>
   ${me && me.n ? `<p class="snote">${L("Vos parties", "Your games")} : <b>${me.n}</b> · ${L("victoires", "wins")} <b>${me.w}</b> (${pct(me.w, me.n)}%) · ${L("meilleur score", "best score")} <b>${me.best}</b> · ${L("moyenne", "average")} <b>${f1(me.avg)}</b> · ${L("dévoré", "devoured")} ${me.dev}×</p>` : ""}
   <div class="sfilters"><span>${L("Parties", "Games")} :</span>${seg("src", [["all", L("Toutes", "All")], ["human", L("Avec vous", "With you")], ["sim", L("Simulations IA", "AI simulations")]])}
   <span>${L("Joueurs", "Players")} :</span>${seg("n", [["all", L("Tous", "All")], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"]])}</div>`;
  B.innerHTML = hdr + (r.games ? body(r) : `<div class="sempty">${L("Aucune partie enregistrée pour ces filtres. Jouez une partie ou lancez des simulations ci-dessus.", "No games recorded for these filters. Play a game or run simulations above.")}</div>`) +
    `<div class="sfoot"><button type="button" id="statsCopy">${L("Copier les données (JSON)", "Copy data (JSON)")}</button><button type="button" data-act="clear" class="${confirmClear ? "danger" : ""}">${confirmClear ? L("Confirmer l'effacement", "Confirm reset") : L("Effacer", "Reset")}</button></div>
     <p class="snote">${L("Chaque partie terminée sur cet appareil est enregistrée dans ce navigateur (5 000 au maximum). Les simulations utilisent les IA du prototype : elles montrent des tendances, pas le jeu de vrais joueurs.", "Every game finished on this device is saved in this browser (5,000 max). Simulations use the prototype AIs: they show trends, not how real players play.")}</p>`;
}
function onClick(e) {
  const b = e.target.closest("button"); if (!b || !$("#statsBody") || !$("#statsBody").contains(b)) return;
  if (b.dataset.f) { const k = b.dataset.f; filt[k] = k === "minG" ? +b.dataset.v : b.dataset.v; confirmClear = false; render(); return; }
  if (b.dataset.sp) { simP = b.dataset.sp; render(); return; }
  if (b.id === "simGo") {
    simN = Math.max(1, Math.min(5000, +$("#simN").value || 100)); msg = L("Démarrage…", "Starting…"); render();
    simulate(simN, simP, (k, n, done) => { msg = done ? L("Terminé", "Done") + ` · ${n}` : `${k} / ${n}`; if (done) render(); else { const el = $("#simProg"); if (el) el.innerHTML = `${bar(k, n)} ${msg}`; } });
    setTimeout(render, 30); return;
  }
  if (b.id === "simStop") { stopReq = true; return; }
  if (b.id === "statsCopy") { const txt = JSON.stringify(load()); (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => { msg = L("Données copiées", "Data copied"); render(); }, () => { msg = L("Copie impossible ici", "Copy not possible here"); render(); }); return; }
  if (b.dataset.act === "clear") { if (confirmClear) { S.clear(); confirmClear = false; msg = L("Statistiques effacées", "Statistics reset"); } else confirmClear = true; render(); return; }
}
document.addEventListener("click", onClick);
S.open = () => { confirmClear = false; U.openSheet(`<div class="sheet-head"><h2>${L("Statistiques", "Statistics")}</h2><button data-close>${L("Fermer", "Close")}</button></div><div id="statsBody"></div>`, "wide"); render(); };
S.render = render;
}
