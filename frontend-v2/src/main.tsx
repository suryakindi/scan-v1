import { FC, StrictMode } from "react";
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

const AppWrapper: FC = () => {
  return (
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
        },
        { path: "*", Component: E404 },
      ])}
    />
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  </StrictMode>
);
