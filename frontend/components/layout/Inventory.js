"use client";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:8082/api/inventory"; // Backend API

export default function InventoryManager() {
  const [inventory, setInventory] = useState([]);
  const [removedProducts, setRemovedProducts] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: 1, unit: "bottles", perItemPrice: 1, expiryDate: "" });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // 📌 Fetch inventory from backend on component mount
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  // 📌 Add new item to backend
  const addItem = async () => {
    if (!newItem.name || newItem.quantity <= 0 || newItem.perItemPrice <= 0 || !newItem.expiryDate) {
      alert("Please fill out all fields correctly.");
      return;
    }

    try {
      console.log("Sending POST request to:", API_URL); // Log the URL
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        throw new Error(`Failed to add item. Status: ${response.status}`);
      }

      const addedItem = await response.json();
      setInventory([...inventory, addedItem]);
      setNewItem({ name: "", quantity: 1, unit: "bottles", perItemPrice: 1, expiryDate: "" });
      setShowModal(false);
    } catch (error) {
      console.error("Error adding item:", error);
      alert("An error occurred while adding the item. Please try again.");
    }
  };

  // 📌 Update quantity in backend
  const updateQuantity = async (itemId, change) => {
    try {
      // Find the current item from inventory
      const item = inventory.find((item) => item._id === itemId);
      
      // Calculate the new quantity
      const newQuantity = item.quantity + change;
  
      // Ensure the quantity doesn't go below 0
      if (newQuantity < 0) {
        alert("Quantity cannot be less than 0.");
        return;
      }
  
      // Send PUT request to backend to update the quantity
      const response = await fetch(`http://localhost:8082/api/inventory/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }
  
      const updatedItem = await response.json();
      console.log("Updated item:", updatedItem);
  
      // Update the inventory state
      setInventory((prevInventory) =>
        prevInventory.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };
  
  // 📌 Delete item from backend
  const deleteItem = async (id) => {
    try {
      // Find the item being deleted
      const deletedItem = inventory.find((item) => item._id === id);
      
      // If the item is found, add it to removedProducts before deletion
      if (deletedItem) {
        setRemovedProducts((prevRemoved) => {
          const updatedRemovedProducts = [...prevRemoved, deletedItem];
          console.log("Updated Removed Products:", updatedRemovedProducts);  // Log removed items
          return updatedRemovedProducts;
        });
      }
  
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  
      if (!response.ok) throw new Error("Failed to delete item");
  
      // Remove the item from the inventory
      setInventory(inventory.filter((item) => item._id !== id));
  
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  

  // 📌 Check if the date is expired
  const isExpired = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  // 📌 Generate report
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
          .expiredIcon { color: red; font-size: 18px; }
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
                <td>
                  ${item.expiryDate}
                  ${isExpired(item.expiryDate) ? '<span class="expiredIcon">⚠️</span>' : ''}
                </td>
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
            ${removedProducts.length > 0 ? removedProducts.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>Rs ${item.perItemPrice}</td>
                <td>Rs ${item.quantity * item.perItemPrice}</td>
                <td>${item.unit}</td>
                <td>
                  ${item.expiryDate}
                  ${isExpired(item.expiryDate) ? '<span class="expiredIcon">⚠️</span>' : ''}
                </td>
              </tr>
            `).join('') : `<tr><td colspan="6">No removed items</td></tr>`}
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
  

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Products</h2>

      <div className="mb-4">
        <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600" onClick={() => setShowModal(true)}>Add Item</button>
        <button className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 ml-4" onClick={generateHTMLReport}>Generate Report</button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Add New Item</h2>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Item Name"
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
            />
            <input
              type="number"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: Math.max(1, parseInt(e.target.value)) })}
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
              placeholder="Quantity"
            />
            <input
              type="number"
              value={newItem.perItemPrice}
              onChange={(e) => setNewItem({ ...newItem, perItemPrice: Math.max(1, parseFloat(e.target.value)) })}
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
              placeholder="Price per Item (Rs)"
            />
            <input
              type="date"
              value={newItem.expiryDate}
              onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
            />

            <div className="flex justify-between mt-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                onClick={addItem}
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table-auto w-full border-collapse mt-4">
          <thead>
            <tr>
              <th className="border px-4 py-2">Item Name</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Unit</th>
              <th className="border px-4 py-2">Price per Item (Rs)</th>
              <th className="border px-4 py-2">Expiry Date</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item._id}>
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">{item.quantity}</td>
                <td className="border px-4 py-2">{item.unit}</td>
                <td className="border px-4 py-2">{item.perItemPrice}</td>
                <td className="border px-4 py-2">{item.expiryDate}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 mr-2"
                    onClick={() => updateQuantity(item._id, 1)}
                  >
                    +
                  </button>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 mr-2"
                    onClick={() => updateQuantity(item._id, -1)}
                  >
                    -
                  </button>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                    onClick={() => deleteItem(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

