import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import {
  FileDownload as FileDownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as CsvIcon,
  Description as JsonIcon,
  Article as ExcelIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

export interface ExportButtonProps {
  data: any[];
  filename: string;
  format?: 'csv' | 'pdf' | 'json' | 'excel';
  onExport?: (format: string) => Promise<void> | void;
  disabled?: boolean;
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
}

const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  filename,
  format,
  onExport,
  disabled = false,
  variant = 'outlined',
  size = 'medium',
}) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (format) {
      handleExport(format);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = async (exportFormat: string) => {
    setLoading(true);
    handleClose();

    try {
      if (onExport) {
        await onExport(exportFormat);
      } else {
        // Default export logic
        switch (exportFormat) {
          case 'csv':
            exportToCSV();
            break;
          case 'json':
            exportToJSON();
            break;
          case 'pdf':
            exportToPDF();
            break;
          case 'excel':
            exportToExcel();
            break;
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          const stringValue = value !== null && value !== undefined ? String(value) : '';
          return `"${stringValue.replace(/"/g, '""')}"`;
        }).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `${filename}.csv`);
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    downloadBlob(blob, `${filename}.json`);
  };

  const exportToPDF = () => {
    // Simple PDF generation - in production, use a library like jsPDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${filename}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1 { color: #333; }
          </style>
        </head>
        <body>
          <h1>${filename}</h1>
          <table>
            <thead>
              <tr>${Object.keys(data[0] || {}).map(key => `<th>${key}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${data.map(row => `<tr>${Object.values(row).map(val => `<td>${val}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    downloadBlob(blob, `${filename}.html`);
  };

  const exportToExcel = () => {
    // Simple Excel export using CSV with .xls extension
    // In production, use a library like xlsx
    exportToCSV();
  };

  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const exportOptions = [
    { format: 'csv', label: 'CSV', icon: <CsvIcon /> },
    { format: 'json', label: 'JSON', icon: <JsonIcon /> },
    { format: 'pdf', label: 'PDF', icon: <PdfIcon /> },
    { format: 'excel', label: 'Excel', icon: <ExcelIcon /> },
  ];

  return (
    <>
      <Button
        variant={variant}
        size={size}
        startIcon={loading ? <CircularProgress size={20} /> : <FileDownloadIcon />}
        onClick={handleClick}
        disabled={disabled || loading || !data || data.length === 0}
      >
        {t('common.export')}
      </Button>

      {!format && (
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          {exportOptions.map(option => (
            <MenuItem key={option.format} onClick={() => handleExport(option.format)}>
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText>{option.label}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
};

export default ExportButton;
