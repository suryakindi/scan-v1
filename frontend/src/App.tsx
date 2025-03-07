import { FC } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { routes } from "./routes";
import Layout from "./layout";
import LoadingOverlay from "./layout/loading-ovarelay";
import Error404 from "./layout/404";
import { loginLoader } from "./pages/auth/loader";
import Login from "./pages/auth/Login";
import { userLoader } from "./user";

const App: FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: routes,
      HydrateFallback: LoadingOverlay,
      loader: (args) => userLoader(args),
    },
    {
      path: "/login",
      element: <Login />,
      loader: loginLoader,
      HydrateFallback: LoadingOverlay,
    },
    { path: "*", element: <Error404 /> },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
