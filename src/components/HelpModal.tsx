import { useTerminalDimensions } from "@opentui/react";
import { useMemo } from "react";
import { THEME } from "../constants.ts";
import { KEYMAPS } from "../keymaps.ts";

interface HelpModalProps {
  onClose: () => void;
}

export function HelpModal({ onClose }: HelpModalProps) {
  const { width, height } = useTerminalDimensions();

  // Responsive sizing - modal takes up most of the screen but leaves margin
  const modalWidth = useMemo(() => {
    const maxWidth = 80;
    const minWidth = 50;
    const margin = 4;
    const available = width - margin * 2;
    return Math.max(minWidth, Math.min(maxWidth, available));
  }, [width]);

  const modalHeight = useMemo(() => {
    const margin = 2;
    const available = height - margin * 2;
    return Math.max(15, available);
  }, [height]);

  // Center the modal
  const left = Math.floor((width - modalWidth) / 2);
  const top = Math.floor((height - modalHeight) / 2);

  // Calculate column widths for key/desc layout
  const keyWidth = 18;
  const descWidth = modalWidth - keyWidth - 6; // 6 for padding/borders

  return (
    <>
      {/* Modal container */}
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
        {/* Scrollable content area */}
        <scrollbox flexGrow={1} paddingLeft={2} paddingRight={2}>
          <box flexDirection="column" gap={1}>
            {KEYMAPS.map((section) => (
              <box key={section.category} flexDirection="column">
                {/* Section header */}
                <box height={1} marginTop={1} marginBottom={1}>
                  <text fg={THEME.secondary}>
                    <strong>{section.category}</strong>
                  </text>
                </box>

                {/* Key bindings */}
                {section.items.map((item) => (
                  <box
                    key={`${section.category}-${item.key}`}
                    flexDirection="row"
                    height={1}
                  >
                    <box width={keyWidth}>
                      <text fg={THEME.primary}>{item.key}</text>
                    </box>
                    <box width={descWidth}>
                      <text fg={THEME.text.normal}>{item.desc}</text>
                    </box>
                  </box>
                ))}
              </box>
            ))}

            {/* Footer hint */}
            <box height={1} marginTop={2} marginBottom={1}>
              <text fg={THEME.text.dimmed}>Press ? or Esc to close</text>
            </box>
          </box>
        </scrollbox>
      </box>
    </>
  );
}
