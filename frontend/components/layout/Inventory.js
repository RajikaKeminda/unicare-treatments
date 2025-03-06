"use client";
import { useState } from "react";
import "@/app/Inventory/Inventory.css";

const initialInventory = [
  { id: 1, name: "Ashwagandha", quantity: 100, unit: "bottles", perItemPrice: 350, expiryDate: "2025-05-01" },
  { id: 2, name: "Brahmi", quantity: 50, unit: "bottles", perItemPrice: 250, expiryDate: "2025-06-01" },
  { id: 3, name: "Turmeric", quantity: 200, unit: "grams", perItemPrice: 120, expiryDate: "2025-08-01" }
];

export default function InventoryManager() {
  const [inventory, setInventory] = useState(initialInventory);
  const [removedProducts, setRemovedProducts] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: 1, unit: "bottles", perItemPrice: 1, expiryDate: "" });
  const [showModal, setShowModal] = useState(false);
  const [idCounter, setIdCounter] = useState(initialInventory.length + 1);

  const addItem = () => {
    if (!newItem.name || newItem.quantity <= 0 || newItem.perItemPrice <= 0 || !newItem.expiryDate) {
      alert("Please fill out all fields correctly.");
      return;
    }
    const newId = idCounter;
    const productPrice = newItem.quantity * newItem.perItemPrice;
    setInventory([...inventory, { ...newItem, id: newId, price: productPrice }]);
    setNewItem({ name: "", quantity: 1, unit: "bottles", perItemPrice: 1, expiryDate: "" });
    setIdCounter(idCounter + 1);
    setShowModal(false);
  };

  const updateQuantity = (id, amount) => {
    setInventory(inventory.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(0, item.quantity + amount), price: (Math.max(0, item.quantity + amount) * item.perItemPrice) }
        : item
    ));
  };

  const deleteItem = (id) => {
    const deletedItem = inventory.find(item => item.id === id);
    setInventory(inventory.filter(item => item.id !== id));
    setRemovedProducts([...removedProducts, deletedItem]);
  };

  const generateHTMLReport = () => {
    const currentDate = new Date().toLocaleDateString();

    let reportContent = `
      <html>
        <head>
          <title>Inventory Report - ${currentDate}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .report-header { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .table th, .table td { padding: 10px; text-align: left; border: 1px solid #ddd; }
            .table th { background-color: #f2f2f2; }
            .table td { font-size: 14px; }
            .footer { margin-top: 20px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="report-header">Inventory Report - ${currentDate}</div>
          
          <h3>Current Inventory:</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price per Item (Rs)</th>
                <th>Total Price (Rs)</th>
                <th>Unit</th>
                <th>Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              ${inventory.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>Rs ${item.perItemPrice}</td>
                  <td>Rs ${item.quantity * item.perItemPrice}</td>
                  <td>${item.unit}</td>
                  <td>${item.expiryDate}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h3>Removed Products:</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price per Item (Rs)</th>
                <th>Total Price (Rs)</th>
                <th>Unit</th>
                <th>Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              ${removedProducts.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>Rs ${item.perItemPrice}</td>
                  <td>Rs ${item.quantity * item.perItemPrice}</td>
                  <td>${item.unit}</td>
                  <td>${item.expiryDate}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">Generated on ${currentDate}</div>
        </body>
      </html>
    `;

    const blob = new Blob([reportContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inventory_report_${currentDate}.html`;
    link.click();
  };

  const isExpired = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  return (
    <div className="container">
      <h2 className="productsTitle">Products</h2>

      <button className="addButton" onClick={() => setShowModal(true)}>Add Item</button>
      <button className="reportButton" onClick={generateHTMLReport}>Generate Report</button>

      {showModal && (
        <div className="modal">
          <div className="modalContent">
            <h2 style={{ fontWeight: 'bold', color: 'black' }}>Add New Item</h2>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Item Name"
              className="inputField"
            />
            <div className="quantityPriceWrapper">
              <div className="field">
                <label>Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: Math.max(1, parseInt(e.target.value)) })}
                  className="inputField"
                  placeholder="Quantity"
                />
              </div>
              <div className="field">
                <label>Price per Item</label>
                <input
                  type="number"
                  min="1"
                  value={newItem.perItemPrice}
                  onChange={(e) => setNewItem({ ...newItem, perItemPrice: Math.max(1, parseFloat(e.target.value)) })}
                  className="inputField"
                  placeholder="Price per Item"
                />
              </div>
            </div>
            <div className="unitField">
              <label>Unit</label>
              <select
                value={newItem.unit}
                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                className="inputField"
              >
                <option value="bottles">Bottles</option>
                <option value="grams">Grams</option>
                <option value="packs">Packs</option>
              </select>
            </div>
            <div className="field">
              <label>Expiry Date</label>
              <input
                type="date"
                value={newItem.expiryDate}
                onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                className="inputField"
              />
            </div>
            <button onClick={addItem} className="confirmButton">Add Item</button>
            <button className="closeButton" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}

      <div className="inventoryTable">
        <h3 className="tableTitle">Inventory List</h3>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Per Item Price (Rs)</th>
              <th>Product Price (Rs)</th>
              <th>Unit</th>
              <th>Expiry Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>Rs {item.perItemPrice}</td>
                <td>Rs {item.quantity * item.perItemPrice}</td>

                <td>{item.unit}</td>
                <td>{isExpired(item.expiryDate) && <span className="expiredIcon">⚠️</span>} {item.expiryDate}</td>
                <td>
                  <button onClick={() => updateQuantity(item.id, 1)} className="quantityButton">+</button>
                  <button onClick={() => updateQuantity(item.id, -1)} className="quantityButton">-</button>
                  <button onClick={() => deleteItem(item.id)} className="deleteButton">Remove Item</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
