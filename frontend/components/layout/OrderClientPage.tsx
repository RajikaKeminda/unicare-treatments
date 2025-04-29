'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, CheckCircle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  category?: string;
}

export default function OrderPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    quantity: 1,
    paymentMethod: 'credit_card'
  });

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`);
        setProduct(res.data.product);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/orders`, {
        productId: id,
        ...formData,
        totalPrice: product ? product.price * formData.quantity : 0
      });
      setOrderSuccess(true);
      setTimeout(() => router.push('/'), 3000);
    } catch (error) {
      alert('Order failed! Please try again.' + error);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="animate-spin h-8 w-8 text-red-500" />
    </div>
  );

  if (orderSuccess) return (
    <div className="text-center mt-20">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
      <h1 className="text-2xl font-bold mt-4">Order Placed Successfully!</h1>
      <p>Redirecting to homepage...</p>
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-4">
      <Link href={`/products/${id}`} className="flex items-center text-gray-600 mb-6">
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Product
      </Link>

      <h1 className="text-2xl font-bold mb-6">Order Processing</h1>
      
      {product && (
        <div className="mb-6 p-4 border rounded-lg">
          <h2 className="font-semibold">{product.name}</h2>
          <p>Price: ${product.price.toFixed(2)}</p>
          <div className="mt-2">
            <label className="block mb-1">Quantity:</label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({
                ...formData, 
                quantity: Math.max(1, parseInt(e.target.value) || 1)
              })}
              className="border p-2 rounded w-20"
            />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Full Name*</label>
          <input
            type="text"
            required
            className="w-full border p-2 rounded"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div>
          <label className="block mb-1">Shipping Address*</label>
          <textarea
            required
            className="w-full border p-2 rounded"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
          />
        </div>

        <div>
          <label className="block mb-1">Payment Method*</label>
          <select
            className="w-full border p-2 rounded"
            value={formData.paymentMethod}
            onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
          >
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="cash_on_delivery">Cash on Delivery</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:bg-gray-400"
          disabled={!product}
        >
          {product ? 'Confirm Order' : 'Loading...'}
        </button>
      </form>
    </div>
  );
}