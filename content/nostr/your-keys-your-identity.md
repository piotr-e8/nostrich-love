---
d: your-keys-your-identity
title: Your keys are your identity, and that cuts both ways
summary: Why there is no password reset on Nostr, what an nsec leak actually costs you, and the handful of habits worth forming early.
image: https://nostrich.love/preview_image.png
canonical: https://nostrich.love/guides/keys-and-security/
tags: [nostr, security, keys]
---

Every platform you have used before had a way back in. Forgot the password, lost the phone, account hacked — there was a form, and eventually a human. That system is also the thing that lets a company lock you out, hand your account to someone else, or delete you.

Nostr does not have that system. It is the same fact stated twice.

### The two strings

Your `npub` is your public key. It identifies you, it is derived from the private key, and it is safe to put anywhere.

Your `nsec` is your private key. Anything signed with it is you, forever, to everyone. There is exactly one of them and no way to make another for the same identity.

They look similar and they start with similar characters, and people do paste the wrong one into a form. If you only remember one thing: **`nsec` never leaves your password manager**.

### What a leak actually costs

Not "someone posts something embarrassing." Someone *is you*. They post as you, they DM your contacts as you, they change your profile, and every one of those events carries a valid signature — because it is valid. Relays cannot tell the difference and neither can your followers.

There is no revocation. You cannot rotate the key and keep the identity; rotating the key *is* a new identity. The recovery path is: post from the old key while you still can, tell people the new npub, and rebuild the follower graph by hand.

That is why this is worth ten minutes now rather than an afternoon later.

### The habits that matter

**Back up the nsec properly, in more than one place.** A password manager *and* paper somewhere you would keep a passport. One copy is one accident away from nothing. Not a screenshot. Not a note on the phone you are logged in on. Not a DM to yourself — that is a message signed by the key you are trying to protect.

**Use a signer extension on desktop.** Alby, nos2x, or similar. The extension holds the key and signs on request, so no website ever receives it. Pasting an `nsec` into a web app means trusting that app and everyone who ever compromises it.

**Treat every "connect your account" prompt as a key request.** If a site asks for your `nsec` rather than asking your signer to sign, close the tab. Legitimate apps do not need it and do not ask.

**Consider a second identity for experiments.** Keys are free. If you want to try a client you do not trust yet, try it with a key that is not your real one.

### The trade, stated plainly

You are accepting a failure mode with no recovery, in exchange for an identity nobody can revoke. That is a genuinely good deal for some people and a bad one for others, and it is worth deciding on purpose rather than discovering it the hard way.

---

The full guide, with a backup checklist and a key generator that never sends anything to a server: https://nostrich.love/guides/keys-and-security/
