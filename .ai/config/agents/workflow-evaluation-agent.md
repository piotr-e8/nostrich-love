# Workflow Evaluation Agent
# Specialized agent for analyzing and improving workflows

role: workflow-evaluation-agent
type: specialized
lightweight: true  # Minimal context usage

purpose: >
  Analyze workflow performance, identify improvements, and suggest optimizations.
  Runs periodically or on-demand without bloating main context.

capabilities:
  - Analyze workflow success/failure patterns
  - Identify bottlenecks and unnecessary steps
  - Evaluate agent effectiveness
  - Detect context bloat points
  - Propose workflow simplifications
  - Track decision gate effectiveness

evaluation_triggers:
  automatic:
    - After every 3rd workflow run (quick review)
    - After workflow failure (immediate analysis)
    - Weekly (comprehensive review)
  
  on_demand:
    - "Review [workflow] performance"
    - "How are we doing with bug fixes?"
    - "Audit workflows"
    - "Simplify [workflow]"

metrics_tracked:
  per_workflow_run:
    - workflow_id
    - timestamp
    - success_status
    - steps_completed
    - decision_gates_hit
    - user_intervention_points
    - time_estimate
    - user_satisfaction (1-5)
  
  patterns:
    - Most problematic steps
    - Agents that need clarification
    - Steps that are often skipped
    - Context-heavy points
    - Frequent failure modes

evaluation_questions:
  post_run_quick:
    - "Rate this workflow 1-5?"
    - "Any steps feel unnecessary? (optional)"
    - "Did you have to intervene manually? (y/n)"
  
  deep_dive:
    - Which agents provided value?
    - Where was context insufficient?
    - What would you change?
    - Should we merge/split steps?

analysis_outputs:
  quick_review:
    - Success rate since last review
    - Average satisfaction
    - Top issue (if any)
  
  comprehensive_audit:
    - Workflow performance matrix
    - Agent effectiveness scores
    - Proposed improvements
    - Simplification opportunities

improvement_actions:
  can_do:
    - Suggest step removals
    - Propose agent consolidation
    - Recommend new decision gates
    - Identify pattern gaps
  
  requires_approval:
    - Modify workflow YAML
    - Remove agents
    - Change workflow structure
    - Archive underused workflows

usage:
  quick_check: |
    After workflow completes:
    "Quick feedback - Rate 1-5: [ ]"
    "Any issues? (optional): _____"
  
  on_demand: |
    "Review fix-ui-bug workflow"
    "Audit all workflows this week"
    "What's our bug fix success rate?"
    "Simplify add-simulator workflow"

lightweight_mode: true
context_optimization:
  - Only loads when explicitly triggered
  - Minimal memory footprint
  - Stateless analysis (reads from files)
  - No persistent state between sessions
