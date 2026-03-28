'use client'

import { useState, useCallback } from 'react'
import { Upload, FileText, AlertCircle } from 'lucide-react'
import type { ExtractedPaper } from '@/app/page'

interface UploadZoneProps {
  onExtracted: (paper: ExtractedPaper) => void
  onError: (error: string) => void
}

export default function UploadZone({ onExtracted, onError }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      processFile(droppedFile)
    } else {
      onError('请上传 PDF 文件')
    }
  }, [onError])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      processFile(selectedFile)
    }
  }

  const processFile = async (pdfFile: File) => {
    setFile(pdfFile)
    setIsLoading(true)
    onError('')

    try {
      const formData = new FormData()
      formData.append('pdf', pdfFile)

      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        onExtracted(data.paper)
      } else {
        onError(data.error || 'PDF解析失败')
      }
    } catch (e) {
      onError('网络错误，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isLoading ? (
          <div className="space-y-4">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
            <p className="text-slate-600">正在解析PDF并提取论文信息...</p>
            <p className="text-sm text-slate-400">使用GPT-4o进行信息提取，请稍候</p>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-700 mb-2">
              拖拽PDF文件到此处，或点击选择
            </p>
            <p className="text-sm text-slate-500 mb-4">
              支持上传本地PDF论文（扫描版PDF可能无法提取）
            </p>
            <label className="inline-block">
              <span className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                选择文件
              </span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          </>
        )}
      </div>

      {file && !isLoading && (
        <div className="mt-4 flex items-center justify-center text-sm text-slate-500">
          <FileText className="w-4 h-4 mr-2" />
          {file.name}
        </div>
      )}

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">注意事项</p>
            <ul className="mt-1 list-disc list-inside space-y-1">
              <li>PDF需要有文本层（扫描版无法提取）</li>
              <li>提取结果需人工确认，请仔细核对</li>
              <li>创建PR需要GitHub账号和仓库写权限</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
