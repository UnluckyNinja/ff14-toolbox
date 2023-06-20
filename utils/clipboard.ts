export function copy(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
    return true
  }
  return false
}
