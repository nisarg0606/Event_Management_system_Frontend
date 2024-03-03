import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

import instance from "@/lib/axios";

const nextAuthOptions = (req, res) => {
  return {
    providers: [
      CredentialsProvider({
        async authorize(credentials) {
          let signInResponse = null;
          await instance
            .post("/auth/sign-in", {
              email: credentials?.email,
              password: credentials?.password,
            })
            .then((response) => {
              //Add Refresh Token to Cookie
              const cookies = response.headers.get("set-cookie");
              res.setHeader("Set-Cookie", cookies);

              if (response.data.user) {
                let user = {
                  ...response.data.user,
                  accessToken: response.data.accessToken,
                };
                signInResponse = user;
                return user;
              } else {
                return null;
              }
            })
            .catch((err) => {
              console.log(err);
              return null;
            });

          return signInResponse;
        },
      }),
      GoogleProvider({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        
      }),
    ],
    callbacks: {

      jwt: async ({ token, profile, account, user }) => {    
        if (user) {
          //For OAuth
          let userData = {}
          if (account?.provider === "google") {
            const googleAuthData = {
              username: profile.name.replaceAll(" ", "_"),
              email: profile.email,
              token:process.env.CLIENT_ID
              // role: credentials?.role || "Host"
            };
            userData = await instance
              .post("/auth/oauth-sign-in", googleAuthData)
              .then((response) => {
                //Add Refresh Token to Cookie
                const cookies = response.headers.get("set-cookie");
                res.setHeader("Set-Cookie", cookies);
  
                if (response.data.user) {
                  user = {
                    ...response.data.user,
                    accessToken: response.data.accessToken,
                  };
                  return user;
                } else {
                  return {};
                }
              })
              .catch(async(err) => {
                console.log(err);
                await axios.post("/api/auth/signout",{callbacks:"/"})
                return {error:"Token Error"};
              });
          }

          user = {...user,...userData}
          token.id = user.id;
          token.user = user;
        }
        return token;
      },
      session: async ({ session, token }) => {
        if (token) {
          session.id = token.id;
          session.user = token.user;
        }
        return session;
      },
    },
    session: {
      // strategy: "jwt",
      maxAge: 1 * 24 * 60 * 60, // 1day
    },
  };
};

export default (req, res) => {
  return NextAuth(req, res, nextAuthOptions(req, res));
};
