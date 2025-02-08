
export function log(...data: unknown[]) {
  console.log(...data, "@", new Date().toLocaleTimeString())
}

