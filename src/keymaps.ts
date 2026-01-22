// Centralized keymap configuration - single source of truth
// Used by HelpModal and footer hints

export interface KeymapItem {
  key: string
  shortKey?: string  // Abbreviated version for footer display
  desc: string
}

export interface KeymapSection {
  category: string
  items: KeymapItem[]
}

// Full keymaps used by HelpModal
export const KEYMAPS: KeymapSection[] = [
  {
    category: "Navigation",
    items: [
      { key: "j/k", desc: "Move up/down" },
      { key: "h/l", desc: "Switch focus (sidebar/results)" },
      { key: "[/]", desc: "Previous/next section" },
      { key: "Tab", desc: "Toggle sidebar" },
    ],
  },
  {
    category: "Flags",
    items: [
      { key: "Space/Enter", desc: "Toggle flag / cycle option" },
      { key: "Enter", desc: "Edit text flag (opens input)" },
      { key: "d", desc: "Clear text flag value" },
    ],
  },
  {
    category: "Results",
    items: [
      { key: "Enter", desc: "Open commit detail view" },
      { key: "y", desc: "Yank command to clipboard" },
    ],
  },
  {
    category: "Detail View",
    items: [
      { key: "Esc", desc: "Return to main view" },
      { key: "j/k", desc: "Scroll up/down" },
      { key: "y", desc: "Yank commit hash" },
    ],
  },
  {
    category: "General",
    items: [
      { key: "?", desc: "Toggle this help" },
      { key: "q", desc: "Quit" },
    ],
  },
]

// Footer hints for main view (abbreviated)
export const MAIN_FOOTER_HINTS: KeymapItem[] = [
  { key: "?", desc: "help" },
  { key: "Tab", desc: "sidebar" },
  { key: "h/l", desc: "panes" },
  { key: "j/k", desc: "nav" },
  { key: "Enter", desc: "select" },
  { key: "y", desc: "yank" },
  { key: "q", desc: "quit" },
]

// Footer hints for detail view
export const DETAIL_FOOTER_HINTS: KeymapItem[] = [
  { key: "Esc", desc: "back" },
  { key: "j/k", desc: "scroll" },
  { key: "y", desc: "yank hash" },
  { key: "q", desc: "quit" },
]

// Format hints for footer display
export function formatFooterHints(hints: KeymapItem[]): string {
  return hints.map((h) => `[${h.key}] ${h.desc}`).join("   ")
}
