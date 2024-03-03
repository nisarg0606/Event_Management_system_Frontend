import React from "react";
import { useRef, useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

import instance from "@/lib/axios";

import ErrorToaster from "@/lib/Toasters/ErrorToaster";
import SuccessToaster from "@/lib/Toasters/SuccessToaster";

const SignUp = () => {
  const { status, data: session } = useSession();
  const router = useRouter();
  const [error, setError] = useState(false);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordConfRef = useRef(null);

  const [username, setUsername] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [confirmPassword,setConfirmPassword] = useState("")


  const [userRole, setUserRole] = useState("");
  // sets user role.
  useEffect(() => {
    if (session?.user?.role) setUserRole(session.user.role);
  }, [session]);

  useEffect(() => {
    if (status === "authenticated" && userRole === "Customer")
      router.push("/customer/dashboard");
    if (status === "authenticated" && userRole === "Host") router.push("/host");
  }, [userRole]);

//   const input = React.forwardRef((props, ref) => (
//     <input ref={ref} {...props} />
//   ));

  const inputValidator = () => {
    if (username.length <= 1) {
      ErrorToaster("Name must be atleast 2 characters long");
      nameRef.current.focus();
      return false;
    }
    if (password !== confirmPassword) {
      ErrorToaster("Password confirmation doesn't match Password");
      passwordConfRef.current.focus();
      return false;
    }

    return true;
  };

  const [selectedOption, setSelectedOption] = useState("No");
  const [selectedRole, setSelectedRole] = useState("Customer")
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(()=>{
    if( selectedOption === "Yes")
    setSelectedRole("Host")
    if(selectedOption === "No")
    setSelectedRole("Customer")
  },[selectedOption])


  const loginHandler = async (e) => {
    e.preventDefault();
    const isInputValidated = inputValidator();

    if (isInputValidated) {
      let reqBody = {
        username: username,
        email: email,
        password: password,
        role:selectedRole || "Customer",
      };

      await instance
        .post("/auth/sign-up", reqBody)
        .then(async (res) => {
          SuccessToaster("Succesfully Signed Up!");
          const { error } = await signIn("credentials", {
            redirect: false,
            email: email,
            password: password,
            role:selectedRole || "Customer",
            callbackUrl: `${
              res?.data?.user?.role == "Host" ? "/host" : "/customer/dashboard"
            }`,
          });
          if (error) {
            setError(error);
            console.log(error)
            ErrorToaster(
              "There has been an error logging In. Please try Again"
            );
          }
        })
        .catch((err) => {
          console.log(err.response);
          if (err.response?.data?.error) ErrorToaster(err.response.data.error);
          else ErrorToaster("There has been an error. Please try again!");
        });
    }
  };
  return (
    <>
      {status === "unauthenticated" && (
        <div className="container flex mt-16 w-screen max-w-none">
          <section className="m-auto h-100 w-80">
            <p className="text-4xl font-bold mb-12">Sign Up!</p>
            <form
              className="flex-column justify-center"
              onSubmit={(e) => loginHandler(e)}
            >
              <div className="mb-2">
                <label htmlFor="Username" className="block">
                  Username*
                </label>
                <input
                  className="block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                  placeholder="Enter your Username"
                  name="Username"
                  type="text"
                  value={username}
                  onChange={(e)=>{setUsername(e.target.value)}}
                  ref={nameRef}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="email" className="block">
                  Email*
                </label>
                <input
                  className="block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                  placeholder="Email"
                  name="email"
                  type="email"
                  value = {email}
                  onChange={(e)=>{setEmail(e.target.value)}}
                  
                />
              </div>
              <div className="mb-2">
                <label htmlFor="password" className="block">
                  Password*
                </label>
                <input
                  className="block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                  placeholder="Enter your Password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e)=>{setPassword(e.target.value)}}
                //   ref={passwordRef}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="PasswordConf" className="block">
                  Confirm Password*
                </label>
                <input
                  className="block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                  placeholder="Re-enter your Password"
                  name="PasswordConf"
                  type="password"
                  value={confirmPassword}
                  onChange={(e)=>{setConfirmPassword(e.target.value)}}
                  ref={passwordConfRef}
                />
              </div>

              <div className="mb-2 space-x-4">
                <label className="block mb-1">
                  Are you a venue host?
                </label>

                <div className="flex space-x-2 items-center">
                  <label className="inline-flex items-center space-x-2">
                    <input
                      type="radio"
                      name="yesno"
                      value="Yes"
                      checked={selectedOption === "Yes"}
                      onChange={(e)=> setSelectedOption(e.target.value)}
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <span className="text-gray-700 font-medium">Yes</span>
                  </label>

                  <label className="inline-flex items-center space-x-2">
                    <input
                      type="radio"
                      name="yesno"
                      value="No"
                      checked={selectedOption === "No"}
                      onChange={(e)=> setSelectedOption(e.target.value)}
                      className="form-radio h-5 w-5 text-red-600"
                    />
                    <span className="text-gray-700 font-medium">No</span>
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="button submit"
                  className="text-white w-full mt-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Sign Up
                </button>
                <div className="flex items-center justify-center my-4">
                  <div className="border-t border-gray-300 flex-grow"></div>
                  <div className="mx-2 text-gray-500 font-semibold">OR</div>
                  <div className="border-t border-gray-300 flex-grow"></div>
                </div>

                <button 
                disabled = {selectedRole === "Host"}
                onClick={()=>{signIn('google',{role:selectedRole||"Customer"})}}
                className={`flex justify-center border w-full ${
                    selectedRole === "Host" ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "border-gray-300 text-gray-600"
                  } font-semibold py-2 px-4 rounded-md flex items-center space-x-2`}
            //    className=" flex justify-center border w-full border-gray-300 text-gray-600 font-semibold py-2 px-4 rounded-md flex items-center space-x-2"
            >
                  <img src="/icons/google-icon.svg" height="20" width="20" />
                  <span>Sign up with Google</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
};

SignUp.Layout = "auth";
export default SignUp;
