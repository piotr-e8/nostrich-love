# International SEO Deployment Checklist

> **Goal:** Deploy international SEO changes and verify Google properly indexes all language variants

---

## 📋 Pre-Deployment (Do These First)

### 1. Final Verification
```bash
# Build the project
npm run build

# Run SEO verification
npm run verify-seo

# Expected output:
# ✅ 102 pages built successfully
# ✅ 281 hreflang link elements in sitemap
# ✅ All 4 locales properly configured
```

**Check:** No errors, all tests pass

### 2. Check Critical Files Exist
```bash
ls -la dist/ | grep sitemap
# Expected:
# sitemap-index.xml
# sitemap-0.xml
```

### 3. Verify robots.txt
```bash
cat dist/robots.txt | grep Sitemap
# Expected:
# Sitemap: https://nostrich.love/sitemap-index.xml
```

### 4. Test Sample Pages
Open these URLs in browser and check:
- [ ] `view-source:https://nostrich.love/de/guides/what-is-nostr/`
  - Has `<html lang="de">`
  - Has `og:locale" content="de_DE"`
  - Has 5 hreflang links
- [ ] `view-source:https://nostrich.love/pl/guides/what-is-nostr/`
  - Has `<html lang="pl">`
  - Has `og:locale" content="pl_PL"`

---

## 🚀 Deployment Steps

### Step 1: Deploy to Production
```bash
# Push to your hosting platform
# (Vercel, Netlify, Cloudflare Pages, etc.)

git push origin main
```

**Wait for:** Build to complete successfully

### Step 2: Verify Live URLs
Test these live URLs:
- [ ] https://nostrich.love/sitemap-index.xml (should show index)
- [ ] https://nostrich.love/sitemap-0.xml (should show 101 URLs with hreflang)
- [ ] https://nostrich.love/de/guides/what-is-nostr/ (should load in German)
- [ ] https://nostrich.love/pl/guides/ (should load in Polish)
- [ ] https://nostrich.love/es/guides/ (should load in Spanish)

### Step 3: Check for Mixed Content
```bash
# Ensure no http:// links on https:// pages
curl -s https://nostrich.love/de/guides/what-is-nostr/ | grep -i "http://"
# Expected: No output (no mixed content)
```

---

## 🔍 Google Search Console Setup

### Step 4: Access Google Search Console
1. Go to: https://search.google.com/search-console
2. Select property: `nostrich.love`
3. If not set up, add property via Domain or URL prefix method

### Step 5: Submit Sitemap
1. Navigate to **Sitemaps** (left sidebar)
2. Enter sitemap URL: `sitemap-index.xml`
3. Click **Submit**
4. **Wait:** 5-10 minutes for initial processing

**Expected:** Status shows "Success" with ~101 URLs discovered

### Step 6: Check International Targeting
1. Navigate to **Legacy tools and reports** → **International Targeting**
2. Click **Language** tab
3. **Expected:** Should show hreflang tags detected
4. **Look for:** Any errors like "No return tags" or "Unknown language code"

### Step 7: Request Indexing for Key Pages
For each locale, request indexing:
1. Go to **URL Inspection** tool
2. Test these URLs one by one:
   - `https://nostrich.love/en/guides/what-is-nostr/`
   - `https://nostrich.love/de/guides/what-is-nostr/`
   - `https://nostrich.love/pl/guides/what-is-nostr/`
   - `https://nostrich.love/es/guides/what-is-nostr/`

3. For each URL:
   - Paste URL in search bar
   - Click **Test Live URL**
   - Verify it shows **URL is on Google**
   - Click **Request Indexing** (if not already indexed)

---

## ⏱️ Post-Deployment (Wait 24-72 Hours)

### Step 8: Monitor Indexing Status
After 24 hours, check:

#### A. Coverage Report
1. Go to **Coverage** (left sidebar)
2. Check **Valid** pages count
3. **Expected:** Should increase by ~77 pages (new locale variants)
4. **Check:** No new errors in **Error** or **Valid with warnings**

#### B. Performance Report
1. Go to **Performance** (left sidebar)
2. Filter by country:
   - Germany - should show `/de/` URLs
   - Poland - should show `/pl/` URLs
   - Spain - should show `/es/` URLs

### Step 9: Verify SERP Results
Test Google search in different countries (use VPN or search tools):

**Germany:**
```
site:nostrich.de Nostr Anfänger
```
**Expected:** Shows `/de/guides/` results

**Poland:**
```
site:nostrich.love Nostr przewodnik
```
**Expected:** Shows `/pl/guides/` results

**Spain:**
```
site:nostrich.love Nostr guía
```
**Expected:** Shows `/es/guides/` results

### Step 10: Check for Hreflang Errors
1. Go back to **International Targeting** → **Language**
2. Look for warnings:
   - ❌ "No return tags" - Means page A links to B, but B doesn't link back to A
   - ❌ "Unknown language code" - Invalid hreflang value
   - ❌ "Alternative page" - Page marked as alternate doesn't exist

**If errors exist:**
- Check specific URLs mentioned
- Verify they exist and have proper hreflang
- Fix and re-submit sitemap

---

## 🐛 Troubleshooting Common Issues

### Issue 1: "Sitemap couldn't be fetched"
**Cause:** Server blocking Googlebot or incorrect URL
**Fix:**
```bash
# Test sitemap is accessible
curl -A "Googlebot" https://nostrich.love/sitemap-index.xml
# Should return XML content
```

### Issue 2: "No hreflang tags detected"
**Cause:** Sitemap not being read or incorrect format
**Fix:**
1. Check sitemap is valid XML:
   ```bash
   curl https://nostrich.love/sitemap-0.xml | xmllint --noout -
   ```
2. Verify hreflang format:
   ```bash
   curl -s https://nostrich.love/sitemap-0.xml | grep "xhtml:link"
   ```

### Issue 3: "Duplicate without user-selected canonical"
**Cause:** Google sees `/guides/` and `/en/guides/` as duplicates
**Fix:** 
- This is expected due to `prefixDefaultLocale: false`
- Ensure canonical URLs are set correctly
- Wait for Google to consolidate

### Issue 4: Pages not appearing in localized search
**Cause:** Google hasn't crawled/indexed yet
**Fix:**
- Be patient (can take 1-2 weeks)
- Ensure internal links point to localized versions
- Build backlinks to specific locale URLs

---

## 📊 Success Metrics (Check Weekly)

### Week 1 Targets
- [ ] Sitemap submitted successfully
- [ ] No hreflang errors in Search Console
- [ ] All 4 locales showing in "International Targeting"

### Week 2-4 Targets  
- [ ] German pages appearing in Google.de results
- [ ] Polish pages appearing in Google.pl results
- [ ] Spanish pages appearing in Google.es results
- [ ] Increased organic traffic from Germany, Poland, Spain

### Month 2-3 Targets
- [ ] 50+ indexed pages per locale
- [ ] Click-through rates improving for localized queries
- [ ] No manual actions or penalties

---

## 🔄 Ongoing Maintenance

### Monthly Tasks
- [ ] Check Search Console for new hreflang errors
- [ ] Verify sitemap is still being read (check last read date)
- [ ] Monitor indexing status of new guides
- [ ] Review search performance by country

### When Adding New Guides
- [ ] Add to all 4 language variants
- [ ] Update learning paths if needed
- [ ] Rebuild and re-deploy
- [ ] Request indexing for new URLs
- [ ] Wait 24 hours, verify in Search Console

### When Adding New Languages
See `/docs/ADDING_LOCALES.md` and then:
- [ ] Update sitemap config in `astro.config.mjs`
- [ ] Submit updated sitemap to Search Console
- [ ] Wait for Google to discover new locale
- [ ] Monitor for hreflang errors

---

## 📞 Emergency Contacts / Resources

**If something goes wrong:**

1. **Revert changes:**
   ```bash
   git log --oneline -10
   git revert <commit-hash>
   git push
   ```

2. **Check build logs:**
   ```bash
   npm run build 2>&1 | grep -i error
   ```

3. **Verify SEO integrity:**
   ```bash
   npm run verify-seo
   ```

4. **Google Resources:**
   - Hreflang guidelines: https://developers.google.com/search/docs/specialty/international/localized-versions
   - Search Console Help: https://support.google.com/webmasters
   - Sitemap format: https://www.sitemaps.org/protocol.html

---

## ✅ Final Checklist Summary

Before considering deployment complete:

- [ ] Build passes without errors
- [ ] `npm run verify-seo` shows all green
- [ ] Sitemap submitted to Google Search Console
- [ ] No hreflang errors in International Targeting
- [ ] Sample URLs tested and working
- [ ] 24-48 hours passed for initial indexing
- [ ] Monitoring schedule established

---

## 🎉 You're Done!

Once all checkboxes are marked, your international SEO is live and Google will start serving localized results to users worldwide!

**Next Steps:**
1. Monitor weekly for first month
2. Optimize content based on search performance
3. Consider adding more languages (French, Italian, etc.)

---

*Created: March 2026*  
*Last Updated: March 2026*  
*Applies to: nostrich.love v0.0.1+*
