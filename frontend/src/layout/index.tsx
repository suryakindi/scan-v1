import { FC, Fragment, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigation,
} from "react-router";
import clsx from "clsx";
import * as HOutline from "@heroicons/react/24/outline";
import * as HSolid from "@heroicons/react/24/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { BarLoader } from "react-spinners";
import { routes, WrapRoute } from "../routes";
import LoadingOverlay from "./loading-ovarelay";
import { LayoutContext } from "./types";

const Layout: FC = () => {
  const [show, setShow] = useState<boolean>(true);
  const [open, setOpen] = useState<string | undefined>(undefined);
  const [isProcess, setIsProcess] = useState<boolean>(false);

  const { state } = useNavigation();
  const { pathname } = useLocation();

  const navRoutes = routes
    .map((route) => {
      const children =
        route.children?.filter(({ nav }: WrapRoute) => nav) || [];

      return {
        name: route.name,
        path: route.path,
        nav: route.nav,
        Icon: route.Icon,
        ...(children.length > 0 ? { children } : {}),
      };
    })
    .filter(({ nav, children }) => nav || (children && children.length > 0));

  return (
    <Fragment>
      <nav
        className={clsx(
          "fixed bg-white w-1/8 top-0 bottom-0 left-0 shadow-xl overflow-auto font-light transition-all ease-in-out duration-150 text-sm",
          show ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="bg-white sticky top-0 z-10 h-16 text-2xl font-bold text-blue-700 flex items-center justify-center">
          Logo
        </div>
        <ul className="before:h-4 before:flex">
          {navRoutes.map((parent, _parent) => (
            <li key={_parent} className="mt-1 px-2">
              <NavLink
                onClick={(e) => {
                  if (parent.children) e.preventDefault();
                  setOpen(open === parent.path ? "" : parent.path);
                }}
                to={parent.path ?? "/"}
                className={({ isActive }) =>
                  clsx(
                    "flex h-12 px-4 items-center justify-between w-full rounded-md",
                    !isActive ? "hover:bg-slate-200" : "",
                    isActive && pathname === parent.path
                      ? "bg-blue-600 hover:bg-blue-500 text-white font-medium"
                      : isActive
                      ? "bg-slate-200 font-medium"
                      : ""
                  )
                }
              >
                <div className="flex items-center">
                  {parent.Icon ? (
                    <parent.Icon className="size-6" />
                  ) : (
                    <HOutline.PuzzlePieceIcon className="size-6" />
                  )}
                  <span className="ml-2">{parent.name}</span>
                </div>
                {parent.children && (
                  <HOutline.ChevronRightIcon
                    className={clsx(
                      "size-6 transition-all ease-in-out duration-150",
                      open === parent.path ? "rotate-90" : ""
                    )}
                  />
                )}
              </NavLink>
              {parent.children && (
                <ul
                  className={clsx(
                    "overflow-hidden transition-all ease-in-out duration-150",
                    open === parent.path ? "h-full" : "h-0"
                  )}
                >
                  {parent.children.map((child, _child) => (
                    <li key={_child} className="mt-1">
                      <NavLink
                        to={child.path ?? "/"}
                        className={({ isActive }) =>
                          clsx(
                            "flex h-12 px-4 items-center justify-between w-full rounded-md",
                            isActive
                              ? "bg-blue-600 hover:bg-blue-500 text-white font-medium"
                              : "hover:bg-slate-200"
                          )
                        }
                      >
                        <span className="pl-8">{child.name}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}

          {/* additional navs */}
          <li className="mt-1 px-2">
            <Link
              to="/viewer"
              className="flex h-12 px-4 items-center justify-between w-full rounded-md hover:bg-slate-200"
            >
              <div className="flex items-center">
                <HOutline.PuzzlePieceIcon className="size-6" />
                <span className="ml-2">Viewer</span>
              </div>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="flex">
        <div className="flex-1" />
        <div
          className={clsx(
            "transition-all ease-in-out duration-150",
            "before:flex before:h-20",
            show ? "w-7/8" : "w-full"
          )}
        >
          <header
            className={clsx(
              "fixed top-0 flex pt-4 px-4 backdrop-blur-md transition-all ease-in-out duration-150 text-sm z-10",
              show ? "w-7/8" : "w-full"
            )}
          >
            <div className="flex bg-white w-full h-14 items-center justify-between px-4 rounded-md shadow-xl">
              <button
                type="button"
                className="rounded-full aspect-square hover:bg-slate-200 p-1 cursor-pointer"
                onClick={() => setShow((prev) => !prev)}
              >
                <HOutline.Bars3Icon className="size-6" />
              </button>

              <div className="flex ml-4 items-center">
                <div className="flex flex-col text-nowrap mr-2">
                  <span className="font-medium">John Doe</span>
                  <span className="text-xs">Super Admin</span>
                </div>
                <Menu>
                  <MenuButton
                    type="button"
                    className="aspect-square h-full relative flex items-end justify-end cursor-pointer"
                  >
                    <div className="rounded-full w-10 h-10 bg-blue-100 text-blue-700 flex items-center justify-center">
                      <HSolid.UserIcon className="size-6" />
                    </div>
                    <span className="bg-green-600 aspect-square rounded-full absolute w-2 bottom-0" />
                  </MenuButton>

                  <MenuItems
                    transition
                    anchor="bottom end"
                    className="transition duration-200 ease-in-out bg-white left-0 border border-slate-200 rounded-sm mt-1"
                  >
                    <MenuItem
                      as="button"
                      className="py-2 px-4 cursor-pointer hover:bg-slate-200 flex items-center w-full"
                    >
                      <HOutline.UserIcon className="size-4 mr-2" />
                      <span>Profile</span>
                    </MenuItem>
                    <MenuItem
                      as="button"
                      className="py-2 px-4 cursor-pointer hover:bg-slate-200 flex items-center w-full"
                    >
                      <HOutline.ArrowTrendingUpIcon className="size-4 mr-2" />
                      <span>Activity</span>
                    </MenuItem>
                    <MenuItem
                      as="button"
                      className="py-2 px-4 cursor-pointer hover:bg-slate-200 flex items-center w-full"
                    >
                      <HOutline.PowerIcon className="size-4 mr-2" />
                      <span>Logout</span>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </header>

          <div className="p-4">
            <Outlet context={{ setIsProcess } as LayoutContext} />
          </div>
        </div>
      </div>

      {isProcess && (
        <div className="fixed top-0 right-0 left-0 z-50 bg-white/50">
          <BarLoader
            color="#1447e6"
            height={3}
            loading={true}
            speedMultiplier={1}
            width="100%"
          />
        </div>
      )}

      {state === "loading" && <LoadingOverlay />}
    </Fragment>
  );
};

export default Layout;
