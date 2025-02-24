import { FC } from "react";
import { NavLink, Outlet } from "react-router";
import clsx from "clsx";

const Layout: FC = () => {
  const menus = [
    { to: "/", name: "Dashboard" },
    { to: "/pasien", name: "Pasien" },
    {
      to: "/bpjs",
      name: "BPJS",
      children: [
        { to: "/bpjs/kunjungan", name: "Kunjungan" },
        { to: "/bpjs/dokter", name: "Dokter" },
        { to: "/bpjs/hfis", name: "HFIS" },
        { to: "/bpjs/tindakan", name: "Tindakan" },
        { to: "/bpjs/prolanis", name: "Prolanis" },
      ],
    },
    { to: "/management-client", name: "Management Client" },
  ];

  return (
    <div className="flex w-screen h-screen">
      <div className="w-1/7 bg-indigo-700 text-white h-full overflow-y-auto">
        <ul>
          {menus.map((menu, _menu) => (
            <li key={_menu}>
              <NavLink
                to={menu.to}
                className={clsx(
                  "flex p-3 items-center",
                  _menu === 1 && "bg-indigo-600"
                )}
                onClick={(e) => menu.children && e.preventDefault()}
              >
                <span className="ti-layers mr-2"></span>
                <span className="font-semibold">{menu.name}</span>
              </NavLink>
              {menu.children && (
                <div className="bg-indigo-800">
                  <ul>
                    {menu.children.map((sub, _sub) => (
                      <li key={_sub}>
                        <NavLink to={sub.to} className="flex p-3 items-center">
                          <span className="ti-layers mr-2"></span>
                          <span>{sub.name}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-6/7 py-4 px-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
