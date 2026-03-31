import { Octokit } from '@octokit/rest'
import { DEFAULT_DIFFICULTY, DEFAULT_IMPORTANCE } from './constants'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO_OWNER = process.env.GITHUB_REPO_OWNER ?? 'AcWiz'
const REPO_NAME = process.env.GITHUB_REPO_NAME ?? 'awesome-ocean-da'

export interface CreatePRParams {
  title: string
  authors: string[]
  year: number
  arxiv: string
  venue: string
  method_tags: string[]
  application_tags: string[]
  tldr: string
  abstract: string
  paperDir: string
  // Structured Chinese content
  researchProblem: string
  coreContributions: string
  methodDetails: string
  mathModeling: string
  experiments: string
  prosCons: string
  engineering落地: string
  idea扩展: string
}

function generateAbstractMd(params: CreatePRParams): string {
  // Parse prosCons into structured format
  const prosConsLines = params.prosCons.split('\n')
  let pros = ''
  let cons = ''
  let inPros = false
  let inCons = false

  for (const line of prosConsLines) {
    if (line.includes('优点')) { inPros = true; inCons = false; continue }
    if (line.includes('缺点')) { inCons = true; inPros = false; continue }
    if (inPros && line.trim()) pros += line + '\n'
    if (inCons && line.trim()) cons += line + '\n'
  }

  // Parse coreContributions into numbered list
  const contributionLines = (params.coreContributions || '1. 3-5 个关键贡献点').split('\n').filter(l => l.trim())
  const numberedContributions = contributionLines.map((line, i) => {
    const num = i + 1
    const content = line.replace(/^\d+\.\s*/, '').trim()
    return `${num}. ${content}`
  }).join('\n')

  return `---
title: "${params.title}"
arXiv: "${params.arxiv}"
authors: ${JSON.stringify(params.authors)}
year: ${params.year}
source: "arXiv"
venue: "${params.venue}"
method_tags: ${JSON.stringify(params.method_tags)}
application_tags: ${JSON.stringify(params.application_tags)}
difficulty: "${DEFAULT_DIFFICULTY}"
importance: "${DEFAULT_IMPORTANCE}"
read_status: "skim"
---

# ${params.title}

## 基本信息

- **arXiv**: [${params.arxiv}](https://arxiv.org/abs/${params.arxiv})
- **作者**: ${params.authors.join(', ')}
- **年份**: ${params.year}

## TL;DR

> ${params.tldr}

## 研究问题

> ${params.researchProblem || '本文要解决什么问题？研究动机是什么？'}

## 核心贡献

${numberedContributions || '1. 3-5 个关键贡献点'}

## 方法详解

> ${params.methodDetails || '核心方法的详细描述'}

## 数学/物理建模

> ${params.mathModeling || '关键公式和物理意义'}

## 实验分析

> ${params.experiments || '实验设置、结果和发现'}

## 优缺点

**优点：**
${pros || '- '}

**缺点：**
${cons || '- '}

## 工程落地

> ${params.engineering落地 || '实际应用场景和可行性'}

## Idea 扩展

> ${params.idea扩展 || '可以借鉴到其他研究的想法'}

## BibTeX

\`\`\`bibtex
@article{${params.title.replace(/\s+/g, '')}${params.year},
  title={${params.title}},
  author={${params.authors.join(' and ')}},
  journal={arXiv preprint arXiv:${params.arxiv}},
  year={${params.year}}
}
\`\`\`
`
}

export async function createPullRequest(params: CreatePRParams): Promise<{ success: boolean; prUrl?: string; error?: string }> {
  if (!GITHUB_TOKEN) {
    return { success: false, error: 'GitHub Token 未配置' }
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN })
  const branchName = `feat/add-paper-${params.arxiv || 'local-' + Date.now()}`
  const abstractContent = generateAbstractMd(params)

  try {
    // Get the default branch
    const { data: repo } = await octokit.repos.get({ owner: REPO_OWNER, repo: REPO_NAME })
    const baseBranch = repo.default_branch

    // Create a new branch
    const { data: ref } = await octokit.git.getRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: `heads/${baseBranch}`
    })

    await octokit.git.createRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: `refs/heads/${branchName}`,
      sha: ref.object.sha
    })

    // Create the abstract.md file
    const filePath = `papers/${params.year}/${params.paperDir}/abstract.md`
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      message: `feat: 添加 ${params.title} (arXiv: ${params.arxiv})`,
      content: Buffer.from(abstractContent).toString('base64'),
      branch: branchName
    })

    // Create PR
    const { data: pr } = await octokit.pulls.create({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      title: `feat: 添加 ${params.title} (arXiv: ${params.arxiv})`,
      body: `## 新论文投稿

- **标题**: ${params.title}
- **arXiv**: ${params.arxiv}
- **作者**: ${params.authors.join(', ')}
- **年份**: ${params.year}
- **方法标签**: ${params.method_tags.join(', ')}
- **应用标签**: ${params.application_tags.join(', ')}

**TL;DR**: ${params.tldr}

请审核并在合并前确认信息正确。`,
      head: branchName,
      base: baseBranch
    })

    return { success: true, prUrl: pr.html_url }
  } catch (error: any) {
    console.error('GitHub API error:', error)
    return { success: false, error: error.message || '创建PR失败' }
  }
}
