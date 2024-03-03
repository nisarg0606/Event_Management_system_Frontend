import ErrorToaster from "@/lib/Toasters/ErrorToaster";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useRef, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import QRCode from "qrcode";
import instance from "@/lib/axios";

export default function Dashboard() {
  const axiosAuth = useAxiosAuth();
  const { status, data: session } = useSession();
  const [peopleDetails, setPeopleDetails] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [uid, setUID] = useState();

  const fetchPeopleDetailsWithoutSearch = async () => {
    try {
      const { data: response } = await axiosAuth.get(
        `/customer/people?customer_id=${uid}&searchQuery=`
      );
      setPeopleDetails(() => response?.data?.people || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchPeopleDetailsWithSearch = async (query) => {
    try {
      const { data: response } = await axiosAuth.get(
        `/customer/people?customer_id=${uid}&searchQuery=${query}`
      );
      setPeopleDetails(response?.data?.people || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (session?.user?.uid) setUID(session.user.uid);
  }, [session]);

  useEffect(() => {
    if (uid) {
      if (searchQuery?.length !== 0) {
        console.log("search query changed");
        fetchPeopleDetailsWithSearch(searchQuery);
      } else {
        fetchPeopleDetailsWithoutSearch();
      }
    }
  }, [uid, searchQuery]);

  return (
    <main className="container mx-auto mt-4 p-4">
      <title>People</title>
      <h1 className="text-3xl font-bold mb-4">People</h1>
      <input
        name="search"
        type="search"
        placeholder="Search Username"
        value={searchQuery}
        onChange={(event) => setSearchQuery(() => event.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            setSearchQuery(() => event.target.value);
            if (e.target.value) fetchPeopleDetailsWithSearch(e.target.value);
            else fetchPeopleDetailsWithoutSearch();
          }
        }}
        className="border p-2 rounded-md mb-4"
      />
      <div>
        {peopleDetails?.length !== 0 ? (
          <>
            {peopleDetails?.map(({ email, username, interested_sports }) => (
              <div
                key={username}
                className="bg-white p-4 mb-4 rounded-md shadow-md"
              >
                <p className="text-lg font-semibold">{username}</p>
                <p>
                  Email:
                  <a href={`mailto:${email}`}>{email}</a>
                </p>
                <p>Interested Sports: {interested_sports.join(", ")}</p>
              </div>
            ))}
          </>
        ) : (
          <p>No users found!</p>
        )}
      </div>
    </main>
  );
}

Dashboard.auth = true;
