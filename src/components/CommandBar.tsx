import { LAYOUT, THEME } from "../constants.ts"

interface CommandBarProps {
  command: string
}

export function CommandBar({ command }: CommandBarProps) {
  return (
    <box height={LAYOUT.commandBar.height} backgroundColor={THEME.background.bar}>
      <text fg={THEME.primary}>
        <span fg={THEME.text.dimmed}>&gt; </span>
        {command}
      </text>
    </box>
  )
}
