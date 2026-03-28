import { NextRequest, NextResponse } from 'next/server'
import { createPullRequest } from '@/lib/github'
import { slugify } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { title, year } = body

    if (!title || !year) {
      return NextResponse.json(
        { success: false, error: '缺少必需字段' },
        { status: 400 }
      )
    }

    const paperDir = slugify(body.arxiv || title)
    const result = await createPullRequest({
      ...body,
      paperDir
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        prUrl: result.prUrl
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Create PR error:', error)
    return NextResponse.json(
      { success: false, error: error.message || '创建PR失败' },
      { status: 500 }
    )
  }
}
