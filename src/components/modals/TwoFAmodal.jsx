import React, { useState } from "react";
import instance from "@/lib/axios";
import ErrorToaster from "@/lib/Toasters/ErrorToaster";

const TwoFAmodal = ({ isOpen, onRequestClose, on2FAsuccess, uid }) => {
  const [verifyInput, setVerityInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let reqBody = {
      uid: uid,
      token: verifyInput,
    };

    await instance
      .post("/auth/verify-otp", reqBody)
      .then(async (res) => {
        // set verified status true
        if (res?.data?.verified) {
          on2FAsuccess();
          onRequestClose();
        }
      })
      .catch((err) => {
        console.log(err);
        ErrorToaster("Invalid Code");
        onRequestClose();
      });
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

          <h2 className="text-xl font-semibold mb-4">2FA Verification</h2>
          <p className="mb-4">
            Please enter the code from your authenticator application
          </p>

          <div className="flex items-center mt-6">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center"
            >
              <input
                type="text"
                value={verifyInput}
                onChange={(e) => setVerityInput(e.target.value)}
                placeholder="Enter Verification Code"
                className="w-64 p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFAmodal;
