export interface Driver {
  id: number;
  carNo: string;
  entrantName: string;
  team_name: string;
  checkpoints: CheckPoint[];
  totalCps: number;
  mileage: number;
  penalties: number;
  start_cp?: string;
}

export type CheckPoint = {
  point: string;
  odometer: number;
  time: string;
  next: string;
};

export type RowStatus = { [id: number]: boolean };

export type DesktopRowType = {
  driver: Driver;
  rank: number;
  checkpoints: CheckPoint[];
  open: boolean;
  id: number;
  setOpen: React.Dispatch<React.SetStateAction<RowStatus>>;
};
