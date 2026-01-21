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

## UI Layout

### Main Layout
```
┌─ Flags ─────────────┬─ Results ──────────────────────────┐
│ FORMAT              │                                    │
│ [x] --oneline       │ a1b2c3d Fix auth bug               │
│ [ ] --graph         │ e4f5g6h Add login page             │
│ [ ] --stat          │ i7j8k9l Refactor utils             │
│                     │ ...                                │
│ FILTER              │                                    │
│ [x] --no-merges     │                                    │
│ [ ] --first-parent  │                                    │
│                     │                                    │
│ SEARCH              │                                    │
│ [>] --author: jcha  │                                    │
│ [ ] --grep          │                                    │
│ [ ] -S (pickaxe)    │                                    │
│                     │                                    │
├─ Input ─────────────┤                                    │
│ --author: [jcha__]  │                                    │
│ <Enter> set <Esc>   │                                    │
├─────────────────────┴────────────────────────────────────┤
│ > git log --oneline --no-merges --author="jcha"          │
└──────────────────────────────────────────────────────────┘
```

### Layout Components

| Component | Description |
|-----------|-------------|
| **Sidebar** | Toggleable (show/hide with `Tab`). Contains categorized flags. |
| **Results pane** | Main area showing git log output. Scrollable. |
| **Input bar** | Appears at bottom of sidebar when editing text-based flags. |
| **Command bar** | Always visible at bottom. Shows the current `git log` command. |

### Sidebar Behavior

- **Toggle flags**: Navigate with `j/k`, toggle with `Space` or `Enter`
- **Text inputs**: Press `Enter` on a text-based flag → Input bar appears → Type value → `Enter` to set, `Esc` to cancel
- **Active state**: Flags with values show the value inline (e.g., `[>] --author: jcha`)
- **Clear value**: Press `d` or `Delete` on a text flag to clear it

### Results Pane Behavior

- Auto-refreshes when any flag changes
- Scrollable with `j/k` when focused (or `Ctrl+d/u` for page)
- Press `Enter` on a commit to open detail view (see below)

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
│ commit e4f5g6h                                          │
│ Author: jcha <jcha@example.com>                         │
│ Date:   Mon Jan 20 2026                                 │
│                                                         │
│ Add login page                                          │
│                                                         │
│ - Implements OAuth2 flow                                │
│ - Adds session management                               │
│                                                         │
│ ─────────────────────────────────────────────────────── │
│ src/auth/login.ts  | 45 ++++++++++++++                  │
│ src/auth/session.ts| 22 ++++++                          │
│                                                         │
│ [Esc] back   [d] show diff   [j/k] scroll               │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Esc
                          ▼
        (Back to Main View, cursor position preserved)
```

**Detail View Behavior:**
- Sidebar auto-hides when entering detail view
- Full screen shows commit metadata, message, and file stats
- `j/k` scrolls within the detail view
- `d` toggles full diff display (shows patch content)
- `Esc` returns to main view (cursor position preserved)
- `n/p` navigates to next/previous commit without returning to list

### Keyboard Shortcuts

#### Main View
| Key | Action |
|-----|--------|
| `Tab` | Toggle sidebar visibility |
| `h/l` | Switch focus between sidebar and results |
| `j/k` | Navigate up/down in current pane |
| `Space` | Toggle flag (sidebar) |
| `Enter` | Toggle flag (sidebar) / Open detail view (results) |
| `Esc` | Cancel input |
| `d` | Clear text flag value (sidebar) |
| `q` | Quit |
| `y` | Yank current command to clipboard |
| `?` | Show help |

#### Detail View
| Key | Action |
|-----|--------|
| `Esc` | Return to main view |
| `j/k` | Scroll up/down |
| `Ctrl+d/u` | Page down/up |
| `d` | Toggle full diff display |
| `n` | Next commit (without returning to list) |
| `p` | Previous commit |
| `y` | Yank commit hash to clipboard |
| `q` | Quit (back to main view) |

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

## MVP Scope (Phase 1)

### Included
- Sidebar with FORMAT and FILTER toggles
- Results pane with live refresh
- Command bar showing current command
- Basic navigation (j/k, Tab, Space)
- `--oneline`, `--graph`, `--decorate`, `--stat`
- `--no-merges`, `--reverse`, `-n`
- `y` to yank command

### Excluded from MVP
- Text input flags (--author, --grep, -S)
- Date filtering
- Diff filter
- Commit detail view
- Custom themes

---

## Phase 2

- Text input support (--author, --grep, -S, --since, --until)
- Input bar UX
- Path filtering (`-- <path>`)

## Phase 3

- Diff filter multi-select
- Order/date format radio selects
- Commit detail view (press Enter on commit)
- `--follow` for file history

## Future Ideas

- Save/load query presets
- Export results
- Integration with diff viewer
- Fuzzy search within results

---

## Technical Stack

- **Framework**: OpenTUI (TypeScript)
- **Runtime**: Node.js / Bun
- **Git interaction**: Spawn `git log` subprocess, parse output

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
│  │ │           │ │                  │ │ │
│  │ │FlagGroup[]│ │   CommitList     │ │ │
│  │ │           │ │                  │ │ │
│  │ │ InputBar  │ │                  │ │ │
│  │ └───────────┘ └──────────────────┘ │ │
│  └────────────────────────────────────┘ │
│                                         │
│  ┌─ Detail View (replaces main) ──────┐ │
│  │                                    │ │
│  │  CommitDetail                      │ │
│  │  - metadata (hash, author, date)   │ │
│  │  - message                         │ │
│  │  - file stats                      │ │
│  │  - diff (toggleable)               │ │
│  │                                    │ │
│  └────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│              CommandBar                 │
└─────────────────────────────────────────┘
```

### State Management

```typescript
interface AppState {
  flags: {
    // Toggles
    oneline: boolean;
    graph: boolean;
    decorate: boolean;
    stat: boolean;
    noMerges: boolean;
    reverse: boolean;
    // Text inputs
    author: string | null;
    grep: string | null;
    pickaxe: string | null;
    since: string | null;
    until: string | null;
    maxCount: number | null;
    path: string | null;
    // Single-select
    order: 'default' | 'date' | 'author-date' | 'topo';
    dateFormat: 'default' | 'relative' | 'short' | 'human';
    // Multi-select
    diffFilter: Set<'A' | 'D' | 'M' | 'R'>;
  };
  ui: {
    currentView: 'main' | 'detail';
    sidebarVisible: boolean;
    focusedPane: 'sidebar' | 'results';
    selectedFlagIndex: number;
    selectedCommitIndex: number;
    inputMode: boolean;
    inputTarget: string | null;
  };
  results: {
    commits: Commit[];
    loading: boolean;
    error: string | null;
  };
  detail: {
    commit: Commit | null;
    showDiff: boolean;
    scrollOffset: number;
  };
}
```

### Command Builder

```typescript
function buildCommand(flags: AppState['flags']): string {
  const args: string[] = ['git', 'log'];

  if (flags.oneline) args.push('--oneline');
  if (flags.graph) args.push('--graph');
  if (flags.decorate) args.push('--decorate');
  if (flags.stat) args.push('--stat');
  if (flags.noMerges) args.push('--no-merges');
  if (flags.reverse) args.push('--reverse');
  if (flags.author) args.push(`--author="${flags.author}"`);
  if (flags.grep) args.push(`--grep="${flags.grep}"`);
  if (flags.pickaxe) args.push(`-S "${flags.pickaxe}"`);
  if (flags.since) args.push(`--since="${flags.since}"`);
  if (flags.until) args.push(`--until="${flags.until}"`);
  if (flags.maxCount) args.push(`-n ${flags.maxCount}`);
  if (flags.diffFilter.size > 0) {
    args.push(`--diff-filter=${[...flags.diffFilter].join('')}`);
  }
  if (flags.order !== 'default') {
    args.push(`--${flags.order}-order`);
  }
  if (flags.dateFormat !== 'default') {
    args.push(`--date=${flags.dateFormat}`);
  }
  if (flags.path) args.push('--', flags.path);

  return args.join(' ');
}
```

---

## Success Metrics

1. User can build a complex git log query without knowing flag syntax
2. Command bar always shows valid, copy-paste-able command
3. Results update within 100ms of flag change (for typical repos)
4. Zero configuration required - works in any git repo

---

## Open Questions

1. Should we support custom `--pretty=format:` strings?
2. How to handle very large repos (100k+ commits)? Pagination? Virtual scrolling?
