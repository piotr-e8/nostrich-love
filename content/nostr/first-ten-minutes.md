---
d: first-ten-minutes
title: Your first ten minutes on Nostr
summary: What to actually do after you generate a key, and why an empty feed is the thing that makes most people leave.
image: https://nostrich.love/preview_image.png
canonical: https://nostrich.love/guides/quickstart/
tags: [nostr, onboarding, beginners]
---

Most people who bounce off Nostr do not bounce off the cryptography. They bounce off an empty feed. You sign up, you look at nothing, and you conclude the network is dead.

It is not dead. It is unfiltered, and nobody has filtered it for you yet. Here is the ten minutes that fixes it.

### Pick a client first, not a key

Counterintuitive, but it saves a step. Damus or Primal on iOS, Amethyst or Primal on Android. Each generates a key for you during setup, which is safer than pasting one you made somewhere else.

In a browser, do it differently: install a signer extension — Alby or nos2x — and let it hold the key. The extension signs on request, so the page never sees your `nsec`. Pasting a private key into a web app means trusting that app, and everyone who ever compromises it. This is worth the extra two minutes.

### Back up the key before you do anything else

Your client will show you an `nsec` string. That is the account. Not a password you can reset — the account itself.

Put it in a password manager. Not a screenshot, not a note in the same phone you are logged in on, not a message to yourself. If you lose it, there is nobody to ask, and if someone copies it they are you until you abandon the identity.

Do this before you post, not after. People always mean to do it after.

### Fill the feed

This is the step everyone skips and it is the one that decides whether you stay.

Follow fifty people in the first sitting. Not five, and not ten. Nostr has no algorithm quietly padding your feed out, so the feed is exactly as alive as the list you build.

Two ways to get there fast: find one person whose taste you trust and follow a chunk of who they follow, or grab a curated pack and import it wholesale. Either beats searching for names you already know, which is how most people spend their first hour and why most people quit in the second.

### Set a profile

A name, an avatar, one line about you. An empty profile reads as a bot, because most empty profiles are, and people follow back accordingly.

If you own a domain, add a NIP-05 address later so people see `you@yourdomain.com` instead of `npub1…`. Not urgent. Worth doing eventually.

### Then post something

Anything. A reply is easier than a post — find a conversation and say the thing you were going to think. The etiquette here is closer to a small forum than to a broadcast platform, and replies get read.

---

That is it. Key backed up, fifty follows, a profile, one reply. Everything else — relays, zaps, multiple clients — can wait until you actually want it.

The step-by-step version: https://nostrich.love/guides/quickstart/
A key generator that runs entirely in your browser: https://nostrich.love/tools/key-generator
A curated pack to fill the feed: https://nostrich.love/follow-pack
