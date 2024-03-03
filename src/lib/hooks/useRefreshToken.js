"use client";
import instance from "@/lib/axios";
import { useSession, signOut } from "next-auth/react";

export const useRefreshToken = () => {
  const { data: session } = useSession();

  const refreshToken = async () => {
    console.log("Token is getting refreshed");
    await instance
      .post(
        "/auth/refresh-accessToken",
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (session) session.user.accessToken = res.data.accessToken;
      })
      .catch((err) => {
        console.log("axios error refreshToken", err);
        signOut();
      });
  };
  return refreshToken;
};

// export default useRefreshToken
