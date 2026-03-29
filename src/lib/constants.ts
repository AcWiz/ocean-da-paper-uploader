// Shared constants for paper metadata

export const METHOD_TAGS = [
  'PINN',
  'Koopman',
  'Neural-Operator',
  'GNN',
  'Transformer',
  '4D-Var',
  'EnKF',
  'Deep-Learning',
  'Physics-Informed'
] as const

export const APPLICATION_TAGS = [
  'SST',
  'SSH',
  'ENSO',
  'Wave',
  'Global-Forecast',
  'Regional-Forecast',
  'Ocean-DA',
  'Deep-Ocean',
  'Climate'
] as const

export const METHOD_TAGS_PROMPT = METHOD_TAGS.join(', ')
export const APPLICATION_TAGS_PROMPT = APPLICATION_TAGS.join(', ')

export const DEFAULT_DIFFICULTY = '★★★☆☆'
export const DEFAULT_IMPORTANCE = '★★★★☆'

export type MethodTag = typeof METHOD_TAGS[number]
export type ApplicationTag = typeof APPLICATION_TAGS[number]

export const CLAUDE_MODEL = 'claude-sonnet-4-20250514'

// PDF extraction constants
export const MAX_PDF_SIZE_BYTES = 30 * 1024 * 1024 // 30MB
export const MIN_EXTRACTED_TEXT_LENGTH = 100

// Error messages
export const ERROR_MESSAGES = {
  PDF_REQUIRED: '未提供PDF文件',
  PDF_INVALID_TYPE: '文件必须是PDF格式',
  PDF_TOO_LARGE: '文件大小超出限制（最大30MB）',
  PDF_TEXT_EXTRACTION_FAILED: '无法从PDF中提取文本（可能是扫描版）',
  PARSE_FAILED: '解析失败'
} as const
