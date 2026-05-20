import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface DateStorage {
  id: number;
  start_date: string; // "YYYY-MM-DD HH:MM:SS"
  end_date: string;
  backup_status: boolean;
}

interface DateStoragePayload {
  start_date: string;
  end_date: string;
}

export const storage = createApi({
  reducerPath: "storage",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://storage-service-4nwv.onrender.com/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (build) => ({
    // POST /datestorage/  — fails with 400 if a row already exists
    createDataPoint: build.mutation<DateStorage, DateStoragePayload>({
      query: (body) => ({
        url: "datestorage/",
        method: "POST",
        body,
      }),
    }),

    // PATCH /datestorage/{id}/  — partial update, send only fields you want to change
    updateDataPoint: build.mutation<
      DateStorage,
      { id: number } & Partial<DateStoragePayload>
    >({
      query: ({ id, ...body }) => ({
        url: `datestorage/${id}/`,
        method: "PATCH",
        body,
      }),
    }),

    // GET /datestorage/{id}/  — fetch the single existing row by its id
    getDataPoint: build.query<DateStorage, number>({
      query: (id) => ({
        url: `datestorage/${id}/`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateDataPointMutation,
  useUpdateDataPointMutation,
  useGetDataPointQuery,
} = storage;
