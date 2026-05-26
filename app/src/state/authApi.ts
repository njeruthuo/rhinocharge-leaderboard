import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { AuthResponse } from "./types";
import { authenticateUser } from "./authSlice";

const AUTH_CREDENTIALS = {
  username: "rhino",
  password: "rh1no",
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_BASE,
  }),
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, void>({
      query: () => ({
        url: "authservice/auth/login",
        method: "POST",
        body: AUTH_CREDENTIALS,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            authenticateUser({
              token: data.data.token,
              user: data.data.selectUsersByUsernamePassword,
            }),
          );
        } catch (error) {
          console.error("Login mutation lifecycle failed:", error);
        }
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;
