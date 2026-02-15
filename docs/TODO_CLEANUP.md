# TODO: Documentation Cleanup

**Priority:** Low (do after main implementation)  
**Estimated Time:** 30-45 minutes  

## When to Do This
- After Phase 10 is complete
- Or when we need a break from coding
- Before project handoff/documentation

## What to Do

### 1. Create Migration Docs Directory
```
docs/migration/          <- NEW
├── IMPLEMENTATION_PLAN.md (move from docs/)
├── phase-4-plan.md (move from docs/)
├── phase-4-testing.md (move from docs/)
├── phase-10-bugfixes.md (move from docs/)
├── GUIDE_COMPONENT_DESIGN.md (move from docs/)
├── PHASE3_SUMMARY.md (move from docs/)
└── PHASE3_TESTING_CHECKLIST.md (move from docs/)
```

### 2. Merge Duplicates
- Merge `.ai/memory/lessons-learned.md` and `.ai/session-start/LESSONS_LEARNED.md`
- Keep the comprehensive one in `docs/migration/`

### 3. Create Master README
- `docs/README.md` - Links to all docs
- Quick navigation
- Project status

### 4. Cleanup
- Delete `.ai/context/` (temporary files)
- Delete `docs/session-best-practices.md` (redundant)

## Files Created as Reminder
- `docs/REORGANIZATION_PLAN.md` (this plan)

## Status
⏳ Waiting for development to complete
