{
const D = window.DUAT;
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const store = { get(k, d) { try { const v = localStorage.getItem("duat-" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem("duat-" + k, JSON.stringify(v)); } catch (e) { } } };
const sleep = ms => new Promise(r => setTimeout(r, ms));

const TITLES = { 1: "Going to the temple", 2: "Going to the temple", 3: "Going to the temple", 5: "Funeral Vigil", 6: "Linen Wrappings", 7: "The Falcon Amulet", 8: "Prayer to Horus", 9: "The Protective Eye", 10: "Prayer at Dawn", 11: "Incense for Ra", 12: "Offering to the Sun", 13: "Morning Hymn", 16: "Offering Grain to the Temple", 17: "Carving a Divine Statue", 18: "The Festive Banquet", 19: "Copying a Sacred Hymn", 20: "Stolen Offerings", 21: "The Temple Fields", 22: "Clothing the Divine Statue", 23: "The Village Festival", 24: "The Festival Calendar", 25: "Bread for the Departed", 26: "Bribing an Official", 27: "Falsified Accounts", 28: "The Shifted Boundary Stone", 29: "False Weights", 30: "Clothing the Needy", 31: "Sharing the Grain", 32: "Tending the Sick", 33: "Welcoming a Traveler", 34: "Brewing Beer", 35: "Harvesting Grain", 36: "Measuring the Fields", 37: "Building a House", 38: "Making Papyrus", 39: "A Letter Home", 40: "Weaving Linen" };
const HAS_ART = id => id <= 40;
const COLORS = ["#2f62c4", "#c0392b", "#14a08f", "#e3a21a", "#8e44ad"];
const BA = { "#2f62c4": "blue", "#c0392b": "red", "#14a08f": "teal", "#e3a21a": "gold", "#8e44ad": "purple" };
const ba = (p, cls = "dot") => `<img class="${cls}" src="assets/ba_${BA[p.color] || "red"}.png" alt="" title="${esc(p.name)}">`;
const BOTS = ["Néfertari", "Khâemouaset", "Mérytamon", "Sénedjem"];

/* ---------- textes ---------- */
const T = {
  fr: {
    tagline: "Guidez votre âme à travers les portes du Duat, gagnez la faveur des Gardiens… et présentez à Osiris un cœur en équilibre.",
    meta: "2 à 5 joueurs · 30 minutes · 8 manches", yourName: "Votre nom", players: "Joueurs", start: "Entrer dans le Duat",
    rules: "Règles", cards: "Le matériel", stats: "Statistiques", tuto: "🎓 Tutoriel", train: "🧠 Entraîner l'IA", home: "Accueil", offer: "Cartes Vie disponibles", journal: "Journal de la partie",
    nhint: n => `Vous contre ${n - 1} adversaire${n > 2 ? "s" : ""} · plateau face ${n <= 3 ? "B" : "A"} · ${n <= 3 ? 4 : n === 4 ? 5 : 6} cartes Vie visibles`,
    round: (r) => r <= 7 ? `Manche ${r}/8` : "Manche 8/8 · Jugement", sideFree: "Direction libre", orient: { L: "Les Fautes", R: "Les Vertus", U: "Les Accomplissements", D: "La Spiritualité" }, impBy: n => `Direction imposée par ${n}`, youChoose: "Vous êtes le 1er joueur : choisissez la direction, elle sera imposée aux autres.", waitFirst: n => `${n} va choisir la direction de la manche…`, imposedTag: "imposée", sideImp: s => `Direction imposée : ${T.fr[s]}`,
    L: "◀ Gauche", R: "Droite ▶", U: "▲ Haut", D: "▼ Bas", subU: "sans scoring", subD: "scoring seul, sur tout le jeu", halfL: "Moitié gauche", halfR: "Moitié droite", adj: "direction adjacente", opp: "direction opposée", free: "gratuit", impose: "vous imposez ce côté", change: "changer de côté",
    yourTurn: "<b>À vous !</b> Choisissez une carte Vie, puis le côté où la poser.", pickSide: "<b>Où la poser ?</b> Les icônes du côté choisi rejoignent votre tableau.",
    thinking: n => `${esc(n)} réfléchit…`, gate: k => `Porte en cours : on compte vos`, cost: "Coût", order: "Ordre du tour",
    you: "Vous", scarabs: "Scarabées", guardians: "Gardiens", tokens: "Jetons Râ", hearts: "Cœurs", diff: d => `Écart ${d}`,
    balanced: "Équilibré", danger: "Ammout guette !", noCard: "—", deck: n => `Pioche : ${n}`,
    raTitle: "Râ vous accorde un jeton bonus", raSub: "Choisissez parmi les jetons restants.", raHalf: "Où poser ce jeton ?", raHalfSub: "Posé à gauche ou à droite de votre Personnage, il ne compte que pour cette moitié de votre jeu.",
    claimTitle: "Revendiquer un Gardien ?", claimSub: "Les Gardiens des portes déjà franchies peuvent être revendiqués. Chaque Scarabée dépensé remplace une icône manquante. Un Gardien rapporte 7 PV.",
    claimBtn: c => c ? `Revendiquer (${c} scarabée${c > 1 ? "s" : ""})` : "Revendiquer (gratuit)", pass: "Passer",
    endTitle: "Le Jugement d'Osiris", rank: "Rang", cardsPV: "Cartes", balPV: "Balance", gPV: "Gardiens", scPV: "Scarabées", raPV: "Râ", total: "Total",
    devoured: "Dévoré par Ammout", eliminated: "éliminé de la partie", winYou: "Votre cœur est plus léger que la plume : vous rejoignez le Champ des Roseaux !", winOther: n => `${esc(n)} remporte la partie.`, shared: n => `Égalité parfaite (PV et cœurs) : victoire partagée entre ${esc(n)}.`, nobody: "Ammout a dévoré tout le monde…",
    again: "Rejouer", close: "Fermer", tLife: "Cartes Vie (53)", tGuard: "Gardiens (8)", tChar: "Personnages (5)", tRa: "Jetons Râ (7)", tGods: "Dieux (3)",
    statsT: "Vos statistiques", played: "Parties", wins: "Victoires", best: "Meilleur score", avg: "Score moyen", devs: "Dévoré", reset: "Effacer",
    anubis: "Anubis — gagnez 1 Scarabée par icône Anubis.", horus: "Horus — chaque paire d'Horus : piochez une carte et jouez-la (côté imposé).", ra: "Râ — gagnez un jeton bonus (7 au total).",
    g: { R1: "Agriculture", R2: "Artisanat", R3: "Connaissance", CN: "Cœurs noirs", CB: "Cœurs blancs", D: "Dieux", SIDE: "Cartes d'un même côté", SC: "Symboles Scarabée", BAL: "Balance", SC2: "1 Scarabée + 2 PV" },
    gNeed: (n, k) => `${n} × ${k} → 7 PV`, gPillar: "Pendant sa manche, ce Gardien fixe ce que l'on compte sur le pilier (ordre du tour).",
    char: n => `Personnage ${n}`, cardN: n => `Carte Vie n°${n}`,
    log: {
      take: (p, e) => `${p} prend la carte n°${e.id}${e.cost ? ` (${e.cost} scarabée${e.cost > 1 ? "s" : ""})` : ""}${e.gain ? `, ramasse ${e.gain} scarabée${e.gain > 1 ? "s" : ""}` : ""}${e.sideCost ? ` et paie ${e.sideCost} pour changer de direction` : ""}.`,
      place: (p, e) => `${p} ${e.horus ? "(Horus) " : ""}pose la carte n°${e.id} ${({ L: "à gauche", R: "à droite", U: "en haut", D: "en bas" })[e.side]}.`,
      anubis: p => `${p} gagne 1 scarabée grâce à Anubis.`, ra: (p, e) => `${p} reçoit le jeton Râ « ${T.fr.g[e.t] || e.t} »${D.HALF_TOKENS.includes(e.t) ? ` et le pose ${e.h === "L" ? "à gauche" : "à droite"}` : ""}.`, horus: p => `${p} complète une paire d'Horus et pioche une carte !`,
      claim: (p, e) => `${p} revendique le Gardien ${T.fr.g[D.GUARDIANS[e.gid - 1].key]} (+7 PV).`, soul: (p, e) => `${p} place son âme au niveau ${e.lvl}.`, round: (p, e) => `— Manche ${e.round} —`
    }
  },
  en: {
    tagline: "Guide your soul through the gates of the Duat, win the Guardians' favour… and bring Osiris a heart in perfect balance.",
    meta: "2–5 players · 30 minutes · 8 rounds", yourName: "Your name", players: "Players", start: "Enter the Duat",
    rules: "Rules", cards: "Components", stats: "Statistics", tuto: "🎓 Tutorial", train: "🧠 Train the AI", home: "Home", offer: "Available Life cards", journal: "Game log",
    nhint: n => `You vs ${n - 1} opponent${n > 2 ? "s" : ""} · board side ${n <= 3 ? "B" : "A"} (${n <= 3 ? 4 : n === 4 ? 5 : 6} cards on display)`,
    round: r => r <= 7 ? `Round ${r}/8` : "Round 8/8 · Judgment", sideFree: "Free direction", orient: { L: "Faults", R: "Virtues", U: "Achievements", D: "Spirituality" }, impBy: n => `Direction imposed by ${n}`, youChoose: "You are the first player: choose the direction, it will be imposed on the others.", waitFirst: n => `${n} will choose this round's direction…`, imposedTag: "imposed", sideImp: s => `Imposed direction: ${T.en[s]}`,
    L: "◀ Left", R: "Right ▶", U: "▲ Top", D: "▼ Bottom", subU: "no scoring", subD: "scoring only, on your whole display", halfL: "Left half", halfR: "Right half", adj: "adjacent direction", opp: "opposite direction", free: "free", impose: "you impose this side", change: "change side",
    yourTurn: "<b>Your turn!</b> Pick a Life card, then the side to place it on.", pickSide: "<b>Where to place it?</b> The icons on that side join your tableau.",
    thinking: n => `${esc(n)} is thinking…`, cost: "Cost", order: "Turn order",
    you: "You", scarabs: "Scarabs", guardians: "Guardians", tokens: "Ra tokens", hearts: "Hearts", diff: d => `Gap ${d}`,
    balanced: "Balanced", danger: "Ammit is watching!", noCard: "—", deck: n => `Deck: ${n}`,
    raTitle: "Ra grants you a bonus token", raSub: "Choose among the remaining tokens.", raHalf: "Where do you place this token?", raHalfSub: "Placed left or right of your Character, it only counts for that half of your display.",
    claimTitle: "Claim a Guardian?", claimSub: "Guardians of gates you have already passed can be claimed. Each scarab spent replaces one missing icon. A Guardian is worth 7 VP.",
    claimBtn: c => c ? `Claim (${c} scarab${c > 1 ? "s" : ""})` : "Claim (free)", pass: "Pass",
    endTitle: "The Judgment of Osiris", rank: "Rank", cardsPV: "Cards", balPV: "Balance", gPV: "Guardians", scPV: "Scarabs", raPV: "Ra", total: "Total",
    devoured: "Devoured by Ammit", eliminated: "eliminated from the game", winYou: "Your heart is lighter than the feather: you reach the Field of Reeds!", winOther: n => `${esc(n)} wins the game.`, shared: n => `Perfect tie (VP and hearts): shared victory between ${esc(n)}.`, nobody: "Ammit devoured everyone…",
    again: "Play again", close: "Close", tLife: "Life cards (53)", tGuard: "Guardians (8)", tChar: "Characters (5)", tRa: "Ra tokens (7)", tGods: "Gods (3)",
    statsT: "Your statistics", played: "Games", wins: "Wins", best: "Best score", avg: "Average", devs: "Devoured", reset: "Reset",
    anubis: "Anubis — gain 1 scarab per Anubis icon.", horus: "Horus — each pair of Horus: draw a card and play it (imposed side).", ra: "Ra — gain a bonus token (7 in the game).",
    g: { R1: "Agriculture", R2: "Craft", R3: "Knowledge", CN: "Black hearts", CB: "White hearts", D: "Gods", SIDE: "Cards on one side", SC: "Scarab symbols", BAL: "Balance", SC2: "1 scarab + 2 VP" },
    gNeed: (n, k) => `${n} × ${k} → 7 VP`, gPillar: "During its round, this Guardian sets what is counted on the pillar (turn order).",
    char: n => `Character ${n}`, cardN: n => `Life card #${n}`,
    log: {
      take: (p, e) => `${p} takes card #${e.id}${e.cost ? ` (${e.cost} scarab${e.cost > 1 ? "s" : ""})` : ""}${e.gain ? `, collects ${e.gain} scarab${e.gain > 1 ? "s" : ""}` : ""}${e.sideCost ? ` and pays ${e.sideCost} to switch direction` : ""}.`,
      place: (p, e) => `${p} ${e.horus ? "(Horus) " : ""}places card #${e.id} on the ${({ L: "left", R: "right", U: "top", D: "bottom" })[e.side]}.`,
      anubis: p => `${p} gains 1 scarab from Anubis.`, ra: (p, e) => `${p} receives the Ra token “${T.en.g[e.t] || e.t}”${D.HALF_TOKENS.includes(e.t) ? ` and places it on the ${e.h === "L" ? "left" : "right"}` : ""}.`, horus: p => `${p} completes a pair of Horus and draws a card!`,
      claim: (p, e) => `${p} claims the ${T.en.g[D.GUARDIANS[e.gid - 1].key]} Guardian (+7 VP).`, soul: (p, e) => `${p} places their soul on level ${e.lvl}.`, round: (p, e) => `— Round ${e.round} —`
    }
  },
  it: {
    tagline: "Guida la tua anima attraverso le porte del Duat, conquista il favore dei Guardiani… e presenta a Osiride un cuore in perfetto equilibrio.",
    meta: "Da 2 a 5 giocatori · 30 minuti · 8 round", yourName: "Il tuo nome", players: "Giocatori", start: "Entra nel Duat",
    rules: "Regole", cards: "I materiali", stats: "Statistiche", tuto: "🎓 Tutorial", train: "🧠 Allena l'IA", home: "Home", offer: "Carte Vita disponibili", journal: "Diario della partita",
    nhint: n => `Tu contro ${n - 1} avversari${n > 2 ? "" : "o"} · plancia lato ${n <= 3 ? "B" : "A"} · ${n <= 3 ? 4 : n === 4 ? 5 : 6} carte Vita visibili`,
    round: r => r <= 7 ? `Round ${r}/8` : "Round 8/8 · Giudizio", sideFree: "Direzione libera", orient: { L: "Le Colpe", R: "Le Virtù", U: "Le Realizzazioni", D: "La Spiritualità" }, impBy: n => `Direzione imposta da ${n}`, youChoose: "Sei il primo giocatore: scegli la direzione, sarà imposta agli altri.", waitFirst: n => `${n} sceglierà la direzione del round…`, imposedTag: "imposta", sideImp: s => `Direzione imposta: ${T.it[s]}`,
    L: "◀ Sinistra", R: "Destra ▶", U: "▲ Sopra", D: "▼ Sotto", subU: "senza punteggio", subD: "solo punteggio, su tutto il gioco", halfL: "Metà sinistra", halfR: "Metà destra", adj: "direzione adiacente", opp: "direzione opposta", free: "gratis", impose: "imponi questa direzione", change: "cambiare lato",
    yourTurn: "<b>Tocca a te!</b> Scegli una carta Vita, poi dove posarla.", pickSide: "<b>Dove posarla?</b> Le icone del lato scelto entrano nel tuo tableau.",
    thinking: n => `${esc(n)} sta riflettendo…`, cost: "Costo", order: "Ordine di turno",
    you: "Tu", scarabs: "Scarabei", guardians: "Guardiani", tokens: "Gettoni Ra", hearts: "Cuori", diff: d => `Scarto ${d}`,
    balanced: "In equilibrio", danger: "Ammit è in agguato!", noCard: "—", deck: n => `Mazzo: ${n}`,
    raTitle: "Ra ti concede un gettone bonus", raSub: "Scegli tra i gettoni rimasti.", raHalf: "Dove posi questo gettone?", raHalfSub: "Posato a sinistra o a destra del tuo Personaggio, conta solo per quella metà del tuo gioco.",
    claimTitle: "Reclamare un Guardiano?", claimSub: "Puoi reclamare i Guardiani delle porte già attraversate. Ogni Scarabeo speso sostituisce un'icona mancante. Un Guardiano vale 7 PV.",
    claimBtn: c => c ? `Reclama (${c} scarabe${c > 1 ? "i" : "o"})` : "Reclama (gratis)", pass: "Passa",
    endTitle: "Il Giudizio di Osiride", rank: "Pos.", cardsPV: "Carte", balPV: "Bilancia", gPV: "Guardiani", scPV: "Scarabei", raPV: "Ra", total: "Totale",
    devoured: "Divorato da Ammit", eliminated: "eliminato dalla partita", winYou: "Il tuo cuore è più leggero della piuma: raggiungi il Campo dei Giunchi!", winOther: n => `${esc(n)} vince la partita.`, shared: n => `Parità perfetta (PV e cuori): vittoria condivisa tra ${esc(n)}.`, nobody: "Ammit ha divorato tutti…",
    again: "Gioca ancora", close: "Chiudi", tLife: "Carte Vita (53)", tGuard: "Guardiani (8)", tChar: "Personaggi (5)", tRa: "Gettoni Ra (7)", tGods: "Dei (3)",
    statsT: "Le tue statistiche", played: "Partite", wins: "Vittorie", best: "Punteggio migliore", avg: "Media", devs: "Divorato", reset: "Cancella",
    anubis: "Anubi — guadagna 1 Scarabeo per icona Anubi.", horus: "Horus — ogni coppia di Horus: pesca una carta e giocala (direzione imposta).", ra: "Ra — guadagna un gettone bonus (7 in tutto).",
    g: { R1: "Agricoltura", R2: "Artigianato", R3: "Conoscenza", CN: "Cuori neri", CB: "Cuori bianchi", D: "Dei", SIDE: "Carte su uno stesso lato", SC: "Simboli Scarabeo", BAL: "Bilancia", SC2: "1 Scarabeo + 2 PV" },
    gNeed: (n, k) => `${n} × ${k} → 7 PV`, gPillar: "Durante il suo round, questo Guardiano stabilisce cosa si conta sul pilastro (ordine di turno).",
    char: n => `Personaggio ${n}`, cardN: n => `Carta Vita n.${n}`,
    log: {
      take: (p, e) => `${p} prende la carta n.${e.id}${e.cost ? ` (${e.cost} scarabe${e.cost > 1 ? "i" : "o"})` : ""}${e.gain ? `, raccoglie ${e.gain} scarabe${e.gain > 1 ? "i" : "o"}` : ""}${e.sideCost ? ` e paga ${e.sideCost} per cambiare direzione` : ""}.`,
      place: (p, e) => `${p} ${e.horus ? "(Horus) " : ""}posa la carta n.${e.id} ${({ L: "a sinistra", R: "a destra", U: "sopra", D: "sotto" })[e.side]}.`,
      anubis: p => `${p} guadagna 1 scarabeo grazie ad Anubi.`, ra: (p, e) => `${p} riceve il gettone Ra «${T.it.g[e.t] || e.t}»${D.HALF_TOKENS.includes(e.t) ? ` e lo posa ${e.h === "L" ? "a sinistra" : "a destra"}` : ""}.`, horus: p => `${p} completa una coppia di Horus e pesca una carta!`,
      claim: (p, e) => `${p} reclama il Guardiano ${T.it.g[D.GUARDIANS[e.gid - 1].key]} (+7 PV).`, soul: (p, e) => `${p} posa la sua anima al livello ${e.lvl}.`, round: (p, e) => `— Round ${e.round} —`
    }
  }
};
const FLAGS = {'fr': '<svg viewBox="0 0 3 2" aria-hidden="true"><rect width="1" height="2" fill="#0055A4"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#EF4135"/></svg>', 'it': '<svg viewBox="0 0 3 2" aria-hidden="true"><rect width="1" height="2" fill="#009246"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#CE2B37"/></svg>', 'en': '<svg viewBox="0 0 60 30" aria-hidden="true"><path d="M0,0v30h60V0z" fill="#012169"/><path d="M0,0L60,30M60,0L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0L60,30M60,0L0,30" stroke="#C8102E" stroke-width="2.5"/><path d="M30,0v30M0,15h60" stroke="#fff" stroke-width="10"/><path d="M30,0v30M0,15h60" stroke="#C8102E" stroke-width="6"/></svg>'};
let lang = store.get("lang", "fr");
if (!T[lang]) lang = "fr";
const t = (k, ...a) => { const v = T[lang][k]; return typeof v === "function" ? v(...a) : v; };

/* ---------- icônes ---------- */
const IMG = { R1: "iR1", R2: "iR2", R3: "iR3", CN: "iCN", CB: "iCB", D1: "iD1", D2: "iD2", D3: "iD3", D: "iGODS", SIDE: "iSIDE", PV: "iPV" };
function ic(k, cls = "ic") {
  if (k === "SC") return `<img class="${cls}" src="assets/scarab.png" alt="Scarabée">`;
  if (k === "BAL") return `<img class="${cls}" src="assets/balance.png" alt="Balance">`;
  if (k === "R") return `<img class="${cls}" src="assets/iANY.png" alt="?" title="${esc(({ fr: "N'importe quelle ressource", en: "Any resource", it: "Qualsiasi risorsa" })[lang])}">`;
  return `<img class="${cls}" src="assets/${IMG[k]}.png" alt="${esc(T[lang].g[k] || k)}" title="${esc(T[lang].g[k] || k)}">`;
}
function effHTML(C) {
  if (!C) return "";
  const bal = C.bal ? `<span class="par">(</span>${ic("BAL")}<span class="par">)</span>` : "";
  if (C.t === "bal") return `<span class="par">(</span>${ic("BAL")}<span class="par">)</span>`;
  if (C.t === "pv") return `${C.v}${ic("PV")}${bal}`;
  const icons = C.icon === "R" ? ic("R") : Array(C.n).fill(ic(C.icon)).join("");
  return `${C.v}${ic("PV")}<span class="par">×</span>${icons}${bal}`;
}
function cardHTML(id, o = {}) {
  const c = D.card(id), ttl = TITLES[id] || "";
  const art = HAS_ART(id) ? `<img class="art" src="assets/a${id}.jpg" alt="" loading="lazy">` : `<img class="art ph" src="assets/medal.png" alt="">`;
  const dim = ({ L: "dimR", R: "dimL", U: "dimE", D: "dimT" })[o.side] || "";
  const scs = o.sc ? `<div class="scs">${Array(o.sc).fill('<img src="assets/scarab.png" alt="">').join("")}</div>` : "";
  return `<div class="lc ${dim}" title="${esc(ttl || t("cardN", id))}">${art}<div class="ttl">${esc(ttl)}</div>
    <div class="ban l">${c.L.map(k => ic(k)).join("")}</div><div class="ban r">${c.R.map(k => ic(k)).join("")}</div>
    <div class="eff">${effHTML(c.C)}</div><div class="num">${id}</div>${scs}</div>`;
}
function charHTML(p) {
  const ch = D.charOf(p);
  return `<div class="charT"><div class="face"><img class="fig" src="assets/c${ch.id}.jpg" alt="">
    <div class="cb l">${ch.L.map(k => ic(k)).join("")}</div><div class="cb r">${ch.R.map(k => ic(k)).join("")}</div></div><small>${t("char", ch.id)}</small></div>`;
}

function tableauHTML(p) {
  const g = s => p.t[s].map(id => cardHTML(id, { side: s })).join("");
  return `<div class="cross"><div class="side l">${g("L")}</div><div class="mid"><div class="side u">${g("U")}</div>${charHTML(p)}<div class="side d">${g("D")}</div></div><div class="side r">${g("R")}</div></div>`;
}
function halvesHTML(p) {
  const row = h => { const c = D.halfCounts(p, h); return `<div class="half"><b>${t(h === "L" ? "halfL" : "halfR")}</b>${["R1", "R2", "R3", "CN", "CB", "D1", "D2", "D3"].filter(k => c[k]).map(k => `${ic(k)}${c[k]}`).join(" ") || "—"}</div>`; };
  return `<div class="halves">${row("L")}${row("R")}</div>`;
}
function compassHTML() {
  const first = G.players[G.order[0]], s = G.side;
  const arrow = d => `<span class="ca c${d} ${s === d ? "on" : s ? "off" : ""}">${({ L: "◀", R: "▶", U: "▲", D: "▼" })[d]}</span>`;
  const rose = `<div class="rose">${arrow("U")}${arrow("L")}<span class="cc">${ba(first, "cba")}</span>${arrow("R")}${arrow("D")}</div>`;
  let txt;
  if (s) txt = `<small>${t("impBy", esc(first.name))}</small><b>${t(s)}</b><i>${T[lang].orient[s]}</i>`;
  else if (!first.bot) txt = `<b class="choose">${t("youChoose")}</b>`;
  else txt = `<small>${t("waitFirst", esc(first.name))}</small>`;
  return `${rose}<div class="ctxt">${txt}</div>`;
}
/* ---------- état ---------- */
let G = null, gameId = 0, ui = { sel: null, resolve: null, modalResolve: null };
let nPlayers = store.get("n", 4); window.__nPlayers = nPlayers;

/* ---------- accueil ---------- */
function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-t]").forEach(el => el.textContent = t(el.dataset.t));
  document.querySelectorAll(".lang").forEach(box => box.innerHTML = ["fr", "en", "it"].map(l => `<button type="button" data-l="${l}" aria-pressed="${l === lang}" title="${({ fr: "Français", en: "English", it: "Italiano" })[l]}">${FLAGS[l]}<span>${l.toUpperCase()}</span></button>`).join(""));
  $("#nhint").textContent = t("nhint", nPlayers);
  if (G && !$("#game").hidden) render();
}
document.addEventListener("click", e => { const b = e.target.closest(".lang button"); if (b) { lang = b.dataset.l; store.set("lang", lang); applyLang(); } });
$("#friezeL").innerHTML = [1, 2, 3, 4].map(i => `<img src="assets/g${i}a.jpg" alt="">`).join("");
$("#friezeR").innerHTML = [5, 6, 7, 8].map(i => `<img src="assets/g${i}a.jpg" alt="">`).join("");
$("#nseg").innerHTML = [2, 3, 4, 5].map(n => `<button type="button" data-n="${n}" aria-pressed="${n === nPlayers}">${n}</button>`).join("");
$("#nseg").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; nPlayers = +b.dataset.n; window.__nPlayers = nPlayers; store.set("n", nPlayers); $("#nseg").querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b)); $("#nhint").textContent = t("nhint", nPlayers); });
$("#pname").value = store.get("name", "");
$("#startBtn").onclick = () => startGame();
$("#homeBtn").onclick = () => { gameId++; closeModal(); $("#game").hidden = true; $("#home").hidden = false; window.scrollTo(0, 0); };
$("#rulesBtn").onclick = $("#rulesBtn2").onclick = showRules;
$("#catBtn").onclick = () => showCatalog("life");
$("#statsBtn").onclick = () => window.DuatStats ? DuatStats.open() : showStats();
$("#trainBtn").onclick = () => window.DuatStats && DuatStats.openTrain();

function startGame(opts = {}) {
  const nPlayers = opts.n || window.__nPlayers;
  const name = $("#pname").value.trim() || t("you");
  store.set("name", $("#pname").value.trim());
  const bots = BOTS.slice().sort(() => Math.random() - .5);
  const players = [{ name, bot: false, color: COLORS[0] }];
  for (let i = 1; i < nPlayers; i++) players.push({ name: bots[i - 1], bot: true, color: COLORS[i] });
  G = D.newGame({ players, seed: opts.seed || (Math.random() * 1e9) | 0 });
  G.tuto = !!opts.tuto; if (window.DuatTuto) DuatTuto.reset(G.tuto);
  ui = { sel: null, resolve: null };
  $("#home").hidden = true; $("#game").hidden = false; window.scrollTo(0, 0);
  render(); loop(++gameId);
}

/* ---------- boucle ---------- */
async function loop(id) {
  while (G && !G.over && id === gameId) {
    const p = D.curPlayer(G);
    render();
    if (p.bot) {
      await sleep(900);
      while (window.DuatTuto && DuatTuto.blocking() && id === gameId) await sleep(200);
      if (id !== gameId) return;
      const ch = D.botChoose(G, p);
      await D.playTurn(G, ch, D.botHooks);
    } else {
      const ch = await new Promise(res => { ui.resolve = res; ui.sel = null; render(); });
      if (id !== gameId) return;
      ui.resolve = null; ui.sel = null;
      await D.playTurn(G, ch, humanHooks);
    }
  }
  if (G && G.over && id === gameId) { render(); await sleep(500); showEnd(); }
}
const humanHooks = {
  ra: async (G, p) => {
    const k = await openChoice(`<h2>${t("raTitle")}</h2><p>${t("raSub")}</p><div class="choices">${G.raPool.map(k => `<button type="button" data-v="${k}"><img src="assets/${raImg(k)}.png" alt="">${esc(T[lang].g[k])}</button>`).join("")}</div>`);
    if (!D.HALF_TOKENS.includes(k)) return { k, h: "L" };
    const h = await openChoice(`<h2>${t("raHalf")}</h2><p>${t("raHalfSub")}</p><div class="choices">${["L", "R"].map(h => { const c = D.halfCounts(p, h); return `<button type="button" data-v="${h}"><img src="assets/${raImg(k)}.png" alt="">${t(h)}<small>${t(h === "L" ? "halfL" : "halfR")} : ${ic(k)}${c[k]} → ${c[k] + 1}</small></button>`; }).join("")}</div>`);
    return { k, h };
  },
  claim: (G, p, list) => openChoice(`<h2>${t("claimTitle")}</h2><p>${t("claimSub")}</p><div class="choices">${list.map((c, i) => `<button type="button" class="gch" data-v="${i}"><img src="assets/g${c.gid}b.jpg" alt="">${t("claimBtn", c.cost)}</button>`).join("")}</div><div class="choices"><button type="button" data-v="pass">${t("pass")}</button></div>`)
    .then(v => v === "pass" ? null : list[+v])
};
const raImg = k => ({ R1: "tR1", R2: "tR2", R3: "tR3", CN: "tCN", CB: "tCB", BAL: "balance", SC2: "tSC2" }[k]);

function openChoice(html) {
  render();
  return new Promise(res => {
    $("#sheet").className = "sheet"; $("#sheet").innerHTML = html; $("#modal").hidden = false;
    $("#sheet").onclick = e => { const b = e.target.closest("button[data-v]"); if (b) { closeModal(); res(b.dataset.v); } };
    const f = $("#sheet button"); if (f) f.focus();
  });
}
function openSheet(html, cls) { $("#sheet").className = "sheet " + (cls || ""); $("#sheet").innerHTML = html; $("#modal").hidden = false; $("#sheet").onclick = e => { if (e.target.closest("[data-close]")) closeModal(); }; }
function closeModal() { $("#modal").hidden = true; $("#sheet").innerHTML = ""; }
$("#modal").addEventListener("click", e => { if (e.target.id === "modal" && $("#sheet [data-close]")) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#modal").hidden && $("#sheet [data-close]")) closeModal(); });

/* ---------- rendu ---------- */
const PX = x => (x / 2576 * 100) + "%", PY = y => (y / 515 * 100) + "%";
function soulPos(r, lvl) {
  if (r === 0) return [37, 425];
  if (r === 8) return [2510, [470, 412, 364, 315][lvl]];
  return [332 + 320 * (r - 1), lvl === 0 ? 478 : 425 - (lvl - 1) * 52.5];
}
function renderBoard() {
  let h = "";
  G.gates.forEach((gid, i) => {
    const cur = G.round === i + 1, rev = i < G.revealed, own = G.claimed[gid];
    if (!rev) return;
    const taken = own !== undefined;
    h += `<div class="gslot ${cur ? "cur" : ""} ${taken ? "taken" : ""}" style="left:${PX(85 + 320 * i)};top:${PY(45)};width:${PX(165)};height:${PY(415)}">
      <img src="assets/g${gid}a.jpg" alt=""><button type="button" data-g="${gid}" aria-label="Gardien"></button>${taken ? ba(G.players[own], "gown") : ""}</div>`;
  });
  // âmes : dernière position de chaque joueur
  const pos = {};
  G.pillars.forEach((pil, r) => Object.entries(pil).forEach(([lvl, st]) => st.forEach((pi, idx) => pos[pi] = { r, lvl: +lvl, idx, len: st.length })));
  Object.entries(pos).forEach(([pi, o]) => {
    const [x, y] = soulPos(o.r, o.lvl), dx = (o.idx - (o.len - 1) / 2) * 15, p = G.players[pi];
    h += `<img class="soul ${p.bot ? "" : "mine"}" src="assets/ba_${BA[p.color]}.png" alt="" title="${esc(p.name)}" style="left:${PX(x + dx)};top:${PY(y - o.idx * 4)};z-index:${10 + o.idx}">`;
  });
  $("#boardLayer").innerHTML = h;
}
$("#boardLayer").addEventListener("click", e => { const b = e.target.closest("[data-g]"); if (b) showGuardian(+b.dataset.g); });

function chipsHTML(p, big) {
  const c = D.counts(p);
  const hearts = c.diff >= D.DEVOUR ? "warn" : c.diff === 0 ? "ok" : "";
  const parts = ["R1", "R2", "R3"].map(k => `<span class="chip">${ic(k)}${c[k]}</span>`);
  parts.push(`<span class="chip ${hearts}">${ic("CN")}${c.CN} ${ic("CB")}${c.CB} · ${c.diff === 0 ? t("balanced") : t("diff", c.diff)}${c.diff >= D.DEVOUR ? " · " + t("danger") : ""}</span>`);
  parts.push(`<span class="chip">${ic("D1")}${c.D1} ${ic("D2")}${c.D2} ${ic("D3")}${c.D3}</span>`);
  parts.push(`<span class="chip" title="Symboles">${ic("SC")}×${c.SC}</span>`);
  if (c.BAL) parts.push(`<span class="chip">${ic("BAL")}${c.BAL}</span>`);
  parts.push(`<span class="chip" style="background:var(--turq);color:#fff">${ic("SC")}${p.sc} ${big ? t("scarabs").toLowerCase() : ""}</span>`);
  return `<div class="chips">${parts.join("")}</div>`;
}
function render() {
  if (!G) return;
  const me = G.players[0], cur = D.curPlayer(G), myTurn = !G.over && !cur.bot && ui.resolve;
  const bimg = G.n <= 3 ? "assets/board23.jpg" : "assets/board45.jpg"; if (!$("#board>img").src.endsWith(bimg)) $("#board>img").src = bimg;
  $("#roundTxt").textContent = t("round", Math.min(G.round, 8));
  $("#sideTxt").textContent = G.side ? t("sideImp", G.side) : t("sideFree");
  renderBoard();
  // coach
  let coach = "";
  if (G.over) coach = "";
  else if (myTurn) coach = ui.sel === null ? t("yourTurn") : t("pickSide");
  else coach = cur.bot ? t("thinking", cur.name) : t("yourTurn");
  if (!G.over && G.round <= 7) { const g = D.GUARDIANS[G.gates[G.round - 1] - 1]; coach += ` <span style="margin-left:auto;display:inline-flex;gap:6px;align-items:center">${({ fr: "Pilier", en: "Pillar", it: "Pilastro" })[lang]} : ${ic(g.key)} · ${t("order")} : ${G.order.map(pi => `${ba(G.players[pi])}`).join("")}</span>`; }
  $("#coach").innerHTML = coach;
  $("#gods").innerHTML = [["D1", "anubis"], ["D2", "horus"], ["D3", "ra"]].map(([k, n]) => `<span class="god">${ic(k)}${esc(t(n))}</span>`).join("");
  // offre
  const opts = myTurn ? D.options(G, me) : [];
  $("#offer").innerHTML = G.offer.map((o, slot) => {
    const can = opts.some(x => x.slot === slot);
    return `<div class="slot ${o ? "" : "empty"} ${ui.sel === slot ? "sel" : ""} ${myTurn && o && !can ? "no" : ""}">
      <span class="cost">${G.costs[slot] ? Array(G.costs[slot]).fill(ic("SC")).join("") : t("free")}</span>
      ${o ? `<button type="button" class="pick" data-slot="${slot}" ${myTurn && can ? "" : "disabled"} aria-label="${esc(t("cardN", o.card))}">${cardHTML(o.card, { sc: o.sc })}</button>` : `<div class="lc"></div>`}</div>`;
  }).join("") + `<div class="deck"><img src="assets/lback.jpg" alt="">${t("deck", G.deck.length)}</div>`;
  // actions
  let act = "";
  if (myTurn && ui.sel !== null) {
    const id = G.offer[ui.sel].card, c = D.card(id);
    D.SIDES.forEach(side => {
      const o = opts.find(x => x.slot === ui.sel && x.side === side);
      const sc = D.sideCost(G, side), first = G.turn === 0 && G.side === null;
      const note = o && o.free ? t("free") : first ? t("impose") : sc ? `+${sc} ${ic("SC")} ${t(sc === 2 ? "opp" : "adj")}` : t("free");
      act += `<button type="button" class="choice ${o ? "primary" : ""} ${G.side === side ? "imposed" : ""}" data-side="${side}" ${o ? "" : "disabled"}>${G.side === side ? `<em class="imptag">★ ${t("imposedTag")}</em>` : ""}<span>${t(side)} ${D.visIcons(id, side).map(k => ic(k)).join("")}${side !== "U" && c.C ? ` · ${effHTML(c.C)}` : ""}</span><small>${side === "U" ? t("subU") + " · " : side === "D" ? t("subD") + " · " : ""}${note}</small></button>`;
    });
    act += `<button type="button" class="ghost" data-cancel>✕</button>`;
  }
  $("#action").innerHTML = act;
  $("#compass").innerHTML = G.over ? "" : compassHTML();
  // moi
  $("#me").innerHTML = `<div class="me-head"><h2>${ba(me)} ${esc(me.name)}</h2>${chipsHTML(me, true)}</div>
    ${halvesHTML(me)}<div class="tableau">${tableauHTML(me)}</div>
    <div class="mine-extra">${me.guardians.length ? `<div class="trophies">${me.guardians.map(g => `<img src="assets/g${g}b.jpg" alt="">`).join("")}</div>` : ""}
    ${me.tokens.length ? `<div class="toks">${me.tokens.map(o => `<span class="tok"><img src="assets/${raImg(o.k)}.png" alt="${esc(T[lang].g[o.k])}" title="${esc(T[lang].g[o.k])}">${D.HALF_TOKENS.includes(o.k) ? (o.h === "L" ? "◀" : "▶") : ""}</span>`).join("")}</div>` : ""}</div>`;
  // adversaires
  $("#opps").innerHTML = G.players.slice(1).map(p => `<div class="opp"><h3>${ba(p)}${esc(p.name)} <small style="font-family:inherit;font-size:13px;color:var(--mute)">${t("char", p.char)} · ${p.guardians.length} ${t("guardians").toLowerCase()}</small></h3>
    ${chipsHTML(p)}<div class="mini">${D.SIDES.map(s => p.t[s].length ? `<span class="mtag">${t(s)}</span>${p.t[s].map(id => cardHTML(id, { side: s })).join("")}` : "").join("")}</div></div>`).join("");
  // journal
  const L = T[lang].log;
  if (window.DuatTuto) setTimeout(() => DuatTuto.onRender(), 0);
  $("#log").innerHTML = G.log.slice().reverse().slice(0, 120).map(e => { const p = e.p !== undefined ? `<b style="color:${G.players[e.p].color}">${esc(G.players[e.p].name)}</b>` : ""; return L[e.k] ? `<li>${L[e.k](p, e)}</li>` : ""; }).join("");
}
$("#offer").addEventListener("click", e => { const b = e.target.closest("[data-slot]"); if (!b || !ui.resolve) return; ui.sel = +b.dataset.slot; render(); $("#action button")?.focus(); });
$("#action").addEventListener("click", e => {
  if (e.target.closest("[data-cancel]")) { ui.sel = null; render(); return; }
  const b = e.target.closest("[data-side]"); if (!b || !ui.resolve || ui.sel === null) return;
  const r = ui.resolve; r({ slot: ui.sel, side: b.dataset.side });
});

/* ---------- fin ---------- */
function showEnd() {
  const R = G.result, me = G.players[0];
  const stats = store.get("stats", { played: 0, wins: 0, best: 0, total: 0, dev: 0 });
  const mine = R.rows[0];
  stats.played++; stats.total += mine.total; if (R.winners.includes(0)) stats.wins++; if (mine.devoured) stats.dev++; else stats.best = Math.max(stats.best, mine.total);
  store.set("stats", stats);
  if (window.DuatStats) DuatStats.add(D.summary(G, false));
  const head = R.winner === null ? t("nobody") : R.winners.length > 1 ? t("shared", R.winners.map(i => G.players[i].name).join(" & ")) : R.winner === 0 ? t("winYou") : t("winOther", G.players[R.winner].name);
  openSheet(`<div class="sheet-head"><h2>${t("endTitle")}</h2><button data-close>${t("close")}</button></div>
    <p style="font-size:19px">${head}</p>
    <div class="scroll"><table class="score"><thead><tr><th>${t("rank")}</th><th>${ic("CN")}/${ic("CB")}</th><th>${t("cardsPV")}</th><th>${t("balPV")}</th><th>${t("gPV")}</th><th>${t("scPV")}</th><th>${t("raPV")}</th><th>${t("total")}</th></tr></thead><tbody>
    ${R.ranked.map((r, i) => `<tr class="${R.winners.includes(r.p) ? "win" : ""} ${r.devoured ? "dev" : ""}"><td>${i + 1}. ${ba(G.players[r.p])} ${esc(G.players[r.p].name)}${r.devoured ? ` <span class="ammit">· ${t("devoured")}</span>` : ""}</td><td>${r.diff === 0 ? "⚖" : r.diff}</td>${r.devoured ? `<td colspan="6" style="text-align:center">${t("eliminated")}</td>` : `<td>${r.cards}</td><td>${r.bal}</td><td>${r.guard}</td><td>${r.scar}</td><td>${r.ra}</td><td><b>${r.total}</b></td>`}</tr>`).join("")}
    </tbody></table></div>
    <p class="note">${lang === "fr" ? "Écart de cœurs : 0 = chaque Balance ⚖ visible rapporte 5 PV · 1–2 = les Balances ne rapportent rien · 3+ = dévoré par Ammout." : lang === "it" ? "Scarto dei cuori: 0 = ogni Bilancia ⚖ visibile vale 5 PV · 1–2 = le Bilance non valgono nulla · 3+ = divorato da Ammit." : "Heart gap: 0 = each visible Balance ⚖ is worth 5 VP · 1–2 = Balances score nothing · 3+ = devoured by Ammit."}</p>
    <div class="choices"><button class="primary" id="againBtn">${t("again")}</button><button id="homeBtn2">${t("home")}</button></div>`);
  $("#againBtn").onclick = () => { closeModal(); startGame(); };
  $("#homeBtn2").onclick = () => { closeModal(); $("#homeBtn").click(); };
}

/* ---------- règles, catalogue, stats ---------- */
function showGuardian(gid) {
  const g = D.GUARDIANS[gid - 1], k = T[lang].g[g.key];
  openSheet(`<div class="sheet-head"><h2>${esc(k)}</h2><button data-close>${t("close")}</button></div>
    <div class="gpair" style="justify-content:center"><img src="assets/g${gid}a.jpg" alt=""><img src="assets/g${gid}b.jpg" alt=""></div>
    <p>${ic(g.key)} ${t("gNeed", g.need, esc(k))}</p><p class="note">${t("gPillar")}</p>`);
}
function showRules() {
  const fr = lang === "fr";
  openSheet(`<div class="sheet-head"><h2>${t("rules")}</h2><button data-close>${t("close")}</button></div><div class="rules">${lang === "it" ? `
  <p><b>Scopo:</b> ottenere più PV dopo 8 round… senza essere divorati da Ammit.</p>
  <h3>Preparazione</h3><ul><li>7 degli 8 Guardiani vanno sulle porte; i primi 2 sono rivelati.</li><li>Carte Vita visibili: 4 con 2–3 giocatori (costi 0, 0, 1, 2), 5 con 4 giocatori (0, 0, 1, 1, 2), 6 con 5 giocatori (0, 0, 1, 1, 2, 2).</li><li>Ognuno riceve un Personaggio (contano entrambi i cartigli) e 1 Scarabeo. Primo ordine di turno: numero di Personaggio crescente.</li></ul>
  <h3>Il tuo turno</h3><ol><li><b>Prendi una carta Vita</b> e paga il suo costo in Scarabei (raccogli gli Scarabei posati sopra).</li><li><b>Posala</b> intorno al tuo Personaggio, infilandola sotto la carta precedente:<ul><li>◀ <b>Sinistra</b>: tieni il lato sinistro e il punteggio (il cartiglio destro è nascosto).</li><li><b>Destra</b> ▶: tieni il lato destro e il punteggio.</li><li>▲ <b>Sopra</b>: tieni entrambi i cartigli, il punteggio è nascosto.</li><li>▼ <b>Sotto</b>: tieni solo il punteggio (cartigli, scarabei e dei nascosti).</li></ul>Il primo giocatore del round sceglie liberamente e impone la sua direzione. Direzione adiacente: 1 Scarabeo; direzione opposta: 2 Scarabei.</li><li><b>Punteggio per metà:</b> un punteggio a sinistra conta solo la metà sinistra del tuo gioco (cartiglio sinistro del Personaggio, carte a sinistra, cartigli sinistri delle carte sopra). Lo stesso a destra. Un punteggio posato <b>sotto</b> conta <b>tutto il tuo gioco</b> (entrambe le metà).</li><li><b>Icone speciali:</b> ${ic("SC")} dà 1 Scarabeo · ${ic("D1")} Anubi: +1 Scarabeo · ${ic("D2")} Horus: ogni coppia, pesca e gioca una carta (direzione imposta) · ${ic("D3")} Ra: prendi un gettone bonus.</li><li><b>Reclama</b> (facoltativo) il Guardiano di una porta già attraversata: servono le icone richieste, ogni Scarabeo speso sostituisce un'icona mancante. +7 PV.</li><li><b>Posa la tua anima</b> sul pilastro del round, al livello pari al numero di icone del Guardiano in corso (da 0 a 7+). In caso di parità mettiti sopra: giocherai prima.</li></ol>
  <h3>Il fiume</h3><p>Appena un giocatore prende una carta, le carte alla sua destra scivolano a sinistra: il loro costo diminuisce.</p><h3>Fine del round</h3><p>La carta rimasta riceve 1 Scarabeo, poi si completano gli spazi (4 con 2–3 giocatori, 5 con 4 giocatori, 6 con 5 giocatori). Si rivela un Guardiano. L'ordine seguente si legge sul pilastro, dall'alto in basso.</p>
  <h3>Giudizio di Osiride</h3><p>Confronta ${ic("CN")} e ${ic("CB")}. Scarto di 3+: divorato, perdi. Scarto 0: ogni ${ic("BAL")} visibile (anche quella accanto a un punteggio) vale 5 PV in più. Scarto 1–2: le Bilance non valgono nulla. I punteggi delle carte contano sempre.</p><p>Punteggio = effetti delle carte + Guardiani (7) + Bilancia + gettoni Ra + 2 PV per Scarabeo rimasto. Parità: vince chi ha più cuori (neri + bianchi); altrimenti vittoria condivisa.</p>
  <h3>Ipotesi di questa versione</h3><ul class="note"><li>Un gettone Ra (risorsa o cuore) si posa a sinistra o a destra del Personaggio e conta solo per quella metà; Bilancia e «1 Scarabeo + 2 PV» non dipendono da un lato.</li><li>I simboli ${ic("SC")} delle carte danno anche un gettone Scarabeo.</li><li>Si possono reclamare solo i Guardiani delle porte già attraversate; ogni Guardiano ha un solo proprietario.</li><li>Al round 8, l'anima va sul pilastro del Giudizio secondo lo scarto dei cuori.</li><li>Il retro delle tessere Dio e «Scavare il fiume» non sono ancora inclusi.</li></ul>
` : fr ? `
  <p><b>But :</b> marquer le plus de PV après 8 manches… sans être dévoré par Ammout.</p>
  <h3>Mise en place</h3><ul><li>7 des 8 Gardiens sont placés sur les portes ; les 2 premiers sont révélés.</li><li>Cartes Vie visibles : 4 à 2–3 joueurs (coûts 0, 0, 1, 2), 5 à 4 joueurs (0, 0, 1, 1, 2), 6 à 5 joueurs (0, 0, 1, 1, 2, 2).</li><li>Chacun reçoit un Personnage (ses deux bandeaux comptent) et 1 Scarabée. Premier ordre du tour : numéro de Personnage croissant.</li></ul>
  <h3>Votre tour</h3><ol><li><b>Prenez une carte Vie</b> et payez son coût en Scarabées (vous ramassez les Scarabées posés dessus).</li><li><b>Posez-la</b> autour de votre Personnage, en glissant sous la carte précédente :<ul><li>◀ <b>Gauche</b> : on garde le côté gauche et le scoring (le cartouche droit est caché).</li><li><b>Droite</b> ▶ : on garde le côté droit et le scoring.</li><li>▲ <b>Haut</b> : on garde les deux cartouches, le scoring est caché.</li><li>▼ <b>Bas</b> : on ne garde que le scoring (cartouches, scarabées et dieux cachés).</li></ul>Le premier joueur de la manche choisit librement et impose sa direction. Direction adjacente : 1 Scarabée ; direction opposée : 2 Scarabées.</li><li><b>Scoring par moitié :</b> un scoring à gauche ne compte que la moitié gauche de votre jeu (cartouche gauche du Personnage, cartes de gauche, cartouches gauches des cartes du haut). Idem à droite. Un scoring posé <b>en bas</b> compte <b>tout votre jeu</b> (les deux moitiés).</li><li><b>Icônes spéciales :</b> ${ic("SC")} donne 1 Scarabée · ${ic("D1")} Anubis : +1 Scarabée · ${ic("D2")} Horus : chaque paire, piochez et jouez une carte (côté imposé) · ${ic("D3")} Râ : prenez un jeton bonus.</li><li><b>Revendiquez</b> (facultatif) le Gardien d'une porte déjà franchie : il faut le nombre d'icônes demandé, chaque Scarabée dépensé remplace une icône manquante. +7 PV.</li><li><b>Placez votre âme</b> sur le pilier de la manche, au niveau égal à votre nombre d'icônes du Gardien en cours (0 à 7+). En cas d'égalité, posez-vous dessus : vous jouerez avant.</li></ol>
  <h3>La rivière</h3><p>Dès qu'un joueur a pris une carte, les cartes situées à sa droite glissent vers la gauche : leur coût diminue.</p><h3>Fin de manche</h3><p>La carte restante reçoit 1 Scarabée, puis on recomplète les emplacements (4 à 2–3 joueurs, 5 à 4 joueurs, 6 à 5 joueurs). On révèle un Gardien. L'ordre suivant se lit sur le pilier, de haut en bas.</p>
  <h3>Jugement d'Osiris</h3><p>Comparez ${ic("CN")} et ${ic("CB")}. Écart de 3+ : dévoré, vous perdez. Écart de 0 : chaque ${ic("BAL")} visible (y compris celle à côté d'un scoring) rapporte 5 PV de plus. Écart de 1–2 : les Balances ne rapportent rien. Les scorings des cartes comptent toujours.</p><p>Score = effets des cartes + Gardiens (7) + Balance + jetons Râ + 2 PV par Scarabée restant. Égalité : le plus de cœurs (noirs + blancs) l'emporte ; sinon, victoire partagée.</p>
  <h3>Hypothèses de cette version</h3><ul class="note"><li>Un jeton Râ (ressource ou cœur) se pose à gauche ou à droite du Personnage et ne compte que pour cette moitié ; Balance et « 1 Scarabée + 2 PV » ne dépendent pas d\u2019un côté.</li><li>Les symboles ${ic("SC")} des cartes donnent aussi un jeton Scarabée.</li><li>Seuls les Gardiens des portes déjà franchies sont revendicables ; un Gardien n'a qu'un propriétaire.</li><li>Au tour 8, l'âme va sur le pilier du Jugement selon l'écart des cœurs.</li><li>Le verso des tuiles Dieu et « Creuser la rivière » ne sont pas encore intégrés.</li></ul>` : `
  <p><b>Goal:</b> score the most VP after 8 rounds… without being devoured by Ammit.</p>
  <h3>Setup</h3><ul><li>7 of the 8 Guardians go on the gates; the first 2 are revealed.</li><li>Life cards on display: 4 with 2–3 players (costs 0, 0, 1, 2), 5 with 4 players (0, 0, 1, 1, 2), 6 with 5 players (0, 0, 1, 1, 2, 2).</li><li>Everyone gets a Character (both banners count) and 1 scarab. First turn order: ascending Character number.</li></ul>
  <h3>Your turn</h3><ol><li><b>Take a Life card</b> and pay its cost in scarabs (collect any scarabs on it).</li><li><b>Place it</b> around your Character, tucked under the previous card:<ul><li>◀ <b>Left</b>: keep the left side and the scoring (right cartouche hidden).</li><li><b>Right</b> ▶: keep the right side and the scoring.</li><li>▲ <b>Top</b>: keep both cartouches, scoring hidden.</li><li>▼ <b>Bottom</b>: keep only the scoring (cartouches, scarabs and gods hidden).</li></ul>The round's first player chooses freely and imposes that direction. Adjacent direction: 1 scarab; opposite direction: 2 scarabs.</li><li><b>Scoring by half:</b> a scoring on the left only counts the left half of your display (Character's left cartouche, left cards, left cartouches of top cards). Same on the right. A scoring placed <b>at the bottom</b> counts <b>your whole display</b> (both halves).</li><li><b>Special icons:</b> ${ic("SC")} gives 1 scarab · ${ic("D1")} Anubis: +1 scarab · ${ic("D2")} Horus: each pair, draw and play a card (imposed side) · ${ic("D3")} Ra: take a bonus token.</li><li><b>Claim</b> (optional) the Guardian of a gate already passed: you need its icon count, each scarab spent replaces a missing icon. +7 VP.</li><li><b>Place your soul</b> on this round's pillar at the level equal to your icons of the current Guardian (0 to 7+). On a tie, stack on top: you'll play first.</li></ol>
  <h3>The river</h3><p>As soon as a player takes a card, the cards to its right slide left: their cost goes down.</p><h3>End of round</h3><p>The leftover card gets 1 scarab, then refill the slots (4 with 2–3 players, 5 with 4 players, 6 with 5 players). Reveal a Guardian. Next order is read on the pillar, top to bottom.</p>
  <h3>Judgment of Osiris</h3><p>Compare ${ic("CN")} and ${ic("CB")}. Gap of 3+: devoured, you lose. Gap of 0: each visible ${ic("BAL")} (including one next to a scoring) is worth 5 more VP. Gap 1–2: Balances score nothing. Card scorings always count.</p><p>Score = card effects + Guardians (7) + Balance + Ra tokens + 2 VP per remaining scarab. Tie: most hearts (black + white) wins; otherwise a shared victory.</p>
  <h3>Assumptions in this version</h3><ul class="note"><li>A Ra token (resource or heart) is placed left or right of the Character and only counts for that half; Balance and “1 scarab + 2 VP” do not depend on a side.</li><li>${ic("SC")} symbols on cards also give a scarab token.</li><li>Only Guardians of passed gates can be claimed; one owner each.</li><li>In round 8 the soul goes on the Judgment pillar by heart gap.</li><li>God tile backs and “Dig the river” are not yet included.</li></ul>`}</div>`);
}
function showCatalog(tab) {
  const tabs = [["life", "tLife"], ["guard", "tGuard"], ["char", "tChar"], ["ra", "tRa"], ["gods", "tGods"]];
  let body = "";
  if (tab === "life") body = `<div class="grid">${D.CARDS.map(c => cardHTML(c.id)).join("")}</div>`;
  if (tab === "guard") body = `<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">${D.GUARDIANS.map(g => `<div style="display:grid;gap:6px;justify-items:center"><div class="gpair"><img src="assets/g${g.id}a.jpg" alt=""><img src="assets/g${g.id}b.jpg" alt=""></div><b>${esc(T[lang].g[g.key])}</b><span>${t("gNeed", g.need, ic(g.key))}</span></div>`).join("")}</div>`;
  if (tab === "char") body = `<div class="grid">${D.CHARS.map(c => charHTML({ char: c.id })).join("")}</div>`;
  if (tab === "ra") body = `<div class="grid">${D.RA_TOKENS.map(k => `<div class="rtok"><img src="assets/${raImg(k)}.png" alt="">${esc(T[lang].g[k])}</div>`).join("")}</div>`;
  if (tab === "gods") body = `<div style="display:grid;gap:10px">${[["D1", "anubis"], ["D2", "horus"], ["D3", "ra"]].map(([k, n]) => `<div class="god" style="font-size:17px;max-width:none">${ic(k)} ${esc(t(n))}</div>`).join("")}</div>`;
  openSheet(`<div class="sheet-head"><h2>${t("cards")}</h2><button data-close>${t("close")}</button></div><div class="tabs">${tabs.map(([k, l]) => `<button type="button" data-tab="${k}" aria-pressed="${k === tab}">${t(l)}</button>`).join("")}</div>${body}`);
  $("#sheet").querySelectorAll("[data-tab]").forEach(b => b.onclick = () => showCatalog(b.dataset.tab));
}
function showStats() {
  const s = store.get("stats", { played: 0, wins: 0, best: 0, total: 0, dev: 0 });
  openSheet(`<div class="sheet-head"><h2>${t("statsT")}</h2><button data-close>${t("close")}</button></div><div class="statgrid">
    ${[["played", s.played], ["wins", s.wins], ["best", s.best], ["avg", s.played ? Math.round(s.total / s.played) : 0], ["devs", s.dev]].map(([k, v]) => `<div class="stat"><b>${v}</b>${t(k)}</div>`).join("")}</div>
    <div class="choices"><button id="resetStats">${t("reset")}</button></div>`);
  $("#resetStats").onclick = () => { store.set("stats", { played: 0, wins: 0, best: 0, total: 0, dev: 0 }); showStats(); };
}
window.DuatUI = { ic, cardHTML, raImg, gname: k => T[lang].g[k], lang: () => lang, openSheet, state: () => ({ G, ui }), startGame, t };
applyLang();
}
