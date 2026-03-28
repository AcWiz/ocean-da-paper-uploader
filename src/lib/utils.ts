/**
 * Convert text to a URL-safe slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 50)
}

/**
 * Parse year from arXiv ID (format: YYMM.XXXXX)
 * Assumes 2-digit year where 00-89 = 2000-2089, 90-99 = 1990-1999
 */
export function parseArxivYear(arxivId: string): number | null {
  const match = arxivId.match(/^(\d{2})(\d{2})/)
  if (!match) return null
  const yy = parseInt(match[1], 10)
  const year = yy < 90 ? 2000 + yy : 1900 + yy
  return year
}
