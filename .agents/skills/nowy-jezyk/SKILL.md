---
name: nowy-jezyk
description: Gdy dodajemy do nostrich.love nowy język. Uruchamiaj przy "dodaj język", "chcę wersję po francusku", "nowe locale", "ile roboty żeby dodać X", "add locale", "new language". NIE do łatania braków w istniejącym języku — do tego jest uzupelnij-tlumaczenia.
---

# Dodanie nowego języka

Osiem miejsc. Pominięcie któregokolwiek daje 404 albo brak wpisu w przełączniku języków — i nie widać tego w buildzie.

## Kolejność

**Zacznij od `src/config/locales.ts`.** To jedyne źródło prawdy. Wszystko, co iteruje (`getStaticPaths`, sitemap, helpery ścieżek), złapie nowy kod stamtąd automatycznie. Dodaj `htmlLang`, `ogLocale`, `name`, `direction`.

| # | Plik | Co zrobić |
|---|------|-----------|
| 1 | `src/config/locales.ts` | kod + `htmlLang`, `ogLocale`, `name`, `direction` |
| 2 | `src/i18n/types.ts` | kod do unii `Locale` |
| 3 | `src/i18n/locales/{kod}.json` | pełne tłumaczenie, klucze 1:1 z `en.json`, camelCase pod `guides` |
| 4 | `src/i18n/locales.server.ts` | statyczny import (serwer ładuje wszystkie, klient jeden) |
| 5 | `src/content/guides/{kod}/` | 16 plików MDX, te same slugi co `en/` |
| 6 | `src/components/LanguageSwitcher.tsx` | wpis do tablicy `languages` (flaga + etykieta) |
| 7 | `astro.config.mjs` | **dwa miejsca**: `i18n.locales` ORAZ mapa `i18n.locales` w sitemapie |
| 8 | `src/pages/progress.astro` | inline script **nie może** importować configu — dopisz do jego tablicy ręcznie |
| 9 | `scripts/verify-seo.js` | bez tego skrypt świeci na zielono, nie sprawdzając nowego języka |

`src/pages/[...lang]/guides/*.astro` nie wymaga ruszania — iteruje `locales` z configu. `src/pages/guides/index.astro` już nie istnieje, angielski leci z trasy rest.

## Pułapki

- **Punkty 8 i 9 to te, które się gubią** — żaden nie wywala buildu.
- **RTL?** Wczytaj `docs/internal/LESSONS_AR_LOCALE.md` PRZED startem, nie po. Logiczne właściwości CSS (`ms-*`, `pe-*`, `start-*`) trzeba mieć od początku, retrofit jest droższy.
- **Poprzednia wersja tej listy wymieniała trzy pliki, które już nie istnieją.** Jeśli coś się nie zgadza z rzeczywistością — wierz kodowi, nie tej tabeli, i popraw tabelę.

## Referencje

`docs/internal/LESSONS_ZH_LOCALE.md` (pierwszy niełaciński) · `LESSONS_AR_LOCALE.md` (RTL, placeholdery, komponenty interaktywne) · `LESSONS_HI_LOCALE.md`

## Zamknięcie

```bash
npm run test && npm run build && npm run check:links && npm run verify-seo
```

`npm run test` sprawdza parity slugów i casing kluczy. `verify-seo` musi pokazać nowy język w hreflang, `html lang` i `og:locale`.
