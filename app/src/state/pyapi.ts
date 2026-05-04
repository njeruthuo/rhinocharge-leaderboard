import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Poi, RhinoResponse } from "./types";

export const pyapi = createApi({
  reducerPath: "pyapi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_BASE,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (build) => ({
    getPois: build.mutation<Poi[], string>({
      query: () => ({
        url: `graphql`,
        method: "POST",
      }),
      transformResponse: (arg: RhinoResponse) => arg.data.clientPois,
    }),
  }),
});

export const { useGetPoisMutation } = pyapi;
