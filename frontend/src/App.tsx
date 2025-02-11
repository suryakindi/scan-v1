import { Description, Field, Input, Label } from "@headlessui/react";
import { FC } from "react";

const Dot: FC<{ stroke?: "black" | "white" }> = ({ stroke = "black" }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 mr-1"
    >
      <circle
        cx="12"
        cy="12"
        r="6"
        stroke={stroke}
        strokeWidth="3"
        fill="none"
      />
    </svg>
  );
};

const App: FC = () => {
  const menus = Array.from({ length: 10 }, (_, x) => ({
    name: `Menu ${x + 1}`,
    sub: Array.from({ length: 7 }, (_, y) => ({ name: `Sub ${y + 1}` })),
  }));

  return (
    <div className="flex w-full h-screen">
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
          <ul className="relative py-1">
            {menus.map((menu, x) => (
              <li key={x} className="my-1">
                <a
                  href="#"
                  className={`flex items-center justify-between mx-3 px-4 py-2 rounded-md font-medium ${
                    x === 0 ? "bg-gray-200" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <span className="ti-home mr-1.5"></span>
                    <span>{menu.name}</span>
                  </div>
                  <span className="ti-angle-right"></span>
                </a>
                <ul>
                  {menu.sub.map((sub, y) => (
                    <li key={y} className="my-1">
                      <a
                        href="#"
                        className={`flex items-center mx-3 px-4 py-2 rounded-md font-medium ${
                          y === 2 && x === 0
                            ? "bg-pink-600 text-white hover:bg-pink-600"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <Dot stroke={y === 2 && x === 0 ? "white" : "black"} />
                        <span>{sub.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="pl-64 before:block before:h-20">
        <div className="fixed top-0 right-0 w-[calc(100%-16rem)] pt-4 backdrop-blur-md">
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
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-md shadow-gray-200 shadow-md p-4">
                <Field>
                  <Label className="text-sm/6 font-medium">Name</Label>
                  <Description className="text-sm/6">
                    Use your real name so people will recognize you.
                  </Description>
                  <Input
                    className="mt-3 block w-full rounded-md py-1.5 px-3 text-sm/6 bg-gray-50 outline-1 outline-gray-200 focus:outline-indigo-400"
                  />
                </Field>
              </div>
              <div className="bg-white rounded-md shadow-gray-200 shadow-md p-4">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Iusto tempore eligendi libero qui rem autem laboriosam
                  sapiente quisquam labore culpa cupiditate voluptates ipsam
                  facilis aliquam, unde sequi doloremque dicta quam.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-md shadow-gray-200 shadow-md p-4">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto
                tempore eligendi libero qui rem autem laboriosam sapiente
                quisquam labore culpa cupiditate voluptates ipsam facilis
                aliquam, unde sequi doloremque dicta quam.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
