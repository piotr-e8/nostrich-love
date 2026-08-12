---
name: przed-wypchnieciem
description: Bramki przed commitem, pushem i deployem nostrich.love — plus co robić, kiedy któraś padnie. Uruchamiaj przy "wypychamy", "gotowe do deployu", "sprawdź czy nic nie zepsułem", "odpal testy", "check przed pushem", "można pushować".
---

# Przed wypchnięciem

Od najtańszej do najdroższej. **Przerwij na pierwszej czerwonej** — kolejne i tak będą kłamać.

```bash
npm run typecheck
npm run test
npm run build
npm run check:links
npm run verify-seo
npm run check:labels   # tylko jeśli ruszaliśmy formularze
```

## Jak czytać padnięcia

| Bramka | Co łapie | Najczęstsza przyczyna |
|---|---|---|
| `typecheck` | typy Astro/TS | brak rzutowania `locale as Locale` przy przekazywaniu do `Layout` |
| `test` | parity slugów, casing kluczy, integralność treści | slug dodany w jednym języku; poradnik w innym języku linkujący na ścieżkę angielską |
| `build` | **ostrzeżenia** o kluczach | brakujące tłumaczenie — leci jako warning i przechodzi, jeśli patrzysz tylko na kod wyjścia |
| `check:links` | martwe i przekierowane linki | ręcznie sklejony URL zamiast `guidePath()`; link na `/en/`, który tylko przekierowuje |
| `verify-seo` | hreflang, `html lang`, `og:locale` | nowy język niedopisany do `scripts/verify-seo.js` |

## Zasady

- **`npm run build` czytaj z ostrzeżeniami.** Zielony exit code przy brakujących tłumaczeniach to normalny stan, nie sukces.
- **Nie raportuj „gotowe", jeśli bramka nie przeszła.** Powiedz która i pokaż wyjście.
- Liczby z pierwszego przebiegu (ile plików, ile wystąpień, ile testów) potwierdź drugą, niezależną metodą albo nazwij szacunkiem.

## Nieodwracalne — wymagają „tak" od Piotra

Push na `main`, deploy, publikacja zdarzenia na nostr z konta **ptrio42**, zmiany na trzech przekaźnikach. Zielone bramki nie są zgodą.
