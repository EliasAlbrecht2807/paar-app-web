// Mitmach-Demo oben auf der Seite: Du wischst, dein Schatz (gespielt) hat verdeckt schon entschieden.
// Sagt ihr beide Ja, kommt der Match-Moment wie in der App.
import { IDEEN, istMatch } from './demo-logik.js';

const demo = document.querySelector('[data-demo]');
if (demo) starte(demo);

function starte(demo) {
  const stapel = demo.querySelector('[data-stapel]');
  const wende = demo.querySelector('[data-wende]');
  const antwortFeld = demo.querySelector('[data-schatz-antwort]');
  const knopfJa = demo.querySelector('[data-ja]');
  const knopfNein = demo.querySelector('[data-nein]');
  const match = demo.querySelector('[data-match]');
  const ende = demo.querySelector('[data-ende]');
  const ansage = demo.querySelector('[data-ansage]');
  const ruhig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let nummer = 0;
  let beschaeftigt = false;

  const warte = (ms) => new Promise((fertig) => setTimeout(fertig, ruhig ? 0 : ms));

  function karteBauen(idee, hinten) {
    const karte = document.createElement('article');
    karte.className = `idee${hinten ? ' hinten' : ''}`;
    if (hinten) karte.setAttribute('aria-hidden', 'true');
    karte.innerHTML = `
      <div class="idee-bild" aria-hidden="true"><span class="idee-emoji">${idee.emoji}</span><span class="idee-ort">${idee.ort}</span></div>
      <div class="idee-text">
        <h2 class="idee-titel"></h2>
        <p class="idee-beschreibung"></p>
        <p class="schilder">${idee.schilder.map((s) => `<span>${s}</span>`).join('')}</p>
      </div>
      <span class="stempel stempel-ja" aria-hidden="true">JA ♥</span>
      <span class="stempel stempel-nein" aria-hidden="true">NÖ</span>`;
    karte.querySelector('.idee-titel').textContent = idee.titel;
    karte.querySelector('.idee-beschreibung').textContent = idee.text;
    return karte;
  }

  function zeigen() {
    stapel.replaceChildren();
    const naechste = IDEEN[nummer + 1];
    if (naechste) stapel.append(karteBauen(naechste, true));
    const karte = karteBauen(IDEEN[nummer], false);
    stapel.append(karte);
    wischbar(karte);
    knopfJa.setAttribute('aria-label', `Ja zu ${IDEEN[nummer].titel}`);
    knopfNein.setAttribute('aria-label', `Nein zu ${IDEEN[nummer].titel}`);
  }

  function aktuelleKarte() {
    return stapel.querySelector('.idee:not(.hinten)');
  }

  // Karte fliegt raus, dann dreht sich die Karte deines Schatzes um
  async function entscheiden(ja) {
    if (beschaeftigt) return;
    beschaeftigt = true;
    knopfJa.disabled = knopfNein.disabled = true;
    const idee = IDEEN[nummer];
    const karte = aktuelleKarte();
    if (navigator.vibrate) navigator.vibrate(12);

    if (karte) {
      karte.style.transition = 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s';
      karte.style.transform = `translateX(${ja ? 130 : -130}%) rotate(${ja ? 18 : -18}deg)`;
      karte.style.opacity = '0';
      karte.querySelector(ja ? '.stempel-ja' : '.stempel-nein').style.opacity = '1';
    }
    await warte(260);

    antwortFeld.className = `wende-vorn ${idee.schatz ? 'ja' : 'nein'}`;
    antwortFeld.innerHTML = idee.schatz
      ? '<span class="antwort-zeichen">Ja</span><span class="antwort-text">will ich auch</span>'
      : '<span class="antwort-zeichen">Nö</span><span class="antwort-text">lieber was anderes</span>';
    wende.classList.add('offen');
    ansage.textContent = `Dein Schatz sagt ${idee.schatz ? 'Ja' : 'Nein'}.`;
    await warte(700);

    if (istMatch(ja, idee.schatz)) {
      zeigeMatch(idee);
      return;
    }
    await weiter();
  }

  async function weiter() {
    wende.classList.remove('offen');
    await warte(320);
    nummer += 1;
    if (nummer >= IDEEN.length) {
      stapel.replaceChildren();
      ende.hidden = false;
      ende.querySelector('.knopf').focus({ preventScroll: true });
      ansage.textContent = 'Alle Beispiel-Ideen angeschaut.';
    } else {
      zeigen();
      knopfJa.disabled = knopfNein.disabled = false;
    }
    beschaeftigt = false;
  }

  function zeigeMatch(idee) {
    match.querySelector('[data-match-emoji]').textContent = idee.emoji;
    match.querySelector('[data-match-idee]').textContent = idee.titel;
    match.hidden = false;
    demo.classList.add('match-offen');
    match.classList.remove('los');
    void match.offsetWidth; // Animation neu starten
    match.classList.add('los');
    if (navigator.vibrate) navigator.vibrate([20, 60, 30]);
    ansage.textContent = `Match! Ihr wollt beide: ${idee.titel}.`;
    match.querySelector('[data-weiter]').focus({ preventScroll: true });
    match.scrollIntoView({ block: 'center', behavior: ruhig ? 'auto' : 'smooth' });
  }

  match.querySelector('[data-weiter]').addEventListener('click', async () => {
    match.hidden = true;
    demo.classList.remove('match-offen');
    await weiter();
    knopfJa.focus({ preventScroll: true });
  });

  ende.querySelector('[data-nochmal]').addEventListener('click', () => {
    ende.hidden = true;
    nummer = 0;
    zeigen();
    knopfJa.disabled = knopfNein.disabled = false;
    knopfJa.focus({ preventScroll: true });
  });

  knopfJa.addEventListener('click', () => entscheiden(true));
  knopfNein.addEventListener('click', () => entscheiden(false));
  demo.addEventListener('keydown', (e) => {
    if (e.target.closest('a, button:not(.rund)')) return;
    if (e.key === 'ArrowRight') entscheiden(true);
    if (e.key === 'ArrowLeft') entscheiden(false);
  });

  // Mit Finger oder Maus wischen – wie in der App
  function wischbar(karte) {
    let start = null;
    const ja = karte.querySelector('.stempel-ja');
    const nein = karte.querySelector('.stempel-nein');
    karte.addEventListener('pointerdown', (e) => {
      if (beschaeftigt) return;
      start = { x: e.clientX, y: e.clientY };
      karte.setPointerCapture(e.pointerId);
      karte.style.transition = 'none';
    });
    karte.addEventListener('pointermove', (e) => {
      if (!start) return;
      const dx = e.clientX - start.x;
      const dy = (e.clientY - start.y) * 0.25;
      karte.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx / 18}deg)`;
      ja.style.opacity = String(Math.max(0, Math.min(1, dx / 90)));
      nein.style.opacity = String(Math.max(0, Math.min(1, -dx / 90)));
    });
    const loslassen = (e) => {
      if (!start) return;
      const dx = e.clientX - start.x;
      start = null;
      if (Math.abs(dx) > 90) {
        entscheiden(dx > 0);
      } else {
        karte.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        karte.style.transform = '';
        ja.style.opacity = nein.style.opacity = '0';
      }
    };
    karte.addEventListener('pointerup', loslassen);
    karte.addEventListener('pointercancel', loslassen);
  }

  zeigen();
}
