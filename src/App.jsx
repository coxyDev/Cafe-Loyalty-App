import React, { useState } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import { LOYALTY_THRESHOLD } from '../utils/constants';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import SearchBar from '../components/SearchBar';
import CustomerList from '../components/CustomerList';
import RewardsList from '../components/RewardsList';
import AddCustomerModal from '../components/AddCustomerModal';
import CustomerModal from '../components/CustomerModal';
import CSVImportModal from '../components/CSVImportModal';
import PictureImportModal from '../components/PictureImportModal';
import '../styles/index.css';
import '../styles/components.css';
import '../styles/App.css';

function App() {
  const { 
    customers, 
    profilePictures,
    addCustomer, 
    addCoffee, 
    redeemFreeCoffee, 
    updateRegularOrder,
    addProfilePicture,
    removeProfilePicture,
    importCustomersFromCSV,
    autoAssignPictures
  } = useCustomers();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('customers');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showCSVImport, setShowCSVImport] = useState(false);
  const [showPictureImport, setShowPictureImport] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const eligibleForReward = filteredCustomers.filter(c => c.coffeeCount >= LOYALTY_THRESHOLD);

  const handleAddCoffee = (customerId) => {
    addCoffee(customerId);
    // Update selected customer if modal is open
    if (selectedCustomer && selectedCustomer.id === customerId) {
      const updated = customers.find(c => c.id === customerId);
      setSelectedCustomer({
        ...updated,
        coffeeCount: updated.coffeeCount + 1,
        totalSpent: updated.totalSpent + 5.00,
        lastVisit: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleRedeemReward = (customerId) => {
    redeemFreeCoffee(customerId);
    // Update selected customer if modal is open
    if (selectedCustomer && selectedCustomer.id === customerId) {
      const updated = customers.find(c => c.id === customerId);
      setSelectedCustomer({
        ...updated,
        coffeeCount: updated.coffeeCount - LOYALTY_THRESHOLD,
        lastVisit: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleCSVImport = (csvData) => {
    const imported = importCustomersFromCSV(csvData);
    console.log(`Imported ${imported.length} staff members from CSV`);
  };

  const handlePictureAssignment = (customerId, imageDataUrl) => {
    addProfilePicture(customerId, imageDataUrl);
  };

  return (
    <div className="app">
      <div className="container">
        <Header />
        
        <Navigation 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          customerCount={customers.length}
          eligibleCount={eligibleForReward.length}
        />

        <SearchBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onAddCustomer={() => setShowAddCustomer(true)}
          onImportCSV={() => setShowCSVImport(true)}
          onImportPictures={() => setShowPictureImport(true)}
        />

        {activeTab === 'customers' && (
          <CustomerList 
            customers={filteredCustomers}
            onCustomerClick={setSelectedCustomer}
            profilePictures={profilePictures}
          />
        )}

        {activeTab === 'rewards' && (
          <RewardsList 
            customers={eligibleForReward}
            onCustomerClick={setSelectedCustomer}
            onRedeemReward={handleRedeemReward}
          />
        )}

        <AddCustomerModal 
          isOpen={showAddCustomer}
          onClose={() => setShowAddCustomer(false)}
          onAdd={addCustomer}
        />

        <CSVImportModal
          isOpen={showCSVImport}
          onClose={() => setShowCSVImport(false)}
          onImport={handleCSVImport}
        />

        <PictureImportModal
          isOpen={showPictureImport}
          onClose={() => setShowPictureImport(false)}
          customers={customers}
          onAssignPictures={handlePictureAssignment}
          autoAssignPictures={autoAssignPictures}
        />

        <CustomerModal 
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onAddCoffee={handleAddCoffee}
          onRedeemReward={handleRedeemReward}
          onUpdateOrder={updateRegularOrder}
          profilePicture={selectedCustomer ? profilePictures[selectedCustomer.id] : null}
          onAddProfilePicture={addProfilePicture}
          onRemoveProfilePicture={removeProfilePicture}
        />
      </div>
    </div>
  );
}

export default App;