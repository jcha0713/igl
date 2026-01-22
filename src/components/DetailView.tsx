import { LAYOUT, THEME, getDetailVisibleHeight } from "../constants.ts"
import { DETAIL_FOOTER_HINTS, formatFooterHints } from "../keymaps.ts"

interface DetailViewProps {
  commitHash: string
  output: string
  scrollOffset: number
  height: number
}

export function DetailView({ commitHash, output, scrollOffset, height }: DetailViewProps) {
  const lines = output.split("\n")
  const visibleHeight = getDetailVisibleHeight(height)
  const visibleLines = lines.slice(scrollOffset, scrollOffset + visibleHeight)

  return (
    <box flexDirection="column" flexGrow={1}>
      {/* Content area */}
      <box
        flexGrow={1}
        border
        borderColor={THEME.border.focused}
        title={`Commit ${commitHash}`}
        titleAlignment="left"
        flexDirection="column"
        padding={1}
      >
        {visibleLines.map((line, index) => (
          <box key={scrollOffset + index} height={1}>
            <text fg={THEME.text.bright}>{line}</text>
          </box>
        ))}
      </box>

      {/* Footer with keyboard hints */}
      <box height={LAYOUT.detailFooter.height} backgroundColor={THEME.background.bar}>
        <text fg={THEME.text.dimmed}>{formatFooterHints(DETAIL_FOOTER_HINTS)}</text>
      </box>
    </box>
  )
}
