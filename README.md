# School Cafe Loyalty System

A React-based customer loyalty card application for managing cafe customers, tracking coffee purchases, and handling rewards.

## Features

- **Customer Management**: Add and search customers with contact information
- **Loyalty Tracking**: Track coffee purchases with visual progress indicators
- **Rewards System**: Automatic free coffee eligibility after 10 purchases
- **Regular Orders**: Save and display customer's preferred orders
- **Responsive Design**: Works on desktop and mobile devices
- **Data Persistence**: Uses localStorage to save customer data

## Setup Instructions

### 1. Create the Project
```bash
npm create vite@latest cafe-loyalty-app -- --template react
cd cafe-loyalty-app
```

### 2. Install Dependencies
```bash
npm install
npm install lucide-react
```

### 3. Replace Default Files
Copy all the provided files into their respective locations:

**Project Structure:**
```
cafe-loyalty-app/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Navigation.jsx
│   │   ├── SearchBar.jsx
│   │   ├── CustomerList.jsx
│   │   ├── CustomerCard.jsx
│   │   ├── CustomerModal.jsx
│   │   ├── AddCustomerModal.jsx
│   │   └── RewardsList.jsx
│   ├── hooks/
│   │   └── useCustomers.js
│   ├── styles/
│   │   ├── index.css
│   │   ├── components.css
│   │   └── App.css
│   └── utils/
│       └── constants.js
```

### 4. Development
```bash
npm run dev
```

### 5. Production Build
```bash
npm run build
```

## Deployment

### To Web Server
1. Run `npm run build`
2. Copy the contents of the `dist/` folder to your web server
3. Configure your web server to serve `index.html` for all routes

### Configuration
- **Loyalty Threshold**: Edit `LOYALTY_THRESHOLD` in `src/utils/constants.js` (default: 10 coffees)
- **Coffee Price**: Edit `COFFEE_PRICE` in `src/utils/constants.js` (default: $5.00)

## Usage

### For Cafe Staff
1. **Search Customers**: Use the search bar to find existing customers
2. **Add New Customer**: Click "Add Customer" button to register new customers
3. **Track Purchases**: Click on any customer to add coffee purchases
4. **Manage Rewards**: Use the "Ready for Reward" tab to see customers eligible for free coffee
5. **Regular Orders**: Save customer preferences in their profile

### Customer Actions
- **Add Coffee**: Records a purchase and updates loyalty progress
- **Redeem Reward**: Gives free coffee and resets loyalty counter
- **Update Regular Order**: Save customer's preferred drink

## Technical Details

- **Framework**: React 18 with Vite
- **Icons**: Lucide React
- **Styling**: Custom CSS (no external frameworks)
- **Storage**: Browser localStorage
- **Responsive**: Mobile-first design

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License
MIT License - Free for educational and commercial use.