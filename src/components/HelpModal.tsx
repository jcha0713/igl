import { LAYOUT, THEME } from "../constants.ts";
import { KEYMAPS } from "../keymaps.ts";

interface HelpModalProps {
  onClose: () => void;
}

export function HelpModal({ onClose }: HelpModalProps) {
  const { margin, keyColumnWidth } = LAYOUT.helpModal;

  return (
    <box
      position="absolute"
      top={margin.top}
      left={margin.left}
      right={margin.right}
      bottom={margin.bottom}
      backgroundColor={THEME.background.dark}
      border
      borderColor={THEME.border.focused}
      borderStyle="rounded"
      title="Help - Keyboard Shortcuts"
      titleAlignment="center"
      flexDirection="column"
      padding={1}
    >
      <box flexDirection="column" gap={1}>
        {KEYMAPS.map((section) => (
          <box key={section.category} flexDirection="column">
            <text fg={THEME.primary}>
              <strong>{section.category}</strong>
            </text>
            {section.items.map((item) => (
              <box key={item.key} flexDirection="row">
                <box width={keyColumnWidth}>
                  <text fg={THEME.secondary}>{item.key}</text>
                </box>
                <text fg={THEME.text.normal}>{item.desc}</text>
              </box>
            ))}
          </box>
        ))}
      </box>

      <box marginTop={1}>
        <text fg={THEME.text.dimmed}>Press ? or Esc to close</text>
      </box>
    </box>
  );
}
