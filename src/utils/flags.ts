import type { FlagDefinition, TabCategory } from "../types.ts"

// Flag definitions organized by category
export const FLAG_DEFINITIONS: FlagDefinition[] = [
  // FORMAT category
  { id: "oneline", label: "--oneline", type: "toggle", category: "format", defaultValue: true },
  { id: "graph", label: "--graph", type: "toggle", category: "format", defaultValue: false },
  { id: "decorate", label: "--decorate", type: "toggle", category: "format", defaultValue: true },
  { id: "stat", label: "--stat", type: "toggle", category: "format", defaultValue: false },
  { id: "shortstat", label: "--shortstat", type: "toggle", category: "format", defaultValue: false },
  { id: "nameOnly", label: "--name-only", type: "toggle", category: "format", defaultValue: false },
  { id: "nameStatus", label: "--name-status", type: "toggle", category: "format", defaultValue: false },
  { id: "abbrevCommit", label: "--abbrev-commit", type: "toggle", category: "format", defaultValue: true },

  // FILTER category
  { id: "noMerges", label: "--no-merges", type: "toggle", category: "filter", defaultValue: false },
  { id: "merges", label: "--merges", type: "toggle", category: "filter", defaultValue: false },
  { id: "firstParent", label: "--first-parent", type: "toggle", category: "filter", defaultValue: false },
  { id: "reverse", label: "--reverse", type: "toggle", category: "filter", defaultValue: false },
  { id: "all", label: "--all", type: "toggle", category: "filter", defaultValue: false },
  { id: "follow", label: "--follow", type: "toggle", category: "filter", defaultValue: false },

  // SEARCH category
  { id: "author", label: "--author=", type: "text", category: "search", placeholder: "author name or email" },
  { id: "committer", label: "--committer=", type: "text", category: "search", placeholder: "committer name or email" },
  { id: "grep", label: "--grep=", type: "text", category: "search", placeholder: "commit message pattern" },
  { id: "pickaxeS", label: "-S", type: "text", category: "search", placeholder: "string to search in diff" },
  { id: "pickaxeG", label: "-G", type: "text", category: "search", placeholder: "regex to search in diff" },
  { id: "path", label: "-- <path>", type: "text", category: "search", placeholder: "file or directory path" },

  // DATE category
  { id: "since", label: "--since=", type: "text", category: "date", placeholder: "1 week ago, 2024-01-01" },
  { id: "until", label: "--until=", type: "text", category: "date", placeholder: "yesterday, 2024-12-31" },
  { id: "maxCount", label: "-n", type: "number", category: "date", placeholder: "number of commits" },

  // DIFF FILTER category (multi-select)
  { id: "diffFilterA", label: "Added (A)", type: "multi-select", category: "diff" },
  { id: "diffFilterD", label: "Deleted (D)", type: "multi-select", category: "diff" },
  { id: "diffFilterM", label: "Modified (M)", type: "multi-select", category: "diff" },
  { id: "diffFilterR", label: "Renamed (R)", type: "multi-select", category: "diff" },

  // ORDER category (single-select)
  {
    id: "order",
    label: "Sort order",
    type: "single-select",
    category: "order",
    options: ["default", "date", "author-date", "topo"] as const,
    defaultValue: "default",
  },

  // DATE FORMAT category (single-select)
  {
    id: "dateFormat",
    label: "Date format",
    type: "single-select",
    category: "datefmt",
    options: ["default", "relative", "short", "human"] as const,
    defaultValue: "default",
  },
]

// Get flags for a specific category
export function getFlagsForCategory(category: TabCategory): FlagDefinition[] {
  return FLAG_DEFINITIONS.filter((f) => f.category === category)
}

// Tab display names
export const TAB_NAMES: Record<TabCategory, string> = {
  format: "FORMAT",
  filter: "FILTER",
  search: "SEARCH",
  date: "DATE",
  diff: "DIFF",
  order: "ORDER",
  datefmt: "DATE FMT",
}

// Tab order for navigation
export const TAB_ORDER: TabCategory[] = ["format", "filter", "search", "date", "diff", "order", "datefmt"]
