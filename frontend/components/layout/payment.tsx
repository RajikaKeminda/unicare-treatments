'use client';

import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface FormData {
  name: string;
  address: string;
  paymentMethod: 'credit_card' | 'paypal' | 'cash_on_delivery';
}

interface ApiError {
  message?: string;
  // Add other possible error response properties here if needed
}

export default function Payment() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    paymentMethod: 'credit_card',
  });
  const router = useRouter();

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[];
    setCart(savedCart);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePlaceOrder = async () => {
    if (!formData.name.trim() || !formData.address.trim()) {
      setError('Name and address are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderPromises = cart.map((item) =>
        axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/orders`, {
          productId: item._id,
          name: formData.name,
          address: formData.address,
          quantity: item.quantity,
          paymentMethod: formData.paymentMethod,
          totalPrice: item.price * item.quantity,
          status: 'pending',
        })
      );

      await Promise.all(orderPromises);
      localStorage.removeItem('cart');
      router.push('/products/order-see');
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      console.error('Order failed:', error);
      setError(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Items</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between py-4 border-b">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="flex justify-between mt-4 font-bold">
                <p>Total:</p>
                <p>${totalPrice.toFixed(2)}</p>
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Shipping & Payment</h2>
            {error && <p className="text-red-500">{error}</p>}

            <div>
              <label className="block mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Shipping Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block mb-1">Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="cash_on_delivery">Cash on Delivery</option>
              </select>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`w-full py-3 mt-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Placing Orders...' : 'Place Order'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}