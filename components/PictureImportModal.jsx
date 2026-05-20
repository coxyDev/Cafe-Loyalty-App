import React, { useState } from 'react';
import { Upload, User, Check, X, AlertCircle } from 'lucide-react';
import { SUPPORTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '../utils/constants';

const PictureImportModal = ({ isOpen, onClose, customers, onAssignPictures, autoAssignPictures }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setError('');
    setIsProcessing(true);

    try {
      // Validate files
      const validFiles = files.filter(file => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        const isValidType = SUPPORTED_IMAGE_TYPES.includes(extension);
        const isValidSize = file.size <= MAX_IMAGE_SIZE;
        
        if (!isValidType) {
          setError(`${file.name}: Unsupported file type. Use: ${SUPPORTED_IMAGE_TYPES.join(', ')}`);
          return false;
        }
        if (!isValidSize) {
          setError(`${file.name}: File too large. Maximum size: ${MAX_IMAGE_SIZE / 1024 / 1024}MB`);
          return false;
        }
        return true;
      });

      setSelectedFiles(validFiles);

      // Auto-assign pictures
      const autoAssignments = autoAssignPictures(validFiles);
      setAssignments(autoAssignments);

    } catch (err) {
      setError('Error processing files: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualAssignment = (fileIndex, customerId) => {
    setAssignments(prev => {
      const updated = [...prev];
      const existingIndex = updated.findIndex(a => a.file === selectedFiles[fileIndex]);
      
      if (existingIndex >= 0) {
        if (customerId) {
          updated[existingIndex].customer = customers.find(c => c.id === parseInt(customerId));
        } else {
          updated.splice(existingIndex, 1);
        }
      } else if (customerId) {
        updated.push({
          file: selectedFiles[fileIndex],
          customer: customers.find(c => c.id === parseInt(customerId)),
          fileName: selectedFiles[fileIndex].name
        });
      }
      
      return updated;
    });
  };

  const handleAssign = async () => {
    setIsProcessing(true);
    try {
      for (const assignment of assignments) {
        // Convert file to data URL
        const dataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(assignment.file);
        });
        
        onAssignPictures(assignment.customer.id, dataUrl);
      }
      
      onClose();
      // Reset state
      setSelectedFiles([]);
      setAssignments([]);
      setError('');
    } catch (err) {
      setError('Error assigning pictures: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: '700px', maxHeight: '80vh', overflow: 'auto' }}>
        <div className="modal-header">
          <h2 className="modal-title">Import Profile Pictures</h2>
          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>

        <div className="import-instructions">
          <p className="text-gray-600 mb-4">
            Upload profile pictures and assign them to staff members. 
            Files will be auto-matched based on filename if possible.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Supported formats: {SUPPORTED_IMAGE_TYPES.join(', ')} | Max size: {MAX_IMAGE_SIZE / 1024 / 1024}MB
          </p>
        </div>

        <div className="file-upload-area">
          <input
            type="file"
            accept={SUPPORTED_IMAGE_TYPES.map(type => `.${type}`).join(',')}
            multiple
            onChange={handleFileSelect}
            className="file-input"
            id="picture-files"
          />
          <label htmlFor="picture-files" className="file-upload-label">
            <Upload size={24} />
            <span>Click to select picture files</span>
            {selectedFiles.length > 0 && (
              <span className="file-count">{selectedFiles.length} files selected</span>
            )}
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
            Processing files...
          </div>
        )}

        {selectedFiles.length > 0 && (
          <div className="assignments-section">
            <h4>Picture Assignments:</h4>
            <div className="assignments-list">
              {selectedFiles.map((file, index) => {
                const assignment = assignments.find(a => a.file === file);
                return (
                  <div key={index} className="assignment-item">
                    <div className="file-info">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt="Preview" 
                        className="picture-preview"
                      />
                      <span className="file-name">{file.name}</span>
                    </div>
                    
                    <div className="assignment-controls">
                      <select
                        value={assignment ? assignment.customer.id : ''}
                        onChange={(e) => handleManualAssignment(index, e.target.value)}
                        className="customer-select"
                      >
                        <option value="">Select staff member...</option>
                        {customers.map(customer => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name}
                          </option>
                        ))}
                      </select>
                      
                      {assignment && (
                        <div className="assignment-status">
                          <Check size={16} className="text-green-500" />
                          <span className="text-green-600">Assigned</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="assignment-summary">
              <p className="text-sm text-gray-600">
                {assignments.length} of {selectedFiles.length} pictures assigned
              </p>
            </div>
          </div>
        )}

        <div className="form-buttons">
          <button onClick={onClose} className="button button-secondary flex-1">
            Cancel
          </button>
          <button 
            onClick={handleAssign}
            disabled={assignments.length === 0 || isProcessing}
            className="button button-primary flex-1"
          >
            Assign {assignments.length} Pictures
          </button>
        </div>
      </div>
    </div>
  );
};

export default PictureImportModal;