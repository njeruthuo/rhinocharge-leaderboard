import { configureStore } from "@reduxjs/toolkit";
import { rhinoApi } from "./rhinoApi";
import { pyapi } from "./pyapi";
import { storage } from "./storage";

export const store = configureStore({
  reducer: {
    [rhinoApi.reducerPath]: rhinoApi.reducer,
    [pyapi.reducerPath]: pyapi.reducer,
    [storage.reducerPath]: storage.reducer,
  },
  middleware: (getMiddleware) =>
    getMiddleware().concat([
      rhinoApi.middleware,
      pyapi.middleware,
      storage.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
