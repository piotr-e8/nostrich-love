---
name: uzupelnij-tlumaczenia
description: Gdy jakiś język ma dziury — brakujące klucze, nieprzetłumaczone poradniki, ostrzeżenia "Translation key not found" przy buildzie. Uruchamiaj przy "brakuje tłumaczeń", "przetłumacz na hindi", "build krzyczy o kluczach", "sprawdź parity", "czy wszystkie języki mają X".
---

# Uzupełnianie tłumaczeń

## Najpierw zmierz, potem tłumacz

Nie zgaduj, czego brakuje. Dwie niezależne listy:

```bash
# Braki w kluczach
jq -S 'paths | join(".")' src/i18n/locales/en.json | sort > /tmp/en.txt
jq -S 'paths | join(".")' src/i18n/locales/hi.json | sort > /tmp/hi.txt
diff /tmp/en.txt /tmp/hi.txt

# Braki w poradnikach
diff <(ls src/content/guides/en/) <(ls src/content/guides/hi/)
```

## Osobno przelatuj komponenty interaktywne

To powtarzalny tryb awarii, nie teoria — zdarzył się dwa razy (Outbox Model Quiz, Zap Simulator istniały tylko po angielsku mimo obowiązkowego i18n). Quizy i symulatory mają własne przestrzenie kluczy i wypadają z ogólnych sprawdzeń:

```bash
for l in en pl es de zh ar hi; do
  printf "%s " "$l"; grep -c "zapSimulator\.\|outboxQuiz\.\|nip05Checker\." "src/i18n/locales/$l.json"
done
```

## Konwencje

Wczytaj `docs/internal/CONTENT_TRANSLATION.md` — ton per język, camelCase pod `guides`, czego nie tłumaczymy (`npub`, `nsec`, `relay`, `NIP` zostają w oryginale we wszystkich językach).

Placeholdery muszą przetrwać tłumaczenie: quizy `{{double}}`, reszta `{single}`. Sprawdź kod komponentu, jeśli nie masz pewności.

Arabski: przy okazji sprawdź, czy komponent używa `ms-*`/`pe-*`/`start-*`, a nie `ml-*`/`pr-*`/`left-*`.

## Zamknięcie

```bash
npm run test && npm run build
```

**Build musi być bez ostrzeżeń o kluczach, nie tylko bez błędów.** Brakujące tłumaczenie leci jako warning i przechodzi build.

Referencja stanu: `docs/internal/TRANSLATION_PARITY_2026-07.md`.
