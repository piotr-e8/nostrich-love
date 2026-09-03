// Polski słownik pojęć. Terminologia zgodna z przewodnikami pl/:
// relay (relaye/relayów), klucz publiczny/prywatny, klient, event, kind,
// feed, lista obserwowanych, wzmianka, reakcja, zap, adres Lightning,
// odporność na cenzurę.
import type { GlossaryData, GlossaryMeta } from './index';

export const meta: GlossaryMeta = {
  seoTitle: 'Słownik pojęć Nostr: npub, nsec, relay i więcej',
  description:
    'Kompletny słownik pojęć i terminów Nostr. Zrozum kluczowe hasła: npub, nsec, relaye, NIP-y, zapy i wiele więcej.',
};

const pl: GlossaryData = {
  nostr: {
    term: 'Nostr',
    definition:
      'Notes and Other Stuff Transmitted by Relays, czyli notatki i inne rzeczy przesyłane przez relaye. Zdecentralizowany protokół dla mediów społecznościowych i innych aplikacji.',
  },
  npub: {
    term: 'npub',
    definition:
      'Twój klucz publiczny (publiczny identyfikator) w Nostr. Możesz go bezpiecznie udostępniać każdemu. Wygląda tak: npub1...',
  },
  nsec: {
    term: 'nsec',
    definition:
      'Twój klucz prywatny (tajny klucz) w Nostr. Nigdy nikomu go nie udostępniaj! Wygląda tak: nsec1...',
  },
  relay: {
    term: 'Relay',
    definition:
      'Serwer, który przechowuje i przekazuje eventy Nostr. Użytkownicy łączą się z relayami, aby publikować i odbierać treści.',
  },
  client: {
    term: 'Klient',
    definition:
      'Aplikacja, która łączy się z relayami Nostr i pozwala czytać oraz publikować notatki. Przykłady: Primal, Damus, Amethyst, Iris.',
  },
  nip: {
    term: 'NIP',
    definition:
      'Nostr Implementation Possibility. Dokument opisujący, jak zaimplementować konkretne funkcje Nostr. NIP-01 to podstawowy protokół.',
  },
  zap: {
    term: 'Zap',
    definition:
      'Płatność Bitcoin Lightning powiązana z notatką lub profilem w Nostr. Pieniądze idą siecią Lightning, a Nostr zapisuje publiczne potwierdzenie. Służy do dawania napiwków i wspierania innych użytkowników.',
  },
  nip05: {
    term: 'NIP-05',
    definition:
      'Standard czytelnych dla człowieka identyfikatorów (takich jak nazwa@domena.com) przypisanych do kluczy publicznych Nostr.',
  },
  event: {
    term: 'Event',
    definition:
      'Podstawowa jednostka danych w Nostr. Może to być notatka (post), metadane, lista kontaktów, reakcja lub inny typ.',
  },
  kind: {
    term: 'Kind',
    definition:
      'Liczba określająca typ eventu. Kind 1 to notatka tekstowa (zwykły post), Kind 0 to metadane itd.',
  },
  pubkey: {
    term: 'Pubkey',
    definition:
      'Skrót od public key, czyli klucz publiczny. Twój identyfikator w sieci Nostr, wyprowadzany z klucza prywatnego.',
  },
  'nsec-format': {
    term: 'nsec (format)',
    definition:
      'Format klucza prywatnego zakodowanego w Bech32. Zaczyna się od "nsec1" i musi pozostać tajny.',
  },
  'npub-format': {
    term: 'npub (format)',
    definition:
      'Format klucza publicznego zakodowanego w Bech32. Zaczyna się od "npub1" i można go bezpiecznie udostępniać publicznie.',
  },
  feed: {
    term: 'Feed',
    definition:
      'Chronologiczny strumień postów od obserwowanych kont, wyświetlany w Twoim kliencie Nostr.',
  },
  'follow-list': {
    term: 'Lista obserwowanych',
    definition:
      'Lista kluczy publicznych, które obserwujesz, zapisana jako specjalny event (Kind 3) na relayach.',
  },
  'relay-list': {
    term: 'Lista relayów',
    definition:
      'Lista relayów, z których korzystasz, zapisana jako specjalny event (Kind 10002 zgodnie z NIP-65).',
  },
  dm: {
    term: 'DM',
    definition:
      'Wiadomość bezpośrednia (Direct Message). Szyfrowane prywatne wiadomości między użytkownikami Nostr. Nowoczesne klienty używają NIP-17; starszy NIP-04 jest wycofany, bo ujawnia, kto z kim pisze.',
  },
  mention: {
    term: 'Wzmianka',
    definition:
      'Odwołanie do innego użytkownika w notatce za pomocą jego npub lub identyfikatora NIP-05.',
  },
  hashtag: {
    term: 'Hashtag',
    definition:
      'Tematy lub słowa kluczowe poprzedzone znakiem #, które kategoryzują treści i ułatwiają ich odkrywanie.',
  },
  thread: {
    term: 'Wątek',
    definition: 'Seria powiązanych notatek (odpowiedzi) tworząca rozmowę.',
  },
  repost: {
    term: 'Boost / Repost',
    definition:
      'Udostępnienie cudzej notatki swoim obserwującym (event Kind 6).',
  },
  reaction: {
    term: 'Reakcja',
    definition:
      'Prosta odpowiedź emoji na notatkę (event Kind 7). Zwykle polubienie (❤️).',
  },
  lnurl: {
    term: 'LNURL',
    definition:
      'Lightning Network URL. Standard interakcji płatniczych w sieci Lightning.',
  },
  'lightning-address': {
    term: 'Adres Lightning',
    definition:
      'Czytelny dla człowieka identyfikator do odbierania płatności Lightning (np. nazwa@domena.com).',
  },
  'nostr-address': {
    term: 'Adres Nostr',
    definition:
      'Identyfikator NIP-05, który wygląda jak adres e-mail (nazwa@domena.com) i wskazuje na Twój npub.',
  },
  'censorship-resistance': {
    term: 'Odporność na cenzurę',
    definition:
      'Możliwość publikowania treści bez ryzyka zablokowania przez centralny organ. Kluczowa cecha Nostr.',
  },
};

export default pl;
