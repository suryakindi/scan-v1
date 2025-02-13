import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { user } from "./user.ts";
import { type PermissionT, routeBuilder } from "./routes.ts";
import { Provider } from "react-redux";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { store } from "./store.ts";

const routes = routeBuilder([
  ...(user.data.role_permissions as PermissionT[]),
  ...(user.data.user_permissions as PermissionT[]),
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {routes.map((x, _x) =>
            x.childs ? (
              <Route key={_x} path={x.path} element={<Outlet />}>
                {x.childs.map((y, _y) =>
                  y.childs ? (
                    <Route key={_y} path={y.path} element={<Outlet />}>
                      {y.childs.map((z, _z) => (
                        <Route
                          key={_z}
                          path={z.path}
                          element={<div>{z.name}</div>}
                        />
                      ))}
                    </Route>
                  ) : (
                    <Route
                      key={_y}
                      path={y.path}
                      element={<div>{y.name}</div>}
                    />
                  )
                )}
              </Route>
            ) : (
              <Route key={_x} path={x.path} element={<div>{x.name}</div>} />
            )
          )}
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
