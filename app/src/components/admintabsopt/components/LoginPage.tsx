import { ADMIN_PASSWORD, ADMIN_USERNAME } from "@/constants";
import { useState } from "react";

const LoginPage = ({
  setIsAuthenticated,
}: {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError("Invalid username or password");
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "#fff",
        backgroundImage:
          "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(217,119,6,0.018) 39px,rgba(217,119,6,0.018) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(217,119,6,0.018) 39px,rgba(217,119,6,0.018) 40px)",
      }}
    >
      <div
        className="w-full max-w-md rounded-xl border p-8 shadow-sm"
        style={{
          borderColor: "rgba(217,119,6,0.25)",
          background: "#FBF9E7",
        }}
      >
        <div className="mb-6 text-center">
          <h2
            className="text-2xl font-black tracking-wider uppercase mb-1"
            style={{
              fontFamily: "'Oswald', sans-serif",
              color: "#716969",
            }}
          >
            Rhino Charge 2026
          </h2>
          <p
            className="text-[10px] uppercase tracking-[0.25em]"
            style={{ color: "#57534e" }}
          >
            Admin Gateway
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label
              className="block text-[10px] font-bold tracking-[0.15em] uppercase mb-1.5"
              style={{
                fontFamily: "'Oswald', sans-serif",
                color: "#57534e",
              }}
            >
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg text-base outline-none border transition-colors"
              style={{
                background: "#fff",
                borderColor: "rgba(217,119,6,0.2)",
                color: "#292524",
              }}
            />
          </div>

          <div>
            <label
              className="block text-[10px] font-bold tracking-[0.15em] uppercase mb-1.5"
              style={{
                fontFamily: "'Oswald', sans-serif",
                color: "#57534e",
              }}
            >
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg text-base outline-none border transition-colors"
              style={{
                background: "#fff",
                borderColor: "rgba(217,119,6,0.2)",
                color: "#292524",
              }}
            />
          </div>

          {authError && (
            <div
              className="text-xs font-bold uppercase tracking-wider text-center py-2 px-3 rounded-md"
              style={{
                fontFamily: "'Oswald', sans-serif",
                background: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              {authError}
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-lg text-[11px] font-black tracking-[0.2em] uppercase transition-all cursor-pointer text-center"
            style={{
              fontFamily: "'Oswald', sans-serif",
              background: "rgba(28,25,23,0.85)",
              color: "#FCFCFC",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
};
export default LoginPage;
