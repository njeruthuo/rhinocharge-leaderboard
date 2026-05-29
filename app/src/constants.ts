import spinner from "@/assets/progress_activity_24dp_434343_FILL0_wght400_GRAD0_opsz24.svg";
import lock from "@/assets/lock-person.svg";
import home from "@/assets/home_app_logo.svg";
import tune from "@/assets/tune.svg";
import flag from "@/assets/flag_circle.png";
import car from "@/assets/car.svg";
import star from "@/assets/star.svg";
import banner from "@/assets/banner.jpeg";

export const BASE_URL = import.meta.env.VITE_APP_BASE;
export const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME;
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

export const BASE_REFETCH_INTERVAL = import.meta.env.VITE_BASE_REFETCH_INTERVAL;

export const ADMIN_PAGE_CLICKS = import.meta.env.VITE_ADMIN_PAGE_CLICKS;

export { spinner, lock, home, tune, flag, car, star, banner };

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

export const permanentColors = {
  start: "bg-[#D81159]", // Hot Magenta
  active: "bg-[#00A8E8]", // Electric Cyan
  pending: "bg-amber-500", // Vivid Amber
  complete: "bg-[#00BB95]", // Neon Jade
  finish: "bg-[#7209B7]", // Royal Indigo
};

export const MY_GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
export const MY_GOOGLE_MAP_PUBLIC_ID = import.meta.env
  .VITE_GOOGLE_MAP_PUBLIC_ID;
