import pdfParse from 'pdf-parse'

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const data = await pdfParse(Buffer.from(arrayBuffer))
  return data.text
}
