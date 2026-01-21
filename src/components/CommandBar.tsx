interface CommandBarProps {
  command: string
}

export function CommandBar({ command }: CommandBarProps) {
  return (
    <box height={1} backgroundColor="#1a1a2e">
      <text fg="#7aa2f7">
        <span fg="#565f89">&gt; </span>
        {command}
      </text>
    </box>
  )
}
