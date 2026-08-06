---
d: what-is-nostr
title: What Nostr actually is
summary: A protocol, not a platform — explained in the time it takes to finish a coffee, for the friend who keeps asking.
image: https://nostrich.love/preview_image.png
canonical: https://nostrich.love/guides/what-is-nostr/
tags: [nostr, introduction, beginners]
---

Someone asks you what Nostr is. You have about thirty seconds before their attention goes. Here is the version that works.

**Nostr is a protocol, not an app.** That is the whole trick, and everything else follows from it.

Your account is not a row in a company's database. It is a cryptographic key pair you generate on your own device. The public half (`npub`) is your identity — safe to hand out. The private half (`nsec`) is the only thing that can post as you. No company issues it, no company can revoke it.

Your posts are **events**: small signed JSON objects. Every one carries a `kind` — `1` for a note, `0` for your profile, `3` for who you follow, `30023` for an article like this one — and a signature made with your private key. The signature is what makes an event yours. Nobody can forge it, and nobody can quietly edit it after the fact.

**Relays** are the servers that store and forward those events. They are dumb on purpose: they accept events and hand them out. There is no account to register for and no social graph of their own — some charge for write access, but none of them own your identity. Anyone can run one. You publish to several, and your client reads from several. If one drops you, the others still have your posts, and your identity is untouched because your identity was never stored there in the first place.

**Clients** are the apps. Damus, Amethyst, Primal, Snort, and a dozen more. They all read the same events, so switching clients is not migrating — you import your key and your follows, posts and history come with you, as far as the relays the new client happens to read. That last clause is why your relay list matters more than it first looks.

### What that buys you

No one can ban you from a protocol. A relay can refuse you; the protocol cannot. There is no account to suspend because there is no account — there is a key, and you hold it.

No single algorithm decides your reach. Clients can and do rank feeds — Primal has trending and most-zapped views — but you can switch to one that does not, and none of them own your audience. Discovery otherwise runs on who your follows follow, which is why your first fifty people matter more here than anywhere else.

Payments are native to the culture rather than bolted on. A **zap** is a Bitcoin Lightning tip attached to a post, in sats. It is not a growth hack someone added later; it is how a lot of people here relate to good writing.

### What it costs you

You are responsible for your key. Lose the `nsec` and the identity is gone — permanently, with no help desk and no recovery flow. That is not a bug they will fix. It is the same property that makes the account unbannable.

Deleted posts can persist. A deletion is a request, and relays are free to ignore it. Think before you post, the way you would in public.

And it is rough in places. Fewer people, less polish, more edges. That is the honest trade: you give up convenience and you get an identity nobody can take.

---

If someone wants the longer version, with the interactive bits and in seven languages: https://nostrich.love/guides/what-is-nostr/
