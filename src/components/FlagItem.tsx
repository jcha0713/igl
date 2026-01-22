import type {
  FlagDefinition,
  FlagsState,
  DiffFilterType,
  OrderType,
  DateFormatType,
} from "../types.ts";
import { THEME } from "../constants.ts";

interface FlagItemProps {
  flag: FlagDefinition;
  flags: FlagsState;
  isSelected: boolean;
  isFocused: boolean;
}

export function FlagItem({
  flag,
  flags,
  isSelected,
  isFocused,
}: FlagItemProps) {
  const selectionIndicator = isSelected && isFocused ? ">" : " ";
  const isActive = isSelected && isFocused;
  const selectedBg = isActive
    ? THEME.background.selection
    : THEME.background.transparent;

  // Get flag value based on type
  const getValue = (): string => {
    switch (flag.type) {
      case "toggle": {
        const value = flags[flag.id as keyof FlagsState] as boolean;
        return value ? "[x]" : "[ ]";
      }
      case "text": {
        const value = flags[flag.id as keyof FlagsState] as string | null;
        if (value) {
          return `[>] ${flag.label} ${value}`;
        }
        return `[ ] ${flag.label}`;
      }
      case "number": {
        const value = flags[flag.id as keyof FlagsState] as number | null;
        if (value !== null) {
          return `[>] ${flag.label} ${value}`;
        }
        return `[ ] ${flag.label}`;
      }
      case "single-select": {
        if (flag.id === "order") {
          const value = flags.order;
          return `(*) ${getOrderDisplay(value)}`;
        }
        if (flag.id === "dateFormat") {
          const value = flags.dateFormat;
          return `(*) ${getDateFormatDisplay(value)}`;
        }
        return `(*) ${flag.label}`;
      }
      case "multi-select": {
        // DIFF FILTER items
        const filterChar = flag.id.replace("diffFilter", "") as DiffFilterType;
        const isChecked = flags.diffFilter.has(filterChar);
        return isChecked ? `[x] ${flag.label}` : `[ ] ${flag.label}`;
      }
      default:
        return flag.label;
    }
  };

  const displayText =
    flag.type === "toggle" ? `${getValue()} ${flag.label}` : getValue();

  return (
    <box height={1} backgroundColor={selectedBg}>
      <text fg={isActive ? THEME.text.bright : THEME.text.normal}>
        <span fg={isActive ? THEME.primary : THEME.text.dimmed}>
          {selectionIndicator}{" "}
        </span>
        {displayText}
      </text>
    </box>
  );
}

function getOrderDisplay(order: OrderType): string {
  switch (order) {
    case "default":
      return "Order: default";
    case "date":
      return "Order: --date-order";
    case "author-date":
      return "Order: --author-date-order";
    case "topo":
      return "Order: --topo-order";
  }
}

function getDateFormatDisplay(format: DateFormatType): string {
  switch (format) {
    case "default":
      return "Date: default";
    case "relative":
      return "Date: --date=relative";
    case "short":
      return "Date: --date=short";
    case "human":
      return "Date: --date=human";
  }
}
