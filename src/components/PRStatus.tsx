'use client'

import { CheckCircle, ExternalLink, RefreshCw, Github } from 'lucide-react'

interface PRStatusProps {
  prUrl: string
  onReset: () => void
}

export default function PRStatus({ prUrl, onReset }: PRStatusProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-2">PR 创建成功！</h2>
      <p className="text-slate-600 mb-6">
        您的论文信息已成功创建 Pull Request
      </p>

      {prUrl && (
        <a
          href={prUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mb-6"
        >
          <Github className="w-5 h-5 mr-2" />
          在 GitHub 上查看 PR
          <ExternalLink className="w-4 h-4 ml-2" />
        </a>
      )}

      <div className="bg-slate-50 rounded-lg p-4 text-left text-sm text-slate-600">
        <p className="font-medium mb-2">后续步骤：</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>等待维护者审核您的 PR</li>
          <li>如有需要，根据反馈进行修改</li>
          <li>PR 合并后，论文将出现在论文库中</li>
        </ol>
      </div>

      <button
        onClick={onReset}
        className="mt-6 flex items-center text-slate-600 hover:text-slate-800 mx-auto"
      >
        <RefreshCw className="w-4 h-4 mr-1" />
        上传另一篇论文
      </button>
    </div>
  )
}
