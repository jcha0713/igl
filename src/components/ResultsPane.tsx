import { isCommitLine } from "../utils/commit-parser.ts";
import { LAYOUT, THEME } from "../constants.ts";

interface ResultsPaneProps {
  lines: string[];
  selectedLine: number;
  scrollOffset: number;
  loading: boolean;
  error: string | null;
  isFocused: boolean;
  height: number;
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
  const borderColor = isFocused ? THEME.border.focused : THEME.border.unfocused;

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
        <text fg={THEME.text.dimmed}>Loading...</text>
      </box>
    );
  }

  // Show error state
  if (error) {
    return (
      <box
        flexGrow={1}
        border
        borderColor={THEME.border.error}
        title="Error"
        titleAlignment="left"
        padding={1}
      >
        <text fg={THEME.error}>{error}</text>
      </box>
    );
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
        <text fg={THEME.text.dimmed}>No commits found</text>
      </box>
    );
  }

  // Calculate visible lines based on scroll offset
  const visibleHeight = height - LAYOUT.border.total;
  const visibleLines = lines.slice(scrollOffset, scrollOffset + visibleHeight);

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
        const actualIndex = scrollOffset + index;
        const isSelected = actualIndex === selectedLine && isFocused;
        const isCommit = isCommitLine(line);

        return (
          <box
            key={actualIndex}
            height={1}
            backgroundColor={
              isSelected
                ? THEME.background.selection
                : THEME.background.transparent
            }
          >
            <text
              fg={
                isSelected
                  ? THEME.text.bright
                  : isCommit
                    ? THEME.text.normal
                    : THEME.text.dimmed
              }
            >
              {isSelected && isFocused ? (
                <span fg={THEME.primary}>&gt; </span>
              ) : (
                <span fg="transparent">{"  "}</span>
              )}
              {line}
            </text>
          </box>
        );
      })}
    </box>
  );
}
