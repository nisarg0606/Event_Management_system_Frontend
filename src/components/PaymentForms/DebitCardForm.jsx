import React, { useState } from 'react';

const DebitCardForm = ({ onPaymentSuccess }) => {
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCVV] = useState('');
  const [showCVV, setShowCVV] = useState(false);
  const [isCVVValid, setIsCVVValid] = useState(true);
  const [isCardNumberValid, setIsCardNumberValid] = useState(true);
  const [isExpiryDateValid, setIsExpiryDateValid] = useState(true);

  const handlePayment = () => {
    // Validate and process debit card payment logic here
    if (isCVVValid && isCardNumberValid && isExpiryDateValid) {
      // If payment is successful, call the onPaymentSuccess callback
      onPaymentSuccess();
    } else {
      alert('Invalid payment details. Please check and try again.');
    }
  };

  const handleCVVChange = (event) => {
    // Display only three digits and replace the actual value with stars
    const inputValue = event.target.value;
    const sanitizedCVV = inputValue.replace(/\D/g, ''); // Remove non-numeric characters
    const truncatedCVV = sanitizedCVV.slice(0, 3);
    setCVV(truncatedCVV);
    setShowCVV(true);

    // Validate CVV (assuming CVV should be exactly 3 digits)
    setIsCVVValid(truncatedCVV.length === 3);
  };

  const handleCardNumberChange = (event) => {
    const inputValue = event.target.value;
    const sanitizedCardNumber = inputValue.replace(/\D/g, ''); // Remove non-numeric characters

    // Validate card number using Luhn algorithm
    const isValid = validateCardNumber(sanitizedCardNumber);
    setIsCardNumberValid(isValid);

    // Format card number in groups of four for better readability
    const formattedCardNumber = formatCardNumber(sanitizedCardNumber);
    setCardNumber(formattedCardNumber);
  };

  const handleExpiryDateChange = (event) => {
    setExpiryDate(event.target.value);

    // Validate expiry date (you may want to add more specific validations)
    setIsExpiryDateValid(true); // Placeholder validation, you can customize as needed
  };

  const validateCardNumber = (cardNumber) => {
    const reversedCardNumber = cardNumber.split('').reverse().join('');
    let sum = 0;

    for (let i = 0; i < reversedCardNumber.length; i++) {
      let digit = parseInt(reversedCardNumber[i]);

      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
    }

    return sum % 10 === 0;
  };

  const formatCardNumber = (cardNumber) => {
    return cardNumber.match(/.{1,4}/g)?.join(' ') || '';
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Debit Card Details</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Cardholder Name:
          <input
            className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring focus:border-blue-300"
            type="text"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Card Number:
          <input
            className={`mt-1 p-2 border ${
              isCardNumberValid ? 'border-gray-300' : 'border-red-500'
            } rounded w-full focus:outline-none focus:ring focus:border-blue-300`}
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
          />
          {!isCardNumberValid && (
            <p className="text-red-500 text-xs mt-1">
              Invalid card number. Please check and try again.
            </p>
          )}
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Expiry Date:
          <input
            className={`mt-1 p-2 border ${
              isExpiryDateValid ? 'border-gray-300' : 'border-red-500'
            } rounded w-full focus:outline-none focus:ring focus:border-blue-300`}
            type="date"
            value={expiryDate}
            onChange={handleExpiryDateChange}
          />
          {!isExpiryDateValid && (
            <p className="text-red-500 text-xs mt-1">
              Invalid expiry date. Please check and try again.
            </p>
          )}
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          CVV:
          <input
            className={`mt-1 p-2 border ${
              isCVVValid ? 'border-gray-300' : 'border-red-500'
            } rounded w-full focus:outline-none focus:ring focus:border-blue-300`}
            type="password"
            value={cvv}
            onChange={handleCVVChange}
          />
          {!isCVVValid && (
            <p className="text-red-500 text-xs mt-1">
              CVV must be 3 digits. Please check and try again.
            </p>
          )}
        </label>
      </div>

      <button
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
        onClick={handlePayment}
      >
        Pay Now
      </button>
    </div>
  );
};

export default DebitCardForm;
