import React from 'react';
import { User, Gift } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab, customerCount, eligibleCount }) => {
  return (
    <div className="navigation">
      <div className="nav-buttons">
        <button
          onClick={() => setActiveTab('customers')}
          className={`nav-button ${activeTab === 'customers' ? 'active' : ''}`}
        >
          <User size={20} />
          Staff Members ({customerCount})
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`nav-button ${activeTab === 'rewards' ? 'active' : ''}`}
        >
          <Gift size={20} />
          Ready for Reward ({eligibleCount})
        </button>
      </div>
    </div>
  );
};

export default Navigation;