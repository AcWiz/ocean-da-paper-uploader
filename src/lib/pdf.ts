import * as pdfjsLib from 'pdfjs-dist'

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const numPages = pdf.numPages

  // Fetch all pages in parallel for performance
  const pagePromises = Array.from({ length: numPages }, async (_, i) => {
    const page = await pdf.getPage(i + 1)
    const textContent = await page.getTextContent()
    return textContent.items
      .map((item: any) => item.str)
      .join(' ')
  })

  const pageTexts = await Promise.all(pagePromises)
  return pageTexts.join('\n').trim()
}
