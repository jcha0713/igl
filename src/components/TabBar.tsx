import type { TabCategory } from "../types.ts"
import { TAB_NAMES, TAB_ORDER } from "../utils/flags.ts"
import { THEME } from "../constants.ts"

interface TabBarProps {
  activeTab: TabCategory
}

export function TabBar({ activeTab }: TabBarProps) {
  return (
    <box flexDirection="row" height={1}>
      {TAB_ORDER.map((tab) => {
        const isActive = tab === activeTab
        const name = TAB_NAMES[tab]
        const color = isActive ? THEME.primary : THEME.text.dimmed
        return (
          <box key={tab} paddingRight={1}>
            <text fg={color}>
              {isActive ? <span fg={THEME.primary}>[{name}]</span> : <span fg={THEME.text.dimmed}>{name}</span>}
            </text>
          </box>
        )
      })}
    </box>
  )
}
