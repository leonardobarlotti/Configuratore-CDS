/*
  CONFIGURATORE PREVENTIVI – logica
  ---------------------------------
  Legge il listino da data/prodotti.js (variabile window.LISTINO),
  calcola il prezzo di ogni serramento e costruisce il preventivo.
*/

const L = window.LISTINO;
const $ = (id) => document.getElementById(id);

// Le righe aggiunte al preventivo
let righe = [];

// ---------- Utilità ----------
const euro = (n) =>
  n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });

const arrotonda = (n) => Math.round(n * 100) / 100;

function fornitoreSelezionato() {
  return L.fornitori.find((f) => f.id === $("fornitore").value);
}

function prodottoSelezionato() {
  const f = fornitoreSelezionato();
  return f ? f.prodotti.find((p) => p.id === $("prodotto").value) : null;
}

// ---------- Riempimento dei menu ----------
function caricaFornitori() {
  $("fornitore").innerHTML = L.fornitori
    .map((f) => `<option value="${f.id}">${f.nome}</option>`)
    .join("");
  caricaProdotti();
}

function caricaProdotti() {
  const f = fornitoreSelezionato();
  $("prodotto").innerHTML = f.prodotti
    .map((p) => `<option value="${p.id}">${p.nome}</option>`)
    .join("");
  caricaOpzioni();
}

function descriviOpzione(o) {
  if (o.tipo === "mq") return `+${euro(o.valore)}/m²`;
  if (o.tipo === "pezzo") return `+${euro(o.valore)}/pz`;
  if (o.tipo === "percentuale") return `+${o.valore}%`;
  return "";
}

function caricaOpzioni() {
  const p = prodottoSelezionato();
  $("opzioni").innerHTML = p.opzioni.length
    ? p.opzioni
        .map(
          (o) => `
      <label class="opzione">
        <input type="checkbox" value="${o.id}">
        <span>${o.nome}</span>
        <span class="prezzo-opz">${descriviOpzione(o)}</span>
      </label>`
        )
        .join("")
    : '<p class="hint">Nessuna opzione per questo prodotto.</p>';

  const { larghezza, altezza } = p.limiti;
  $("limiti").textContent =
    `Misure realizzabili: L ${larghezza[0]}–${larghezza[1]} mm · ` +
    `H ${altezza[0]}–${altezza[1]} mm · minimo fatturato ${p.mqMinimo} m²`;

  aggiornaAnteprima();
}

// ---------- Calcolo ----------
function calcola() {
  const p = prodottoSelezionato();
  const larg = Number($("larghezza").value);
  const alt = Number($("altezza").value);
  const qta = Math.max(1, Math.floor(Number($("quantita").value) || 1));

  // Controllo misure
  const [lMin, lMax] = p.limiti.larghezza;
  const [hMin, hMax] = p.limiti.altezza;
  if (!larg || !alt) return { errore: "Inserisci larghezza e altezza." };
  if (larg < lMin || larg > lMax)
    return { errore: `Larghezza fuori misura (${lMin}–${lMax} mm).` };
  if (alt < hMin || alt > hMax)
    return { errore: `Altezza fuori misura (${hMin}–${hMax} mm).` };

  const mqReali = (larg / 1000) * (alt / 1000);
  const mq = Math.max(mqReali, p.mqMinimo);

  const base = mq * p.prezzoMq;
  const voci = [
    { nome: `Base ${mq.toFixed(2)} m² × ${euro(p.prezzoMq)}`, importo: base },
  ];

  const scelte = [...document.querySelectorAll("#opzioni input:checked")].map(
    (c) => p.opzioni.find((o) => o.id === c.value)
  );

  for (const o of scelte) {
    let importo = 0;
    if (o.tipo === "mq") importo = mq * o.valore;
    if (o.tipo === "pezzo") importo = o.valore;
    if (o.tipo === "percentuale") importo = (base * o.valore) / 100;
    voci.push({ nome: o.nome, importo });
  }

  const unitario = arrotonda(voci.reduce((s, v) => s + v.importo, 0));

  return {
    prodotto: p,
    fornitore: fornitoreSelezionato(),
    larg,
    alt,
    qta,
    mq,
    mqReali,
    voci,
    opzioni: scelte.map((o) => o.nome),
    unitario,
    totale: arrotonda(unitario * qta),
    note: $("note").value.trim(),
  };
}

function aggiornaAnteprima() {
  const r = calcola();
  const err = $("errore");

  if (r.errore) {
    err.textContent = r.errore;
    err.hidden = false;
    $("dettaglio").innerHTML = "";
    $("totaleRiga").textContent = "–";
    $("aggiungi").disabled = true;
    return;
  }

  err.hidden = true;
  $("aggiungi").disabled = false;

  let html = r.voci
    .map((v) => `<div><span>${v.nome}</span><span>${euro(v.importo)}</span></div>`)
    .join("");
  if (r.mqReali < r.mq) {
    html += `<div><span class="hint" style="margin:0">Superficie reale ${r.mqReali.toFixed(
      2
    )} m², applicato il minimo</span></div>`;
  }
  if (r.qta > 1) {
    html += `<div><span>Prezzo unitario × ${r.qta}</span><span>${euro(
      r.unitario
    )}</span></div>`;
  }
  $("dettaglio").innerHTML = html;
  $("totaleRiga").textContent = euro(r.totale);
}

// ---------- Preventivo ----------
function aggiungiRiga() {
  const r = calcola();
  if (r.errore) return;
  righe.push(r);
  $("note").value = "";
  disegnaPreventivo();
}

function rimuoviRiga(i) {
  righe.splice(i, 1);
  disegnaPreventivo();
}

function disegnaPreventivo() {
  $("righe").innerHTML = righe
    .map(
      (r, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>
        <strong>${r.prodotto.nome}</strong>
        <small>${r.fornitore.nome} · ${r.larg} × ${r.alt} mm</small>
        ${r.opzioni.length ? `<small>${r.opzioni.join(", ")}</small>` : ""}
        ${r.note ? `<small>Note: ${r.note}</small>` : ""}
      </td>
      <td class="num">${r.qta}</td>
      <td class="num">${euro(r.totale)}</td>
      <td class="no-print"><button class="rimuovi" data-i="${i}" title="Rimuovi">✕</button></td>
    </tr>`
    )
    .join("");

  $("vuoto").hidden = righe.length > 0;

  const imponibile = righe.reduce((s, r) => s + r.totale, 0);
  const scontoPerc = Math.min(100, Math.max(0, Number($("sconto").value) || 0));
  const scontoValore = arrotonda((imponibile * scontoPerc) / 100);
  const netto = imponibile - scontoValore;
  const iva = arrotonda((netto * L.iva) / 100);

  $("imponibile").textContent = euro(imponibile);
  $("scontoValore").textContent = scontoValore ? "− " + euro(scontoValore) : euro(0);
  $("ivaLabel").textContent = `IVA ${L.iva}%`;
  $("iva").textContent = euro(iva);
  $("totale").textContent = euro(netto + iva);

  aggiornaIntestazioneStampa();
}

function aggiornaIntestazioneStampa() {
  const cliente = $("cliente").value.trim() || "—";
  const data = $("data").value
    ? new Date($("data").value).toLocaleDateString("it-IT")
    : "";
  $("intestazioneStampa").textContent = `Cliente: ${cliente}   ·   Data: ${data}`;
}

// ---------- Avvio ----------
$("data").valueAsDate = new Date();

$("fornitore").addEventListener("change", caricaProdotti);
$("prodotto").addEventListener("change", caricaOpzioni);
["larghezza", "altezza", "quantita", "note"].forEach((id) =>
  $(id).addEventListener("input", aggiornaAnteprima)
);
$("opzioni").addEventListener("change", aggiornaAnteprima);
$("aggiungi").addEventListener("click", aggiungiRiga);
$("righe").addEventListener("click", (e) => {
  const b = e.target.closest(".rimuovi");
  if (b) rimuoviRiga(Number(b.dataset.i));
});
$("sconto").addEventListener("input", disegnaPreventivo);
$("cliente").addEventListener("input", aggiornaIntestazioneStampa);
$("data").addEventListener("input", aggiornaIntestazioneStampa);
$("stampa").addEventListener("click", () => window.print());
$("svuota").addEventListener("click", () => {
  if (righe.length && confirm("Svuotare il preventivo?")) {
    righe = [];
    disegnaPreventivo();
  }
});

caricaFornitori();
disegnaPreventivo();
