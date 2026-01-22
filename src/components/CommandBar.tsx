import { LAYOUT, THEME } from "../constants.ts"

interface CommandBarProps {
  command: string
}

export function CommandBar({ command }: CommandBarProps) {
  return (
    <box
      height={LAYOUT.commandBar.height}
      border
      borderColor={THEME.border.unfocused}
      paddingLeft={1}
    >
      <text fg={THEME.primary}>
        <span fg={THEME.text.dimmed}>&gt; </span>
        {command}
      </text>
    </box>
  )
}
