import { PDFDocument } from 'pdf-lib';

export const MERGE_PDF_MAX_FILES = 30;
export const MERGE_PDF_MAX_FILE_SIZE_BYTES = 75 * 1024 * 1024;
export const MERGE_PDF_MAX_TOTAL_SIZE_BYTES = 200 * 1024 * 1024;
const PDF_SIGNATURE = '%PDF-';
const PDF_SIGNATURE_SCAN_BYTES = 1024;

function sanitizeFileName(name: string): string {
  const cleaned = name.replace(/[^a-zA-Z0-9._-]/g, '_');
  return cleaned.toLowerCase().endsWith('.pdf') ? cleaned : `${cleaned}.pdf`;
}

function isPdfSignature(bytes: Uint8Array): boolean {
  const signatureWindow = new TextDecoder().decode(bytes.slice(0, PDF_SIGNATURE_SCAN_BYTES));
  return signatureWindow.includes(PDF_SIGNATURE);
}

function mergeError(message: string): Error {
  return new Error(message);
}

/** Merge PDFs entirely in the browser (no server upload). */
export async function mergePdfFilesInBrowser(files: File[]): Promise<{
  blob: Blob;
  mergedCount: number;
  outputName: string;
}> {
  if (files.length < 2) {
    throw mergeError('Please select at least two PDF files.');
  }
  if (files.length > MERGE_PDF_MAX_FILES) {
    throw mergeError(`You can merge up to ${MERGE_PDF_MAX_FILES} files at once.`);
  }

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  if (totalBytes > MERGE_PDF_MAX_TOTAL_SIZE_BYTES) {
    throw mergeError(
      `Combined upload size exceeds ${Math.floor(MERGE_PDF_MAX_TOTAL_SIZE_BYTES / (1024 * 1024))}MB.`,
    );
  }

  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    if (file.size <= 0) {
      throw mergeError(`File "${file.name}" is empty.`);
    }
    if (file.size > MERGE_PDF_MAX_FILE_SIZE_BYTES) {
      throw mergeError(
        `File "${file.name}" exceeds ${Math.floor(MERGE_PDF_MAX_FILE_SIZE_BYTES / (1024 * 1024))}MB.`,
      );
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!isPdfSignature(bytes)) {
      throw mergeError(`File "${file.name}" is not a valid PDF.`);
    }

    let sourcePdf;
    try {
      sourcePdf = await PDFDocument.load(bytes, { updateMetadata: false });
    } catch (error) {
      const message = error instanceof Error ? error.message.toLowerCase() : '';
      if (message.includes('encrypted') || message.includes('password')) {
        throw mergeError(
          'One of the PDFs is password-protected. Please unlock files before merging.',
        );
      }
      throw mergeError(`Could not read "${file.name}".`);
    }

    const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedBytes = await mergedPdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
    updateFieldAppearances: false,
  });

  const outputName = sanitizeFileName(`merged_${Date.now()}.pdf`);
  const pdfBytes = new Uint8Array(mergedBytes);
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });

  return { blob, mergedCount: files.length, outputName };
}
