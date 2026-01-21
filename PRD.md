# igl - Interactive Git Log

## Overview

**igl** (interactive git log) is a terminal UI tool that lets users interactively build and execute `git log` queries by toggling flags and seeing results update in real-time.

### Problem Statement

Git log has 50+ flags that most developers never use because:
- Hard to remember syntax
- No feedback loop to understand what each flag does
- Combining flags requires memorization

### Solution

A TUI that acts as a **live git log query builder** - toggle flags, see results instantly, learn by doing.

---

## Goals

1. **Real-time feedback** - Results update as flags are toggled
2. **Discoverability** - Users explore flags they didn't know existed
3. **Learning tool** - Show the equivalent CLI command so users learn git
4. **Zero friction** - Works in any git repo, no config needed

## Non-Goals

- Not a full git client (no commit, push, merge)
- Not a replacement for lazygit/tig (focused specifically on log exploration)
- No saved presets in v1

---

## Key Design Decisions

These decisions were made during the design interview:

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **TUI Framework** | OpenTUI | TypeScript-native, good for complex layouts |
| **Git interaction** | simple-git library | Abstracts edge cases, cleaner API than raw spawn |
| **Output strategy** | Raw git output | Display exactly what git returns — authentic learning, simpler code |
| **Default commit limit** | None | No artificial limit; git handles large repos fine |
| **Clipboard** | OSC 52 | Works over SSH, modern terminals |
| **Sidebar structure** | Tabbed categories | Cleaner than scrolling through all flags |
| **Single-select UX** | Cycle on Enter | Simple interaction for ORDER/DATE FORMAT options |
| **Multi-select UX** | Grouped with label | Visual grouping for DIFF FILTER options |
| **Text input update** | On Enter only | No live debouncing — explicit confirmation |
| **Error display** | Replace results pane | Clear feedback when git command fails |
| **Help view** | Modal overlay | Quick reference without losing context |
| **Non-git directory** | Exit with error | Fail fast with clear message |
| **Distribution** | npm/bun package (MVP) | Single binary later |
| **CLI arguments** | None (MVP) | Add passthrough support later |

---

## UI Layout

### Main Layout (Tabbed Sidebar)
```
┌─ Flags ─────────────┬─ Results ──────────────────────────┐
│ [FORMAT] FILTER  SE │                                    │
├─────────────────────┤ a1b2c3d Fix auth bug               │
│ [x] --oneline       │ e4f5g6h Add login page             │
│ [ ] --graph         │ i7j8k9l Refactor utils             │
│ [x] --decorate      │ m0n1o2p Update README              │
│ [ ] --stat          │ ...                                │
│ [ ] --shortstat     │                                    │
│ [ ] --name-only     │                                    │
│ [ ] --name-status   │                                    │
│ [x] --abbrev-commit │                                    │
│                     │                                    │
├─ Input ─────────────┤                                    │
│ (appears when       │                                    │
│  editing text flag) │                                    │
├─────────────────────┴────────────────────────────────────┤
│ > git log --oneline --decorate --abbrev-commit           │
└──────────────────────────────────────────────────────────┘
```

### Layout Components

| Component | Description |
|-----------|-------------|
| **Sidebar** | Toggleable (show/hide with `Tab`). **Tabbed** by category. |
| **Tab bar** | Shows category tabs: FORMAT, FILTER, SEARCH, DATE, DIFF, ORDER, DATE FMT |
| **Results pane** | Main area showing **raw git log output**. Scrollable. |
| **Input bar** | Appears at bottom of sidebar when editing text-based flags. |
| **Command bar** | Always visible at bottom. Shows the current `git log` command. |

### Sidebar Behavior

- **Tab navigation**: `[` for previous tab, `]` for next tab
- **Toggle flags**: Navigate with `j/k`, toggle with `Space` or `Enter`
- **Single-select flags**: `Enter` cycles through options (e.g., ORDER: default → date → author-date → topo → default)
- **Text inputs**: Press `Enter` on a text-based flag → Input bar appears → Type value → `Enter` to set, `Esc` to cancel
- **Active state**: Flags with values show the value inline (e.g., `[>] --author: jcha`)
- **Clear value**: Press `d` or `Delete` on a text flag to clear it

### Results Pane Behavior

- Displays **raw git output** exactly as git returns it
- Auto-refreshes when any flag changes (on Enter for text inputs)
- Scrollable with `j/k` when focused (or `Ctrl+d/u` for page)
- Press `Enter` on a commit to open detail view
- When git returns an error, error message replaces results content

### Commit Detail View (Push Navigation)

When user presses `Enter` on a commit in the results pane, the detail view **replaces** the entire main view (not a modal/overlay). This follows the "push navigation" pattern similar to opening a file in vim.

```
┌─ Main View (Log List) ──────────────────────────────────┐
│ a1b2c3d Fix auth bug         ← j/k to navigate         │
│ e4f5g6h Add login page       ← Enter to drill down     │
│ i7j8k9l Refactor utils                                  │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Enter
                          ▼
┌─ Detail View (Full Screen) ─────────────────────────────┐
│ commit e4f5g6h789abc123def456...                        │
│ Author: jcha <jcha@example.com>                         │
│ Date:   Mon Jan 20 14:32:05 2026 +0900                  │
│                                                         │
│     Add login page                                      │
│                                                         │
│     - Implements OAuth2 flow                            │
│     - Adds session management                           │
│                                                         │
│ [Esc] back   [j/k] scroll                               │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Esc
                          ▼
        (Back to Main View, cursor position preserved)
```

**MVP Detail View Behavior:**
- Shows commit metadata and full message (via `git show <hash> --no-patch`)
- Sidebar auto-hides when entering detail view
- `j/k` scrolls within the detail view
- `Esc` returns to main view (cursor position preserved)
- `y` yanks commit hash to clipboard

**Full Detail View (Phase 3):**
- Adds file stats (--stat output)
- `d` toggles full diff display
- `n/p` navigates to next/previous commit without returning to list

### Keyboard Shortcuts

#### Main View
| Key | Action |
|-----|--------|
| `Tab` | Toggle sidebar visibility |
| `h/l` | Switch focus between sidebar and results |
| `[/]` | Previous/next sidebar tab |
| `j/k` | Navigate up/down in current pane |
| `Space` | Toggle flag (sidebar) |
| `Enter` | Toggle/cycle flag (sidebar) / Open detail view (results) |
| `Esc` | Cancel input |
| `d` | Clear text flag value (sidebar) |
| `q` | Quit |
| `y` | Yank current command to clipboard |
| `?` | Show help (modal overlay) |

#### Detail View (MVP)
| Key | Action |
|-----|--------|
| `Esc` | Return to main view |
| `j/k` | Scroll up/down |
| `Ctrl+d/u` | Page down/up |
| `y` | Yank commit hash to clipboard |
| `q` | Quit (back to main view) |

#### Detail View (Phase 3 additions)
| Key | Action |
|-----|--------|
| `d` | Toggle full diff display |
| `n` | Next commit (without returning to list) |
| `p` | Previous commit |

---

## Flag Categories

### 1. FORMAT (output style)
| Flag | Type | Default |
|------|------|---------|
| `--oneline` | Toggle | ON |
| `--graph` | Toggle | OFF |
| `--decorate` | Toggle | ON |
| `--stat` | Toggle | OFF |
| `--shortstat` | Toggle | OFF |
| `--name-only` | Toggle | OFF |
| `--name-status` | Toggle | OFF |
| `--abbrev-commit` | Toggle | ON |

### 2. FILTER (commit selection)
| Flag | Type | Default |
|------|------|---------|
| `--no-merges` | Toggle | OFF |
| `--merges` | Toggle | OFF |
| `--first-parent` | Toggle | OFF |
| `--reverse` | Toggle | OFF |
| `--all` | Toggle | OFF |
| `--follow` | Toggle | OFF |

### 3. SEARCH (requires input)
| Flag | Type | Placeholder |
|------|------|-------------|
| `--author=` | Text | "author name or email" |
| `--committer=` | Text | "committer name or email" |
| `--grep=` | Text | "commit message pattern" |
| `-S` | Text | "string to search in diff" |
| `-G` | Text | "regex to search in diff" |
| `-- <path>` | Text | "file or directory path" |

### 4. DATE (requires input)
| Flag | Type | Placeholder |
|------|------|-------------|
| `--since=` | Text | "1 week ago, 2024-01-01" |
| `--until=` | Text | "yesterday, 2024-12-31" |
| `-n` | Number | "number of commits" |

### 5. DIFF FILTER (multi-select)
| Flag | Description |
|------|-------------|
| `--diff-filter=A` | Added |
| `--diff-filter=D` | Deleted |
| `--diff-filter=M` | Modified |
| `--diff-filter=R` | Renamed |

### 6. ORDER (single-select radio)
| Flag | Description |
|------|-------------|
| (default) | Reverse chronological |
| `--date-order` | Commit timestamp |
| `--author-date-order` | Author timestamp |
| `--topo-order` | Topological |

### 7. DATE FORMAT (single-select radio)
| Flag | Description |
|------|-------------|
| (default) | Full date |
| `--date=relative` | "2 hours ago" |
| `--date=short` | YYYY-MM-DD |
| `--date=human` | Smart format |

---

## Implementation Phases

### Phase 1: MVP (Core Experience)

**Goal:** Functional TUI with all flag categories, text inputs, and basic detail view.

#### 1.1 Project Setup
- [ ] Initialize Bun project with TypeScript
- [ ] Install dependencies: OpenTUI, simple-git
- [ ] Set up project structure
- [ ] Add git repository detection (exit with error if not in git repo)

#### 1.2 Core Layout
- [ ] App shell with main view and command bar
- [ ] Tabbed sidebar component with `[`/`]` navigation
- [ ] Results pane (raw git output display)
- [ ] Focus management (`h`/`l` between sidebar and results)
- [ ] Sidebar toggle (`Tab`)

#### 1.3 Flag System
- [ ] Toggle flags (FORMAT, FILTER categories)
  - `--oneline`, `--graph`, `--decorate`, `--stat`, `--shortstat`, `--name-only`, `--name-status`, `--abbrev-commit`
  - `--no-merges`, `--merges`, `--first-parent`, `--reverse`, `--all`, `--follow`
- [ ] Text input flags with input bar UX (SEARCH, DATE categories)
  - `--author=`, `--committer=`, `--grep=`, `-S`, `-G`, `-- <path>`
  - `--since=`, `--until=`, `-n`
- [ ] Single-select flags with cycle-on-Enter (ORDER, DATE FORMAT)
- [ ] Multi-select flags with grouped label (DIFF FILTER)
- [ ] Command builder function
- [ ] Execute git log via simple-git, display raw output

#### 1.4 Navigation & Interaction
- [ ] `j/k` navigation in sidebar (flags) and results (lines)
- [ ] `Space`/`Enter` to toggle flags
- [ ] `Enter` on text flag opens input bar, `Enter` confirms, `Esc` cancels
- [ ] `d` to clear text flag value
- [ ] Error display in results pane when git fails

#### 1.5 Basic Detail View
- [ ] `Enter` on commit line opens detail view
- [ ] Parse commit hash from results line (regex: `/^[*| ]*([a-f0-9]+)/`)
- [ ] Run `git show <hash> --no-patch` and display output
- [ ] `Esc` returns to main view (cursor position preserved)
- [ ] `j/k` and `Ctrl+d/u` for scrolling

#### 1.6 Polish
- [ ] `y` to yank command to clipboard (OSC 52)
- [ ] `y` in detail view to yank commit hash
- [ ] `?` for help modal overlay
- [ ] `q` to quit

**MVP Deliverable:** `bunx igl` works in any git repo with full flag exploration.

---

### Phase 2: Enhanced UX

**Goal:** Refinements based on MVP usage feedback.

#### 2.1 Detail View Enhancements
- [ ] Add `--stat` output to detail view
- [ ] `d` to toggle full diff display
- [ ] `n/p` to navigate between commits without returning to list

#### 2.2 CLI Arguments
- [ ] Support flag passthrough: `igl --author=jcha --no-merges`
- [ ] Support ref ranges: `igl HEAD~10..HEAD`

#### 2.3 Performance
- [ ] Virtual scrolling for large result sets
- [ ] Loading indicator during git execution

---

### Phase 3: Distribution & Polish

**Goal:** Ready for public release.

#### 3.1 Distribution
- [ ] npm package: `npm install -g igl`
- [ ] Single binary via `bun build --compile`

#### 3.2 Additional Features
- [ ] Custom themes / color schemes
- [ ] `--follow` file history mode
- [ ] Fuzzy search within results (`/`)

---

### Future Ideas (Post v1)

- Save/load query presets
- Export results to file
- Integration with external diff viewer
- Support custom `--pretty=format:` strings
- Tab indicators showing active flags per category

---

## Technical Stack

- **Framework**: OpenTUI (TypeScript)
- **Runtime**: Bun
- **Git interaction**: simple-git library

### Architecture Notes

```
┌─────────────────────────────────────────┐
│                  App                    │
├─────────────────────────────────────────┤
│  currentView: 'main' | 'detail'         │
│                                         │
│  ┌─ Main View ────────────────────────┐ │
│  │ ┌───────────┐ ┌──────────────────┐ │ │
│  │ │  Sidebar  │ │   ResultsPane    │ │ │
│  │ │ ┌───────┐ │ │                  │ │ │
│  │ │ │TabBar │ │ │   (raw git       │ │ │
│  │ │ ├───────┤ │ │    output)       │ │ │
│  │ │ │Flags  │ │ │                  │ │ │
│  │ │ │       │ │ │                  │ │ │
│  │ │ ├───────┤ │ │                  │ │ │
│  │ │ │InputBar│ │ │                  │ │ │
│  │ │ └───────┘ │ │                  │ │ │
│  │ └───────────┘ └──────────────────┘ │ │
│  └────────────────────────────────────┘ │
│                                         │
│  ┌─ Detail View (replaces main) ──────┐ │
│  │  (raw git show output)             │ │
│  └────────────────────────────────────┘ │
│                                         │
│  ┌─ Help Modal (overlay) ─────────────┐ │
│  │  Keyboard shortcuts reference      │ │
│  └────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│              CommandBar                 │
└─────────────────────────────────────────┘
```

### State Management

```typescript
interface AppState {
  flags: {
    // Toggles (FORMAT)
    oneline: boolean;
    graph: boolean;
    decorate: boolean;
    stat: boolean;
    shortstat: boolean;
    nameOnly: boolean;
    nameStatus: boolean;
    abbrevCommit: boolean;
    // Toggles (FILTER)
    noMerges: boolean;
    merges: boolean;
    firstParent: boolean;
    reverse: boolean;
    all: boolean;
    follow: boolean;
    // Text inputs (SEARCH)
    author: string | null;
    committer: string | null;
    grep: string | null;
    pickaxeS: string | null;  // -S
    pickaxeG: string | null;  // -G
    path: string | null;
    // Text inputs (DATE)
    since: string | null;
    until: string | null;
    maxCount: number | null;  // -n
    // Single-select (ORDER) - cycles on Enter
    order: 'default' | 'date' | 'author-date' | 'topo';
    // Single-select (DATE FORMAT) - cycles on Enter
    dateFormat: 'default' | 'relative' | 'short' | 'human';
    // Multi-select (DIFF FILTER)
    diffFilter: Set<'A' | 'D' | 'M' | 'R'>;
  };
  ui: {
    currentView: 'main' | 'detail';
    sidebarVisible: boolean;
    focusedPane: 'sidebar' | 'results';
    activeTab: 'format' | 'filter' | 'search' | 'date' | 'diff' | 'order' | 'datefmt';
    selectedFlagIndex: number;  // within current tab
    selectedResultLine: number;
    resultsScrollOffset: number;
    inputMode: boolean;
    inputTarget: string | null;
    inputValue: string;
    showHelp: boolean;
  };
  results: {
    output: string;  // raw git output
    lines: string[]; // split for navigation
    loading: boolean;
    error: string | null;
  };
  detail: {
    commitHash: string | null;
    output: string;  // raw git show output
    scrollOffset: number;
  };
}
```

### Command Builder

```typescript
function buildCommand(flags: AppState['flags']): string {
  const args: string[] = ['git', 'log'];

  // FORMAT toggles
  if (flags.oneline) args.push('--oneline');
  if (flags.graph) args.push('--graph');
  if (flags.decorate) args.push('--decorate');
  if (flags.stat) args.push('--stat');
  if (flags.shortstat) args.push('--shortstat');
  if (flags.nameOnly) args.push('--name-only');
  if (flags.nameStatus) args.push('--name-status');
  if (flags.abbrevCommit) args.push('--abbrev-commit');

  // FILTER toggles
  if (flags.noMerges) args.push('--no-merges');
  if (flags.merges) args.push('--merges');
  if (flags.firstParent) args.push('--first-parent');
  if (flags.reverse) args.push('--reverse');
  if (flags.all) args.push('--all');
  if (flags.follow) args.push('--follow');

  // SEARCH text inputs
  if (flags.author) args.push(`--author="${flags.author}"`);
  if (flags.committer) args.push(`--committer="${flags.committer}"`);
  if (flags.grep) args.push(`--grep="${flags.grep}"`);
  if (flags.pickaxeS) args.push(`-S "${flags.pickaxeS}"`);
  if (flags.pickaxeG) args.push(`-G "${flags.pickaxeG}"`);

  // DATE text inputs
  if (flags.since) args.push(`--since="${flags.since}"`);
  if (flags.until) args.push(`--until="${flags.until}"`);
  if (flags.maxCount) args.push(`-n ${flags.maxCount}`);

  // DIFF FILTER multi-select
  if (flags.diffFilter.size > 0) {
    args.push(`--diff-filter=${[...flags.diffFilter].join('')}`);
  }

  // ORDER single-select
  if (flags.order !== 'default') {
    args.push(`--${flags.order}-order`);
  }

  // DATE FORMAT single-select
  if (flags.dateFormat !== 'default') {
    args.push(`--date=${flags.dateFormat}`);
  }

  // Path must come last
  if (flags.path) args.push('--', flags.path);

  return args.join(' ');
}
```

### Commit Hash Extraction

Since we display raw git output, we need to extract commit hashes for detail view navigation:

```typescript
// Handles both regular and --graph output
const COMMIT_LINE_REGEX = /^[*| \\\/]*([a-f0-9]{7,40})\b/;

function extractCommitHash(line: string): string | null {
  const match = line.match(COMMIT_LINE_REGEX);
  return match ? match[1] : null;
}

function isCommitLine(line: string): boolean {
  return COMMIT_LINE_REGEX.test(line);
}
```

---

## Success Metrics

1. User can build a complex git log query without knowing flag syntax
2. Command bar always shows valid, copy-paste-able command
3. Results update within 100ms of flag change (for typical repos)
4. Zero configuration required - works in any git repo

---

## Resolved Questions

| Question | Resolution |
|----------|------------|
| How to handle large repos (100k+ commits)? | No artificial limit. Git handles large repos fine. Add virtual scrolling in Phase 2 if needed. |
| Should we support custom `--pretty=format:`? | Deferred to Future Ideas. Raw output strategy means users see exactly what git returns. |
