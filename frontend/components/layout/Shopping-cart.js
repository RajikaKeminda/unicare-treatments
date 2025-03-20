'use client';

import { useState, useEffect } from 'react';
import Payment from './payment';  // Import the Payment component

export default function ShoppingCart() {
  const [cart, setCart] = useState([]);
  const [proceedToCheckout, setProceedToCheckout] = useState(false); // State to handle checkout view

  // Load cart from localStorage when component mounts
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  // Remove item from cart
  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity < 1 || isNaN(quantity)) return;  // Prevent quantity below 1 or NaN values
    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity } : item
    );
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
  };
  
  // Get total price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity || 0), 0);
  };

  // Handle Proceed to Checkout button click
  const handleProceedToCheckout = () => {
    setProceedToCheckout(true);  // Show Payment component
  };

  if (proceedToCheckout) {
    return <Payment />;  // Render Payment component if proceeding to checkout
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Shopping Cart</h2>

        <div className="space-y-6">
          {cart.length === 0 ? (
            <p className="text-center text-lg text-gray-600">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item._id} className="flex justify-between items-center border-b py-6 px-4 hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                    className="px-3 py-1 bg-gray-300 rounded-full hover:bg-gray-400 transition-all"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                    className="px-3 py-1 bg-gray-300 rounded-full hover:bg-gray-400 transition-all"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemoveFromCart(item._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="mt-6 flex justify-between items-center">
            <p className="text-2xl font-semibold text-gray-800">Total: ${getTotalPrice().toFixed(2)}</p>
            <button
              onClick={handleProceedToCheckout}  // Handle click to navigate to Payment component
              className="px-8 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}