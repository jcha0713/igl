import type { FlagsState, TabCategory } from "../types.ts"
import { FlagItem } from "./FlagItem.tsx"
import { buildSidebarItems, getCurrentSection, TAB_NAMES } from "../utils/flags.ts"
import { LAYOUT, THEME } from "../constants.ts"

interface SidebarProps {
  flags: FlagsState
  selectedIndex: number
  scrollOffset: number
  isFocused: boolean
  inputMode: boolean
  inputValue: string
  inputTarget: string | null
  visibleHeight: number
}

export function Sidebar({
  flags,
  selectedIndex,
  scrollOffset,
  isFocused,
  inputMode,
  inputValue,
  inputTarget,
  visibleHeight,
}: SidebarProps) {
  const sidebarItems = buildSidebarItems()
  const currentSection = getCurrentSection(selectedIndex)
  const borderColor = isFocused ? THEME.border.focused : THEME.border.unfocused

  // Calculate visible items based on scroll offset
  const inputBarHeight = inputMode && inputTarget ? LAYOUT.inputBar.height : 0
  const availableHeight = visibleHeight - LAYOUT.border.total - inputBarHeight
  const visibleItems = sidebarItems.slice(scrollOffset, scrollOffset + availableHeight)

  return (
    <box
      flexDirection="column"
      width={LAYOUT.sidebar.width}
      border
      borderColor={borderColor}
      title={`Flags: ${TAB_NAMES[currentSection]}`}
      titleAlignment="left"
    >
      {/* Flat list with section headers */}
      <box flexDirection="column" flexGrow={1}>
        {visibleItems.map((item, visibleIndex) => {
          const actualIndex = scrollOffset + visibleIndex

          if (item.type === "header") {
            return (
              <SectionHeader
                key={`header-${item.category}`}
                category={item.category}
              />
            )
          }

          return (
            <FlagItem
              key={item.flag.id}
              flag={item.flag}
              flags={flags}
              isSelected={item.selectableIndex === selectedIndex}
              isFocused={isFocused}
            />
          )
        })}
      </box>

      {/* Input bar (appears when editing text flag) - auto-sizes to content */}
      {inputMode && inputTarget && (
        <box
          border
          borderColor={THEME.border.focused}
          paddingLeft={1}
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

interface SectionHeaderProps {
  category: TabCategory
}

function SectionHeader({ category }: SectionHeaderProps) {
  const name = TAB_NAMES[category]
  const padding = Math.floor((LAYOUT.sidebar.innerWidth - name.length - 6) / 2)
  const leftPad = "─".repeat(Math.max(1, padding))
  const rightPad = "─".repeat(Math.max(1, padding))

  return (
    <box height={1}>
      <text fg={THEME.text.dimmed}>
        {leftPad} {name} {rightPad}
      </text>
    </box>
  )
}
