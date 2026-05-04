import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/system/index.css";
import AppRouter from "@/system/AppRouter.tsx";
import { store } from "./state/store.ts";
import { Provider } from "react-redux";
import type { AuthResponse } from "./state/types.ts";

async function bootstrap() {
  if (!localStorage.getItem("token")) {
    const res = await fetch(
      `${import.meta.env.VITE_APP_BASE}authservice/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "rhino", password: "rh1no" }),
      },
    );
    const data: AuthResponse = await res.json();

    localStorage.setItem("token", data.data.token);
    localStorage.setItem(
      "user",
      JSON.stringify(data.data.selectUsersByUsernamePassword),
    );
  }

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </StrictMode>,
  );
}

bootstrap();
