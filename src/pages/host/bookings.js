
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import {useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function dashboard() {
  const axiosAuth = useAxiosAuth();

  const { status, data: session } = useSession();

  const [uid, setUID] = useState();

  const [venueBookings, setVenueBookings] = useState([]);
  const [activityBookings, setActivityBookings] = useState([]);

  useEffect(() => {
    if (session?.user?.uid) setUID(session.user.uid);
  }, [session]);

  const fetchBookingDetails = async () => {
    try {
      const { data: response } = await axiosAuth.get(
        `/host/bookings?host_id=${uid}`
      );
      setVenueBookings(response?.data?.venueBookings || []);
      setActivityBookings(response?.data?.activityBookings || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (uid) {
      fetchBookingDetails();
    }
  }, [uid]);

  const getDateString = (date) => {
    let d = new Date(date);
    return d.toLocaleDateString();
  };

  const CollapsibleSection = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className="mb-4">
        <button
          className="text-blue-500 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Hide' : 'Show'} {title}
        </button>
        {isOpen && (
          <div className="mt-2">
            {children}
          </div>
        )}
      </div>
    );
  };

  const VenueBooking = ({ name:venueName, location, upcoming_bookings, prev_bookings }) => (
    <div className="mb-8" key={venueName}>
      <h1 className="text-xl font-bold mb-2">{venueName}</h1>
      <p className="text-gray-600">{location}</p>
  
      <CollapsibleSection title="Upcoming Bookings">
        {upcoming_bookings?.map(({ email, username, booking_time_slot, booking_date }, index) => (
          <div key={index} className="mb-4">
            <p>Customer Username: {username}</p>
            <p>Booked Time slot: {booking_time_slot} on {getDateString(booking_date)}</p>
            <p>Customer Email: <a href={`mailto:${email}`} className="text-blue-500">{email}</a></p>
          </div>
        ))}
      </CollapsibleSection>
  
      <CollapsibleSection title="Previous Bookings">
        {prev_bookings?.map(({ email, username, booking_time_slot, booking_date }, index) => (
          <div key={index} className="mb-4">
            <p>Customer Username: {username}</p>
            <p>Booked Time slot: {booking_time_slot} on {getDateString(booking_date)}</p>
            <p>Customer Email: <a href={`mailto:${email}`} className="text-blue-500">{email}</a></p>
          </div>
        ))}
      </CollapsibleSection>
    </div>
  );

  const ParticipantDetails = ({ participant_details }) => (
    <CollapsibleSection title="Registered Users List">
      <ul>
        {participant_details?.map(({ email, username }, innerIndex) => (
          <li key={innerIndex} className="mb-2">
            <p>Username: {username} | Email: {email}</p>
          </li>
        ))}
      </ul>
    </CollapsibleSection>
  );
  

  return (
    // <main className="pt-4">
    //   <title>Bookings</title>
    //   <section>
    //     <h2>Venue Bookings</h2>
    //     <section>
    //       {venueBookings?.map(
    //         ({
    //           name: venueName,
    //           location,
    //           upcoming_bookings,
    //           prev_bookings,
    //         }) => (
    //           <div>
    //             <h1>{venueName}</h1>
    //             <p>{location}</p>
    //             <h3>Upcoming Bookings</h3>
    //             <div>
    //               {upcoming_bookings?.map(
    //                 ({ email, username, booking_time_slot, booking_date }) => (
    //                   <div>
    //                     <p>Customer Username: {username}</p>
    //                     <p>
    //                       Booked Time slot: {booking_time_slot} on{" "}
    //                       {getDateString(booking_date)}
    //                     </p>
    //                     <p>
    //                       Customer Email:
    //                       <a href={`mailto:${email}`}>{email}</a>
    //                     </p>
    //                   </div>
    //                 )
    //               )}
    //             </div>
    //             <h3>Previous Bookings</h3>
    //             <div>
    //               {prev_bookings?.map(
    //                 ({ email, username, booking_time_slot, booking_date }) => (
    //                   <div>
    //                     <p>Customer Username: {username}</p>
    //                     <p>
    //                       Booked Time slot: {booking_time_slot} on{" "}
    //                       {getDateString(booking_date)}
    //                     </p>
    //                     <p>
    //                       Customer Email:
    //                       <a href={`mailto:${email}`}>{email}</a>
    //                     </p>
    //                   </div>
    //                 )
    //               )}
    //             </div>
    //           </div>
    //         )
    //       )}
    //     </section>
    //   </section>
    //   <section>
    //     <h2>Activity Bookings</h2>
    //     <section>
    //       <p>Upcoming Activity Bookings</p>
    //       {activityBookings?.upcomingActivities?.length !== 0 ? (
    //         <>
    //           {activityBookings?.upcomingActivities?.map(
    //             ({
    //               name: activityName,
    //               location,
    //               participantsLimit,
    //               participants_uids,
    //               date,
    //               time,
    //               participant_details,
    //             }) => (
    //               <section>
    //                 <p>{activityName}</p>
    //                 <p>{location}</p>
    //                 <p>Date:{date}</p>
    //                 <p>Time:{time}</p>
    //                 <p>
    //                   Registered: {participants_uids.length}/{participantsLimit}
    //                 </p>
    //                 <p>Registered Users List</p>
    //                 <ul>
    //                   {participant_details?.map(({ email, username }) => (
    //                     <div>
    //                       <p>
    //                         Username:{username} Email:{email}
    //                       </p>
    //                     </div>
    //                   ))}
    //                 </ul>
    //               </section>
    //             )
    //           )}
    //         </>
    //       ) : (
    //         <p>No Upcoming Activities</p>
    //       )}
    //     </section>
    //     <section>
    //       <p>Previous Activity Bookings</p>
    //       {activityBookings?.prevActivities?.length !== 0 ? (
    //         <>
    //           {activityBookings?.prevActivities?.map(
    //             ({
    //               name: activityName,
    //               location,
    //               participantsLimit,
    //               participants_uids,
    //               date,
    //               time,
    //               participant_details,
    //             }) => (
    //               <section>
    //                 <p>{activityName}</p>
    //                 <p>{location}</p>
    //                 <p>Date:{date}</p>
    //                 <p>Time:{time}</p>
    //                 <p>
    //                   Registered: {participants_uids.length}/{participantsLimit}
    //                 </p>
    //                 <p>Registered Users List</p>
    //                 <ul>
    //                   {participant_details?.map(({ email, username }) => (
    //                     <div>
    //                       <p>
    //                         Username:{username} Email:{email}
    //                       </p>
    //                     </div>
    //                   ))}
    //                 </ul>
    //               </section>
    //             )
    //           )}
    //         </>
    //       ) : (
    //         <p>No Prev Activities</p>
    //       )}
    //     </section>
    //   </section>
    // </main>
    <main className="pt-4">
  <title>Bookings</title>

  <section className="bg-gray-100 p-4">
    <h2 className="text-2xl font-bold mb-4">Venue Bookings</h2>
    {venueBookings?.map((booking) => (
      <VenueBooking {...booking} />
    ))}
  </section>

  <section className="bg-gray-100 p-4 mt-4">
    <h2 className="text-2xl font-bold mb-4">Activity Bookings</h2>

    <section>
      <p className="text-lg font-bold mb-2">Upcoming Activity Bookings</p>
      {activityBookings?.upcomingActivities?.length !== 0 ? (
        <>
          {activityBookings?.upcomingActivities?.map(({ name: activityName, location, participantsLimit, participants_uids, date, time, participant_details }, index) => (
            <section key={index} className="mb-8">
              <p className="text-xl font-bold mb-2">{activityName}</p>
              <p className="text-gray-600">{location}</p>
              <p>Date: {date}</p>
              <p>Time: {time}</p>
              <p className="text-green-600">Registered: {participants_uids.length}/{participantsLimit}</p>
              <p className="text-lg font-bold mb-2">Registered Users List</p>
              <ParticipantDetails participant_details={participant_details} />

            </section>
          ))}
        </>
      ) : (
        <p>No Upcoming Activities</p>
      )}
    </section>

    <section className="mt-4">
      <p className="text-lg font-bold mb-2">Previous Activity Bookings</p>
      {activityBookings?.prevActivities?.length !== 0 ? (
        <>
          {activityBookings?.prevActivities?.map(({ name: activityName, location, participantsLimit, participants_uids, date, time, participant_details }, index) => (
            <section key={index} className="mb-8">
              <p className="text-xl font-bold mb-2">{activityName}</p>
              <p className="text-gray-600">{location}</p>
              <p>Date: {date}</p>
              <p>Time: {time}</p>
              <p className="text-green-600">Registered: {participants_uids.length}/{participantsLimit}</p>
              <p className="text-lg font-bold mb-2">Registered Users List</p>
              <ParticipantDetails participant_details={participant_details} />
            </section>
          ))}
        </>
      ) : (
        <p>No Prev Activities</p>
      )}
    </section>
  </section>
</main>

  );
}
dashboard.auth = true;
