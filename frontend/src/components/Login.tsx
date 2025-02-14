import { SignIn, SignUp, useClerk } from "@clerk/clerk-react";
import { useState } from "react";

export const Login=()=>{
  const [isSignUp, setIsSignUp] = useState(false);
  const { redirectToSignIn } = useClerk();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h2>

        {isSignUp ? <SignUp afterSignInUrl="/" /> : <SignIn afterSignInUrl="/" />}

        <p className="text-center mt-4">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500 hover:underline"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}

