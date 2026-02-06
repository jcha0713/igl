import type {
  AppState,
  AppAction,
  FlagsState,
  DiffFilterType,
  OrderType,
  DateFormatType,
} from "./types.ts";

export const initialFlagsState: FlagsState = {
  // FORMAT toggles - defaults per PRD
  oneline: true,
  graph: false,
  decorate: true,
  stat: false,
  shortstat: false,
  nameOnly: false,
  nameStatus: false,
  abbrevCommit: true,
  // FILTER toggles
  noMerges: false,
  merges: false,
  firstParent: false,
  reverse: false,
  all: false,
  follow: false,
  // SEARCH text inputs
  author: null,
  committer: null,
  grep: null,
  pickaxeS: null,
  pickaxeG: null,
  path: null,
  // DATE text inputs
  since: null,
  until: null,
  maxCount: null,
  // ORDER single-select
  order: "default",
  // DATE FORMAT single-select
  dateFormat: "default",
  // DIFF FILTER multi-select
  diffFilter: new Set(),
};

export const initialState: AppState = {
  flags: initialFlagsState,
  ui: {
    currentView: "main",
    sidebarVisible: true,
    focusedPane: "sidebar",
    selectedFlagIndex: 0,
    selectedResultLine: 0,
    resultsScrollOffset: 0,
    inputMode: false,
    inputTarget: null,
    inputValue: "",
    showHelp: false,
    helpScrollOffset: 0,
  },
  results: {
    output: "",
    lines: [],
    loading: true,
    error: null,
  },
  detail: {
    commitHash: null,
    output: "",
    scrollOffset: 0,
  },
};

const ORDER_CYCLE: OrderType[] = ["default", "date", "author-date", "topo"];
const DATE_FORMAT_CYCLE: DateFormatType[] = [
  "default",
  "relative",
  "short",
  "human",
];

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "TOGGLE_FLAG": {
      const flag = action.flag;
      const currentValue = state.flags[flag];
      if (typeof currentValue !== "boolean") return state;
      return {
        ...state,
        flags: {
          ...state.flags,
          [flag]: !currentValue,
        },
      };
    }

    case "SET_TEXT_FLAG": {
      return {
        ...state,
        flags: {
          ...state.flags,
          [action.flag]: action.value,
        },
      };
    }

    case "SET_NUMBER_FLAG": {
      return {
        ...state,
        flags: {
          ...state.flags,
          [action.flag]: action.value,
        },
      };
    }

    case "CYCLE_ORDER": {
      const currentIndex = ORDER_CYCLE.indexOf(state.flags.order);
      const nextIndex = (currentIndex + 1) % ORDER_CYCLE.length;
      return {
        ...state,
        flags: {
          ...state.flags,
          order: ORDER_CYCLE[nextIndex]!,
        },
      };
    }

    case "CYCLE_DATE_FORMAT": {
      const currentIndex = DATE_FORMAT_CYCLE.indexOf(state.flags.dateFormat);
      const nextIndex = (currentIndex + 1) % DATE_FORMAT_CYCLE.length;
      return {
        ...state,
        flags: {
          ...state.flags,
          dateFormat: DATE_FORMAT_CYCLE[nextIndex]!,
        },
      };
    }

    case "TOGGLE_DIFF_FILTER": {
      const newSet = new Set(state.flags.diffFilter);
      if (newSet.has(action.filter)) {
        newSet.delete(action.filter);
      } else {
        newSet.add(action.filter);
      }
      return {
        ...state,
        flags: {
          ...state.flags,
          diffFilter: newSet,
        },
      };
    }

    case "SET_SELECTED_FLAG_INDEX": {
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedFlagIndex: action.index,
        },
      };
    }

    case "SET_SELECTED_RESULT_LINE": {
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedResultLine: action.line,
        },
      };
    }

    case "SET_RESULTS_SCROLL_OFFSET": {
      return {
        ...state,
        ui: {
          ...state.ui,
          resultsScrollOffset: action.offset,
        },
      };
    }

    case "SET_FOCUSED_PANE": {
      return {
        ...state,
        ui: {
          ...state.ui,
          focusedPane: action.pane,
        },
      };
    }

    case "TOGGLE_SIDEBAR": {
      const newSidebarVisible = !state.ui.sidebarVisible;
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarVisible: newSidebarVisible,
          // If hiding sidebar, focus moves to results
          focusedPane: newSidebarVisible ? state.ui.focusedPane : "results",
        },
      };
    }

    case "ENTER_INPUT_MODE": {
      return {
        ...state,
        ui: {
          ...state.ui,
          inputMode: true,
          inputTarget: action.target,
          inputValue: "",
        },
      };
    }

    case "EXIT_INPUT_MODE": {
      return {
        ...state,
        ui: {
          ...state.ui,
          inputMode: false,
          inputTarget: null,
          inputValue: "",
        },
      };
    }

    case "SET_INPUT_VALUE": {
      return {
        ...state,
        ui: {
          ...state.ui,
          inputValue: action.value,
        },
      };
    }

    case "TOGGLE_HELP": {
      const newShowHelp = !state.ui.showHelp;
      return {
        ...state,
        ui: {
          ...state.ui,
          showHelp: newShowHelp,
          helpScrollOffset: newShowHelp ? 0 : state.ui.helpScrollOffset,
        },
      };
    }

    case "SET_HELP_SCROLL_OFFSET": {
      return {
        ...state,
        ui: {
          ...state.ui,
          helpScrollOffset: action.offset,
        },
      };
    }

    case "SET_RESULTS": {
      return {
        ...state,
        results: {
          ...state.results,
          output: action.output,
          lines: action.lines,
          loading: false,
          error: null,
        },
        ui: {
          ...state.ui,
          selectedResultLine: 0,
          resultsScrollOffset: 0,
        },
      };
    }

    case "SET_RESULTS_LOADING": {
      return {
        ...state,
        results: {
          ...state.results,
          loading: action.loading,
        },
      };
    }

    case "SET_RESULTS_ERROR": {
      return {
        ...state,
        results: {
          ...state.results,
          error: action.error,
          loading: false,
        },
      };
    }

    case "ENTER_DETAIL_VIEW": {
      return {
        ...state,
        ui: {
          ...state.ui,
          currentView: "detail",
          sidebarVisible: false,
        },
        detail: {
          commitHash: action.commitHash,
          output: action.output,
          scrollOffset: 0,
        },
      };
    }

    case "EXIT_DETAIL_VIEW": {
      return {
        ...state,
        ui: {
          ...state.ui,
          currentView: "main",
          sidebarVisible: true,
        },
      };
    }

    case "SET_DETAIL_SCROLL_OFFSET": {
      return {
        ...state,
        detail: {
          ...state.detail,
          scrollOffset: action.offset,
        },
      };
    }

    default:
      return state;
  }
}
