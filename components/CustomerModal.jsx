import React, { useRef } from 'react';
import { Coffee, Gift, User, Camera, X } from 'lucide-react';
import { LOYALTY_THRESHOLD, COFFEE_PRICE } from '../utils/constants';

const CustomerModal = ({ 
  customer, 
  onClose, 
  onAddCoffee, 
  onRedeemReward, 
  onUpdateOrder,
  onRemove,
  profilePicture,
  onAddProfilePicture,
  onRemoveProfilePicture
}) => {
  const fileInputRef = useRef(null);

  if (!customer) return null;

  const progressPercentage = (customer.coffeeCount % LOYALTY_THRESHOLD) / LOYALTY_THRESHOLD * 100;
  const remaining = LOYALTY_THRESHOLD - (customer.coffeeCount % LOYALTY_THRESHOLD);

  const handlePictureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onAddProfilePicture(customer.id, e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePicture = () => {
    onRemoveProfilePicture(customer.id);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>
        
        <div className="customer-modal-header">
          <div className="customer-modal-avatar">
            {profilePicture ? (
              <img 
                src={profilePicture} 
                alt={customer.name}
                className="modal-profile-picture"
              />
            ) : (
              <div className="modal-default-avatar">
                <User size={32} />
              </div>
            )}
            <div className="picture-actions">
              <button 
                onClick={triggerFileInput}
                className="picture-button"
              >
                <Camera size={12} />
                {profilePicture ? 'Change' : 'Add Photo'}
              </button>
              {profilePicture && (
                <button 
                  onClick={handleRemovePicture}
                  className="picture-button"
                >
                  <X size={12} />
                  Remove
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePictureUpload}
              className="picture-input"
            />
          </div>
          
          <div className="customer-modal-info">
            <h2 className="modal-title">{customer.name}</h2>
            <p className="customer-email">{customer.email}</p>
          </div>
        </div>
        
        <div className="progress-container">
          <div className="progress-header">
            <span className="progress-label">Coffee Count</span>
            <span className="progress-count">{customer.coffeeCount}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="progress-text">
            {remaining} more for free coffee
          </p>
        </div>

        <div className="form-group">
          <label className="stat-label">Regular Order</label>
          <textarea
            className="form-textarea"
            value={customer.regularOrder || ''}
            onChange={(e) => onUpdateOrder(customer.id, e.target.value)}
            placeholder="Enter staff member's regular order..."
          />
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Spent</span>
            <p className="stat-value">${customer.totalSpent.toFixed(2)}</p>
          </div>
          <div className="stat-item">
            <span className="stat-label">Last Visit</span>
            <p className="stat-value">{customer.lastVisit || 'Never'}</p>
          </div>
        </div>

        <div className="form-buttons">
          <button
            onClick={() => onAddCoffee(customer.id)}
            className="button button-primary flex-1"
          >
            <Coffee size={16} />
            Add Coffee (${COFFEE_PRICE.toFixed(2)})
          </button>
          
          {customer.coffeeCount >= LOYALTY_THRESHOLD && (
            <button
              onClick={() => onRedeemReward(customer.id)}
              className="button button-success flex-1"
            >
              <Gift size={16} />
              Redeem Free Coffee
            </button>
          )}
        </div>

        <div className="form-buttons" style={{ marginTop: '8px' }}>
          <button
            onClick={() => {
              if (window.confirm(`Remove ${customer.name} from the system? This cannot be undone.`)) {
                onRemove(customer.id);
                onClose();
              }
            }}
            className="button button-secondary flex-1"
            style={{ color: '#dc2626', borderColor: '#fecaca' }}
          >
            Remove Staff Member
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;