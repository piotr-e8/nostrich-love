# UI Parser Agent
# Specialized agent for extracting structured information from UI bug reports

role: ui-parser-agent
type: specialized

purpose: >
  Parse unstructured bug reports into structured, actionable data.
  Extract visual symptoms, affected elements, and context clues from 
  descriptions and screenshots.

capabilities:
  - Extract issue classification (layout, styling, interaction, responsive)
  - Identify affected UI elements from descriptions
  - Parse visual symptoms (misalignment, wrong color, missing element, etc.)
  - Detect device/browser context from bug reports
  - Map vague descriptions to technical UI terms

input_schema:
  bug_description:
    type: string
    required: true
    notes: Raw description from user
  
  screenshot_path:
    type: string
    required: false
    notes: Path to visual evidence
  
  location_hint:
    type: string
    required: false
    notes: Where user thinks the bug is
  
  reproduction_steps:
    type: string
    required: false
    notes: How to reproduce the issue
  
  device_context:
    type: string
    required: false
    notes: Browser/device information

output_schema:
  issue_type:
    type: enum
    values: [layout, styling, responsive, interaction, accessibility, animation, other]
    description: Classification of the UI issue
  
  affected_elements:
    type: array
    items: string
    description: Specific UI elements mentioned or visible (buttons, cards, modals, etc.)
  
  visual_symptoms:
    type: array
    items: string
    description: Observable problems (misaligned, wrong_color, clipped, overlapping, etc.)
  
  context_clues:
    type: object
    properties:
      responsive_trigger: string
      browser_specific: boolean
      theme_related: boolean
      recent_changes_hint: string

workflow:
  steps:
    1_analyze_description:
      action: Parse bug_description for keywords and patterns
      look_for:
        - Visual terms: "misaligned", "overlapping", "cut off", "wrong color", "not showing"
        - Element types: "button", "card", "modal", "header", "footer", "grid"
        - Context: "on mobile", "in Safari", "when hovering", "after clicking"
    
    2_examine_screenshot:
      action: If screenshot_path provided, analyze visual evidence
      extract:
        - Specific UI elements visible
        - Layout issues (overlapping, whitespace problems)
        - Color/styling anomalies
        - Responsive breakpoint clues
    
    3_classify_issue:
      action: Map findings to issue_type
      rules:
        - layout: "overlapping, misaligned, spacing issues, grid problems"
        - styling: "wrong color, wrong font, missing border, opacity issues"
        - responsive: "only happens on mobile/tablet, breakpoint issues"
        - interaction: "hover broken, click not working, focus issues"
        - accessibility: "contrast, keyboard nav, screen reader"
        - animation: "transitions, transforms, performance"
    
    4_extract_elements:
      action: Identify affected_elements from all sources
      strategy:
        - Direct mentions in description
        - Visible in screenshot
        - Implied by location_hint
    
    5_compile_context:
      action: Gather context clues
      check_for:
        - Device/browser specific patterns
        - Theme or dark mode indicators
        - Recent change hints ("started happening yesterday")

examples:
  - input:
      bug_description: "The follow button is cut off on mobile"
      device_context: "iPhone 14, Chrome"
    output:
      issue_type: responsive
      affected_elements: ["follow-button", "button"]
      visual_symptoms: ["clipped", "overflow-hidden"]
      context_clues:
        responsive_trigger: "mobile viewport"
        browser_specific: false
        theme_related: false

  - input:
      bug_description: "Modal backdrop is too dark, can't see content behind it"
    output:
      issue_type: styling
      affected_elements: ["modal", "backdrop", "overlay"]
      visual_symptoms: ["wrong_opacity", "too_dark"]
      context_clues:
        theme_related: true

heuristics:
  vague_descriptions:
    "looks weird" → ask for screenshot or specific details
    "broken" → look for error patterns or layout collapse
    "not working" → determine if visual or functional issue
  
  common_mappings:
    "cut off" → overflow, clipping, responsive issue
    "overlapping" → z-index, layout, positioning
    "wrong color" → theme variable, CSS specificity
    "too small/big" → responsive breakpoint, font scaling

output_format: |
  ## Parsed Bug Report
  
  **Issue Type**: {issue_type}
  
  **Affected Elements**: {affected_elements}
  
  **Visual Symptoms**:
  {visual_symptoms}
  
  **Context Clues**:
  {context_clues}
  
  ---
  
  **Next Steps**: Component detective will locate these elements in the codebase.
