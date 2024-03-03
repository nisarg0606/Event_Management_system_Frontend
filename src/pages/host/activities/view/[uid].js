import ErrorToaster from '@/lib/Toasters/ErrorToaster';
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

  const [activity, setActivity] = useState({
    name: "",
    location: "",
    description: "",
    sport: "Football",
    price: 0,
    participants: "",
    availability: false,
    date: "",
    timings: []
  });

  useEffect(() => {
    if (venueDetails) {
      const convertedTime = convertTimeStringToObject(venueDetails.time);
      setActivity({
        ...activity, name: venueDetails.name,
        location: venueDetails.location,
        description: venueDetails.description,
        sport: venueDetails.sport,
        price: venueDetails.price,
        participants: venueDetails.participantsLimit,
        availability: venueDetails.availability,
        date: venueDetails.date,
        timings: [convertedTime]
      });
    }
  }, [venueDetails]);

  // convert given times to fit timechangehandling
  const convertTimeStringToObject = (timeString) => {
    // Split the input string into start and end times
    const [startTime, endTime] = timeString.split(' - ');

    // Convert start and end times to 24-hour format
    const convertTo24HourFormat = (time) => {
      const [hours, minutes, period] = time.split(/:|\s/);
      let militaryHours = parseInt(hours, 10);

      if (period === 'PM' && militaryHours !== 12) {
        militaryHours += 12;
      } else if (period === 'AM' && militaryHours === 12) {
        militaryHours = 0;
      }

      return `${militaryHours.toString().padStart(2, '0')}:${minutes}`;
    };

    // Create the timings object
    const newTimeObject = {
      timing: timeString,
      start: convertTo24HourFormat(startTime),
      end: convertTo24HourFormat(endTime),
    };

    return newTimeObject;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setActivity({ ...activity, [name]: value });
  };

  const handleSportChange = (e) => {
    setActivity({ ...activity, sport: e.target.value });
  };

  const handleAvailability = (e) => {
    setActivity({ ...activity, availability: !activity.availability })
  }

  const handleTimingChange = (index, field, value) => {
    const updatedTimings = [...activity.timings];
    updatedTimings[index][field] = value;

    const start = updatedTimings[index].start;
    const end = updatedTimings[index].end;
    const formattedStartTime = new Date(`2000-01-01T${start}`).toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
    const formattedEndTime = new Date(`2000-01-01T${end}`).toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
    updatedTimings[index].timing = `${formattedStartTime} - ${formattedEndTime}`;

    setActivity({ ...activity, timings: [convertTimeStringToObject(updatedTimings[index].timing)] });
  };

  const removeTiming = (index) => {
    const updatedTimings = [...activity.timings];
    updatedTimings.splice(index, 1);
    setActivity({ ...activity, timings: updatedTimings });
  };

  const addTiming = () => {
    const newTiming = {
      start: "",
      end: "",
    };
    setActivity({ ...activity, timings: [...activity.timings, newTiming] });
  };

  useEffect(() => {
    if (session?.user?.uid) setUID(session.user.uid);
  }, [session]);

  const fetchVenueDetails = async () => {
    try {
      // Replace with your API endpoint
      const response = await axiosAuth.get(
        `/host/activity-details?uid=${venue_uid}&host_id=${uid}`
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
  // edit feature
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let reqBody = {
        name: activity.name,
        location: activity.location,
        description: activity.description,
        images: [],
        sport: activity.sport,
        date: activity.date,
        availability: activity.availability,
        price: activity.price,
        time: activity.timings[0].timing,
        participantsLimit: activity.participants,
        activityid: venue_uid
      };


      await axiosAuth
        .post("/host/update-activity", reqBody)
        .then(async () => {
          console.log('updated');
          fetchVenueDetails();
          setButtonEnabled(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    catch (err) {
      if(err instanceof TypeError) ErrorToaster("Please enter at least one activity time");
      else console.log(err);
    }
  };

  return (
    // <div>
    //   <h1>Venue Details</h1>
    //   <p>Venue ID: {venue_uid}</p>

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
        <h1 class="text-3xl font-bold">Activity Details</h1>
        <p class="mt-2">Activity ID: {venue_uid}</p>

        {venueDetails && (
          <div class="mt-4">
            {!isButtonEnabled && (
              <h2 class="text-xl font-semibold">Activity Name: {venueDetails.name}</h2>
            )}
            {isButtonEnabled && (
              <div className="mb-4 font-normal text-base">
                <h2 className="text-xl font-semibold">Activity Name: </h2>
                <input
                  required
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Edit Name..."
                  value={activity.name}
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
                  value={activity.location}
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
                  value={activity.description}
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
                  value={activity.sport}
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
                  value={activity.price}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2"
                />
              </div>
            )}
            {!isButtonEnabled && (
              <p class="mt-2">Participants Limit: {venueDetails.participantsLimit}</p>
            )}
            {isButtonEnabled && (
              <div className="mb-4">
                <p class="mt-2">Participants Limit: </p>
                <input
                  required
                  type="Number"
                  id="participants"
                  name="participants"
                  placeholder="Edit Participants Limit..."
                  value={activity.participants}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2"
                />
              </div>
            )}
            <p class="mt-2">Registered: {venueDetails.participants_uids.length}</p>
            {!isButtonEnabled && (
              <p class="mt-2">Availability: {venueDetails.availability ? "Open" : "Closed"}</p>
            )}
            {isButtonEnabled && (
              <div className="mb-4">
                <p class="mt-2">Availability: </p>
                <input name="availability"
                  checked={activity.availability}
                  onChange={(e) => handleAvailability(e)} type="checkbox" className="mr-2" />
                <label htmlFor="sport">Open for bookings</label>
              </div>
            )}
            <h2 class="mt-4 text-xl font-semibold">Date</h2>
            {!isButtonEnabled && (
              <div>
                <ul class="mt-2">
                  {venueDetails.date}
                </ul>
              </div>
            )}
            {isButtonEnabled && (
              <div className="mb-4">
                <input
                  required
                  type="date"
                  id="date"
                  name="date"
                  value={activity.date}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2"
                />
              </div>
            )}

            <h2 class="mt-4 text-xl font-semibold">Time</h2>
            {!isButtonEnabled && (
              <ul class="mt-2">
                {venueDetails.time}
              </ul>
            )}
            {isButtonEnabled && (
              <div className="mb-4">
                {activity.timings.map((timing, index) => (
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
                {
                  activity.timings.length == 0 &&
                  <button
                    type="button"
                    onClick={addTiming}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Add Timing
                  </button>
                }
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
