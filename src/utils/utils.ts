
export function log(message: unknown) {
  console.log(message, "@", new Date().toLocaleTimeString())
}