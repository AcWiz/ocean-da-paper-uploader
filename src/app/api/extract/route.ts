import { NextRequest, NextResponse } from 'next/server'
import { extractTextFromPDF } from '@/lib/pdf'
import { extractPaperInfo } from '@/lib/llm'
import {
  MAX_PDF_SIZE_BYTES,
  MIN_EXTRACTED_TEXT_LENGTH,
  ERROR_MESSAGES
} from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const pdfFile = formData.get('pdf') as File

    if (!pdfFile) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.PDF_REQUIRED },
        { status: 400 }
      )
    }

    if (pdfFile.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.PDF_INVALID_TYPE },
        { status: 400 }
      )
    }

    if (pdfFile.size > MAX_PDF_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.PDF_TOO_LARGE },
        { status: 413 }
      )
    }

    // Extract text from PDF
    const text = await extractTextFromPDF(pdfFile)

    if (!text || text.length < MIN_EXTRACTED_TEXT_LENGTH) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.PDF_TEXT_EXTRACTION_FAILED },
        { status: 400 }
      )
    }

    // Extract paper info using LLM
    const paper = await extractPaperInfo(text)

    return NextResponse.json({
      success: true,
      paper
    })
  } catch (error) {
    console.error('Extract error:', error)
    const message = error instanceof Error ? error.message : ERROR_MESSAGES.PARSE_FAILED
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
