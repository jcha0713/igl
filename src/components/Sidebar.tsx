import { useRef } from "react";
import type { FlagsState, TabCategory } from "../types.ts";
import { FlagItem } from "./FlagItem.tsx";
import {
  buildSidebarItems,
  getCurrentSection,
  TAB_NAMES,
  type SidebarItem,
} from "../utils/flags.ts";
import { LAYOUT, THEME } from "../constants.ts";

interface SidebarProps {
  flags: FlagsState;
  selectedIndex: number;
  isFocused: boolean;
  inputMode: boolean;
  inputValue: string;
  inputTarget: string | null;
  visibleHeight: number;
}

// Find the position of the selected item in the flat sidebar list
function findItemPosition(
  items: SidebarItem[],
  selectableIndex: number,
): number {
  for (let i = 0; i < items.length; i++) {
    const item = items[i]!;
    if (item.type === "flag" && item.selectableIndex === selectableIndex) {
      return i;
    }
  }
  return 0;
}

export function Sidebar({
  flags,
  selectedIndex,
  isFocused,
  inputMode,
  inputValue,
  inputTarget,
  visibleHeight,
}: SidebarProps) {
  const sidebarItems = buildSidebarItems();
  const currentSection = getCurrentSection(selectedIndex);
  const borderColor = isFocused ? THEME.border.focused : THEME.border.unfocused;

  // Track scroll position across renders to enable smooth scrolling behavior
  const lastScrollRef = useRef(0);

  // Content structure - single source of truth for input bar
  const INPUT_BAR_CONTENT_LINES = 2; // "Enter value:" + "> input_"
  const BORDER_HEIGHT = 2; // OpenTUI borders = 1 line each side

  // Height derived from content, not hardcoded
  const inputBarHeight =
    inputMode && inputTarget ? INPUT_BAR_CONTENT_LINES + BORDER_HEIGHT : 0;

  const availableHeight = visibleHeight - LAYOUT.border.total - inputBarHeight;

  // Scroll margin: keep N items visible above/below selection when possible
  // This gives users a visual cue that more content exists in that direction
  const SCROLL_MARGIN = 3;

  // Derive scroll offset to keep selection visible with margins
  const selectedPosition = findItemPosition(sidebarItems, selectedIndex);
  const totalItems = sidebarItems.length;
  const maxScroll = Math.max(0, totalItems - availableHeight);

  let scrollOffset = 0;

  if (totalItems > availableHeight) {
    // Items above/below selection in the full list
    const itemsAbove = selectedPosition;
    const itemsBelow = totalItems - 1 - selectedPosition;

    // Desired visible margins (can't exceed actual items available)
    // Near start/end of list, margin naturally shrinks
    const desiredAbove = Math.min(SCROLL_MARGIN, itemsAbove);
    const desiredBelow = Math.min(SCROLL_MARGIN, itemsBelow);

    // Calculate scroll bounds that satisfy margin constraints
    // viewport position = selectedPosition - scrollOffset
    // We want: viewportPos >= desiredAbove (enough margin above)
    // We want: viewportPos <= availableHeight - 1 - desiredBelow (enough margin below)
    const maxScrollForTopMargin = selectedPosition - desiredAbove;
    const minScrollForBottomMargin =
      selectedPosition - availableHeight + 1 + desiredBelow;

    // Start with previous scroll position - only adjust if selection leaves safe zone
    // This allows selection to move within the viewport without scrolling
    scrollOffset = lastScrollRef.current;

    if (scrollOffset < minScrollForBottomMargin) {
      // Selection too close to bottom - scroll down
      scrollOffset = minScrollForBottomMargin;
    } else if (scrollOffset > maxScrollForTopMargin) {
      // Selection too close to top - scroll up
      scrollOffset = maxScrollForTopMargin;
    }
    // else: selection is in safe zone, keep current scroll

    scrollOffset = Math.max(0, Math.min(scrollOffset, maxScroll));
  }

  // Remember scroll position for next render
  lastScrollRef.current = scrollOffset;

  const visibleItems = sidebarItems.slice(
    scrollOffset,
    scrollOffset + availableHeight,
  );

  return (
    <box
      flexDirection="column"
      width={LAYOUT.sidebar.width}
      border
      borderColor={borderColor}
      title={`Flags: ${TAB_NAMES[currentSection]}`}
      titleAlignment="left"
    >
      {/* Flat list with section headers */}
      <box flexDirection="column" flexGrow={1}>
        {visibleItems.map((item) => {
          if (item.type === "header") {
            return (
              <SectionHeader
                key={`header-${item.category}`}
                category={item.category}
              />
            );
          }

          return (
            <FlagItem
              key={item.flag.id}
              flag={item.flag}
              flags={flags}
              isSelected={item.selectableIndex === selectedIndex}
              isFocused={isFocused}
            />
          );
        })}
      </box>

      {/* Input bar (appears when editing text flag) - auto-sizes to content */}
      {inputMode && inputTarget && (
        <box border borderColor={THEME.border.focused} paddingLeft={1}>
          <box flexDirection="column">
            <text fg={THEME.text.dimmed}>Enter value:</text>
            <text fg={THEME.text.bright}>
              <span fg={THEME.primary}>&gt; </span>
              {inputValue}
              <span fg={THEME.primary}>_</span>
            </text>
          </box>
        </box>
      )}
    </box>
  );
}

interface SectionHeaderProps {
  category: TabCategory;
}

function SectionHeader({ category }: SectionHeaderProps) {
  const name = TAB_NAMES[category];
  const padding = Math.floor((LAYOUT.sidebar.innerWidth - name.length - 6) / 2);
  const leftPad = "─".repeat(Math.max(1, padding));
  const rightPad = "─".repeat(Math.max(1, padding));

  return (
    <box height={1}>
      <text fg={THEME.text.dimmed}>
        {leftPad} {name} {rightPad}
      </text>
    </box>
  );
}
