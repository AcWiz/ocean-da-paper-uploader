import { NextRequest, NextResponse } from 'next/server'
import { extractTextFromPDF } from '@/lib/pdf'
import { extractPaperInfo } from '@/lib/llm'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const pdfFile = formData.get('pdf') as File

    if (!pdfFile) {
      return NextResponse.json(
        { success: false, error: '未提供PDF文件' },
        { status: 400 }
      )
    }

    if (pdfFile.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: '文件必须是PDF格式' },
        { status: 400 }
      )
    }

    // Extract text from PDF
    const text = await extractTextFromPDF(pdfFile)

    if (!text || text.length < 100) {
      return NextResponse.json(
        { success: false, error: '无法从PDF中提取文本（可能是扫描版）' },
        { status: 400 }
      )
    }

    // Extract paper info using LLM
    const paper = await extractPaperInfo(text)

    return NextResponse.json({
      success: true,
      paper
    })
  } catch (error: any) {
    console.error('Extract error:', error)
    return NextResponse.json(
      { success: false, error: error.message || '解析失败' },
      { status: 500 }
    )
  }
}
