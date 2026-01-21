import { LAYOUT, THEME } from "../constants.ts"

interface HelpModalProps {
  onClose: () => void
}

const SHORTCUTS = [
  { category: "Navigation", items: [
    { key: "j/k", desc: "Move up/down" },
    { key: "h/l", desc: "Switch focus (sidebar/results)" },
    { key: "[/]", desc: "Previous/next tab" },
    { key: "Tab", desc: "Toggle sidebar" },
  ]},
  { category: "Flags", items: [
    { key: "Space/Enter", desc: "Toggle flag / cycle option" },
    { key: "Enter", desc: "Edit text flag (opens input)" },
    { key: "d", desc: "Clear text flag value" },
  ]},
  { category: "Results", items: [
    { key: "Enter", desc: "Open commit detail view" },
    { key: "y", desc: "Yank command to clipboard" },
  ]},
  { category: "Detail View", items: [
    { key: "Esc", desc: "Return to main view" },
    { key: "j/k", desc: "Scroll up/down" },
    { key: "y", desc: "Yank commit hash" },
  ]},
  { category: "General", items: [
    { key: "?", desc: "Toggle this help" },
    { key: "q", desc: "Quit" },
  ]},
]

export function HelpModal({ onClose }: HelpModalProps) {
  const { margin, keyColumnWidth } = LAYOUT.helpModal

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
        {SHORTCUTS.map((section) => (
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
  )
}
