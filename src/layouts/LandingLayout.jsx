import React from "react";
import Navbar from "@/components/common/Navbar";
import { useSession, signOut } from "next-auth/react";
import {useEffect} from "react" 

const LandingLayout = ({ children }) => {
  const { status, data: session } = useSession();

  useEffect(() => {
    if (typeof window !== "undefined" && status === "authenticated") {
      // Dynamically import the Kommunicate library when window is available
      // import("@kommunicate/kommunicate-chatbot-plugin")
      //   .then((Kommunicate) => {
      //     // Kommunicate.default.init("38cdb1d8d2b6d05ab27b2443745afb28b", {
      //     Kommunicate.default.init("1a5d3014eff5707ef1e24e0f235cb702b", {
      //       automaticChatOpenOnNavigation: false,
      //       popupWidget: false,
      //       email:session?.user?.email,
      //       userId:session?.user?.uid,
      //       userName:session?.user?.username
      //     });

      //   })
      //   .catch((error) => {
      //     console.error("Error importing Kommunicate:", error);
      //   });
    }
  }, []);
  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
};

// LandingLayout.auth = false;
export default LandingLayout;
