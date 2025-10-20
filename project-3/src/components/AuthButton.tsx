import { defaultButton } from "../app/styles";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

/**
 * AuthButton component for handling sign-in and sign-out actions.
 * @param {Object} props - Props for the AuthButton component.
 * @param {boolean} props.serverSession - Flag indicating whether the session is on the server.
 * @returns {JSX.Element} - Rendered AuthButton component.
 */
export default function AuthButton({ serverSession }) {
  const { data: session } = useSession();
  /**
  * Handles sign-in action using Google authentication.
  */
  const handleSignIn = async () => {
    try {
      // Sign in using Google authentication
      await signIn("google");

      // After authentication, perform actions with user data
      // Example: Fetch user data and perform additional logic
      // const userData = await fetchUserData();
      // performAdditionalActions(userData);
      console.log("session", session);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };
  /**
  * Handles sign-out action.
  */
  const handleSignOut = () => {
    signOut(); // Sign out the user
  };

  return serverSession ? (
    <button onClick={handleSignOut} className={defaultButton}>Sign Out</button>
  ) : (
    <button onClick={handleSignIn} className={defaultButton}>Sign In</button>
  );
}
