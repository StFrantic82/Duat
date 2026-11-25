/* DUAT — moteur de règles + bots (données issues de l'Excel de l'auteur) */
(function (root) {
  const RAW_CARDS = [
    "1|CN CN D1 R3|/|D3 SC R3", "2|D3 R2 R2|/|CB CB D2 R2", "3|CN D2 SC R1|/|CB D1 R1 R1",
    "4|CN CN R1 R1|Balance|SC SC", "5|SC SC|Balance|CB CB R2 R2", "6|R3 R3 SC|Balance|D1 R1 R2",
    "7|R3|5PV (Balance)|R1R1R1", "8|R2R2R2|6PV (Balance)|R3", "9|R1 R1|7PV (Balance)|CB SC",
    "10|D2|8PV (Balance)|R3 CB", "11|CN R2|9PV (Balance)|D3", "12|R3|10PV (Balance)|SC",
    "13|/|11PV (Balance)|R2", "14|R1|12PV (Balance)|/", "15|/|13PV (Balance)|/",
    "16|SC SC|4PV/ R1R1 (Balance)|R1 CB", "17|R2 CN|5PV/ R2R2 (Balance)|SC SC",
    "18|SC SC|6PV/ R3R3 (Balance)|R3 CB", "19|CN SC|7PV / DD (Balance)|CB SC",
    "20|R1 D1|1 / R|/", "21|/|1 / R|R3 SC", "22|CN|2 / R|CB",
    "23|CN D3 SC|1PV/ R1|R1 R1", "24|R1|2PV/ R1|CB SC", "25|CN R2|2PV/ R1|R1", "26|SC|3PV/ R1|/",
    "27|R2 SC|2PV/ R2|CB D2 SC", "28|CN D2 R3|2PV/ R2|R2 R1", "29|R2|3PV/ R2|CB SC", "30|CN R1|3PV/ R2|R2",
    "31|R3 SC|2PV/ R3|CB D3 R1", "32|CN R2|3PV/ R3|R3", "33|R3|3PV/ R3|CB R2", "34|/|4PV/ R3|SC",
    "35|CN SC R3|3PV / CN|/", "36|CN R2|4PV / CN|/", "37|CN|5PV/ CN|/",
    "38|/|3PV / CB|CB SC R3", "39|/|4PV / CB|CB R2", "40|/|5PV / CB|CB",
    "41|D3 R1|2PV / D|D1 R2", "42|D1|3PV / D|D2", "43|CN|4PV / D|CB",
    "44|CN CN|7PV/R1R1|SC", "45|R1|12PV/R1R1R1|SC SC", "46|R3|8PV/R2R2|CB CB", "47|R2 R1|14PV/R2R2R2|R3",
    "48|CN CN|10PV/R3R3|R1", "49|R3|16PV/R3R3R3|CB CB", "50|R1R1R1|9PV/CNCN|/", "51|CN SC|15PV/CNCNCN|/",
    "52|/|9PV/CBCB|R2R2", "53|/|15PV/CBCBCB|R1R1"
  ];
  const tok = s => (s.match(/R[123]|CN|CB|D[123]|SC/g) || []);
  function parseCenter(s) {
    s = s.trim();
    if (s === "/") return null;
    if (s === "Balance") return { t: "bal" };
    const bal = /\(Balance\)/.test(s);
    s = s.replace(/\(Balance\)/, "").trim();
    const m = s.match(/^(\d+)\s*(?:PV)?\s*(?:\/\s*(.*))?$/);
    const v = +m[1];
    if (!m[2]) return { t: "pv", v, bal };
    const icons = m[2].match(/R[123]|CN|CB|DD|D|R/g);
    if (icons[0] === "DD") return { t: "per", v, icon: "D", n: 2, bal };
    return { t: "per", v, icon: icons[0], n: icons.length, bal };
  }
  const CARDS = RAW_CARDS.map(l => {
    const [id, L, C, R] = l.split("|");
    return { id: +id, L: tok(L), C: parseCenter(C), R: tok(R) };
  });
  const CHARS = [
    { id: 1, L: ["CN", "CN"], R: ["R1"] }, { id: 2, L: ["R2"], R: ["CB", "CB"] },
    { id: 3, L: ["CN"], R: ["R3"] }, { id: 4, L: ["R1"], R: ["CB"] }, { id: 5, L: ["R3"], R: ["R2"] }
  ];
  const GUARDIANS = [
    { id: 1, key: "R1", need: 7 }, { id: 2, key: "R2", need: 6 }, { id: 3, key: "R3", need: 5 },
    { id: 4, key: "CN", need: 6 }, { id: 5, key: "CB", need: 6 }, { id: 6, key: "D", need: 5 },
    { id: 7, key: "SIDE", need: 5 }, { id: 8, key: "SC", need: 5 }
  ];
  const GPV = 7;
  const RA_TOKENS = ["R1", "R2", "R3", "CN", "CB", "BAL", "SC2"];
  const DEVOUR = 3;
  const ROUNDS = 8;

  function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
  function shuffle(a, r) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  // Plateau 2–3 j. : 4 emplacements · plateau 4–5 j. : 6 emplacements, le dernier (2 scarabées) seulement à 5 joueurs
  const costsFor = n => n <= 3 ? [0, 0, 1, 2] : n === 4 ? [0, 0, 1, 1, 2] : [0, 0, 1, 1, 2, 2];

  function newGame(opts) {
    const n = opts.players.length, r = rng(opts.seed || Date.now());
    const chars = shuffle([1, 2, 3, 4, 5], r).slice(0, n);
    const G = {
      n, r, round: 1, turn: 0, side: null, over: false, log: [],
      deck: shuffle(CARDS.map(c => c.id), r),
      gates: shuffle(GUARDIANS.map(g => g.id), r).slice(0, 7),
      revealed: 2, claimed: {}, raPool: RA_TOKENS.slice(),
      costs: costsFor(n), offer: [],
      pillars: Array.from({ length: 9 }, () => ({})),
      players: opts.players.map((p, i) => ({ i, name: p.name, bot: !!p.bot, char: chars[i], t: { L: [], R: [], U: [], D: [] }, sc: 1, tokens: [], guardians: [], color: p.color, st: { takes: [], cardCost: 0, dirCost: 0, guardCost: 0, gRiver: 0, gCard: 0, gAnubis: 0, gSc2: 0, horus: 0, first: 0, free: 0, claims: [] } }))
    };
    G.order = G.players.map(p => p.i).sort((a, b) => G.players[a].char - G.players[b].char);
    G.pillars[0][0] = G.order.slice().reverse();
    refill(G);
    return G;
  }
  function refill(G) {
    G.offer = G.offer.filter(Boolean);
    while (G.offer.length < G.costs.length && G.deck.length) G.offer.push({ card: G.deck.shift(), sc: 0 });
  }
  const card = id => CARDS[id - 1];
  // Gauche : côté gauche + scoring · Droite : côté droit + scoring · Haut : les deux côtés, sans scoring · Bas : scoring seul
  const SIDES = ["L", "R", "U", "D"], OPP = { L: "R", R: "L", U: "D", D: "U" };
  // Moitié de tableau : cartouche du personnage + cartes de ce côté + cartouche de ce côté des cartes du haut + jetons Râ posés de ce côté
  function halfCounts(p, h) {
    const c = { R1: 0, R2: 0, R3: 0, CN: 0, CB: 0, D1: 0, D2: 0, D3: 0, SC: 0 };
    const add = arr => arr.forEach(k => { if (c[k] !== undefined) c[k]++; });
    add(CHARS[p.char - 1][h]); p.t[h].forEach(id => add(card(id)[h])); p.t.U.forEach(id => add(card(id)[h])); add(p.tokens.filter(t => t.h === h).map(t => t.k));
    c.R = c.R1 + c.R2 + c.R3; c.D = c.D1 + c.D2 + c.D3; return c;
  }
  // Un scoring à gauche compte la moitié gauche, à droite la moitié droite ; en bas, tout le jeu.
  function perPV(C, p, side) {
    const f = h => Math.floor(halfCounts(p, h)[C.icon] / C.n) * C.v;
    return side === "D" ? Math.floor(counts(p)[C.icon] / C.n) * C.v : f(side);
  }
  const visIcons = (id, side) => side === "L" ? card(id).L : side === "R" ? card(id).R : side === "U" ? [...card(id).L, ...card(id).R] : [];
  const scoringCards = p => [...p.t.L, ...p.t.R, ...p.t.D];
  const charOf = p => CHARS[p.char - 1];

  function counts(p) {
    const c = { R1: 0, R2: 0, R3: 0, CN: 0, CB: 0, D1: 0, D2: 0, D3: 0, SC: 0, BAL: 0 };
    const add = arr => arr.forEach(k => c[k]++);
    const ch = charOf(p); add(ch.L); add(ch.R);
    SIDES.forEach(s => p.t[s].forEach(id => add(visIcons(id, s))));
    scoringCards(p).forEach(id => { const C = card(id).C; if (C && C.t === "bal") c.BAL++; });
    p.tokens.forEach(t => { if (c[t.k] !== undefined) c[t.k]++; });
    c.R = c.R1 + c.R2 + c.R3; c.D = c.D1 + c.D2 + c.D3; c.SIDE = Math.max(...SIDES.map(s => p.t[s].length));
    c.diff = Math.abs(c.CN - c.CB);
    return c;
  }
  const metric = (p, key) => counts(p)[key];
  const curPlayer = G => G.players[G.order[G.turn]];
  // direction imposée : 0 · adjacente : 1 · opposée : 2
  const sideCost = (G, side) => (G.turn === 0 && G.side === null) || G.side === side ? 0 : OPP[side] === G.side ? 2 : 1;

  function claimable(G, p) {
    const c = counts(p), out = [];
    G.gates.forEach((gid, gi) => {
      if (gi + 1 >= G.round || gi >= G.revealed || G.claimed[gid] !== undefined) return;
      const g = GUARDIANS[gid - 1], cost = Math.max(0, g.need - c[g.key]);
      if (cost <= p.sc) out.push({ gid, cost });
    });
    return out;
  }

  // Place un carte, résout icônes et dieux. hooks.ra(p, pool) -> token choisi (peut être async)
  async function placeCard(G, p, id, side, hooks, depth = 0) {
    const before = counts(p);
    p.t[side].push(id);
    const icons = visIcons(id, side);
    G.log.push({ k: "place", p: p.i, id, side, horus: depth > 0 });
    for (const ic of icons) {
      if (ic === "SC") { p.sc++; p.st.gCard++; }
      if (ic === "D1") { p.sc++; p.st.gAnubis++; G.log.push({ k: "anubis", p: p.i }); }
      if (ic === "D3" && G.raPool.length) {
        const r = await hooks.ra(G, p), tk = typeof r === "string" ? { k: r, h: "L" } : r;
        G.raPool.splice(G.raPool.indexOf(tk.k), 1); p.tokens.push(tk);
        if (tk.k === "SC2") { p.sc++; p.st.gSc2++; }
        G.log.push({ k: "ra", p: p.i, t: tk.k, h: tk.h });
      }
    }
    const after = counts(p);
    const pairs = Math.floor(after.D2 / 2) - Math.floor(before.D2 / 2);
    for (let k = 0; k < pairs && G.deck.length && depth < 4; k++) {
      const nid = G.deck.shift();
      G.log.push({ k: "horus", p: p.i, id: nid }); p.st.horus++;
      p.st.takes.push({ id: nid, side: G.side, round: G.round, slot: -1, cost: 0, horus: true });
      await placeCard(G, p, nid, G.side, hooks, depth + 1);
    }
  }

  // Coups légaux. Si le joueur ne peut rien payer : il prend une carte gratuitement, côté imposé.
  function options(G, p) {
    const out = [];
    G.offer.forEach((o, slot) => { if (!o) return; SIDES.forEach(side => { const cost = G.costs[slot] + sideCost(G, side); if (cost <= p.sc + o.sc) out.push({ slot, side, cost }); }); });
    if (out.length) return out;
    G.offer.forEach((o, slot) => { if (!o) return; SIDES.forEach(side => { if (sideCost(G, side) === 0) out.push({ slot, side, cost: 0, free: true }); }); });
    return out;
  }
  async function playTurn(G, choice, hooks) {
    const p = curPlayer(G), o = G.offer[choice.slot];
    const opt = options(G, p).find(x => x.slot === choice.slot && x.side === choice.side);
    if (!opt) throw new Error("coup illégal");
    if (G.side === null && G.turn === 0) G.side = choice.side;
    const cost = opt.free ? 0 : G.costs[choice.slot], sc = opt.free ? 0 : sideCost(G, choice.side);
    p.sc += o.sc; p.sc -= cost + sc;
    p.st.cardCost += cost; p.st.dirCost += sc; p.st.gRiver += o.sc; if (opt.free) p.st.free++; if (G.turn === 0) p.st.first++;
    p.st.takes.push({ id: o.card, side: choice.side, round: G.round, slot: choice.slot, cost, dir: sc, river: o.sc });
    if (p.sc < 0) throw new Error("scarabées insuffisants");
    G.log.push({ k: "take", p: p.i, id: o.card, cost, gain: o.sc, sideCost: sc });
    // les cartes à droite glissent aussitôt vers la gauche (leur coût baisse) ; on recomplète en fin de manche
    G.offer.splice(choice.slot, 1); G.offer.push(null);
    await placeCard(G, p, o.card, choice.side, hooks);
    const cl = claimable(G, p);
    if (cl.length) {
      const pick = await hooks.claim(G, p, cl);
      if (pick) { p.sc -= pick.cost; p.st.guardCost += pick.cost; p.st.claims.push({ gid: pick.gid, round: G.round, cost: pick.cost }); G.claimed[pick.gid] = p.i; p.guardians.push(pick.gid); G.log.push({ k: "claim", p: p.i, gid: pick.gid, cost: pick.cost }); }
    }
    // pilier
    const c = counts(p);
    const lvl = G.round <= 7 ? Math.min(7, c[GUARDIANS[G.gates[G.round - 1] - 1].key]) : Math.min(3, c.diff);
    const pil = G.pillars[G.round]; (pil[lvl] = pil[lvl] || []).push(p.i);
    G.log.push({ k: "soul", p: p.i, lvl, round: G.round });
    G.turn++;
    if (G.turn >= G.n) endRound(G);
  }
  function endRound(G) {
    G.hist = G.hist || []; G.hist.push(score(G).rows.map(r => r.devoured ? r.total : r.total));
    if (G.round >= ROUNDS) { G.over = true; G.result = score(G); return; }
    G.offer.forEach(o => { if (o) o.sc++; });
    refill(G);
    G.revealed = Math.min(7, G.revealed + 1);
    const pil = G.pillars[G.round], order = [];
    for (let l = 7; l >= 0; l--) if (pil[l]) order.push(...pil[l].slice().reverse());
    G.order = order; G.round++; G.turn = 0; G.side = null;
    G.log.push({ k: "round", round: G.round });
  }

  function cardPV(id, side, p, balanced) {
    const C = card(id).C; if (!C || side === "U" || C.t === "bal") return 0;
    if (C.bal && !balanced) return 0;
    if (C.t === "pv") return C.v;
    return perPV(C, p, side);
  }
  const cardsPV = (p, balanced) => ["L", "R", "D"].reduce((s, side) => s + p.t[side].reduce((a, id) => a + cardPV(id, side, p, balanced), 0), 0);
  function score(G) {
    const rows = G.players.map(p => {
      const c = counts(p), balanced = c.diff === 0, devoured = c.diff >= DEVOUR;
      const cards = cardsPV(p, balanced);
      const bal = balanced ? c.BAL * 5 : 0, guard = p.guardians.length * GPV, scar = p.sc * 2;
      const ra = p.tokens.filter(t => t.k === "SC2").length * 2;
      return { p: p.i, cards, bal, guard, scar, ra, total: cards + bal + guard + scar + ra, devoured, diff: c.diff, hearts: c.CN + c.CB };
    });
    // départage : le plus de cœurs (noirs + blancs) ; sinon victoire partagée
    const ranked = rows.slice().sort((a, b) => (a.devoured - b.devoured) || (b.total - a.total) || (b.hearts - a.hearts));
    const top = ranked[0], winners = top.devoured ? [] : ranked.filter(r => !r.devoured && r.total === top.total && r.hearts === top.hearts).map(r => r.p);
    return { rows, ranked, winners, winner: winners.length ? winners[0] : null };
  }

  /* ---------- BOTS ---------- */
  // Réglages de l'IA (entraînables). Les valeurs par défaut sont les réglages d'origine.
  const DEFAULT_W = { res: 0.9, gate: 0.4, guardNear: 0.9, sc: 2.1, anubis: 2.6, horus: 1.1, horusPair: 1.5, ra: 2.6, godGuard: 0.6,
    heartFix: 2.2, heartBad: 1.4, synergy: 1, balIcon: 5, flatPV: 1, perPV: 0.9, future: 0.3, sideGuard: 0.8, cost: 2, river: 2, top: 0, bottom: 0, claimMax: 3 };
  let W = Object.assign({}, DEFAULT_W);
  const setWeights = w => { W = Object.assign({}, DEFAULT_W, w || {}); };
  const getWeights = () => Object.assign({}, W);
  function evalPlace(G, p, id, side, w = p.w || W) {
    const c = counts(p), cd = card(id), icons = visIcons(id, side), left = ROUNDS - G.round;
    const n = { ...c }; icons.forEach(k => n[k]++); n.R = n.R1 + n.R2 + n.R3; n.D = n.D1 + n.D2 + n.D3; n.diff = Math.abs(n.CN - n.CB);
    let v = side === "U" ? w.top : side === "D" ? w.bottom : 0;
    const gateKey = G.round <= 7 ? GUARDIANS[G.gates[G.round - 1] - 1].key : null;
    for (const k of icons) {
      if (/R[123]/.test(k)) {
        v += w.res;
        if (gateKey === k) v += w.gate;
        G.gates.forEach(gid => { const g = GUARDIANS[gid - 1]; if (g.key === k && G.claimed[gid] === undefined && g.need - c[k] <= 3 + left / 3) v += w.guardNear; });
      }
      if (k === "SC") v += w.sc; if (k === "D1") v += w.anubis; if (k === "D2") v += w.horus + (c.D2 % 2 ? w.horusPair : 0); if (k === "D3") v += G.raPool.length ? w.ra : 0.4;
      if (/D/.test(k)) G.gates.forEach(gid => { if (gid === 6 && G.claimed[6] === undefined) v += w.godGuard; });
    }
    // Ammout : ne jamais finir avec un écart de 3+ (règle de sécurité, non entraînée)
    const danger = d => { const ex = d - (DEVOUR - 1); if (ex <= 0) return d === DEVOUR - 1 && left <= 1 ? 4 : 0; const cap = left * 1.1; return ex > cap ? 1000 : 14 + 22 * ex / Math.max(1, cap); };
    v += danger(c.diff) - danger(n.diff);
    if (n.diff < c.diff) v += (c.diff >= DEVOUR - 1 ? 4 : w.heartFix) * (c.diff - n.diff);
    if (n.diff > c.diff && n.diff < DEVOUR) v -= w.heartBad * (n.diff - c.diff) * (left < 3 ? 2.5 : 1);
    // synergies avec les scorings déjà posés
    const pot = () => ["L", "R", "D"].reduce((s, sd) => s + p.t[sd].reduce((a, cid) => { const K = card(cid).C; return a + (K && K.t === "per" ? perPV(K, p, sd) * (K.bal ? 0.5 : 1) : 0); }, 0), 0);
    const before = pot(); p.t[side].push(id); v += (pot() - before) * w.synergy; p.t[side].pop();
    const pb = n.diff === 0 ? 0.75 : n.diff === 1 ? 0.5 : 0.25;
    const C = cd.C;
    if (C && side !== "U") {
      if (C.t === "bal") v += w.balIcon * pb;
      else if (C.t === "pv") v += C.v * (C.bal ? pb : 1) * w.flatPV;
      else { const now = side === "D" ? counts(p)[C.icon] : halfCounts(p, side)[C.icon] + icons.filter(k => k === C.icon || (C.icon === "R" && /R/.test(k)) || (C.icon === "D" && /D/.test(k))).length;
        const exp = now + left * w.future * (C.icon === "R" ? 2 : 1); v += (Math.floor(exp / C.n) * C.v * 0.7 + Math.floor(now / C.n) * C.v * 0.3) * (C.bal ? pb : 1) * w.perPV; }
    }
    if (p.t[side].length >= 4) if (G.claimed[7] === undefined && G.gates.includes(7)) v += w.sideGuard;
    return v;
  }
  function botChoose(G, p) {
    const w = p.w || W; let best = null;
    options(G, p).forEach(({ slot, side, cost }) => {
      const o = G.offer[slot];
      const v = evalPlace(G, p, o.card, side, w) - cost * w.cost + o.sc * w.river + G.r() * 0.3;
      if (!best || v > best.v) best = { slot, side, v };
    });
    return best;
  }
  function botRa(G, p) {
    const c = counts(p), pool = G.raPool;
    if (c.CN > c.CB && pool.includes("CB")) return "CB";
    if (c.CB > c.CN && pool.includes("CN")) return "CN";
    if (c.diff === 0 && pool.includes("BAL")) return "BAL";
    let best = null;
    pool.forEach(t => { if (/R/.test(t)) { G.gates.forEach(gid => { const g = GUARDIANS[gid - 1]; if (g.key === t && G.claimed[gid] === undefined) { const d = g.need - c[t]; if (!best || d < best.d) best = { t, d }; } }); } });
    if (best) return best.t;
    return pool.includes("SC2") ? "SC2" : pool.find(t => !/C[NB]/.test(t)) || pool[0];
  }
  function botClaim(G, p, list) {
    const mx = (p.w || W).claimMax, ok = list.filter(x => x.cost <= mx).sort((a, b) => a.cost - b.cost);
    return ok[0] || null;
  }
  // Le jeton Râ est posé du côté où il rapporte le plus aux scorings déjà en place
  function bestHalf(p, k) {
    const pot = () => ["L", "R", "D"].reduce((s, sd) => s + p.t[sd].reduce((a, cid) => { const K = card(cid).C; return a + (K && K.t === "per" ? perPV(K, p, sd) : 0); }, 0), 0);
    let best = "L", bv = -1;
    (Math.random() < 0.5 ? ["L", "R"] : ["R", "L"]).forEach(h => { p.tokens.push({ k, h }); const v = pot(); p.tokens.pop(); if (v > bv) { bv = v; best = h; } });
    return best;
  }
  const HALF_TOKENS = ["R1", "R2", "R3", "CN", "CB"];
  const botHooks = { ra: (G, p) => { const k = botRa(G, p); return { k, h: HALF_TOKENS.includes(k) ? bestHalf(p, k) : "L" }; }, claim: (G, p, l) => botClaim(G, p, l) };

  // Résumé compact d'une partie terminée, pour les statistiques
  function summary(G, sim) {
    const R = G.result || score(G);
    const rankOf = {}; R.ranked.forEach((r, k) => rankOf[r.p] = k + 1);
    const seat0 = {}; G.pillars[0][0].slice().reverse().forEach((pi, k) => seat0[pi] = k);
    return {
      t: Date.now(), sim: !!sim, n: G.n, gates: G.gates.slice(), hist: G.hist || [], deckLeft: G.deck.length,
      players: G.players.map(p => {
        const r = R.rows[p.i], c = counts(p), balanced = c.diff === 0;
        return {
          i: p.i, human: !p.bot, seat: seat0[p.i], char: p.char, win: R.winners.includes(p.i), shared: R.winners.length > 1, rank: rankOf[p.i],
          total: r.total, cards: r.cards, bal: r.bal, guard: r.guard, scar: r.scar, ra: r.ra, dev: r.devoured, diff: r.diff, CN: c.CN, CB: c.CB, BAL: c.BAL,
          scLeft: p.sc, dirs: { L: p.t.L.length, R: p.t.R.length, U: p.t.U.length, D: p.t.D.length },
          takes: p.st.takes.map(x => Object.assign({}, x, { pv: cardPV(x.id, x.side, p, balanced) })),
          claims: p.st.claims, tokens: p.tokens.map(t => t.k + (HALF_TOKENS.includes(t.k) ? t.h : "")),
          eco: { cardCost: p.st.cardCost, dirCost: p.st.dirCost, guardCost: p.st.guardCost, gRiver: p.st.gRiver, gCard: p.st.gCard, gAnubis: p.st.gAnubis, gSc2: p.st.gSc2 },
          horus: p.st.horus, first: p.st.first, free: p.st.free
        };
      })
    };
  }
  async function simGame(n, seed, ws) {
    const G = newGame({ seed, players: Array.from({ length: n }, (_, i) => ({ name: "IA " + (i + 1), bot: true })) });
    if (ws) G.players.forEach((p, i) => { if (ws[i]) p.w = ws[i]; });
    let k = 0;
    while (!G.over && k++ < 200) await playTurn(G, botChoose(G, curPlayer(G)), botHooks);
    return G;
  }
  const API = { DEFAULT_W, setWeights, getWeights, summary, simGame, HALF_TOKENS, SIDES, OPP, halfCounts, cardsPV, cardPV, visIcons, scoringCards, CARDS, CHARS, GUARDIANS, RA_TOKENS, GPV, DEVOUR, ROUNDS, newGame, counts, metric, card, charOf, claimable, sideCost, options, curPlayer, playTurn, score, botChoose, botRa, botClaim, botHooks, evalPlace };
  if (typeof module !== "undefined") module.exports = API; else root.DUAT = API;
})(this);
