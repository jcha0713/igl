import type { TabCategory, FlagsState } from "../types.ts"
import { TabBar } from "./TabBar.tsx"
import { FlagItem } from "./FlagItem.tsx"
import { getFlagsForCategory } from "../utils/flags.ts"
import { LAYOUT, THEME } from "../constants.ts"

interface SidebarProps {
  activeTab: TabCategory
  flags: FlagsState
  selectedIndex: number
  isFocused: boolean
  inputMode: boolean
  inputValue: string
  inputTarget: string | null
}

export function Sidebar({
  activeTab,
  flags,
  selectedIndex,
  isFocused,
  inputMode,
  inputValue,
  inputTarget,
}: SidebarProps) {
  const categoryFlags = getFlagsForCategory(activeTab)
  const borderColor = isFocused ? THEME.border.focused : THEME.border.unfocused

  return (
    <box
      flexDirection="column"
      width={LAYOUT.sidebar.width}
      border
      borderColor={borderColor}
      title="Flags"
      titleAlignment="left"
    >
      {/* Tab bar */}
      <TabBar activeTab={activeTab} />

      {/* Separator line using text */}
      <box height={1}>
        <text fg={THEME.border.unfocused}>
          {"─".repeat(LAYOUT.sidebar.innerWidth)}
        </text>
      </box>

      {/* Flag list */}
      <box flexDirection="column" flexGrow={1}>
        {categoryFlags.map((flag, index) => (
          <FlagItem
            key={flag.id}
            flag={flag}
            flags={flags}
            isSelected={index === selectedIndex}
            isFocused={isFocused}
          />
        ))}
      </box>

      {/* Input bar (appears when editing text flag) */}
      {inputMode && inputTarget && (
        <box
          border
          borderColor={THEME.border.focused}
          paddingLeft={1}
          height={LAYOUT.inputBar.height}
        >
          <box flexDirection="column">
            <text fg={THEME.text.dimmed}>Enter value:</text>
            <text fg={THEME.text.bright}>
              <span fg={THEME.primary}>&gt; </span>
              {inputValue}
              <span fg={THEME.primary}>_</span>
            </text>
          </box>
        </box>
      )}
    </box>
  )
}
