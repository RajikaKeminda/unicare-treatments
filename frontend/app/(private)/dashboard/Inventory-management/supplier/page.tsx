"use client";

import { useState } from "react";
import { FaSearch, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

// Define the Supplier type
type Supplier = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  category: string;
};

// Mock data for suppliers
const suppliers: Supplier[] = [
  {
    id: 1,
    name: "Tech Supplies Inc.",
    email: "tech@supplies.com",
    phone: "+1 (123) 456-7890",
    address: "123 Tech Street, Silicon Valley, CA",
    category: "Electronics",
  },
  {
    id: 2,
    name: "Green Farms Co.",
    email: "green@farms.com",
    phone: "+1 (234) 567-8901",
    address: "456 Green Lane, Austin, TX",
    category: "Agriculture",
  },
  {
    id: 3,
    name: "MediCare Supplies",
    email: "info@medicare.com",
    phone: "+1 (345) 678-9012",
    address: "789 Health Blvd, Boston, MA",
    category: "Medical",
  },
];

const SupplierContactPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [message, setMessage] = useState("");

  // Filter suppliers based on search query
  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle sending a message
  const handleSendMessage = () => {
    if (selectedSupplier && message.trim()) {
      alert(`Message sent to ${selectedSupplier.name}: ${message}`);
      setMessage("");
      setSelectedSupplier(null);
    } else {
      alert("Please select a supplier and enter a message.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Heading */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Supplier Contact
        </h1>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 rounded-lg bg-transparent focus:outline-none"
            />
            <FaSearch className="text-gray-500 mx-4" />
          </div>
        </div>

        {/* Supplier List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => setSelectedSupplier(supplier)}
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {supplier.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                <FaEnvelope className="inline mr-2" />
                {supplier.email}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                <FaPhone className="inline mr-2" />
                {supplier.phone}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <FaMapMarkerAlt className="inline mr-2" />
                {supplier.address}
              </p>
              <span className="inline-block mt-3 px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full">
                {supplier.category}
              </span>
            </div>
          ))}
        </div>

        {/* Message Modal */}
        {selectedSupplier && (
          <div className="fixed inset-0 z-[999] bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Send Message to {selectedSupplier.name}
              </h2>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none"
                rows={4}
              />
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedSupplier(null)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierContactPage;