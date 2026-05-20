import React from 'react';
import { Coffee, Star, Clock, User } from 'lucide-react';
import { LOYALTY_THRESHOLD } from '../utils/constants';

const CustomerCard = ({ customer, onClick, profilePicture }) => {
  return (
    <div 
      className="customer-card" 
      onClick={() => onClick(customer)}
    >
      <div className="customer-info">
        <div className="customer-main">
          <div className="customer-avatar">
            {profilePicture ? (
              <img 
                src={profilePicture} 
                alt={customer.name}
                className="profile-picture"
              />
            ) : (
              <div className="default-avatar">
                <User size={24} />
              </div>
            )}
          </div>
          
          <div className="customer-details">
            <h3 className="customer-name">{customer.name}</h3>
            <p className="customer-email">{customer.email}</p>
            {customer.regularOrder && (
              <p className="customer-order">
                <Coffee size={14} className="inline mr-1" />
                {customer.regularOrder}
              </p>
            )}
          </div>
        </div>
        
        <div className="customer-stats">
          <div className="coffee-count">
            <Coffee size={16} className="text-amber-600" />
            <span className="coffee-number">{customer.coffeeCount}</span>
            {customer.coffeeCount >= LOYALTY_THRESHOLD && (
              <Star size={16} className="text-green-500 fill-current" />
            )}
          </div>
          <p className="spent-amount">
            ${customer.totalSpent.toFixed(2)} spent
          </p>
          {customer.lastVisit && (
            <p className="last-visit">
              <Clock size={12} className="inline mr-1" />
              {customer.lastVisit}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;