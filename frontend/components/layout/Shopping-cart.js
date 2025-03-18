'use client';

import { useState, useEffect } from 'react';

export default function ShoppingCart() {
  const [cart, setCart] = useState([]);

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

  // Update item quantity in cart
  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity < 1) return;  // Prevent quantity below 1
    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity } : item
    );
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

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
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 focus:outline-none"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 focus:outline-none"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemoveFromCart(item._id)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="flex justify-between items-center mt-6">
            <p className="text-xl font-semibold text-gray-800">Total: ${getTotalPrice().toFixed(2)}</p>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none">
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
