import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { AuthData } from "./types";

const AUTH_CREDENTIALS = {
  username: "rhino",
  password: "rh1no",
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_APP_BASE,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const token = localStorage.getItem("token");

  if (!token) {
    const loginResult = await rawBaseQuery(
      {
        url: "authservice/auth/login",
        method: "POST",
        body: AUTH_CREDENTIALS,
      },
      api,
      extraOptions,
    );

    if (loginResult.data) {
      const data = loginResult.data as AuthData;
      console.log(data, "token");

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.selectUsersByUsernamePassword),
      );
    } else {
      return { error: { status: 401, data: "Auto-login failed" } };
    }
  }

  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    localStorage.removeItem("token");
  }

  return result;
};
