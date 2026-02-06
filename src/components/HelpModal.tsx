import { useTerminalDimensions } from "@opentui/react";
import { useMemo } from "react";
import { THEME } from "../constants.ts";
import { KEYMAPS } from "../keymaps.ts";

interface HelpModalProps {
  scrollOffset: number;
  onClose: () => void;
}

export function HelpModal({ scrollOffset, onClose }: HelpModalProps) {
  const { width, height } = useTerminalDimensions();

  // Responsive sizing
  const modalWidth = useMemo(() => {
    const maxWidth = 70;
    const minWidth = 50;
    const available = width - 8;
    return Math.max(minWidth, Math.min(maxWidth, available));
  }, [width]);

  const modalHeight = useMemo(() => {
    const available = height - 4;
    return Math.max(12, available);
  }, [height]);

  const left = Math.floor((width - modalWidth) / 2);
  const top = Math.floor((height - modalHeight) / 2);

  // Flatten keymaps into rows
  const allRows = useMemo(() => {
    const rows: Array<
      | { type: "header"; category: string }
      | { type: "item"; key: string; desc: string }
    > = [];
    for (const section of KEYMAPS) {
      rows.push({ type: "header", category: section.category });
      for (const item of section.items) {
        rows.push({ type: "item", key: item.key, desc: item.desc });
      }
    }
    return rows;
  }, []);

  // Calculate visible area (parent box has height={modalHeight} with border and title)
  // Border takes 2 lines, title takes 1 line, footer takes 1 line
  const footerHeight = 1;
  const contentHeight = modalHeight - 2 - 1 - footerHeight; // borders - title - footer

  // Reserve 1 row for scroll indicator if content overflows
  const needsIndicator = allRows.length > contentHeight;
  const availableRows = needsIndicator ? contentHeight - 1 : contentHeight;
  
  const maxScroll = Math.max(0, allRows.length - availableRows);
  const visibleRows = allRows.slice(scrollOffset, scrollOffset + availableRows);

  const scrollPercent = maxScroll > 0 ? Math.round((scrollOffset / maxScroll) * 100) : 0;

  return (
    <box
      position="absolute"
      top={top}
      left={left}
      width={modalWidth}
      height={modalHeight}
      backgroundColor={THEME.background.dark}
      border
      borderStyle="rounded"
      borderColor={THEME.border.focused}
      flexDirection="column"
      title="Keybindings"
    >
      {/* Content area - explicit height, no margins on children */}
      <box flexDirection="column" height={availableRows} paddingLeft={2} paddingRight={2}>
        {visibleRows.map((row, i) =>
          row.type === "header" ? (
            <box key={i} height={1}>
              <text fg={THEME.secondary}>
                <strong>{row.category}</strong>
              </text>
            </box>
          ) : (
            <box key={i} flexDirection="row" height={1}>
              <box width={16}>
                <text fg={THEME.primary}>{row.key}</text>
              </box>
              <text fg={THEME.text.normal}>{row.desc}</text>
            </box>
          )
        )}
      </box>

      {/* Scroll indicator - shown when content overflows */}
      {needsIndicator && (
        <box height={1} paddingLeft={2} paddingRight={2}>
          <text fg={THEME.text.dimmed}>
            {scrollPercent}% - Press j/k to scroll
          </text>
        </box>
      )}

      {/* Footer */}
      <box height={1} paddingLeft={2} paddingRight={2}>
        <text fg={THEME.text.dimmed}>Press ? or Esc to close</text>
      </box>
    </box>
  );
}
