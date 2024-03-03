import React, { useEffect } from 'react';
import { useRouter } from "next/router";

const VenueCard = ({ imageSrc, name, location, availability, sport, timings, id }) => {
  const router = useRouter();

  const handleVenueDetails = () => {
    router.push({
      pathname: "/customer/venue/[venueID]",
      query: { venueID: id },
    });
  };

  return (
    <div className="max-w-md rounded overflow-hidden shadow-lg">
      <img src={imageSrc} alt={name} className="w-full h-48 object-cover" />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{name}</div>
        <p className="text-gray-700 text-base mb-2">{location}</p>
        <p className="text-gray-700 text-base mb-2">Availability: {availability ? "Open" : "Closed"}</p>
        <p className="text-gray-700 text-base">Sport: {sport}</p>
        <h3 className="text-lg font-semibold mb-2">Timings</h3>
        <ul className="text-gray-700">
          {timings.map((timing, index) => (
            <li key={index}>
              {timing.timing}
            </li>
          ))}
        </ul>
        <button onClick={handleVenueDetails}>View Details</button>
      </div>
    </div>
  );
};

export default VenueCard;
