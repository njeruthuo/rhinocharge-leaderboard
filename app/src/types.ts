export interface Driver {
  id: number;
  carNo: string;
  entrantName: string;
  teamName: string;
  checkpoints: Record<string, string>;
  totalCps: number;
}
