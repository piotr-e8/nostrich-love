# nostrich.love

Platforma edukacyjna o Nostr. Astro + React + Tailwind. 7 języków: `en, pl, es, de, zh, ar` (RTL), `hi`. Po 16 poradników na język.

**Odbiorca: twórcy** — piszący, artyści, muzycy. **Nie deweloperzy.** Nostr ma już narzędzia dla devów; tu budujemy drzwi wejściowe. Funkcja, która wymaga wiedzy technicznej, jest chybiona, nawet jeśli działa.

## Twarde reguły

Łamie je zwykła edycja pliku, dlatego są tutaj, a nie w dokumentacji.

- **Zero hardcoded stringów.** Zawsze `t()` (React) albo `getTranslations()` (Astro).
- **Angielski jest bez prefiksu.** Używaj `guidePath()` / `guidesIndexPath()` / `localePath()` z `@/i18n/paths`. `/en/` tylko przekierowuje — link przez redirect to bug, nie kwestia stylu. Wyjątek: inline `<script>` w `.astro` nie może importować helpera, więc liczy prefiks lokalnie.
- **`src/config/locales.ts` to jedyne źródło prawdy o językach.** Nie hardkoduj list locale.
- **Dark mode:** `dark:bg-gray-900`. Nigdy `dark:bg-gray-900/50` — wychodzi brudny brąz.
- **Hydracja:** `client:idle`. Nie `client:load`. Komponent, który nie potrzebuje JS, nie dostaje żadnej dyrektywy.
- **Dwie konwencje placeholderów:** quizy `{{double}}`, reszta `{single}`. Zawsze sprawdź `replace()` w kodzie komponentu, zanim napiszesz tłumaczenie.
- **RTL:** `ms-*` / `me-*` / `ps-*` / `pe-*` / `start-*` / `end-*`. Nigdy `ml-*` / `pl-*` / `left-*`.

## Bramki

```bash
npm run typecheck && npm run test && npm run build && npm run check:links && npm run verify-seo
```

`npm run build` czytaj z ostrzeżeniami, nie tylko po kodzie wyjścia — brakujące klucze tłumaczeń lecą jako warning, nie error.

## Nieodwracalne w tym projekcie

Wymagają mojego „tak": deploy, publikacja zdarzenia na nostr z konta **ptrio42**, zmiany na trzech przekaźnikach, push na `main`.

## Gdzie reszta

Szczegóły w `docs/internal/` (~6300 linii) — ładowane na żądanie, nigdy hurtem. Do konkretnych zadań są skille: `nowy-jezyk`, `nowy-poradnik`, `komponent-interaktywny`, `uzupelnij-tlumaczenia`, `sprawdz-seo`, `przed-wypchnieciem`, `nostr-relay`, `domkniecie-sesji`. Leżą w `.agents/skills/` i są symlinkowane do `.claude/skills/` — obie strony w repo, patrz `.agents/skills/README.md`.

`docs/internal/AGENTS_LEGACY.md` to poprzednia, 754-linijkowa wersja tego pliku — trzymana dla historii, zawiera lekcje 1–16. Nie jest ładowana i częściowo jest nieaktualna.

## Słownik

**npub** klucz publiczny (bezpieczny) · **nsec** klucz prywatny (NIGDY nie udostępniać) · **relay** przekaźnik · **NIP** specyfikacja protokołu
