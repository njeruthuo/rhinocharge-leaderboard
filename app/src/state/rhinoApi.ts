import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import type {
  AssetListResponse,
  Poi,
  RhinoResponse,
  TripRecord,
} from "./types";
export const rhinoApi = createApi({
  reducerPath: "rhinoApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (build) => ({
    getPois: build.mutation<Poi[], string>({
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

    getVehicleList: build.query<AssetListResponse, void>({
      query: () => `settings/AssetManagement/GetAssets?userId=1263`,
    }),

    getCheckPoints: build.mutation<TripRecord[], void>({
      query: () => ({
        url: `AnalyticsService?request={%22api_action%22%3A%22get_poi_summary%22%2C%22user_id%22%3A1263%2C%22start_date%22%3A%222025-05-30%2010%3A00%3A00%22%2C%22end_date%22%3A%222025-06-01%2011%3A00%3A00%22%2C%22region_id%22%3A0}`,
        method: "POST",
      }),
      transformResponse: (arg: string) => {
        const data = JSON.parse(arg as string);
        return data.data;
      },
    }),
  }),
});

export const {
  useGetPoisMutation,
  useGetVehicleListQuery,
  useGetCheckPointsMutation,
} = rhinoApi;
