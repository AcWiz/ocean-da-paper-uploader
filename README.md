# Ocean DA Paper Uploader

PDF论文上传工具，用于向 [awesome-ocean-da](https://github.com/AcWiz/awesome-ocean-da) 论文库提交新论文。

## 功能

- 拖拽或选择本地PDF文件上传
- 使用 Claude Sonnet 自动提取论文信息（标题、作者、年份、arXiv ID、摘要等）
- 可视化确认和编辑提取结果
- 自动创建 GitHub Pull Request

## 限制

- 扫描版PDF无文本层，无法提取信息
- 需要有效的 GitHub 账号和仓库写权限才能创建PR
- LLM提取结果需要人工确认

## 部署

### Vercel (推荐)

1. Fork 本仓库
2. 在 Vercel 中导入项目
3. 配置环境变量：
   - `ANTHROPIC_API_KEY` - Anthropic API 密钥
   - `ANTHROPIC_BASE_URL` - API endpoint (如使用 minimax 则为 `https://api.minimaxi.com/anthropic`)
   - `GITHUB_TOKEN` - GitHub Personal Access Token (需要 repo 权限)
   - `GITHUB_REPO_OWNER` = `AcWiz`
   - `GITHUB_REPO_NAME` = `awesome-ocean-da`
4. 部署

### GitHub Pages

1. Fork 本仓库
2. 在 Settings > Pages 中启用 GitHub Pages
3. 配置环境变量
4. 使用 `npm run build` 构建静态文件

## 本地开发

```bash
npm install
npm run dev
```

复制 `.env.example` 为 `.env.local` 并填写环境变量。

## 技术栈

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- pdf.js (PDF文本提取)
- Claude Sonnet (信息提取)
- Octokit (GitHub API)
