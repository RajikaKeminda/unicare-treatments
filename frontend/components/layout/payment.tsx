import React, { useState } from 'react';

// Define the Product interface
interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

// Define the OrderDetails component
interface OrderDetailsProps {
  paymentMethod: string;
  creditCardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  paypalEmail?: string;
  bankAccount?: string;
  products: Product[];
  totalAmount: number;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  paymentMethod,
  creditCardNumber,
  expiryDate,
  cvv,
  paypalEmail,
  bankAccount,
  products,
  totalAmount,
}) => {
  return (
    <div className="mt-6 text-left">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h3>
      <div className="space-y-4">
        {/* Payment Method Details */}
        <div>
          <p className="text-gray-700"><strong>Payment Method:</strong> {paymentMethod}</p>
          {paymentMethod === 'credit' && (
            <>
              <p className="text-gray-700"><strong>Credit Card Number:</strong> {creditCardNumber}</p>
              <p className="text-gray-700"><strong>Expiry Date:</strong> {expiryDate}</p>
              <p className="text-gray-700"><strong>CVV:</strong> {cvv}</p>
            </>
          )}
          {paymentMethod === 'paypal' && (
            <p className="text-gray-700"><strong>PayPal Email:</strong> {paypalEmail}</p>
          )}
          {paymentMethod === 'bank' && (
            <p className="text-gray-700"><strong>Bank Account Number:</strong> {bankAccount}</p>
          )}
        </div>

        {/* Products List */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Products</h4>
          <div className="space-y-2">
            {products.map((product) => (
              <div key={product.id} className="flex justify-between">
                <p className="text-gray-700">{product.name} (x{product.quantity})</p>
                <p className="text-gray-700">${(product.price * product.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Total Amount */}
        <div className="border-t pt-4">
          <p className="text-lg font-semibold text-gray-800">
            <strong>Total Amount:</strong> ${totalAmount.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

const PaymentComponent = () => {
  const [paymentMethod, setPaymentMethod] = useState<string>('credit');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [showOrderDetails, setShowOrderDetails] = useState<boolean>(false);
  const [creditCardNumber, setCreditCardNumber] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [paypalEmail, setPaypalEmail] = useState<string>('');
  const [bankAccount, setBankAccount] = useState<string>('');

  // Mock order details
  const [products] = useState<Product[]>([
    { id: 1, name: 'Product A', quantity: 2, price: 25.0 },
    { id: 2, name: 'Product B', quantity: 1, price: 50.0 },
    { id: 3, name: 'Product C', quantity: 3, price: 10.0 },
  ]);

  const totalAmount = products.reduce((total, product) => total + product.price * product.quantity, 0);

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

  // Toggle order details visibility
  const toggleOrderDetails = () => {
    setShowOrderDetails(!showOrderDetails);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Payment</h2>
        
        {paymentSuccess ? (
          <div className="text-center">
            <p className="text-green-500 font-semibold">Your payment was successful! 🎉</p>
            <button
              onClick={toggleOrderDetails}
              className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              {showOrderDetails ? 'Hide Order Details' : 'View Order Details'}
            </button>
            {showOrderDetails && (
              <OrderDetails
                paymentMethod={paymentMethod}
                creditCardNumber={creditCardNumber}
                expiryDate={expiryDate}
                cvv={cvv}
                paypalEmail={paypalEmail}
                bankAccount={bankAccount}
                products={products}
                totalAmount={totalAmount}
              />
            )}
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
                    value={creditCardNumber}
                    onChange={(e) => setCreditCardNumber(e.target.value)}
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
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
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
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
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
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
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
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
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