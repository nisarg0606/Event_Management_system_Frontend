import React, { useState } from "react";
import CreditCardForm from "../PaymentForms/CreditCardForm";
import DebitCardForm from "../PaymentForms/DebitCardForm";

const PaymentModal = ({
  isOpen,
  onRequestClose,
  totalPrice,
  onPaymentSuccess,
}) => {
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);

  const handlePayment = async () => {
    try {
      // Simulate a successful payment, replace this with your actual payment logic
      console.log("Payment successful!");
      onPaymentSuccess();
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  const handlePaymentOption = (option) => {
    setSelectedPaymentOption(option);
  };

  return (
    <div
      className={`fixed inset-0 ${
        isOpen ? "block" : "hidden"
      } bg-gray-900 bg-opacity-50 z-50`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative bg-white w-full max-w-md p-4 rounded shadow-lg">
        <button
            onClick={onRequestClose}
            className="absolute right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
          <p className="mb-4">Total Price: ${totalPrice}</p>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Payment Options</h3>
            <button
              onClick={() => handlePaymentOption("credit")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Credit Card
            </button>
            <button
              onClick={() => handlePaymentOption("debit")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 ml-2"
            >
              Debit Card
            </button>
          </div>
          {selectedPaymentOption === "credit" && (
            <CreditCardForm onPaymentSuccess={handlePayment} />
          )}
          {selectedPaymentOption === "debit" && (
            <DebitCardForm onPaymentSuccess={handlePayment} />
          )}

        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
