export interface Driver {
  id: number;
  carNo: string;
  entrantName: string;
  teamName: string;
  checkpoints: CheckPoint[];
  totalCps: number;
}

export type CheckPoint = {
  point: string;
  odometer: number;
  time: string;
  next: string;
};
