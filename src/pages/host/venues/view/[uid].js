import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const venues = ({ venue_uid }) => {
  const axiosAuth = useAxiosAuth();

  const [venuesList, setVenuesList] = useState([]);

  const { status, data: session } = useSession();
  const [uid, setUID] = useState();

  const [venueDetails, setVenueDetails] = useState(null);

  const [selectedTimings, setSelectedTimings] = useState([]);

  // edit features
  const [isButtonEnabled, setButtonEnabled] = useState(false);

  const [venue, setVenue] = useState({
    name: "",
    location: "",
    description: "",
    sport: "Football",
    timings: [],
    availability: false,
    price: 0
  });

  useEffect(() => {
    if (venueDetails) {
      setVenue({
        ...venue, name: venueDetails.name,
        location: venueDetails.location,
        description: venueDetails.description,
        sport: venueDetails.sport,
        timings: venueDetails.timings,
        availability: venueDetails.availability,
        price: venueDetails.price
      });
    }
  }, [venueDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVenue({ ...venue, [name]: value });
  };

  const handleSportChange = (e) => {
    setVenue({ ...venue, sport: e.target.value });
  };

  const handleAvailability = (e) => {
    setVenue({ ...venue, availability: !venue.availability })
  }

  const handleTimingChange = (index, field, value) => {
    const updatedTimings = [...venue.timings];
    updatedTimings[index][field] = value;

    const start = updatedTimings[index].start;
    const end = updatedTimings[index].end;
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    const formattedStartTime = startTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    const formattedEndTime = endTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    updatedTimings[
      index
    ].timing = `${formattedStartTime} - ${formattedEndTime}`;

    setVenue({ ...venue, timings: updatedTimings });
  };

  const removeTiming = (index) => {
    const updatedTimings = [...venue.timings];
    updatedTimings.splice(index, 1);
    setVenue({ ...venue, timings: updatedTimings });
  };

  const addTiming = () => {
    const newTiming = {
      timing: "",
      start: "",
      end: "",
      booked: false,
    };
    setVenue({ ...venue, timings: [...venue.timings, newTiming] });
  };


  //session info
  useEffect(() => {
    if (session?.user?.uid) setUID(session.user.uid);
  }, [session]);

  const fetchVenueDetails = async () => {
    try {
      // Replace with your API endpoint
      const response = await axiosAuth.get(
        `/host/venue-details?uid=${venue_uid}&host_id=${uid}`
      );
      console.log(response.data);
      setVenueDetails(response?.data?.venues);

      // Initialize selectedTimings based on the fetched data
      // const timingsArray = response.data.timings || [];
      // setSelectedTimings(timingsArray.map((timing, index) => ({ ...timing, checked: false })));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (uid) {
      fetchVenueDetails();
    }
  }, [uid]);

  useEffect(() => {
    // Check if at least one timing is selected
    const atLeastOneChecked = selectedTimings.some((timing) => timing.checked);
    setButtonEnabled(atLeastOneChecked);
  }, [selectedTimings]);

  const handleTimingCheckboxChange = (index) => {
    if (selectedTimings.includes(index)) {
      setSelectedTimings(selectedTimings.filter((i) => i !== index));
    } else {
      setSelectedTimings([...selectedTimings, index]);
    }
  };

  // edit feature
  const handleSubmit = async (e) => {
    e.preventDefault();

    let reqBody = {
      name: venue.name,
      location: venue.location,
      description: venue.description,
      images: [],
      host_name: venueDetails.host_name,
      host_id: uid,
      sport: venue.sport,
      availability: venue.availability,
      price: venue.price,
      timings: venue.timings,
      venueid: venue_uid
    };

    await axiosAuth
      .post("/host/update-venue", reqBody)
      .then(async () => {
        fetchVenueDetails();
        setButtonEnabled(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    // <div>
    //   <h1>Venue Details</h1>
    //   <p>Venue ID: {venue_uid}</p>

    //   {venueDetails && (
    //     <div>
    //       <h2>Venue Name: {venueDetails.name}</h2>
    //       <p>Location: {venueDetails.location}</p>
    //       <p>Description: {venueDetails.description}</p>
    //       <p>Host Name: {venueDetails.host_name}</p>
    //       <p>Sport: {venueDetails.sport}</p>
    //       <p>Availability: {venueDetails.availability?"Open":"Closed"}</p>

    //       <h2>Timings</h2>
    //       <ul>
    //         {venueDetails.timings.map((timing, index) => (
    //           <li key={index}>
    //             <input
    //               type="checkbox"
    //               checked={selectedTimings.includes(index)}
    //               disabled ={!venueDetails.availability}
    //               onChange={() => handleTimingCheckboxChange(index)}
    //             />
    //             {timing.timing}
    //           </li>
    //         ))}
    //       </ul>
    //       <button disabled={!isButtonEnabled}>Book Now</button>
    //     </div>
    //   )}
    // </div>
    <div class="p-16 flex">
      <div class="w-1/2 pr-4">
        <img
          src="/images/landing.jpg"
          alt="Venue Image"
          class="w-full h-auto rounded-lg"
        />
      </div>
      <div class="w-1/2 pl-4">
        <h1 class="text-3xl font-bold">Venue Details</h1>
        <p class="mt-2">Venue ID: {venue_uid}</p>

        {venueDetails && (
          <div class="mt-4">
            {!isButtonEnabled && (
              <h2 class="text-xl font-semibold">Venue Name: {venueDetails.name}</h2>
            )}
            {isButtonEnabled && (
              <div className="mb-4 font-normal text-base">
                <h2 className="text-xl font-semibold">Venue Name: </h2>
                <input
                  required
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Edit Name..."
                  value={venue.name}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2"
                />
              </div>
            )}
            {!isButtonEnabled && (
              <p class="mt-2">Location: {venueDetails.location}</p>
            )}
            {isButtonEnabled && (
              <div className="mb-4">
                <p class="mt-2">Location: </p>
                <input
                  required
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Edit Location..."
                  value={venue.location}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 w-full"
                />
              </div>
            )}
            {!isButtonEnabled && (
              <p class="mt-2">Description: {venueDetails.description}</p>
            )}
            {isButtonEnabled && (
              <div className="mb-4">
                <p class="mt-2">Description: </p>
                <input
                  required
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Edit Description..."
                  value={venue.description}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 w-full"
                />
              </div>
            )}
            <p class="mt-2">Host Name: {venueDetails.host_name}</p>
            {!isButtonEnabled && (
              <p class="mt-2">Sport: {venueDetails.sport}</p>
            )}
            {isButtonEnabled && (
              <div className="mb-4">
                <p class="mt-2">Sport: </p>
                <select
                  required
                  id="sport"
                  name="sport"
                  value={venue.sport}
                  onChange={handleSportChange}
                  className="border border-gray-300 p-2"
                >
                  <option value="Football">Football</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Tennis">Tennis</option>
                </select>
              </div>
            )}
            {!isButtonEnabled && (
              <p class="mt-2">Price: {venueDetails.price}</p>
            )}
            {isButtonEnabled && (
              <div className="mb-4">
                <p class="mt-2">Price: </p>
                <input
                  required
                  type="Number"
                  id="price"
                  name="price"
                  placeholder="Edit Price..."
                  value={venue.price}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2"
                />
              </div>
            )}
            {!isButtonEnabled && (
              <p class="mt-2">Availability: {venueDetails.availability ? "Open" : "Closed"}</p>
            )}
            {isButtonEnabled && (
              <div className="mb-4">
                <p class="mt-2">Availability: </p>
                <input name="availability"
                  checked={venue.availability}
                  onChange={(e) => handleAvailability(e)} type="checkbox" className="mr-2" />
                <label htmlFor="sport">Open for bookings</label>
              </div>
            )}
            <h2 class="mt-4 text-xl font-semibold">Timings</h2>
            {!isButtonEnabled && (
              <ul class="mt-2">
                {venueDetails.timings.map((timing, index) => (
                  <li key={index} class="flex items-center">
                    {/* <input
                    type="checkbox"
                    checked={selectedTimings.includes(index)}
                    disabled={!venueDetails.availability}
                    onChange={() => handleTimingCheckboxChange(index)}
                    class="mr-2"
                  /> */}
                    {timing.timing}
                  </li>
                ))}
              </ul>
            )}
            {isButtonEnabled && (
              <div className="mb-4">
                {venue.timings.map((timing, index) => (
                  <div key={index} className="mb-2">
                    <input
                      required
                      type="time"
                      value={timing.start}
                      onChange={(e) =>
                        handleTimingChange(index, "start", e.target.value)
                      }
                      className="border border-gray-300 p-2"
                    />
                    <input
                      type="time"
                      required
                      value={timing.end}
                      onChange={(e) =>
                        handleTimingChange(index, "end", e.target.value)
                      }
                      className="border border-gray-300 p-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeTiming(index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTiming}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Add Timing
                </button>
              </div>
            )}
            <div className="flex flex-col max-w-200">
              {isButtonEnabled && (
                <button
                  class="w-[150px] mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-300"
                  onClick={handleSubmit}
                >
                  Save Changes
                </button>
              )}

              <button
                class="w-[150px] mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300" onClick={() =>
                  setButtonEnabled(!isButtonEnabled)
                }>
                Edit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps({ res, params: { uid } }) {
  return {
    props: {
      venue_uid: uid,
    },
  };
}

export default venues;
venues.auth = true;