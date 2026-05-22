import spinner from "@/assets/progress_activity_24dp_434343_FILL0_wght400_GRAD0_opsz24.svg";
import lock from "@/assets/lock-person.svg";
import home from "@/assets/home_app_logo.svg";

export const BASE_URL = import.meta.env.VITE_APP_BASE;
export const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME;
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

export const ADMIN_PAGE_CLICKS = import.meta.env.VITE_ADMIN_PAGE_CLICKS;

export { spinner, lock, home };

export const colors = {
  pale: "bg-amber-600/40",
  bgPale: "bg-[#FDFAEC] border-[#F95738] border",

  primary: "text-[#000]",
  bgPrimary: "bg-[#fff]",
};

export const REFETCH_INTERVAL = 1 * 60 * 1000;
export const TD_V = 12;
export const TD_CELL: React.CSSProperties = {
  paddingTop: TD_V,
  paddingBottom: TD_V,
  verticalAlign: "middle",
};

// export const permanentColors = {
//   start: "bg-[#BF1363]",
//   complete: "bg-[#EF476F]",
//   active: "bg-sky-400",
//   pending: "bg-gray-300",
//   finish: "bg-[#7DDE92]",
// };
export const permanentColors = {
  start: "bg-[#D81159]", // Hot Magenta
  active: "bg-[#00A8E8]", // Electric Cyan
  pending: "bg-amber-500", // Vivid Amber
  complete: "bg-[#00BB95]", // Neon Jade
  finish: "bg-[#7209B7]", // Royal Indigo
};
