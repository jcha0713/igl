import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { isGitRepository } from "./utils/git.ts";
import { App } from "./App.tsx";

async function main() {
  // Check if we're in a git repository
  const isGitRepo = await isGitRepository();
  if (!isGitRepo) {
    console.error(
      "Error: Not a git repository (or any of the parent directories)",
    );
    console.error("Please run igl from within a git repository.");
    process.exit(1);
  }

  // Create renderer
  const renderer = await createCliRenderer({
    exitOnCtrlC: true,
  });

  // Render the app
  createRoot(renderer).render(<App />);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
