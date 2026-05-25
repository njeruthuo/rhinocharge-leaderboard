import type { Dispatch, SetStateAction } from "react";

export interface Driver {
  id: number;
  carNo: string;
  entrantName: string;
  team_name: string;
  checkpoints: CheckPoint[];
  orderedCheckpoints: CheckPoint[];
  totalCps: number;
  mileage: number;
  penalties: number;
  start_cp?: string;
  complete: boolean;
}

export type CheckPoint = {
  point: string;
  odometer: number;
  time: string;
  next: string;
  calculated_odometer?: number;
  startOdometer?: number;
  distanceFromBase?: number | undefined;
};

export type RowStatus = { [id: number]: boolean };

export type DesktopRowType = {
  completeTrip: boolean;
  driver: Driver;
  rank: number;
  checkpoints: CheckPoint[];
  open: boolean;
  id: number;
  setOpen: React.Dispatch<React.SetStateAction<RowStatus>>;
  isViewer: boolean;
};

export interface TabOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface AdminTabsProps {
  tabs: readonly TabOption[];
  activeTab: string;
  onChange: Dispatch<SetStateAction<Readonly<TabType>>>;
}

export type TabType = (typeof TabOptionList)[keyof typeof TabOptionList];

export const TabOptionList = {
  LIVEDATA: "livedata",
  COMPETITORS: "competitors",
  RESULTS: "results",
} as const;

export type DataType = {
  id: number | string;
  asset_id: number;
  carNo: string;
  mileage: number;
  penalties: number;
  start_cp: string;
  entrantName: string;
  team_name: string;
  totalCps: number;
  complete: boolean;
  checkpoints: {
    point: string;
    odometer: number;
    time: string;
    calculated_odometer: number;
    distanceFromBase: number | undefined;
    next: string;
  }[];
  orderedCheckpoints: {
    point: string;
    odometer: number;
    time: string;
    calculated_odometer: number;
    next: string;
    startOdometer: number | undefined;
    distanceFromBase: number | undefined;
  }[];
};

export type OdometerResponse = {
  success: boolean | string;
  data: OdometerType[];
};

export type OdometerPayload = {
  unit_id: string;
  start_date: string;
  end_date: string;
  user_id: number;
  backup: boolean;
};

export type OdometerType = {
  alerts: [];
  course: number;
  device_timezone: number;
  driver: string;
  fixtime: string;
  latitude: number;
  location: string;
  longitude: number;
  mileage: number;
  no_of_satellite: number;
  position_hdop: number;
  speed: number;
};
