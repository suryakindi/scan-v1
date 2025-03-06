import { FC } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { routes } from "./routes";
import Layout from "./layout";
import LoadingOverlay from "./layout/loading-ovarelay";
import Error404 from "./layout/404";
import { loginLoader } from "./pages/auth/loader";
import Login from "./pages/auth/Login";

const App: FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: routes,
      HydrateFallback: LoadingOverlay,
      errorElement: <Error404 />,
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
