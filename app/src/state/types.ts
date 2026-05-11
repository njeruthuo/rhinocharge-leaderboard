export type LoginPayload = {
  username: string;
  password: string;
};

export interface Geometry {
  type: "Point" | string;
  coordinates: [number, number];
}

export interface Poi {
  id: number;
  town_name: string;
  client: string;
  description: string;
  client_id: number;
  the_geom: Geometry;
}

export interface GetPoisResponse {
  clientPois: Poi[];
}

export type RhinoResponse = {
  data: GetPoisResponse;
};

export interface AuthUser {
  user_id: number;
  client_id: number;
  contact_id: number;
  client_name: string;
  __typename: "SelectUsersByUsernamePassword";
}

export interface AuthData {
  selectUsersByUsernamePassword: AuthUser[];
  token: string;
}

export interface AuthResponse {
  data: AuthData;
}

export interface AssetStatusDetails {
  status_id: number;
  name: string;
  description: string | null;
}

export interface Asset {
  asset_id: number;
  asset_name: string;
  ownership: string;
  current_location: string;
  realOdometer: number;
  make: string;
  model: string;
  asset_type_details: string | null; // Replace 'string' if you have a specific type
  asset_usage_details: string | null;
  asset_type: string | null;
  start_cp: string;
  driver: string | null;
  year_of_manufacture: number | null;
  usage: string | null;
  team_name: string;
  asset_status: string;
  last_polled: string; // ISO format string or YYYY-MM-DD HH:mm:ss
  device_type: string | null;
  device_id: string;
  panic: boolean;
  last_driver: string;
  descriptors: string | null;
  description: string;
  asset_category: string | null;
  asset_status_details: AssetStatusDetails;
  client_category: string | null;
  backup_last_polled: string | null;
  backup_device_id: string | null;
  asset_model: string | null;
  photo: string | null;
  more_asset_details: null | ColumnData;
}

export type AssetListResponse = Asset[];

export type GetCheckPointsResponse = {
  response: string;
  data: TripRecord[];
};

export interface TripRecord {
  device_timezone: number;
  poi_name: string;
  start_odo: number;
  start_time: string;
  vehicle: string;
  driver: string;
  end_odo: number;
  end_time: string;
  mileage: number;
  calculated_odometer: number;
  startOdometer: number;
}

export type PoiSummary = {
  start_date: string;
  end_date: string;
  user_id: number;
  unit_id: string;
};

export type ConfigType = {
  column_id: number;
  column_value: string;
  column_name?: string;
  assetId?: number;
  asset_id?: number;
};

export type ColumnData = ConfigType[];

export type ColumnDataList = { body: ColumnData; assetId: number };
export type FilterTypes = "all" | "partial" | "none";

export type GetPoiPayload = { startDate: string; endDate: string };
