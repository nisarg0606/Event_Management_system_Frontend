import ErrorToaster from '@/lib/Toasters/ErrorToaster';
import { useRef, useState, useEffect } from 'react';
import { useSession } from "next-auth/react"
import instance from "@/lib/axios";
import { useRouter } from "next/router";
import DashboardCard from "@/components/cards/DashboardCard";

export default function dashboard() {

  const { status, data: session } = useSession();
  const router = useRouter();

  const [uid, setUID] = useState('');
  const [role, setRole] = useState('');

  const [verifyInput, setVerityInput] = useState('');

  useEffect(() => {
    if (session?.user?.uid) setUID(session.user.uid);
    if (session?.user?.role) setRole(session.user.role);
  }, [session]);

  // handles code verification submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    let reqBody = {
      uid: uid,
      token: verifyInput,
    };

    await instance
      .post("/auth/verify-otp", reqBody)
      .then(async (res) => {
        console.log(res?.data?.verified);
        // set verified status true
        if (res?.data?.verified) {
          if (role === "Customer")
            router.push('/customer/dashboard')
          if (role === "Host")
            router.push("/host")
        }
      })
      .catch((err) => {
        console.log(err);
        ErrorToaster("Invalid Code");
      });
  };


  return (
    <main className="pt-4">
      <title>MFA Verification</title>
      <div className="flex items-center flex-col space-x-10">
        <h1 className="pb-4 text-3xl font-bold">Multi-factor Authentication</h1>

        <div className="flex items-center mt-6">
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
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
    </main>
  );
}