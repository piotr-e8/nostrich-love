---
name: komponent-interaktywny
description: Gdy robimy quiz, symulator albo inny klikalny komponent w nostrich.love. Uruchamiaj przy "zrób quiz", "dodaj symulator", "ten quiz się sypie", "nowy komponent interaktywny", "quiz nie pokazuje postępu", "komponent nie działa po polsku".
---

# Komponent interaktywny

## Zacznij od wzorca, nie od zera

Otwórz `src/components/interactive/WhatIsNostrQuiz.tsx` i skopiuj strukturę. Każdy quiz napisany od zera odtwarzał te same trzy błędy.

## Placeholdery — dwie konwencje, łatwo pomylić

```ts
// Quizy: podwójne klamry
t('quiz.progress', { current: '{{current}}', total: '{{total}}' })

// Nawigacja i reszta: pojedyncze
t('navigation.level', { level: '{level}' })
```

**Zawsze sprawdź `replace()` w kodzie komponentu przed napisaniem tłumaczenia.** Zła konwencja nie wywala buildu — placeholder po prostu zostaje w tekście na stronie.

## Klucze wyprowadzaj z kodu, nie z wyobraźni

```bash
grep -n "t('nazwaKomponentu\." src/components/**/*.tsx
```

Udokumentowany wtop: agent wymyślił strukturę `nip05Checker.messages.*` i `nip05Checker.instructions.*`, a komponent oczekiwał `nip05Checker.benefits.*`, `.form.*`, `.results.*`. **Nigdy nie ufaj strukturze tłumaczeń wygenerowanej przez agenta bez sprawdzenia w kodzie.**

## Hydracja

`client:idle`. Nie `client:load` — kiedyś było ich 429 i cały React, framer-motion i każdy quiz montowały się, zanim strona skończyła się ładować.

`client:visible` byłoby lepsze, ale **nie da się go zweryfikować w tutejszym panelu przeglądarki**: `document.hidden` zostaje `true`, Chrome usypia IntersectionObserver w ukrytym dokumencie i komponent nigdy się nie hydratuje. Wygląda to na zepsute, choć nie jest. Przełączaj tylko po potwierdzeniu w prawdziwym Chrome.

Komponent bez potrzeby JS nie dostaje dyrektywy w ogóle. `FAQAccordion` był 29 rootami Reacta na stronę, dopóki nie stał się komponentem `.astro` opakowującym `<details>/<summary>` — zero JS, działa przed hydracją i z wyłączonym JS.

## RTL

`ms-*` / `me-*` / `ps-*` / `pe-*` / `start-*` / `end-*`. Nigdy `ml-*` / `pl-*` / `left-*` — te nie odbijają się w trybie RTL. Projekt ma plugin `tailwindcss-rtl`.

## Nie kończ, dopóki klucze nie są w siedmiu plikach

```bash
for l in en pl es de zh ar hi; do
  printf "%s: " "$l"; grep -c "nazwaKomponentu\." "src/i18n/locales/$l.json" || echo BRAK
done
```

Zdarzyło się **dwa razy**, że quiz istniał wyłącznie po angielsku mimo „obowiązkowego" i18n (Outbox Model Quiz, Zap Simulator). Reguła nie wystarcza — sprawdź.

```bash
npm run test && npm run build
```
