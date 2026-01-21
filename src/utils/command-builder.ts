import type { FlagsState } from "../types.ts"

export function buildCommand(flags: FlagsState): string {
  const args: string[] = ["git", "log"]

  // FORMAT toggles
  if (flags.oneline) args.push("--oneline")
  if (flags.graph) args.push("--graph")
  if (flags.decorate) args.push("--decorate")
  if (flags.stat) args.push("--stat")
  if (flags.shortstat) args.push("--shortstat")
  if (flags.nameOnly) args.push("--name-only")
  if (flags.nameStatus) args.push("--name-status")
  if (flags.abbrevCommit) args.push("--abbrev-commit")

  // FILTER toggles
  if (flags.noMerges) args.push("--no-merges")
  if (flags.merges) args.push("--merges")
  if (flags.firstParent) args.push("--first-parent")
  if (flags.reverse) args.push("--reverse")
  if (flags.all) args.push("--all")
  if (flags.follow) args.push("--follow")

  // SEARCH text inputs
  if (flags.author) args.push(`--author="${flags.author}"`)
  if (flags.committer) args.push(`--committer="${flags.committer}"`)
  if (flags.grep) args.push(`--grep="${flags.grep}"`)
  if (flags.pickaxeS) args.push(`-S "${flags.pickaxeS}"`)
  if (flags.pickaxeG) args.push(`-G "${flags.pickaxeG}"`)

  // DATE text inputs
  if (flags.since) args.push(`--since="${flags.since}"`)
  if (flags.until) args.push(`--until="${flags.until}"`)
  if (flags.maxCount) args.push(`-n ${flags.maxCount}`)

  // DIFF FILTER multi-select
  if (flags.diffFilter.size > 0) {
    args.push(`--diff-filter=${[...flags.diffFilter].join("")}`)
  }

  // ORDER single-select
  if (flags.order !== "default") {
    args.push(`--${flags.order}-order`)
  }

  // DATE FORMAT single-select
  if (flags.dateFormat !== "default") {
    args.push(`--date=${flags.dateFormat}`)
  }

  // Path must come last
  if (flags.path) args.push("--", flags.path)

  return args.join(" ")
}

// Build args array for simple-git (without "git" and "log" prefix)
export function buildGitLogArgs(flags: FlagsState): string[] {
  const args: string[] = []

  // FORMAT toggles
  if (flags.oneline) args.push("--oneline")
  if (flags.graph) args.push("--graph")
  if (flags.decorate) args.push("--decorate")
  if (flags.stat) args.push("--stat")
  if (flags.shortstat) args.push("--shortstat")
  if (flags.nameOnly) args.push("--name-only")
  if (flags.nameStatus) args.push("--name-status")
  if (flags.abbrevCommit) args.push("--abbrev-commit")

  // FILTER toggles
  if (flags.noMerges) args.push("--no-merges")
  if (flags.merges) args.push("--merges")
  if (flags.firstParent) args.push("--first-parent")
  if (flags.reverse) args.push("--reverse")
  if (flags.all) args.push("--all")
  if (flags.follow) args.push("--follow")

  // SEARCH text inputs
  if (flags.author) args.push(`--author=${flags.author}`)
  if (flags.committer) args.push(`--committer=${flags.committer}`)
  if (flags.grep) args.push(`--grep=${flags.grep}`)
  if (flags.pickaxeS) args.push("-S", flags.pickaxeS)
  if (flags.pickaxeG) args.push("-G", flags.pickaxeG)

  // DATE text inputs
  if (flags.since) args.push(`--since=${flags.since}`)
  if (flags.until) args.push(`--until=${flags.until}`)
  if (flags.maxCount) args.push("-n", String(flags.maxCount))

  // DIFF FILTER multi-select
  if (flags.diffFilter.size > 0) {
    args.push(`--diff-filter=${[...flags.diffFilter].join("")}`)
  }

  // ORDER single-select
  if (flags.order !== "default") {
    args.push(`--${flags.order}-order`)
  }

  // DATE FORMAT single-select
  if (flags.dateFormat !== "default") {
    args.push(`--date=${flags.dateFormat}`)
  }

  // Path must come last
  if (flags.path) {
    args.push("--", flags.path)
  }

  return args
}
