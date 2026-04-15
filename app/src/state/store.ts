import { configureStore } from "@reduxjs/toolkit";
import { rhinoApi } from "./rhinoApi";

export const store = configureStore({
  reducer: {
    [rhinoApi.reducerPath]: rhinoApi.reducer,
  },
  middleware: (getMiddleware) => getMiddleware().concat(rhinoApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
