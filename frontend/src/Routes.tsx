<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { FC, Suspense, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Fallback from "./components/Fallback";
import LazyLoad from "./components/LazyLoad";
import Login from "./pages/auth/Login";
import { api } from "./utils/api";
import { AuthenticatedRoutes } from "./AuthenticatedRoutes";
=======
=======
>>>>>>> Stashed changes
import { FC, Suspense } from "react";
import { createBrowserRouter, RouteObject, RouterProvider } from "react-router";
import Fallback from "./components/Fallback";
import LazyLoad from "./components/LazyLoad";
import Login from "./pages/auth/Login";

type RouteObjectExtend = RouteObject & {
  module?: ModuleT;
  children?: RouteObjectExtend[];
};

type LoaderMakeT = {
  module: ModuleT;
};

const make = async ({ module }: LoaderMakeT) => {
  const token = localStorage.getItem("token");
  return e;
};

const main: RouteObjectExtend[] = [
  {
    path: "/",
    element: LazyLoad(() => import("./pages/Dashboard")),
  },
  {
    path: "/pasien",
    children: [
      {
        index: true,
        element: LazyLoad(() => import("./pages/pasien/index")),
      },
    ],
  },
  {
    children: [
      {
        path: "/bpjs/kunjungan",
        element: LazyLoad(() => import("./pages/bpjs/kunjungan")),
      },
      {
        path: "/bpjs/dokter",
        element: LazyLoad(() => import("./pages/bpjs/dokter")),
      },
      {
        path: "/bpjs/hfis",
        element: LazyLoad(() => import("./pages/bpjs/hfis")),
      },
      {
        path: "/bpjs/tindakan",
        element: LazyLoad(() => import("./pages/bpjs/tindakan")),
      },
      {
        path: "/bpjs/prolanis",
        element: LazyLoad(() => import("./pages/bpjs/prolanis")),
      },
    ],
  },
];
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      children: AuthenticatedRoutes,
=======
      children: main,
>>>>>>> Stashed changes
=======
      children: main,
>>>>>>> Stashed changes
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
=======
>>>>>>> Stashed changes
  // router.subscribe(async ({ location, matches }) => {
  //   try {
  //     const route = matches.find(
  //       (match) => match.pathname === location.pathname
  //     )?.route as RouteObjectExtend | undefined;

  //     console.log(route?.module, localStorage.getItem("token"));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // });

  // useEffect(() => {
  //   return () => {
  //     const validate = async () => {
  //       try {
  //         const valid = await checkToken();
  //         if (!valid) router.navigate("/login");
  //       } catch (error) {
  //         console.error(error);
  //         router.navigate("/login");
  //       }
  //     };

  //     validate();
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

  return <RouterProvider router={router} />;
};

export default Routes;
