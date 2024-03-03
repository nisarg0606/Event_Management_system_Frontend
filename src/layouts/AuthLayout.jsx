import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

const AuthLayout = ({ children }) => {
  const router = useRouter();
  const { status, data: session } = useSession();
  if (status === "authenticated") {
    //If user tries to access login page after logging in
    let userRole = session?.data?.role;
    if (userRole === "Host") router.push("/host");
    else if (userRole === "Customer") router.push("/customer/dashboard");
    else router.push("/");
  }
  return (
    <main>
      <header>
        <p className="text-4xl p-2">Event Venue Management</p>
      </header>
      {children}
    </main>
  );
};

export default AuthLayout;
