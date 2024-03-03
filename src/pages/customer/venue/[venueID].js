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

  const { venueID } = router.query;
  const [venueDetails, setVenueDetails] = useState(null);
  const [bookingDetails, setBookingDetails] = useState([]);

  const [selectedTimings, setSelectedTimings] = useState([]);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  const [uid, setUID] = useState();

  useEffect(() => {
    if (session?.user?.uid) setUID(session.user.uid);
  }, [session]);

  useEffect(() => {
    if (venueID) {
      fetchVenueDetails();
      fetchBookingDetails();
    }
  }, [venueID]);

  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);

  const handlePaymentSuccess = () => {
    bookVenue();
    setPaymentModalOpen(false);
  };

  const handlePaymentOption = (option) => {
    setSelectedPaymentOption(option);
  };

  const getNextThreeDays = () => {
    const today = new Date();
    const nextThreeDays = Array.from({ length: 3 }, (_, index) => {
      const nextDay = new Date();
      nextDay.setDate(today.getDate() + index + 1); // Adding 1 to skip the current day
      return nextDay.toISOString().split("T")[0] + "T00:00:00.000Z"; // Extracting the date part in ISO format
    });
    return nextThreeDays;
  };

  const isSlotAvailable = (date, timeSlot) => {
    let res = bookingDetails.filter(
      (record) =>
        record.booking_date == date && record.booking_time_slot == timeSlot
    );
    if (res.length != 0) return false;
    else return true;
  };
  const isSlotChecked = (timeslot, date) => {
    return selectedTimings.some((arr) =>
      arr.every((value, index) => value == [timeslot, date][index])
    );
  };

  const fetchVenueDetails = async () => {
    try {
      const response = await axiosAuth.get(
        `/customer/venue-details?uid=${venueID}`
      );
      setVenueDetails(response?.data?.venues);

      // Initialize selectedTimings based on the fetched data
      // const timingsArray = response.data.timings || [];
      //  setSelectedTimings(timingsArray.map((timing, index) => ({ ...timing, checked: false })));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchBookingDetails = async () => {
    try {
      const response = await axiosAuth.get(
        `/customer/booking-status?vid=${venueID}`
      );
      setBookingDetails(response?.data?.records);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleTimingCheckboxChange = (timing, date) => {
    if (isSlotChecked(timing, date)) {
      setSelectedTimings(
        selectedTimings.filter(
          (arr) => !arr.every((value, index) => value == [timing, date][index])
        )
      );
    } else {
      setSelectedTimings([...selectedTimings, [timing, date]]);
    }
  };

  const bookVenue = async() => {
    try {
      let payload = {
        cid:uid,
        vid:venueID,
        selectedTimings:selectedTimings
      }
      await axiosAuth.post(
        `/customer/book-venue`,payload
      ).then(()=> {
        SuccessToaster("Booked venue successfully")
        fetchBookingDetails()
      }).catch((err)=> ErrorToaster("There has been an error. Try again!"))
      fetchBookingDetails()
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
            <p class="mt-2">Venue ID: {venueID}</p> */}

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
                  <p
                    className={`font-semibold ${
                      venueDetails.availability
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    Availability:{" "}
                    {venueDetails.availability ? "Open" : "Closed"}
                  </p>

                  <h2 className="mt-4 text-xl font-bold">Timings</h2>
                  {getNextThreeDays().map((date) => (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-4">
                        {new Date(date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h3>
                      <div className="flex flex-col gap-2">
                        {venueDetails.timings.map((timing, index) => (
                          <div
                            key={index}
                            className={`
                         bg-white rounded-md shadow-md p-3 flex items-center mb-2
                         ${
                           !venueDetails.availability ||
                           !isSlotAvailable(date, timing.timing)
                             ? "opacity-50 pointer-events-none"
                             : "hover:shadow-lg transition duration-300"
                         }
                       `}
                          >
                            <input
                              type="checkbox"
                              checked={isSlotChecked(timing.timing, date)}
                              disabled={
                                !venueDetails.availability ||
                                !isSlotAvailable(date, timing.timing)
                              }
                              onChange={() =>
                                handleTimingCheckboxChange(timing.timing, date)
                              }
                              className="mr-2"
                            />
                            <span
                              className={`
                         ${
                           !venueDetails.availability ||
                           !isSlotAvailable(date, timing.timing)
                             ? "text-gray-400"
                             : "text-black"
                         }
                       `}
                            >
                              {timing.timing}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    console.log("click");
                    setPaymentModalOpen(true);
                  }}
                  disabled={selectedTimings.length == 0}
                  className={`mt-4 px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300 ${
                    selectedTimings.length !== 0
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-500 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  Book Venue
                </button>

                {/* Payment Modal */}
                <PaymentModal
                  isOpen={isPaymentModalOpen}
                  onRequestClose={() => setPaymentModalOpen(false)}
                  totalPrice={selectedTimings.length * venueDetails.price}
                  onPaymentSuccess={handlePaymentSuccess}
                >
                  {/* Render the pay now button in the modal */}
                  <button
                    onClick={() => {
                      console.log("Pay now clicked");
                      // Handle pay now logic here

                      <div>
                        <h2 className="text-xl font-semibold mb-4">Payment Options</h2>
                        <button
                          onClick={() => handlePaymentOption('credit')}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                          Credit Card
                        </button>
                        <button
                          onClick={() => handlePaymentOption('debit')}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 ml-2"
                        >
                          Debit Card
                        </button>

                        {/* Render the selected payment form */}
                        {selectedPaymentOption === 'credit' && (
                          <CreditCardForm onPaymentSuccess={handlePaymentSuccess} />
                        )}
                        {/* Add a similar block for the debit card form if needed */}
                      </div>
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    Pay Now
                  </button>
                </PaymentModal>
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