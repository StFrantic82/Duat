// Duat — tutoriel guidé (FR / EN / IT)
{
const U = window.DuatUI, D = window.DUAT;
const $ = s => document.querySelector(s);
const TX = {
  fr: {
    next: "Suivant", ok: "Compris !", quit: "Quitter le tutoriel", step: (i, n) => `${i} / ${n}`,
    intro: [
      ["Bienvenue dans le Duat", "Après la mort, votre âme traverse le Duat. En 8 manches, vous racontez votre vie en posant des cartes Vie autour de votre Personnage, puis Osiris pèse votre cœur. Cette partie guidée se joue contre une seule IA."],
      ["Les 7 portes et leurs Gardiens", "Chaque manche, votre âme franchit une porte. Le Gardien en surbrillance indique ce que l'on compte ce tour-ci : Agriculture, Artisanat, Connaissance, Cœurs, Dieux, Scarabées ou cartes d'un même côté. Les Gardiens des portes déjà franchies deviennent des objectifs à 7 PV.", "#board"],
      ["Le pilier : l'ordre du tour", "Après avoir joué, votre marqueur Ba monte sur le pilier au niveau de ce que vous possédez dans la catégorie du Gardien. À la manche suivante, le plus haut joue en premier, ce qui lui permet de choisir la direction imposée.", "#board"],
      ["Votre Personnage", "Voici votre Personnage et ses deux cartouches. Votre jeu a deux moitiés : à gauche et à droite. Les cartes posées autour du Personnage ajoutent leurs icônes à l'une ou l'autre moitié.", "#me"],
      ["La rivière de cartes Vie", "Chaque tour, vous prenez une carte Vie. Les premières sont gratuites, les suivantes coûtent 1 ou 2 Scarabées. Dès qu'une carte est prise, celles de droite glissent et deviennent moins chères. Les Scarabées posés sur une carte reviennent à celui qui la prend.", "#offer"],
      ["La direction imposée", "Le premier joueur de la manche choisit où poser sa carte : gauche, droite, haut ou bas. Tout le monde doit suivre, sauf en payant 1 Scarabée (direction adjacente) ou 2 (direction opposée).", "#compass"],
      ["Les trois Dieux", "Anubis vous donne un Scarabée, chaque paire d'Horus vous fait piocher et jouer une carte, et Râ vous offre un jeton bonus.", "#gods"],
      ["À vous de jouer !", "Je vous accompagne pendant la partie. Chaque fois qu'une nouvelle situation se présente, une bulle comme celle-ci vous l'explique."]
    ],
    tips: {
      pick: ["Choisissez une carte", "Cliquez sur une carte Vie. Regardez ses cartouches (icônes à gauche et à droite) et son scoring en bas : PV fixes, ou PV par icône possédée."],
      dir: ["Où poser la carte ?", "◀ Gauche : vous gardez le cartouche gauche et le scoring. Droite ▶ : le cartouche droit et le scoring. ▲ Haut : les deux cartouches, mais plus de scoring. ▼ Bas : seulement le scoring, mais il compte sur tout votre jeu. Un scoring à gauche ne compte que votre moitié gauche, et inversement à droite."],
      pillar: ["Votre âme a passé la porte", "Votre marqueur Ba est monté sur le pilier selon votre nombre d'icônes de la catégorie du Gardien. Plus vous êtes haut, plus tôt vous jouerez à la manche suivante.", "#board"],
      round2: ["Nouvelle manche", "La carte restante a reçu 1 Scarabée et la rivière a été complétée. Un nouveau Gardien est révélé. Les Gardiens des portes franchies peuvent être revendiqués dès que vous remplissez leur condition, en payant les icônes manquantes avec vos Scarabées.", "#offer"],
      hearts: ["Attention à Ammout !", "Comparez vos cœurs noirs et blancs. À la fin, un écart de 3 ou plus et vous êtes dévoré et éliminé. Un écart de 0 et chaque Balance ⚖ visible rapporte 5 PV de plus.", "#me"],
      judge: ["Dernière manche : le Jugement", "Cette manche, votre âme se place selon l'écart entre vos cœurs noirs et blancs. Visez l'équilibre parfait !", "#board"],
      end: ["Fin du tutoriel", "Bravo, vous connaissez maintenant tout le Duat ! Les règles complètes restent disponibles à tout moment via le bouton Règles."]
    }
  },
  en: {
    next: "Next", ok: "Got it!", quit: "Quit tutorial", step: (i, n) => `${i} / ${n}`,
    intro: [
      ["Welcome to the Duat", "After death, your soul travels through the Duat. Over 8 rounds you tell your life story by placing Life cards around your Character, then Osiris weighs your heart. This guided game is played against a single AI."],
      ["The 7 gates and their Guardians", "Each round your soul passes a gate. The highlighted Guardian shows what is counted this round: Agriculture, Craft, Knowledge, Hearts, Gods, Scarabs or cards on one side. Guardians of gates already passed become 7 VP objectives.", "#board"],
      ["The pillar: turn order", "After playing, your Ba marker climbs the pillar to the level of what you have in the Guardian's category. Next round, the highest plays first and gets to choose the imposed direction.", "#board"],
      ["Your Character", "This is your Character with its two cartouches. Your display has two halves: left and right. Cards placed around the Character add their icons to one half or the other.", "#me"],
      ["The river of Life cards", "Each turn you take a Life card. The first ones are free, the next cost 1 or 2 scarabs. As soon as a card is taken, the cards to its right slide over and get cheaper. Scarabs placed on a card go to whoever takes it.", "#offer"],
      ["The imposed direction", "The first player of the round chooses where to place their card: left, right, top or bottom. Everyone must follow, unless they pay 1 scarab (adjacent direction) or 2 (opposite direction).", "#compass"],
      ["The three Gods", "Anubis gives you a scarab, each pair of Horus lets you draw and play a card, and Ra grants you a bonus token.", "#gods"],
      ["Your turn!", "I'll guide you during the game. Whenever something new happens, a bubble like this one will explain it."]
    ],
    tips: {
      pick: ["Choose a card", "Click a Life card. Look at its cartouches (icons on the left and right) and its scoring at the bottom: fixed VP, or VP per icon you own."],
      dir: ["Where to place it?", "◀ Left: you keep the left cartouche and the scoring. Right ▶: the right cartouche and the scoring. ▲ Top: both cartouches, but no scoring. ▼ Bottom: only the scoring, but it counts your whole display. A scoring on the left only counts your left half, and the right one your right half."],
      pillar: ["Your soul passed the gate", "Your Ba marker climbed the pillar according to your number of icons in the Guardian's category. The higher you are, the earlier you play next round.", "#board"],
      round2: ["New round", "The leftover card received 1 scarab and the river was refilled. A new Guardian is revealed. Guardians of passed gates can be claimed as soon as you meet their requirement, paying any missing icons with scarabs.", "#offer"],
      hearts: ["Beware of Ammit!", "Compare your black and white hearts. At the end, a gap of 3 or more and you are devoured and eliminated. A gap of 0 and each visible Balance ⚖ is worth 5 more VP.", "#me"],
      judge: ["Last round: the Judgment", "This round, your soul is placed according to the gap between your black and white hearts. Aim for perfect balance!", "#board"],
      end: ["End of the tutorial", "Well done, you now know the whole Duat! The full rules are always available with the Rules button."]
    }
  },
  it: {
    next: "Avanti", ok: "Capito!", quit: "Esci dal tutorial", step: (i, n) => `${i} / ${n}`,
    intro: [
      ["Benvenuto nel Duat", "Dopo la morte, la tua anima attraversa il Duat. In 8 round racconti la tua vita posando carte Vita intorno al tuo Personaggio, poi Osiride pesa il tuo cuore. Questa partita guidata si gioca contro una sola IA."],
      ["Le 7 porte e i loro Guardiani", "Ogni round la tua anima attraversa una porta. Il Guardiano evidenziato indica cosa si conta in questo round: Agricoltura, Artigianato, Conoscenza, Cuori, Dei, Scarabei o carte su uno stesso lato. I Guardiani delle porte già attraversate diventano obiettivi da 7 PV.", "#board"],
      ["Il pilastro: l'ordine di turno", "Dopo aver giocato, il tuo segnalino Ba sale sul pilastro al livello di ciò che possiedi nella categoria del Guardiano. Al round seguente, chi è più in alto gioca per primo e sceglie la direzione imposta.", "#board"],
      ["Il tuo Personaggio", "Ecco il tuo Personaggio con i suoi due cartigli. Il tuo gioco ha due metà: sinistra e destra. Le carte posate intorno al Personaggio aggiungono le loro icone all'una o all'altra metà.", "#me"],
      ["Il fiume delle carte Vita", "A ogni turno prendi una carta Vita. Le prime sono gratis, le seguenti costano 1 o 2 Scarabei. Appena una carta viene presa, quelle a destra scivolano e costano meno. Gli Scarabei posati su una carta vanno a chi la prende.", "#offer"],
      ["La direzione imposta", "Il primo giocatore del round sceglie dove posare la sua carta: sinistra, destra, sopra o sotto. Tutti devono seguirlo, a meno di pagare 1 Scarabeo (direzione adiacente) o 2 (direzione opposta).", "#compass"],
      ["I tre Dei", "Anubi ti dà uno Scarabeo, ogni coppia di Horus ti fa pescare e giocare una carta, e Ra ti offre un gettone bonus.", "#gods"],
      ["Tocca a te!", "Ti accompagno durante la partita. Ogni volta che si presenta una situazione nuova, una bolla come questa te la spiega."]
    ],
    tips: {
      pick: ["Scegli una carta", "Clicca su una carta Vita. Guarda i suoi cartigli (icone a sinistra e a destra) e il suo punteggio in basso: PV fissi, o PV per icona posseduta."],
      dir: ["Dove posarla?", "◀ Sinistra: tieni il cartiglio sinistro e il punteggio. Destra ▶: il cartiglio destro e il punteggio. ▲ Sopra: entrambi i cartigli, ma niente punteggio. ▼ Sotto: solo il punteggio, che però conta tutto il tuo gioco. Un punteggio a sinistra conta solo la tua metà sinistra, e quello a destra la metà destra."],
      pillar: ["La tua anima ha passato la porta", "Il tuo segnalino Ba è salito sul pilastro secondo il numero di icone della categoria del Guardiano. Più sei in alto, prima giocherai al round seguente.", "#board"],
      round2: ["Nuovo round", "La carta rimasta ha ricevuto 1 Scarabeo e il fiume è stato completato. Viene rivelato un nuovo Guardiano. I Guardiani delle porte attraversate si possono reclamare appena ne soddisfi il requisito, pagando con gli Scarabei le icone mancanti.", "#offer"],
      hearts: ["Attenzione ad Ammit!", "Confronta i tuoi cuori neri e bianchi. Alla fine, con uno scarto di 3 o più vieni divorato ed eliminato. Con uno scarto di 0 ogni Bilancia ⚖ visibile vale 5 PV in più.", "#me"],
      judge: ["Ultimo round: il Giudizio", "In questo round la tua anima si posiziona secondo lo scarto tra cuori neri e bianchi. Punta al perfetto equilibrio!", "#board"],
      end: ["Fine del tutorial", "Bravo, ora conosci tutto il Duat! Le regole complete sono sempre disponibili con il pulsante Regole."]
    }
  }
};
let on = false, idx = 0, seen = {}, open = false, hl = null;
const tx = () => TX[U.lang()] || TX.fr;
const bubble = document.createElement("div"); bubble.id = "tutoBubble"; bubble.hidden = true; document.body.appendChild(bubble);
function highlight(sel) {
  if (hl) hl.classList.remove("tuto-hl"); hl = null;
  if (!sel) return; const el = $(sel); if (!el) return;
  el.classList.add("tuto-hl"); hl = el;
  const r = el.getBoundingClientRect(); if (r.top < 60 || r.bottom > innerHeight - 220) el.scrollIntoView({ behavior: "smooth", block: "center" });
}
function show(title, text, sel, btn, count) {
  open = true; highlight(sel);
  bubble.innerHTML = `<div class="tb-head">🎓 <b>${title}</b>${count ? `<span>${count}</span>` : ""}</div><p>${text}</p><div class="tb-btns"><button type="button" class="ghost" data-tq>${tx().quit}</button><button type="button" class="primary" data-tn>${btn}</button></div>`;
  bubble.hidden = false; bubble.querySelector("[data-tn]").focus({ preventScroll: true });
}
function close() { open = false; bubble.hidden = true; highlight(null); }
function introStep() {
  const I = tx().intro; if (idx >= I.length) { close(); idx = -1; T.onRender(); return; }
  const [t, p, sel] = I[idx]; show(t, p, sel, idx === I.length - 1 ? tx().ok : tx().next, tx().step(idx + 1, I.length));
}
function tip(k) {
  if (seen[k] || open) return false; seen[k] = true; const [t, p, sel] = tx().tips[k];
  const target = sel || (k === "pick" ? "#offer" : k === "dir" ? "#action" : null);
  show(t, p, target, tx().ok); return true;
}
bubble.addEventListener("click", e => {
  if (e.target.closest("[data-tq]")) { on = false; close(); return; }
  if (e.target.closest("[data-tn]")) { if (idx >= 0) { idx++; introStep(); } else { close(); setTimeout(() => T.onRender(), 50); } }
});
const T = {
  reset(v) { on = v; idx = v ? 0 : -1; seen = {}; close(); if (v) setTimeout(introStep, 300); },
  blocking() { return on && open; },
  onRender() {
    if (!on || open || idx >= 0) return;
    const { G, ui } = U.state(); if (!G) return;
    const me = G.players[0], myTurn = !G.over && !D.curPlayer(G).bot && ui.resolve;
    if (G.over) { if (!$("#modal").hidden) return; tip("end"); on = !seen.end ? on : false; return; }
    if (G.round === 8 && tip("judge")) return;
    if (G.round >= 2 && tip("round2")) return;
    const placed = D.SIDES.reduce((a, s) => a + me.t[s].length, 0);
    if (placed >= 1 && !myTurn && tip("pillar")) return;
    if (placed >= 2 && D.counts(me).diff >= 2 && tip("hearts")) return;
    if (myTurn && ui.sel === null && tip("pick")) return;
    if (myTurn && ui.sel !== null && tip("dir")) return;
  }
};
window.DuatTuto = T;
$("#tutoBtn").onclick = () => U.startGame({ tuto: true, n: 2, seed: 20261125 });
}
