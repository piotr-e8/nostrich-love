---
name: sprawdz-seo
description: Gdy dotykamy SEO, hreflang, sitemapy, canonicali albo meta tagów w nostrich.love — i przed każdym większym deployem. Uruchamiaj przy "sprawdź SEO", "hreflang", "sitemapa", "Google nie indeksuje", "canonical", "meta tagi", "pozycje w wyszukiwarce".
---

# SEO / SEO międzynarodowe

```bash
npm run build && npm run verify-seo
```

Skrypt przelatuje wszystkie strony i 7 języków. Sprawdza: sitemapę z adnotacjami hreflang, `html lang` per język, `og:locale`, obecność wszystkich locale, fallback `x-default`.

## Zasady, które łatwo złamać

- **Hreflang musi być w DWÓCH miejscach.** W `<head>` (odkrywanie przy crawlu) i w sitemapie (konsolidacja sygnałów dla Google). Nigdy tylko jedno.
- **Sitemapa jest generowana automatycznie** przez `@astrojs/sitemap` z blokiem `i18n` — żadnych ręcznych `xhtml:link`. Statyczny `public/sitemap.xml` był kiedyś źródłem pomyłek (24 URL-e, zero hreflang, brakujące języki, obok autogenerowanego). Został skasowany. Nie wracać.
- **Nowy język = dopisz go do `scripts/verify-seo.js`.** Inaczej skrypt świeci na zielono, nie sprawdzając nowego locale.
- **Angielski jest bez prefiksu.** Canonical i hreflang dla angielskiego to `/guides/x`, nie `/en/guides/x`. Linkowanie przez redirect marnuje budżet crawlu.

## Stan, którego nie widać w repo

- **Google Search Console jest już zweryfikowane przez DNS.** Grep po repo tego nie znajdzie — nie ma pliku weryfikacyjnego ani meta taga. Nie proponuj ponownej weryfikacji.
- Stronę serwują cztery hosty.
- **Wąskim gardłem są linki zewnętrzne, nie technikalia.** Techniczne SEO jest w dobrym stanie; rekomendacja „popraw meta description" nie ruszy pozycji. Jeśli pytanie brzmi „dlaczego nie rośniemy", odpowiedź prawie na pewno leży poza tym plikiem.

## Referencje

**`docs/SEO_LESSONS_LEARNED.md`** — główne źródło.
**`docs/DEPLOYMENT_CHECKLIST.md` jest nieaktualny** i sam to o sobie pisze w nagłówku. Nie cytuj go.
Bieżący audyt: pamięć `nostrich-seo-audit-2026-08`.
