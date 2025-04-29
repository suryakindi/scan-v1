import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import {
  IconAccessPoint,
  IconAdjustmentsHorizontal,
  IconArrowsMaximize,
  IconArticle,
  IconBasket,
  IconBell,
  IconCalendar,
  IconChartArcs,
  IconChartInfographic,
  IconChevronDown,
  IconCircle,
  IconClipboardList,
  IconDashboard,
  IconDeviceAnalytics,
  IconHeadphones,
  IconInvoice,
  IconLayoutKanban,
  IconLifebuoy,
  IconMenu2,
  IconMessage,
  IconNfc,
  IconSearch,
  IconSettings,
  IconTransfer,
} from "@tabler/icons-react";
import logo from "./assets/berry.svg";
import userIcon from "./assets/user-round-QwaXuEgi.svg";
import clsx from "clsx";

const Layout: FC = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchBoxClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!(e.target as HTMLElement).closest("button"))
      searchInputRef.current?.focus();
  };

  const [expand, setExpand] = useState<boolean>(false);

  const navs = [
    {
      groupName: "Dashboard",
      menu: [
        { Icon: IconDashboard, menu: [{}, {}, {}, {}] },
        { Icon: IconDeviceAnalytics },
        { Icon: IconInvoice },
        { Icon: IconLifebuoy },
        { Icon: IconArticle },
      ],
    },
    {
      groupName: "Application",
      menu: [
        { Icon: IconChartArcs },
        { Icon: IconClipboardList },
        { Icon: IconChartInfographic },
        { Icon: IconHeadphones },
        { Icon: IconMessage },
        { Icon: IconLayoutKanban },
        { Icon: IconCalendar },
        { Icon: IconNfc },
        { Icon: IconBasket },
      ],
    },
  ];

  useEffect(() => {
    console.log(expand);
  }, [expand]);

  return (
    <Fragment>
      <header className="h-[84px] bg-white fixed inset-x-0 top-0 flex items-center z-50">
        <div className="w-64 flex items-center justify-between px-2">
          <div className="flex items-center ml-4">
            <img src={logo} alt="Logo" />
          </div>
          <button
            type="button"
            className="rounded-md aspect-square p-2 cursor-pointer bg-slate-200 text-indigo-700 hover:bg-indigo-800 hover:text-white transition-colors duration-300"
            onClick={() => setExpand((prev) => !prev)}
          >
            <IconMenu2 className="size-5" />
          </button>
        </div>
        <div className="flex flex-1 items-center justify-between px-2">
          <div
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
          </div>

          <div className="flex items-center gap-3 mr-4">
            <button
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
            </button>
            <button
              type="button"
              className="flex items-center p-1.5 rounded-full gap-2.5 cursor-pointer bg-slate-200 text-indigo-700 hover:bg-indigo-800 hover:text-white transition-colors duration-300"
            >
              <img
                src={userIcon}
                alt="User Icon"
                className="w-[34px] h-[34px]"
              />
              <IconSettings className="size-6" />
            </button>
          </div>
        </div>
      </header>

      <nav
        className={clsx(
          expand ? "w-64" : "w-20",
          "fixed inset-0 left-0 p-2 overflow-y-scroll before:flex before:flex-col before:h-[84px] z-40 bg-white transition-all duration-300"
        )}
      >
        <ul
          className={clsx(
            "gap-1 flex flex-col transition-all duration-300 text-sm font-medium pe-2.5",
            expand ? "pl-2" : ""
          )}
        >
          {navs.map((group, _group) => (
            <li
              key={_group}
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
                <span className="truncate">{group.groupName}</span>
              </div>
              <ul className="gap-1 flex flex-col">
                {group.menu.map((menu, _menu) => {
                  const isActive = _group === 0 && _menu === 1;

                  return (
                    <li key={_menu}>
                      <a
                        href="#"
                        className={clsx(
                          "w-full flex p-3 items-center justify-between overflow-hidden rounded-md hover:bg-slate-200 hover:text-indigo-700",
                          isActive
                            ? "bg-slate-200 text-indigo-700"
                            : "text-gray-600"
                        )}
                      >
                        <div className="flex items-center gap-3.5">
                          <menu.Icon className="size-6 shrink-0" />
                          <span className="truncate">menu</span>
                        </div>
                        <IconChevronDown className="size-4" />
                      </a>
                      {menu.menu && (
                        <ul className="gap-1 flex flex-col border-s border-s-slate-300 ms-6 mt-1">
                          {menu.menu.map((_, _sub) => (
                            <li key={_sub}>
                              <a
                                href="#"
                                className="w-full flex p-3 items-center gap-2 text-gray-600 hover:text-indigo-700"
                              >
                                <IconCircle className="size-2.5 shrink-0" />
                                <span className="truncate">sub menu</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
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
              <div className="flex flex-col flex-1 gap-5">
                <div className="grid grid-cols-3 gap-5">
                  {Array.from({ length: 3 }, (_, k) => (
                    <div
                      key={k}
                      className={clsx(
                        "relative p-5 bg-indigo-700 rounded-md overflow-hidden",
                        "before:content-[''] before:absolute before:w-[210px] before:h-[210px] before:bg-indigo-800/40 before:rounded-full before:top-[-125px] before:right-[-15px] before:z-0",
                        "after:content-[''] after:absolute after:w-[210px] after:h-[210px] after:bg-indigo-800 after:rounded-full after:top-[-85px] after:right-[-95px] after:z-0"
                      )}
                    >
                      <div className="flex justify-between relative z-10">
                        <div className="flex flex-col gap-5">
                          <div className="flex">
                            <button
                              type="button"
                              className="rounded-md aspect-square p-2 cursor-pointer bg-indigo-800 text-white hover:bg-indigo-900 transition-colors duration-300"
                            >
                              <IconTransfer className="size-6" />
                            </button>
                          </div>

                          <span className="text-4xl text-white">$500.00</span>
                        </div>
                        <div className="flex flex-col">
                          <button
                            type="button"
                            className="rounded-md aspect-square p-2 cursor-pointer bg-indigo-700 text-white hover:bg-indigo-900 transition-colors duration-300"
                          >
                            <IconTransfer className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-md p-5">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Dolorum quia cumque beatae minus aliquam adipisci voluptatum
                  alias totam dolore, placeat doloribus voluptatem illo cum
                  facilis corrupti debitis explicabo architecto repellendus.
                </div>

                <div className="bg-white rounded-md overflow-hidden flex flex-col">
                  <div className="p-5">
                    <span className="font-medium">Sticky Header</span>
                  </div>
                  <div className="max-h-[70vh] overflow-y-scroll">
                    <table className="w-full sticky-header-table text-center">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>ISO Code</th>
                          <th>Population</th>
                          <th>Size (km²)</th>
                          <th>Density</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 30 }, (_, k) => (
                          <tr key={k}>
                            <td>Name</td>
                            <td>ISO Code</td>
                            <td>Population</td>
                            <td>Size (km²)</td>
                            <td>Density</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-5 flex items-center justify-end">
                    <div className="flex items-center">
                      <span>Rows per page</span>
                    </div>
                  </div>
                </div>
              </div>

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
};

export default Layout;
