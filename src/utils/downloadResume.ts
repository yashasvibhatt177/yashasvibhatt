const RESUME_PDF_URL = '/assets/aistudio/cv_7f5e86b4.pdf';
const RESUME_DOWNLOAD_FILENAME = 'Yashasvi_Bhatt_Resume.pdf';

export async function downloadResumePdf(): Promise<void> {
  const response = await fetch(RESUME_PDF_URL, {
    credentials: 'same-origin',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const buffer = await response.arrayBuffer();
  const header = new Uint8Array(buffer.slice(0, 4));
  const isValidPdf =
    header.length === 4 &&
    header[0] === 0x25 && // %
    header[1] === 0x50 && // P
    header[2] === 0x44 && // D
    header[3] === 0x46; // F

  if (!isValidPdf) {
    throw new Error('Downloaded file did not contain a valid PDF header.');
  }

  const blob = new Blob([buffer], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = RESUME_DOWNLOAD_FILENAME;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 5000);
}
