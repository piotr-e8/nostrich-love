# Adding New Languages to Nostrich.love

This guide explains how to add support for a new language to the site.

## Quick Overview

The site currently supports 4 languages:
- **en** - English (default)
- **pl** - Polish
- **es** - Spanish  
- **de** - German

To add a new language (e.g., French), follow these steps:

---

## Step 1: Add Locale Configuration

Edit `/src/config/locales.ts`:

```typescript
export const locales = ['en', 'pl', 'es', 'de', 'fr'] as const;  // Add new locale

export const localeConfig: Record<Locale, {
  htmlLang: string;
  ogLocale: string;
  name: string;
}> = {
  // ... existing locales
  fr: {
    htmlLang: 'fr',
    ogLocale: 'fr_FR',
    name: 'Français',
  },
};
```

---

## Step 2: Update Astro Config

Edit `/astro.config.mjs`:

```javascript
i18n: {
  defaultLocale: "en",
  locales: ["en", "pl", "es", "de", "fr"],  // Add new locale
  routing: {
    prefixDefaultLocale: false,
  },
},
```

---

## Step 3: Update Sitemap Config

Edit `/astro.config.mjs` (in the sitemap configuration):

```javascript
sitemap({
  i18n: {
    defaultLocale: 'en',
    locales: {
      en: 'en-US',
      pl: 'pl-PL',
      es: 'es-ES',
      de: 'de-DE',
      fr: 'fr-FR',  // Add new locale
    },
  },
}),
```

---

## Step 4: Create Translation File

Create `/src/i18n/locales/fr.json` with all translation keys from `en.json`.

Example structure:
```json
{
  "guides": {
    "title": "Guides d'apprentissage",
    "description": "Apprenez Nostr étape par étape"
  },
  "ui": {
    "buttons": {
      "next": "Suivant",
      "previous": "Précédent"
    }
  }
}
```

---

## Step 5: Translate Guide Content

Create guides in `/src/content/guides/fr/`:

```bash
mkdir -p src/content/guides/fr
cp src/content/guides/en/*.mdx src/content/guides/fr/
```

Then translate each `.mdx` file content while keeping the same filenames.

---

## Step 6: Update Static Paths

Edit `/src/pages/[lang]/guides/index.astro` to include the new locale:

```javascript
export async function getStaticPaths() {
  return [
    { params: { lang: 'en' } },
    { params: { lang: 'pl' } },
    { params: { lang: 'es' } },
    { params: { lang: 'de' } },
    { params: { lang: 'fr' } },  // Add new locale
  ];
}
```

---

## Step 7: Test

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Run SEO verification:**
   ```bash
   npm run verify-seo
   ```

3. **Check generated pages:**
   ```bash
   ls dist/fr/guides/
   ```

---

## What Happens Automatically

After completing these steps, the new language will automatically:

- ✅ Generate hreflang tags in HTML `<head>`
- ✅ Appear in the sitemap with alternate language links
- ✅ Show correct HTML `lang` attribute (e.g., `lang="fr"`)
- ✅ Display correct OG locale (e.g., `fr_FR`)
- ✅ Work with the language switcher
- ✅ Support all existing features (progress tracking, gamification, etc.)

---

## SEO Considerations

When adding a new language:

1. **Content Quality**: Ensure translations are high quality and culturally appropriate
2. **URL Structure**: Keep English slugs (e.g., `/fr/guides/what-is-nostr` not `/fr/guides/quest-ce-que-nostr`)
3. **Metadata**: Translate meta titles and descriptions
4. **Indexing**: Google will automatically discover and index new language variants via the sitemap

---

## Example: Adding French (Complete)

Here's a complete example for adding French:

**1. locales.ts:**
```typescript
export const locales = ['en', 'pl', 'es', 'de', 'fr'] as const;

export const localeConfig = {
  // ... existing
  fr: { htmlLang: 'fr', ogLocale: 'fr_FR', name: 'Français' },
};
```

**2. astro.config.mjs:**
```javascript
locales: ["en", "pl", "es", "de", "fr"],
// ...
fr: 'fr-FR',
```

**3. Create translation file:**
```bash
cp src/i18n/locales/en.json src/i18n/locales/fr.json
# Edit fr.json to translate all strings
```

**4. Create guide content:**
```bash
cp -r src/content/guides/en/* src/content/guides/fr/
# Translate all .mdx files
```

**5. Update static paths:**
Add `{ params: { lang: 'fr' } }` to getStaticPaths()

**6. Build and verify:**
```bash
npm run build && npm run verify-seo
```

---

## Troubleshooting

### Build Errors

If you get "Translation key not found" warnings:
- Ensure all translation keys in `en.json` exist in the new locale file
- Use English as fallback for missing translations initially

### Missing Pages

If `/fr/guides/` returns 404:
- Check that `getStaticPaths()` includes the new locale
- Verify guide files exist in `/src/content/guides/fr/`

### Hreflang Issues

If SEO verification fails:
- Run `npm run verify-seo` to see detailed error messages
- Check that all steps above are completed
- Ensure build completes without errors

---

## Need Help?

If you encounter issues adding a new language:

1. Check the existing locale implementations as reference
2. Run `npm run verify-seo` to identify specific problems
3. Verify the build output in `dist/` directory
4. Check browser console for any client-side errors

---

*Last Updated: March 2026*
