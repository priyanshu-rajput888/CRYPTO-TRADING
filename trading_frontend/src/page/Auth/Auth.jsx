import React from "react";
import "./Auth.css";
import SignupForm from "./SignupForm";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import ForgotPassrordForm from "./ForgotPasswordForm";
import SigninForm from "./SigninForm";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="h-screen relative authContainer">
      <div className="absolute top-0 bottom-0 right-0 left-0 bg-[#030712]/50">
        <div className="bgBlure absolute top-1/2 left-1/2 flex h-[35rem] w-[30rem] max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-md bg-black/50 px-10 text-white shadow-2xl shadow-white">
          <h1 className="text-6xl font-bold pb-9">NexTrade</h1>

          {location.pathname == "/signup" ? (
            <section className="w-full"> 
              <SignupForm />
              <div className="mt-4 flex items-center justify-center gap-2">
                <span>Already have account?</span>
                <Button
                  className="bg-[#A000C8] text-white hover:bg-[#8700A8]"
                  onClick={() => navigate("/signin")}
                >
                  Signin
                </Button>
              </div>
            </section>
          ) : location.pathname == "/forgot-password" ? (
            <section className="w-full">
              <ForgotPassrordForm />


                <div className="mt-4 flex items-center justify-center gap-2">
                    <span>Back to login</span>
                    <Button
                      className="bg-[#A000C8] text-white hover:bg-[#8700A8]"
                      onClick={() => navigate("/signin")}
                    >
                    Signin
                    </Button>
                </div>


            </section>
          ) : (
            <section className="w-full">
              <SigninForm />


                <div className="mt-4 flex items-center justify-center gap-2">
                    <span>Don't have account?</span>
                    <Button
                      className="bg-[#A000C8] text-white hover:bg-[#8700A8]"
                      onClick={() => navigate("/signup")}
                    >
                    Signup
                    </Button>
                </div>


                 <div className="mt-10">
                    <Button
                    className="w-full bg-[#A000C8] py-5 text-white hover:bg-[#8700A8]"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot password
                    </Button>
                </div>


            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
