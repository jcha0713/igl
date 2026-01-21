# igl - Interactive Git Log

A terminal UI tool that lets you interactively build and execute `git log` queries by toggling flags and seeing results update in real-time.

## Installation

```bash
bun install
```

## Usage

```bash
bun run start
```

Or run directly:

```bash
bun run src/index.tsx
```

## Keyboard Shortcuts

### Navigation
| Key | Action |
|-----|--------|
| `j/k` | Move up/down |
| `h/l` | Switch focus (sidebar/results) |
| `[/]` | Previous/next tab |
| `Tab` | Toggle sidebar |

### Flags
| Key | Action |
|-----|--------|
| `Space/Enter` | Toggle flag / cycle option |
| `Enter` | Edit text flag (opens input) |
| `d` | Clear text flag value |

### Results
| Key | Action |
|-----|--------|
| `Enter` | Open commit detail view |
| `y` | Yank command to clipboard |

### Detail View
| Key | Action |
|-----|--------|
| `Esc` | Return to main view |
| `j/k` | Scroll up/down |
| `y` | Yank commit hash |

### General
| Key | Action |
|-----|--------|
| `?` | Toggle help |
| `q` | Quit |

## Flag Categories

- **FORMAT**: Output style flags (`--oneline`, `--graph`, etc.)
- **FILTER**: Commit selection flags (`--no-merges`, `--all`, etc.)
- **SEARCH**: Text search flags (`--author=`, `--grep=`, etc.)
- **DATE**: Date range flags (`--since=`, `--until=`, `-n`)
- **DIFF**: Diff filter flags (`--diff-filter=A/D/M/R`)
- **ORDER**: Sort order (`--date-order`, `--topo-order`, etc.)
- **DATE FMT**: Date format (`--date=relative/short/human`)

## Requirements

- Bun runtime
- Git repository
