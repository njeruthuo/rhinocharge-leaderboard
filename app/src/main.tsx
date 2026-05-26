import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/system/index.css";
// import AppRouter from "@/system/AppRouter.tsx";
import { store } from "./state/store.ts";
import { Provider } from "react-redux";
import App from "./system/App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
