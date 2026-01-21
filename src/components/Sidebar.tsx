import type { TabCategory, FlagsState } from "../types.ts"
import { TabBar } from "./TabBar.tsx"
import { FlagItem } from "./FlagItem.tsx"
import { getFlagsForCategory } from "../utils/flags.ts"

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

  return (
    <box
      flexDirection="column"
      width={24}
      border
      borderColor={isFocused ? "#7aa2f7" : "#414868"}
      title="Flags"
      titleAlignment="left"
    >
      {/* Tab bar */}
      <TabBar activeTab={activeTab} />

      {/* Separator line using text */}
      <box height={1}>
        <text fg="#414868">{"─".repeat(22)}</text>
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
        <box border borderColor="#7aa2f7" paddingLeft={1} height={3}>
          <box flexDirection="column">
            <text fg="#565f89">Enter value:</text>
            <text fg="#c0caf5">
              <span fg="#7aa2f7">&gt; </span>
              {inputValue}
              <span fg="#7aa2f7">_</span>
            </text>
          </box>
        </box>
      )}
    </box>
  )
}
