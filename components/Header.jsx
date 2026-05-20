import React from 'react';
import { Coffee } from 'lucide-react';

const Header = () => {
  return (
    <div className="header">
      <h1 className="header-title">
        <Coffee className="text-amber-600" />
        School Cafe Loyalty System
      </h1>
      <p className="header-subtitle">Manage customer loyalty cards and rewards</p>
    </div>
  );
};

export default Header;