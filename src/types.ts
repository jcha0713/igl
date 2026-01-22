// Flag categories for the tabbed sidebar
export type TabCategory =
  | "format"
  | "filter"
  | "search"
  | "date"
  | "diff"
  | "order"
  | "datefmt"

// Order options for single-select
export type OrderType = "default" | "date" | "author-date" | "topo"

// Date format options for single-select
export type DateFormatType = "default" | "relative" | "short" | "human"

// Diff filter options for multi-select
export type DiffFilterType = "A" | "D" | "M" | "R"

// Flag types
export type FlagType = "toggle" | "text" | "number" | "single-select" | "multi-select"

export interface FlagDefinition {
  id: string
  label: string
  type: FlagType
  category: TabCategory
  placeholder?: string
  options?: readonly string[]
  defaultValue?: boolean | string | number | null
}

// Application state
export interface FlagsState {
  // Toggles (FORMAT)
  oneline: boolean
  graph: boolean
  decorate: boolean
  stat: boolean
  shortstat: boolean
  nameOnly: boolean
  nameStatus: boolean
  abbrevCommit: boolean
  // Toggles (FILTER)
  noMerges: boolean
  merges: boolean
  firstParent: boolean
  reverse: boolean
  all: boolean
  follow: boolean
  // Text inputs (SEARCH)
  author: string | null
  committer: string | null
  grep: string | null
  pickaxeS: string | null // -S
  pickaxeG: string | null // -G
  path: string | null
  // Text inputs (DATE)
  since: string | null
  until: string | null
  maxCount: number | null // -n
  // Single-select (ORDER) - cycles on Enter
  order: OrderType
  // Single-select (DATE FORMAT) - cycles on Enter
  dateFormat: DateFormatType
  // Multi-select (DIFF FILTER)
  diffFilter: Set<DiffFilterType>
}

export interface UIState {
  currentView: "main" | "detail"
  sidebarVisible: boolean
  focusedPane: "sidebar" | "results"
  selectedFlagIndex: number // global index across all flags (0 to N-1)
  selectedResultLine: number
  resultsScrollOffset: number
  inputMode: boolean
  inputTarget: string | null
  inputValue: string
  showHelp: boolean
}

export interface ResultsState {
  output: string // raw git output
  lines: string[] // split for navigation
  loading: boolean
  error: string | null
}

export interface DetailState {
  commitHash: string | null
  output: string // raw git show output
  scrollOffset: number
}

export interface AppState {
  flags: FlagsState
  ui: UIState
  results: ResultsState
  detail: DetailState
}

// Action types for state updates
export type AppAction =
  | { type: "TOGGLE_FLAG"; flag: keyof FlagsState }
  | { type: "SET_TEXT_FLAG"; flag: keyof FlagsState; value: string | null }
  | { type: "SET_NUMBER_FLAG"; flag: keyof FlagsState; value: number | null }
  | { type: "CYCLE_ORDER" }
  | { type: "CYCLE_DATE_FORMAT" }
  | { type: "TOGGLE_DIFF_FILTER"; filter: DiffFilterType }
  | { type: "SET_SELECTED_FLAG_INDEX"; index: number }
  | { type: "SET_SELECTED_RESULT_LINE"; line: number }
  | { type: "SET_RESULTS_SCROLL_OFFSET"; offset: number }
  | { type: "SET_FOCUSED_PANE"; pane: "sidebar" | "results" }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "ENTER_INPUT_MODE"; target: string }
  | { type: "EXIT_INPUT_MODE" }
  | { type: "SET_INPUT_VALUE"; value: string }
  | { type: "TOGGLE_HELP" }
  | { type: "SET_RESULTS"; output: string; lines: string[] }
  | { type: "SET_RESULTS_LOADING"; loading: boolean }
  | { type: "SET_RESULTS_ERROR"; error: string | null }
  | { type: "ENTER_DETAIL_VIEW"; commitHash: string; output: string }
  | { type: "EXIT_DETAIL_VIEW" }
  | { type: "SET_DETAIL_SCROLL_OFFSET"; offset: number }
