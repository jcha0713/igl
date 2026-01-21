interface DetailViewProps {
  commitHash: string
  output: string
  scrollOffset: number
  height: number
}

export function DetailView({ commitHash, output, scrollOffset, height }: DetailViewProps) {
  const lines = output.split("\n")
  const visibleHeight = height - 4 // Account for border and footer
  const visibleLines = lines.slice(scrollOffset, scrollOffset + visibleHeight)

  return (
    <box flexDirection="column" flexGrow={1}>
      {/* Content area */}
      <box
        flexGrow={1}
        border
        borderColor="#7aa2f7"
        title={`Commit ${commitHash}`}
        titleAlignment="left"
        flexDirection="column"
        padding={1}
      >
        {visibleLines.map((line, index) => (
          <box key={scrollOffset + index} height={1}>
            <text fg="#c0caf5">{line}</text>
          </box>
        ))}
      </box>

      {/* Footer with keyboard hints */}
      <box height={1} backgroundColor="#1a1a2e">
        <text fg="#565f89">
          [Esc] back   [j/k] scroll   [y] yank hash   [q] quit
        </text>
      </box>
    </box>
  )
}
