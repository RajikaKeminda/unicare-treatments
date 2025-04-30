import axios from 'axios';

interface InventoryItem {
  _id: string;
  name: string;
  quantity: number;
  unit: string;
  perItemPrice: number;
  expiryDate: string;
}

export interface ActivityLog {
  action: string;
  itemName: string;
  timestamp: string;
  details: string;
  userId: string;
}

export const generateGeneralReport = async () => {
  try {
    const response = await fetch('http://localhost:8001/api/inventory');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const inventory: InventoryItem[] = await response.json();
    
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Inventory Activity Report - ${currentDate}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 40px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            color: #2c3e50;
          }
          .report-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .report-date {
            color: #7f8c8d;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background-color: #fff;
          }
          th, td {
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd;
          }
          th {
            background-color: #3498db;
            color: white;
          }
          tr:nth-child(even) {
            background-color: #f2f2f2;
          }
          tr:hover {
            background-color: #e9e9e9;
          }
          .warning {
            color: #e74c3c;
            font-weight: bold;
          }
          .summary {
            margin-top: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 5px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #7f8c8d;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="report-title">Inventory Activity Report</div>
          <div class="report-date">Generated on ${currentDate} at ${currentTime}</div>
        </div>

        <div class="summary">
          <h3>Inventory Summary</h3>
          <p>Total Items: ${inventory.length}</p>
          <p>Total Value: Rs ${inventory.reduce((total: number, item: InventoryItem) => total + (item.quantity * item.perItemPrice), 0).toFixed(2)}</p>
          <p>Low Stock Items: ${inventory.filter((item: InventoryItem) => item.quantity <= 5).length}</p>
        </div>

        <h3>Current Inventory</h3>
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Price per Item (Rs)</th>
              <th>Total Value (Rs)</th>
              <th>Expiry Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${inventory.map((item: InventoryItem) => {
              const expiryDate = new Date(item.expiryDate);
              const today = new Date();
              const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              
              let status = '';
              if (daysUntilExpiry < 0) {
                status = '<span class="warning">Expired</span>';
              } else if (daysUntilExpiry <= 7) {
                status = '<span class="warning">Expiring Soon</span>';
              } else if (item.quantity <= 5) {
                status = '<span class="warning">Low Stock</span>';
              } else {
                status = 'Good';
              }

              return `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>${item.unit}</td>
                  <td>${item.perItemPrice}</td>
                  <td>${(item.quantity * item.perItemPrice).toFixed(2)}</td>
                  <td>${new Date(item.expiryDate).toLocaleDateString()}</td>
                  <td>${status}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>This is an automatically generated report. Please verify all information.</p>
          <p>© ${new Date().getFullYear()} Unicare Treatments - Inventory Management System</p>
        </div>
      </body>
      </html>
    `;

    return reportContent;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

export const formatActivityLog = (log: ActivityLog) => {
  return `${new Date(log.timestamp).toLocaleString()} - ${log.action} - ${log.details}`;
}; 