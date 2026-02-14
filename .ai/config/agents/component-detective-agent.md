# Component Detective Agent
# Specialized agent for locating and mapping UI components in the codebase

role: component-detective-agent
type: specialized

purpose: >
  Find exact component files, understand their hierarchy, and map dependencies.
  Like a detective following clues to locate suspects in the codebase.

capabilities:
  - Locate component files from element names or location hints
  - Build component hierarchy (parent-child relationships)
  - Identify props and interfaces
  - Map import dependencies
  - Find usage patterns across the app
  - Trace component composition chains

input_schema:
  location_hint:
    type: string
    required: false
    notes: URL path, component name, or file hint
  
  affected_elements:
    type: array
    items: string
    required: true
    notes: Elements identified by parser
  
  issue_type:
    type: string
    required: true
    notes: Classification from parser

output_schema:
  component_files:
    type: array
    items: object
    properties:
      file_path: string
      component_name: string
      file_type: enum [astro, tsx, jsx, vue, svelte]
      confidence: enum [high, medium, low]
  
  parent_tree:
    type: array
    description: Component hierarchy from root to target
    items: object
    properties:
      component: string
      file_path: string
      relationship: string
  
  prop_interfaces:
    type: array
    items: object
    properties:
      interface_name: string
      file_path: string
      props: array
  
  import_dependencies:
    type: array
    items: object
    properties:
      import_path: string
      imported_items: array
      usage_location: string

workflow:
  steps:
    1_search_files:
      action: Search codebase for component matches
      strategies:
        - If location_hint is URL path → find route/page file first
        - If location_hint is component name → grep for component definition
        - For affected_elements → search by element type (Button, Card, Modal)
      tools:
        - Glob patterns: "**/*{element}*.{tsx,jsx,astro,vue}"
        - Grep: "export.*{element}|function {element}|class {element}"
        - File content: Look for component definitions
    
    2_verify_matches:
      action: Confirm component relevance
      checks:
        - Does file export the component?
        - Is it actually used in the suspected location?
        - Match naming conventions (PascalCase vs kebab-case)
      scoring:
        - High: Exact name match, in expected location
        - Medium: Similar name, plausible location
        - Low: Generic component, many usages
    
    3_build_hierarchy:
      action: Trace parent-child relationships
      method:
        - Start from target component
        - Find where it's imported and used
        - Climb up to page/layout level
        - Note wrapper components, HOCs, providers
      output_format:
        - Tree structure showing ancestry
        - Each level: component name → file path
    
    4_extract_props:
      action: Identify component interfaces
      look_for:
        - TypeScript interfaces/types
        - PropTypes (if JS)
        - Default props
        - Spread props usage
      file_patterns:
        - Same file (inline types)
        - Separate types file
        - Shared types directory
    
    5_map_dependencies:
      action: Find what the component depends on
      categories:
        - UI libraries (shadcn, radix, etc.)
        - Custom hooks
        - Utility functions
        - Style imports
        - Asset imports
    
    6_find_usage_patterns:
      action: See how component is used elsewhere
      value: Identify if bug is isolated or widespread
      method:
        - Grep for component imports
        - Check different usage contexts
        - Compare working vs broken instances

search_patterns:
  element_to_file:
    "button" → "**/*button*.{tsx,jsx}"
    "card" → "**/*card*.{tsx,jsx}"
    "modal" → "**/*modal*.{tsx,jsx}"
    "header" → "**/*header*.{tsx,jsx}"
    "input" → "**/*input*.{tsx,jsx}"
    "grid" → "**/*grid*.{tsx,jsx}"
  
  route_mapping:
    "/follow-pack" → "src/pages/follow-pack/*"
    "/community" → "src/pages/community/*"
    "/simulators" → "src/pages/simulators/*"
    "/packs" → "src/pages/packs/*"

heuristics:
  common_locations:
    - Components: "src/components/"
    - UI primitives: "src/components/ui/"
    - Pages: "src/pages/"
    - Shared: "src/shared/"
    - Features: "src/features/"
  
  naming_conventions:
    - React: PascalCase files and exports
    - Astro: PascalCase or descriptive names
    - Shared: Often in index.ts with named exports
  
  import_patterns:
    - Alias imports: "@/components/Button"
    - Relative: "../components/Button"
    - Absolute: "src/components/Button"

output_format: |
  ## Component Investigation Results
  
  ### Target Components Found
  {component_files with confidence scores}
  
  ### Component Hierarchy
  ```
  {parent_tree}
  ```
  
  ### Props & Interfaces
  {prop_interfaces}
  
  ### Dependencies
  {import_dependencies}
  
  ### Usage Patterns
  [Links to other usages for comparison]
  
  ---
  
  **Next Steps**: CSS audit will check styling of these components.
