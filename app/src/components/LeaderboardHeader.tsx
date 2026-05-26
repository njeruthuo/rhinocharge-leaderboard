import { lock } from "@/constants";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LeaderboardHeader = () => {
  // const [clicks, setClicks] = useState(0);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleOpenAdmin = () => {
    navigate("/management/admin");
  };

  return (
    <div className="mb-4 flex place-content-start">
      <div>
        <div
          className="text-2xl select-none sm:text-4xl font-black text-[#716969] leading-none mb-1"
          style={{
            fontFamily: "'Oswald', sans-serif",
            letterSpacing: "0.04em",
          }}
          // onClick={handleOpenAdmin}
        >
          Rhino Charge 2026
        </div>
        <div className="text-stone-500 text-xs tracking-widest uppercase flex space-x-3 my-3">
          <div
            className="hover:cursor-pointer select-none"
            onClick={() => {
              if (pathname === "/maps") navigate("/");
            }}
          >
            Overall Leaderboard
          </div>
          <span>|</span>
          <div
            className="hover:cursor-pointer select-none"
            onClick={() => {
              if (pathname === "/") navigate("/maps");
            }}
          >
            View Live Maps
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap ml-auto">
        <span className="hover:cursor-pointer" onClick={handleOpenAdmin}>
          <img src={lock} alt="" />
        </span>

        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
          style={{
            borderColor: "rgba(239, 68, 68, 0.2)",
            background: "rgba(239, 68, 68, 0.05)",
          }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse bg-red-400 shadow-[0_0_8px_rgba(34,197,94,0.7)]" />

          <span
            className="text-[10px] font-bold tracking-widest uppercase text-red-400"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Live
          </span>
        </div>
      </div>
    </div>
  );
};
export default LeaderboardHeader;
