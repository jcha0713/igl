import simpleGit, { type SimpleGit } from "simple-git";

let gitInstance: SimpleGit | null = null;

export function getGit(): SimpleGit {
  if (!gitInstance) {
    gitInstance = simpleGit();
  }
  return gitInstance;
}

export async function isGitRepository(): Promise<boolean> {
  try {
    const git = getGit();
    await git.revparse(["--git-dir"]);
    return true;
  } catch {
    return false;
  }
}

export async function runGitLog(args: string[]): Promise<string> {
  const git = getGit();
  return await git.raw(["log", ...args]);
}

export async function runGitShow(hash: string): Promise<string> {
  const git = getGit();
  return await git.raw(["show", hash, "--no-patch"]);
}
