export interface Driver {
  id: number;
  carNo: string;
  entrantName: string;
  team_name: string;
  checkpoints: CheckPoint[];
  totalCps: number;
  mileage: number;
  penalties: number;
}

export type CheckPoint = {
  point: string;
  odometer: number;
  time: string;
  next: string;
};
