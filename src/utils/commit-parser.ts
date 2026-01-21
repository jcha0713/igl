// Handles both regular and --graph output
// Examples:
//   "a1b2c3d Fix auth bug"
//   "* a1b2c3d Fix auth bug"
//   "| * a1b2c3d Fix auth bug"
const COMMIT_LINE_REGEX = /^[*| \\/]*([a-f0-9]{7,40})\b/

export function extractCommitHash(line: string): string | null {
  const match = line.match(COMMIT_LINE_REGEX)
  return match ? match[1] ?? null : null
}

export function isCommitLine(line: string): boolean {
  return COMMIT_LINE_REGEX.test(line)
}
