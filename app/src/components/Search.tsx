import type React from "react";

const Search = ({ search, setSearch }: SearchProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <div className="relative flex-1 min-w-48">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
          viewBox="0 0 16 16"
          fill="none"
          style={{ color: "#57534e" }}
        >
          <circle
            cx="6.5"
            cy="6.5"
            r="4.5"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <path
            d="M10 10l3 3"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by car no. or driver…"
          className="w-[650px] pl-9 pr-4 py-2 rounded-lg text-lg outline-none"
          style={{
            background: "#FBF9E7",
            border: "1px solid rgba(217,119,6,0.4)",
            color: "#000",
            fontFamily: "'Oswald', sans-serif",
          }}
        />
      </div>
    </div>
  );
};
export default Search;

interface SearchProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}
