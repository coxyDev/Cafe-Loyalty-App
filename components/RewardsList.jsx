import React from 'react';
import { Star, Gift } from 'lucide-react';
import { LOYALTY_THRESHOLD } from '../utils/constants';

const RewardsList = ({ customers, onCustomerClick, onRedeemReward }) => {
  return (
    <div className="main-content">
      <div className="content-header">
        <h2 className="content-title">Staff Members Ready for Free Coffee</h2>
      </div>
      <div>
        {customers.map(customer => (
          <div key={customer.id} className="reward-card">
            <div className="reward-info">
              <div>
                <h3 className="reward-customer">
                  <Star size={20} className="text-green-500 fill-current" />
                  {customer.name}
                </h3>
                <p className="customer-email">{customer.email}</p>
                <p className="reward-available">
                  {Math.floor(customer.coffeeCount / LOYALTY_THRESHOLD)} free coffee(s) available
                </p>
              </div>
              <div className="reward-actions">
                <button
                  onClick={() => onCustomerClick(customer)}
                  className="button button-secondary"
                >
                  View Details
                </button>
                <button
                  onClick={() => onRedeemReward(customer.id)}
                  className="button button-success"
                >
                  <Gift size={16} />
                  Redeem
                </button>
              </div>
            </div>
          </div>
        ))}
        {customers.length === 0 && (
          <div className="empty-state">
            <Gift size={48} className="empty-icon" />
            <p>No staff members are ready for rewards yet.</p>
            <p className="text-sm">Staff members need {LOYALTY_THRESHOLD} coffees for a free one!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardsList;