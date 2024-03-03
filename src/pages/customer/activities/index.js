import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useState, useEffect } from "react";

import ActivityCard from "@/components/cards/ActivityCard";


const venuesData = [
  {
    id: 1,
    imageSrc: "/images/landing.jpg",
    name: "Venue 1",
    location: "Location 1",
    availability: "Open",
    sport: "Basketball",
  },
  {
    id: 2,
    imageSrc: "/images/landing.jpg",
    name: "Venue 2",
    location: "Location 2",
    availability: "Closed",
    sport: "Tennis",
  },
  {
    id: 3,
    imageSrc: "/images/landing.jpg",
    name: "Venue 3",
    location: "Location 3",
    availability: "Open",
    sport: "Soccer",
  },
];

const venues = () => {
  const axiosAuth = useAxiosAuth();

  const [venuesList, setVenuesList] = useState([]);

  const fetchVenues = async () => {
    await axiosAuth
      .get("/customer/fetch-activities")
      .then(({ data: response }) => {
        setVenuesList(response.venues);
        console.log(response.venues)
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchVenues()
  }, []);
  return (
    <section>
      <title>Activities</title>
      <h1 className="text-4xl font-bold pl-24 mb-4">Activities</h1>
      <div className="px-24 flex flex-wrap justify-left space-x-4">
        {venuesList.map((venue) => (
          <ActivityCard
            key={venue.uid}
            imageSrc="/images/landing.jpg"
            name={venue.name}
            location={venue.location}
            availability={venue.availability}
            sport={venue.sport}
            time={venue.time}
            date = {venue.date}
            registered = {venue.participants_uids.length}
            participantsLimit = {venue.participantsLimit}
            id={venue.uid}
          />
        ))}
      </div>
    </section>
  );
};

export default venues;
venues.auth = true