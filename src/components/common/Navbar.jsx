import react, { useState, useEffect} from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";


const Navbar = () => {
  const router = useRouter();
  const { status, data: session } = useSession();

  const [userRole, setUserRole] = useState("");

  // sets user role.
  useEffect(() => {
    if (session?.user?.role) setUserRole(session.user.role);
  }, [session]);

  let CustomerNavOptions = [
    {
      label: "Home",
      action: () => {
        router.push("/");
      },
    },
    {
      label: "Dashboard",
      action: () => {
        router.push("/customer/dashboard");
      },
    },
    {
      label: "Profile",
      action: () => {
        router.push("/customer/profile");
      },
    },
  ];

  let HostNavOptions = [
      // {
      //   label: "Home",
      //   action: () => {
      //     router.push("/");
      //   },
      // },
    {
      label: "Dashboard",
      action: () => {
        router.push("/host");
      },
    },
    {
      label: "Profile",
      action: () => {
        router.push("/host/profile");
      },
    },
  ];

  return (
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="square"
            strokeLinejoin="square"
            strokeWidth="3"
            className="w-10 h-10 text-white p-2 bg-indigo-600 squared-full"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-xl">Event Management System</span>
        </a>
        <nav className="md:ml-auto /flex flex-wrap items-center text-base justify-center">
          {status =="authenticated"?
          <>
          {userRole == "Host" ? (
            <>
              {HostNavOptions.map(({label,action})=>
              <a
              className="mr-5 hover:text-gray-900 cursor-pointer"
              onClick={() => action()}
            >
              {label}
            </a>)}
            </>
          ) : (
            <>
              {CustomerNavOptions.map(({label,action})=>
              <a
              className="mr-5 hover:text-gray-900 cursor-pointer"
              onClick={() => action()}
            >
              {label}
            </a>)}
            </>
          )}
          {status === "authenticated" ? (
            <a className="mr-5 hover:text-gray-900 cursor-pointer" onClick={() => signOut()}>
              Logout
            </a>
          ) : null}
          </>
          :
          <>
           <a className="mr-5 hover:text-gray-900 cursor-pointer" onClick={() => router.push("/auth/sign-in")}>
              Sign In
            </a>
          </>
          }
          
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
