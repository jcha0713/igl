import type { TabCategory } from "../types.ts"
import { TAB_NAMES, TAB_ORDER } from "../utils/flags.ts"

interface TabBarProps {
  activeTab: TabCategory
}

export function TabBar({ activeTab }: TabBarProps) {
  return (
    <box flexDirection="row" height={1}>
      {TAB_ORDER.map((tab) => {
        const isActive = tab === activeTab
        const name = TAB_NAMES[tab]
        return (
          <box key={tab} paddingRight={1}>
            <text fg={isActive ? "#7aa2f7" : "#565f89"}>
              {isActive ? <span fg="#7aa2f7">[{name}]</span> : <span fg="#565f89">{name}</span>}
            </text>
          </box>
        )
      })}
    </box>
  )
}
