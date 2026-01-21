// OSC 52 clipboard support - works over SSH and in modern terminals
export function copyToClipboard(text: string): void {
  const encoded = Buffer.from(text).toString("base64")
  // OSC 52: \x1b]52;c;<base64>\x07
  process.stdout.write(`\x1b]52;c;${encoded}\x07`)
}
