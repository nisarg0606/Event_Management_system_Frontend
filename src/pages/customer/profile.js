import ErrorToaster from '@/lib/Toasters/ErrorToaster';
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useRef, useState, useEffect } from 'react';
import { useSession } from "next-auth/react"
import QRCode from "qrcode";
import instance from "@/lib/axios";

export default function dashboard() {

  const axiosAuth = useAxiosAuth();

  const { status, data: session } = useSession();
  const [isQRCodeVerifyVisible, setQRCodeVerifyVisible] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verifiedOTP, setverifiedOTP] = useState(false);
  const [verifyInput, setVerityInput] = useState('');

  const [uid, setUID] = useState();
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [role, setRole] = useState();
  const [interests, setInterests] = useState();
  const [viewInterests, setViewInterests] = useState();
  const [updatedInterests, setUpdatedInterests] = useState([]);

  const [isEditEnabled, setIsEditEnabled] = useState(false);


  useEffect(() => {
    if (session?.user?.uid) setUID(session.user.uid);
    if (session?.user?.email) setEmail(session.user.email);
    if (session?.user?.username) setUsername(session.user.username);
    if (session?.user?.role) setRole(session.user.role);
  }, [session]);

  useEffect(() => {
    if (email) isOTPEnabled();
  }, [email, verifiedOTP]);

  useEffect(() => {
    if (uid) fetchProfileDetails();
  }, [uid]);

  useEffect(() => {
    if (interests) {
      setUpdatedInterests(interests);
      setViewInterests(interests.join(", "));
    }
  }, [interests]);

  // checks if user has MFA enabled.
  const isOTPEnabled = async () => {
    try {
      const response = await axiosAuth.get(
        `/auth/enabled-2FA?email=${email}`
      );
      setverifiedOTP(response?.data?.otp_verified);
    } catch (error) {
      console.log(error);
    }
  };

  // generates QRCode
  const generateQrCode = async () => {
    try {
      const response = await axiosAuth.get(
        `/auth/generate-qr?uid=${uid}`
      );
      QRCode.toDataURL(response?.data?.url).then(setQrCodeUrl);
      // displays QRCode
      setQRCodeVerifyVisible(!isQRCodeVerifyVisible);
    } catch (error) {
      console.log(error);
    }
  };

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
        setverifiedOTP(true);
      })
      .catch((err) => {
        ErrorToaster("Invalid Code");
      });
  };

  // disable MFA
  const disableMFA = async () => {
    try {
      const response = await axiosAuth.get(
        `/auth/disable-2FA?email=${email}`
      );
      setverifiedOTP(false);
      // setverifiedOTP(response?.data?.otp_enabled);
    } catch (error) {
      console.log(error);
    }
  };

  //fetch profile details
  const fetchProfileDetails = async () => {
    try {
      const response = await axiosAuth.get(
        `/customer/profile-details?customer_id=${uid}`
      );
      setInterests(response.data.data.profileDetails.interested_sports);
    } catch (error) {
      console.log(error);
    }
  };

  const s1Change = (e) => {
    if (updatedInterests.includes("Football")) {
      setUpdatedInterests(e => e.filter(sport => sport !== "Football"));
    }
    else {
      setUpdatedInterests(e => [...e, "Football"]);
    }
  };
  const s2Change = (e) => {
    if (updatedInterests.includes("Badminton")) {
      setUpdatedInterests(e => e.filter(sport => sport !== "Badminton"));
    }
    else {
      setUpdatedInterests(e => [...e, "Badminton"]);
    }
    console.log(updatedInterests);
  };
  const s3Change = (e) => {
    if (updatedInterests.includes("Tennis")) {
      setUpdatedInterests(e => e.filter(sport => sport !== "Tennis"));
    }
    else {
      setUpdatedInterests(e => [...e, "Tennis"]);
    }
    console.log(updatedInterests);
  };

  // update interests
  const saveInterests = async (e) => {
    e.preventDefault();

    let reqBody = {
      customerid: uid,
      interested_sports: updatedInterests
    };

    await axiosAuth
      .post("/customer/update-profile", reqBody)
      .then(async () => {
        fetchProfileDetails();
        setIsEditEnabled(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <main className="pt-4" >
      <title>Profile</title>
      <div className="flex justify-center items-center flex-col space-x-10">
        <div className="mt-7">
          <h1 className="pb-4 text-3xl font-bold">Profile</h1>
          <p className="pb-1">Username: {username}</p>
          <p className="pb-1">Email: {email}</p>
          <p className="pb-1">Role: {role}</p>
          {!isEditEnabled && (
            <div>
              <p className="pb-1">Interests: {viewInterests}</p>
              <button
                type="button"
                onClick={() => setIsEditEnabled(!isEditEnabled)}
                className="text-blue-600 hover:text-blue-800 pb-3"
              >
                Update interests
              </button>
            </div>
          )}
          {isEditEnabled && (
            <div>
              <p className="pb-2">Interests: </p>
              <div className="mb-4 flex flex-col items-start bg-gray-200 p-2">
                <div>
                  <label className='pr-2' htmlFor="sport">Football</label>
                  <input name="sport1"
                    checked={updatedInterests.includes("Football")}
                    onChange={(e) => s1Change(e)} type="checkbox" className="mr-2" />
                </div>

                <div>
                  <label className='pr-2' htmlFor="sport">Badminton</label>
                  <input name="sport2"
                    checked={updatedInterests.includes("Badminton")}
                    onChange={(e) => s2Change(e)} type="checkbox" className="mr-2" />
                </div>

                <div>
                  <label className='pr-2' htmlFor="sport">Tennis</label>
                  <input name="sport3"
                    checked={updatedInterests.includes("Tennis")}
                    onChange={(e) => s3Change(e)} type="checkbox" className="mr-2" />
                </div>

                <button
                type='button'
                  class="text-blue-600 hover:text-blue-800 pt-2"
                  onClick={saveInterests}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
          <p className="pb-1">MFA active: {verifiedOTP.toString()}</p>
        </div>
      </div>
      <div className="flex items-center flex-col mt-5">
        {/* displays if MFA is enabled */}
        {verifiedOTP && (
          <button type="button" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded" onClick={() =>
            disableMFA()
          }>
            Disable MFA
          </button>
        )}

        {/* displays if MFA is not enabled */}
        {!verifiedOTP && (
          <button type="button" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded" onClick={() =>
            generateQrCode()
          }>
            Setup MFA
          </button>
        )}
        {isQRCodeVerifyVisible && !verifiedOTP && (
          <div>
            <img
              className="block w-64 h-64 object-contain"
              src={qrCodeUrl}
              alt="qrcode url"
            />
            <div className="flex items-center">
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
        )}

      </div>
    </main >
  );
}
dashboard.auth = true;