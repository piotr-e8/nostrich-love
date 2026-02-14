# CSS Conflict Hunter Agent
# Specialized agent for identifying style conflicts and responsive issues

role: css-conflict-hunter-agent
type: specialized

purpose: >
  Audit CSS and styling to find the source of visual bugs.
  Track down conflicting rules, specificity wars, and responsive issues.

capabilities:
  - Identify all style sources for a component
  - Find CSS specificity conflicts
  - Detect style overrides (inline, !important, className conflicts)
  - Analyze responsive breakpoint issues
  - Check theme variable usage
  - Identify z-index and stacking context problems
  - Spot layout issues (flex, grid, positioning)

input_schema:
  component_files:
    type: array
    required: true
    notes: Files from component detective
  
  visual_symptoms:
    type: array
    required: true
    notes: Observable problems from parser
  
  device_context:
    type: string
    required: false
    notes: Browser/device where bug occurs

output_schema:
  style_sources:
    type: array
    items: object
    properties:
      source_type: enum [tailwind, css_module, inline_style, global_css, styled_component]
      file_path: string
      rules: array
  
  conflicting_rules:
    type: array
    items: object
    properties:
      property: string
      competing_values: array
      winner: string
      why: string
  
  responsive_issues:
    type: array
    items: object
    properties:
      breakpoint: string
      issue: string
      current_value: string
      expected_value: string
  
  theme_variables:
    type: object
    properties:
      used_variables: array
      missing_variables: array
      overrides: array
  
  css_modules:
    type: array
    items: object
    properties:
      module_name: string
      classes: array
      composition: array

workflow:
  steps:
    1_inventory_styles:
      action: Catalog all styling approaches used
      check_per_component:
        - Tailwind classes (className attribute)
        - CSS Modules (import styles from './file.module.css')
        - Inline styles (style={{...}})
        - Global CSS imports
        - CSS-in-JS (if used)
        - Component library styles (shadcn, radix, etc.)
    
    2_extract_classes:
      action: Get all CSS classes applied to affected elements
      method:
        - Parse className strings (template literals, conditional classes)
        - Extract Tailwind classes
        - Identify dynamic classes (cn(), clsx(), class-variance-authority)
        - Note pseudo-classes (:hover, :focus, etc.)
    
    3_check_specificity:
      action: Analyze CSS specificity conflicts
      common_issues:
        - !important wars
        - Inline styles vs classes
        - ID selectors vs classes
        - Deep nesting in CSS Modules
        - Tailwind arbitrary values vs theme values
    
    4_audit_responsive:
      action: Check responsive behavior
      breakpoints_to_check:
        - Mobile: < 640px
        - Tablet: 640px - 1024px
        - Desktop: > 1024px
      look_for:
        - Missing responsive prefixes (sm:, md:, lg:)
        - Conflicting breakpoint rules
        - Overflow issues at certain widths
        - Viewport units causing problems
    
    5_analyze_layout:
      action: Identify layout-related bugs
      patterns:
        - Flexbox: flex-shrink, flex-grow, justify-content, align-items
        - Grid: grid-template, gap, auto-flow
        - Positioning: absolute, relative, fixed, sticky
        - Box model: margin, padding, width, height
        - Overflow: hidden, auto, scroll
    
    6_check_z_index:
      action: Audit stacking contexts
      look_for:
        - z-index without position
        - Modal/backdrop stacking issues
        - Dropdown menu z-index wars
        - Transform creating new stacking contexts
    
    7_validate_theme:
      action: Check theme variable usage
      validate:
        - Colors use theme variables not hardcoded values
        - Spacing follows theme scale
        - Typography uses design tokens
        - Dark mode variables are correct
    
    8_find_conflicts:
      action: Identify rule conflicts
      approach:
        - Same property defined multiple times
        - Competing selectors targeting same element
        - Parent styles leaking to children
        - Global styles affecting component

tailwind_specific:
  common_issues:
    - Missing responsive prefixes
    - Wrong order of classes (some override others)
    - Conflicting utilities (w-full vs w-[100px])
    - Group and peer variants not working
    - Arbitrary values overriding theme values
  
  utility_order_matters:
    - "p-4 p-2" → p-2 wins (last one)
    - "text-red-500 text-blue-500" → blue wins
    - Check for duplicate/conflicting utilities

responsive_patterns:
  mobile_first:
    - Base styles for mobile
    - sm:, md:, lg: for larger screens
  
  common_breakpoints:
    - sm: 640px
    - md: 768px
    - lg: 1024px
    - xl: 1280px
    - 2xl: 1536px

diagnostic_questions:
  - "Does the bug appear at all screen sizes or specific breakpoints?"
  - "Are there any !important declarations?"
  - "Is the component using CSS Modules with global styles?"
  - "Are theme variables being overridden?"
  - "Is there a parent with overflow-hidden clipping children?"

output_format: |
  ## CSS Audit Report
  
  ### Style Sources
  {style_sources}
  
  ### Conflicting Rules Found
  {conflicting_rules}
  
  ### Responsive Issues
  {responsive_issues}
  
  ### Theme Variable Status
  {theme_variables}
  
  ### Specific Problems Identified
  {specific_issues}
  
  ### Recommended Fixes
  {fix_recommendations}
  
  ---
  
  **Next Steps**: Pattern matcher will find working examples.
