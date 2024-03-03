import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import SuccessToaster from "@/lib/Toasters/SuccessToaster";
import ErrorToaster from "@/lib/Toasters/ErrorToaster";
import VenueDetails from "@/pages/customer/venue/[venueID]";

export default function Home() {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const { data: session } = useSession();

  const [username, setUsername] = useState();
  const [uid, setUID] = useState();

  useEffect(() => {
    if (session?.user?.username) setUsername(session.user.username);
    if (session?.user?.uid) setUID(session.user.uid);
  }, [session]);

  const [venue, setVenue] = useState({
    name: "",
    location: "",
    description: "",
    host_name: "",
    host_id: "",
    sport: "Football",
    timings: [],
    availability: false,
    price: 0,
    participantsLimit: 0,
    date: "",
    time: "",
  });

  const submitForm = async (e) => {
    e.preventDefault();

    let payload = {
      ...venue,
      host_name: username || "",
      host_id: uid || "",
    };

    await axiosAuth
      .post("/host/create-activity", payload)
      .then((res) => {
        SuccessToaster("Successfully Added Actvity!");
        router.push("/host/activities/view");
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response?.data?.error) ErrorToaster(err.response.data.error);
        else ErrorToaster("There has been an error. Please try again!");
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVenue({ ...venue, [name]: value });
  };

  const handleSportChange = (e) => {
    setVenue({ ...venue, sport: e.target.value });
  };

  const handleAvailability = (e) => {
    setVenue({ ...venue, availability: !venue.availability });
  };

  const addTiming = () => {
    const newTiming = {
      start: "",
      end: "",
    };
    setVenue({ ...venue, timings: [...venue.timings, newTiming] });
  };

  const handleTimingChange = (index, field, value) => {
    const updatedTimings = [...venue.timings];
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
    updatedTimings[index].time = `${formattedStartTime} - ${formattedEndTime}`;

    setVenue({ ...venue, time: updatedTimings[index].time });
  };

  const removeTiming = (index) => {
    const updatedTimings = [...venue.timings];
    updatedTimings.splice(index, 1);
    setVenue({ ...venue, timings: updatedTimings });
  };

  return (
    <section>
      <title>Add Acitivity</title>
      <main>
        <div className="max-w-md mx-auto p-4">
          <h1 className="text-xl font-semibold mb-4">Add Acitivity Details</h1>
          <form onSubmit={(e) => submitForm(e)}>
            <div className="mb-4">
              <label htmlFor="name">Name:</label>
              <input
                required
                type="text"
                id="name"
                name="name"
                value={venue.name}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="location">Location:</label>
              <input
                required
                type="text"
                id="location"
                name="location"
                value={venue.location}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description">Description:</label>
              <input
                required
                type="text"
                id="description"
                name="description"
                value={venue.description}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="price">Price:</label>
              <input
                required
                type="number"
                id="price"
                name="price"
                value={venue.price}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="participantsLimit">Participants Limit:</label>
              <input
                required
                type="number"
                id="participantsLimit"
                name="participantsLimit"
                value={venue.participantsLimit}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 w-full"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="sport">Sport:</label>
              <select
                required
                id="sport"
                name="sport"
                value={venue.sport}
                onChange={handleSportChange}
                className="border border-gray-300 p-2 w-full"
              >
                <option value="Football">Football</option>
                <option value="Badminton">Badminton</option>
                <option value="Tennis">Tennis</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="date">Date:</label>
              <input
                required
                type="date"
                id="date"
                name="date"
                value={venue.date}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 w-full"
              />
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Timings</h2>
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
              {
                venue.timings.length==0 &&
              <button
                type="button"
                onClick={addTiming}
                className="text-blue-600 hover:text-blue-800"
              >
                Add Timing
              </button>
              }
            </div>

            <div className="mb-4">
              <input
                name="availability"
                checked={venue.availability}
                onChange={(e) => handleAvailability(e)}
                type="checkbox"
                className="mr-2"
              />
              <label htmlFor="availability">Open for bookings</label>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </main>
    </section>
  );
}

Home.auth = true;
Home.Layout = "Host";
