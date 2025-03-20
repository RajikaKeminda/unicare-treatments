"use client";

import Image from 'next/image';
import { useRouter } from "next/navigation";
import { FaWarehouse } from "react-icons/fa"; // Importing the icons

const InventoryManagementPage = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div>
      <div className="min-h-screen bg-white dark:bg-gray-900 p-6 mt-8">
        {/* Heading Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center space-x-2">
            <FaWarehouse className="text-4xl text-gray-800 dark:text-gray-100" /> {/* React Icon */}
            <span>Inventory Management</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Manage your inventory and supplier contacts with ease and efficiency
          </p>
        </div>

        <div className="max-w-6xl w-full mx-auto">
          {/* Inventory Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Inventory Management Section */}
            <div className="group cursor-pointer relative rounded-lg shadow-lg overflow-hidden border-2 border-gray-900 dark:border-gray-600 h-96">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-4 mt-3">Inventory Management</h2>
              <div
                onClick={() => handleNavigation("/dashboard/Inventory-management/Inventory-see")}
                className="relative group h-64"
              >
                <Image
                  src="/inventory.png" // Correct path to the public folder
                  alt="Inventory Management"
                  width={100}
                  height={100}
                  unoptimized
                  className="w-full h-full object-cover border-t-2 border-b-2 border-gray-900 dark:border-gray-600"
                />
                {/* Hover Effect: Text appears when hovering over the image */}
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-2xl font-bold">Manage Inventory</span>
                </div>
              </div>
              <div className="mt-2 text-center text-gray-600 dark:text-gray-400">
                <p>View and manage your inventory. Click here to access inventory details.</p>
              </div>
            </div>

            {/* Supplier Contact Section */}
            <div className="group cursor-pointer relative rounded-lg shadow-lg overflow-hidden border-2 border-gray-900 dark:border-gray-600 h-96">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-4 mt-3">Supplier Contact</h2>
              <div
                onClick={() => handleNavigation("/dashboard/Inventory-management/supplier")} // Corrected path
                className="relative group h-64"
              >
                <Image
                  src="/supplier.png" // Correct path to the public folder
                  alt="Supplier Contact"
                  width={100}
                  height={100}
                  unoptimized
                  className="w-full h-full object-cover border-t-2 border-b-2 border-gray-900 dark:border-gray-600"
                />
                {/* Hover Effect: Text appears when hovering over the image */}
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-2xl font-bold">Contact Suppliers</span>
                </div>
              </div>
              <div className="mt-2 text-center text-gray-600 dark:text-gray-400">
                <p>Manage and contact your suppliers. Click here to view supplier details.</p>
              </div>
            </div>

            {/* AI Query Section */}
            <div className="group cursor-pointer relative rounded-lg shadow-lg overflow-hidden border-2 border-gray-900 dark:border-gray-600 h-96">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-4 mt-3">Ask AI</h2>
              <div
                onClick={() => handleNavigation("/dashboard/Inventory-management/ai-help")}
                className="relative group h-64"
              >
                <Image
                  src="/ai-inventory.png" // Correct path to the public folder
                  alt="AI Query"
                  width={100}
                  height={100}
                  unoptimized
                  className="w-full h-full object-cover border-t-2 border-b-2 border-gray-900 dark:border-gray-600"
                />
                {/* Hover Effect: Text appears when hovering over the image */}
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-2xl font-bold">Ask AI</span>
                </div>
              </div>
              <div className="mt-2 text-center text-gray-600 dark:text-gray-400">
                <p>Get AI-powered insights and answers about your inventory. Click here to ask AI.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagementPage;
