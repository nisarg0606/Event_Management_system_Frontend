import React from 'react';
import { useRouter } from 'next/router';

const HostVenueCard = ({ uid,imageSrc, name, location, availability, sport }) => {
  const router = useRouter()
  const handleVenueDetails = () => {
    router.push({
      pathname: "/host/venues/view/[uid]",
      query: { uid: uid },
    });
  };
  return (
    <div className="max-w-md rounded overflow-hidden shadow-lg">
      <img src={imageSrc} alt={name} className="w-full h-48 object-cover" />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{name}</div>
        <p className="text-gray-700 text-base mb-2">{location}</p>
        <p className="text-gray-700 text-base mb-2">Availability: {availability?"Open":"Closed"}</p>
        <p className="text-gray-700 text-base">Sport: {sport}</p>
        <button onClick={handleVenueDetails}>View Details</button>
      </div>
    </div>
  );
};

export default HostVenueCard;
