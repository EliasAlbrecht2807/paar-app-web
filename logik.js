// Formular-Logik der Landingpage (ohne DOM, getestet)
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

export function pruefeEingabe({ email, einwilligung, honig }) {
  // Menschen sehen das Feld nicht – ist es gefüllt, war es ein Bot
  if (honig) return { ok: 'bot' };
  if (!EMAIL.test(String(email ?? '').trim())) return { ok: false, meldung: 'Bitte gib eine gültige E-Mail-Adresse ein.' };
  if (!einwilligung) return { ok: false, meldung: 'Bitte setz das Häkchen, damit wir dir schreiben dürfen.' };
  return { ok: true };
}

// Kürzel aus ?von=… (z. B. tiktok-denhaag): nur Kleinbuchstaben, Ziffern, - und _
export function herkunftAus(suche) {
  const roh = new URLSearchParams(suche || '').get('von');
  if (!roh) return null;
  const sauber = roh.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 60);
  return sauber || null;
}

// Gleiche Rückmeldung für neu und bereits eingetragen – verrät Fremden nicht, wer auf der Liste steht
export function antwortText(_ergebnis) {
  return 'Danke! Wir melden uns, sobald die App startet. 💞';
}
