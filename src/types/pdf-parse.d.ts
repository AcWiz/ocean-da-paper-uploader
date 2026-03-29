declare module 'pdf-parse' {
  interface PDFInfo {
    PDFFormatVersion?: string;
    IsAcroFormPresent?: boolean;
    IsXFAPresent?: boolean;
    Title?: string;
    Author?: string;
    Subject?: string;
    Creator?: string;
    Producer?: string;
    CreationDate?: string;
    ModDate?: string;
  }

  interface PDFMetadata {
    info: PDFInfo;
    metadata: Record<string, unknown> | null;
  }

  interface PDFParseResult {
    numpages: number;
    numrender: number;
    info: PDFInfo;
    metadata: Record<string, unknown> | null;
    text: string;
    version: string;
  }

  interface PDFParseOptions {
    pagerender?: (pageData: { pageNumber: number }) => string;
    max?: number;
    version?: string;
  }

  function pdfParse(
    data: Buffer | Uint8Array,
    options?: PDFParseOptions
  ): Promise<PDFParseResult>;

  export = pdfParse;
}
