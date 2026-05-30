import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import type {
  AssetListResponse,
  AssetLocationType,
  ColumnData,
  ConfigType,
  GetPoiPayload,
  Poi,
  PoiSummary,
  RhinoResponse,
  TripRecord,
} from "./types";
import type {
  DeviceData,
  MileageResultsList,
  MileageResultsType,
  OdometerPayload,
  OdometerResponse,
  OdometerType,
} from "@/types";

export const rhinoApi = createApi({
  reducerPath: "rhinoApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["VehicleList", "Time", "Pois"],
  endpoints: (build) => ({
    getPois: build.mutation<Poi[], void>({
      query: () => ({
        url: `graphql`,
        method: "POST",
        body: {
          query:
            "query GetPois($client_id: Int!) {\r\n clientPois(where: {client_id: {eq: $client_id}}) {\r\n id\r\n town_name\r\n client\r\n description\r\n client_id\r\n the_geom {\r\n type\r\n coordinates\r\n }\r\n }\r\n }",
          variables: { client_id: 1432 },
        },
      }),
      transformResponse: (arg: RhinoResponse) => arg.data.clientPois,
    }),

    getAssetLocations: build.query<AssetLocationType[], void>({
      query: () => ({
        url: `settings/AssetManagement/fleet_current_locations/1263?backUp=false`,
        method: "GET",
      }),
    }),

    getPoiSummary: build.query<unknown, PoiSummary>({
      query: (body) => ({
        url: "AnalyticsService/GetPoiSummary",
        method: "POST",
        body,
      }),
      providesTags: ["VehicleList", "Time"],
    }),

    getVehicleList: build.query<AssetListResponse, void>({
      query: () => `settings/AssetManagement/GetAssets?userId=1263`,
      providesTags: ["VehicleList", "Time"],
    }),

    getStartPointOdometer: build.mutation<OdometerType[], OdometerPayload>({
      query: (args) => ({
        url: `AnalyticsService/gethistory`,
        method: "post",
        body: args,
      }),
      transformResponse: (arg: OdometerResponse) => arg.data,
    }),

    getCheckPoints: build.mutation<TripRecord[], GetPoiPayload>({
      query: ({ startDate, endDate, backup }) => {
        console.log(startDate, endDate, backup);

        const requestBody = {
          api_action: "get_poi_summary",
          user_id: 11833,
          start_date: "2026-05-30T04:30:00",
          end_date: "2026-05-30T14:30:00",
          region_id: 0,
          backup: true,
          unit_id: "",
        };
        // const requestBody = {
        //   api_action: "get_poi_summary",
        //   user_id: 1263,
        //   start_date: startDate,
        //   end_date: endDate,
        //   region_id: 0,
        //   backup: backup,
        //   unit_id: "",
        // };

        return {
          url: `AnalyticsService/GetPoiSummary`,
          // url: `AnalyticsService?request=${encodeURIComponent(JSON.stringify(requestBody))}`,
          method: "POST",
          body: requestBody,
        };
      },
      transformResponse: (response: AssetListResponse) => {
        const result =
          typeof response === "string" ? JSON.parse(response) : response;
        return result.data;
      },
    }),

    configStartPoint: build.mutation<ColumnData, ColumnData>({
      query: (body) => ({
        url: `settings/AssetManagement/UpdateMoreAssetDetails`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["VehicleList"],
    }),

    updateStartTime: build.mutation<ConfigType, ConfigType>({
      query: (body) => ({
        url: `/settings/AssetManagement/UpdateMoreAssetDetails/1263`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Time", "VehicleList"],
    }),

    getMovementSummary: build.mutation<MileageResultsList[], DeviceData>({
      query: (arg) => ({
        url: `rest/analytics/vehicle`,
        method: "POST",
        body: {
          pageIndex: 0,
          pageSize: 100,
          request: {
            assets: [arg.deviceID],
            userId: 1263,
            reportType: "FleetMovementSummary",

            backup: arg.isBackup,
            endDate: arg.endDate,
            startDate: arg.startDate,
            // info: arg.info,
          },
        },
      }),
      transformResponse: (arg: MileageResultsType) => arg.items,
    }),
  }),
});

export const {
  useGetPoisMutation,
  useGetVehicleListQuery,
  useGetCheckPointsMutation,
  useConfigStartPointMutation,

  useUpdateStartTimeMutation,

  // Get start point odometer
  useGetStartPointOdometerMutation,

  // Get all assets' location
  useGetAssetLocationsQuery,

  // Get movement summary
  useGetMovementSummaryMutation,
} = rhinoApi;
