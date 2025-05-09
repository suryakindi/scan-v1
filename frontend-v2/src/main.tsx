import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Fallback from "./pages/base/fallback";
import E500 from "./pages/base/500";
import E404 from "./pages/base/404";
import { Provider } from "react-redux";
import { store } from "./utils/state";
import Layout from "./layout";
import Login from "./pages/login";
import { Kunjungan, ListPasien } from "./pages/registrasi";
import { RawatInap, RawatJalan } from "./pages/layanan";
import { BaseURL, Client } from "./pages/management-client";
import Viewer from "./pages/viewer";
import Dashboard from "./pages/dashboard";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider
        router={createBrowserRouter([
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/",
            Component: Layout,
            ErrorBoundary: E500,
            HydrateFallback: Fallback,
            children: [
              { path: "/", Component: Dashboard },
              {
                path: "/list-pasien",
                Component: ListPasien,
              },
              {
                path: "/kunjungan",
                Component: Kunjungan,
              },
              {
                path: "/rawat-jalan",
                Component: RawatJalan,
              },
              {
                path: "/rawat-inap",
                Component: RawatInap,
              },
              {
                path: "/client",
                Component: Client,
              },
              {
                path: "/base-url",
                Component: BaseURL,
              },
              {
                path: "/viewer",
                Component: Viewer,
              },
            ],
          },
          { path: "*", Component: E404 },
        ])}
      />
    </Provider>
  </StrictMode>
);
