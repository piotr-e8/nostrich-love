---
name: nostr-relay
description: Gdy grzebiemy w protokole Nostr — pobieranie z przekaźników, WebSockety, profile, model outbox. Uruchamiaj przy "nie pobiera postów", "relay nie odpowiada", "outbox", "kind:10002", "websocket się wiesza", "pokaż profil z nostr", "pusta lista notek".
---

# Praca z przekaźnikami

## Model outbox jest obowiązkowy

Odpytywanie losowych przekaźników gubi posty. Trzy kroki:

```ts
// 1. Bootstrap: lista przekaźników (kind:10002) i profil (kind:0)
const BOOTSTRAP_RELAYS = [
  "wss://relay.damus.io",
  "wss://nos.lol",
  "wss://relay.snort.social",
];

// 2. Parsuj tagi: ["r", "wss://url", "write"] albo ["r", "wss://url"]
//    Bierz tylko oznaczone "write" albo bez markera.

// 3. Dopiero teraz pytaj TE przekaźniki o treść.
```

Sens: idziemy tam, gdzie użytkownik faktycznie publikuje, zamiast zgadywać.

## WebSocket

```ts
// Twardy timeout — inaczej wisi
const timeout = setTimeout(() => resolve(events), 4000);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data[0] === "EVENT") events.push(data[2]);
  if (data[0] === "EOSE") {
    clearTimeout(timeout);
    ws.close();
    resolve(events);   // rozwiąż na PIERWSZYM EOSE
  }
};

// Losowe ID subskrypcji, żeby nie było kolizji
const subId = `req-${Math.random().toString(36).substr(2, 9)}`;
```

**Nie czekaj na wszystkie przekaźniki.** Jeden wolny albo martwy zawiesza cały widok.

## Filtrowanie odpowiedzi

```ts
const isReply = (event: any): boolean =>
  event.tags?.some((tag: string[]) => tag[0] === 'e')   // referuje inne zdarzenie
  || event.content?.trim().startsWith('@');              // zaczyna się od wzmianki
```

## Powtarzalne wtopy

| Wtop | Poprawnie |
|---|---|
| `relay.nostr.mom` | `nostr.mom` — bez prefiksu `relay.` |
| czekanie na wszystkie przekaźniki | rozwiąż na pierwszym EOSE |
| losowe przekaźniki | model outbox (`kind:10002`) |
| pokazywanie wszystkich `kind:1` | odfiltruj odpowiedzi po tagu `e` |
| `t` w zależnościach `useEffect` | `eslint-disable` albo stabilna referencja |

## Głębiej

`docs/internal/NOSTR_KNOWLEDGE.md` — 626 linii. Wczytuj przy realnej robocie protokołowej, nie przy każdej wzmiance o Nostr.

**Publikacja zdarzenia z konta ptrio42 i zmiany na trzech przekaźnikach Piotra wymagają jego „tak".** Czytanie — nie.
