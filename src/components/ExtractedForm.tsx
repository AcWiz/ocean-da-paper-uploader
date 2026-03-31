'use client'

import { useState, useCallback } from 'react'
import { ArrowLeft, Check, Edit2 } from 'lucide-react'
import { METHOD_TAGS, APPLICATION_TAGS } from '@/lib/constants'
import type { ExtractedPaper } from '@/app/page'

interface ExtractedFormProps {
  paper: ExtractedPaper
  onConfirm: (paper: ExtractedPaper) => void
  onBack: () => void
}

type TagField = 'method_tags' | 'application_tags'

export default function ExtractedForm({ paper, onConfirm, onBack }: ExtractedFormProps) {
  const [form, setForm] = useState<ExtractedPaper>(paper)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)
    await onConfirm(form)
    setIsSubmitting(false)
  }, [form, onConfirm])

  const toggleTag = useCallback((tag: string, field: TagField) => {
    setForm(prev => {
      const tags = prev[field].includes(tag)
        ? prev[field].filter(t => t !== tag)
        : [...prev[field], tag]
      return { ...prev, [field]: tags }
    })
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">确认论文信息</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <Edit2 className="w-4 h-4 mr-1" />
          {isEditing ? '取消编辑' : '编辑'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">论文标题</label>
          {isEditing ? (
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <p className="text-lg font-medium text-slate-900">{form.title}</p>
          )}
        </div>

        {/* Authors */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">作者</label>
          {isEditing ? (
            <input
              type="text"
              value={form.authors.join(', ')}
              onChange={(e) => setForm({ ...form, authors: e.target.value.split(',').map(s => s.trim()) })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="作者1, 作者2, 作者3"
            />
          ) : (
            <p className="text-slate-600">{form.authors.join(', ')}</p>
          )}
        </div>

        {/* Year & Venue */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">年份</label>
            {isEditing ? (
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-slate-600">{form.year}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">发表场所</label>
            {isEditing ? (
              <input
                type="text"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-slate-600">{form.venue || 'arXiv'}</p>
            )}
          </div>
        </div>

        {/* arXiv ID */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">arXiv ID</label>
          {isEditing ? (
            <input
              type="text"
              value={form.arxiv}
              onChange={(e) => setForm({ ...form, arxiv: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="2503.19160"
            />
          ) : (
            <p className="text-slate-600">{form.arxiv || '待补充'}</p>
          )}
        </div>

        {/* Method Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">方法标签</label>
          <div className="flex flex-wrap gap-2">
            {METHOD_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag, 'method_tags')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  form.method_tags.includes(tag)
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Application Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">应用标签</label>
          <div className="flex flex-wrap gap-2">
            {APPLICATION_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag, 'application_tags')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  form.application_tags.includes(tag)
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* TL;DR */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">TL;DR</label>
          {isEditing ? (
            <textarea
              value={form.tldr}
              onChange={(e) => setForm({ ...form, tldr: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <p className="text-slate-600 italic">"{form.tldr}"</p>
          )}
        </div>

        {/* Abstract preview */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">摘要预览</label>
          <p className="text-sm text-slate-500 line-clamp-3 bg-slate-50 p-3 rounded-lg">
            {form.abstract || form.rawText.slice(0, 500) + '...'}
          </p>
        </div>

        {/* Chinese Structured Content */}
        <div className="border-t border-slate-200 pt-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">中文内容（AI提取）</h3>

          {/* Research Problem */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">研究问题</label>
            {isEditing ? (
              <textarea
                value={form.researchProblem}
                onChange={(e) => setForm({ ...form, researchProblem: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="本文要解决什么问题？研究动机是什么？"
              />
            ) : (
              <p className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg">
                {form.researchProblem || '待提取'}
              </p>
            )}
          </div>

          {/* Core Contributions */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">核心贡献</label>
            {isEditing ? (
              <textarea
                value={form.coreContributions}
                onChange={(e) => setForm({ ...form, coreContributions: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="3-5 个关键贡献点"
              />
            ) : (
              <p className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg whitespace-pre-wrap">
                {form.coreContributions || '待提取'}
              </p>
            )}
          </div>

          {/* Method Details */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">方法详解</label>
            {isEditing ? (
              <textarea
                value={form.methodDetails}
                onChange={(e) => setForm({ ...form, methodDetails: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="核心方法的详细描述"
              />
            ) : (
              <p className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg whitespace-pre-wrap">
                {form.methodDetails || '待提取'}
              </p>
            )}
          </div>

          {/* Experiments */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">实验分析</label>
            {isEditing ? (
              <textarea
                value={form.experiments}
                onChange={(e) => setForm({ ...form, experiments: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="实验设置、结果和发现"
              />
            ) : (
              <p className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg whitespace-pre-wrap">
                {form.experiments || '待提取'}
              </p>
            )}
          </div>

          {/* Pros & Cons */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">优缺点</label>
            {isEditing ? (
              <textarea
                value={form.prosCons}
                onChange={(e) => setForm({ ...form, prosCons: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="优点：&#10;- 点1&#10;&#10;缺点：&#10;- 点1"
              />
            ) : (
              <p className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg whitespace-pre-wrap">
                {form.prosCons || '待提取'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
        <button
          onClick={onBack}
          className="flex items-center text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          重新上传
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || form.method_tags.length === 0 || form.application_tags.length === 0}
          className="flex items-center bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              创建PR...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-1" />
              确认并创建PR
            </>
          )}
        </button>
      </div>
    </div>
  )
}
