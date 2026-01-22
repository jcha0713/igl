// Layout dimensions
export const LAYOUT = {
  // Sidebar
  sidebar: {
    width: 34,
    get innerWidth() {
      return this.width - 2 // Account for border
    },
  },

  // Borders add 2 to dimensions (1 on each side)
  border: {
    size: 1,
    total: 2,
  },

  // Command bar at bottom
  commandBar: {
    height: 1,
  },

  // Detail view footer
  detailFooter: {
    height: 1,
  },

  // Help modal
  helpModal: {
    margin: {
      top: 2,
      bottom: 2,
      left: 5,
      right: 5,
    },
    keyColumnWidth: 16,
  },

  // Input bar in sidebar
  inputBar: {
    height: 3,
  },
} as const

// Calculate derived layout values
export function getResultsVisibleHeight(totalHeight: number): number {
  return totalHeight - LAYOUT.commandBar.height - LAYOUT.border.total
}

export function getDetailVisibleHeight(totalHeight: number): number {
  return totalHeight - LAYOUT.detailFooter.height - LAYOUT.border.total - 1 // -1 for padding
}

export function getSidebarVisibleHeight(totalHeight: number): number {
  return totalHeight - LAYOUT.commandBar.height
}

// Tokyo Night color theme
export const THEME = {
  // Primary colors
  primary: "#7aa2f7", // Blue - used for focus, active items
  secondary: "#bb9af7", // Purple - used for keys, highlights

  // Text colors
  text: {
    bright: "#c0caf5", // Selected/highlighted text
    normal: "#a9b1d6", // Normal text
    dimmed: "#565f89", // Dimmed/inactive text
  },

  // Border colors
  border: {
    focused: "#7aa2f7",
    unfocused: "#414868",
    error: "#f7768e",
  },

  // Background colors
  background: {
    dark: "#1a1b26", // Modal/overlay background
    selection: "#24283b", // Selected row background
    bar: "#1a1a2e", // Command bar/footer background
    transparent: "transparent",
  },

  // Status colors
  error: "#f7768e", // Red - errors
} as const
