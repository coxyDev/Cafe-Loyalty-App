import React from 'react';
import { Search, Plus, Upload, Image } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm, onAddCustomer, onImportCSV, onImportPictures }) => {
  return (
    <div className="search-bar">
      <div className="search-container">
        <div className="search-input-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search staff members by name or email..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="search-actions">
          <button onClick={onAddCustomer} className="add-button">
            <Plus size={20} />
            Add Staff
          </button>
          <button onClick={onImportCSV} className="import-button">
            <Upload size={20} />
            Import CSV
          </button>
          <button onClick={onImportPictures} className="import-button">
            <Image size={20} />
            Import Photos
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;