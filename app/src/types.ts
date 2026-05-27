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

export type CheckPointType = {
  Checkpoint1: string; // to hold the name of the current endpoint (i)
  Checkpoint2: string; // to hold the name of the next endpoint (i+1)
  mileage: number; // to hold the result of their API request. I intend to extract the mileage from the payload returned
};
export type PointToPointType = {
  assetName: string; // to hold assetNumber
  checkpoints: CheckPointType[];
};

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
  orderedCheckpoints: DataTypeCheckPoint[];
  pointToPointMileage: PointToPointType;
};

export interface DataTypeCheckPoint {
  point: string;
  odometer: number;
  time: string;
  calculated_odometer: number;
  next: string;
  startOdometer: number | undefined;
  distanceFromBase: number | undefined;
}

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

export type MileageResultsList = {
  alerts: null;
  averageSpeed: number;
  batteryConnected: number;
  batteryDisconnected: number;
  cardSerial: null;
  consumption: number;
  consumptionRate: number;
  cost: number;
  currentFuelLevel: number;
  currentLocation: string;
  currentTime: string | Date;
  description: "";
  deviceTimeZone: number;
  driver: null;
  drivingDuration: number;
  endFuelLevel: number;
  endLocation: string;
  endLocationTime: null;
  endOdometer: number;
  endTime: null;
  freewheeling: number;
  fuelConsumption: number;
  fuelEfficiency: number;
  fuelStrategyId: number;
  geofence: number;
  harshAcceleration: number;
  harshBraking: number;
  idleFuelConsumption: number;
  idleTime: number;
  ignition: number;
  insidePoi: false;
  insideZone: false;
  lateStarts: number;
  latitude: number;
  liters: number;
  longitude: number;
  maxDriving: number;
  maxSpeed: number;
  mileage: number;
  motionDuration: number;
  movingAsset: false;
  nightDriveCounts: number;
  nightDriveDuration: number;
  nightDriveMileage: number;
  noOfStops: number;
  numberofNightTimeStops: number;
  overrevving: number;
  overspeedingCounts: number;
  panic: number;
  rank: number;
  refillAmount: number;
  refills: number;
  runningTime: number;
  siphonAmount: number;
  siphonBreakDown: null;
  siphons: number;
  speeding: number;
  startFuelLevel: number;
  startLocation: string;
  startLocationTime: null;
  startOdometer: number;
  startTime: null;
  stationaryDuration: number;
  status: null;
  stopDuration: number;
  stops: number;
  totalDriveTime: number;
  totalWeekendMileage: number;
  transactions: number;
  unitId: string;
  vehicle: string;
  violations: number;
};

export type MileageResultsType = {
  items: MileageResultsList[];
  totalItems: number;
  pageSize: 0;
};

export interface DateDataType {
  startDate: string | undefined;
  endDate: string | undefined;
  isBackup: boolean;
}

export type DeviceData = DateDataType & { deviceID?: string };

export interface ResultsProps {
  setOpenFilter: React.Dispatch<React.SetStateAction<boolean>>;
  openFilter?: boolean;
}