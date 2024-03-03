import { useRef, useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";

import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
export default function Home() {
  const axiosAuth = useAxiosAuth();

  const { status, data: session } = useSession();
  const [username, setUsername] = useState();
  const [uid, setUID] = useState();
  const router = useRouter();

  const [upcomingVenueBookings, setUpcomingVenueBookings] = useState([]);
  const [upcomingActivityBookings, setUpcomingActivityBookings] = useState([]);
  const [prevVenueBookings, setPrevVenueBookings] = useState([]);
  const [prevActivityBookings, setPrevActivityBookings] = useState([]);

  useEffect(() => {
    if (session?.user?.username) setUsername(session.user.username);
    if (session?.user?.uid) setUID(session.user.uid);
  }, [session]);

  const fetchBookingDetails = async () => {
    try {
      const { data: response } = await axiosAuth.get(
        `/customer/FetchVandA-details?custid=${uid}`
      );
      setUpcomingVenueBookings(response?.data?.upcoming_venues);
      setUpcomingActivityBookings(response?.data?.upcoming_activities);
      setPrevActivityBookings(response?.data?.prev_activities);
      setPrevVenueBookings(response?.data?.prev_venues);
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

  return (
    <main className="h-screen bg-landing bg-cover bg-no-repeat bg-center relative">
      <div className="m-4">
        <p className="ml-24 text-lg font-semibold mx-auto mb-4">
          {username ? `Hello ${username}` : ""}
        </p>
        {status === "authenticated" ? (
          <>
            <main className="container mx-auto mt-8">
              <section>
                <h1 className="text-2xl font-bold mb-4">Upcoming Bookings</h1>

                <section>
                  <p className="text-lg font-bold mb-2">Venues</p>

                  {upcomingVenueBookings?.length !== 0 ? (
                    <div className="space-y-4">
                      {upcomingVenueBookings.map(
                        ({
                          booking_date,
                          booking_time_slot,
                          name: venueName,
                          location,
                          sport,
                        }) => (
                          <div className="bg-white shadow-md p-4 rounded-md">
                            <p className="font-bold">Venue: {venueName}</p>
                            <p>Location: {location}</p>
                            <p>Sport: {sport}</p>
                            <p>
                              Date and Time: {booking_time_slot} on{" "}
                              {getDateString(booking_date)}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p>No Upcoming Venue Bookings</p>
                  )}
                </section>

                <section className="mt-4">
                  <p className="text-lg font-bold mb-2">Activities</p>

                  {upcomingActivityBookings?.length !== 0 ? (
                    <div className="space-y-4">
                      {upcomingActivityBookings.map(
                        ({
                          date,
                          time,
                          name: activityName,
                          location,
                          description,
                          sport,
                        }) => (
                          <div className="bg-white shadow-md p-4 rounded-md">
                            <p className="font-bold">{activityName}</p>
                            <p>Location: {location}</p>
                            <p>Sport: {sport}</p>
                            <p>Description: {description} </p>
                            <p>
                              Date and Time: {time} on {getDateString(date)}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p>No Upcoming Activity Bookings</p>
                  )}
                </section>
              </section>

              <section className="mt-8">
                <h1 className="text-2xl font-bold mb-4">Past Bookings</h1>

                <section>
                  <p className="text-lg font-bold mb-2">Venues</p>

                  {prevVenueBookings?.length !== 0 ? (
                    <div className="space-y-4">
                      {prevVenueBookings.map(
                        ({
                          booking_date,
                          booking_time_slot,
                          name: venueName,
                          location,
                          sport,
                        }) => (
                          <div className="bg-white shadow-md p-4 rounded-md">
                            <p className="font-bold">Venue: {venueName}</p>
                            <p>Location: {location}</p>
                            <p>Sport: {sport}</p>
                            <p>
                              Date and Time: {booking_time_slot} on{" "}
                              {getDateString(booking_date)}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p>No Past Venue Bookings</p>
                  )}
                </section>

                <section className="mt-4">
                  <p className="text-lg font-bold mb-2">Activities</p>

                  {prevActivityBookings?.length !== 0 ? (
                    <div className="space-y-4">
                      {prevActivityBookings.map(
                        ({
                          date,
                          time,
                          name: activityName,
                          location,
                          description,
                          sport,
                        }) => (
                          <div className="bg-white shadow-md p-4 rounded-md">
                            <p className="font-bold">{activityName}</p>
                            <p>Location: {location}</p>
                            <p>Sport: {sport}</p>
                            <p>Description: {description} </p>
                            <p>
                              Date and Time: {time} on {getDateString(date)}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p>No Past Activity Bookings</p>
                  )}
                </section>
              </section>
            </main>
            ;
          </>
        ) : (
          <section className="text-gray-600 body-font">
            <div className="bg-red mx-auto flex px-10 py-24 md:flex-row items-center">
              <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
                <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
                  Event Management System
                </h1>
                <p className="mb-8 leading-relaxed">
                  Event, Venue and Activity Management System is a robust and
                  user-friendly platform designed to simplify the process of
                  discovering, reserving, and organizing venues and activities
                  for users. This system facilitates seamless connections
                  between venue owners and event participants, making it easy
                  for users to find the perfect place for their activities and
                  the like-minded individuals to engage with.
                </p>
                <div className="flex justify-center">
                  <button
                    className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                    onClick={() => router.push("/auth/sign-in")}
                  >
                    Sign in
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

Home.Layout = "landing";
Home.auth = false;
