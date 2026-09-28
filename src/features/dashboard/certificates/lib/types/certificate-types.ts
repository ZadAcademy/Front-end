export interface ImportCertificateError {
  rowNumber: number;
  column: string;
  message: string;
}

export interface ImportCertificateData {
  totalRows: number;
  inserted: number;
  skipped: number;
  errors: ImportCertificateError[];
}
