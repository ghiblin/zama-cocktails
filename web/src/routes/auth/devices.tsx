import { useGoogleLogin } from "@react-oauth/google";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function AuthDevices() {
  const [searchParams] = useSearchParams();

  const login = useGoogleLogin({
    flow: "implicit",
    // Google's authentication success
    onSuccess: async (credentials) => {
      const { access_token } = credentials;
      // Signin the user and retrieve their JWT Token
      const resp = await axios.post<{ token: string }>(
        `${import.meta.env.VITE_API_URL}/auth/signin`,
        { accessToken: access_token }
      );
      try {
        // Notify the CLI server about the completed authentication
        const url = new URL(searchParams.get("redirect")!);
        url.searchParams.append("jwt", resp.data.token);
        await fetch(url.toString());
      } catch (error) {
        console.error(`something went wrong: ${error}`);
      }
    },
    // Google's authentication failed
    onError: async () => {
      // Notify the CLI server about the error
      await fetch(searchParams.get("redirect")!);
    },
  });

  if (!searchParams.has("redirect")) {
    return (
      <div>
        <h1>Error</h1>
        <i>Missing redirect parameter</i>
      </div>
    );
  }

  return (
    <div className="w">
      <h1>Google Login</h1>
      <br />
      <br />
      <Button variant="outline" onClick={() => login()}>
        Sign in with Google
      </Button>
    </div>
  );
}
