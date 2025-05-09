import { ComponentType, FC, Fragment, useEffect, useState } from "react";
import {
  IconChevronRight,
  IconCircle,
  IconDashboard,
  IconLogout,
  IconMenu2,
  IconSettings,
} from "@tabler/icons-react";
import type { IconProps } from "@tabler/icons-react";
import logo from "./assets/images/logo_bg_transparent.png";
import userIcon from "./assets/user-round-QwaXuEgi.svg";
import clsx from "clsx";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import Fallback from "./pages/base/fallback";
import { api, ResponseT } from "./utils/api";
import { AuthObject } from "./utils/global-types";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useDispatch } from "react-redux";
import { actions } from "./utils/state";

type Child = {
  name: string;
  to: string;
};

type Menu = {
  name: string;
  to: string;
  Icon: ComponentType<IconProps>;
};

type MenuWithChild = {
  name: string;
  c: Child[];
  Icon: ComponentType<IconProps>;
};

type Group = {
  name: string;
  menu: (Menu | MenuWithChild)[];
};

const navs: Group[] = [
  {
    name: "Dashboard",
    menu: [
      {
        name: "Registrasi",
        Icon: IconDashboard,
        c: [
          { name: "List Pasien", to: "/list-pasien" },
          { name: "Kunjungan", to: "/kunjungan" },
        ],
      },
      {
        name: "Layanan",
        Icon: IconDashboard,
        c: [
          { name: "Rawat Jalan", to: "/rawat-jalan" },
          { name: "Rawat Inap", to: "/rawat-inap" },
        ],
      },
      {
        name: "Management Client Client Client Client Client",
        Icon: IconDashboard,
        c: [
          { name: "Client", to: "/client" },
          { name: "Base URL", to: "/base-url" },
        ],
      },
      {
        name: "Viewer",
        Icon: IconDashboard,
        to: "/viewer",
      },
    ],
  },
];

const Layout: FC = () => {
  // const searchInputRef = useRef<HTMLInputElement>(null);
  // const searchBoxClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
  //   if (!(e.target as HTMLElement).closest("button"))
  //     searchInputRef.current?.focus();
  // };

  const token = localStorage.getItem("token");

  const [expand, setExpand] = useState<boolean>(true);
  const [openedNav, setOpenedNav] = useState<{ x: number; y: number }>({
    x: -1,
    y: -1,
  });

  const toggleOpenedNav = (groupIndex: number, menuIndex: number) =>
    setOpenedNav(({ x, y }) =>
      x === groupIndex && y === menuIndex
        ? { x: -1, y: -1 }
        : { x: groupIndex, y: menuIndex }
    );

  const location = useLocation();

  /**
   * first squish
   */
  // useEffect(() => {
  //   let _1: number = -1;
  //   let _2: number = -1;

  //   for (const [groupIndex, group] of navs.entries()) {
  //     for (const [menuIndex, menu] of group.menu.entries()) {
  //       if ("to" in menu && menu.to === location.pathname) {
  //         _1 = groupIndex;
  //         _2 = menuIndex;
  //       }

  //       if (
  //         "c" in menu &&
  //         menu.c.map((_m) => _m.to).includes(location.pathname)
  //       ) {
  //         _1 = groupIndex;
  //         _2 = menuIndex;
  //       }
  //     }
  //   }
  // }, []);

  const navigate = useNavigate();
  const [isProcess, setIsProcess] = useState<boolean>(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { data },
        } = await api.get<ResponseT<AuthObject>>("/check-token", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!data) throw new Error("Unauthorized");

        dispatch(actions.setAuth(data));
        dispatch(actions.setToken(token));
      } catch (error) {
        console.error("Unauthorized. Redirecting to login.", error);
        navigate("/login");
      } finally {
        setIsProcess(false);
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    setIsProcess(true);

    try {
      await api.post("logout-user", {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(actions.setAuth(null));
      dispatch(actions.setToken(null));
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  if (isProcess) {
    return <Fallback />;
  } else {
    return (
      <Fragment>
        <header className="h-[84px] bg-white fixed inset-x-0 top-0 flex items-center z-50">
          <div className="w-64 flex items-center justify-between px-2">
            <div className="flex items-center ml-4 flex-1 gap-2">
              <img src={logo} alt="Logo" className="h-8" />
              <span className="text-lg text-indigo-700 font-semibold">
                SCAN
              </span>
            </div>
            <button
              type="button"
              className="rounded-md aspect-square p-2 cursor-pointer bg-slate-200 text-indigo-700 hover:bg-indigo-800 hover:text-white transition-colors duration-300"
              onClick={() => setExpand((prev) => !prev)}
            >
              <IconMenu2 className="size-5" />
            </button>
          </div>
          <div className="flex flex-1 items-center justify-end px-2">
            {/* <div
              className="flex items-center border p-2 w-96 rounded-lg border-gray-400 cursor-text hover:border-black focus-within:hover:border-indigo-700 focus-within:border-indigo-700 focus-within:ring focus-within:ring-inset focus-within:ring-indigo-700"
              onClick={searchBoxClickHandler}
            >
              <div className="px-2">
                <IconSearch className="size-4 text-gray-600" />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="placeholder:text-gray-400 flex-1 text-sm font-medium"
                ref={searchInputRef}
              />
              <button
                type="button"
                className="rounded-md aspect-square p-2 cursor-pointer bg-slate-200 text-indigo-700 hover:bg-indigo-800 hover:text-white transition-colors duration-300"
              >
                <IconAdjustmentsHorizontal className="size-5" />
              </button>
            </div> */}

            <div className="flex items-center gap-3 mr-4">
              {/* <button
                type="button"
                className="rounded-md aspect-square p-2 cursor-pointer bg-slate-200 text-indigo-700 hover:bg-indigo-800 hover:text-white transition-colors duration-300"
              >
                <IconAccessPoint className="size-5" />
              </button>
              <button
                type="button"
                className="rounded-md aspect-square p-2 cursor-pointer bg-slate-200 text-indigo-700 hover:bg-indigo-800 hover:text-white transition-colors duration-300"
              >
                <IconTransfer className="size-5" />
              </button>
              <button
                type="button"
                className="rounded-md aspect-square p-2 cursor-pointer bg-slate-200 text-indigo-700 hover:bg-indigo-800 hover:text-white transition-colors duration-300"
              >
                <IconBell className="size-5" />
              </button>
              <button
                type="button"
                className="rounded-md aspect-square p-2 cursor-pointer bg-slate-200 text-indigo-700 hover:bg-indigo-800 hover:text-white transition-colors duration-300"
              >
                <IconArrowsMaximize className="size-5" />
              </button> */}

              <Menu>
                <MenuButton className="flex items-center p-1.5 rounded-full gap-2.5 cursor-pointer bg-slate-200 text-indigo-700 hover:bg-indigo-800 hover:text-white transition-colors duration-300">
                  <img
                    src={userIcon}
                    alt="User Icon"
                    className="w-[34px] h-[34px]"
                  />
                  <IconSettings className="size-6" />
                </MenuButton>
                <MenuItems
                  anchor="bottom"
                  as="div"
                  className="z-50 bg-white rounded-lg w-80 mt-2.5 p-2"
                  style={{ boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)" }}
                >
                  <MenuItem>
                    <button
                      type="button"
                      className="flex items-center px-5 py-2.5 cursor-pointer gap-2 hover:bg-indigo-100 hover:text-indigo-700 w-full rounded-md"
                      onClick={logout}
                    >
                      <IconLogout className="size-5" />
                      <span>Logout</span>
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </header>

        <nav
          className={clsx(
            expand ? "w-64" : "w-20",
            "fixed bottom-0 left-0 top-[84px] p-2 overflow-y-scroll z-40 bg-white transition-all duration-300"
          )}
        >
          <ul
            className={clsx(
              "gap-1 flex flex-col transition-all duration-300 text-sm font-medium pe-2.5",
              expand ? "pl-2" : ""
            )}
          >
            {navs.map((group, groupIndex) => {
              return (
                <li
                  key={groupIndex}
                  className={clsx(
                    "flex flex-col transition-all duration-300 border-b-slate-300",
                    expand ? "pb-4 border-b" : ""
                  )}
                >
                  <div
                    className={clsx(
                      "overflow-hidden flex items-center transition-all duration-300",
                      expand ? "h-10" : "h-0"
                    )}
                  >
                    <span className="truncate">{group.name}</span>
                  </div>
                  <ul className="gap-1 flex flex-col">
                    {group.menu.map((menu, menuIndex) => {
                      return (
                        <li key={menuIndex}>
                          <NavLink
                            to={"to" in menu ? menu.to : "#"}
                            onClick={(e) => {
                              if (!("to" in menu)) {
                                e.preventDefault();
                              }
                              toggleOpenedNav(groupIndex, menuIndex);
                            }}
                            className={({ isActive }) =>
                              clsx(
                                "w-full flex p-3 items-center justify-between overflow-hidden rounded-md hover:bg-slate-200 hover:text-indigo-700",
                                ("to" in menu && isActive) ||
                                  ("c" in menu &&
                                    menu.c
                                      .map((_m) => _m.to)
                                      .includes(location.pathname))
                                  ? "bg-slate-200 text-indigo-700"
                                  : "text-gray-600"
                              )
                            }
                          >
                            <div
                              className={clsx(
                                "flex items-center gap-3.5",
                                expand && "min-w-0"
                              )}
                            >
                              <menu.Icon className="size-6 shrink-0" />
                              <span className="truncate">{menu.name}</span>
                            </div>
                            {!("to" in menu) && (
                              <IconChevronRight
                                className={clsx(
                                  "size-4 shrink-0 transition-all duration-300",
                                  expand &&
                                    groupIndex === openedNav.x &&
                                    menuIndex === openedNav.y &&
                                    "rotate-90"
                                )}
                              />
                            )}
                          </NavLink>
                          {"c" in menu && (
                            <ul
                              className={clsx(
                                "gap-1 flex flex-col border-s border-s-slate-300 ms-6 mt-1 overflow-y-hidden",
                                expand &&
                                  groupIndex === openedNav.x &&
                                  menuIndex === openedNav.y
                                  ? "h-full"
                                  : "h-0"
                              )}
                            >
                              {menu.c.map((child, childIndex) => (
                                <li key={childIndex}>
                                  <NavLink
                                    to={child.to}
                                    className={(childClass) =>
                                      clsx(
                                        "w-full flex p-3 items-center gap-2 hover:text-indigo-700 group",
                                        childClass.isActive
                                          ? "text-indigo-700"
                                          : "text-gray-600"
                                      )
                                    }
                                  >
                                    {(childChilds) => (
                                      <Fragment>
                                        <IconCircle
                                          className={clsx(
                                            "size-2.5 shrink-0 fill-gray-600 group-hover:fill-indigo-700",
                                            childChilds.isActive
                                              ? "fill-indigo-700"
                                              : "fill-gray-600"
                                          )}
                                        />
                                        <span className="truncate">
                                          {child.name}
                                        </span>
                                      </Fragment>
                                    )}
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </nav>

        <main className={clsx("before:flex before:flex-col before:h-[84px]")}>
          <div
            className={clsx(
              "flex flex-col transition-all duration-300",
              expand ? "pl-64" : "pl-20"
            )}
          >
            <div className="ps-0.5 pt-2 pr-6">
              <div className="min-h-screen bg-slate-200 rounded-t-xl p-5 flex flex-col gap-5">
                {/* main */}
                <Outlet />

                <div className="flex items-center justify-between">
                  <span>© All rights reserved</span>
                  <div className="flex items-center gap-2 text-xs">
                    <span>Twitter</span>
                    <span>Discord</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </Fragment>
    );
  }
};

export default Layout;
