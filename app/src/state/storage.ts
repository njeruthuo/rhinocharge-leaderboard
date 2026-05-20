import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const storage = createApi({
  reducerPath: "storage",
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
    createDataPoint: build.mutation({
      query: () => ({
        url: " ",
      }),
    }),

    updateDataPoint: build.mutation({
      query: () => ({
        url: " ",
      }),
    }),

    getDataPoint: build.query({
      query: () => ({
        url: " ",
      }),
    }),
  }),
});

export const {
  useCreateDataPointMutation,
  useUpdateDataPointMutation,
  useGetDataPointQuery,
} = storage;
