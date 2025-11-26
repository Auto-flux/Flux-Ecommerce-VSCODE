export function parseJSON(text: string): Record<string, unknown>[] {
  const parsed = JSON.parse(text)
  if (Array.isArray(parsed)) return parsed
  return [parsed]
}
