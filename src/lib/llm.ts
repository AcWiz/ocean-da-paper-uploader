import Anthropic from '@anthropic-ai/sdk'
import { METHOD_TAGS_PROMPT, APPLICATION_TAGS_PROMPT, CLAUDE_MODEL } from './constants'
import { parseArxivYear } from './utils'

// Singleton client - initialized once per server lifecycle
let _anthropic: Anthropic | null = null

function getAnthropicClient(): Anthropic {
  if (_anthropic) return _anthropic

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set')
  }

  const config: { apiKey: string; baseURL?: string } = {
    apiKey: process.env.ANTHROPIC_API_KEY,
  }
  if (process.env.ANTHROPIC_BASE_URL) {
    config.baseURL = process.env.ANTHROPIC_BASE_URL
  }

  _anthropic = new Anthropic(config)
  return _anthropic
}

export interface ExtractedPaperData {
  title: string
  authors: string[]
  year: number
  arxiv: string
  venue: string
  method_tags: string[]
  application_tags: string[]
  abstract: string
  tldr: string
  rawText: string
}

const SYSTEM_PROMPT = `你是一个学术论文信息提取助手。给定一篇论文的全文文本，请提取以下信息并以JSON格式返回。

返回格式：
{
  "title": "论文标题（英文）",
  "authors": ["作者1", "作者2", ...],
  "year": 论文年份（数字）,
  "arxiv": "arXiv ID（如 2503.19160），如果文本中没有则为空字符串",
  "venue": "发表场所（如 arXiv, Nature Climate Change 等）",
  "method_tags": ["主要方法标签，从以下列表选择：${METHOD_TAGS_PROMPT}"],
  "application_tags": ["应用标签，从以下列表选择：${APPLICATION_TAGS_PROMPT}"],
  "tldr": "一句话总结（英文，50词以内）",
  "abstract": "论文摘要（英文）"
}

注意：
1. 只返回JSON，不要有其他文字
2. authors数组至少要有主要作者（最多列出10个）
3. method_tags和application_tags至少各选一个
4. 如果无法确定年份，从arXiv ID推断（格式YYMM.XXXXX）
5. 如果没有arXiv ID，arxiv字段为空字符串`

export async function extractPaperInfo(text: string): Promise<ExtractedPaperData> {
  const anthropic = getAnthropicClient()
  const truncatedText = text.slice(0, 15000)

  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: truncatedText
      }
    ],
  })

  // Handle different response formats from various API providers
  // Skip 'thinking' blocks (Claude extended thinking) and find the text block
  let responseText: string | undefined
  if (typeof response.content === 'string') {
    responseText = response.content
  } else if (Array.isArray(response.content)) {
    // Find the first block that has a 'text' property
    const textBlock = response.content.find((block: any) => 'text' in block) as { text?: string } | undefined
    responseText = textBlock?.text
  }

  if (!responseText) {
    console.error('LLM response content:', JSON.stringify(response.content, null, 2))
    throw new Error('LLM返回格式错误: 未找到text内容')
  }

  let data: ExtractedPaperData
  try {
    data = JSON.parse(responseText)
  } catch (e) {
    console.error('JSON parse error. LLM response text:', responseText.slice(0, 500))
    throw new Error(`LLM返回的JSON格式错误: ${responseText.slice(0, 200)}`)
  }

  // Infer year from arXiv ID if not provided
  if (!data.year && data.arxiv) {
    data.year = parseArxivYear(data.arxiv) ?? 0
  }

  // Ensure authors is always an array
  if (typeof data.authors === 'string') {
    data.authors = [data.authors]
  }

  return {
    ...data,
    rawText: truncatedText
  }
}
