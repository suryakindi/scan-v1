import {
  IconChevronLeft,
  IconChevronRight,
  IconTransfer,
} from "@tabler/icons-react";
import clsx from "clsx";
import { FC } from "react";
import Select, { components } from "react-select";

const options: { label: string; value: string }[] = [
  { label: "Chocolate Cake", value: "chocolate_cake" },
  { label: "Vanilla Ice Cream", value: "vanilla_ice_cream" },
  { label: "Strawberry Cheesecake", value: "strawberry_cheesecake" },
  { label: "Apple Pie", value: "apple_pie" },
  { label: "Tiramisu", value: "tiramisu" },
  { label: "Panna Cotta", value: "panna_cotta" },
  { label: "Crème Brûlée", value: "creme_brulee" },
  { label: "Brownies", value: "brownies" },
  { label: "Macarons", value: "macarons" },
  { label: "Lemon Tart", value: "lemon_tart" },
  { label: "Banana Split", value: "banana_split" },
  { label: "Chocolate Mousse", value: "chocolate_mousse" },
  { label: "Churros", value: "churros" },
  { label: "Pavlova", value: "pavlova" },
  { label: "Baklava", value: "baklava" },
  { label: "Donuts", value: "donuts" },
  { label: "Cupcakes", value: "cupcakes" },
  { label: "Eclairs", value: "eclairs" },
  { label: "Fruit Parfait", value: "fruit_parfait" },
  { label: "Mango Sticky Rice", value: "mango_sticky_rice" },
];

const Example: FC = () => {
  return (
    <div className="flex flex-col flex-1 gap-5">
      <div className="grid grid-cols-3 gap-5">
        {Array.from({ length: 3 }, (_, k) => (
          <div
            key={k}
            className={clsx(
              "relative p-5 bg-indigo-700 rounded-md overflow-hidden",
              "before:content-[''] before:absolute before:w-[210px] before:h-[210px] before:bg-indigo-800/40 before:rounded-full before:top-[-125px] before:right-[-15px] before:z-0",
              "after:content-[''] after:absolute after:w-[210px] after:h-[210px] after:bg-indigo-800 after:rounded-full after:top-[-85px] after:right-[-95px] after:z-0",
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
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolorum quia
        cumque beatae minus aliquam adipisci voluptatum alias totam dolore,
        placeat doloribus voluptatem illo cum facilis corrupti debitis explicabo
        architecto repellendus.
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
          <div className="flex items-center gap-5">
            <span>Rows per page</span>
            <select>
              {[10, 25, 100].map((i) => (
                <option value={i} key={i}>
                  {i}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="cursor-pointer hover:bg-slate-200 p-2 flex items-center justify-center rounded-full"
              >
                <IconChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                className="cursor-pointer hover:bg-slate-200 p-2 flex items-center justify-center rounded-full"
              >
                <IconChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md grid grid-cols-4 p-5 auto-rows-min gap-5">
        <div className="relative h-fit">
          <input
            type="text"
            id="floating_outlined"
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border-1 placeholder-shown:border-gray-400 appearance-none focus:outline-none peer hover:border-black focus:hover:border-indigo-700 focus:border-indigo-700 focus:ring focus:ring-inset focus:ring-indigo-700"
            placeholder=""
          />
          <label
            htmlFor="floating_outlined"
            className="absolute text-sm peer-placeholder-shown:text-gray-400 duration-100 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-hover:text-black peer-focus:text-indigo-700 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
          >
            Floating outlined
          </label>
        </div>

        <Select
          className="w-full"
          options={options}
          isClearable
          components={{
            Input: ({ ...props }) => {
              return <components.Input {...props} className="peer" />;
            },
            ValueContainer: ({ children, ...props }) => {
              return (
                <components.ValueContainer {...props}>
                  <label
                    className={clsx(
                      props.hasValue
                        ? "scale-75 -translate-y-4 top-2 bg-white"
                        : "text-gray-400 scale-100 -translate-y-1/2 top-1/2",
                      "absolute text-sm duration-100 transform z-10 origin-[0] px-2 peer-focus:px-2 peer-hover:text-black peer-focus:text-indigo-700 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1",
                    )}
                  >
                    {props.selectProps.placeholder}
                  </label>
                  {children}
                </components.ValueContainer>
              );
            },
          }}
          placeholder="My Cool Label"
          menuPlacement="top"
        />
      </div>
    </div>
  );
};

export default Example;
