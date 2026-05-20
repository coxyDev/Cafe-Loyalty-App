import React, { useState } from 'react';

const AddCustomerModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    regularOrder: ''
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) return;
    onAdd(formData);
    setFormData({ name: '', email: '', regularOrder: '' });
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Add New Staff Member</h2>
          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Staff Member Name *"
            className="form-input"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
            onKeyPress={handleKeyPress}
          />
        </div>
        
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            className="form-input"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
            onKeyPress={handleKeyPress}
          />
        </div>
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Regular Order"
            className="form-input"
            value={formData.regularOrder}
            onChange={(e) => setFormData(prev => ({...prev, regularOrder: e.target.value}))}
            onKeyPress={handleKeyPress}
          />
        </div>
        
        <div className="form-buttons">
          <button onClick={onClose} className="button button-secondary flex-1">
            Cancel
          </button>
          <button onClick={handleSubmit} className="button button-primary flex-1">
            Add Staff Member
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerModal;