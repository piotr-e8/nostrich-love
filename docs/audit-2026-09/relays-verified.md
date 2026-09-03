# Relay verification, 2026-09-02, NIP-11 fetched per host
Use ONLY this table. Do not add a relay that is not listed alive here.

| host | status | operator's own NIP-11 description |
|---|---|---|
| christpill.nostr1.com | alive-free | For followers and seekers of Christ |
| news.utxo.one | alive-free | NewsBot Feed from major publications |
| nos.lol | alive-free | Generally accepts notes, except spammy ones. |
| relay.damus.io | alive-free | Damus strfry relay |
| relay.primal.net | alive-free | Primal Public Relay |
| relay.snort.social | alive-free | High-performance in-memory Nostr relay |
| chillstr.nostr1.com | alive-paid — 111000 msats admission fee (limitation.payment_required: true) | Meditation, mindfulness, chill moments for some deep breaths |
| nostr.wine | alive-paid — admission fee 18888000 msats (~18,888 sats), per limitation.payment_required=true and fees.admission | A paid nostr relay for wine enthusiasts and everyone else. |
| relay.holoboard.space | alive-paid — No explicit limitation/fees block, but the operator's own description states every note is paid for and posting requires payment (sats) — this is a pay-to-post bulletin board, not something a beginner can just write to for free. | A bulletin board where the order is decided by sats and nothing else. Every note was paid  |
| spatia-arcana.com | alive-restricted — false (payment_required:false in limitation, but restricted_writes:true) | "I am large, I contain multitudes" - Walt Whitman |
| purplepag.es | could-not-determine |  |
| 140.fz7.io | dead |  |
| knots.nostr.technology | dead |  |
| nostr.plebs.network | dead |  |
| relay.bitcoiner.social | dead |  |
| relay.current.fyi | dead |  |
| relay.eden.nostr.land | dead |  |
| relay.f7z.io | dead |  |
| relay.hivetech.ovh | dead |  |
| relay.nostr.bg | dead |  |
| relay.nostrdice.com | dead |  |
| relay.sdamus.io | dead |  |
| relay.stacker.news | dead |  |
| relay.url | dead |  |
| relay.vera.live | dead |  |
| relay.welshman.com | dead |  |
| relay.yabu.me | dead |  |

## Notes that matter

- **relay.bitcoiner.social is NXDOMAIN, but the relay itself is alive at `bitcoiner.social`**
  (also `nostr.bitcoiner.social`), free and open, strfry, own description: "A fast, reliable, and
  up-to-date nostr relay with monitored server availability and nightly off-site backups."
  This is a hostname typo in our data, not a dead service. Fix the hostname, keep the relay.
- **spatia-arcana.com sets `restricted_writes: true`.** It is fine to browse and it is what
  finding-community recommends for reading a relay feed, but not everyone can post to it.
- **purplepag.es could not be determined**: 502 from its own Caddy proxy, repeatedly, but the TLS
  certificate was renewed three weeks ago, so somebody is maintaining it. Leave it alone, do not
  delete it, and do not claim it is up either.
- **nostr.plebs.network serves a certificate for an unrelated VPN host.** The real Nostr Plebs
  relay is `relay.nostrplebs.com`.
- Free and usable today, the only ones a beginner can be sent to without a caveat:
  relay.damus.io, nos.lol, relay.primal.net, relay.snort.social, christpill.nostr1.com (Christian
  community), news.utxo.one (a news bot feed, not a general relay).
