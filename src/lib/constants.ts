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
