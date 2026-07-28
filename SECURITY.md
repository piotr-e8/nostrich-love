# Security Policy

## Why this matters here

Nostrich.love teaches beginners how to handle nostr keys and includes an
in-browser key generator. A security bug on this site can cost a reader their
identity. We treat security reports as the highest-priority class of issue.

## Key handling guarantees

The site is a statically generated site with no backend of its own:

- **Key generation runs entirely in your browser** using the Web Crypto API
  and `@noble/secp256k1`. Generated keys are never transmitted, logged, or
  stored server-side.
- The site sets no cookies and uses privacy-friendly, cookieless analytics.
- The **client simulators are simulations** — nothing you type into them is a
  real login. Never enter your real `nsec` anywhere on this site, and be
  suspicious of any site that asks for it.

If you find any code path that violates these guarantees, that is a
vulnerability — please report it.

## Reporting a vulnerability

- Email **hello@nostrich.love** with a description, reproduction steps, and
  the affected page/component.
- Please do not open a public issue for anything that could put readers at
  risk before a fix is deployed.
- You can expect an acknowledgement within a few days. There is no bug bounty,
  but reporters are credited (with their consent) once a fix ships.

## Scope

The deployed site at https://nostrich.love and the code in this repository.
The current production deployment is the only supported version.

## Reporting content-level security problems

If a guide recommends an insecure practice (e.g. pasting an `nsec` into a
website, a compromised client or extension, a dead NIP-05 provider), report it
the same way — teaching bad security is a vulnerability in an educational
site, and such reports are treated with the same priority as code issues.
