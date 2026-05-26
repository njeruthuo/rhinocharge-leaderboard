// import SafariLeaderBoard from "@/pages/SafariLeaderBoard";
import { useLoginMutation } from "@/state/authApi";
import { useEffect } from "react";
import AppRouter from "./AppRouter";

export default function App() {
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    login()
      .unwrap()
      .catch((err) => console.error("Auto-login failed:", err));
  }, [login]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return <AppRouter />;
}
