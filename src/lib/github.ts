import { Octokit } from '@octokit/rest'
import { DEFAULT_DIFFICULTY, DEFAULT_IMPORTANCE } from './constants'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'yourusername'
const REPO_NAME = process.env.GITHUB_REPO_NAME || 'ai-data-assimilation-papers'

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
}

function generateAbstractMd(params: CreatePRParams): string {
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

> 本文要解决什么问题？研究动机是什么？

## 核心贡献

> 3-5 个关键贡献点

## 方法详解

> 核心方法的详细描述

## 实验分析

> 实验设置、结果和发现

## 优缺点

**优点：**
-

**缺点：**
-
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
