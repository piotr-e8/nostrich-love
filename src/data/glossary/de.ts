// Deutsches Glossar. Terminologie wie in den de/-Guides etabliert:
// Relay/Relays, Public Key/Private Key, Client, Event, Kind, Feed, Notiz,
// Thread, Follow-Liste, Erwähnung, Reaktion, Zap, Lightning-Adresse,
// Zensurresistenz — durchgehend in Du-Form.
import type { GlossaryData, GlossaryMeta } from './index';

export const meta: GlossaryMeta = {
  seoTitle: 'Nostr-Glossar: npub, nsec, Relays erklärt',
  description:
    'Vollständiges Glossar der Nostr-Begriffe und -Konzepte. Verstehe die wichtigsten Begriffe: npub, nsec, Relays, NIPs, Zaps und mehr.',
};

const de: GlossaryData = {
  nostr: {
    term: 'Nostr',
    definition:
      'Notes and Other Stuff Transmitted by Relays: Notizen und anderes, übertragen durch Relays. Ein dezentrales Protokoll für soziale Medien und andere Anwendungen.',
  },
  npub: {
    term: 'npub',
    definition:
      'Dein Public Key (öffentlicher Identifikator) in Nostr. Kannst du bedenkenlos mit allen teilen. Sieht so aus: npub1...',
  },
  nsec: {
    term: 'nsec',
    definition:
      'Dein Private Key (geheimer Schlüssel) in Nostr. Teile ihn niemals mit irgendjemandem! Sieht so aus: nsec1...',
  },
  relay: {
    term: 'Relay',
    definition:
      'Ein Server, der Nostr-Events speichert und weiterleitet. Nutzer verbinden sich mit Relays, um Inhalte zu veröffentlichen und zu empfangen.',
  },
  client: {
    term: 'Client',
    definition:
      'Eine Anwendung, die sich mit Nostr-Relays verbindet und dich Notizen lesen und veröffentlichen lässt. Beispiele: Primal, Damus, Amethyst, Iris.',
  },
  nip: {
    term: 'NIP',
    definition:
      'Nostr Implementation Possibility. Ein Dokument, das beschreibt, wie bestimmte Nostr-Funktionen implementiert werden. NIP-01 ist das Basisprotokoll.',
  },
  zap: {
    term: 'Zap',
    definition:
      'Eine Bitcoin-Lightning-Zahlung, verknüpft mit einer Nostr-Notiz oder einem Profil. Das Geld fließt über das Lightning-Netzwerk, und Nostr speichert eine öffentliche Quittung. Dient dazu, anderen Nutzern Trinkgeld zu geben oder sie zu unterstützen.',
  },
  nip05: {
    term: 'NIP-05',
    definition:
      'Ein Standard für menschenlesbare Identifikatoren (wie name@domain.com), die Nostr-Public-Keys zugeordnet sind.',
  },
  event: {
    term: 'Event',
    definition:
      'Die grundlegende Dateneinheit in Nostr. Kann eine Notiz (Post), Metadaten, eine Kontaktliste, eine Reaktion oder ein anderer Typ sein.',
  },
  kind: {
    term: 'Kind',
    definition:
      'Eine Zahl, die den Typ eines Events angibt. Kind 1 ist eine Textnotiz (normaler Post), Kind 0 sind Metadaten usw.',
  },
  pubkey: {
    term: 'Pubkey',
    definition:
      'Kurzform von Public Key. Dein Identifikator im Nostr-Netzwerk, abgeleitet aus deinem Private Key.',
  },
  'nsec-format': {
    term: 'nsec (Format)',
    definition:
      'Bech32-kodiertes Format des Private Key. Beginnt mit "nsec1" und muss geheim bleiben.',
  },
  'npub-format': {
    term: 'npub (Format)',
    definition:
      'Bech32-kodiertes Format des Public Key. Beginnt mit "npub1" und kann bedenkenlos öffentlich geteilt werden.',
  },
  feed: {
    term: 'Feed',
    definition:
      'Ein chronologischer Strom von Posts der Konten, denen du folgst, angezeigt in deinem Nostr-Client.',
  },
  'follow-list': {
    term: 'Follow-Liste',
    definition:
      'Eine Liste der Public Keys, denen du folgst, gespeichert als spezielles Event (Kind 3) auf Relays.',
  },
  'relay-list': {
    term: 'Relay-Liste',
    definition:
      'Eine Liste der Relays, die du nutzt, gespeichert als spezielles Event (Kind 10002 nach NIP-65).',
  },
  dm: {
    term: 'DM',
    definition:
      'Direktnachricht (Direct Message). Verschlüsselte private Nachrichten zwischen Nostr-Nutzern. Moderne Clients nutzen NIP-17; das ältere NIP-04 gilt als veraltet, weil es verrät, wer mit wem schreibt.',
  },
  mention: {
    term: 'Erwähnung',
    definition:
      'Verweis auf einen anderen Nutzer in einer Notiz über dessen npub oder NIP-05-Identifikator.',
  },
  hashtag: {
    term: 'Hashtag',
    definition:
      'Themen oder Schlagwörter mit vorangestelltem #, die Inhalte kategorisieren und auffindbar machen.',
  },
  thread: {
    term: 'Thread',
    definition:
      'Eine Reihe verbundener Notizen (Antworten), die eine Unterhaltung bilden.',
  },
  repost: {
    term: 'Boost / Repost',
    definition:
      'Das Teilen der Notiz einer anderen Person mit deinen Followern (Event Kind 6).',
  },
  reaction: {
    term: 'Reaktion',
    definition:
      'Eine einfache Emoji-Antwort auf eine Notiz (Event Kind 7). Meist ein Like (❤️).',
  },
  lnurl: {
    term: 'LNURL',
    definition:
      'Lightning Network URL. Ein Standard für Zahlungsinteraktionen im Lightning-Netzwerk.',
  },
  'lightning-address': {
    term: 'Lightning-Adresse',
    definition:
      'Ein menschenlesbarer Identifikator zum Empfangen von Lightning-Zahlungen (wie name@domain.com).',
  },
  'nostr-address': {
    term: 'Nostr-Adresse',
    definition:
      'Ein NIP-05-Identifikator, der wie eine E-Mail-Adresse aussieht (name@domain.com) und auf deinen npub verweist.',
  },
  'censorship-resistance': {
    term: 'Zensurresistenz',
    definition:
      'Die Möglichkeit, Inhalte zu veröffentlichen, ohne von einer zentralen Instanz blockiert zu werden. Ein Kernmerkmal von Nostr.',
  },
};

export default de;
