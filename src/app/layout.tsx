import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI+海洋数据同化论文上传',
  description: '上传本地PDF论文，自动提取信息并创建PR',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200">
        <header className="bg-slate-800 text-white py-4 px-6 shadow-md">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-xl font-bold">AI+海洋数据同化论文上传</h1>
            <p className="text-slate-300 text-sm">上传本地PDF，自动提取论文信息</p>
          </div>
        </header>
        <main className="max-w-4xl mx-auto py-8 px-4">
          {children}
        </main>
        <footer className="text-center text-slate-500 text-sm py-4">
          基于 GPT-4o 自动提取 · GitHub PR 自动创建
        </footer>
      </body>
    </html>
  )
}
