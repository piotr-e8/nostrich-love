# Available Workflows

**All executable workflows for common tasks.**

## How to Run a Workflow

```
"Run workflow [workflow-name]"
"Add a simulator for [Client Name]"
"Fix UI bug: [description]"
```

## Core Workflows

### 1. Add Simulator Workflow
**File**: `../config/workflows/add-simulator.yaml`

**Purpose**: Add interactive Nostr client simulators to the guide.

**Trigger**: 
```
"Add a simulator for [Client Name]"
"Run workflow add-simulator with inputs: client_name=Damus, platform=ios"
```

**Steps**:
1. **Research Client** - Gather information, branding, screenshots
2. **Create Design Specification** - UI/UX spec (decision gate for approval)
3. **Implement Simulator Page** - Astro page
4. **Create Interactive Tour** - Tour configuration
5. **Build Simulator Components** - React components
6. **Integrate into System** - Configs, navigation, exports
7. **Quality Assurance** - Review and validate (decision gate)
8. **Final Integration** - Apply fixes

**Key Patterns**:
- Check nostrapps.com first for screenshots/logos
- Verify all wrapper divs have `h-full`
- Test runtime before marking complete
- Use SVG format for icons, save to `/public/icons/`

**Reference Implementations**:
- Android: `/src/simulators/amethyst/`
- Tour: `/src/data/tours/amethyst-tour.ts`
- Config: `/src/simulators/shared/configs.ts`

---

### 2. Add Follow-Pack Accounts Workflow
**File**: `../config/workflows/add-follow-pack-accounts.yaml`

**Purpose**: Add curated accounts to the follow-pack system.

**Trigger**:
```
"Add accounts to follow-pack"
"Process naddr for category artists"
"Search follows of [npub] for category parents"
```

**Input Types**:
- `naddr` - Process kind 39089 follow packs
- `npubs` - Add individual npubs
- `search_follows` - Find accounts in someone's follows

**Steps**:
1. Accept input type
2. Decode/extract pubkeys
3. Fetch metadata from relays
4. Check for duplicates
5. Categorize accounts
6. Present summary for approval (decision gate)
7. Add to accounts.ts
8. Validate integration

---

### 3. Add Community Landing Page Workflow
**File**: `../config/workflows/add-community-landing-page.yaml`

**Purpose**: Create new community landing pages with real accounts from follow-pack.

**Trigger**:
```
"Add new community landing page: [Community Name]"
"Create landing page for [Community Name] with category [category-id]"
```

**Example**:
```
"Add new community landing page: bitcoiners with category bitcoiners, icon ₿, description 'Connect with bitcoiners on Nostr'"
```

**Steps**:
1. Validate inputs and generate slug
2. Check/create category in follow-pack
3. Run follow-pack workflow to find accounts if needed
4. Create `FeaturedCreatorsFromPack` component
5. Create landing page with real accounts
6. Update navigation and exports
7. QA validation

**Features**:
- Uses real accounts from `/follow-pack` instead of mock data
- "Follow These Accounts" button links to follow-pack with category preselected
- No sample posts section
- Auto-creates category if missing
- Reuses AccountCard UI from follow-pack

---

### 4. Update Community Landing Page Workflow
**File**: `../config/workflows/update-community-landing-page.yaml`

**Purpose**: Update existing community pages to use real accounts.

**Trigger**:
```
"Update [community] community page with real accounts"
"Fix photographers page to use follow-pack accounts"
```

**Steps**:
1. Find existing page by slug
2. Extract current page structure and theme
3. Detect or accept category ID
4. Check if category has enough accounts
5. Add accounts via follow-pack workflow if needed
6. Replace mock creators with `FeaturedCreatorsFromPack` component
7. Remove sample posts section
8. QA validation

**Features**:
- Preserves existing page design and content
- Auto-detects category from page content
- Can add accounts if category is empty
- Removes mock data entirely

---

### 5. Fix UI Bug Workflow
**File**: `../config/workflows/fix-ui-bug.yaml`

**Purpose**: Systematically debug and fix UI bugs with specialized agents.

**Trigger**:
```
"Fix UI bug: [description]"
"Debug [issue] on [page/component]"
"The button is misaligned on mobile"
```

**Examples**:
```
"Fix UI bug: Button text is cut off on mobile at /follow-pack"
"Debug why modal backdrop is too dark on community pages"
```

**Steps**:
1. **Parse Bug Report** - Extract structured info from your description
2. **Triage** - Determine if quick fix or deep investigation needed
3. **Locate Components** - Find exact files and component hierarchy
4. **Audit CSS** - Identify style conflicts, responsive issues, theme problems
5. **Find Patterns** - Look for working similar UI in codebase
6. **Root Cause Analysis** - Determine why bug is happening (decision gate)
7. **Implement Fix** - Apply solution following patterns
8. **Verify Fix** - Test it works, check for regressions (decision gate)
9. **Document** - Update docs if needed

**Specialized Agents**:
- **UI Parser Agent** - Extracts issue type, affected elements, visual symptoms
- **Component Detective Agent** - Finds exact component files and hierarchy
- **CSS Conflict Hunter Agent** - Identifies styling conflicts and responsive issues
- **Root Cause Agent** - Determines fundamental reason for bug
- **UI Fix Implementer Agent** - Applies fix following codebase patterns
- **UI Verify Agent** - Confirms fix works, checks for regressions

**Decision Gates**:
- After root cause analysis (approve approach before fixing)
- After implementation (verify fix actually works)

**When to Use**:
- Visual glitches (misaligned, wrong colors, missing elements)
- Responsive issues (breaks on mobile/tablet)
- Layout problems (overlapping, overflow, spacing)
- Styling conflicts (CSS specificity, theme issues)

---

### 6. Fix Code Logic Workflow
**File**: `../config/workflows/fix-code-logic.yaml`

**Purpose**: Fix logic, data flow, and architecture issues (not UI/visual bugs).

**Trigger**:
```
"Fix logic bug: [description]"
"Data not loading correctly in [component]"
"[Feature] behaving unexpectedly"
```

**Examples**:
```
"Fix logic bug: URL query parameters not being parsed on static site"
"Data not filtering correctly in follow-pack"
"State not persisting after page reload"
```

**Steps**:
1. **Analyze Issue** - Identify affected files and code patterns
2. **Investigate Root Cause** - Determine why the logic bug occurs (decision gate)
3. **Implement Fix** - Apply the logic fix following codebase patterns
4. **Validate Fix** - Test the fix works without breaking anything (decision gate)
5. **Finalize** - Apply final touches and update documentation

**When to Use**:
- Data flow problems
- State management bugs
- API integration issues
- Conditional logic errors
- Type mismatches
- Configuration problems

**NOT for**: UI/visual bugs (use fix-ui-bug instead)

---

### 7. Improve Simulator Workflow
**File**: `../config/workflows/improve-simulator.yaml`

**Purpose**: Improve an existing simulator to match the real app more closely.

**Trigger**:
```
"Improve simulator for [Client Name]"
"Update [Client] simulator with latest UI"
"Fix [Client] simulator colors and layout"
```

**Examples**:
```
"Improve simulator for Amethyst"
"Update Damus simulator with latest iOS design"
```

**Steps**:
1. **Research Real App** - Gather current information, screenshots
2. **Analyze Discrepancies** - Compare simulator vs real app
3. **Create Improvement Spec** - Detailed changes needed (decision gate)
4. **Implement Improvements** - Apply fixes to components
5. **Apply UI Fixes** - Fix colors, spacing, fonts
6. **Quality Validation** - Validate improvements match real app (decision gate)
7. **Finalize Improvements** - Apply final fixes and update docs

**Focus Areas**:
- Visual accuracy (colors, fonts, spacing)
- Feature parity (missing features)
- Navigation flow
- Responsive design
- Branding updates

---

## Workflow Features

### Decision Gates
Workflows pause for your input at decision gates:
- **Design approval** - Approve specifications before implementation
- **QA approval** - Review outputs before finalizing
- **Root cause approval** - Approve bug fix approach
- **Verification** - Confirm fix works

Respond with:
- `1` or "yes" - Approve and continue
- "adjust [specifics]" - Make changes
- "details" - See more information

### Automatic Tracking
- **After every 3rd run**: Quick performance review
- **On failure**: Immediate analysis of what went wrong
- **Weekly**: Comprehensive workflow audit

### Evaluation Commands
```
"Review fix-ui-bug workflow"          → Analyze performance
"Audit all workflows"                 → Full system review
"Simplify [workflow]"                 → Reduce complexity
"What's our success rate?"            → View metrics
```

---

**Total Workflows**: 7
**Average Steps**: 7-12 per workflow
**Decision Gates**: 1-2 per workflow
