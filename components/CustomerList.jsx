import React from 'react';
import CustomerCard from './CustomerCard';

const CustomerList = ({ customers, onCustomerClick, profilePictures }) => {
  return (
    <div className="main-content">
      <div className="content-header">
        <h2 className="content-title">All Staff Members</h2>
      </div>
      <div>
        {customers.map(customer => (
          <CustomerCard 
            key={customer.id} 
            customer={customer} 
            onClick={onCustomerClick}
            profilePicture={profilePictures[customer.id]}
          />
        ))}
        {customers.length === 0 && (
          <div className="empty-state">
            <p>No staff members found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;