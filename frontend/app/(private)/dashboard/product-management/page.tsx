"use client";

//import React, { useState } from "react";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { FaBox } from "react-icons/fa"; // Importing the icons
const ProductOptionsPage = () => {
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
            <FaBox className="text-4xl text-gray-800 dark:text-gray-100" /> {/* React Icon */}
            <span>Product Management</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Manage your products with ease and efficiency
          </p>
        </div>

        <div className="max-w-4xl w-full mx-auto">
          {/* Product Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Add Product Section */}
            <div className="group cursor-pointer relative rounded-lg shadow-lg overflow-hidden border-2 border-gray-900 dark:border-gray-600">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-4 mt-3">Add Product</h2>
              <div
                onClick={() => handleNavigation("/dashboard/product-management/product-add")}
                className="relative group"
              >
                <Image
                  src="/product-see.png"
                  alt="Add Product"
                  width={100}
                  height={100}
                  unoptimized
                  className="w-full h-full object-cover border-t-2 border-b-2 border-gray-900 dark:border-gray-600"
                />
                {/* Hover Effect: Text appears when hovering over the image */}
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-2xl font-bold">Add Product</span>
                </div>
              </div>
              <div className="mt-4 p-4 text-center text-gray-600 dark:text-gray-400">
                <p>Add a new product to the store. Click here to start adding your products.</p>
              </div>
            </div>

            {/* All Products Section */}
            <div className="group cursor-pointer relative rounded-lg shadow-lg overflow-hidden border-2 border-gray-900 dark:border-gray-600">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-4 mt-3">All Products</h2>
              <div
                onClick={() => handleNavigation("/dashboard/product-management/product-see")}
                className="relative group"
              >
                <Image
                  src="/see-products.png"
                  alt="See All Products"
                  width={100}
                  height={100}
                  unoptimized
                  className="w-full h-full object-cover border-t-2 border-b-2 border-gray-900 dark:border-gray-600"
                />
                {/* Hover Effect: Text appears when hovering over the image */}
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-2xl font-bold">All Products</span>
                </div>
              </div>
              <div className="mt-4 p-4 text-center text-gray-600 dark:text-gray-400">
                <p>View and manage all available products in the store. Click here to see the product list.</p>
              </div>
            </div>
          </div>

          {/* Admin Side Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => handleNavigation("/products/product-view")}
              className="bg-red-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-red-800 transition duration-300"
            >
              User Side View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOptionsPage;