import OpenAI from 'openai'
import { METHOD_TAGS_PROMPT, APPLICATION_TAGS_PROMPT } from './constants'
import { parseArxivYear } from './utils'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: text.slice(0, 15000) }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  })

  const content = completion.choices[0]?.message?.content
  if (!content) {
    throw new Error('LLM返回为空')
  }

  const data = JSON.parse(content)

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
    rawText: text.slice(0, 15000) // Store only what was sent to LLM
  }
}
