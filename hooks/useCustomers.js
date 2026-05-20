import { useState, useEffect } from 'react';

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [profilePictures, setProfilePictures] = useState({});

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCustomers = localStorage.getItem('cafeCustomers');
    const savedPictures = localStorage.getItem('cafeProfilePictures');
    
    if (savedCustomers) {
      const parsed = JSON.parse(savedCustomers);
      const seen = new Set();
      const deduped = parsed.filter(c => {
        if (seen.has(String(c.id))) return false;
        seen.add(String(c.id));
        return true;
      });
      setCustomers(deduped);
    } else {
      // Sample data (removed phone field)
       const sampleData = [
        {
          id: 1,
          name: 'Sarah Johnson',
          email: 'sarah.j@school.edu',
          coffeeCount: 8,
          totalSpent: 40.00,
          regularOrder: 'Large Cappuccino with oat milk',
          joinDate: '2024-01-15',
          lastVisit: '2024-08-20'
        },
        {
          id: 2,
          name: 'Mike Chen',
          email: 'mike.c@school.edu',
          coffeeCount: 12,
          totalSpent: 60.00,
          regularOrder: 'Medium Americano, extra shot',
          joinDate: '2024-02-01',
          lastVisit: '2024-08-19'
        },
        {
          id: 3,
          name: 'Emma Wilson',
          email: 'emma.w@school.edu',
          coffeeCount: 15,
          totalSpent: 75.00,
          regularOrder: 'Small Latte with vanilla syrup',
          joinDate: '2024-01-20',
          lastVisit: '2024-08-21'
        }
      ];
      setCustomers(sampleData);
      localStorage.setItem('cafeCustomers', JSON.stringify(sampleData));
    }

    if (savedPictures) {
      setProfilePictures(JSON.parse(savedPictures));
    }
  }, []);

  // Save to localStorage whenever customers change
  useEffect(() => {
    if (customers.length > 0) {
      localStorage.setItem('cafeCustomers', JSON.stringify(customers));
    }
  }, [customers]);

  // Save profile pictures to localStorage
  useEffect(() => {
    localStorage.setItem('cafeProfilePictures', JSON.stringify(profilePictures));
  }, [profilePictures]);

  const addCustomer = (customerData) => {
    const customer = {
      id: Date.now(),
      ...customerData,
      coffeeCount: 0,
      totalSpent: 0,
      joinDate: new Date().toISOString().split('T')[0],
      lastVisit: null
    };
    setCustomers(prev => [...prev, customer]);
    return customer.id; // Return ID for potential picture assignment
  };

  const addCoffee = (customerId, amount = 5.00) => {
    setCustomers(prev => prev.map(customer => {
      if (customer.id === customerId) {
        return {
          ...customer,
          coffeeCount: customer.coffeeCount + 1,
          totalSpent: customer.totalSpent + amount,
          lastVisit: new Date().toISOString().split('T')[0]
        };
      }
      return customer;
    }));
  };

  const redeemFreeCoffee = (customerId, threshold = 10) => {
    setCustomers(prev => prev.map(customer => {
      if (customer.id === customerId && customer.coffeeCount >= threshold) {
        return {
          ...customer,
          coffeeCount: customer.coffeeCount - threshold,
          lastVisit: new Date().toISOString().split('T')[0]
        };
      }
      return customer;
    }));
  };

  const updateRegularOrder = (customerId, order) => {
    setCustomers(prev => prev.map(customer => {
      if (customer.id === customerId) {
        return { ...customer, regularOrder: order };
      }
      return customer;
    }));
  };

  const removeCustomer = (customerId) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    // Clean up their profile picture too
    setProfilePictures(prev => {
      const updated = { ...prev };
      delete updated[customerId];
      return updated;
    });
  };

  const addProfilePicture = (customerId, imageDataUrl) => {
    setProfilePictures(prev => ({
      ...prev,
      [customerId]: imageDataUrl
    }));
  };

  const removeProfilePicture = (customerId) => {
    setProfilePictures(prev => {
      const updated = { ...prev };
      delete updated[customerId];
      return updated;
    });
  };

  const importCustomersFromCSV = (csvData) => {
    const importedCustomers = csvData.map(row => ({
      id: Date.now() + Math.random(), // Ensure unique IDs
      name: row.name,
      email: row.email,
      regularOrder: row.regularOrder || '',
      coffeeCount: 0,
      totalSpent: 0,
      joinDate: new Date().toISOString().split('T')[0],
      lastVisit: null
    }));

    setCustomers(prev => [...prev, ...importedCustomers]);
    return importedCustomers;
  };

  // Auto-assign pictures based on filename matching
  const autoAssignPictures = (files) => {
    const assignments = [];
    
    files.forEach(file => {
      // Extract name from filename (remove extension and clean up)
      const fileName = file.name.toLowerCase();
      const nameFromFile = fileName
        .replace(/\.[^/.]+$/, '') // Remove extension
        .replace(/[_-]/g, ' ') // Replace underscores/hyphens with spaces
        .replace(/\s+/g, ' ') // Multiple spaces to single space
        .trim();

      // Find matching customer
      const matchingCustomer = customers.find(customer => {
        const customerName = customer.name.toLowerCase();
        
        // Try exact match first
        if (customerName === nameFromFile) return true;
        
        // Try partial matches (first name, last name, or both)
        const customerWords = customerName.split(' ');
        const fileWords = nameFromFile.split(' ');
        
        // Check if all words in filename appear in customer name
        return fileWords.every(word => 
          customerWords.some(customerWord => 
            customerWord.includes(word) || word.includes(customerWord)
          )
        );
      });

      if (matchingCustomer) {
        assignments.push({
          file,
          customer: matchingCustomer,
          fileName: nameFromFile
        });
      }
    });

    return assignments;
  };

  return {
    customers,
    profilePictures,
    addCustomer,
    addCoffee,
    redeemFreeCoffee,
    updateRegularOrder,
    removeCustomer, 
    addProfilePicture,
    removeProfilePicture,
    importCustomersFromCSV,
    autoAssignPictures
  };
};