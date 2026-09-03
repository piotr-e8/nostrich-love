# Fact sheet, verified at source 2026-09-02

Facts established for the content fixes, each checked against the project's own repo,
store listing, site or the NIP text. Kept in the repo on purpose: the first copy lived in
a scratchpad under `/private/tmp` and was wiped mid-run, leaving agents to work blind.

Rule this sheet exists to enforce: **do not delete content on suspicion.** A timeout, a 403,
a bot block or an empty search is not evidence of death. Where a row says the matter is
unresolved, leave the existing text alone.

Two audit findings were confidently wrong and would have deleted true content:
"Primal Signer is an invented product" and "BlueWallet dropped Lightning". Both are corrected below.

## Clients and their capabilities

- **Primal signing.** Real, but not called "Primal Signer". Primal's App Store listing says
  "Primal can also be used to authorize activity in compatible Nostr apps using Remote Login".
  Android added NIP-46 remote signing and NIP-55 local signing in v2.6.18. Neither the listing nor
  the release notes advertise FaceID/TouchID key protection; the iOS listing mentions iCloud
  Keychain private key backup, which is a different thing.
- **Damus does NOT support NIP-17** as of 2026-09-02. Re-verified by hand: the README spec table
  lists NIP-04 and not 17/44/59; the source tree has `damus/Core/NIPs/NIP44/NIP44.swift` but no
  gift wrap or NIP-59 files; `damus/Core/Nostr/NostrKind.swift` defines `case dm = 4` with no kind
  1059 or 1060; interop bug nostrability#152 reports Amethyst NIP-17 DMs invisible in Damus.
  Latest tag v1.17. A search summary claiming gift wrap shipped in "v0.7.0/v0.7.1" is wrong,
  those are not Damus version numbers.
- **NIP-17 support, from each project's own docs:** Amethyst yes (README lists NIP-17, NIP-44,
  NIP-59), 0xchat yes and by default ("We use NIP-17 as our default DM type"), Coracle yes
  (README checklist "[x] NIP 17 DMs"). **Primal: unverified**, no primary source either way.
  Do not assert support and do not assert its absence.
- **Coracle has no Matrix integration.** Its README lists relay management, web-of-trust
  moderation, privacy options, NIP-96 uploads, NIP-51 feeds, NIP-42 AUTH.
- **noStrudel** is a protocol sandbox for power users ("lets a user explore the nostr protocol by
  showing as much information as possible"), not a long-form writing client.
- **YakiHonne** is a global long-form and media client on web, iOS, Android and desktop.
  Nothing supports calling it "Japanese-focused".
- **Amethyst is Android only.** An iOS port is in progress (PR #3047) and unreleased.
- **Amber** ships via Zap Store, Obtainium, GitHub releases and F-Droid. **Not on Google Play.**
- **Plebstr is now Openvibe.** plebstr.com says "Plebstr is becoming Openvibe. Join us there!"
  and the Play Store entry for com.plebstr.client is now Openvibe.
- **Current is dead.** Repo last pushed 2023-12-21, App Store lookup for id 1668517032 returns
  zero results, current.fyi times out, and relay.current.fyi has no DNS record at all.
- **Nostros** archived by its owner on 2025-10-09. **Nos** unmaintained, site 404.
- **habla.news returns HTTP 404** on direct fetch, checked twice.
- **Wisp** has no web app any more; it is a mobile client.

## Signers and extensions

- **Nostash** is a live Safari/iOS NIP-07 extension, App Store id6744309333.
- **Nostore** is dead, its App Store link 404s.
- **nos2x** is live in the Chrome Web Store at id kpgefcfmnafjgpblomihpgmejjdanjjp. Alby still works.
- **nsec.app** is alive. The maintainers' own repo (`nostrband/noauth`) says the app is
  "hosted at use.nsec.app", so prefer that URL. Direct fetches failed from the tooling network
  path, which is not evidence of an outage; the repo has 615 commits and live user-filed issues.

## Money

- **BlueWallet still ships a Lightning wallet.** What shut down was its free custodial Lndhub
  hosting, on 2023-05-31. Lightning now requires connecting to a self-hosted LNDHub instance.
  The audit's "dropped Lightning support" was an overstatement.
- **Alby** shut down its custodial shared wallet on 2025-01-04. Self-custodial only now.
- **BTC on 2026-09-01/02** traded around $77,000 to $78,000, converging near $77,500.
  Any sat-to-dollar figure written for ~$30k BTC is stale by roughly 2.6x.
- **nostr.wine admission fee** is 18,888,000 msats, i.e. 18,888 sats. Verified by hand from the
  relay's own NIP-11 document (`fees.admission`). It is a paid relay and cannot be a free default.

## Relays and services

- **Starter relays, live NIP-11 checks:** relay.damus.io, nos.lol, relay.primal.net, nostr.mom
  and relay.snort.social are all alive and free to write to. Note relay.snort.social now runs
  `memlay` and advertises only NIP 1 and 11.
- **relay.nostr.band: UNRESOLVED.** DNS resolves but every connection on port 443 failed across
  four independent paths, with no report of a shutdown anywhere. Leave it in the text and have a
  human check it with a real Nostr client.
- **Spatia Arcana (wss://spatia-arcana.com) is alive**, verified by hand: it answers NIP-11 with a
  proper relay document.
- **Dead hostnames (NXDOMAIN, not merely unreachable):** relay.nostrdevs.com, relay.nostrich.art,
  nostrfiles.com, stats.otherstuff.org, nostr.guru, nostr2twitter.com, void.cat, NostrName.com,
  NostrID.com. nostr.bitcoiner.social is alive.
- **nostr.build** is alive. **nostrimg.com** now 307-redirects into nostr.build.
- **Live NIP-05 providers:** nostrplebs.com, nostrcheck.me, iris.to, primal.net.
- **Stats:** use stats.nostr.band. Treat user counts as unreliable regardless of source.
- **Crossposting:** the Mastodon/Twitter crossposter shut down end of January 2023.
  Xstr (xtonostr.com) is live. "NostrPad" could not be found to have ever existed as a Nostr
  crossposting tool, so do not describe it as dead either.
- **github.com/nostr-tools/nip05 does not exist** (404). **strfry is C++**, not Rust.

## Network facts

- **Nostr has no defensible active-user figure.** Readings range from tens of thousands weekly
  active to ~33.5M cumulative pubkeys dominated by bots and abandoned keys. The "~5M users"
  claim has no source. Say plainly that nobody knows.
- **Bluesky** was around 43.5M registered users in April 2026; treat any September 2026 number as
  an estimate. Open federation shipped (May 2024). PDS self-hosting shipped but is capped
  (10 accounts, 1,500 events/hour, 10,000/day). Fediverse bridging works via the third-party
  Bridgy Fed, not a first-party feature.
- **Bluesky privacy claims are false on all three counts:** no phone verification requirement,
  no real-name policy (the guidelines explicitly allow alternative identities), and no
  protocol-level privacy controls (everything is public by default, DMs are not end-to-end
  encrypted).

## Protocol facts, verified against the NIP texts by hand

- **Key format.** A bech32 npub or nsec is exactly 63 characters: 5 prefix, 52 data, 6 checksum.
  Confirmed twice, by the arithmetic for a 32-byte key and against 568 real npubs in this repo.
- **NIP-65.** "When downloading events from a user, clients SHOULD use the write relays of that
  user", and events tagging a user go to that user's read relays. Write is where your posts live,
  read is where your mentions arrive.
- **NIP-17.** The kind 1059 gift wrap carries `["p", receiverPublicKey, "<relay-url>"]` in
  plaintext and is signed by a random one-time key. The relay cannot see the sender and can see
  the recipient. Kind 10050 is the DM relay list and clients MUST send DMs only there.
  No mandatory forward secrecy; the spec offers only opt-in disappearing messages.
- **NIP-05.** `names` maps to "hex formatted public keys, in lowercase". An npub there is invalid.
  A client "must not replace" a followed pubkey when the address later returns a different key,
  so repointing a NIP-05 does not migrate existing followers. Servers must send
  `Access-Control-Allow-Origin: *` and the endpoint "MUST NOT return any HTTP redirects".
- **NIP-51.** Mute lists (kind 10000) are "things the user doesn't want to see in their feeds".
  Nothing stops a muted person reading public posts, replying or mentioning the user. Muting is
  client-side filtering, relays do not enforce it, and the muted person is not notified.
