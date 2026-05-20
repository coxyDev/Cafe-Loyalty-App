import React, { useState } from 'react';
import { Upload, Download, AlertCircle, CheckCircle, X } from 'lucide-react';

const CSVImportModal = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState(null);
  const [parseResult, setParseResult] = useState(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }

    setFile(selectedFile);
    setError('');
    setParseResult(null);

    // Parse CSV preview
    try {
      setIsProcessing(true);
      const text = await selectedFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        setError('CSV file must have at least a header row and one data row');
        return;
      }

      // Parse header
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      // Check required columns
      if (!headers.includes('name') || !headers.includes('email')) {
        setError('CSV must contain "name" and "email" columns');
        return;
      }

      // Parse data rows
      const data = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length >= headers.length && values[0] && values[1]) {
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          data.push(row);
        }
      }

      setParseResult({
        headers,
        data,
        rowCount: data.length,
        preview: data.slice(0, 3) // Show first 3 rows as preview
      });

    } catch (err) {
      setError('Error parsing CSV file: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = () => {
    if (parseResult && parseResult.data.length > 0) {
      onImport(parseResult.data);
      onClose();
      // Reset state
      setFile(null);
      setParseResult(null);
      setError('');
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'name,email,regularOrder\nJohn Doe,john.doe@school.edu,Large Coffee\nJane Smith,jane.smith@school.edu,Medium Latte';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'staff_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Import Staff Data</h2>
          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>

        <div className="import-instructions">
          <p className="text-gray-600 mb-4">
            Import staff data from a CSV file. Required columns: <strong>name</strong> and <strong>email</strong>. 
            Optional: <strong>regularOrder</strong>
          </p>
          
          <button 
            onClick={downloadTemplate}
            className="button button-secondary mb-4"
          >
            <Download size={16} />
            Download Template
          </button>
        </div>

        <div className="file-upload-area">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="file-input"
            id="csv-file"
          />
          <label htmlFor="csv-file" className="file-upload-label">
            <Upload size={24} />
            <span>Click to select CSV file</span>
            {file && <span className="file-name">{file.name}</span>}
          </label>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {isProcessing && (
          <div className="processing-message">
            Processing file...
          </div>
        )}

        {parseResult && (
          <div className="parse-result">
            <div className="success-message">
              <CheckCircle size={16} />
              Found {parseResult.rowCount} staff members
            </div>
            
            <div className="preview-section">
              <h4>Preview:</h4>
              <div className="preview-table">
                <table>
                  <thead>
                    <tr>
                      {parseResult.headers.map(header => (
                        <th key={header}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parseResult.preview.map((row, index) => (
                      <tr key={index}>
                        {parseResult.headers.map(header => (
                          <td key={header}>{row[header]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parseResult.rowCount > 3 && (
                  <p className="text-sm text-gray-500 mt-2">
                    ...and {parseResult.rowCount - 3} more rows
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="form-buttons">
          <button onClick={onClose} className="button button-secondary flex-1">
            Cancel
          </button>
          <button 
            onClick={handleImport}
            disabled={!parseResult || parseResult.data.length === 0}
            className="button button-primary flex-1"
          >
            Import {parseResult ? parseResult.rowCount : 0} Staff Members
          </button>
        </div>
      </div>
    </div>
  );
};

export default CSVImportModal;