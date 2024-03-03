import { useRef, useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import ErrorToaster from "@/lib/Toasters/ErrorToaster";
import ReCAPTCHA from "react-google-recaptcha";
import instance from "@/lib/axios";

import TwoFAmodal from "@/components/modals/TwoFAmodal";

const SignIn = () => {
  const userRef = useRef();

  const captchaRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("");

  const [uid,setUID] = useState("")

  const [show2FAmodal, setShow2FAmodal] = useState(false);

  const [captchaVerificationResult, setCaptchaVerificationResult] =
    useState(null);

  const { status, data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  // sets user role.
  useEffect(() => {
    if (session?.user?.role) setUserRole(session.user.role);
  }, [session]);

  //routes autnenticated user to landing page
  useEffect(() => {
    if (status === "authenticated" && userRole === "Customer")
      router.push("/customer/dashboard");
    if (status === "authenticated" && userRole === "Host") router.push("/host");
  }, [userRole]);

  const get2FAstatus = async () => {
    return await instance
      .get(`/auth/2FA-check?email=${email}&password=${password}`)
      .then(({ data: response }) => {
        //Add Refresh Token to Cooki
        if (response?.data?.TwoFactorAuth) {
          return response?.data?.uid;
        } else {
          return null;
        }
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (captchaVerificationResult) {
      let is2FAenabled = await get2FAstatus();
      if (is2FAenabled == null) {
        const { error } = await signIn("credentials", {
          redirect: false,
          email: email,
          password: password,
        });
        // if login failed
        if (error) {
          ErrorToaster("Login Failed");
        }
      } else {
        setUID(()=>is2FAenabled)
        setShow2FAmodal(()=>true)
      }
    } else {
      ErrorToaster("reCAPTCHA Verification Error");
    }
    // setEmail("");
    // setPassword("");
    //resets captcha on form submit.
    captchaRef.current.reset();
    setCaptchaVerificationResult(false);
  };

  const captchaUpdate = async (e) => {
    const captchaValue = captchaRef.current.getValue();

    if (captchaValue) {
      //verify captcha via server.

      await instance
        .get(`/auth/verify?captchaValue=${captchaValue}`)
        .then(({ data: response }) => {
          setCaptchaVerificationResult(response?.success);
        })
        .catch((err) => ErrorToaster("reCAPTCHA Verification Error"));
    }
  };
  
  const signInWithout2FA = async () =>{
    const { error } = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      });
      // if login failed
      if (error) {
        ErrorToaster("Login Failed");
      }
  }

  return (
    <>
      <section>
        {/* sign-in page below */}
        <title>Customer Sign In</title>
        <div className="pt-12 flex items-center justify-start h-screen flex-col">
          <div className="flex flex-col">
            <h2 className="text-4xl font-bold mb-12 text-left">Sign In!</h2>
          </div>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <label className="font-bold" htmlFor="email">
              Email:{" "}
            </label>
            <input
              className="border border-black rounded-md m-1 p-1 w-80"
              type="text"
              id="email"
              placeholder="Enter email"
              ref={userRef}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <label className="font-bold" htmlFor="password">
              Password:{" "}
            </label>
            <input
              className="border border-black rounded-md m-1 p-1 w-80"
              type="password"
              id="password"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <a
              className="font-bold text-blue-700 hover:text-blue-800 hover:underline active:text-blue-900 text-right"
              href="#"
            >
              Forgot Password?
            </a>

            <ReCAPTCHA
              className="pt-5"
              size="normal"
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              ref={captchaRef}
              onChange={captchaUpdate}
            />

            <button className="text-white w-80 m-1 mt-10 p-1 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
              Sign In
            </button>
          </form>

          <div className="flex items-center justify-center m-.5">
            <div className="text-gray-500 font-semibold mb-1">OR</div>
          </div>

          <div className="border border-black rounded-md m-1 p-1 w-80 font-bold flex flex-row justify-center hover:bg-gray-200 active:bg-gray-300">
            <img src="/icons/google-icon.svg" height="20" width="20" />
            <button
              className="pl-3"
              onClick={() => {
                signIn("google", { role: "Customer" });
              }}
            >
              Sign in with google
            </button>
          </div>

          <p className="mt-10 m-1 p-1 font-bold">
            Don't have an account yet?{" "}
            <a
              className="text-blue-700 hover:text-blue-800 hover:underline active:text-blue-900"
              href="sign-up"
            >
              Sign Up
            </a>
          </p>
          {show2FAmodal && uid!=="" ? <TwoFAmodal 
          uid={uid}
          onRequestClose={()=>setShow2FAmodal(()=>false)}
          isOpen={show2FAmodal && uid!==""}
          on2FAsuccess={async ()=> await signInWithout2FA()}
          /> : null}
        </div>
      </section>
    </>
  );
};
SignIn.Layout = "auth";
export default SignIn;
