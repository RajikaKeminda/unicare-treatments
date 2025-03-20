import React from 'react';

interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

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

export default OrderDetails;