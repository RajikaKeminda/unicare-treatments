"use client";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { generateGeneralReport } from "./Inventory-see/services/reportService";
import ReportModal from "./Inventory-see/components/ReportModal";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/inventory`; // Fixed API URL

interface InventoryItem {
  _id: string;
  name: string;
  quantity: number;
  unit: string;
  perItemPrice: number;
  expiryDate: string;
}

interface NewItem {
  name: string;
  quantity: number;
  unit: string;
  perItemPrice: number;
  expiryDate: string;
}

export default function InventoryManager() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [removedProducts, setRemovedProducts] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState<NewItem>({
    name: "",
    quantity: 1,
    unit: "bottles",
    perItemPrice: 1,
    expiryDate: "",
  });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showChart, setShowChart] = useState<boolean>(false); // State to toggle chart visibility
  const [showExpiringSoon, setShowExpiringSoon] = useState<boolean>(false); // State to toggle expiring soon view
  const [showLowStock, setShowLowStock] = useState<boolean>(false); // State to toggle low stock view
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

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
    if (
      !newItem.name ||
      newItem.quantity <= 0 ||
      newItem.perItemPrice <= 0 ||
      !newItem.expiryDate
    ) {
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
      setNewItem({
        name: "",
        quantity: 1,
        unit: "bottles",
        perItemPrice: 1,
        expiryDate: "",
      });
      setShowModal(false);
    } catch (error) {
      console.error("Error adding item:", error);
      alert("An error occurred while adding the item. Please try again.");
    }
  };

  // 📌 Update quantity in backend
  const updateQuantity = async (itemId: string, change: number) => {
    try {
      // Find the current item from inventory
      const item = inventory.find((item) => item._id === itemId);

      if (!item) {
        alert("Item not found.");
        return;
      }

      // Calculate the new quantity
      const newQuantity = item.quantity + change;

      // Ensure the quantity doesn't go below 0
      if (newQuantity < 0) {
        alert("Quantity cannot be less than 0.");
        return;
      }

      // Send PUT request to backend to update the quantity
      const response = await fetch(`${API_URL}/${itemId}`, {
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
  const deleteItem = async (id: string) => {
    try {
      // Find the item being deleted
      const deletedItem = inventory.find((item) => item._id === id);

      // If the item is found, add it to removedProducts before deletion
      if (deletedItem) {
        setRemovedProducts((prevRemoved) => {
          const updatedRemovedProducts = [...prevRemoved, deletedItem];
          console.log("Updated Removed Products:", updatedRemovedProducts); // Log removed items
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
  const isExpired = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  // 📌 Check if the date is expiring soon (within 7 days)
  const isExpiringSoon = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const timeDifference = expiry.getTime() - today.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysDifference <= 7 && daysDifference >= 0;
  };

  // 📌 Check if the item is low in stock (quantity <= 5)
  const isLowStock = (quantity: number) => {
    return quantity <= 5;
  };

  // 📌 Generate report
  // const generateHTMLReport = () => {
  //   const currentDate = new Date().toLocaleDateString();

  //   const reportContent = `
  //     <html>
  //     <head>
  //       <title>Inventory Report - ${currentDate}</title>
  //       <style>
  //         body { font-family: Arial, sans-serif; }
  //         .report-header { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
  //         .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
  //         .table th, .table td { padding: 10px; text-align: left; border: 1px solid #ddd; }
  //         .table th { background-color: #f2f2f2; }
  //         .table td { font-size: 14px; }
  //         .footer { margin-top: 20px; text-align: center; font-size: 12px; }
  //         .expiredIcon { color: red; font-size: 18px; }
  //       </style>
  //     </head>
  //     <body>
  //       <div class="report-header">Inventory Report - ${currentDate}</div>
        
  //       <h3>Current Inventory:</h3>
  //       <table class="table">
  //         <thead>
  //           <tr>
  //             <th>Item</th>
  //             <th>Quantity</th>
  //             <th>Price per Item (Rs)</th>
  //             <th>Total Price (Rs)</th>
  //             <th>Unit</th>
  //             <th>Expiry Date</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           ${inventory
  //             .map(
  //               (item) => `
  //             <tr>
  //               <td>${item.name}</td>
  //               <td>${item.quantity}</td>
  //               <td>Rs ${item.perItemPrice}</td>
  //               <td>Rs ${item.quantity * item.perItemPrice}</td>
  //               <td>${item.unit}</td>
  //               <td>
  //                 ${item.expiryDate}
  //                 ${isExpired(item.expiryDate) ? '<span class="expiredIcon">⚠️</span>' : ""}
  //               </td>
  //             </tr>
  //           `
  //             )
  //             .join("")}
  //         </tbody>
  //       </table>
  
  //       <h3>Removed Products:</h3>
  //       <table class="table">
  //         <thead>
  //           <tr>
  //             <th>Item</th>
  //             <th>Quantity</th>
  //             <th>Price per Item (Rs)</th>
  //             <th>Total Price (Rs)</th>
  //             <th>Unit</th>
  //             <th>Expiry Date</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           ${
  //             removedProducts.length > 0
  //               ? removedProducts
  //                   .map(
  //                     (item) => `
  //                 <tr>
  //                   <td>${item.name}</td>
  //                   <td>${item.quantity}</td>
  //                   <td>Rs ${item.perItemPrice}</td>
  //                   <td>Rs ${item.quantity * item.perItemPrice}</td>
  //                   <td>${item.unit}</td>
  //                   <td>
  //                     ${item.expiryDate}
  //                     ${isExpired(item.expiryDate) ? '<span class="expiredIcon">⚠️</span>' : ""}
  //                   </td>
  //                 </tr>
  //               `
  //                   )
  //                   .join("")
  //               : `<tr><td colspan="6">No removed items</td></tr>`
  //           }
  //         </tbody>
  //       </table>
        
  //       <div class="footer">Generated on ${currentDate}</div>
  //     </body>
  //   </html>
  //   `;

  //   const blob = new Blob([reportContent], { type: "text/html" });
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = `inventory_report_${currentDate}.html`;
  //   link.click();
  // };

  // 📌 Prepare data for the chart
  const chartData = {
    labels: inventory.map((item) => item.name),
    datasets: [
      {
        label: "Quantity",
        data: inventory.map((item) => item.quantity),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const, // Explicitly set to "top"
      },
      title: {
        display: true,
        text: "Inventory Quantity Analysis",
      },
    },
  };

  // 📌 Filter inventory for expiring soon items
  const expiringSoonItems = inventory.filter((item) => isExpiringSoon(item.expiryDate));

  // 📌 Filter inventory for low stock items (excluding expired items)
  const lowStockItems = inventory.filter(
    (item) => isLowStock(item.quantity) && !isExpired(item.expiryDate)
  );

  // 📌 Filter inventory based on search query
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerateGeneralReport = async () => {
    try {
      setLoading(true);
      const htmlContent = await generateGeneralReport();
      
      // Create a blob with HTML content
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setIsReportModalOpen(false);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSmartReport = async (fromDate: string, toDate: string) => {
    try {
      setLoading(true);
      
      // Filter inventory items based on date range
      const filteredInventory = inventory.filter(item => {
        const itemDate = new Date(item.expiryDate);
        const from = new Date(fromDate);
        const to = new Date(toDate);
        return itemDate >= from && itemDate <= to;
      });

      // Generate HTML report for filtered items
      const reportContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Smart Inventory Report - ${fromDate} to ${toDate}</title>
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
            <div class="report-title">Smart Inventory Report</div>
            <div class="report-date">Date Range: ${fromDate} to ${toDate}</div>
          </div>

          <div class="summary">
            <h3>Report Summary</h3>
            <p>Total Items in Range: ${filteredInventory.length}</p>
            <p>Total Value: Rs ${filteredInventory.reduce((total, item) => total + (item.quantity * item.perItemPrice), 0).toFixed(2)}</p>
            <p>Items Expiring Soon: ${filteredInventory.filter(item => isExpiringSoon(item.expiryDate)).length}</p>
            <p>Low Stock Items: ${filteredInventory.filter(item => isLowStock(item.quantity)).length}</p>
          </div>

          <h3>Filtered Inventory</h3>
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
              ${filteredInventory.map(item => {
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

      // Create a blob with HTML content
      const blob = new Blob([reportContent], { type: 'text/html;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smart-inventory-report-${fromDate}-to-${toDate}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setIsReportModalOpen(false);
    } catch (error) {
      console.error('Error generating smart report:', error);
      alert('Failed to generate smart report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Products</h2>

      {/* Search Bar */}
      <div className="mb-4 flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search product by name..."
          className="border border-gray-300 rounded-md p-2 w-full max-w-md"
        />
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          onClick={() => setShowModal(true)}
        >
          Add Item
        </button>
        <button
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
          onClick={() => setIsReportModalOpen(true)}
        >
          Generate Report
        </button>
        <button
          className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600"
          onClick={() => setShowChart(!showChart)}
        >
          {showChart ? "Hide Chart" : "Show Chart"}
        </button>
        <button
          className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600"
          onClick={() => setShowExpiringSoon(!showExpiringSoon)}
        >
          {showExpiringSoon ? "Show All Products" : "Show Expiring Soon"}
        </button>
        <button
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          onClick={() => setShowLowStock(!showLowStock)}
        >
          {showLowStock ? "Show All Products" : "Show Low Stock"}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[999] bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Add New Item</h2>
            <h5>Item name</h5>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) =>
                setNewItem({ ...newItem, name: e.target.value })
              }
              placeholder="Item Name"
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
            />
            <h5>Quantity</h5>
            <input
              type="number"
              value={newItem.quantity || ""}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  quantity: Math.max(1, Number(e.target.value) || 1),
                })
              }
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
              placeholder="Quantity"
            />
            <h5>Price</h5>
            <input
              type="number"
              value={newItem.perItemPrice || ""}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  perItemPrice: Math.max(1, Number(e.target.value) || 1),
                })
              }
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
              placeholder="Price per Item (Rs)"
            />
            <h5>Expire date</h5>
            <input
              type="date"
              value={newItem.expiryDate}
              onChange={(e) => {
                const selectedDate = e.target.value;
                const today = new Date().toISOString().split("T")[0];
                
                if (selectedDate < today) {
                  alert("Please set the expiry date to a date after today.");
                  return;
                }

                setNewItem({ ...newItem, expiryDate: selectedDate });
              }}
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

      {showChart && (
        <div className="mt-8">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
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
              {(showExpiringSoon
                ? expiringSoonItems
                : showLowStock
                ? lowStockItems
                : filteredInventory
              ).map((item) => (
                <tr
                  key={item._id}
                  className={
                    isExpiringSoon(item.expiryDate)
                      ? "bg-yellow-100"
                      : isLowStock(item.quantity)
                      ? "bg-red-100"
                      : ""
                  }
                >
                  <td className="border px-4 py-2">{item.name}</td>
                  <td className="border px-4 py-2">{item.quantity}</td>
                  <td className="border px-4 py-2">{item.unit}</td>
                  <td className="border px-4 py-2">{item.perItemPrice}</td>
                  <td className="border px-4 py-2">
                    {item.expiryDate} {isExpired(item.expiryDate) && "⚠️"}
                  </td>
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
        </div>
      )}

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onGenerateGeneralReport={handleGenerateGeneralReport}
        onGenerateSmartReport={handleGenerateSmartReport}
      />
    </div>
  );
}