import { configureStore } from "@reduxjs/toolkit";
import { rhinoApi } from "./rhinoApi";
import { pyapi } from "./pyapi";
import { storage } from "./storage";
import auth from "./authSlice";
import { authApi } from "./authApi";

export const store = configureStore({
  reducer: {
    auth: auth,
    [rhinoApi.reducerPath]: rhinoApi.reducer,
    [pyapi.reducerPath]: pyapi.reducer,
    [storage.reducerPath]: storage.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getMiddleware) =>
    getMiddleware({
      serializableCheck: false,
    }).concat([
      rhinoApi.middleware,
      pyapi.middleware,
      storage.middleware,
      authApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
