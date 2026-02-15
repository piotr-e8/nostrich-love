# Documentation Reorganization Plan

**Date:** 2026-02-15  
**Purpose:** Clean up scattered documentation from Phase 1-5 work  

---

## Current State: CHAOTIC 😅

**docs/** - 12 files, mixed purposes:
- Implementation plans
- Testing checklists  
- Component specs
- Phase summaries
- Bug lists

**.ai/** - 40+ files across multiple directories:
- session-start/ (INDEX, AGENTS, etc.)
- memory/ (lessons, preferences)
- config/ (agent definitions)
- plans/ (various plans)
- context/ (temporary context)

**progress/** - 30+ files:
- Multiple projects mixed
- Session logs
- Audit results
- Simulator work
- Migration work

---

## Proposed Structure

### 1. PROJECT-SPECIFIC DOCS (docs/migration/)

**Create:** `docs/migration/` directory

**Move there:**
- `docs/IMPLEMENTATION_PLAN.md` → `docs/migration/IMPLEMENTATION_PLAN.md`
- `docs/phase-4-plan.md` → `docs/migration/phase-4-plan.md`
- `docs/phase-4-testing.md` → `docs/migration/phase-4-testing.md`
- `docs/phase-10-bugfixes.md` → `docs/migration/phase-10-bugfixes.md`
- `docs/GUIDE_COMPONENT_DESIGN.md` → `docs/migration/GUIDE_COMPONENT_DESIGN.md`
- `docs/PHASE3_SUMMARY.md` → `docs/migration/PHASE3_SUMMARY.md`
- `docs/PHASE3_TESTING_CHECKLIST.md` → `docs/migration/PHASE3_TESTING_CHECKLIST.md`

**Archive/Delete:**
- `docs/session-best-practices.md` (redundant with .ai/ versions)

**Keep in docs/ (general):**
- `docs/QUICK_START.md`
- `docs/GAMIFICATION_CONFIG.md`
- `docs/PROGRESS_TRACKING_SPEC.md`
- `docs/FOLLOW_PACK_INTEGRATION.md`

### 2. AI MEMORY CONSOLIDATION (.ai/memory/)

**Consolidate:** `.ai/memory/lessons-learned.md` and `.ai/session-start/LESSONS_LEARNED.md`

These are duplicates - merge into one comprehensive file.

**Clean up:** `.ai/context/` - temporary files, can delete

### 3. PROGRESS ORGANIZATION (progress/)

**Create subdirectories:**
- `progress/migration/` - All migration work
- `progress/amethyst/` - Amethyst simulator work
- `progress/general/` - Other project work

**Move files:**
- `progress/skill-level-migration-session-log.md` → `progress/migration/`
- `progress/phase-1-3-audit.md` → `progress/migration/`

### 4. MASTER INDEX

**Create:** `docs/README.md` with:
- Links to all project docs
- Quick navigation
- Status of each phase

---

## Immediate Actions Needed

### Priority 1: Create Migration Docs Directory
```bash
mkdir docs/migration/
mv docs/IMPLEMENTATION_PLAN.md docs/migration/
mv docs/phase-4-plan.md docs/migration/
mv docs/phase-4-testing.md docs/migration/
mv docs/phase-10-bugfixes.md docs/migration/
mv docs/GUIDE_COMPONENT_DESIGN.md docs/migration/
mv docs/PHASE3_*.md docs/migration/
```

### Priority 2: Merge Duplicate Lessons Files
- Compare `.ai/memory/lessons-learned.md` and `.ai/session-start/LESSONS_LEARNED.md`
- Merge into single comprehensive file
- Delete duplicate

### Priority 3: Create Master README
- List all active docs
- Provide navigation
- Show project status

### Priority 4: Archive Old Context
- Delete `.ai/context/` files (temporary)
- Review `.ai/plans/` for outdated items

---

## Benefits

✅ **Clear separation** - Migration docs in one place  
✅ **Easy navigation** - Master README points to everything  
✅ **No duplicates** - Single source of truth  
✅ **Scalable** - New features get their own directories  
✅ **Maintainable** - Know where to find things  

---

## Files to Create

1. `docs/migration/` - Directory
2. `docs/README.md` - Master navigation
3. `docs/migration/STATUS.md` - Current phase status

## Files to Archive/Delete

1. `.ai/context/*` - Temporary files
2. Duplicate lessons files
3. Outdated plan files

---

**Decision:** Do we want to proceed with this reorganization now, or keep working and clean up later?

**My recommendation:** Quick reorganization now (15 mins) so future work is cleaner.

**Your call?** 🧹 or 🚀?
