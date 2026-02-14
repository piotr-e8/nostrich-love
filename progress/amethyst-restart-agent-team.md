# Amethyst Simulator Improvements - RESTART with Proper Agent Team

**Date**: 2026-02-13  
**Status**: RESTARTED with Agent Team Orchestration  
**Previous Attempt**: Reverted (single agent approach)
**Current Approach**: Multi-agent team as per workflow specification

---

## Why We Restarted

**Previous Error**: Delegated entire workflow to single "general" agent  
**Rule Violated**: `agent_team_enforcement: required`  
**Correct Approach**: Use specialized agents for each phase

---

## Agent Team Assembly

According to `improve-simulator.yaml` workflow, we need:

### Phase 1-2: Research & Analysis
**Agent**: `research-agent`  
**Task**: Gather screenshots and information from nostrapps.com  
**Outputs**: research_report, screenshots, branding_assets

**Agent**: `component-detective-agent`  
**Task**: Compare current simulator with real app findings  
**Outputs**: discrepancy_report, missing_features, ui_issues

### Phase 3: Specification
**Agent**: `ui-parser-agent`  
**Task**: Create detailed improvement specification  
**Outputs**: improvement_spec, component_changes, color_updates  
**Decision Gate**: Your approval required

### Phase 4-5: Implementation
**Agent**: `code-agent`  
**Task**: Implement core improvements  
**Outputs**: updated_components, theme_updates, screen_updates

**Agent**: `ui-fix-implementer-agent`  
**Task**: Apply UI-specific fixes  
**Outputs**: ui_fixes_applied, css_updates

### Phase 6: Validation
**Agent**: `qa-agent`  
**Task**: Validate improvements match real app  
**Outputs**: qa_report, validation_results, remaining_issues  
**Decision Gate**: Your review required

### Phase 7: Finalization
**Agent**: `integration-agent`  
**Task**: Final fixes and documentation  
**Outputs**: final_status, documentation_updated

---

## Implementation Schedule

| Phase | Agent(s) | Duration | Status |
|-------|----------|----------|--------|
| 1-2 | research-agent + component-detective-agent | 15-20 min | 🔄 Starting |
| 3 | ui-parser-agent | 10-15 min | ⏳ Pending approval |
| 4-5 | code-agent + ui-fix-implementer-agent | 30-45 min | ⏳ Pending |
| 6 | qa-agent | 15-20 min | ⏳ Pending approval |
| 7 | integration-agent | 10-15 min | ⏳ Pending |

**Total Team Size**: 6 specialized agents  
**Total Duration**: ~1.5-2 hours  
**Your Gates**: 2 (specification approval, validation approval)

---

## Starting Implementation

**Current Step**: Phase 1-2 - Research & Analysis

Starting with research-agent and component-detective-agent...
