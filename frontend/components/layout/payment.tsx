import React, { useState } from 'react';

const PaymentComponent = () => {
  const [paymentMethod, setPaymentMethod] = useState<string>('credit');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  // Handle payment method selection
  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  // Handle payment form submission
  const handlePaymentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Payment</h2>
        
        {paymentSuccess ? (
          <div className="text-center text-green-500 font-semibold">
            <p>Your payment was successful! 🎉</p>
          </div>
        ) : (
          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  id="credit"
                  name="paymentMethod"
                  value="credit"
                  checked={paymentMethod === 'credit'}
                  onChange={handlePaymentMethodChange}
                  className="text-blue-600"
                />
                <label htmlFor="credit" className="text-lg font-medium text-gray-700">Credit Card</label>
              </div>

              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  id="paypal"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={handlePaymentMethodChange}
                  className="text-blue-600"
                />
                <label htmlFor="paypal" className="text-lg font-medium text-gray-700">PayPal</label>
              </div>

              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  id="bank"
                  name="paymentMethod"
                  value="bank"
                  checked={paymentMethod === 'bank'}
                  onChange={handlePaymentMethodChange}
                  className="text-blue-600"
                />
                <label htmlFor="bank" className="text-lg font-medium text-gray-700">Bank Transfer</label>
              </div>
            </div>

            {/* Credit Card Details */}
            {paymentMethod === 'credit' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="creditCardNumber" className="block text-sm font-medium text-gray-700">
                    Credit Card Number
                  </label>
                  <input
                    type="text"
                    id="creditCardNumber"
                    placeholder="Enter your credit card number"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      placeholder="MM/YY"
                      className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      placeholder="CVV"
                      className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PayPal Details */}
            {paymentMethod === 'paypal' && (
              <div>
                <label htmlFor="paypalEmail" className="block text-sm font-medium text-gray-700">
                  PayPal Email
                </label>
                <input
                  type="email"
                  id="paypalEmail"
                  placeholder="Enter your PayPal email"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
            )}

            {/* Bank Transfer Details */}
            {paymentMethod === 'bank' && (
              <div>
                <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  id="bankAccount"
                  placeholder="Enter your bank account number"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-6 text-center">
              <button
                type="submit"
                disabled={isProcessing}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition duration-200"
              >
                {isProcessing ? 'Processing...' : 'Submit Payment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PaymentComponent;
