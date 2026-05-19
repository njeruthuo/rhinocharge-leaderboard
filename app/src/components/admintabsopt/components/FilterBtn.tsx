import type { FilterTypes } from "@/state/types";

const FilterBtn = ({
  value,
  label,
  setFilter,
  filter,
}: {
  value: typeof filter;
  label: string;
  filter: string;
  setFilter: React.Dispatch<FilterTypes>;
}) => (
  <button
    onClick={() => setFilter(value as FilterTypes)}
    className="px-3 py-2 rounded-lg text-[10px] font-bold tracking-[0.15em] uppercase transition-all"
    style={{
      fontFamily: "'Oswald', sans-serif",
      background: filter === value ? "#FBF9E7" : "rgba(28,25,23,0.7)",
      border: `1px solid ${filter === value ? "rgba(217,119,6,0.4)" : "rgba(255,255,255,0.06)"}`,
      color: filter === value ? "rgba(28,25,23,0.7)" : "#FCFCFC",
    }}
  >
    {label}
  </button>
);

export default FilterBtn;
