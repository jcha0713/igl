import { appendFileSync, writeFileSync } from "fs";
import { join } from "path";

const DEBUG_FILE = join(process.cwd(), "debug.log");

export function logDebug(label: string, data: unknown): void {
  try {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${label}:\n${JSON.stringify(data, null, 2)}\n\n`;
    appendFileSync(DEBUG_FILE, logLine, "utf-8");
  } catch {
    // Silently fail if can't write
  }
}

export function logClear(): void {
  try {
    writeFileSync(DEBUG_FILE, "", "utf-8");
  } catch {
    // Silently fail
  }
}

export function getLogPath(): string {
  return DEBUG_FILE;
}
