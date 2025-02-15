import { FC } from "react";
import { NavLink, Outlet } from "react-router";
import clsx from "clsx";
import type { RawWrapRoutePropsT } from "../routes";

const navs: RawWrapRoutePropsT[] = [
  {
    path: "registrasi",
    name: "Registrasi",
    module: "Registrasi",
    childs: [
      {
        path: "child-1",
        name: "Child 1",
        module: "Registrasi",
      },
      {
        path: "child-2",
        name: "Child 2",
        module: "Registrasi",
      },
      {
        path: "child-3",
        name: "Child 3",
        module: "Registrasi",
      },
    ],
  },
  {
    path: "integrasi-tools",
    name: "Integrasi Tools",
    module: "Integrasi-Tools",
    childs: [
      {
        path: "child-1",
        name: "Child 1",
        module: "Integrasi-Tools",
      },
      {
        path: "child-2",
        name: "Child 2",
        module: "Integrasi-Tools",
      },
      {
        path: "child-3",
        name: "Child 3",
        module: "Integrasi-Tools",
      },
    ],
  },
  {
    path: "pasien",
    name: "Pasien",
    module: "Pasien",
    childs: [
      {
        path: "child-1",
        name: "Child 1",
        module: "Pasien",
      },
      {
        path: "child-2",
        name: "Child 2",
        module: "Pasien",
      },
      {
        path: "child-3",
        name: "Child 3",
        module: "Pasien",
      },
    ],
  },
  {
    path: "rekam-medis",
    name: "Rekam Medis",
    module: "Rekam-Medis",
    childs: [
      {
        path: "child-1",
        name: "Child 1",
        module: "Rekam-Medis",
      },
      {
        path: "child-2",
        name: "Child 2",
        module: "Rekam-Medis",
      },
      {
        path: "child-3",
        name: "Child 3",
        module: "Rekam-Medis",
      },
    ],
  },
  {
    path: "login",
    name: "Login",
    module: "Rekam-Medis",
  },
];

const Layout: FC = () => {
  return (
    <div className="flex w-full min-h-screen">
      <aside className="fixed top-0 left-0 bottom-0 w-64 duration-300 ease-in-out transition-all shadow-md shadow-gray-200 bg-white">
        <div className="px-4 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center">
            <span className="ti-layout-grid2-alt"></span>
            <span className="font-medium ml-2 text-2xl">ADMIN</span>
          </a>
        </div>

        <div
          id="nav-container"
          className="max-h-[calc(100%-4rem)] overflow-y-auto scrollbar-thumb-gray-200 scrollbar-track-white scrollbar-thin"
        >
          <ul className="relative pb-1 pt-4">
            {navs.map((x, _x) => (
              <li key={_x} className="my-1">
                <NavLink
                  to={x.path}
                  onClick={(e) =>
                    x.childs && x.childs.length > 0 && e.preventDefault()
                  }
                  className={`flex items-center justify-between mx-3 px-4 py-2 rounded-md font-medium ${
                    _x === 0 ? "bg-gray-200" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <span className="ti-home mr-1.5"></span>
                    <span>{x.name}</span>
                  </div>
                  {x.childs && x.childs.length > 0 && (
                    <span className="ti-angle-right"></span>
                  )}
                </NavLink>
                <ul>
                  {x.childs?.map((y, _y) => (
                    <li key={_y} className="my-1">
                      <NavLink
                        to={`/${x.path}/${y.path}`}
                        className={({ isActive }) =>
                          clsx(
                            "flex items-center mx-3 px-4 py-2 rounded-md font-medium",
                            isActive
                              ? "bg-pink-600 text-white hover:bg-pink-600"
                              : "hover:bg-gray-100"
                          )
                        }
                      >
                        <span>{y.name}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="pl-64 before:block before:h-20">
        <div className="fixed top-0 right-0 w-[calc(100%-16rem)] pt-4 backdrop-blur-md z-10">
          <nav className="bg-white rounded-md mx-4 px-6 py-2 min-h-14 flex items-center justify-between shadow-md shadow-gray-200">
            <div className="flex items-center">
              <span className="ti-search mr-3"></span>
              <span className="">Search..</span>
            </div>

            <ul className="flex items-center justify-center">
              <li className="px-1">
                <button
                  type="button"
                  className="rounded-full hover:bg-gray-100 p-2 flex items-center justify-center cursor-pointer"
                  data-ripple-light="true"
                >
                  <span className="ti-settings"></span>
                </button>
              </li>
              <li className="px-1">
                <button
                  type="button"
                  className="rounded-full hover:bg-gray-100 p-2 flex items-center justify-center cursor-pointer"
                  data-ripple-light="true"
                >
                  <span className="ti-settings"></span>
                </button>
              </li>
              <li className="px-1">
                <button
                  type="button"
                  className="rounded-full hover:bg-gray-100 p-2 flex items-center justify-center cursor-pointer"
                  data-ripple-light="true"
                >
                  <span className="ti-settings"></span>
                </button>
              </li>
              <li className="px-1">
                <button
                  type="button"
                  className="flex items-center justify-center cursor-pointer rounded-full overflow-hidden w-10"
                >
                  <img src="/1.png" alt="img" />
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="px-4 pt-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
