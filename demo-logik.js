// Beispiel-Ideen für die Mitmach-Demo – echte Ideen aus der App (Den Haag und Weimar).
// „schatz“ ist die gespielte Entscheidung deines Schatzes.
export const IDEEN = [
  { titel: 'Sonnenuntergang in Scheveningen', text: 'Am Strand entlang bis zum Pier laufen und zuschauen, wie die Sonne im Meer versinkt.', emoji: '🌊', ort: 'Den Haag', schilder: ['kostenlos', 'kurz', 'draußen'], schatz: true },
  { titel: 'Kino im Lichthaus', text: 'Im Lichthaus-Kino laufen besondere Filme abseits vom Mainstream – mit Kino-Gefühl wie früher.', emoji: '🎬', ort: 'Weimar', schilder: ['günstig', 'kurz', 'drinnen'], schatz: false },
  { titel: 'Escape Room', text: 'Zusammen Rätsel lösen unter Zeitdruck – danach wisst ihr, wer von euch die Nerven behält.', emoji: '🔐', ort: 'Überall', schilder: ['darf was kosten', 'kurz', 'drinnen'], schatz: true },
  { titel: 'Drinks am Plein', text: 'Auf einer der Terrassen rund ums Plein sitzen und Leute beobachten.', emoji: '🍹', ort: 'Den Haag', schilder: ['günstig', 'kurz', 'draußen'], schatz: false },
  { titel: 'Picknick im Park an der Ilm', text: 'Decke, Brot und Käse einpacken und an Goethes Gartenhaus vorbei einen Platz am Fluss suchen.', emoji: '🧺', ort: 'Weimar', schilder: ['günstig', 'kurz', 'draußen'], schatz: true },
  { titel: 'Kuchen im Residenz-Café', text: 'Im ältesten Café Weimars, gegründet 1839, ein Stück Torte teilen und die Leute am Markt beobachten.', emoji: '☕', ort: 'Weimar', schilder: ['günstig', 'kurz', 'drinnen'], schatz: true },
];

// Ein Match gibt es nur, wenn beide Ja sagen
export function istMatch(ichJa, schatzJa) {
  return ichJa === true && schatzJa === true;
}
