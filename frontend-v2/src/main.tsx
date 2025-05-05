import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import login from "./pages/auth/login/route";
import Fallback from "./pages/base/fallback";
import E500 from "./pages/base/500";
import E404 from "./pages/base/404";
import { Provider } from "react-redux";
import { store } from "./utils/state";
import Layout from "./layout";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider
        router={createBrowserRouter([
          {
            path: "/",
            Component: Outlet,
            ErrorBoundary: E500,
            HydrateFallback: Fallback,
            children: [
              login,
              {
                path: "/",
                Component: Layout,
                children: [],
                async loader() {
                  try {
                    console.log("ok");
                  } catch (error) {
                    console.error(error);
                  }
                },
              },
            ],
          },
          { path: "*", Component: E404 },
        ])}
      />
    </Provider>
  </StrictMode>
);
