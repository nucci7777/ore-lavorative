let tratte = [];

function parseTime(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function diffMinutes(start, end) {
  return end >= start ? end - start : (24 * 60 - start) + end;
}

function formatDuration(min) {
  return `${Math.floor(min/60)}h ${String(min%60).padStart(2,"0")}m`;
}

function calcolaOrari(inizio, fine) {
  const tot = diffMinutes(inizio, fine);
  let notturne = 0;
  for (let i = 0; i < tot; i++) {
    const ora = Math.floor((inizio + i) / 60) % 24;
    if (ora >= 22 || ora < 6) notturne++;
  }
  return { tot, notturne, diurne: tot - notturne };
}

function calcolaBuonoPasto(inizio, fine) {
  const tot = diffMinutes(inizio, fine);
  if (tot > 360) return true;

  const fasce = [
    [11*60, 15*60],
    [18*60, 22*60]
  ];

  for (const [fStart, fEnd] of fasce) {
    const overlap = Math.max(0, Math.min(fine, fEnd) - Math.max(inizio, fStart));
    if (overlap >= 120) return true;
  }
  return false;
}

function calcolaLavoro() {
  const inizio = document.getElementById("inizio").value;
  const fine = document.getElementById("fine").value;
  if (!inizio || !fine) {
    document.getElementById("risultatoLavoro").textContent = "⚠️ Inserisci orari validi.";
    return;
  }

  const start = parseTime(inizio);
  const end = parseTime(fine);
  const r = calcolaOrari(start, end);
  const buono = calcolaBuonoPasto(start, end);

  document.getElementById("risultatoLavoro").textContent = 
    `Totale: ${formatDuration(r.tot)}\n` +
    `Diurne: ${formatDuration(r.diurne)}\n` +
    `Notturne: ${formatDuration(r.notturne)}\n` +
    (buono ? "🍽️ Hai diritto a 1 buono pasto" : "🚫 Nessun buono pasto spettante");
}

function aggiungiTratta() {
  const campo = document.getElementById("nuovaTratta");
  const valore = campo.value.trim();
  if (!valore.includes("-")) return;
  tratte.push(valore);
  campo.value = "";
  aggiornaLista();
}

function aggiornaLista() {
  const lista = document.getElementById("listaTratte");
  lista.innerHTML = tratte.map(t => `<li>${t}</li>`).join("");
  calcolaGuida();
}

function calcolaGuida() {
  let totale = 0;
  for (const t of tratte) {
    const [start, end] = t.split("-");
    if (start && end) totale += diffMinutes(parseTime(start), parseTime(end));
  }
  document.getElementById("risultatoGuida").textContent = 
    `Totale guida: ${formatDuration(totale)}`;
}

function resetTratte() {
  tratte = [];
  aggiornaLista();
}
