import { FC, Suspense, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Fallback from "./components/Fallback";
import LazyLoad from "./components/LazyLoad";
import Login from "./pages/auth/Login";
import { api } from "./utils/api";
import { AuthenticatedRoutes } from "./AuthenticatedRoutes";

const Routes: FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      HydrateFallback: Fallback,
      element: (
        <Suspense fallback={<Fallback />}>
          {LazyLoad(() => import("./components/Layout"))}
        </Suspense>
      ),
      children: AuthenticatedRoutes,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  useEffect(() => {
    return () => {
      const validate = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await api.get<
            ResponseT<{
              user: UserT;
              role_permissions: PermissionT;
              user_permissions: PermissionT;
            }>
          >("/check-token", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.data.data.user) router.navigate("/login");
        } catch (error) {
          console.error(error);
          router.navigate("/login");
        }
      };

      validate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <RouterProvider router={router} />;
};

export default Routes;
