import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react"
import useAxiosAuth from "@/lib/hooks/useAxiosAuth"; // Import your Axios instance
import PaymentModal from "@/components/modals/PaymentModal";
import SuccessToaster from "@/lib/Toasters/SuccessToaster";
import ErrorToaster from "@/lib/Toasters/ErrorToaster";

const VenueDetails = () => {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();  
  const { status, data: session } = useSession();

  const { activityID } = router.query;
  const [venueDetails, setVenueDetails] = useState(null);
  const [bookingDetails, setBookingDetails] = useState([]);

  const [selectedTimings, setSelectedTimings] = useState([]);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  const [uid, setUID] = useState();

  useEffect(() => {
    if (session?.user?.uid) setUID(session.user.uid);
  }, [session]);

  useEffect(() => {
    if (activityID) {
      fetchVenueDetails();
    }
  }, [activityID]);

  const handlePaymentSuccess = () => {
    // Your logic when payment is successful, e.g., calling the bookVenue function
    bookVenue();
    // Close the modal
    setPaymentModalOpen(false);
  };

   const fetchVenueDetails = async () => {
    try {
      const response = await axiosAuth.get(
        `/customer/activity-details?uid=${activityID}`
      );
      setVenueDetails(response?.data?.venues);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  


  const bookVenue = async() => {
    try {
      let payload = {
        cid:uid,
        aid:activityID,
      }
      await axiosAuth.post(
        `/customer/book-activity`,payload
      ).then(()=> {
        SuccessToaster("Registered venue successfully")
        fetchVenueDetails()
      }).catch((err)=> ErrorToaster("There has been an error. Try again!"))
   
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      {venueDetails && (
        <div class="p-16 flex">
          <div class="w-1/2 pr-4">
            <img
              src="/images/landing.jpg"
              alt="Venue Image"
              class="w-full h-auto rounded-lg"
            />
          </div>
          <div class="w-1/2 pl-4">
            {/* <h1 class="text-3xl font-bold">Venue Details</h1>
            <p class="mt-2">Venue ID: {activityID}</p> */}

            {venueDetails && (
              <div class="mt-4">
                <div className="mt-4 bg-white p-4 rounded-md shadow-md">
                  <h2 className="text-2xl font-semibold mb-4">
                    {venueDetails.name}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    Location: {venueDetails.location}
                  </p>
                  <p className="text-gray-600 mb-2">
                    Description: {venueDetails.description}
                  </p>
                  <p className="text-gray-600 mb-2">
                    Host Name: {venueDetails.host_name}
                  </p>
                  <p className="text-gray-600 mb-2">
                    Sport: {venueDetails.sport}
                  </p>
                  <p className="text-gray-600 mb-2">
                    Price: {venueDetails.price}
                  </p>
                  <p className="text-gray-600 mb-2">
                    Available Seats: {`${venueDetails.participantsLimit - venueDetails.participants_uids.length}/${venueDetails.participantsLimit}`} 
                  </p>
                  <p
                    className={`font-semibold ${
                      venueDetails.availability
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    Availability:{" "}
                    {venueDetails.availability && venueDetails.participants_uids.length<venueDetails.participantsLimit ? "Open" : "Closed"}
                  </p>

                  <h2 className="mt-4 text-xl font-bold">Timings: {venueDetails.time}</h2>
                  <h2 className="mt-4 text-xl font-bold">Date: {new Date(venueDetails.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}</h2>

           
                 
                </div>

                <button
                  onClick={() => {
                    console.log("click");
                    setPaymentModalOpen(true);
                  }}
                  disabled={!(venueDetails.participants_uids.length<venueDetails.participantsLimit) || venueDetails.participants_uids.includes(uid) && venueDetails?.availability}
                  className={`mt-4 px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300 ${
                    (venueDetails.participants_uids.length<venueDetails.participantsLimit && !venueDetails.participants_uids.includes(uid)) && venueDetails?.availability
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-500 text-gray-300 cursor-not-allowed"
                  }`}
                >
                 {`${venueDetails.participants_uids.includes(uid)?"Registered":"Register"}`}
                </button>

                <PaymentModal
                  isOpen={isPaymentModalOpen}
                  onRequestClose={() => setPaymentModalOpen(false)}
                  totalPrice={venueDetails.price}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
VenueDetails.auth = true;
export default VenueDetails;
