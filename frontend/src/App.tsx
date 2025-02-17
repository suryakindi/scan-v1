import { FC, Fragment } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";
import { store } from "./store";
import Error404 from "./pages/error/404";
import { PermissionT, routeBuilder } from "./routes";
import { user } from "./user";
import Layout from "./pages/Layout";
import Login from "./pages/auth/Login";
import Loading from "./pages/Loading";

const routes = routeBuilder([
  ...(user.data.role_permissions as PermissionT[]),
  ...(user.data.user_permissions as PermissionT[]),
]);

const App: FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {routes.map((x, _x) =>
              x.childs && x.childs.length > 0 ? (
                <Fragment key={_x}>
                  {x.childs.map((y, _y) =>
                    y.childs && y.childs.length > 0 ? (
                      <Fragment key={_y}>
                        {y.childs &&
                          y.childs.length > 0 &&
                          y.childs.map((z, _z) => (
                            <Route
                              key={_z}
                              path={`/${x.path}/${y.path}/${z.path}`}
                              Component={(props) =>
                                z.Component && (
                                  <z.Component
                                    {...props}
                                    permissions={z.permissions}
                                    name={z.name}
                                  />
                                )
                              }
                            />
                          ))}
                      </Fragment>
                    ) : (
                      <Route
                        key={_y}
                        path={`/${x.path}/${y.path}`}
                        Component={(props) =>
                          y.Component && (
                            <y.Component
                              {...props}
                              permissions={y.permissions}
                              name={y.name}
                            />
                          )
                        }
                      />
                    )
                  )}
                </Fragment>
              ) : (
                <Route
                  key={_x}
                  path={`/${x.path}`}
                  Component={(props) =>
                    x.Component && (
                      <x.Component
                        {...props}
                        permissions={x.permissions}
                        name={x.name}
                      />
                    )
                  }
                />
              )
            )}
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
      <Loading />
    </Provider>
  );
};

export default App;
