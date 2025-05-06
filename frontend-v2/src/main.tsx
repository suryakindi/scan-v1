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
                children: [
                  {
                    path: "/list-pasien",
                    element: (
                      <div className="flex flex-1 flex-col">
                        <p>list-pasien</p>
                      </div>
                    ),
                  },
                  {
                    path: "/kunjungan",
                    element: (
                      <div className="flex flex-1 flex-col">
                        <p>kunjungan</p>
                      </div>
                    ),
                  },
                  {
                    path: "/rawat-jalan",
                    element: (
                      <div className="flex flex-1 flex-col">
                        <p>rawat-jalan</p>
                      </div>
                    ),
                  },
                  {
                    path: "/rawat-inap",
                    element: (
                      <div className="flex flex-1 flex-col">
                        <p>rawat-inap</p>
                      </div>
                    ),
                  },
                  {
                    path: "/client",
                    element: (
                      <div className="flex flex-1 flex-col">
                        <p>client</p>
                      </div>
                    ),
                  },
                  {
                    path: "/base-url",
                    element: (
                      <div className="flex flex-1 flex-col">
                        <p>base-url</p>
                      </div>
                    ),
                  },
                  {
                    path: "/viewer",
                    element: (
                      <div className="flex flex-1 flex-col">
                        <p>viewer</p>
                      </div>
                    ),
                  },
                ],
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
