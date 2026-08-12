# Skills

Task procedures for coding agents. `CLAUDE.md` holds the always-on rules; everything
procedural lives here and is loaded only when a task calls for it.

## Layout

Skills live in `.agents/skills/`. Claude Code reads `.claude/skills/`, so every skill is
symlinked from there — `.claude/skills/<name> -> ../../.agents/skills/<name>`. Both the
skills and the symlinks are tracked, so a fresh clone gets a working set with no setup.
The rest of `.claude/` (local config, worktrees) stays untracked.

Adding a skill means creating the directory here and the symlink there. `skill-creator`
covers the format.

## Ours

Written for this project, in Polish. Named after the task, not the technology.

| Skill | Run it when |
|---|---|
| `nowy-jezyk` | Adding a locale — the nine files, and the two that fail silently |
| `nowy-poradnik` | Writing a guide: frontmatter, course order, translations |
| `komponent-interaktywny` | New React component — hydration, i18n, dark mode, RTL |
| `uzupelnij-tlumaczenia` | Filling translation gaps; measure first, translate second |
| `sprawdz-seo` | Sitemap, hreflang, `og:locale`, canonical |
| `nostr-relay` | Protocol work — outbox model, WebSockets, profiles |
| `przed-wypchnieciem` | The gates before a commit, push or deploy — and what to do when one fails |
| `domkniecie-sesji` | Closing a session: what to write down, where, what stays open |

## Installed

Nine skills pulled from public marketplaces, pinned in `skills-lock.json` at the repo
root. Do not edit them in place — an update overwrites the directory. If one is wrong for
this project, say so in the relevant skill above.

| Skill | Source |
|---|---|
| `vercel-react-best-practices` | vercel-labs/agent-skills |
| `web-design-guidelines` | vercel-labs/agent-skills |
| `frontend-design` | anthropics/skills |
| `webapp-testing` | anthropics/skills |
| `skill-creator` | anthropics/skills |
| `systematic-debugging` | obra/superpowers |
| `writing-plans` | obra/superpowers |
| `tailwind-design-system` | wshobson/agents |
| `content-strategy` | coreyhaines31/marketingskills |

## Removed

`astro-i18n-translation` — the locale procedure from March 2026. Three of the six files it
called mandatory no longer exist, and it required `client:load` on interactive components,
which `CLAUDE.md` now forbids. Replaced by `nowy-jezyk`; the locale post-mortems it drew on
are still in `docs/internal/LESSONS_*_LOCALE.md`.
