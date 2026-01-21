import { useReducer, useEffect, useCallback } from "react"
import { useKeyboard, useRenderer, useTerminalDimensions } from "@opentui/react"
import type { DiffFilterType, FlagsState } from "./types.ts"
import { appReducer, initialState } from "./state.ts"
import { buildCommand, buildGitLogArgs } from "./utils/command-builder.ts"
import { runGitLog, runGitShow } from "./utils/git.ts"
import { extractCommitHash, isCommitLine } from "./utils/commit-parser.ts"
import { copyToClipboard } from "./utils/clipboard.ts"
import { getFlagsForCategory, TAB_ORDER } from "./utils/flags.ts"
import { LAYOUT, getResultsVisibleHeight, getDetailVisibleHeight } from "./constants.ts"

import { CommandBar } from "./components/CommandBar.tsx"
import { Sidebar } from "./components/Sidebar.tsx"
import { ResultsPane } from "./components/ResultsPane.tsx"
import { DetailView } from "./components/DetailView.tsx"
import { HelpModal } from "./components/HelpModal.tsx"

export function App() {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const renderer = useRenderer()
  const { width, height } = useTerminalDimensions()

  const command = buildCommand(state.flags)

  // Fetch git log results when flags change
  const fetchResults = useCallback(async () => {
    dispatch({ type: "SET_RESULTS_LOADING", loading: true })
    try {
      const args = buildGitLogArgs(state.flags)
      const output = await runGitLog(args)
      const lines = output.split("\n").filter((line) => line.length > 0)
      dispatch({ type: "SET_RESULTS", output, lines })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      dispatch({ type: "SET_RESULTS_ERROR", error: message })
    }
  }, [state.flags])

  // Initial fetch and refetch when flags change
  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  // Get current category flags for navigation
  const categoryFlags = getFlagsForCategory(state.ui.activeTab)
  const maxFlagIndex = categoryFlags.length - 1
  const maxResultLine = state.results.lines.length - 1

  // Calculate visible area for scrolling
  const resultsHeight = getResultsVisibleHeight(height)
  const detailHeight = getDetailVisibleHeight(height)

  // Handle keyboard input
  useKeyboard((key) => {
    // Handle help modal first
    if (state.ui.showHelp) {
      if (key.name === "escape" || key.name === "?") {
        dispatch({ type: "TOGGLE_HELP" })
      }
      return
    }

    // Handle input mode
    if (state.ui.inputMode) {
      if (key.name === "escape") {
        dispatch({ type: "EXIT_INPUT_MODE" })
        return
      }
      if (key.name === "enter") {
        // Save the value
        const target = state.ui.inputTarget
        const value = state.ui.inputValue.trim()
        if (target) {
          const flag = categoryFlags.find((f) => f.id === target)
          if (flag?.type === "number") {
            const numValue = parseInt(value, 10)
            dispatch({
              type: "SET_NUMBER_FLAG",
              flag: target as keyof FlagsState,
              value: isNaN(numValue) ? null : numValue,
            })
          } else {
            dispatch({
              type: "SET_TEXT_FLAG",
              flag: target as keyof FlagsState,
              value: value || null,
            })
          }
        }
        dispatch({ type: "EXIT_INPUT_MODE" })
        return
      }
      if (key.name === "backspace") {
        dispatch({
          type: "SET_INPUT_VALUE",
          value: state.ui.inputValue.slice(0, -1),
        })
        return
      }
      // Add character to input (printable characters)
      if (key.sequence && key.sequence.length === 1 && !key.ctrl && !key.meta) {
        dispatch({
          type: "SET_INPUT_VALUE",
          value: state.ui.inputValue + key.sequence,
        })
      }
      return
    }

    // Handle detail view
    if (state.ui.currentView === "detail") {
      switch (key.name) {
        case "escape":
        case "q":
          dispatch({ type: "EXIT_DETAIL_VIEW" })
          return
        case "j":
        case "down": {
          const lines = state.detail.output.split("\n")
          const maxOffset = Math.max(0, lines.length - detailHeight)
          if (state.detail.scrollOffset < maxOffset) {
            dispatch({
              type: "SET_DETAIL_SCROLL_OFFSET",
              offset: state.detail.scrollOffset + 1,
            })
          }
          return
        }
        case "k":
        case "up":
          if (state.detail.scrollOffset > 0) {
            dispatch({
              type: "SET_DETAIL_SCROLL_OFFSET",
              offset: state.detail.scrollOffset - 1,
            })
          }
          return
        case "y":
          if (state.detail.commitHash) {
            copyToClipboard(state.detail.commitHash)
          }
          return
      }
      return
    }

    // Main view keyboard handling
    switch (key.name) {
      case "q":
        renderer.destroy()
        return

      case "?":
        dispatch({ type: "TOGGLE_HELP" })
        return

      case "y":
        copyToClipboard(command)
        return

      case "tab":
        dispatch({ type: "TOGGLE_SIDEBAR" })
        return

      case "h":
        if (state.ui.sidebarVisible) {
          dispatch({ type: "SET_FOCUSED_PANE", pane: "sidebar" })
        }
        return

      case "l":
        dispatch({ type: "SET_FOCUSED_PANE", pane: "results" })
        return

      case "[": {
        const currentTabIndex = TAB_ORDER.indexOf(state.ui.activeTab)
        const prevIndex = currentTabIndex > 0 ? currentTabIndex - 1 : TAB_ORDER.length - 1
        dispatch({ type: "SET_ACTIVE_TAB", tab: TAB_ORDER[prevIndex]! })
        return
      }

      case "]": {
        const currentTabIndex = TAB_ORDER.indexOf(state.ui.activeTab)
        const nextIndex = (currentTabIndex + 1) % TAB_ORDER.length
        dispatch({ type: "SET_ACTIVE_TAB", tab: TAB_ORDER[nextIndex]! })
        return
      }

      case "j":
      case "down":
        if (state.ui.focusedPane === "sidebar") {
          if (state.ui.selectedFlagIndex < maxFlagIndex) {
            dispatch({
              type: "SET_SELECTED_FLAG_INDEX",
              index: state.ui.selectedFlagIndex + 1,
            })
          }
        } else {
          // Results pane navigation
          if (state.ui.selectedResultLine < maxResultLine) {
            const newLine = state.ui.selectedResultLine + 1
            dispatch({ type: "SET_SELECTED_RESULT_LINE", line: newLine })
            // Auto-scroll if needed
            const visibleEnd = state.ui.resultsScrollOffset + resultsHeight - LAYOUT.border.total
            if (newLine >= visibleEnd) {
              dispatch({
                type: "SET_RESULTS_SCROLL_OFFSET",
                offset: state.ui.resultsScrollOffset + 1,
              })
            }
          }
        }
        return

      case "k":
      case "up":
        if (state.ui.focusedPane === "sidebar") {
          if (state.ui.selectedFlagIndex > 0) {
            dispatch({
              type: "SET_SELECTED_FLAG_INDEX",
              index: state.ui.selectedFlagIndex - 1,
            })
          }
        } else {
          // Results pane navigation
          if (state.ui.selectedResultLine > 0) {
            const newLine = state.ui.selectedResultLine - 1
            dispatch({ type: "SET_SELECTED_RESULT_LINE", line: newLine })
            // Auto-scroll if needed
            if (newLine < state.ui.resultsScrollOffset) {
              dispatch({
                type: "SET_RESULTS_SCROLL_OFFSET",
                offset: newLine,
              })
            }
          }
        }
        return

      case "space":
      case "enter":
        if (state.ui.focusedPane === "sidebar") {
          const currentFlag = categoryFlags[state.ui.selectedFlagIndex]
          if (!currentFlag) return

          switch (currentFlag.type) {
            case "toggle":
              dispatch({
                type: "TOGGLE_FLAG",
                flag: currentFlag.id as keyof FlagsState,
              })
              break
            case "text":
            case "number":
              // Enter input mode
              dispatch({ type: "ENTER_INPUT_MODE", target: currentFlag.id })
              break
            case "single-select":
              if (currentFlag.id === "order") {
                dispatch({ type: "CYCLE_ORDER" })
              } else if (currentFlag.id === "dateFormat") {
                dispatch({ type: "CYCLE_DATE_FORMAT" })
              }
              break
            case "multi-select": {
              const filterChar = currentFlag.id.replace("diffFilter", "") as DiffFilterType
              dispatch({ type: "TOGGLE_DIFF_FILTER", filter: filterChar })
              break
            }
          }
        } else if (key.name === "enter") {
          // Results pane - open detail view on commit line
          const currentLine = state.results.lines[state.ui.selectedResultLine]
          if (currentLine && isCommitLine(currentLine)) {
            const hash = extractCommitHash(currentLine)
            if (hash) {
              // Fetch commit details
              runGitShow(hash)
                .then((output) => {
                  dispatch({ type: "ENTER_DETAIL_VIEW", commitHash: hash, output })
                })
                .catch((error) => {
                  const message = error instanceof Error ? error.message : String(error)
                  dispatch({ type: "SET_RESULTS_ERROR", error: message })
                })
            }
          }
        }
        return

      case "d":
      case "delete":
        // Clear text flag value
        if (state.ui.focusedPane === "sidebar") {
          const currentFlag = categoryFlags[state.ui.selectedFlagIndex]
          if (currentFlag && (currentFlag.type === "text" || currentFlag.type === "number")) {
            if (currentFlag.type === "number") {
              dispatch({
                type: "SET_NUMBER_FLAG",
                flag: currentFlag.id as keyof FlagsState,
                value: null,
              })
            } else {
              dispatch({
                type: "SET_TEXT_FLAG",
                flag: currentFlag.id as keyof FlagsState,
                value: null,
              })
            }
          }
        }
        return
    }
  })

  return (
    <box flexDirection="column" width={width} height={height}>
      {state.ui.currentView === "main" ? (
        <>
          {/* Main content area */}
          <box flexDirection="row" flexGrow={1}>
            {/* Sidebar */}
            {state.ui.sidebarVisible && (
              <Sidebar
                activeTab={state.ui.activeTab}
                flags={state.flags}
                selectedIndex={state.ui.selectedFlagIndex}
                isFocused={state.ui.focusedPane === "sidebar"}
                inputMode={state.ui.inputMode}
                inputValue={state.ui.inputValue}
                inputTarget={state.ui.inputTarget}
              />
            )}

            {/* Results pane */}
            <ResultsPane
              lines={state.results.lines}
              selectedLine={state.ui.selectedResultLine}
              scrollOffset={state.ui.resultsScrollOffset}
              loading={state.results.loading}
              error={state.results.error}
              isFocused={state.ui.focusedPane === "results"}
              height={resultsHeight}
            />
          </box>

          {/* Command bar */}
          <CommandBar command={command} />
        </>
      ) : (
        /* Detail view */
        <DetailView
          commitHash={state.detail.commitHash ?? ""}
          output={state.detail.output}
          scrollOffset={state.detail.scrollOffset}
          height={height}
        />
      )}

      {/* Help modal overlay */}
      {state.ui.showHelp && (
        <HelpModal onClose={() => dispatch({ type: "TOGGLE_HELP" })} />
      )}
    </box>
  )
}
