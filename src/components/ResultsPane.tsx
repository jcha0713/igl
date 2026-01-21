import { isCommitLine } from "../utils/commit-parser.ts"

interface ResultsPaneProps {
  lines: string[]
  selectedLine: number
  scrollOffset: number
  loading: boolean
  error: string | null
  isFocused: boolean
  height: number
}

export function ResultsPane({
  lines,
  selectedLine,
  scrollOffset,
  loading,
  error,
  isFocused,
  height,
}: ResultsPaneProps) {
  const borderColor = isFocused ? "#7aa2f7" : "#414868"

  // Show loading state
  if (loading) {
    return (
      <box
        flexGrow={1}
        border
        borderColor={borderColor}
        title="Results"
        titleAlignment="left"
        padding={1}
      >
        <text fg="#565f89">Loading...</text>
      </box>
    )
  }

  // Show error state
  if (error) {
    return (
      <box
        flexGrow={1}
        border
        borderColor="#f7768e"
        title="Error"
        titleAlignment="left"
        padding={1}
      >
        <text fg="#f7768e">{error}</text>
      </box>
    )
  }

  // Show empty state
  if (lines.length === 0) {
    return (
      <box
        flexGrow={1}
        border
        borderColor={borderColor}
        title="Results"
        titleAlignment="left"
        padding={1}
      >
        <text fg="#565f89">No commits found</text>
      </box>
    )
  }

  // Calculate visible lines based on scroll offset
  const visibleHeight = height - 2 // Account for border
  const visibleLines = lines.slice(scrollOffset, scrollOffset + visibleHeight)

  return (
    <box
      flexGrow={1}
      border
      borderColor={borderColor}
      title="Results"
      titleAlignment="left"
      flexDirection="column"
    >
      {visibleLines.map((line, index) => {
        const actualIndex = scrollOffset + index
        const isSelected = actualIndex === selectedLine && isFocused
        const isCommit = isCommitLine(line)

        return (
          <box
            key={actualIndex}
            height={1}
            backgroundColor={isSelected ? "#24283b" : "transparent"}
          >
            <text fg={isSelected ? "#c0caf5" : isCommit ? "#a9b1d6" : "#565f89"}>
              {isSelected && isFocused ? (
                <span fg="#7aa2f7">&gt; </span>
              ) : (
                <span fg="transparent">{"  "}</span>
              )}
              {line}
            </text>
          </box>
        )
      })}
    </box>
  )
}
