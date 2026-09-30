import { antwortText, herkunftAus, pruefeEingabe } from './logik.js';

// Öffentliche Werte (dürfen in der Seite stehen; Rechte prüft die Datenbank)
const SUPABASE_URL = 'https://lvmtsldzgjoacnxxsncj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_c_PRP0ZYpmbJM143F7LC1A_XsSO4BCY';

// Sobald die App im Store ist: Link hier eintragen – dann werden alle Hauptknöpfe zu „Laden im App Store“
const APP_STORE_URL = '';

const quelle = herkunftAus(window.location.search);

if (APP_STORE_URL) {
  for (const knopf of document.querySelectorAll('[data-hauptaktion]')) {
    knopf.textContent = 'Laden im App Store';
    knopf.setAttribute('href', APP_STORE_URL);
  }
  const store = document.querySelector('[data-store]');
  if (store) {
    store.hidden = false;
    store.setAttribute('href', APP_STORE_URL);
  }
  const text = document.querySelector('[data-warteliste-text]');
  if (text) text.textContent = 'Jetzt kostenlos laden – oder trag dich ein, und wir sagen dir Bescheid, wenn es Neues gibt.';
}

for (const formular of document.querySelectorAll('[data-formular]')) {
  const meldung = formular.querySelector('.rueckmeldung');
  const knopf = formular.querySelector('button');

  const zeige = (text, gut) => {
    meldung.textContent = text;
    meldung.className = `rueckmeldung ${gut ? 'gut' : 'schlecht'}`;
  };

  formular.addEventListener('submit', async (ereignis) => {
    ereignis.preventDefault();
    const daten = new FormData(formular);
    const email = String(daten.get('email') ?? '').trim();
    const stadt = String(daten.get('stadt') ?? '').trim();
    const pruefung = pruefeEingabe({ email, einwilligung: daten.get('einwilligung') === 'on', honig: daten.get('feld-b') });

    if (pruefung.ok === 'bot') {
      zeige(antwortText('neu'), true);
      return;
    }
    if (!pruefung.ok) {
      zeige(pruefung.meldung, false);
      return;
    }

    knopf.disabled = true;
    try {
      const antwort = await fetch(`${SUPABASE_URL}/rest/v1/rpc/warteliste_eintragen`, {
        method: 'POST',
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_email: email, p_stadt: stadt || null, p_quelle: quelle }),
      });
      if (!antwort.ok) throw new Error(String(antwort.status));
      const ergebnis = await antwort.json();
      formular.reset();
      zeige(antwortText(ergebnis), true);
    } catch {
      // Eingaben bleiben stehen, damit man es direkt nochmal versuchen kann
      zeige("Hat nicht geklappt – versuch's gleich nochmal.", false);
    } finally {
      knopf.disabled = false;
      knopf.focus();
    }
  });
}
