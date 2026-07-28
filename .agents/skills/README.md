# Installed Skills for Nostrich.love

**Date:** March 2026  
**Total Skills Installed:** 9  
**Location:** `.agents/skills/`

---

## Development & Performance

### 1. vercel-react-best-practices
**Installs:** 188.9K | **Source:** vercel-labs/agent-skills  
**Purpose:** React/Next.js performance optimization (58 rules across 8 categories)  
**Use when:** Creating interactive components, optimizing quiz performance, reducing re-renders  
**Key areas:** Eliminating waterfalls, bundle optimization, re-render optimization

### 2. tailwind-design-system
**Installs:** 13.8K | **Source:** wshobson/agents  
**Purpose:** Complete Tailwind v4 design system with CSS-first configuration  
**Use when:** Creating consistent UI components, implementing dark mode, design tokens  
**Key areas:** Component variants, responsive patterns, theming, accessibility

### 3. frontend-design
**Installs:** 119.5K | **Source:** anthropics/skills  
**Purpose:** Create distinctive, non-generic interfaces that avoid "AI slop"  
**Use when:** Designing new pages, creating memorable quiz UIs, branding decisions  
**Key areas:** Typography, color, motion, spatial composition, backgrounds

---

## Design & Content

### 4. web-design-guidelines
**Installs:** 145.8K | **Source:** vercel-labs/agent-skills  
**Purpose:** General web design best practices  
**Use when:** Educational content presentation, accessibility, responsive design

### 5. content-strategy
**Installs:** 16.2K | **Source:** coreyhaines31/marketingskills  
**Purpose:** Educational content planning for traffic and authority  
**Use when:** Planning new guides, SEO optimization, content pillars  
**Key areas:** Searchable vs shareable content, hub/spoke structure, buyer journey

---

## Planning & Debugging

### 6. writing-plans
**Installs:** 19.7K | **Source:** obra/superpowers  
**Purpose:** Create comprehensive implementation plans with bite-sized tasks  
**Use when:** Complex features (new guide, quiz component), major refactoring  
**Key areas:** Exact file paths, TDD, commands, expected outputs

### 7. systematic-debugging
**Installs:** 21.6K | **Source:** obra/superpowers  
**Purpose:** Methodical 4-phase debugging process  
**Use when:** Build errors, translation issues, component bugs, ANY technical problem  
**Key principle:** "NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST"

---

## Testing & Meta

### 8. webapp-testing
**Installs:** 17.8K | **Source:** anthropics/skills  
**Purpose:** Python Playwright testing for web applications  
**Use when:** Testing interactive quizzes, simulators, user flows  
**Key areas:** Server lifecycle, DOM inspection, automation scripts

### 9. skill-creator
**Installs:** 59.4K | **Source:** anthropics/skills  
**Purpose:** Create new skills for reusable capabilities  
**Use when:** Want to create nostrich-specific skills for common operations

---

## Usage Summary

| Skill | When to Use | Priority |
|-------|-------------|----------|
| vercel-react-best-practices | Component performance | ⭐⭐⭐ High |
| tailwind-design-system | UI components, theming | ⭐⭐⭐ High |
| frontend-design | Visual design, branding | ⭐⭐⭐ High |
| systematic-debugging | Any bugs/errors | ⭐⭐⭐ High |
| writing-plans | Complex features | ⭐⭐ Medium |
| webapp-testing | Testing components | ⭐⭐ Medium |
| content-strategy | Guide planning | ⭐⭐ Medium |
| web-design-guidelines | General design | ⭐ Low |
| skill-creator | Creating skills | ⭐ Low |

---

## How to Use

These skills are automatically available to agents. When relevant to a task, the agent should:

1. **Invoke the skill** via the `skill` tool
2. **Follow the guidance** provided by the skill
3. **Reference specific rules** or patterns from the skill

**Example:** When debugging a build error:
```
skill({ name: "systematic-debugging" })
# Then follow the 4-phase process
```

---

*Installed: March 2026*
*All skills pass security audits (Gen Agent Trust Hub, Socket, Snyk)*
