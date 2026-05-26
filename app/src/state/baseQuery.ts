import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  type FetchBaseQueryMeta,
  type QueryReturnValue,
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

  // 1. If there's no token from the start, try to authenticate right away
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
      setResultsData(loginResult);
    } else {
      return { error: { status: 401, data: "Initial auto-login failed" } };
    }
  }

  // 2. Proceed with the primary API request
  let result = await rawBaseQuery(args, api, extraOptions);

  // 3. If the request fails with a 401, try to re-authenticate and retry the request
  if (result.error && result.error.status === 401) {
    console.warn("Token expired. Attempting automatic re-authentication...");
    localStorage.removeItem("token"); // Clear the bad token

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
      setResultsData(loginResult);
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      return {
        error: { status: 401, data: "Automatic re-authentication failed" },
      };
    }
  }

  return result;
};

function setResultsData(
  loginResult: QueryReturnValue<
    unknown,
    FetchBaseQueryError,
    FetchBaseQueryMeta
  >,
) {
  const data = loginResult.data as AuthData;
  localStorage.setItem("token", data.token);
  localStorage.setItem(
    "user",
    JSON.stringify(data.selectUsersByUsernamePassword),
  );
}
