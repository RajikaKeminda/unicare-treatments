'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, CheckCircle, ChevronLeft, CreditCard, Truck, Wallet, Lock, Shield, } from 'lucide-react';
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
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Loader2 className="animate-spin h-12 w-12 text-red-500" />
    </div>
  );

  if (orderSuccess) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mt-6 text-gray-900">Order Placed Successfully!</h1>
        <p className="mt-2 text-gray-600">Thank you for your purchase. You&apos;ll receive a confirmation email shortly.</p>
        <div className="mt-8 animate-pulse text-sm text-gray-500">
          Redirecting to homepage...
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href={`/products/${id}`} className="flex items-center text-red-600 hover:text-red-700 mb-8">
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span className="font-medium">Back to Product</span>
        </Link>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Order</h1>
            <p className="text-gray-600 mb-6">Fill in your details to complete the purchase</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                {product && (
                  <div className="border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-4">
                      {product.image && (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-gray-600 text-sm">{product.description}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="text-gray-700 mr-2">Qty:</span>
                            <input
                              type="number"
                              min="1"
                              value={formData.quantity}
                              onChange={(e) => setFormData({
                                ...formData, 
                                quantity: Math.max(1, parseInt(e.target.value) || 1)
                              })}
                              className="border border-gray-300 p-1 rounded w-16 text-center"
                            />
                          </div>
                          <span className="font-semibold text-red-600">
                            ${(product.price * formData.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      {product ? `$${(product.price * formData.quantity).toFixed(2)}` : '$0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-red-600">
                      {product ? `$${(product.price * formData.quantity).toFixed(2)}` : '$0.00'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address*</label>
                    <textarea
                      required
                      rows={3}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="123 Main St, City, Country"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method*</label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="credit_card"
                          type="radio"
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                          value="credit_card"
                          checked={formData.paymentMethod === 'credit_card'}
                          onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                        />
                        <label htmlFor="credit_card" className="ml-3 flex items-center">
                          <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                          <span className="block text-sm text-gray-700">Credit Card</span>
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="paypal"
                          type="radio"
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                          value="paypal"
                          checked={formData.paymentMethod === 'paypal'}
                          onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                        />
                        <label htmlFor="paypal" className="ml-3 flex items-center">
                          <Wallet className="h-5 w-5 text-gray-500 mr-2" />
                          <span className="block text-sm text-gray-700">PayPal</span>
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="cash_on_delivery"
                          type="radio"
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                          value="cash_on_delivery"
                          checked={formData.paymentMethod === 'cash_on_delivery'}
                          onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                        />
                        <label htmlFor="cash_on_delivery" className="ml-3 flex items-center">
                          <Truck className="h-5 w-5 text-gray-500 mr-2" />
                          <span className="block text-sm text-gray-700">Cash on Delivery</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition duration-150 ease-in-out flex items-center justify-center"
                      disabled={!product}
                    >
                      {product ? (
                        <>
                          <Shield className="w-5 h-5 mr-2" />
                          Place Order Securely
                        </>
                      ) : (
                        'Loading...'
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-center text-xs text-gray-500 mt-4">
                    <Lock className="w-4 h-4 mr-1 text-gray-400" />
                    <span>Your transaction is secure and encrypted</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}