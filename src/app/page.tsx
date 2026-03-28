'use client'

import { useState } from 'react'
import UploadZone from '@/components/UploadZone'
import ExtractedForm from '@/components/ExtractedForm'
import PRStatus from '@/components/PRStatus'

export interface ExtractedPaper {
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

type Step = 'upload' | 'confirm' | 'pr'

export default function Home() {
  const [step, setStep] = useState<Step>('upload')
  const [extractedPaper, setExtractedPaper] = useState<ExtractedPaper | null>(null)
  const [prUrl, setPrUrl] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleExtracted = (paper: ExtractedPaper) => {
    setExtractedPaper(paper)
    setStep('confirm')
  }

  const handleConfirmed = async (paper: ExtractedPaper) => {
    setStep('pr')
    try {
      const response = await fetch('/api/create-pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paper),
      })
      const data = await response.json()
      if (data.success) {
        setPrUrl(data.prUrl)
      } else {
        setError(data.error || '创建PR失败')
      }
    } catch (e) {
      setError('网络错误，请重试')
    }
  }

  const handleError = (errorMsg: string) => {
    setError(errorMsg)
  }

  const handleReset = () => {
    setStep('upload')
    setExtractedPaper(null)
    setPrUrl('')
    setError('')
  }

  return (
    <div className="space-y-6">
      {/* Steps indicator */}
      <div className="flex items-center justify-center space-x-4 text-sm">
        <div className={`flex items-center ${step === 'upload' ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
            step === 'upload' ? 'bg-blue-600 text-white' : step !== 'upload' ? 'bg-green-500 text-white' : 'bg-slate-300'
          }`}>
            {step !== 'upload' ? '✓' : '1'}
          </span>
          上传PDF
        </div>
        <div className="text-slate-300">→</div>
        <div className={`flex items-center ${step === 'confirm' ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
            step === 'confirm' ? 'bg-blue-600 text-white' : step === 'pr' ? 'bg-green-500 text-white' : 'bg-slate-300'
          }`}>
            {step === 'upload' ? '2' : step === 'confirm' ? '2' : '✓'}
          </span>
          确认信息
        </div>
        <div className="text-slate-300">→</div>
        <div className={`flex items-center ${step === 'pr' ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
            step === 'pr' ? 'bg-blue-600 text-white' : 'bg-slate-300'
          }`}>
            3
          </span>
          创建PR
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">错误</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={handleReset}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            重新开始
          </button>
        </div>
      )}

      {/* Step content */}
      {step === 'upload' && (
        <UploadZone onExtracted={handleExtracted} onError={handleError} />
      )}

      {step === 'confirm' && extractedPaper && (
        <ExtractedForm
          paper={extractedPaper}
          onConfirm={handleConfirmed}
          onBack={() => setStep('upload')}
        />
      )}

      {step === 'pr' && (
        <PRStatus prUrl={prUrl} onReset={handleReset} />
      )}
    </div>
  )
}
