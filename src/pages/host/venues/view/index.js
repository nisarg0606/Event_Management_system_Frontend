import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import HostVenueCard from "@/components/cards/HostVenueCard";

const venues = () => {
  const axiosAuth = useAxiosAuth();

  const [venuesList, setVenuesList] = useState([]);

  const { status, data: session } = useSession();
  const [uid, setUID] = useState();

  useEffect(() => {
    if (session?.user?.uid) setUID(session.user.uid);
  }, [session]);

  const fetchVenues = async () => {
    await axiosAuth
      .get(`/host/fetch-venues?host_id=${uid}`)
      .then(({ data: response }) => {
        setVenuesList(response.venues);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (uid) {
      fetchVenues();
    }
  }, [uid]);
  return (
    <section>
      <title>Your Venues</title>
      <h1 className="text-4xl font-bold pl-24 mb-4">Your Venues</h1>
      <div className="px-24 flex flex-wrap justify-left space-x-4">
        {venuesList.map((venue) => (
          <HostVenueCard
            key={venue.uid}
            uid={venue.uid}
            imageSrc="/images/landing.jpg"
            name={venue.name}
            location={venue.location}
            availability={venue.availability}
            sport={venue.sport}
          />
        ))}
      </div>
    </section>
  );
};

export default venues;
venues.auth = true;
