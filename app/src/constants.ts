import spinner from "@/assets/progress_activity_24dp_434343_FILL0_wght400_GRAD0_opsz24.svg";
import lock from "@/assets/lock-person.svg";

export const BASE_URL = import.meta.env.VITE_APP_BASE;
export const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME;
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

export const ADMIN_PAGE_CLICKS = import.meta.env.VITE_ADMIN_PAGE_CLICKS;

export { spinner, lock };

export const colors = {
  pale: "bg-amber-600/40",
  bgPale: "bg-[#FDFAEC] border-[#F95738] border",

  primary: "text-[#000]",
  bgPrimary: "bg-[#fff]",
};

export const REFETCH_INTERVAL = 15 * 60 * 1000;
export const TD_V = 12;
export const TD_CELL: React.CSSProperties = {
  paddingTop: TD_V,
  paddingBottom: TD_V,
  verticalAlign: "middle",
};
